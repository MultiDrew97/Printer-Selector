/*
import {Component, Inject, OnInit} from "@angular/core";
import {Location, Printer} from "../../scripts/models";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
	templateUrl: '../../views/edit-location.component.html',
	styleUrls: ['../../styles/edit-location.component.css']
})
export class EditLocationDialogComponent implements OnInit {
	location: Location;
	printers: Printer[];
	locationName: string;

	valid: boolean = true;

	buttons = {
		close: 'Cancel',
		finished: 'Update'
	}

	prompts = {
		locationName: 'Location Name:',
		locationID: 'Location ID:',
		locationPrinters: 'Printers:'
	}
	constructor(private dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) readonly data: any) {
		this.location = this.data.location;
		this.locationName = this.data.location.getDisplayName();
		this.printers = this.data.printers;
	}

	ngOnInit() {
		setTimeout(() => {
			this.getPrinters();
		}, 1)
	}

	getPrinters() {
		for (const locationPrinter of this.location.printers) {
			for (const printer of this.printers) {
				if (locationPrinter._id === printer._id) {
					(document.getElementById(printer._id) as HTMLOptionElement).selected = true
				}
			}
		}
		/!*
		let printers = this.location.getPrinters()

		printers.forEach((printerID: string) => {
			for (let i = 0; i < this.printers.length; i++) {
				if (printerID === this.printers[i].getID()) {

				}
			}
		})*!/
	}

	close() {
		this.dialogRef.close();
	}

	finished() {
		if (this.valid) {
			this.dialogRef.close(this.location)
		}
	}

	validate() {
		let validName: boolean = this.validateName();

		if(!validName) {
			// location name error message
		} else {
			// valid name
		}

		this.valid = validName;
	}

	validateName(): boolean {
		return this.locationName.length > 0 && !/^\s+$/i.test(this.locationName)
	}
}
*/
