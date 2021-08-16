import { TestBed } from '@angular/core/testing';

import { APIService } from '../../app/services';
import {HttpClientModule} from "@angular/common/http";

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
