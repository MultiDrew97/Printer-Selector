import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {MatDialogConfig, MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {APIService, CookiesService} from "./services";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatButtonModule} from "@angular/material/button";
import {AppRoutingModule} from "./app-routing.module";
import {AddPrintersComponent, AdminComponent, FAQComponent, HomeComponent} from "./components";
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

@NgModule({
	declarations: [
		AddPrintersComponent,
		AdminComponent,
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

	]
})
export class AppModule {
}
