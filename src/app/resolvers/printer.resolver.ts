import {Injectable} from "@angular/core";
import {Resolve} from "@angular/router";
import {APIService} from "../services/api.service";
import {Printer} from "../../scripts/models";

@Injectable({
	providedIn: 'root'
})
export class PrinterResolver implements Resolve<Printer[]> {
	constructor(private api: APIService) {}

	resolve(): Promise<Printer[]> {
		return this.api.getPrinters();
	}
}
