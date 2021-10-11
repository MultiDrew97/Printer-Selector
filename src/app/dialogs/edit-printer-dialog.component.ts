import {Component, Inject, OnInit} from "@angular/core";
import {Printer} from "../../scripts/models";
import {LocationDataSource} from "../../scripts/datasource";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {APIService} from "../services/api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
	templateUrl: '../../views/edit-printer.component.html',
	styleUrls: ['../../styles/edit-printer.component.css']
})
export class EditPrinterDialogComponent implements OnInit {
	printer!: Printer;
	/*printerName: string = '';
	pathName: string = '';*/
	locationID: string = '';
	oldLocation: string = '';
	lds!: LocationDataSource;
	editForm = new FormGroup({
		id: new FormControl(),
		displayName: new FormControl('', [Validators.required]),
		pathName: new FormControl('', [Validators.required]),
		location: new FormControl('')
	})

	valid: boolean = true

	buttons = {
		close: 'Cancel',
		finished: 'Update',
		delete: 'Remove'
	}

	prompts = {
		printerID: 'Printer ID:',
		printerName: 'Printer Display Name:',
		pathName: 'Printer Path Name:',
		locations: 'Printer Location:'
	}
	constructor(private dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) readonly data: any,
				private readonly api: APIService) {
	}

	ngOnInit() {
		this.printer = this.data.printer
		this.lds = new LocationDataSource(this.data.locations)
		this.getLocationID()
	}

	delete() {
		this.dialogRef.close({
			delete: true
		})
	}

	close() {
		this.dialogRef.close();
	}

	finished() {
		if(!this.valid) {
			return
		}

			/*this.printer.displayName = this.printer.displayName !== this.printerName ? this.printerName : this.printer.displayName;
			this.printer.pathName = this.printer.pathName !== this.pathName ? this.pathName : this.printer.pathName;*/

		let updated = {
			printer: this.printer,
			locationID: this.locationID
		}

		this.dialogRef.close(updated)
	}

	validate() {
		let validPath = this.validatePathName()
		let validDisplay = this.validateDisplayName()
		let validLocation = this.validateLocationID()

		console.debug(validPath)
		console.debug(validDisplay)
		console.debug(validLocation)

		this.valid = validPath && validDisplay && validLocation
	}

	validatePathName(): boolean {
		return this.printer.pathName.length > 0 && !/^\s+$/i.test(this.printer.pathName)
	}

	validateDisplayName(): boolean {
		return this.printer.displayName.length > 0 && !/^\s+$/i.test(this.printer.displayName)
	}

	validateLocationID(): boolean {
		return this.locationID.length > 0
	}

	getLocationID(): void {
		for (const location of this.lds.data) {
			if (location.printers.some(printer => printer._id === this.printer._id)) {
				this.locationID = location._id;
				this.oldLocation = this.locationID;
				break;
				// (document.getElementById(this.locations[i].getID()) as HTMLOptionElement).selected = true
				// return this.locations[i].getID();
			}
		}

		// return ''
	}
}
