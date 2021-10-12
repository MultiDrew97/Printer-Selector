import {Component} from "@angular/core";
import {toggleCollapse} from "../../scripts/utils";
import {ActivatedRoute} from "@angular/router";

@Component({
	templateUrl: '../../views/help.component.html',
	styleUrls: ['../../styles/help.component.css']
})
export class HelpComponent {
	header: string = "AGIT's Printer Help";
	subheader: string = "If you have any issues getting your printer(s) installed, refer to below";
	readonly base: string = '/help'

	toggle = toggleCollapse

	constructor(readonly route: ActivatedRoute) {
	}
}
