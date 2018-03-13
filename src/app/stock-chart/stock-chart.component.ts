import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild } from '@angular/core'

import { StockData } from '../models/stockData'
import { StockDataService } from '../services/stock-data.service'

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


}