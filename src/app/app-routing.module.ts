import {NgModule} from "@angular/core";
import {Routes, RouterModule} from '@angular/router'
import {AdminComponent} from "./components/admin.component";
import {HomeComponent} from "./components/home.component";
import {MainComponent} from "./components/main.component";
import {PrinterResolver} from "./resolvers/printer.resolver";
import {LocationResolver} from "./resolvers/location.resolver";
import {FAQComponent} from "./components/faq.component";

// Routes for the
const routes: Routes = [
	{
		path: '',
		component: MainComponent
	},
	{
		path: 'printers',
		component: HomeComponent,
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
