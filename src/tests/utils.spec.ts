import {decode, encode, format, includedIn, sort} from "../scripts/utils";
import {SortColumn, SortOrder} from "../scripts/enums";
import {Help, Location, Printer} from "../scripts/models";
import {APIService} from "../app/services";
import {TestBed} from "@angular/core/testing";
import {HttpClientModule} from "@angular/common/http";

describe('Sorter', () => {
	let service: APIService;
	const locations: Location[] = [
		{
			_id: "60f720f7c50e7742da855d32",
			displayName: "Admin",
			printers: [
				{
					_id: "60f720bdc50e7742da855d31",
					pathName: "ADMIN-IT",
					displayName: "Admin IT Printer",
					checked: false
				},
				{
					_id: "60f9c7028cddb60a02ad6516",
					pathName: "CN-Test",
					displayName: "Central Test Printer",
					checked: false
				}
			]
		},
		{
			_id: "60f9c6df8cddb60a02ad6515",
			displayName: "Central",
			"printers": [
				{
					_id: "60f9c7028cddb60a02ad6516",
					pathName: "CN-Test",
					displayName: "Central Test Printer",
					checked: false
				},
				{
					_id: "60fcf4489725b8a8a36c804d",
					pathName: "TT-Test",
					displayName: "Another Test Printer",
					checked: false
				},
				{
					_id: "6116c6f8fbe3bc15803c66b2",
					displayName: "Yet Another Test Printer",
					pathName: "TT-Test-2",
					checked: false
				},
				{
					_id: "6116c723fbe3bc15803c66b5",
					displayName: "Last Test Printer",
					pathName: "TT-Test-3",
					checked: false
				}
			]
		}
	]
	const printers: Printer[] = [
		{
			_id: "60f720bdc50e7742da855d31",
			pathName: "ADMIN-IT",
			displayName: "Admin IT Printer",
			checked: false
		},
		{
			_id: "60f9c7028cddb60a02ad6516",
			pathName: "CN-Test",
			displayName: "Central Test Printer",
			checked: false
		},
		{
			_id: "60fcf4489725b8a8a36c804d",
			pathName: "TT-Test",
			displayName: "Another Test Printer",
			checked: false
		},
		{
			_id: "6116c6f8fbe3bc15803c66b2",
			displayName: "Yet Another Test Printer",
			pathName: "TT-Test-2",
			checked: false
		},
		{
			_id: "6116c723fbe3bc15803c66b5",
			displayName: "Last Test Printer",
			pathName: "TT-Test-3",
			checked: false
		}
	]

	const ascendingLocations: Location[] = [
		{
			_id: "60f720f7c50e7742da855d32",
			displayName: "Admin",
			printers: [
				{
					_id: "60f720bdc50e7742da855d31",
					pathName: "ADMIN-IT",
					displayName: "Admin IT Printer",
					checked: false
				},
				{
					_id: "60f9c7028cddb60a02ad6516",
					pathName: "CN-Test",
					displayName: "Central Test Printer",
					checked: false
				}
			]
		},
		{
			_id: "60f9c6df8cddb60a02ad6515",
			displayName: "Central",
			"printers": [
				{
					_id: "60f9c7028cddb60a02ad6516",
					pathName: "CN-Test",
					displayName: "Central Test Printer",
					checked: false
				},
				{
					_id: "60fcf4489725b8a8a36c804d",
					pathName: "TT-Test",
					displayName: "Another Test Printer",
					checked: false
				},
				{
					_id: "6116c6f8fbe3bc15803c66b2",
					displayName: "Yet Another Test Printer",
					pathName: "TT-Test-2",
					checked: false
				},
				{
					_id: "6116c723fbe3bc15803c66b5",
					displayName: "Last Test Printer",
					pathName: "TT-Test-3",
					checked: false
				}
			]
		}
	]
	const descendingLocations: Location[] = [
		{
			_id: "60f9c6df8cddb60a02ad6515",
			displayName: "Central",
			"printers": [
				{
					_id: "60f9c7028cddb60a02ad6516",
					pathName: "CN-Test",
					displayName: "Central Test Printer",
					checked: false
				},
				{
					_id: "60fcf4489725b8a8a36c804d",
					pathName: "TT-Test",
					displayName: "Another Test Printer",
					checked: false
				},
				{
					_id: "6116c6f8fbe3bc15803c66b2",
					displayName: "Yet Another Test Printer",
					pathName: "TT-Test-2",
					checked: false
				},
				{
					_id: "6116c723fbe3bc15803c66b5",
					displayName: "Last Test Printer",
					pathName: "TT-Test-3",
					checked: false
				}
			]
		},
		{
			_id: "60f720f7c50e7742da855d32",
			displayName: "Admin",
			printers: [
				{
					_id: "60f720bdc50e7742da855d31",
					pathName: "ADMIN-IT",
					displayName: "Admin IT Printer",
					checked: false
				},
				{
					_id: "60f9c7028cddb60a02ad6516",
					pathName: "CN-Test",
					displayName: "Central Test Printer",
					checked: false
				}
			]
		}
	]

	const ascendingPrintersDisplay: Printer[] = [
		{
			_id: "60f720bdc50e7742da855d31",
			pathName: "ADMIN-IT",
			displayName: "Admin IT Printer",
			checked: false
		},
		{
			_id: "60fcf4489725b8a8a36c804d",
			pathName: "TT-Test",
			displayName: "Another Test Printer",
			checked: false
		},
		{
			_id: "60f9c7028cddb60a02ad6516",
			pathName: "CN-Test",
			displayName: "Central Test Printer",
			checked: false
		},
		{
			_id: "6116c723fbe3bc15803c66b5",
			displayName: "Last Test Printer",
			pathName: "TT-Test-3",
			checked: false
		},
		{
			_id: "6116c6f8fbe3bc15803c66b2",
			displayName: "Yet Another Test Printer",
			pathName: "TT-Test-2",
			checked: false
		}
	]
	const descendingPrintersDisplay: Printer[] = [
		{
			_id: "6116c6f8fbe3bc15803c66b2",
			displayName: "Yet Another Test Printer",
			pathName: "TT-Test-2",
			checked: false
		},
		{
			_id: "6116c723fbe3bc15803c66b5",
			displayName: "Last Test Printer",
			pathName: "TT-Test-3",
			checked: false
		},
		{
			_id: "60f9c7028cddb60a02ad6516",
			pathName: "CN-Test",
			displayName: "Central Test Printer",
			checked: false
		},
		{
			_id: "60fcf4489725b8a8a36c804d",
			pathName: "TT-Test",
			displayName: "Another Test Printer",
			checked: false
		},
		{
			_id: "60f720bdc50e7742da855d31",
			pathName: "ADMIN-IT",
			displayName: "Admin IT Printer",
			checked: false
		}
	]

	const ascendingPrintersPath: Printer[] = [
		{
			_id: "60f720bdc50e7742da855d31",
			pathName: "ADMIN-IT",
			displayName: "Admin IT Printer",
			checked: false
		},
		{
			_id: "60f9c7028cddb60a02ad6516",
			pathName: "CN-Test",
			displayName: "Central Test Printer",
			checked: false
		},
		{
			_id: "60fcf4489725b8a8a36c804d",
			pathName: "TT-Test",
			displayName: "Another Test Printer",
			checked: false
		},
		{
			_id: "6116c6f8fbe3bc15803c66b2",
			displayName: "Yet Another Test Printer",
			pathName: "TT-Test-2",
			checked: false
		},
		{
			_id: "6116c723fbe3bc15803c66b5",
			displayName: "Last Test Printer",
			pathName: "TT-Test-3",
			checked: false
		}
	]
	const descendingPrintersPath: Printer[] = [
		{
			_id: "6116c723fbe3bc15803c66b5",
			displayName: "Last Test Printer",
			pathName: "TT-Test-3",
			checked: false
		},
		{
			_id: "6116c6f8fbe3bc15803c66b2",
			displayName: "Yet Another Test Printer",
			pathName: "TT-Test-2",
			checked: false
		},
		{
			_id: "60fcf4489725b8a8a36c804d",
			pathName: "TT-Test",
			displayName: "Another Test Printer",
			checked: false
		},
		{
			_id: "60f9c7028cddb60a02ad6516",
			pathName: "CN-Test",
			displayName: "Central Test Printer",
			checked: false
		},
		{
			_id: "60f720bdc50e7742da855d31",
			pathName: "ADMIN-IT",
			displayName: "Admin IT Printer",
			checked: false
		}
	]

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule
			],
			providers: [{
				provide: 'creds',
				useValue: {
					user: 'sysadmin',
					pass: 'SoliDeoGloria10'
				}, APIService
			}]
		});
		service = TestBed.inject(APIService);
	});

	it('Should sort Locations ascending based on display name', () => {
		expect(sort(locations, SortColumn.DISPLAY, SortOrder.NORMAL)).toEqual(ascendingLocations)
	})

	it('Should sort Locations descending based on display name', () => {
		expect(sort(locations, SortColumn.DISPLAY, SortOrder.REVERSED)).toEqual(descendingLocations)
	})

	it('Should sort Printers ascending based on display name', () => {
		expect(sort(printers, SortColumn.DISPLAY, SortOrder.NORMAL)).toEqual(ascendingPrintersDisplay)
	})

	it('Should sort Printers descending based on display name', () => {
		expect(sort(printers, SortColumn.DISPLAY, SortOrder.REVERSED)).toEqual(descendingPrintersDisplay)
	})

	it('Should sort Printers ascending based on path name', () => {
		expect(sort(printers, SortColumn.PATH, SortOrder.NORMAL)).toEqual(ascendingPrintersPath)
	})

	it('Should sort Printers descending based on path name', () => {
		expect(sort(printers, SortColumn.PATH, SortOrder.REVERSED)).toEqual(descendingPrintersPath)
	})
})

