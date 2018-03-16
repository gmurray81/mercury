import { Component } from '@angular/core'
import { routes } from './app-routing.module'
import { IgxGridCellComponent } from 'igniteui-angular/grid/cell.component'
import { WikiPriceData } from './models/wikiPriceData'


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	selectedStock: WikiPriceData

	onStockSelected(stockSelection: WikiPriceData) {
		this.selectedStock = stockSelection
	}
}
