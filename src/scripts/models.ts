interface dbEntry extends Record<string, any> {
	_id: string
}
export interface Data extends dbEntry {
	[key: string]: any
	displayName: string;
}

export interface Location extends Data {
	printers: Printer[];
}

export interface Printer extends Data {
	pathName: string;
	checked: boolean;
}

// TODO: Determine a more descriptive name for this base interface for FAQs and Tutorials
interface _ extends dbEntry {
	linkID: string;
	imgs: string[];
}

export interface FAQ extends _ {
	question: string;
	answer: string;
}

export interface Tutorial extends _ {
	title: string;
	steps: string[];
}

