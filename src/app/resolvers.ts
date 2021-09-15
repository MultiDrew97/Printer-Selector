import {Injectable} from "@angular/core";
import {Resolve} from "@angular/router";
import {FAQ, Location, Printer, Tutorial} from "../scripts/models";
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

@Injectable({
	providedIn: "root"
})
export class FAQResolver implements Resolve<FAQ[]> {
	constructor(readonly api: APIService){}

	resolve(): Observable<FAQ[]> {
		return this.api.getFAQs()
	}
}

@Injectable({
	providedIn: "root"
})
export class TutorialResolver implements Resolve<Promise<Tutorial[]>> {
	constructor(readonly api: APIService){}

	async resolve(): Promise<Tutorial[]> {
		return await this.api.getTutorials().toPromise();
	}
}
