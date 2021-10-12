import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FAQ, Image} from "../../scripts/models";

@Component({
	selector: 'faqs',
	templateUrl: '../../views/faq.component.html',
	styleUrls: ['../../styles/faq.component.css']
})
export class FAQComponent {
	@Input()
	faqs!: FAQ[];

	@Input()
	base!: string;

	@Input()
	imgs!: Image[]

	@Output()
	toggleCollapse = new EventEmitter<EventTarget | null>()

	toggle(target: EventTarget | null) {
		// TODO: Figure out how to collapse an already open collapsible without hindering operations
		this.toggleCollapse.emit(target)
	}
}