describe('String Formatting', () => {
	const singleArg: string = 'Andrew'
	const formatStringOneArg: string = 'Hello, {0}!'
	const correctFormatOneArg: string = `Hello, ${singleArg}!`

	const multipleArgs = ['test', 'formatting', 'multiple']
	const formatStringMultipleArgs: string = 'This is the first {0} of {1} with {2} args.'
	const correctMultipleFormat: string = `This is the first ${multipleArgs[0]} of ${multipleArgs[1]} with ${multipleArgs[2]} args.`

	it('Formats with 1 argument', () => {
		expect(format(formatStringOneArg, singleArg)).toEqual(correctFormatOneArg);
	})

	it('Formats with multiple arguments', () => {
		expect(format(formatStringMultipleArgs, multipleArgs[0], multipleArgs[1], multipleArgs[2])).toEqual(correctMultipleFormat)
	})

	it("Doesn't change anything about the string", () => {
		expect(format('No Format Necessary')).toEqual('No Format Necessary')
	})
})

describe('Find in Array', () => {
	const help: Help[] = [
		{
			_id: 'testID',
			linkID: 'web',
			imgs: []
		}
	]

	it('Should find the item', () => {
		expect(includedIn(help, 'web')).toBeTrue()
	})

	it('Should not find the item', () => {
		expect(includedIn(help, 'somethingElse')).toBeFalse()
	})
})

describe('Base64 Encoding', () => {
	const text: string = 'Hello, World!'
	const textEncoded: string = 'SGVsbG8sIFdvcmxkIQ=='

	it('Should encrypt the text in base64 encoding', () => {
		expect(encode(text)).toEqual(textEncoded)
	})

	it('Should decrypt the encoded text to normal string', () => {
		expect(decode(textEncoded)).toEqual(text)
	})
})
