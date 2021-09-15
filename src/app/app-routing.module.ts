import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router'
import {AddPrintersComponent, AdminComponent, HelpComponent, MainComponent} from "./components";
import {PrinterResolver, LocationResolver, FAQResolver, TutorialResolver} from "./resolvers";

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
		component: AddPrintersComponent,
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
