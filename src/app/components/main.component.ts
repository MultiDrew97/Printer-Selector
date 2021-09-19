import {Component} from "@angular/core";

@Component({
	templateUrl: '../../views/main.component.html',
	styleUrls: ['../../styles/main.component.css']
})
export class MainComponent {
	department: string = 'AGIT';
	header: string = 'Printer Installation';
	subheader: string = `Welcome to the ${this.department} ${this.header} Site.`;
}
