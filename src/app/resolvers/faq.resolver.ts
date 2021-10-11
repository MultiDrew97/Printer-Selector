import {Injectable} from "@angular/core";
import {Resolve} from "@angular/router";
import {FAQ} from "../../scripts/models";
import {APIService} from "../services/api.service";

@Injectable({
	providedIn: "root"
})
export class FAQResolver implements Resolve<FAQ[]> {
	constructor(readonly api: APIService){}

	resolve(): Promise<FAQ[]> {
		return this.api.getFAQs()
	}
}
