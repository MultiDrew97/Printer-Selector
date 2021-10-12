import {Component, Inject, OnInit} from "@angular/core";
import {Printer} from "../../scripts/models";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {format, openDialog} from "../../scripts/utils";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {APIService} from "../services/api.service";
import {AlertDialogComponent} from "../dialogs/alert-dialog.component";
import {ConfirmDialogComponent} from "../dialogs/confirm-dialog.component";
import {EmailDialogComponent} from "../dialogs/email-dialog.component";
import {BATCH_NAME, PRINTER_LOCATION, SCRIPT} from "../../scripts/constants";
import {saveAs} from 'file-saver';

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
	}

	ngOnInit(): void {
		// TODO: Use this to get the IP Address of the computer and use for auto selecting locations
		/*checkIPAddress(this.apiKey).then(ip => {
			this.determineTab(ip);
		})*/

		this.determineTab('209.170.229.86');
	}

	selectAll() {
		this.route.snapshot.data.locations[this.currentLocation].printers.map((printer: Printer) => {printer.checked = true})
	}

	deselectAll() {
		this.route.snapshot.data.locations[this.currentLocation].printers.map((printer: Printer) => {printer.checked = false})
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
		if (fromHtml && !(await this.showConfirm('Are you sure you want to clear selections?')))
			return

		this.deselectAll()
	}

	async sendSelected() {
		this.selectedPrinters = this.route.snapshot.data.locations[this.currentLocation].printers.filter((printer: Printer) => {return printer.checked})
		// let retry: boolean = false
		let clear: boolean = false;
		// let email: string = 'andrew.warren@austingastro.com';

		if (this.selectedPrinters.length === 0) {
			this.showAlert('You must select at least 1 printer.')
			return
		}

		/*// Try to get the email from the user
		TODO: Determine if using email or download batch file
		do {
			email = await this.getEmail()
			if (email !== undefined) {
				retry = !await this.showConfirm(`Is ${email} correct?`)
			} else {
				retry = await this.showConfirm('Would you like to retry?');
			}
		} while (email === undefined && retry)

		if (email === undefined)
			return

		let body = {
			email: email,
			printers: this.selectedPrinters.map((printer: Printer) => {return printer.pathName}),
			batch: this.generateBatch(email)
		}*/

		let printerNames = this.selectedPrinters.map((printer: Printer) => {return printer.displayName}).join(',<br />')

		if (await this.showConfirm(`Are these correct?<br/><br/>${printerNames}`)) {
			// Generate the batch file to add the printers
			this.generateBatch()
			/*
			// Send the printers list to the API to send the emails
			this.api.sendEmail(body).then((returned: { status: number }) => {
				if (returned.status === 200) {
					this.showAlert('The list of selected printers has been sent.')
					clear = true
				}
			})*/
		} else {
			clear = await this.showConfirm('Clear Selection?')
		}

		if (clear)
			// Clear Selection
			await this.clearSelection()
	}

	getEmail(): Promise<string> {
		this.config.minWidth = '30vw'
		this.config.maxWidth = '50vw'
		this.config.minHeight = '30vh'
		this.config.maxHeight = '80vh'

		return openDialog(this.dialog, this.config, EmailDialogComponent)
	}

	showConfirm(message: string): Promise<boolean> {
		this.config.minWidth = '10vw'
		this.config.maxWidth = '20vw'
		this.config.minHeight = '20vh'
		this.config.maxHeight = '50vh'
		this.config.data = {
			message: message
		}

		return openDialog(this.dialog, this.config, ConfirmDialogComponent)
	}

	showAlert(message: string): void {
		this.config.minWidth = '25vw'
		this.config.maxWidth = '40vw'
		this.config.minHeight = '15vh'
		this.config.maxHeight = '30vh'

		this.config.data = {
			message: message
		}

		openDialog(this.dialog, this.config, AlertDialogComponent).then()
	}

	tabChanged($event: MatTabChangeEvent) {
		this.deselectAll()
		this.currentLocation = $event.index
	}

	generateBatch() {
		let printers = this.selectedPrinters.map((printer: Printer) => {return format(PRINTER_LOCATION, printer.pathName)})
		let batch = new Blob([format(SCRIPT, printers)])
		saveAs(batch, BATCH_NAME)
	}
}
