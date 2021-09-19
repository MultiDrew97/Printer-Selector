import {Injectable} from "@angular/core";
import {Resolve} from "@angular/router";
import {Observable} from "rxjs";
import {APIService} from "../services/api.service";
import {Printer} from "../../scripts/models";

@Injectable({
	providedIn: 'root'
})
export class PrinterResolver implements Resolve<Printer[]> {
	constructor(private api: APIService) {}

	resolve(): Observable<Printer[]> {
		return this.api.getPrinters();
	}
}
