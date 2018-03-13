import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { StockGridComponent } from './stock-grid/stock-grid.component'
import { StockChartComponent } from './stock-chart/stock-chart.component'
export const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent, data: { text: 'Home' } },
	{ path: 'stock-grid', component: StockGridComponent, data: { text: 'stock-grid' } },
	{ path: 'stock-chart', component: StockChartComponent, data: { text: 'stock-chart' } }
]
@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
