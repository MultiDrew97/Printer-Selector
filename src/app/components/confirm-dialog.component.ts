import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

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
