import {Injectable} from "@angular/core";
import {Resolve} from "@angular/router";
import {Location} from "../../scripts/models";
import {Observable} from "rxjs";
import {APIService} from "../services/api.service";

@Injectable({
	providedIn: 'root'
})
export class LocationResolver implements Resolve<Location[]> {
	constructor(private api: APIService) {}

	resolve(): Observable<Location[]> {
		return this.api.getLocations()
	}
}
