import {AfterViewInit, Component, Inject} from "@angular/core";
import {Location, Printer} from "../../scripts/models";
import {PrinterDataSource} from "../../scripts/datasource";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {APIService} from "../services/api.service";

@Component({
	templateUrl: '../../views/edit-location.component.html',
	styleUrls: ['../../styles/edit-location.component.css']
})
export class EditLocationDialogComponent implements AfterViewInit {
	location!: Location;
	locationName!: string;
	ipAddress!: string;
	changed: boolean = false;
	pds!: PrinterDataSource;
	newPrinters: string[] = [];
	valid: boolean = true;

	buttons = {
		close: 'Cancel',
		finished: 'Update',
		delete: 'Remove'
	}

	prompts = {
		locationName: 'Location Name:',
		locationID: 'Location ID:',
		locationPrinters: 'Printers:',
		ipAddress: 'IP Address:'
	}

	constructor(private dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) readonly data: any,
				private readonly api: APIService) {

		api.getLocation(data.id).subscribe(location => {
			this.location = location;
			this.locationName = location.displayName;
			this.ipAddress = location.ipAddress;
		})

		api.getPrinters().subscribe(printers => {
			this.pds = new PrinterDataSource(printers)
			this.getCurrentPrinters()
		})
	}

	ngAfterViewInit() {
		// this.getPrinters()
		/*setTimeout(() => {
			this.getPrinters();
		}, 1)*/
	}

	getCurrentPrinters() {
		for (const locationPrinter of this.location.printers) {
			this.newPrinters.push(locationPrinter._id)
		}
	}

	getPrinters(): Printer[] {
		let printerList: Printer[] = []

		for (const printer of this.pds.data) {
			for (const selected of this.newPrinters) {
				if (printer._id !== selected)
					continue

				printerList.push(printer)
			}
		}

		return printerList;
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
		if (this.valid && this.changed) {
			this.dialogRef.close({
				location: {
					_id: this.location._id,
					displayName: this.locationName,
					ipAddress: this.ipAddress,
					printers: this.getPrinters()
				}
			})
		} else {
			this.close();
		}
	}

	validate() {
		let validName: boolean = this.validateName();
		this.changed = true;

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
