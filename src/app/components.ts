import {
	AfterContentInit,
	Component,
	EventEmitter,
	HostListener,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Output
} from "@angular/core";
import {FAQ, Image, Location, Printer, Tutorial} from "../scripts/models";
import {SortColumn, SortOrder, Tabs} from "../scripts/enums";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ActivatedRoute, Router} from "@angular/router";
import {openDialog, sort, toggleCollapse, toNumber} from "../scripts/utils";
import {
	AlertDialogComponent,
	ConfirmDialogComponent,
	EditLocationDialogComponent,
	EditPrinterDialogComponent,
	EmailDialogComponent,
	LocationDialogComponent,
	LoginDialogComponent,
	PrinterDialogComponent
} from "./dialogs";
import {APIService} from "./services";
import {Sort} from "@angular/material/sort";
import {LocationDataSource, PrinterDataSource} from "../scripts/datasource";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {CookieService} from "ngx-cookie-service";


@Component({
	templateUrl: '../views/admin.component.html',
	styleUrls: ['../styles/admin.component.css']
})
export class AdminComponent implements AfterContentInit, OnDestroy {
	title: string = 'Admin Portal'
	currentTab: number = Tabs.PRINTER
	authorized: boolean = false;
	filterText: string = ''
	pds!: PrinterDataSource;
	lds!: LocationDataSource;
	readonly s: Sort = {direction: 'asc', active: 'displayName'}

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
		this.config.width = 'auto';
		this.config.height = 'auto';

		this.api.getPrinters().subscribe(data => {
			this.pds = new PrinterDataSource(data)
			this.pds.filterPredicate = (data, filter) => (data.displayName.toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1 || data.pathName.toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1)
			this.sortPrinters(this.s)
		})

		this.api.getLocations().subscribe(data => {
			this.lds = new LocationDataSource(data)
			this.lds.filterPredicate = (data, filter): boolean => data.displayName.toLowerCase().indexOf(filter.trim().toLowerCase()) !== -1
			this.sortLocations(this.s)
		})

