import {Component, Inject, OnInit} from "@angular/core";
import {Printer} from "../../scripts/models";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {openDialog} from "../../scripts/utils";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {APIService} from "../services/api.service";
import {AlertDialogComponent} from "../dialogs/alert-dialog.component";
import {ConfirmDialogComponent} from "../dialogs/confirm-dialog.component";
import {EmailDialogComponent} from "../dialogs/email-dialog.component";

@Component({
	templateUrl: '../../views/get-printers.component.html',
	styleUrls: ['../../styles/get-printers.component.css']
})
export class GetPrintersComponent implements OnInit {
	selectedPrinters: Printer[] = [];
	currentLocation: number = 0;
	config: MatDialogConfig;

	constructor(private dialog: MatDialog, readonly api: APIService, readonly route: ActivatedRoute, @Inject('key') private readonly apiKey: string) {
		this.config = new MatDialogConfig()
		this.config.disableClose = false;
		this.config.autoFocus = true;

		//this.locations = this.route.snapshot.data.locations
	}

	ngOnInit(): void {
		// TODO: Use this to get the IP Address of the computer and use for auto selecting locations
		/*checkIPAddress(apiKey).then(ip => {
			this.determineTab(ip);
		})*/

		this.determineTab('209.170.229.86');
	}

	selectAll(index: number) {
		for (const printer of this.route.snapshot.data.locations[index].printers) {
			printer.checked = true
		}
	}

	deselectAll(index: number) {
		for (const printer of this.route.snapshot.data.locations[index].printers) {
			printer.checked = false;
		}
	}

	determineTab(ipAddress: string) {
		let count = 0;
		// TODO: Make a popup window to pick between the locations with shared WAN IP addresses?
		for (const [index, location] of this.route.snapshot.data.locations.entries()) {
			count += ipAddress === location.ipAddress ? 1 : 0;
			if (ipAddress === location.ipAddress) {
				// Use the location to set active tab
				this.currentLocation = index;
				break;
			}
		}
	}

	async clearSelection(fromHtml: boolean = false) {
		if (fromHtml && !(await this.showConfirm('Are you sure you want to clear selections?'))) {
			return
		}

		for (const location of this.route.snapshot.data.locations) {
			for (const printer of location.printers) {
				printer.checked = false
			}
		}
	}

	async sendSelected() {
		this.getPrinters();
		let retry = false, valid = false;

		if (this.selectedPrinters.length === 0) {
			this.showAlert('You must select at least 1 printer.')
		} else {
			let {confirmedPrinters, printerPaths} = this.parseConfirms()

			let email: string = await this.getEmail()

			// TODO: Find how to clean this up and optimize this a little bit
			if (email === '' || email === undefined) {
				if (await this.showConfirm('Would you like to retry entering your email address?')) {
					retry = true
				}
			} else if (!await this.showConfirm(`Is ${email} correct?`)) {
				if (await this.showConfirm('Would you like to retry?')) {
					retry = true
				}
			} else {
				valid = true;
			}

			if (valid) {
				if (await this.showConfirm(`Is this the right selection?<br/>${confirmedPrinters}`)) {
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
			}

			if (retry) {
				// TODO: Clean this area up to be more efficient instead of using recursion
				await this.sendSelected()
			}
		}
	}

	getPrinters() {
		this.selectedPrinters = [] as Printer[]
		for (const data of this.route.snapshot.data.locations) {
			for (const printer of data.printers) {
				if (printer.checked) {
					this.selectedPrinters.push(printer);
				}
			}
		}
	}

	getEmail(): Promise<string> {
		this.config.minWidth = '40vw'
		this.config.maxWidth = '50vw'
		this.config.minHeight = '30vh'
		this.config.maxHeight = '80vh'

		return openDialog(this.dialog, this.config, EmailDialogComponent)
	}

	showConfirm(message: string): Promise<boolean> {
		this.config.minWidth = '10vw'
		this.config.maxWidth = '20vw'
		this.config.minHeight = '30vh'
		this.config.maxHeight = '50vh'
		this.config.data = {
			message: message
		}

		return openDialog(this.dialog, this.config, ConfirmDialogComponent)
	}

	showAlert(message: string): void {
		this.config.minWidth = '25vw'
		this.config.maxWidth = '40vw'
		this.config.minHeight = '20vh'
		this.config.maxHeight = '30vh'

		this.config.data = {
			message: message
		}

		openDialog(this.dialog, this.config, AlertDialogComponent).then()
	}

	parseConfirms(): { confirmedPrinters: string, printerPaths: string[] } {
		let confirmedPrinters: string = ''
		let printerPaths: string[] = [] as string[];

		this.selectedPrinters.forEach((printer, index, array) => {
			confirmedPrinters += `${printer.displayName}`;
			printerPaths.push(printer.pathName);

			if (index < array.length - 1) {
				confirmedPrinters += '<br />';
			}
		})

		return {
			confirmedPrinters: confirmedPrinters,
			printerPaths: printerPaths
		}
	}

	tabChanged($event: MatTabChangeEvent) {
		this.deselectAll($event.index)
		this.currentLocation = $event.index
	}
}
