import {Component, OnInit} from "@angular/core";
import {Location, Printer} from "../../scripts/models";
import {SortColumn, SortOrder} from "../../scripts/enums";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {toNumbers} from "@angular/compiler-cli/src/diagnostics/typescript_version";
import {Sorter} from "../../scripts/utils";
import {
	EditLocationDialogComponent,
	EditPrinterDialogComponent,
	LocationDialogComponent, LoginDialogComponent,
	PrinterDialogComponent, EmailDialogComponent, ConfirmDialogComponent, AlertDialogComponent
} from "./dialogs";
import {APIService, CookiesService} from "../services/services";

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
		/*this.toggleActive(tab)
	}*/

		/*this.changeTab(tabIndex)*/
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
			// TODO: Implement adding new printers
		})
	}

	addLocation() {
		this.config.data = {
			printers: this.printers,
			locations: this.locations
		}

		this.openDialog('l').afterClosed().subscribe((newLocation: Location) => {
			console.debug(newLocation)
			// TODO: Implement adding new locations
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

				/*for (const location of this.locations) {
					if (location._id === updated.locationID) {
						newLocation = location;
						break;
					}
				}*/

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
			/*let updatedLocation = {
				displayName: updated.displayName || location.displayName,
				printers: this.getPrinterIDs(updated.printers)
			}*/
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

		console.debug(this.currentPrinterColumn)
		this.printers = Sorter.sort(this.printers, column, this.printerSort) as Printer[]
		/*switch(column) {
			case SortColumn.DISPLAY:
				this.printers = Sorter.sortByDisplayName(this.printers, order) as Printer[];
				break;
			case SortColumn.PATH:
				this.printers = Sorter.sortByPathName(this.printers, order);
				break;
		}*/
	}

	/**
	 * Sort the given printers array based on the given column in the given sort order and return that sorted array
	 * @param printers The printers array to sort
	 * @param column The column to sort the array on
	 * @param order The order in which to sort the array
	 * @return The sorted printer array
	 */
	sortPrinters(printers: Printer[], column: SortColumn, order: SortOrder): Printer[] {
		return Sorter.sort(printers, column, order) as Printer[];
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
		this.locations = Sorter.sort(this.locations, column ? column : SortColumn.DISPLAY, this.locationSort) as Location[]
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
		this.openDialog('a').afterClosed().subscribe((loggedIn: boolean) => {
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

	getSortColumn(column?: string): SortColumn {
		switch (column) {
			case 'path':
				return SortColumn.PATH
			default:
				return SortColumn.DISPLAY
		}
	}
}

@Component({
	templateUrl: '../../views/home.component.html',
	styleUrls: ['../../styles/home.component.css']
})
export class AddPrintersComponent implements OnInit {
	printers: Printer[] = [];
	locations: Location[] = [];
	selectedPrinters: Printer[] = [];

	constructor(private dialog: MatDialog, readonly api: APIService, private route: ActivatedRoute) { }

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

		switch(param) {
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

	parseConfirms(): {confirmedPrinters: string, printerPaths: string[]} {
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
	templateUrl: '../../views/faq.component.html',
	styleUrls: ['../../styles/faq.component.css']
})
export class FAQComponent {
	header: string = "AGIT's Printer FAQ";
	subheader: string = "If you have any issues getting your printer(s) installed, refer to below";
	alts: {[key: string]: string} = {'run': 'The run box opened when pressing win + r'};

	// TODO: Make this a part of the database?
	tutorials = [
		{
			linkID: 'web',
			text: 'Web Access',
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

	faqs = [
		{
			linkID: 'nothing-happened',
			question: 'I clicked the link, and nothing happened',
			answer: "It's possible that the printer is already installed. To be sure, follow <a href='/faq/#web'>this</a> tutorial. If you still can't get it to install, email us at <a href='mailto:agit@austingastro.com?subject=Unable to Add Printer'>AGIT@AustinGastro.com</a>"
		}
	]

}

@Component({
	selector: 'app-root',
	templateUrl: '../../views/app.component.html',
	styleUrls: ['../../styles/app.component.css']
})
export class AppComponent {

}

@Component({
	templateUrl: '../../views/main.component.html',
	styleUrls: ['../../styles/main.component.css']
})
export class HomeComponent {
	department: string = 'AGIT';
	header: string = 'Printer Installation';
	subheader: string = `Welcome to the ${this.department} ${this.header} Site.`;
}
