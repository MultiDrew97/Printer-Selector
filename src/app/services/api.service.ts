import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {FAQ, Printer, Tutorial, Location} from "../../scripts/models";
import {encode} from "../../scripts/utils";

@Injectable({
	providedIn: 'root'
})
export class APIService {
	private readonly baseURI: string = 'http://ad-its:3500/api';
	private readonly headers: HttpHeaders;

	constructor(
		@Inject('creds') readonly creds: { user: string, pass: string },
		private readonly http: HttpClient
	) {
		this.headers = new HttpHeaders({
			withCredentials: 'true',
			Authorization: `Basic ${encode(`${this.creds.user}:${this.creds.pass}`)}`,
			Accept: 'application/json, plain/text'
		});
	}

	getPrinters(): Promise<Printer[]> {
		return this.http.get<Printer[]>(`${this.baseURI}/printers`, {headers: this.headers}).toPromise()
	}

	getPrinter(id: string): Promise<Printer> {
		return this.http.get<Printer>(`${this.baseURI}/printers?id=${id}`, {headers: this.headers}).toPromise();
	}

	getLocations(): Promise<Location[]> {
		return this.http.get<Location[]>(`${this.baseURI}/locations`, {headers: this.headers}).toPromise();
	}

	getLocation(id: string): Promise<Location> {
		return this.http.get<Location>(`${this.baseURI}/locations?id=${id}`, {headers: this.headers}).toPromise();
	}

	addLocation(location: Location): Promise<boolean> {
		return this.http.post<boolean>(`${this.baseURI}/locations`, location, {headers: this.headers}).toPromise()
	}

	addPrinter(printer: Printer): Promise<boolean> {
		return this.http.post<boolean>(`${this.baseURI}/printers`, printer, {headers: this.headers}).toPromise()
	}

	deletePrinter(id: string): Promise<boolean> {
		return this.http.delete<boolean>(`${this.baseURI}/printers?id=${id}`, {headers: this.headers}).toPromise()
	}

	deleteLocation(id: string): Promise<boolean> {
		return this.http.delete<boolean>(`${this.baseURI}/locations?id=${id}`, {headers: this.headers}).toPromise()
	}

	updatePrinter(printer: Printer, locationID: string): Promise<boolean> {
		return this.http.put<boolean>(`${this.baseURI}/printers?id=${printer._id}&locationID=${locationID}`, printer, {headers: this.headers}).toPromise()
	}

	updateLocation(location: Location): Promise<boolean> {
		return this.http.put<boolean>(`${this.baseURI}/locations?id=${location._id}`, location, {headers: this.headers}).toPromise()
	}

	sendEmail(body: {email: string, printers: string[], batch: string}): Promise<any> {
		return this.http.post(`${this.baseURI}/emails`, body, {headers: this.headers}).toPromise()
	}

	deleteFAQ(id: string): Promise<any> {
		return this.http.delete(`${this.baseURI}/faqs?id=${id}`, {headers: this.headers}).toPromise();
	}

	deleteTutorial(id: string): Promise<any> {
		return this.http.delete(`${this.baseURI}/faqs?id=${id}`, {headers: this.headers}).toPromise();
	}

	getFAQ(id: string): Promise<FAQ> {
		return this.http.get<FAQ>(`${this.baseURI}/faqs?id=${id}`, {headers: this.headers}).toPromise();
	}

	getFAQs(): Promise<FAQ[]> {
		return this.http.get<FAQ[]>(`${this.baseURI}/faqs`, {headers: this.headers}).toPromise();
	}

	getTutorial(id: string): Promise<Tutorial> {
		return this.http.get<Tutorial>(`${this.baseURI}/tutorials?id=${id}`, {headers: this.headers}).toPromise();
	}

	getTutorials(): Promise<Tutorial[]> {
		return this.http.get<Tutorial[]>(`${this.baseURI}/tutorials`, {headers: this.headers}).toPromise();
	}
}
