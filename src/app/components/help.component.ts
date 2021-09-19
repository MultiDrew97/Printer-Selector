import {Component} from "@angular/core";
import {toggleCollapse} from "../../scripts/utils";
import {FAQ, Tutorial} from "../../scripts/models";
import {ActivatedRoute} from "@angular/router";
import {APIService} from "../services/api.service";

@Component({
	templateUrl: '../../views/help.component.html',
	styleUrls: ['../../styles/help.component.css']
})
export class HelpComponent {
	header: string = "AGIT's Printer Help";
	subheader: string = "If you have any issues getting your printer(s) installed, refer to below";
	readonly base: string = '/help'

	toggle = toggleCollapse

	tutorials: Tutorial[] = [];
	faqs: FAQ[] = [];

	constructor(readonly api: APIService, readonly route: ActivatedRoute) {
		this.tutorials = route.snapshot.data.tutorials
		this.faqs = route.snapshot.data.faqs
		/*for (const tutorial of this.route.snapshot.data.tutorials) {
			this.tutorials.push(tutorial)
		}*/

		/*for (const faq of this.route.snapshot.data.faqs) {
			this.faqs.push(faq)
		}*/
	}
}
