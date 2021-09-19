import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router'
import {MainComponent} from "./components/main.component";
import {GetPrintersComponent} from "./components/get-printers.component";
import {AdminComponent} from "./components/admin.component";
import {LocationResolver} from "./resolvers/location.resolver";
import {HelpComponent} from "./components/help.component";
import {TutorialResolver} from "./resolvers/tutorial.resolver";
import {FAQResolver} from "./resolvers/faq.resolver";
import {PrinterResolver} from "./resolvers/printer.resolver";

/**
 * Routes for the application
  */
const routes: Routes = [
	{
		path: 'home',
		component: MainComponent
	},
	{
		path: 'printers',
		component: GetPrintersComponent,
		resolve: {
			printers: PrinterResolver,
			locations: LocationResolver
		}
	},
	{
		path: 'admin',
		component: AdminComponent,
		resolve: {
			printers: PrinterResolver,
			locations: LocationResolver
		}
	},
	{
		path: 'help',
		component: HelpComponent,
		resolve: {
			tutorials: TutorialResolver,
			faqs: FAQResolver
		}
	}
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {

}
