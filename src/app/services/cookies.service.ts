import {Injectable} from "@angular/core";
import {CookieStore} from "../../scripts/models";

@Injectable({
	providedIn: "root"
})
export class CookiesService {
	private cookieStore: CookieStore = {};
	private readonly days: number = 1

	constructor() {
		this.parseCookies()
	}

	private parseCookies(cookies: string = document.cookie) {
		this.cookieStore = {}

		if (!(!!cookies)) {
			return;
		}

		let cookiesArr: any[] = cookies.split(';');
		for (const cookie of cookiesArr) {
			const cookieArr = cookie.split('=');
			this.cookieStore[cookieArr[0].trim()] = cookieArr[1];
		}

		return
	}

	getCookie(key?: string) {
		return (key ? (!!this.cookieStore[key] ? this.cookieStore[key] : null) : this.cookieStore);
	}

	setCookie(key: string, value: any) {
		const date = new Date();

		// Set it expire in a certain number of days
		date.setTime(date.getTime() + (this.days * 24 * 60 * 60 * 1000));
		document.cookie = `${key}=${value};expires=${date.toUTCString()};path=/`;

		this.parseCookies();
	}

	deleteCookie(key: string) {
		const date = new Date();

		// Set it expire in -1 days
		date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));

		// Set it
		document.cookie = `${key}=;expires=${date.toUTCString()};path=/`;

		this.parseCookies()
	}
}