		// TODO: Remove when I finally understand reload vs close
		sessionStorage.setItem('reload', 'temp')
		localStorage.setItem('reload', 'temp')
	}

	ngAfterContentInit() {
		this.checkAuth()
		this.checkTab()
	}

	ngOnDestroy() {

	}

	/**
	 * Create a new printer
	 */
	addPrinter() {
		openDialog(this.dialog, this.config, PrinterDialogComponent).then((newPrinter: Printer) => {
			let retry: boolean = false

			if (!newPrinter) {
				return
			}

			do {
				this.api.addPrinter(newPrinter).subscribe(isSuccessful => {
					if (isSuccessful) {
						location.reload()
					} else {
						this.showConfirm('Failed to Add Location. Would you like to try adding it again?').then(res => {
							retry = res
						})
					}
				})
			} while (retry)
		})
	}

	/**
	 * Create a new location
	 */
	addLocation() {
		openDialog(this.dialog, this.config, LocationDialogComponent).then((newLocation: Location) => {
			console.debug(newLocation)

			let retry: boolean = false

			do {
				this.api.addLocation(newLocation).subscribe(isSuccessful => {
					if (isSuccessful) {
						location.search = `ct=${this.tabs.LOCATION}`
					} else {
						this.showConfirm('Failed to Add Location. Would you like to try adding it again?').then(res => {
							retry = res
						})
					}
				})
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
				this.api.deleteLocation(location._id).subscribe(async _ => {
					await this.showAlert(`${location.displayName} has been removed`)
				}, async error => {
					await this.showAlert(`Something went wrong removing ${location.displayName}. Please try again.`)
					console.error(error)
				})
			} else {
				if (await this.showConfirm(`Would you like to continue editing ${location.displayName}?`)) {
					await this.locationDialog(location)
				}
			}
			return
		}

		this.api.updateLocation(updatedLocation.location).subscribe(_ => {
			this.api.getLocations().subscribe(data => {
				this.lds.data = data
				this.sortLocations(this.s)
			})
			alert('Location updated successfully')
		}, error => {
			alert('Unable to update the location')
			console.error(error)
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
				this.api.deletePrinter(printer._id).subscribe(async _ => {
					await this.showAlert(`${printer.displayName} has been removed`)
				}, async error => {
					console.error(error)
					await this.showAlert(`Something went wrong removing ${printer.displayName}. Please try again.`)
				})
			} else {
				if (await this.showConfirm(`Would you like to continue editing ${printer.displayName}?`)) {
					await this.printerDialog(printer)
				}
			}

			return
		}

		this.api.updatePrinter(updatedPrinter.printer, updatedPrinter.locationID).subscribe(_ => {
			this.api.getPrinters().subscribe(data => {
				this.pds.data = data
				this.sortPrinters(this.s)
			})
			this.showAlert(`${printer.displayName} was updated successfully`)
		}, error => {
			this.showAlert('Unable to update the printer')
			console.error(error)
		})
	}

	/**
	 * Opens a dialog to edit the specified printer
	 * @param printer The printer to be edited
	 */
	private editPrinter(printer: Printer): Promise<any> {
		this.config.maxWidth = '50%';
		this.config.maxHeight = 'fit-content';
		this.config.data = {
			printer: printer
		}

		return openDialog(this.dialog, this.config, EditPrinterDialogComponent)
	}

	/**
	 * Opens a dialog box for editing the specified location
	 * @param location The location to be edited
	 */
	private editLocation(location: Location): Promise<any> {
		this.config.maxWidth = '50%';
		this.config.data = {
			location: location
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
		console.debug(this.authorized)
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
	 * Perform some clean up on the page, removing cookies and performing unsubscriptions
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
	sortPrinters(s: Sort) {
		let column = s.active === 'displayName' ? SortColumn.DISPLAY : SortColumn.PATH
		let order = (s.direction === '' || s.direction === 'asc') ? SortOrder.NORMAL : SortOrder.REVERSED;

		this.pds.data = sort(this.pds.data, column, order) as Printer[]
	}

	/**
	 * Sort the locations based on the sort parameters
	 * @param s {Sort} The sort parameters
	 */
	sortLocations(s: Sort) {
		let column = s.active === 'displayName' ? SortColumn.DISPLAY : SortColumn.IP
		let order = (s.direction === '' || s.direction === 'asc') ? SortOrder.NORMAL : SortOrder.REVERSED

		this.lds.data = sort(this.lds.data, column, order) as Location[]
	}
}

@Component({
	templateUrl: '../views/add-printer.component.html',
	styleUrls: ['../styles/add-printer.component.css']
})
export class AddPrintersComponent implements OnInit {
	locations: Location[] = [];
	selectedPrinters: Printer[] = [];
	currentLocation: number = 0
	config: MatDialogConfig
	ipAddress: string = ''

	constructor(private dialog: MatDialog, readonly api: APIService, private route: ActivatedRoute, @Inject('key') private readonly apiKey: string) {
		this.config = new MatDialogConfig()
		this.config.disableClose = false;
		this.config.autoFocus = true;

		// TODO: Use this to get the IP Address of the computer and use for auto selecting locations
		/*checkIPAddress(apiKey).then(ip => {
			console.debug(ip);
		})*/
	}

	ngOnInit(): void {
		for (const location of this.route.snapshot.data.locations) {
			this.locations.push(location)
		}
	}

	selectAll(location: Location) {
		for (const printer of location.printers) {
			printer.checked = true
		}
	}

	deselectAll(location: Location) {
		for (const printer of location.printers) {
			printer.checked = false;
		}
	}

	async clearSelection(fromHtml: boolean = false) {
		if (fromHtml && !(await this.showConfirm('Are you sure you want to clear selections?'))) {
			return
		}

		for (const location of this.locations) {
			for (const printer of location.printers) {
				printer.checked = false
			}
		}
	}

	async sendSelected() {
		this.getPrinters();

		if (this.selectedPrinters.length === 0) {
			this.showAlert('You must select at least 1 printer.')
		} else {
			let {confirmedPrinters, printerPaths} = this.parseConfirms()

			//let email: string = '';

			let email: string = await this.getEmail()

			console.debug(`Email: ${email || 'No Email Found'}`)

			// TODO: Find how to clean this up and optimize this a little bit
			if (email !== '') {
				if (await this.showConfirm(`Is ${email} correct?`)) {
					if (await this.showConfirm(`Is this the right selection?\n${confirmedPrinters}`)) {
						// Send the printers list to the API to send the emails
						this.api.sendEmail(email, printerPaths).subscribe((returned: { status: number }) => {
							if (returned.status === 200) {
								this.showAlert('The list of selected printers has been sent.')
								this.clearSelection()
							}
						})
					} else {
						// Clear Selection
						if (await this.showConfirm('Clear Selection?')) {
							await this.clearSelection()
						}
					}
				} else {
					// Retry email address
					if (await this.showConfirm('Would you like to retry?')) {
						await this.sendSelected()
					}
				}
			}
		}
	}

	getPrinters() {
		this.selectedPrinters = [] as Printer[]
		for (const data of this.locations) {
			for (const printer of data.printers) {
				if (printer.checked) {
					this.selectedPrinters.push(printer);
				}
			}
		}
	}

	/*async openDialog(type: any): Promise<any> {
		return this.dialog.open(type, this.config).afterClosed();
	}*/

	getEmail(): Promise<string> {
		//let email: string = ''

		return openDialog(this.dialog, this.config, EmailDialogComponent)

		//return email
	}

	showConfirm(message: string): Promise<boolean> {
		this.config.data = {
			message: message
		}

		return openDialog(this.dialog, this.config, ConfirmDialogComponent)
	}

	showAlert(message: string): void {
		this.config.data = {
			message: message
		}

		openDialog(this.dialog, this.config, AlertDialogComponent)
	}

	parseConfirms(): { confirmedPrinters: string, printerPaths: string[] } {
		let confirmedPrinters: string = ''
		let printerPaths: string[] = [] as string[];

		this.selectedPrinters.forEach((printer, index, array) => {
			confirmedPrinters += (`${printer.displayName}`);
			printerPaths.push(printer.pathName);

			if (index < array.length - 1) {
				confirmedPrinters += ', ';
			}
		})

		return {
			confirmedPrinters: confirmedPrinters,
			printerPaths: printerPaths
		}
	}

	tabChanged($event: MatTabChangeEvent) {
		this.deselectAll(this.locations[$event.index])
		this.currentLocation = $event.index
	}

	temp() {
		console.debug(this.currentLocation)
	}
}

@Component({
	templateUrl: '../views/main.component.html',
	styleUrls: ['../styles/main.component.css']
})
export class MainComponent {
	department: string = 'AGIT';
	header: string = 'Printer Installation';
	subheader: string = `Welcome to the ${this.department} ${this.header} Site.`;
}

@Component({
	selector: 'app-root',
	templateUrl: '../views/app.component.html',
	styleUrls: ['../styles/app.component.css']
})
export class AppComponent {
	department: string = 'AGIT'
}

@Component({
	templateUrl: '../views/help.component.html',
	styleUrls: ['../styles/help.component.css']
})
export class HelpComponent {
	header: string = "AGIT's Printer Help";
	subheader: string = "If you have any issues getting your printer(s) installed, refer to below";
	readonly base: string = '/help'

	toggle = toggleCollapse

	tutorials: Tutorial[] = [];
	faqs: FAQ[] = [];

	constructor(readonly api: APIService, readonly route: ActivatedRoute) {
		/*for (const tutorial of this.tutorials) {
			console.debug(tutorial)
		}*/

		for (const tutorial of this.route.snapshot.data.tutorials) {
			this.tutorials.push(tutorial)
		}

		for (const faq of this.route.snapshot.data.faqs) {
			this.faqs.push(faq)
		}
	}
}

@Component({
	selector: 'tutorials',
	templateUrl: '../views/tutorial.component.html',
	styleUrls: ['../styles/tutorial.component.css']
})
export class TutorialComponent {
	@Input()
	tutorials: Tutorial[] = [];

	@Input()
	base: string = '';

	@Input()
	imgs: Image[] = []

	@Output()
	toggleCollapse = new EventEmitter<EventTarget | null>()

	toggle(target: EventTarget | null) {
		// TODO: Figure out how to collapse an already open collapsible without hindering operations
		this.toggleCollapse.emit(target)
	}
}

@Component({
	selector: 'faqs',
	templateUrl: '../views/faq.component.html',
	styleUrls: ['../styles/faq.component.css']
})
export class FAQComponent {
	@Input()
	faqs: FAQ[] = [];

	@Input()
	base: string = '';

	@Input()
	imgs: Image[] = []

	@Output()
	toggleCollapse = new EventEmitter<EventTarget | null>()

	toggled = false;

	toggle(target: EventTarget | null) {
		// TODO: Figure out how to collapse an already open collapsible without hindering operations
		this.toggleCollapse.emit(target)
	}
}

@Component({
	selector: 'nav-root',
	templateUrl: '../views/nav.component.html'
})
export class NavComponent {
	links = [{
		link: '/home',
		text: 'Home'
	},
		{
			link: '/printers',
			text: 'Add Printers'
		},
		{
			link: '/help',
			text: 'Help'
		},
		{
			link: '/admin',
			text: 'Admin Portal'
		}]

	constructor(private readonly _: Router) {
	}
}
