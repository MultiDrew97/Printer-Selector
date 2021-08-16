import {Injectable} from "@angular/core";
import {Resolve} from "@angular/router";
import {Location, Printer} from "../scripts/models";
import {APIService} from "./services";
import {Observable} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class LocationResolver implements Resolve<Location[]> {
	constructor(private api: APIService) {}

	resolve(): Observable<Location[]> {
		return this.api.getLocations()
	}
}

@Injectable({
	providedIn: 'root'
})
export class PrinterResolver implements Resolve<Printer[]> {
	constructor(private api: APIService) {}

	resolve(): Observable<Printer[]> {
		return this.api.getPrinters();
	}
}
