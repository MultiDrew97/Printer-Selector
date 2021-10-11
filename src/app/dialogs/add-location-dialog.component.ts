import {Component, Inject} from "@angular/core";
import {PrinterDataSource} from "../../scripts/datasource";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {APIService} from "../services/api.service";

@Component({
	templateUrl: '../../views/add-location.component.html',
	styleUrls: ['../../styles/add-location.component.css']
})
export class AddLocationDialogComponent {
	displayName: string = '';
	valid: boolean = false;
	pds!: PrinterDataSource;
	prompts = {
		printers: 'Printers for Location:',
		locationName: 'Location Name:'
	}

	buttons = {
		cancel: 'Cancel',
		confirm: 'Create Location'
	}

	constructor(readonly dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) readonly data: any,
				private readonly api: APIService) {

		api.getPrinters().then(printers => {
			this.pds = new PrinterDataSource(printers)
		})
	}

	close() {
		this.dialogRef.close()
	}

	create() {
		let data = {
			displayName: this.displayName,
			printers: this.getPrinters()
		}
		this.dialogRef.close(data);
	}

	validate() {
		let name: boolean = this.validateLocation();

		if (!name) {
			// Set error on input
			(document.getElementById('location') as HTMLInputElement).setCustomValidity("You must enter a value for the location's name");
		} else {
			// Clear error on input
			(document.getElementById('location') as HTMLInputElement).setCustomValidity('');
		}

		this.valid = name;
	}

	validateLocation(): boolean {
		return this.displayName.length > 0 && this.displayName !== '';
	}

	getPrinters(): string[] {
		let selected: string[] = [] as string[]
		let options = document.getElementsByClassName('printer') as HTMLCollectionOf<HTMLOptionElement>

		for (let i = 0; i < options.length; i++) {
			if (options[i].selected) {
				selected.push(options[i].value)
			}
		}

		return selected;
	}
}
