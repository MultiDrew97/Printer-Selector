import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FAQ, Printer, Tutorial, Location} from "../../scripts/models";
import {Observable} from "rxjs";
import {encode, format} from "../../scripts/utils";

@Injectable({
	providedIn: 'root'
})
export class APIService {
	private readonly baseURI: string = 'http://localhost:3500/api';
	private readonly auth: string;
	private readonly headers: HttpHeaders;

	constructor(
		@Inject('creds') readonly creds: { user: string, pass: string },
		private readonly http: HttpClient
	) {
		this.auth = encode(format('{0}:{1}', this.creds.user, this.creds.pass));
		this.headers = new HttpHeaders({
			withCredentials: 'true',
			Authorization: `Basic ${this.auth}`,
			Accept: 'application/json, plain/text'
		});
	}

	getPrinters(): Observable<Printer[]> {
		return this.http.get<Printer[]>(`${this.baseURI}/printers`, {headers: this.headers}).pipe()
	}

	getPrinter(id: string): Observable<Printer> {
		return this.http.get<Printer>(`${this.baseURI}/printers?id=${id}`, {headers: this.headers});
	}

	getLocations(): Observable<Location[]> {
		return this.http.get<Location[]>(`${this.baseURI}/locations`, {headers: this.headers});
	}

	getLocation(id: string): Observable<Location> {
		return this.http.get<Location>(`${this.baseURI}/locations?id=${id}`, {headers: this.headers});
	}

	addLocation(location: Location): Observable<boolean> {
		return this.http.post<boolean>(`${this.baseURI}/locations`, location, {headers: this.headers})
	}

	addPrinter(printer: Printer): Observable<boolean> {
		return this.http.post<boolean>(`${this.baseURI}/printers`, printer, {headers: this.headers})
	}

	deletePrinter(id: string): Observable<boolean> {
		return this.http.delete<boolean>(`${this.baseURI}/printers?id=${id}`, {headers: this.headers})
	}

	deleteLocation(id: string): Observable<boolean> {
		return this.http.delete<boolean>(`${this.baseURI}/locations?id=${id}`, {headers: this.headers})
	}

	updatePrinter(printer: Printer, locationID: string): Observable<boolean> {
		return this.http.put<boolean>(`${this.baseURI}/printers?id=${printer._id}&locationID=${locationID}`, printer, {headers: this.headers})
	}

	updateLocation(location: Location): Observable<boolean> {
		return this.http.put<boolean>(`${this.baseURI}/locations?id=${location._id}`, location, {headers: this.headers})
	}

	sendEmail(email: string, printers: string[]): Observable<any> {
		return this.http.post(`${this.baseURI}/emails`, {email: email, printers: printers}, {headers: this.headers})
	}

	deleteFAQ(id: string): Observable<any> {
		return this.http.delete(`${this.baseURI}/faqs?id=${id}`, {headers: this.headers});
	}

	deleteTutorial(id: string): Observable<any> {
		return this.http.delete(`${this.baseURI}/faqs?id=${id}`, {headers: this.headers});
	}

	getFAQ(id: string): Observable<FAQ> {
		return this.http.get<FAQ>(`${this.baseURI}/faqs?id=${id}`, {headers: this.headers});
	}

	getFAQs(): Observable<FAQ[]> {
		return this.http.get<FAQ[]>(`${this.baseURI}/faqs`, {headers: this.headers});
	}

	getTutorial(id: string): Observable<Tutorial> {
		return this.http.get<Tutorial>(`${this.baseURI}/tutorials?id=${id}`, {headers: this.headers});
	}

	getTutorials(): Observable<Tutorial[]> {
		return this.http.get<Tutorial[]>(`${this.baseURI}/tutorials`, {headers: this.headers});
	}
}
