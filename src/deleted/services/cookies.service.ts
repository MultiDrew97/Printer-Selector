/*
import {Inject, Injectable} from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class CookiesService {
	cookieStore = {};
	readonly days: number = 1

	constructor(@Inject('req') private readonly req: any) {
		if (this.req !== null) {
			this.parseCookies(this.req.cookies);
		} else {
			this.parseCookies(document.cookie);
		}
	}

	public parseCookies(cookies: any) {
		this.cookieStore = {}

		if (!(!!cookies)) {
			return;
		}

		let cookiesArr: any[] = cookies.split(';');
		for (const cookie of cookiesArr) {
			const cookieArr = cookie.split('=');
			// @ts-ignore
			this.cookieStore[cookieArr[0]] = cookieArr[1];
		}

		return
	}

	get(key?: string) {
		// @ts-ignore
		return (key ? (!!this.cookieStore[key] ? this.cookieStore[key] : null) :  this.cookieStore) ;
	}

	set(key: string, value: any) {
		const date = new Date();

		// Set it expire in a certain number of days
		date.setTime(date.getTime() + (this.days * 24 * 60 * 60 * 1000));
		document.cookie = `${key}=${value};expires=${date.toUTCString()};path=/`;
	}

	delete(key: string) {
		const date = new Date();

		// Set it expire in -1 days
		date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

		// Set it
		document.cookie = `${key}=;expires=${date.toUTCString()};path=/`;
	}
}
*/
