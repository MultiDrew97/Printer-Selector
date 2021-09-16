import {Data, Help} from "./models";
import {SortColumn, SortOrder} from "./enums";
import {Buffer} from "buffer";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

/**
 * Format the given string using the arguments passed
 * @param formatString The string to use for the format
 * @param args The format arguments to use
 * @returns The formatted string
 */
export function format(formatString: string, ...args: any[]): string {
	args.forEach((arg, index) => {
		formatString = formatString.replace(`{${index}}`, arg)
	})

	return formatString
}

/**
 * Sort an array of Data using the specified column in the specified order
 * @param data The array of data to sort
 * @param column The column to sort on
 * @param order The order to sort in
 * @returns The sorted data array
 */
export function sort(data: Data[], column: SortColumn, order: SortOrder): Data[] {
	return data.sort((a: Data, b: Data): number => {
		let value1: string
		let value2: string

		switch (column) {
			case SortColumn.DISPLAY:
				value1 = a.displayName.toLowerCase()
				value2 = b.displayName.toLowerCase()
				break;
			case SortColumn.PATH:
				value1 = a.pathName.toLowerCase()
				value2 = b.pathName.toLowerCase()
				break;
			case SortColumn.IP:
				value1 = a.ipAddress
				value2 = b.ipAddress
		}

		switch (order) {
			case SortOrder.NORMAL:
				return value1.localeCompare(value2)
			case SortOrder.REVERSED:
				return value2.localeCompare(value1)
		}
	})
}

/**
 * Encode the provided string to a base64 encoded string
 * @param value The string to be encoded
 * @return The encoded string
 */
export function encode(value: string): string {
	return Buffer.from(value, 'binary').toString('base64');
}

/**
 * Decode the provided string to normal text
 * @param value The value to be decoded
 * @return The decoded string
 */
export function decode(value: string): string {
	return Buffer.from(value, 'base64').toString('binary');
}

/**
 * Toggle the Collapsible passed
 * @param target The collapsible that is to be taggled
 */
export function toggleCollapse(target: EventTarget | null): void {
	let button = target as HTMLElement;
	button.classList.toggle("active");
	let content: HTMLElement = button.nextElementSibling as HTMLElement;

	if (content.style.maxHeight) {
		content.style.maxHeight = '';
	} else {
		content.style.maxHeight = '100%'/*content!.scrollHeight + "px"*/;
	}
}

/**
 * Checks if a linkID is contained in the list passed
 * @param list The list to check against
 * @param value The linkID to check for
 * @return Whether the linkID was found in the supplied list
 */
export function includedIn(list: Help[], value: string): boolean {
	for (const item of list) {
		if (item.linkID === value) {
			return true
		}
	}

	return false
}

/**
 * Clear all tab buttons so that none of them are set to active
 */
export function clearActive(buttons: HTMLCollectionOf<Element>) {
	for (let i = 0; i < buttons.length; i++) {
		buttons[i].classList.remove('active');
		/*let content: HTMLElement = buttons[i].nextElementSibling as HTMLElement;

		if (content.style.maxHeight) {
			content.style.maxHeight = '';
		} else {
			content.style.maxHeight = '100%'/!*content!.scrollHeight + "px"*!/;
		}*/
	}
}

/**
 * Convert a string to a number
 * @param value The string to convert
 */
export function toNumber(value: string): number {
	return Number(value)
}

/**
 * Opens a dialog using the given parameters
 * @param dialog The dialog reference to open a dialog with
 * @param config The config of the dialog to open
 * @param type The dialog component class to use to open a dialog of
 */
export function openDialog(dialog: MatDialog, config: MatDialogConfig, type: any) {
	return dialog.open(type, config).afterClosed().toPromise();
}

/**
 * Checks the IP Address of the current client machine
 * @param apiKey The api key for the api call
 */
export function checkIPAddress(apiKey: string) {
	function json(url: string) {
		return fetch(url).then(res => res.json())
	}

	return json(`https://api.ipdata.co?api-key=${apiKey}&fields=ip`).then((data) => {
		return data.ip
	})
}
