import {MatTableDataSource} from "@angular/material/table";
import {Printer, Location} from "./models";
import {MatSort} from "@angular/material/sort";

export class PrinterDataSource extends MatTableDataSource<Printer> {
	matSort: MatSort = new MatSort()

	constructor(printers: Printer[]) {
		super(printers)
	}
}

export class LocationDataSource extends MatTableDataSource<Location> {
	constructor(locations: Location[]) {
		super(locations)
	}
}
