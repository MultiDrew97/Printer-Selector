import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router'
import {AddPrintersComponent, AdminComponent, FAQComponent, HomeComponent} from "./components";
import {PrinterResolver, LocationResolver} from "./resolvers";

/**
 * Routes for the application
  */
const routes: Routes = [
	{
		path: '',
		component: HomeComponent
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
		path: 'faq',
		component: FAQComponent
		/*resolve: {
			faqs: FAQResolver
		}*/
	}
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {

}
