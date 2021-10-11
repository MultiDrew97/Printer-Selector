import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {email} from "../../scripts/regex";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
	templateUrl: '../../views/email.component.html',
	styleUrls: ['../../styles/email.component.css']
})
export class EmailDialogComponent {
	emailAddress: string = '';
	valid: boolean = false;
	changed = false;
	emailForm = new FormGroup({
		emailControl: new FormControl('', [Validators.required, Validators.pattern(email), Validators.email])
	})

	constructor(private dialogRef: MatDialogRef<EmailDialogComponent>,
				@Inject(MAT_DIALOG_DATA) data: any) {
	}

	verifyEmail() {
		let pattern = this.emailForm.hasError('pattern', 'emailControl')
		let required = this.emailForm.hasError('required', 'emailControl')
		let email = this.emailForm.hasError('email', 'emailControl')

		this.valid = !(pattern || required || email)
	}

	finished() {
		this.dialogRef.close(this.emailAddress);
	}

	cancel() {
		this.dialogRef.close();
	}
}
