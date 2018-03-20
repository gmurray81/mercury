import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, Input, NgZone } from '@angular/core'

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

    if (ev.args.item.SelectionStart >= 0) {
       let selectionStart = ev.args.item.SelectionStart;
       let selectionEnd = ev.args.item.SelectionEnd;
       for (let ind = selectionStart; ind <= selectionEnd; ind++) {
          this.stockData[ind].Selected = false;
          
          (<any>this.stockData[ind]).SelectionStart = -1;
          (<any>this.stockData[ind]).SelectionEnd = -1;

          fin.desktop.InterApplicationBus.publish('igDemo:chartRemoveFromSelection', {
            item: this.stockData[ind]
          });
       }
    } else if (ev.args.item.Selected) {
      ev.args.item.Selected = false;
    } else {
      ev.args.item.Selected = true;
    }

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

    let selected = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].Selected) {
        selected = true;
      }
    }

    for (let i = 0; i < items.length; i++) {
      if (selected) {
         items[i].SelectionStart = ev.args.startIndex;
         items[i].SelectionEnd = ev.args.endIndex;
      } else {
         items[i].SelectionStart = -1;
      }
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

    fin.desktop.InterApplicationBus.subscribe("*", "igDemo:wpfChartWindowChanged", (m, uuid, name) => {
      this.chart.windowRect = m;
    });

    fin.desktop.InterApplicationBus.subscribe("*", "igDemo:changeTicker", (m, uuid, name) => {
      this._ngZone.run(() => {
        this.stockData = this.stockDataService.getTickerHistory(m.symbol);
      });
    });


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

    fin.desktop.InterApplicationBus.subscribe("*", "igDemo:wpfChartAddToSelection", (m, uuid, name) => {
      let date = new Date(m.item.TimeStamp);
      for (let i = 0; i < self.stockData.length; i++) {
      if (self.stockData[i].TimeStamp.getFullYear() === date.getFullYear() &&
          self.stockData[i].TimeStamp.getMonth() === date.getMonth() &&
          self.stockData[i].TimeStamp.getDate() === date.getDate() &&
          self.stockData[i].TimeStamp.getHours() === date.getHours() &&
          self.stockData[i].TimeStamp.getMinutes() === date.getMinutes() &&
          self.stockData[i].TimeStamp.getSeconds() === date.getSeconds()) {
          self.stockData[i].Selected = true;
        }
      }
      if (this.chart) {
        this.chart.notifyVisualPropertiesChanged();
      }
    });
    fin.desktop.InterApplicationBus.subscribe("*", "igDemo:wpfChartRemoveFromSelection", (m, uuid, name) => {
      let date = new Date(m.item.TimeStamp);
      let item: any = null;
      for (let i = 0; i < self.stockData.length; i++) {
        if (self.stockData[i].TimeStamp.getFullYear() === date.getFullYear() &&
            self.stockData[i].TimeStamp.getMonth() === date.getMonth() &&
            self.stockData[i].TimeStamp.getDate() === date.getDate() &&
            self.stockData[i].TimeStamp.getHours() === date.getHours() &&
            self.stockData[i].TimeStamp.getMinutes() === date.getMinutes() &&
            self.stockData[i].TimeStamp.getSeconds() === date.getSeconds()) {
            item = self.stockData[i];
            break;
          }
        }

        if (item != null) {
          if (item.SelectionStart >= 0) {
            let selectionStart = item.SelectionStart;
            let selectionEnd = item.SelectionEnd;
            for (let ind = selectionStart; ind <= selectionEnd; ind++) {
               this.stockData[ind].Selected = false;
               (<any>this.stockData[ind]).SelectionStart = -1;
               (<any>this.stockData[ind]).SelectionEnd = -1;
            }
         } else if (item.Selected) {
           item.Selected = false;
         } else {
           //item.Selected = true;
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
  constructor(private stockDataService: StockDataService, private _ngZone: NgZone) { }

  ngOnInit() {
    this.stockData = this.stockDataService.getTickerHistory("AAPL")
  }

  @Input()
  public set stockDisplayed(stockSelection: string) {
    this.stockData = this.stockDataService.getTickerHistory(stockSelection)
  }
}