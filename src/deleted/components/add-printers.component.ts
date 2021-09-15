/*
import {Component, OnInit} from '@angular/core';
import {Printer, Location} from '../../scripts/models';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {EmailDialogComponent} from "./email-dialog.component";
import {APIService} from "../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {ConfirmDialogComponent} from "./confirm-dialog.component";
import {AlertDialogComponent} from "./alert-dialog.component";

@Component({
	templateUrl: '../../views/add-printer.component.html',
	styleUrls: ['../../styles/add-printer.component.css']
})
export class AddPrintersComponent implements OnInit {
	printers: Printer[] = [];
	locations: Location[] = [];
	selectedPrinters: Printer[] = [];

	constructor(private dialog: MatDialog, readonly api: APIService, private route: ActivatedRoute) { }

	ngOnInit(): void {
		for (const printer of this.route.snapshot.data.printers) {
			this.printers.push(printer)
		}

		for (const location of this.route.snapshot.data.locations) {
			this.locations.push(location)
		}
	}

	changeCollapsible(target: EventTarget | null) {
		let button = target as HTMLElement;
		button.classList.toggle("active");
		let content: HTMLElement = button.nextElementSibling as HTMLElement;

		if (content.style.maxHeight) {
			content.style.maxHeight = '';
		} else {
			content.style.maxHeight = content!.scrollHeight + "px";
		}
	}

	selectAll(location: Location) {
		for (const printer of location.printers) {
			printer.checked = true
		}
	}

	deselectAll(location: Location) {
		for (const printer of location.printers) {
			printer.checked = false;
		}
	}

	clearSelection() {
		for (const location of this.locations) {
			for (const printer of location.printers) {
				printer.checked = false
			}
		}
	}

	sendSelected() {
		this.getPrinters();

		if (this.selectedPrinters.length === 0) {
			this.alert('You must select at least 1 printer.')
		} else {
			let {confirmedPrinters, printerPaths} = this.parseConfirms()

			console.debug(confirmedPrinters)
			this.getEmail().afterClosed().subscribe((email?: string) => {
				if (email !== undefined) {
					this.confirm(`Is ${email} correct?`)?.afterClosed().subscribe((answer: boolean) => {
						if (answer) {
							this.confirm(`Is this the right selection?\n${confirmedPrinters}`).afterClosed().subscribe((answer: boolean) => {
								if (answer) {
									// Send the printers list to the API to send the emails
									this.api.sendEmail(email, printerPaths).subscribe((returned: { status: number }) => {
										if (returned.status === 200) {
											this.alert('The list of selected printers has been sent.')
											this.clearSelection()
										}
									})
								} else {
									this.confirm('Clear Selection?').afterClosed().subscribe((answer: boolean) => {
										if (answer) {
											this.clearSelection()
										}
									})
								}
							})
						} else {
							this.confirm('Would you like to retry?')?.afterClosed().subscribe((answer: boolean) => {
								if (answer) {
									this.getEmail();
								}
							})
						}
					})
				}
			});

			/!*this.showDialog({
				templateUrl: '../../views/email.html',
				controller: 'EmailController'
			}).then(email => {
				// Store email and prompt to confirm the printers they want
				let confirm = dialog.confirm()
					.title('Confirm Selections')
					.html(`Are these the correct printers? ${confirmedPrinters}`)
					.ok('Yes, Send them')
					.cancel('No, Change Selections')

				this.showDialog(confirm).then(() => {
					// send the email to the provided email
					Utils.sendPrinters().then(() => {
						let alert = dialog.alert()
							.title('Email Sent')
							.textContent('The email should arrive shortly!')
							.clickOutsideToClose(true)
							.escapeToClose(true);

						this.showDialog(alert).then(r => {
						})
					}, () => {
						// User cancelled the email sending
					})
				}, () => {
					// Let them choose/remove printers as they need
				})
			}, () => {
				// Since they canceled, ask if they want to clear selections or not
				let clear = dialog.confirm()
					.title('Clear Selections?')
					.textContent('Would you like to clear your selections?')
					.ok('Yes')
					.cancel('No')

				this.showDialog(clear).then(() => {
					// Answered Yes, so clear all selected printers
					this.clearSelection()
				}, () => {
					// Do nothing as they said don't clear selection
				})
			})*!/
		}
	}

	getPrinters() {
		this.selectedPrinters = [] as Printer[]
		for (const data of this.locations) {
			for (const printer of data.printers) {
				if (printer.checked) {
					this.selectedPrinters.push(printer);
				}
			}
		}
	}

	openDialog(param: string, data?: object): MatDialogRef<any> {
		let config = new MatDialogConfig()
		config.disableClose = false;
		config.autoFocus = true;
		config.data = data;

		switch(param) {
			case 'e':
				return this.dialog.open(EmailDialogComponent, config)
			case 'c':
				return this.dialog.open(ConfirmDialogComponent, config)
			case 'a':
				return this.dialog.open(AlertDialogComponent, config)
			default:
				throw new Error('Unknown Param')
		}
	}

	/!*parseData() {
		for (const location of this.locations) {
			this.parsedData.push(Data.parse(location, this.printers))
		}
		this.locations.forEach( (location: Location) => {
			this.parsedData.push(Data.parse(location, this.printers))
		})
	}*!/

	getEmail() {
		return this.openDialog('e')
	}

	confirm(message: string) {
		return this.openDialog('c', {
			message: message
		})
	}

	alert(message: string) {
		return this.openDialog('a', {
			message: message
		})
	}

	parseConfirms(): {confirmedPrinters: string, printerPaths: string[]} {
		let confirmedPrinters: string = ''
		let printerPaths: string[] = [] as string[];

		this.selectedPrinters.forEach((printer, index, array) => {
			confirmedPrinters += (`${printer.displayName}`);
			printerPaths.push(printer.pathName);

			if (index < array.length - 1) {
				confirmedPrinters += ', ';
			}
		})

		return {
			confirmedPrinters: confirmedPrinters,
			printerPaths: printerPaths
		}
	}
}
*/
