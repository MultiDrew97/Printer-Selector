interface dbEntry extends Record<string, any> {
	_id: string
}
export interface Data extends dbEntry {
	displayName: string;
}

export interface Location extends Data {
	ipAddress: string;
	printers: Printer[];
}

export interface Printer extends Data {
	pathName: string;
	checked: boolean;
}

export interface Help extends dbEntry {
	linkID: string;
	imgs: Image[];
}

export interface FAQ extends Help {
	question: string;
	answer: string;
}

export interface Tutorial extends Help {
	title: string;
	description: string;
	steps: string[];
}

export interface Image extends dbEntry, Help {
	title: string;
	name: string
	alt: string
	step?: number
}

export interface CookieStore {
	[k: string]: string;
	value?: any;
}
