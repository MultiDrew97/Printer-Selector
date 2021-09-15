/**
 * A custom enum to use to determine which column to sort on
 */
export enum SortColumn {
	DISPLAY,
	PATH,
	IP,
}

/**
 * A custom enum to use to determine which order to sort in
 */
export enum SortOrder {
	NORMAL, REVERSED
}

/**
 * A custom enum to use for tab selections
 */
export enum Tabs {
	PRINTER,
	LOCATION
}

/**
 * A custom enum to use for dialog selection
 */
export enum DialogSelection {
	NEW_LOCATION,
	NEW_PRINTER,
	EDIT_PRINTER,
	EDIT_LOCATION,
	LOGIN_PROMPT,
	ALERT,
	CONFIRM,
}
