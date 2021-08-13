import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {HomeComponent} from './components/home.component';
import {MatDialogModule, MatDialogConfig} from "@angular/material/dialog";
import {EmailDialogComponent} from "./components/email-dialog.component";
import {FormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {APIService} from "./services/api.service";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {AppRoutingModule} from "./app-routing.module";
import {AdminComponent} from "./components/admin.component";
import {AppComponent} from "./components/app.component";
import {MainComponent} from "./components/main.component";
import {PrinterResolver} from "./resolvers/printer.resolver";
import {ConfirmDialogComponent} from "./components/confirm-dialog.component";
import {AlertDialogComponent} from "./components/alert-dialog.component";
import {PromptDialogComponent} from "./components/prompt-dialog.component";
import {LocationDialogComponent} from "./components/location-dialog.component";
import {PrinterDialogComponent} from "./components/printer-dialog.component";
import {LocationResolver} from "./resolvers/location.resolver";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOptionModule} from "@angular/material/core";
import {MatSortModule} from "@angular/material/sort";
import {MatSelectModule} from "@angular/material/select";
import {MatListModule} from "@angular/material/list";
import {EditPrinterDialogComponent} from "./components/edit-printer-dialog.component";
import {EditLocationDialogComponent} from "./components/edit-location-dialog.component";
import {CookiesService} from "./services/cookies.service";
import {LoginDialogComponent} from "./components/login-dialog.component";
import {FAQComponent} from "./components/faq.component";

@NgModule({
	declarations: [
		HomeComponent,
		AdminComponent,
		AppComponent,
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
		FAQComponent
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
		MatListModule
	],
	providers: [
		APIService,
		MatDialogConfig,
		PrinterResolver,
		LocationResolver,
		CookiesService,
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
		}
	],
	bootstrap: [
		AppComponent
	]
})
export class AppModule {
}
