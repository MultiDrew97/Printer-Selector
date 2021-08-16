import {Component, OnInit} from "@angular/core";
import {FAQ, Location, Printer, Tutorial} from "../scripts/models";
import {DialogSelection, SortColumn, SortOrder, Tabs} from "../scripts/enums";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {toNumbers} from "@angular/compiler-cli/src/diagnostics/typescript_version";
import {sort} from "../scripts/utils";
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
import {APIService, CookiesService} from "./services";

@Component({
	templateUrl: '../views/admin.component.html',
	styleUrls: ['../styles/admin.component.css']
})
export class AdminComponent implements OnInit {
	title: string = 'Admin Portal'
	currentTab: number = Tabs.PRINTER
	readonly printers: Printer[] = [] as Printer[]
	readonly locations: Location[] = [] as Location[]
	mutablePrinters: Printer[] = [] as Printer[]
	mutableLocations: Location[] = [] as Location[]
	authorized: boolean = false;
	printerSort: SortOrder = SortOrder.NORMAL
	locationSort: SortOrder = SortOrder.NORMAL
	currentPrinterColumn: SortColumn = SortColumn.DISPLAY
	filterText: string = ''
	filterColumn: SortColumn = SortColumn.DISPLAY

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
				readonly cookies: CookiesService) {
		this.config = new MatDialogConfig();
		this.config.disableClose = true;
		this.config.width = 'auto';
		this.config.height = 'auto';
	}

	ngOnInit(): void {
		this.toggleActive(document.getElementById(`tab-${this.currentTab}`)!);

		/*this.printers = this.route.snapshot.data.printers
		this.locations = this.route.snapshot.data.locations*/

		for (const printer of this.route.snapshot.data.printers) {
			this.printers.push(printer)
		}

		for (const location of this.route.snapshot.data.locations) {
			this.locations.push(location)
		}

		this.sortArrays();

		this.checkAuth();
	}

	/**
	 * Clear all tab buttons so that none of them are set to active
	 */
	clearActive() {
		let buttons = document.getElementsByClassName('tab-button')
		for (let i = 0; i < buttons.length; i++) {
			buttons[i].classList.remove('active')
		}
	}

	/**
	 * Checks if the tab should be toggled
	 * @param tab The tab to check
	 */
	performToggle(tab: HTMLButtonElement): boolean {
		let tabIndex: number = toNumbers(tab.value)[0]

		return tabIndex === this.currentTab && !tab.classList.contains('active') //) {
		/*this.toggleActive(tab)
	}*/

		/*this.changeTab(tabIndex)*/
	}

	/**
	 * Sets the specified button as active
	 * @param button The button to set active
	 */
	toggleActive(button: HTMLElement) {
		button.classList.toggle('active')
	}

	/**
	 * Create a new printer
	 */
	addPrinter() {
		this.config.data = {
			printers: this.printers,
			locations: this.locations
		}

		this.openDialog(DialogSelection.NEW_PRINTER).afterClosed().subscribe((newPrinter: Printer) => {
			console.debug(newPrinter)
			// TODO: Implement adding new printers
		})
	}

	/**
	 * Create a new location
	 */
	addLocation() {
		this.config.data = {
			printers: this.printers,
			locations: this.locations
		}

		this.openDialog(DialogSelection.NEW_LOCATION).afterClosed().subscribe((newLocation: Location) => {
			console.debug(newLocation)
			// TODO: Implement adding new locations
		})
	}

	/**
	 * Change the tab for the admin portal and clear the filter text if different tab
	 * @param index The tab that is being set as active
	 */
	changeTab(index: number) {
		this.filterText = index !== this.currentTab ? '' : this.filterText;
		this.currentTab = index === this.currentTab ? this.currentTab : index;
	}

	/**
	 * Handles changing the active tab
	 * @param target The button that was clicked for this to trigger
	 */
	change(target: EventTarget) {
		let tab = target as HTMLButtonElement;
		this.clearActive()
		this.changeTab(toNumbers(tab.value)[0])

		if (this.performToggle(tab)) {
			this.toggleActive(tab)
		}

		switch (this.currentTab) {
			case Tabs.PRINTER:
				break;
			case Tabs.LOCATION:
				this.filterColumn = SortColumn.DISPLAY
				break;
		}
	}

	/**
	 * Opens the dialog specified from the dialog selection enum
 	 * @param dialogSelection The dialog box to open
	 */
	openDialog(dialogSelection: DialogSelection): MatDialogRef<any> {
		let ref: MatDialogRef<any>;

		switch (dialogSelection) {
			case DialogSelection.NEW_LOCATION:
				// Add new location
				ref = this.dialog.open(LocationDialogComponent, this.config);
				break;
			case DialogSelection.NEW_PRINTER:
				// Add new printer
				ref = this.dialog.open(PrinterDialogComponent, this.config);
				break;
			case DialogSelection.EDIT_PRINTER:
				// Edit a printer's information
				ref = this.dialog.open(EditPrinterDialogComponent, this.config);
				break;
			case DialogSelection.EDIT_LOCATION:
				// Edit a location's information
				ref = this.dialog.open(EditLocationDialogComponent, this.config);
				break;
			case DialogSelection.LOGIN_PROMPT:
				ref = this.dialog.open(LoginDialogComponent, this.config)
				break;
		}

		// @ts-ignore
		return ref
	}

	/**
	 * Opens a dialog to edit the specified printer
	 * @param printer The printer to be edited
	 */
	editPrinter(printer: Printer): void {
		this.config.data = {
			printer: printer,
			locations: this.locations
		}

		this.openDialog(DialogSelection.EDIT_PRINTER).afterClosed().subscribe(updated => {
			if (updated) {
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

	/**
	 * Opens a dialog box for editing the specified location
	 * @param location The location to be edited
	 */
	editLocation(location: Location): void {
		this.config.data = {
			location: location,
			printers: this.printers
		}

		this.openDialog(DialogSelection.EDIT_LOCATION).afterClosed().subscribe((updated: Location) => {
			// TODO: Run tests to make sure this works with/without sending printer IDs
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

	/*getPrinterIDs(printers: Printer[]): string[] {
		const IDs = [] as string[]
		for (const printer of printers) {
			if (printer.checked) {
				IDs.push(printer._id)
			}
		}

		return IDs
	}*/

	/**
	 * Sort all the printers and store them in the printers variable
	 * @param column The column to sort on
	 */
	sortAllPrinters(column: SortColumn) {
		/*
			TODO: Figure out how to determine what the current column is
				and adjust the sort order based on it
		 */
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

		this.mutablePrinters = sort(this.printers, column, this.printerSort) as Printer[]
	}

	/**
	 * Sort the given printers array based on the given column in the given sort order and return that sorted array
	 * @param printers The printers array to sort
	 * @param column The column to sort the array on
	 * @param order The order in which to sort the array
	 * @return The sorted printer array
	 */
	sortPrinters(printers: Printer[], column: SortColumn, order: SortOrder): Printer[] {
		return sort(printers, column, order) as Printer[];
		/*switch (column) {
			case SortColumn.DISPLAY:
				return Sorter.sort(printers, order);
			case SortColumn.PATH:
				return Sorter.sortByPathName(printers, order);
		}*/
	}

	/**
	 * Sort all the locations based on the given column and stores it in global locations variable
	 * @param column The column to sort on
	 */
	sortAllLocations(column?: SortColumn) {
		// TODO: Make this store per column not globally
		this.locationSort = this.locationSort === SortOrder.NORMAL ? SortOrder.REVERSED : SortOrder.NORMAL
		this.mutableLocations = sort(this.locations, column ? column : SortColumn.DISPLAY, this.locationSort) as Location[]
		/*switch(column) {
			case SortColumn.DISPLAY:
				this.locations = Sorter.sortByDisplayName(this.locations, this.locationSort) as Location[]
				break;
		}*/
	}

	/**
	 * Show the login prompt
	 */
	showLogin() {
		this.openDialog(DialogSelection.LOGIN_PROMPT).afterClosed().subscribe((loggedIn: boolean) => {
			this.authorized = loggedIn
			this.cookies.set('authorized', this.authorized)
		})
	}

	/**
	 * Check to see if the user is authorized to use the admin portal
	 */
	checkAuth() {
		let authorized = this.cookies.get('authorized')

		if (authorized !== 'true') {
			this.showLogin()
		} else {
			this.authorized = true;
		}
	}

	/**
	 * Filter the tables based on the filter text and column
	 */
	filter() {
		switch (this.currentTab) {
			case Tabs.PRINTER:
				this.mutablePrinters = this.printers.filter((printer: Printer) => {
					return RegExp(`.*${this.filterText}.*`, 'i').test(printer[this.filterColumn])
				})
				break;
			case Tabs.LOCATION:
				this.mutableLocations = this.locations.filter((location: Location) => {
					return RegExp(`.*${this.filterText}.*`, 'i').test(location[this.filterColumn])
				})
		}
	}

	private sortArrays() {
		this.mutableLocations = sort(this.locations, SortColumn.DISPLAY, this.locationSort) as Location[]

		this.mutablePrinters = sort(this.printers, SortColumn.DISPLAY, this.printerSort) as Printer[]
	}
}

@Component({
	templateUrl: '../views/home.component.html',
	styleUrls: ['../styles/home.component.css']
})
export class AddPrintersComponent implements OnInit {
	printers: Printer[] = [];
	locations: Location[] = [];
	selectedPrinters: Printer[] = [];

	constructor(private dialog: MatDialog, readonly api: APIService, private route: ActivatedRoute) {
	}

	ngOnInit(): void {
		for (const printer of this.route.snapshot.data.printers) {
			this.printers.push(printer)
		}

		for (const location of this.route.snapshot.data.locations) {
			this.locations.push(location)
		}
	}

	changeCollapsible(target: EventTarget | null) {
		let button = target as HTMLElement;
		button.classList.toggle("active");
		let content: HTMLElement = button.nextElementSibling as HTMLElement;

		if (content.style.maxHeight) {
			content.style.maxHeight = '';
		} else {
			content.style.maxHeight = content!.scrollHeight + "px";
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

	clearSelection() {
		for (const location of this.locations) {
			for (const printer of location.printers) {
				printer.checked = false
			}
		}
	}

	sendSelected() {
		this.getPrinters();

		if (this.selectedPrinters.length === 0) {
			this.alert('You must select at least 1 printer.')
		} else {
			let {confirmedPrinters, printerPaths} = this.parseConfirms()

			console.debug(confirmedPrinters)
			this.getEmail().afterClosed().subscribe((email?: string) => {
				if (email !== undefined) {
					this.confirm(`Is ${email} correct?`)?.afterClosed().subscribe((answer: boolean) => {
						if (answer) {
							this.confirm(`Is this the right selection?\n${confirmedPrinters}`).afterClosed().subscribe((answer: boolean) => {
								if (answer) {
									// Send the printers list to the API to send the emails
									this.api.sendEmail(email, printerPaths).subscribe((returned: { status: number }) => {
										if (returned.status === 200) {
											this.alert('The list of selected printers has been sent.')
											this.clearSelection()
										}
									})
								} else {
									this.confirm('Clear Selection?').afterClosed().subscribe((answer: boolean) => {
										if (answer) {
											this.clearSelection()
										}
									})
								}
							})
						} else {
							this.confirm('Would you like to retry?')?.afterClosed().subscribe((answer: boolean) => {
								if (answer) {
									this.getEmail();
								}
							})
						}
					})
				}
			});

			/*this.showDialog({
				templateUrl: '../../views/email.html',
				controller: 'EmailController'
			}).then(email => {
				// Store email and prompt to confirm the printers they want
				let confirm = dialog.confirm()
					.title('Confirm Selections')
					.html(`Are these the correct printers? ${confirmedPrinters}`)
					.ok('Yes, Send them')
					.cancel('No, Change Selections')

				this.showDialog(confirm).then(() => {
					// send the email to the provided email
					Utils.sendPrinters().then(() => {
						let alert = dialog.alert()
							.title('Email Sent')
							.textContent('The email should arrive shortly!')
							.clickOutsideToClose(true)
							.escapeToClose(true);

						this.showDialog(alert).then(r => {
						})
					}, () => {
						// User cancelled the email sending
					})
				}, () => {
					// Let them choose/remove printers as they need
				})
			}, () => {
				// Since they canceled, ask if they want to clear selections or not
				let clear = dialog.confirm()
					.title('Clear Selections?')
					.textContent('Would you like to clear your selections?')
					.ok('Yes')
					.cancel('No')

				this.showDialog(clear).then(() => {
					// Answered Yes, so clear all selected printers
					this.clearSelection()
				}, () => {
					// Do nothing as they said don't clear selection
				})
			})*/
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

	openDialog(param: string, data?: object): MatDialogRef<any> {
		let config = new MatDialogConfig()
		config.disableClose = false;
		config.autoFocus = true;
		config.data = data;

		switch (param) {
			case 'e':
				return this.dialog.open(EmailDialogComponent, config)
			case 'c':
				return this.dialog.open(ConfirmDialogComponent, config)
			case 'a':
				return this.dialog.open(AlertDialogComponent, config)
			default:
				throw new Error('Unknown Param')
		}
	}

	/*parseData() {
		for (const location of this.locations) {
			this.parsedData.push(Data.parse(location, this.printers))
		}
		this.locations.forEach( (location: Location) => {
			this.parsedData.push(Data.parse(location, this.printers))
		})
	}*/

	getEmail() {
		return this.openDialog('e')
	}

	confirm(message: string) {
		return this.openDialog('c', {
			message: message
		})
	}

	alert(message: string) {
		return this.openDialog('a', {
			message: message
		})
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
}

@Component({
	templateUrl: '../views/faq.component.html',
	styleUrls: ['../styles/faq.component.css']
})
export class FAQComponent {
	header: string = "AGIT's Printer FAQ";
	subheader: string = "If you have any issues getting your printer(s) installed, refer to below";
	alts: { [key: string]: string } = {'run': 'The run box opened when pressing win + r'};

	// TODO: Make this a part of the database somehow?
	tutorials: Tutorial[] = [
		{
			_id: '',
			linkID: 'web',
			title: 'Web Access',
			description: "If you are accessing this from Outlook Web Access (OWA), then you won't be able to click the link like normal",
			steps: [
				'Press <code>Win + R</code><pre>This will open a Run box (shown below)</pre>',
				'Copy the link for the printer to install and paste in the box',
				'Press <code>Enter</code> to run the command to add the link'
			],
			imgs: [
				'run',
				'success'
			]
		}
	]

	faqs: FAQ[] = [
		{
			_id: '',
			linkID: 'nothing-happened',
			question: 'I clicked the link, and nothing happened',
			answer: "It's possible that the printer is already installed. To be sure, follow <a href='/faq/#web'>this</a> tutorial. If you still can't get it to install, email us at <a href='mailto:agit@austingastro.com?subject=Unable to Add Printer'>AGIT@AustinGastro.com</a>",
			imgs: []
		}
	]

}

@Component({
	templateUrl: '../views/main.component.html',
	styleUrls: ['../styles/main.component.css']
})
export class HomeComponent {
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
}
