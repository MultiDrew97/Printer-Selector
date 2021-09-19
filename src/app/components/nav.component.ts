import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
	selector: 'nav-root',
	templateUrl: '../../views/nav.component.html'
})
export class NavComponent {
	links = [{
		link: '/home',
		text: 'Home'
	},
		{
			link: '/printers',
			text: 'Add Printers'
		},
		{
			link: '/help',
			text: 'Help'
		},
		{
			link: '/admin',
			text: 'Admin Portal'
		}]

	constructor(private readonly _: Router) {
	}
}
