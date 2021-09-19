import {TestBed} from "@angular/core/testing";
import {HttpClientModule} from "@angular/common/http";
import {CookiesService} from "../app/services/cookies.service";
import {APIService} from "../app/services/api.service";

describe('Cookies Service', () => {
	let service: CookiesService

	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [

			],
			providers: [{
				provide: 'creds',
				useValue: {
					user: 'sysadmin',
					pass: 'SoliDeoGloria10'
				}
			},
			CookiesService]
		});
		service = TestBed.inject(CookiesService);
	});

	it('Add Cookie to cookies', ()=> {
		service.setCookie('test', 'value')
		expect(service.getCookie('test')).toEqual('value')
	})

	it('Remove Cookie from cookies', () => {
		service.setCookie('test', 'value')
		expect(service.getCookie('test')).toEqual('value')

		service.deleteCookie('test')
		expect(service.getCookie('test')).toBeNull()
	})
})

describe('APIService', () => {
	let service: APIService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule
			], providers: [{
				provide: 'creds',
				useValue: {
					user: 'sysadmin',
					pass: 'SoliDeoGloria10'
				}
			}]
		});
		service = TestBed.inject(APIService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
