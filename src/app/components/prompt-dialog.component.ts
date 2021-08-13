import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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
