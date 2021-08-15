import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Location, Printer} from "../../scripts/models";

@Component({
	templateUrl: '../../views/confirm.component.html',
	styleUrls: ['../../styles/confirm.component.css']
})
export class ConfirmDialogComponent implements OnInit {
	message: string = ''
	decline: string = 'No'
	accept: string = 'Yes'
	constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>,
				@Inject(MAT_DIALOG_DATA) private data: any) {
	}

	ngOnInit(): void {
		this.message = this.data.message
	}

	close(answer: boolean) {
		this.dialogRef.close(answer)
	}
}

@Component({
	templateUrl: '../../views/alert.component.html',
	styleUrls: ['../../styles/alert.component.css']
})
export class AlertDialogComponent implements OnInit {
	message: string = ''
	confirm: string = 'Ok'

	constructor(private dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA)private data: any) {}

	ngOnInit() {
		this.message = this.data.message
	}

	close() {
		this.dialogRef.close()
	}
}

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

@Component({
	templateUrl: '../../views/login.component.html',
	styleUrls: ['../../styles/login.component.css']
})
export class LoginDialogComponent {
	user: string = ''
	pass: string = ''
	buttons = {
		cancel: 'Cancel',
		login: 'Login'
	}

	prompts = {
		username: 'Username:',
		password: 'Password'
	}

	valid: boolean = false

	constructor(private dialogRef: MatDialogRef<boolean>, @Inject('creds') private readonly creds: { user: string, pass: string }) {
	}

	login() {
		if (this.user === this.creds.user && this.pass === this.creds.pass) {
			this.finished()
		}
	}

	close(){
		this.dialogRef.close(false)
	}

	finished() {
		this.dialogRef.close(true)
	}

	validate() {
		let validUser = this.validateUser();
		let validPass = this.validatePass();

		this.valid = validUser && validPass;
	}

	validateUser(): boolean {
		return this.user.length > 0 && !/^\s+$/i.test(this.user)
	}

	validatePass(): boolean {
		return this.pass.length > 0 && !/^\s+$/i.test(this.pass)
	}
}

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

@Component({
	templateUrl: '../../views/prompt.component.html'
})
export class PromptDialogComponent implements OnInit {
	reject: string = 'Cancel'
	confirm: string = 'Ok'
	value: string = ''
	message: string = '';

	constructor(private dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) readonly data: any) {	}

	ngOnInit() {
		this.message = this.data.message;
	}

	close() {
		this.dialogRef.close(this.value)
	}

	cancel() {
		this.dialogRef.close()
	}
}

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
		/*
		let printers = this.location.getPrinters()

		printers.forEach((printerID: string) => {
			for (let i = 0; i < this.printers.length; i++) {
				if (printerID === this.printers[i].getID()) {

				}
			}
		})*/
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

@Component({
	templateUrl: '../../views/edit-printer.component.html',
	styleUrls: ['../../styles/edit-printer.component.css']
})
export class EditPrinterDialogComponent implements OnInit {
	printer: Printer;
	locations: Location[]
	printerName: string = '';
	pathName: string = '';
	locationID: string = '';
	oldLocation: string = '';

	valid: boolean = true

	buttons = {
		close: 'Cancel',
		finished: 'Update'
	}

	prompts = {
		printerID: 'Printer ID:',
		printerName: 'Printer Display Name:',
		pathName: 'Printer Path Name:',
		locations: 'Printer Location:'
	}
	constructor(private dialogRef: MatDialogRef<any>,
				@Inject(MAT_DIALOG_DATA) readonly data: any) {
		this.printer = this.data.printer
		this.locations = this.data.locations
	}

	ngOnInit() {
		this.printerName = this.printer.displayName
		this.pathName = this.printer.pathName

		setTimeout(() => {
			this.getLocationID()
		}, 1)
	}

	close() {
		this.dialogRef.close();
	}

	finished() {
		if(this.valid) {
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
		for (const location of this.locations) {
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

@Component({
	templateUrl: '../../views/email.component.html',
	styleUrls: ['../../styles/email.component.css']
})
export class EmailDialogComponent {
	email: string = '';
	valid: boolean = false;
	emailPattern: RegExp = /[a-zA-Z0-9]\.*[a-zA-Z0-9]+@austingastro\.com/i;

	constructor(private dialogRef: MatDialogRef<EmailDialogComponent>,
				@Inject(MAT_DIALOG_DATA) data: any) {
	}

	verifyEmail() {
		this.valid = this.emailPattern.test(this.email)
	}

	finished() {
		this.dialogRef.close(this.email);
	}

	cancel() {
		this.dialogRef.close();
	}
}
