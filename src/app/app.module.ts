import {HostListener, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatDialogConfig, MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {APIService, CookiesService} from "./services";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {AppRoutingModule} from "./app-routing.module";
import {
	AddPrintersComponent,
	AdminComponent,
	AppComponent,
	FAQComponent,
	HelpComponent,
	MainComponent,
	NavComponent,
	TutorialComponent
} from "./components";
import {LocationResolver, PrinterResolver} from "./resolvers";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSortModule} from "@angular/material/sort";
import {MatSelectModule} from "@angular/material/select";
import {MatListModule} from "@angular/material/list";
import {
	AlertDialogComponent,
	ConfirmDialogComponent,
	EditLocationDialogComponent,
	EditPrinterDialogComponent,
	EmailDialogComponent,
	LocationDialogComponent,
	LoginDialogComponent,
	PrinterDialogComponent,
	PromptDialogComponent
} from './dialogs'
import {HtmlSanitizer} from "./pipes";
import {CdkTableModule} from "@angular/cdk/table";
import {MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs";
import {CookieService} from "ngx-cookie-service";

@NgModule({
	declarations: [
		AddPrintersComponent,
		AdminComponent,
		MainComponent,
		EmailDialogComponent,
		ConfirmDialogComponent,
		AlertDialogComponent,
		PromptDialogComponent,
		PrinterDialogComponent,
		LocationDialogComponent,
		EditPrinterDialogComponent,
		EditLocationDialogComponent,
		LoginDialogComponent,
		HelpComponent,
		TutorialComponent,
		FAQComponent,
		AppComponent,
		HtmlSanitizer,
		NavComponent
	],
	imports: [
		BrowserModule,
		MatDialogModule,
		FormsModule,
		MatCheckboxModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatButtonModule,
		AppRoutingModule,
		MatFormFieldModule,
		MatOptionModule,
		MatSortModule,
		MatSelectModule,
		MatListModule,
		CdkTableModule,
		MatTableModule,
		MatTabsModule
	],
	providers: [
		APIService,
		MatDialogConfig,
		PrinterResolver,
		LocationResolver,
		CookiesService,
		CookieService,
		{
			provide: 'req',
			useValue: null
		},
		{
			provide: 'creds',
			useValue: {
				user: 'sysadmin',
				pass: 'SoliDeoGloria10'
			}
		},
		{
			provide: 'key',
			useValue: '3d3834d3112ab3236d06f9d370e085795740784321c29bdf88e1bb1b'
		}
	],
	bootstrap: [
		AppComponent,
		NavComponent
	]
})
export class AppModule {
	constructor(private readonly cookies: CookieService) {
	}

	@HostListener('beforeunload', ['$event'])
	cleanUp(_: BeforeUnloadEvent) {
		console.debug('Clean up')
		this.cookies.deleteAll()
	}
}
