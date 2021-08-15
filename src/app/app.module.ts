import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MatDialogConfig, MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {APIService, CookiesService} from "./services/services";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {AppRoutingModule} from "./app-routing.module";
import {AddPrintersComponent, AdminComponent, AppComponent, FAQComponent, HomeComponent} from "./components/components";
import {PrinterResolver, LocationResolver} from "./resolvers/resolvers";
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
} from './components/dialogs'

@NgModule({
	declarations: [
		AddPrintersComponent,
		AdminComponent,
		AppComponent,
		HomeComponent,
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
