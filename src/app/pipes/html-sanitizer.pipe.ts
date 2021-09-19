// Found this here: https://stackoverflow.com/questions/59874810/compile-a-dynamic-html-string-in-angular-8#59875876
import {Pipe} from "@angular/core";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Pipe({
	name: 'HTMLSanitizer'
})
export class HtmlSanitizer {
	constructor(readonly sanitizer: DomSanitizer) {
	}

	transform(v: string): SafeHtml {
		return this.sanitizer.bypassSecurityTrustHtml(v);
	}
}
