import {AfterViewInit, Component, Inject} from "@angular/core";
import {Location, Printer} from "../../scripts/models";
import {PrinterDataSource} from "../../scripts/datasource";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {APIService} from "../services/api.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ip} from "../../scripts/regex";

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
	valid: boolean = false;
	editForm = new FormGroup({
		name: new FormControl('', [Validators.required]),
		ip: new FormControl('', [Validators.required, Validators.pattern(ip)])
	})

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

		this.load(data.id).then(_ => {
			this.getCurrentPrinters()
		}, reason => {
			console.debug(reason)
		})
	}

	ngAfterViewInit() {

	}

	async load(id: string) {
		await this.loadLocation(id)
		await this.loadPrinters()
	}

	async loadLocation(id: string) {
		this.location = await this.api.getLocation(id).toPromise()
		this.locationName = this.location.displayName;
		this.ipAddress = this.location.ipAddress
	}

	async loadPrinters() {
		let printers = await this.api.getPrinters().toPromise()
		this.pds = new PrinterDataSource(printers)
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
		if (!this.changed) {
			this.close()
			return
		}

		if (this.valid) {
			this.dialogRef.close({
				location: {
					_id: this.location._id,
					displayName: this.locationName,
					ipAddress: this.ipAddress,
					printers: this.getPrinters()
				}
			})
		}
	}

	validate() {
		console.debug(this.editForm.errors);
		this.valid = false
	}

	validateIP() {
		this.validate()
	}
}
