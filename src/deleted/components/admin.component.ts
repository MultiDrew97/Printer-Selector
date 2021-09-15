/*
import {Component, OnInit} from "@angular/core";
import {APIService} from "../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {Location, Printer} from "../../scripts/models";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {PrinterDialogComponent} from "./printer-dialog.component";
import {LocationDialogComponent} from "./location-dialog.component";
import {toNumbers} from "@angular/compiler-cli/src/diagnostics/typescript_version";
import {EditPrinterDialogComponent} from "./edit-printer-dialog.component";
import {EditLocationDialogComponent} from "./edit-location-dialog.component";
import {CookiesService} from "../services/cookies.service";
import {LoginDialogComponent} from "./login-dialog.component";
import {Sorter} from '../../scripts/utils'
import {SortColumn, SortOrder} from "../../scripts/enums";

@Component({
	templateUrl: '../../views/admin.component.html',
	styleUrls: ['../../styles/admin.component.css']
})
export class AdminComponent implements OnInit {
	title: string = 'Admin Portal'
	currentTab: number = 0
	printers: Printer[] = [] as Printer[]
	locations: Location[] = [] as Location[]
	authorized: boolean = false;
	printerSort: SortOrder = SortOrder.NORMAL
	locationSort: SortOrder = SortOrder.NORMAL
	currentPrinterColumn: SortColumn = SortColumn.DISPLAY

	tabs = {
		printer: 0,
		location: 1
	}

	prompts = {
		unauthHeader: 'Unauthorized',
		unauthSubHeader: "You currently don't have permission to access this page"
	}

	config: MatDialogConfig;

	constructor(private readonly api: APIService,
				private readonly route: ActivatedRoute,
				private readonly dialog: MatDialog,
				readonly cookies: CookiesService) {
		this.config = new MatDialogConfig();
		this.config.disableClose = true;
		this.config.width = 'auto';
		this.config.height = 'auto';
	}

	ngOnInit(): void {
		this.toggleActive(document.getElementById(`tab-${this.currentTab}`)!);

		for (const printer of this.route.snapshot.data.printers) {
			this.printers.push(printer)
		}

		for (const location of this.route.snapshot.data.locations) {
			this.locations.push(location)
		}

		this.sortArrays();

		this.checkAuth();
	}

	clearActive() {
		let buttons = document.getElementsByClassName('tab-button')
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].classList.remove('active')
		}
	}

	performToggle(tab: HTMLButtonElement): boolean {
		let tabIndex: number = toNumbers(tab.value)[0]

		return tabIndex === this.currentTab && !tab.classList.contains('active') //) {
			/!*this.toggleActive(tab)
		}*!/

		/!*this.changeTab(tabIndex)*!/
	}

	toggleActive(button: HTMLElement) {
		// let button = target as HTMLElement

		// If the tab is the current tab, set active and don't change unless switching to different tab
		button.classList.toggle('active')
	}

	addPrinter() {
		this.config.data = {
			printers: this.printers,
			locations: this.locations
		}

		this.openDialog('p').afterClosed().subscribe((newPrinter: Printer) => {
			console.debug(newPrinter)
		})
	}

	addLocation() {
		this.config.data = {
			printers: this.printers,
			locations: this.locations
		}

		this.openDialog('l').afterClosed().subscribe((newLocation: Location) => {
			console.debug(newLocation)
			// TODO: Implement adding locations
		})
	}

	changeTab(index: number) {
		// Change the selection of the admin portal to manage printers or locations
		this.currentTab = index === this.currentTab ? this.currentTab : index;
	}

	change(target: EventTarget) {
		let tab = target as HTMLButtonElement;
		this.clearActive()
		this.changeTab(toNumbers(tab.value)[0])

		if (this.performToggle(tab)) {
			this.toggleActive(tab)
		}
	}

	openDialog(param: string): MatDialogRef<any> {
		let ref: MatDialogRef<any>;

		switch (param) {
			case 'l':
				// Add new location
				ref = this.dialog.open(LocationDialogComponent, this.config);
				break;
			case 'p':
				// Add new printer
				ref = this.dialog.open(PrinterDialogComponent, this.config);
				break;
			case 'ep':
				// Edit a printer's information
				ref = this.dialog.open(EditPrinterDialogComponent, this.config);
				break;
			case 'el':
				// Edit a location's information
				ref = this.dialog.open(EditLocationDialogComponent, this.config);
				break;
			case 'a':
				ref = this.dialog.open(LoginDialogComponent, this.config)
		}

		// @ts-ignore
		return ref
	}

	editPrinter(printer: Printer): void {
		this.config.data = {
			printer: printer,
			locations: this.locations
		}

		this.openDialog('ep').afterClosed().subscribe(updated => {
			if (updated) {
				// Update printer and location information
				// TODO: Determine how to update a location's printer list
				//let newLocation: Location;

				/!*for (const location of this.locations) {
					if (location._id === updated.locationID) {
						newLocation = location;
						break;
					}
				}*!/

				// Update the printer list for the location and send to API
				// newLocation!.printers.push(updated.printer)

				//this.api.updateLocation(newLocation!)

				// Update Printer information
				this.api.updatePrinter(updated.printer, updated.locationID).subscribe(_ => {
					alert('Printer updated successfully')
				}, error => {
					alert('Unable to update the printer')
					console.error(error)
				})
			}
		})
	}

	editLocation(location: Location): void {
		this.config.data = {
			location: location,
			printers: this.printers
		}

		this.openDialog('el').afterClosed().subscribe((updated: Location) => {
			// Send updated info to api/database
			// TODO: Run tests to make sure this works with/without sending printer IDs
			/!*let updatedLocation = {
				displayName: updated.displayName || location.displayName,
				printers: this.getPrinterIDs(updated.printers)
			}*!/
			if (updated) {
				this.api.updateLocation(updated).subscribe(_ => {
					alert('Location updated successfully')
				}, error => {
					alert('Unable to update the location')
					console.error(error)
				})
			}
		})
	}

	getPrinterIDs(printers: Printer[]): string[] {
		const IDs = [] as string[]
		for (const printer of printers) {
			if (printer.checked) {
				IDs.push(printer._id)
			}
		}

		return IDs
	}

	private sortArrays() {
		this.sortAllLocations(SortColumn.DISPLAY)

		this.sortAllPrinters(SortColumn.DISPLAY)
	}

	/!**
	 * Sort all the printers and store them in the printers variable
	 * @param column The column to sort on
	 *!/
	sortAllPrinters(column: SortColumn) {
		/!*
			TODO: Figure out how to determine what the current column is
				and adjust the sort order based on it
		 *!/
		if (column !== this.currentPrinterColumn) {
			// Sorting based on different column so set to normal sort order
			console.debug('Changing Columns')
			this.printerSort = SortOrder.NORMAL
			this.currentPrinterColumn = column
		} else {
			// Same column to sort on so flip sort order
			console.debug('Same Column')
			this.printerSort = this.printerSort === SortOrder.NORMAL ? SortOrder.REVERSED : SortOrder.NORMAL
		}

		console.debug(this.currentPrinterColumn)
		this.printers = Sorter.sort(this.printers, column, this.printerSort) as Printer[]
		/!*switch(column) {
			case SortColumn.DISPLAY:
				this.printers = Sorter.sortByDisplayName(this.printers, order) as Printer[];
				break;
			case SortColumn.PATH:
				this.printers = Sorter.sortByPathName(this.printers, order);
				break;
		}*!/
	}

	/!**
	 * Sort the given printers array based on the given column in the given sort order and return that sorted array
	 * @param printers The printers array to sort
	 * @param column The column to sort the array on
	 * @param order The order in which to sort the array
	 * @return The sorted printer array
	 *!/
	sortPrinters(printers: Printer[], column: SortColumn, order: SortOrder): Printer[] {
		return Sorter.sort(printers, column, order) as Printer[];
		/!*switch (column) {
			case SortColumn.DISPLAY:
				return Sorter.sort(printers, order);
			case SortColumn.PATH:
				return Sorter.sortByPathName(printers, order);
		}*!/
	}

	/!**
	 * Sort all the locations based on the given column and stores it in global locations variable
	 * @param column The column to sort on
	 *!/
	sortAllLocations(column?: SortColumn) {
		// TODO: Make this store per column not globally
		this.locationSort = this.locationSort === SortOrder.NORMAL ? SortOrder.REVERSED : SortOrder.NORMAL
		this.locations = Sorter.sort(this.locations, column ? column : SortColumn.DISPLAY, this.locationSort) as Location[]
		/!*switch(column) {
			case SortColumn.DISPLAY:
				this.locations = Sorter.sortByDisplayName(this.locations, this.locationSort) as Location[]
				break;
		}*!/
	}

	/!**
	 * Show the login prompt
	 *!/
	showLogin() {
		this.openDialog('a').afterClosed().subscribe((loggedIn: boolean) => {
			this.authorized = loggedIn
			this.cookies.set('authorized', this.authorized)
		})
	}

	/!**
	 * Check to see if the user is authorized to use the admin portal
	 *!/
	checkAuth() {
		let authorized = this.cookies.get('authorized')

		if (authorized !== 'true') {
			this.showLogin()
		} else {
			this.authorized = true;
		}
	}

	getSortColumn(column?: string): SortColumn {
		switch (column) {
			case 'path':
				return SortColumn.PATH
			default:
				return SortColumn.DISPLAY
		}
	}
}
*/
