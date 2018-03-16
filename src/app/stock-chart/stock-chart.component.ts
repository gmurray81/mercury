import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, Input } from '@angular/core'

import { StockData } from '../models/stockData'
import { StockDataService } from '../services/stock-data.service'
import { WikiPriceData } from '../models/wikiPriceData';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: [],
})
export class StockChartComponent implements OnInit {
  public stockData: StockData[]
  title = 'chart'
  constructor(private stockDataService: StockDataService) { }

  ngOnInit() {
    this.stockData = this.stockDataService.getHistoricData()
  }

  @Input()
  public set stockDisplayed(stockSelection: WikiPriceData) {
    this.stockData = this.stockDataService.getTickerHistory(stockSelection)
  }
}