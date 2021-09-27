import {HostListener, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatDialogConfig, MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {AppRoutingModule} from "./app-routing.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSortModule} from "@angular/material/sort";
import {MatSelectModule} from "@angular/material/select";
import {MatListModule} from "@angular/material/list";
import {CdkTableModule} from "@angular/cdk/table";
import {MatTableModule} from "@angular/material/table";
import {MatTabsModule} from "@angular/material/tabs";
import {CookieService} from "ngx-cookie-service";
import {GetPrintersComponent} from "./components/get-printers.component";
import {MainComponent} from "./components/main.component";
import {AdminComponent} from "./components/admin.component";
import {HelpComponent} from "./components/help.component";
import {AppComponent} from "./components/app.component";
import {FAQComponent} from "./components/faq.component";
import {TutorialComponent} from "./components/tutorial.component";
import {NavComponent} from "./components/nav.component";
import {LocationResolver} from "./resolvers/location.resolver";
import {PrinterResolver} from "./resolvers/printer.resolver";
import {APIService} from "./services/api.service";
import {HtmlSanitizer} from "./pipes/html-sanitizer.pipe";
import {EmailDialogComponent} from "./dialogs/email-dialog.component";
import {PromptDialogComponent} from "./dialogs/prompt-dialog.component";
import {ConfirmDialogComponent} from "./dialogs/confirm-dialog.component";
import {LoginDialogComponent} from "./dialogs/login-dialog.component";
import {EditPrinterDialogComponent} from "./dialogs/edit-printer-dialog.component";
import {AlertDialogComponent} from "./dialogs/alert-dialog.component";
import {AddPrinterDialogComponent} from "./dialogs/add-printer-dialog.component";
import {AddLocationDialogComponent} from "./dialogs/add-location-dialog.component";
import {EditLocationDialogComponent} from "./dialogs/edit-location-dialog.component";
import {MatInputModule} from "@angular/material/input";

@NgModule({
	declarations: [
		GetPrintersComponent,
		AdminComponent,
		MainComponent,
		EmailDialogComponent,
		ConfirmDialogComponent,
		AlertDialogComponent,
		PromptDialogComponent,
		AddPrinterDialogComponent,
		AddLocationDialogComponent,
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
		MatTabsModule,
		MatInputModule,
		ReactiveFormsModule
	],
	providers: [
		APIService,
		MatDialogConfig,
		PrinterResolver,
		LocationResolver,
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

	@HostListener('beforeunload', [])
	cleanUpCheck() {
		return "Are you sure?"
	}

	@HostListener('unload', [])
	cleanUp() {
		console.debug('Clean up')
		this.cookies.deleteAll()
	}
}
