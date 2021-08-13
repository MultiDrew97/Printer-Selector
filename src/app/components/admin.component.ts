import {Component, OnInit} from "@angular/core";
import {APIService} from "../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {Printer, Location} from "../../scripts/models";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {PrinterDialogComponent} from "./printer-dialog.component";
import {LocationDialogComponent} from "./location-dialog.component";
import {toNumbers} from "@angular/compiler-cli/src/diagnostics/typescript_version";
import {EditPrinterDialogComponent} from "./edit-printer-dialog.component";
import {EditLocationDialogComponent} from "./edit-location-dialog.component";
import {CookiesService} from "../services/cookies.service";
import {LoginDialogComponent} from "./login-dialog.component";

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
	}

	ngOnInit(): void {
		this.toggleActive(document.getElementById(`tab-${this.currentTab}`)!);

		this.config.disableClose = true;
		this.config.width = 'auto';
		this.config.height = 'auto';

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
			// TODO: Implement adding printers
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
			// TODO: Run tests to make sure this works with/without sending on printer IDs
			// TODO: Make sure this sends the IDs of the printers and not the Printer objects as the API expects strings
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
		this.locations = this.locations.sort((a: Location, b: Location): number => {
			let value1 = a.displayName.charCodeAt(0)
			let value2 = b.displayName.charCodeAt(0)

			return value1 - value2;
		})

		this.printers = this.printers.sort((a: Printer, b: Printer): number => {
			let value1 = a.displayName.charCodeAt(0)
			let value2 = b.displayName.charCodeAt(0)

			return value1 - value2
		})
	}

	showLogin() {
		this.openDialog('a').afterClosed().subscribe((loggedIn: boolean) => {
			this.authorized = loggedIn
			this.cookies.set('authorized', this.authorized)
		})
	}

	checkAuth() {
		let authorized = this.cookies.get('authorized')

		if (authorized !== 'true') {
			this.showLogin()
		} else {
			this.authorized = true;
		}
	}
}
