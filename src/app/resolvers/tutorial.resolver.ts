import {Injectable} from "@angular/core";
import {Resolve} from "@angular/router";
import {Tutorial} from "../../scripts/models";
import {APIService} from "../services/api.service";

@Injectable({
	providedIn: "root"
})
export class TutorialResolver implements Resolve<Promise<Tutorial[]>> {
	constructor(readonly api: APIService){}

	async resolve(): Promise<Tutorial[]> {
		return await this.api.getTutorials();
	}
}
