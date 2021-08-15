/*
import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Printer} from "../../scripts/models";

@Component({
	templateUrl: '../../views/location.component.html',
	styleUrls: ['../../styles/location.component.css']
})
export class LocationDialogComponent {
	locationName: string = '';
	valid: boolean = false;
	printers: Printer[];
	prompts = {
		printers: 'Printers for Location:',
		locationName: 'Location Name:'
	}

	buttons = {
		cancel: 'Cancel',
		confirm: 'Create Location'
	}

	constructor(readonly dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) readonly data: any) {
		this.printers = this.data.printers;
	}

	close() {
		this.dialogRef.close()
	}

	create() {
		let data = {
			locationName: this.locationName,
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
		return this.locationName.length > 0 && this.locationName !== '';
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
*/
