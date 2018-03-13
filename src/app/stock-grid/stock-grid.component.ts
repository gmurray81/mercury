import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, Input } from '@angular/core'

import { WikiPriceData } from '../models/wikiPriceData'
import { StockDataService } from '../services/stock-data.service'
import { IgxGridComponent } from 'igniteui-angular/grid/grid.component'
import { IgxColumnComponent } from 'igniteui-angular/grid/column.component'
import { IgxGridCellComponent } from 'igniteui-angular/grid/cell.component'

@Component({
  selector: 'app-stock-grid',
  templateUrl: './stock-grid.component.html',
  styleUrls: ['./stock-grid.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StockGridComponent implements OnInit, AfterViewInit {
  @Input() public tickerSelected: Function

  stockData: WikiPriceData[]

  title = 'Grid'
  constructor(private stockDataService: StockDataService) { }
  @ViewChild('grid1') grid1: IgxGridComponent

  ngOnInit() {
    this.stockData = this.stockDataService.getMarketData()
  }

  ngAfterViewInit() {
    this.grid1.width = '100%'
    this.grid1.height = '100%'
    this.grid1.cdr.detectChanges()
  }

  onSelection(cell: IgxGridCellComponent) {
    this.tickerSelected(cell.row.rowData.Ticker)
  }
}