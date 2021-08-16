import {Data} from "./models";
import {SortColumn, SortOrder} from "./enums";

/**
 * Format the given string using the arguments passed
 * @param formatString The string to use for the format
 * @param args The format arguments to use
 * @returns The formatted string
 */
export const format = (formatString: string, ...args: any[]): string => {
	args.forEach((arg, index) => {
		formatString = formatString.replace(`{${index}}`, arg)
	})
	/*for (let i = 0; i < args.length; i++) {
		formatString = formatString.replace(`{${i}}`, args[i])
	}*/

	return formatString
}

/**
 * Sort an array of Data using the specified column in the specified order
 * @param data The array of data to sort
 * @param column The column to sort on
 * @param order The order to sort in
 * @returns The sorted data array
 */
export const sort = (data: Data[], column: SortColumn, order: SortOrder): Data[] => {
	return data.sort((a: Data, b: Data): number => {
		let value1: string = a[column].toLowerCase();
		let value2: string = b[column].toLowerCase();

		switch (order) {
			case SortOrder.NORMAL:
				return value1.localeCompare(value2)
			//return value1 - value2
			case SortOrder.REVERSED:
				return value2.localeCompare(value1)
			//return value2 - value1
		}
	})
}
