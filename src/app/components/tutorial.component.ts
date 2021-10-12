import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Image, Tutorial} from "../../scripts/models";

@Component({
	selector: 'tutorials',
	templateUrl: '../../views/tutorial.component.html',
	styleUrls: ['../../styles/tutorial.component.css']
})
export class TutorialComponent {
	@Input()
	tutorials!: Tutorial[];

	@Input()
	base!: string;

	@Input()
	imgs!: Image[];

	@Output()
	toggleCollapse = new EventEmitter<EventTarget | null>()

	toggle(target: EventTarget | null) {
		// TODO: Figure out how to collapse an already open collapsible without hindering operations
		this.toggleCollapse.emit(target)
	}
}
