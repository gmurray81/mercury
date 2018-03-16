import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, Input } from '@angular/core'

import { StockData } from '../models/stockData'
import { StockDataService } from '../services/stock-data.service'
import { WikiPriceData } from '../models/wikiPriceData';
import { DomainChartSeriesPointerEventArgs } from '@infragistics/igniteui-angular-charts/ES5/igx-domain-chart-series-pointer-event-args';
import { ChartSeriesEventArgs } from '@infragistics/igniteui-angular-charts/ES5/igx-chart-series-event-args';
import { IgxFinancialSeriesComponent } from '@infragistics/igniteui-angular-charts/ES5/igx-financial-series-component';
import { AssigningCategoryStyleEventArgs } from '@infragistics/igniteui-angular-charts/ES5/igx-assigning-category-style-event-args';
import { IgxFinancialChartComponent } from '@infragistics/igniteui-angular-charts/ES5/igx-financial-chart-component';

declare var openfin: any;
//import 'openfin';

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: [],
})
export class StockChartComponent implements OnInit, AfterViewInit {

  @ViewChild(IgxFinancialChartComponent) 
  chart: IgxFinancialChartComponent;

  ngAfterViewInit(): void {
      if (fin !== undefined) {
        
        fin.desktop.main(() => this.onMain());
      }
  }

  //currSelection: any;

  private _apps: any[] = [];
  private _gridRunning: boolean = false;
  private _gridUuid: string = "ig-grid-app-1";

  onPointerDown(ev: { sender: any, args: DomainChartSeriesPointerEventArgs }) {
    if (!ev.args.item) {
      return;
    }
    ev.args.item.Selected = !ev.args.item.Selected;
    if (this.chart) {
      this.chart.notifyVisualPropertiesChanged();
    }

    let self = this;
    if (ev.args.item.Selected) {
      if (fin && !this._gridRunning) {
          
          var gridApp = new fin.desktop.Application({
            name: "ExcelApp",
            uuid: this._gridUuid,
            url: "http://localhost:4200/stock-grid",
            mainWindowOptions: {
                name: "Grid Application",
                autoShow: true,
                defaultCentered: false,
                alwaysOnTop: false,
                saveWindowState: true,
                icon: "favicon.ico"
            }
        }, function() {
            this._gridRunning = true;
            gridApp.run();
            self._apps.push(gridApp);
        });
      }
    }

    if (fin) {
      if (ev.args.item.Selected) {
        fin.desktop.InterApplicationBus.publish('igDemo:chartAddToSelection', {
            item: ev.args.item
        });
      } else {
        fin.desktop.InterApplicationBus.publish('igDemo:chartRemoveFromSelection', {
          item: ev.args.item
        });
      }
    }
  }

  colorSelected(ev: { sender: any, args: AssigningCategoryStyleEventArgs }) {
    let items = ev.args.getItems(ev.args.startIndex, ev.args.endIndex);
    for (let i = 0; i < items.length; i++) {
      if (items[i].Selected) {
        ev.args.fill = "orange";
        ev.args.stroke = "darkOrange"
      }
    }
  }

  onSeriesAdded(ev: { sender: any, args: ChartSeriesEventArgs }) {
    if (ev.args.series.isFinancial) {
      let finSeries = <IgxFinancialSeriesComponent>ev.args.series;
      finSeries.isHighlightingEnabled = true;
      finSeries.isCustomCategoryStyleAllowed = true;
      finSeries.assigningCategoryStyle.subscribe((arg) => this.colorSelected(arg));
    }
  }

  onSeriesRemoved(ev: { sender: any, args: ChartSeriesEventArgs }) {
    if (ev.args.series.isFinancial) {
      let finSeries = <IgxFinancialSeriesComponent>ev.args.series;
      finSeries.assigningCategoryStyle.unsubscribe();
    }
  }


  private onMain() {
    let self = this;
    fin.desktop.InterApplicationBus.subscribe("*", "igDemo:gridAddToSelection", (m, uuid, name) => {
      let date = new Date(m.item.TimeStamp);
      for (let i = 0; i < self.stockData.length; i++) {
      if (self.stockData[i].TimeStamp.getTime() === date.getTime()) {
          self.stockData[i].Selected = true;
        }
      }
      if (this.chart) {
        this.chart.notifyVisualPropertiesChanged();
      }
    });
    fin.desktop.InterApplicationBus.subscribe("*", "igDemo:gridRemoveFromSelection", (m, uuid, name) => {
      let date = new Date(m.item.TimeStamp);
      for (let i = 0; i < self.stockData.length; i++) {
      if (self.stockData[i].TimeStamp.getTime() === date.getTime()) {
          self.stockData[i].Selected = false;
        }
      }
      if (this.chart) {
        this.chart.notifyVisualPropertiesChanged();
      }
    });
    fin.desktop.InterApplicationBus.subscribe("*", "igDemo:gridJoined", (m, uuid, name) => {
      for (let i = 0; i < this.stockData.length; i++) {
        if (this.stockData[i].Selected) {
          fin.desktop.InterApplicationBus.publish('igDemo:chartAddToSelection', {
             item: this.stockData[i]
          });
        }
      }
    });
  }

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