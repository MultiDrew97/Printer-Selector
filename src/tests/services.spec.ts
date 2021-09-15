import {TestBed} from "@angular/core/testing";
import {CookiesService} from "../app/services";

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
