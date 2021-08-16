import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Location, Printer} from "../scripts/models";
import {Buffer} from "buffer";

@Injectable({
	providedIn: 'root'
})
export class APIService {
	private baseURI: string = 'http://localhost:3000/api';
	private readonly auth: string;
	private readonly headers: HttpHeaders;

	constructor(
		@Inject('creds') readonly creds: { user: string, pass: string },
		private http: HttpClient
	) {
		this.auth = this.encode(`${this.creds.user}:${this.creds.pass}`);
		this.headers = new HttpHeaders({
			withCredentials: 'true',
			Authorization: `Basic ${this.auth}`,
			Accept: 'application/json, */*, plain/text'
		});
	}

	getPrinters(): Observable<Printer[]> {
		return this.http.get<Printer[]>(`${this.baseURI}/printers`, { headers: this.headers})
	}

	getPrinter(id: string): Observable<Printer> {
		return this.http.get<Printer>(`${this.baseURI}/printers?id=${id}`, {headers: this.headers});
	}

	getLocations(): Observable<Location[]> {
		return this.http.get<Location[]>(`${this.baseURI}/locations`, { headers: this.headers});
	}

	getLocation(id: string): Observable<Location> {
		return this.http.get<Location>(`${this.baseURI}/locations?id=${id}`, { headers: this.headers});
	}

	addLocation(location: Location): Observable<Location> {
		return this.http.post<Location>(`${this.baseURI}/locations`, location, { headers: this.headers })
	}

	addPrinter(printer: Printer): Observable<Printer> {
		return this.http.post<Printer>(`${this.baseURI}/printers`, printer, { headers: this.headers })
	}

	deletePrinter(id: string): Observable<Printer> {
		return this.http.delete<Printer>(`${this.baseURI}/printers?id=${id}`, { headers: this.headers })
	}

	deleteLocation(id: string): Observable<Location> {
		return this.http.delete<Location>(`${this.baseURI}/locations?id=${id}`, { headers: this.headers })
	}

	updatePrinter(printer: Printer, locationID: string): Observable<Printer> {
		return this.http.put<Printer>(`${this.baseURI}/printers?id=${printer._id}&locationID=${locationID}`, printer, {headers: this.headers})
	}

	updateLocation(location: Location): Observable<Location> {
		return this.http.put<Location>(`${this.baseURI}/locations?id=${location._id}`, location, {headers: this.headers})
	}

	sendEmail(email: string, printers: string[]): Observable<any> {
		return this.http.post(`${this.baseURI}/emails`, {email: email, printers: printers}, {headers: this.headers})
	}

	private encode = (value: string): string => Buffer.from(value, 'binary').toString('base64');

	// TODO: Reimplement this if I need to decode base64 string
	//  private decode = (value: string): string => Buffer.from(value, 'base64').toString('binary');
}

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
