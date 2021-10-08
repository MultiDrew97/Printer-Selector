import {Component, Inject} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
		username: 'Username',
		password: 'Password'
	}

	invalidLogin: boolean = false

	loginForm = new FormGroup({
		username: new FormControl('1', [Validators.required]),
		password: new FormControl('1', [Validators.required])
	})

	constructor(private dialogRef: MatDialogRef<boolean>,
				@Inject('creds') private readonly creds: { user: string, pass: string }) {
	}

	login() {
		if (this.isValidLogin()) {
			this.invalidLogin = false;
			this.finished()
		} else {
			this.pass = ''
			this.invalidLogin = true
		}
	}

	close() {
		this.dialogRef.close(false)
	}

	finished() {
		this.dialogRef.close(true)
	}

	isValidLogin(): boolean {
		return this.isValidUsername() && this.isValidPassword()
	}

	isValidUsername(): boolean {
		return this.user.length > 0 && !/^\s+$/i.test(this.user) && this.user === this.creds.user
	}

	isValidPassword(): boolean {
		return this.pass.length > 0 && !/^\s+$/i.test(this.pass) && this.pass === this.creds.pass
	}
}
