import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { IgxNavigationDrawerModule, IgxNavbarModule, IgxLayoutModule, IgxRippleModule, IgxGridModule } from 'igniteui-angular/main'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { HomeComponent } from './home/home.component'
import { StockGridComponent } from './stock-grid/stock-grid.component'
import { StockDataService } from './services/stock-data.service'
import { StockChartComponent } from './stock-chart/stock-chart.component'
import { IgFinancialChartModule } from '@infragistics/ignite-ui-xplatform-for-angular/ES5/ig-financialchart-module'
import { IgDataChartInteractivityModule } from '@infragistics/ignite-ui-xplatform-for-angular/ES5/ig-datachart-interactivity-module'

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		StockGridComponent,
		StockChartComponent
	],
	imports: [
		FormsModule,
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		IgxNavigationDrawerModule,
		IgxNavbarModule,
		IgxLayoutModule,
		IgxRippleModule,
		IgxGridModule.forRoot(),
		IgFinancialChartModule,
		IgDataChartInteractivityModule,
	],
	providers: [StockDataService],
	bootstrap: [AppComponent]
})
export class AppModule {
}
