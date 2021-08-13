import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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
