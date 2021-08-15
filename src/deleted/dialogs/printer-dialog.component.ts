/*
import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Printer, Location} from "../../scripts/models";

@Component({
	templateUrl: '../../views/printer.component.html',
	styleUrls: ['../../styles/printer.component.css']
})
export class PrinterDialogComponent implements OnInit {
	newPrinter = {
		displayName: '',
		pathName: '',
		locationID: ''
	};
	printers: Printer[];
	locations: Location[];
	prompts = {
		displayName: 'Display Name:',
		pathName: 'Path Name (i.e. ADMIN-IT):',
		locationName: 'Which Location?'
	}

	buttons = {
		cancel: 'Cancel',
		confirm: 'Create Printer'
	}

	valid: boolean = false;

	constructor(readonly dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) readonly data: any) {
		this.printers = this.data.printers
		this.locations = this.data.locations
	}

	ngOnInit() {
	}

	close() {
		this.dialogRef.close()
	}

	finished() {
		this.dialogRef.close(this.newPrinter)
	}

	validate() {
		let validPath = this.validatePathName();
		let validDisplay = this.validateDisplay();
		let validLocation = this.validateLocation();

		// Check Path Name
		if (!validPath) {
			(document.getElementById('printerPath') as HTMLInputElement).setCustomValidity('You must enter a valid printer path (i.e New-Printer)')
		} else {
			(document.getElementById('printerPath') as HTMLInputElement).setCustomValidity('')
		}

		// Check the Display Name
		if (!validDisplay) {
			(document.getElementById('printerName') as HTMLInputElement).setCustomValidity('You must enter a valid printer display name (i.e New Printer)')
		} else {
			(document.getElementById('printerName') as HTMLInputElement).setCustomValidity('')
		}

		if (!validLocation) {
			(document.getElementById('locations') as HTMLInputElement).setCustomValidity('You must select a valid location')
		} else {
			(document.getElementById('locations') as HTMLInputElement).setCustomValidity('')
		}

		this.valid = validDisplay && validPath && validLocation;
	}

	validateDisplay(): boolean {
		return this.newPrinter.displayName.length > 0;
	}

	validatePathName(): boolean {
		return this.newPrinter.pathName.length > 0 && !this.newPrinter.pathName.includes(' ')
	}

	validateLocation(): boolean {
		return this.newPrinter.locationID.length > 0
	}
}
*/
