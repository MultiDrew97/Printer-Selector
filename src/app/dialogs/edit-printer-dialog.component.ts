import {Component, Inject, OnInit} from "@angular/core";
import {Printer} from "../../scripts/models";
import {LocationDataSource} from "../../scripts/datasource";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {APIService} from "../services/api.service";

@Component({
	templateUrl: '../../views/edit-printer.component.html',
	styleUrls: ['../../styles/edit-printer.component.css']
})
export class EditPrinterDialogComponent implements OnInit {
	printer: Printer;
	printerName: string = '';
	pathName: string = '';
	locationID: string = '';
	oldLocation: string = '';
	lds!: LocationDataSource;

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
		this.printer = this.data.printer

		api.getLocations().subscribe(locations => {
			this.lds = new LocationDataSource(locations)
			this.getLocationID()
		})
	}

	ngOnInit() {
		this.printerName = this.printer.displayName
		this.pathName = this.printer.pathName

		/*setTimeout(() => {
			this.getLocationID()
		}, 1)*/
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
		if(this.valid) {

			this.printer.displayName = this.printer.displayName !== this.printerName ? this.printerName : this.printer.displayName;
			this.printer.pathName = this.printer.pathName !== this.pathName ? this.pathName : this.printer.pathName;

			let updated = {
				printer: this.printer,
				locationID: this.locationID
			}

			this.dialogRef.close(updated)
			/*this.printer.displayName = this.printerName
			this.printer.pathName = this.pathName
			if(this.locationID !== this.oldLocation) {
				let updated = {
					printer: [this.printer],
					newLocation: this.locationID
				}
				this.dialogRef.close(updated)
			} else {
				this.dialogRef.close(this.printer)
			}*/
		}
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
		return this.pathName.length > 0 && !/^\s+$/i.test(this.pathName)
	}

	validateDisplayName(): boolean {
		return this.printerName.length > 0 && !/^\s+$/i.test(this.printerName)
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
