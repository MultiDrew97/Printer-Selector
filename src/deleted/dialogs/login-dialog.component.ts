/*
import {Component, Inject} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";

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
*/
