import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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
