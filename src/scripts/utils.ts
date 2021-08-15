// import {Location, Printer} from "./models";
import {Data} from "@angular/router";
import {SortColumn, SortOrder} from "./enums";

export class Utils {
  /**
   * Format the given string using the arguments passed
   * @param formatString The string to use for the format
   * @param args The format arguments to use
   * @returns The formatted string
   */
  static format(formatString: string, ...args: any[]): string {
    for (let i = 0; i < args.length; i++) {
      formatString = formatString.replace(`{${i}}`, args[i])
    }

    return formatString
  }
}

export class Sorter {
	static sort(data: Data[], column: SortColumn, order: SortOrder): Data[] {
		return data.sort((a: Data, b: Data): number => {
			let value1 = a[column].charCodeAt(0)
			let value2 = b[column].charCodeAt(0)

			switch(order) {
				case SortOrder.NORMAL:
					return value1 - value2
				case SortOrder.REVERSED:
					return value2 - value1
			}
		})
	}

	/*static sortByDisplayName(arr: Data[], sortOrder: SortOrder): Data[] {
		return arr.sort((a: Data, b: Data): number => {
			let value1 = a.displayName.charCodeAt(0)
			let value2 = b.displayName.charCodeAt(0)

			switch(sortOrder) {
				case SortOrder.NORMAL:
					return value1 - value2
				case SortOrder.REVERSED:
					return value2 - value1
			}
		})
	}

	static sortByPathName(arr: Printer[], sortOrder: SortOrder): Printer[] {
		return arr.sort((a: Printer, b: Printer): number => {
			let value1 = a.pathName.charCodeAt(0)
			let value2 = b.pathName.charCodeAt(0)

			switch(sortOrder) {
				case SortOrder.NORMAL:
					return value1 - value2
				case SortOrder.REVERSED:
					return value2 - value1
			}
		})
	}*/
}
