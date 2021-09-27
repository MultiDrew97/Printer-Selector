import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {email} from "../../scripts/regex";

@Component({
	templateUrl: '../../views/email.component.html',
	styleUrls: ['../../styles/email.component.css']
})
export class EmailDialogComponent {
	emailAddress: string = '';
	valid: boolean = false;

	constructor(private dialogRef: MatDialogRef<EmailDialogComponent>,
				@Inject(MAT_DIALOG_DATA) data: any) {
	}

	verifyEmail() {
		this.valid = email.test(this.emailAddress)
	}

	finished() {
		this.dialogRef.close(this.emailAddress);
	}

	cancel() {
		this.dialogRef.close();
	}
}
