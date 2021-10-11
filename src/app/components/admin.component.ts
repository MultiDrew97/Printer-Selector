import {AfterContentInit, Component, HostListener, OnInit} from "@angular/core";
import {SortColumn, SortOrder, Tabs} from "../../scripts/enums";
import {LocationDataSource, PrinterDataSource} from "../../scripts/datasource";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {openDialog, sort, toNumber} from "../../scripts/utils";
import {Location, Printer} from "../../scripts/models";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {Sort} from "@angular/material/sort";
import {APIService} from "../services/api.service";
import {AddPrinterDialogComponent} from "../dialogs/add-printer-dialog.component";
import {AddLocationDialogComponent} from "../dialogs/add-location-dialog.component";
import {EditPrinterDialogComponent} from "../dialogs/edit-printer-dialog.component";
import {AlertDialogComponent} from "../dialogs/alert-dialog.component";
import {LoginDialogComponent} from "../dialogs/login-dialog.component";
import {ConfirmDialogComponent} from "../dialogs/confirm-dialog.component";
import {EditLocationDialogComponent} from "../dialogs/edit-location-dialog.component";

@Component({
	templateUrl: '../../views/admin.component.html',
	styleUrls: ['../../styles/admin.component.css']
})
export class AdminComponent implements AfterContentInit, OnInit {
	title: string = 'Admin Portal'
	currentTab: number = Tabs.PRINTER
	authorized: boolean = false;
	filterText: string = ''
	pds!: PrinterDataSource;
	lds!: LocationDataSource;

	printerColumns = ['displayName', 'pathName']
	locationColumns = ['displayName', 'ipAddress']
	cookies = ['authorized', 'ct'];

	tabs = Tabs
	columns = SortColumn

	prompts = {
		unAuthHeader: 'Unauthorized',
		unAuthSubHeader: "You currently don't have permission to access this page"
	}

	config: MatDialogConfig;

	constructor(private readonly api: APIService,
				private readonly route: ActivatedRoute,
				private readonly dialog: MatDialog,
				readonly cookie: CookieService) {
		this.config = new MatDialogConfig();
		this.config.disableClose = true;
		this.config.width = '50vw';
		this.config.height = 'auto';

		this.pds = new PrinterDataSource(route.snapshot.data.printers)
		this.lds = new LocationDataSource(route.snapshot.data.locations)

		// TODO: Remove when I finally understand reload vs close
		sessionStorage.setItem('reload', 'temp')
		localStorage.setItem('reload', 'temp')
	}

	ngOnInit() {
		this.sortLocations()
		this.sortPrinters()
	}

	ngAfterContentInit() {
		this.checkAuth()
		this.checkTab()
	}

	/**
	 * Create a new printer
	 */
	addPrinter() {
		openDialog(this.dialog, this.config, AddPrinterDialogComponent).then(async (newPrinter: Printer) => {
			if (newPrinter === undefined)
				return

			let retry: boolean = false

			do {
				let isSuccessful = await this.api.addPrinter(newPrinter)

				if (isSuccessful) {
					location.reload()
				} else {
					retry = await this.showConfirm('Failed to Add Location. Would you like to try adding it again?')
				}
			} while (retry)
		})
	}

	/**
	 * Create a new location
	 */
	addLocation() {
		openDialog(this.dialog, this.config, AddLocationDialogComponent).then(async (newLocation: Location) => {
			if (newLocation === undefined)
				return

			let retry: boolean = false

			do {
				let isSuccessful = await this.api.addLocation(newLocation)

				if (isSuccessful) {
					location.search = `ct=${this.tabs.LOCATION}`
				} else {
					retry = await this.showConfirm('Failed to Add Location. Would you like to try adding it again?')
				}
			} while (retry)
		})
	}

	/**
	 * Handles opening the edit location dialog box and updating the information
	 * @param location The location to be updated
	 */
	async locationDialog(location: Location) {
		const updatedLocation = await this.editLocation(location)

		if (updatedLocation === undefined)
			return

		if (updatedLocation.delete) {
			if (await this.showConfirm(`Are you sure you want to delete ${location.displayName}?`)) {
				this.api.deleteLocation(location._id).then(async _ => {
					await this.showAlert(`${location.displayName} has been removed`)
				}, async reason => {
					await this.showAlert(`Something went wrong removing ${location.displayName}. Please try again.`)
					console.error(reason)
				})
			} else {
				if (await this.showConfirm(`Would you like to continue editing ${location.displayName}?`)) {
					await this.locationDialog(location)
				}
			}
			return
		}

		this.api.updateLocation(updatedLocation.location).then(_ => {
			this.api.getLocations().then(data => {
				this.lds.data = data
				this.sortLocations()
			})
			alert('Location updated successfully')
		}, reason => {
			alert('Unable to update the location')
			console.error(reason)
		})
	}

	/**
	 * Handles opening the edit printer dialog box and updating the information
	 * @param printer The printer to be updated
	 */
	async printerDialog(printer: Printer) {
		const updatedPrinter = await this.editPrinter(printer)

		if (updatedPrinter === undefined)
			return

		if (updatedPrinter.delete) {
			// Confirm printer deletion
			if (await this.showConfirm(`Are you sure you want to delete ${printer.displayName}?`)) {
				// Remove printer from database
				this.api.deletePrinter(printer._id).then(async _ => {
					await this.showAlert(`${printer.displayName} has been removed`)
				}, async reason => {
					console.error(reason)
					await this.showAlert(`Something went wrong removing ${printer.displayName}. Please try again.`)
				})
			} else {
				if (await this.showConfirm(`Would you like to continue editing ${printer.displayName}?`)) {
					await this.printerDialog(printer)
				}
			}

			return
		}

		this.api.updatePrinter(updatedPrinter.printer, updatedPrinter.locationID).then(_ => {
			this.api.getPrinters().then(data => {
				this.pds.data = data
				this.sortPrinters()
			})
			this.showAlert(`${printer.displayName} was updated successfully`)
		}, reason => {
			this.showAlert('Unable to update the printer')
			console.error(reason)
		})
	}

	/**
	 * Opens a dialog to edit the specified printer
	 * @param printer The printer to be edited
	 */
	private editPrinter(printer: Printer): Promise<any> {
		this.config.maxHeight = '90vh'
		this.config.data = {
			printer: printer,
			locations: this.lds.data
		}

		return openDialog(this.dialog, this.config, EditPrinterDialogComponent)
	}

	/**
	 * Opens a dialog box for editing the specified location
	 * @param location The location to be edited
	 */
	private editLocation(location: Location): Promise<any> {
		this.config.maxHeight = '90vh'
		this.config.data = {
			location: location,
			printers: this.pds.data
		}

		return openDialog(this.dialog, this.config, EditLocationDialogComponent)
	}

	/**
	 * Show the alert dialog box
	 * @param message The message to be displayed
	 */
	showAlert(message: string): Promise<void> {
		this.config.data = {
			message: message
		}

		return openDialog(this.dialog, this.config, AlertDialogComponent)
	}

	/**
	 * Show the login prompt
	 */
	showLogin() {
		this.config.minWidth = '25vw';
		this.config.maxWidth = '30vw';
		openDialog(this.dialog, this.config, LoginDialogComponent).then((loggedIn: boolean) => {
			this.authorized = loggedIn
			let date = new Date();
			const DAYS = 1
			date.setTime(date.getTime() + (DAYS * 24 * 60 * 60 * 1000));
			this.cookie.set('authorized', `${this.authorized}`, date, '/')
		})
	}

	/**
	 * Show the confirmation box with the specified message
	 * @param message The message to show in the box
	 * @return The dialog reference
	 */
	showConfirm(message: string): Promise<boolean> {
		this.config.data = {
			message: message
		}

		return openDialog(this.dialog, this.config, ConfirmDialogComponent);
	}

	/**
	 * Check to see if the user is authorized to use the admin portal
	 */
	checkAuth(): boolean {
		if (this.cookie.get('authorized') !== 'true') {
			this.showLogin()
			return false
		} else {
			this.authorized = true;
			return true
		}
	}

	tabChanged(event: MatTabChangeEvent) {
		this.cookie.set("ct", String(event.index));
		this.filterText = '';
	}

	checkTab() {
		if (this.cookie.get("ct")) {
			this.currentTab = toNumber(this.cookie.get("ct"))
		}
	}

	/**
	 * Perform some clean up on the page, removing cookies and unsubscribe
	 */
	@HostListener('window:beforeunload', ['$event'])
	cleanUp(_: BeforeUnloadEvent) {
		if (!sessionStorage.getItem('reload')) {
			for (const cookie of this.cookies) {
				this.cookie.delete(cookie)
			}
		} else {

		}
	}

	/**
	 * Sort the printers based on the sort parameters
	 * @param s {Sort} The sort parameters
	 */
	sortPrinters(s: Sort = {active: 'displayName', direction: 'asc'}) {
		let column = s.active === 'displayName' ? SortColumn.DISPLAY : SortColumn.PATH
		let order = (s.direction === '' || s.direction === 'asc') ? SortOrder.NORMAL : SortOrder.REVERSED;

		this.pds.data = sort(this.pds.data, column, order) as Printer[]
	}

	/**
	 * Sort the locations based on the sort parameters
	 * @param s {Sort} The sort parameters
	 */
	sortLocations(s: Sort = {active: 'displayName', direction: 'asc'}) {
		let column = s.active === 'displayName' ? SortColumn.DISPLAY : SortColumn.IP
		let order = (s.direction === '' || s.direction === 'asc') ? SortOrder.NORMAL : SortOrder.REVERSED

		this.lds.data = sort(this.lds.data, column, order) as Location[]
	}
}
