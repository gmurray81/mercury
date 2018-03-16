import { Component, TemplateRef, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, Input, Output, EventEmitter, ChangeDetectionStrategy, NgZone } from '@angular/core'

import { WikiPriceData } from '../models/wikiPriceData'
import { StockDataService } from '../services/stock-data.service'
import { IgxGridComponent } from 'igniteui-angular/grid/grid.component'
import { IgxColumnComponent } from 'igniteui-angular/grid/column.component'
import { IgxGridCellComponent } from 'igniteui-angular/grid/cell.component'
import { IgxGridRowComponent } from 'igniteui-angular/grid/row.component';
import { StockData } from '../models/stockData';
import { DataType } from 'igniteui-angular/main';

declare var openfin: any;

@Component({
  selector: 'app-stock-grid',
  templateUrl: './stock-grid.component.html',
  styleUrls: ['./stock-grid.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockGridComponent implements OnInit, AfterViewInit {
  @Output() public stockSelected = new EventEmitter<StockData>()

  stockData: WikiPriceData[]
  histData: StockData[]
  boolType: DataType = DataType.Boolean;

  private currSelection: any = null;

  title = 'Grid'
  constructor(private stockDataService: StockDataService, private _ngZone: NgZone) { }
  @ViewChild('grid1') grid1: IgxGridComponent
  @ViewChild('selectedColumn') selectedColumn: IgxColumnComponent;
  @ViewChild('checkbox') checkbox: TemplateRef<any>;

  onChanged(ev: Event, cell: IgxGridCellComponent) {
    let item = this.histData[cell.rowIndex];
    item.Selected = (<HTMLInputElement>ev.target).checked;

      if (item.Selected) {
      if (fin) {
          fin.desktop.InterApplicationBus.publish('igDemo:gridAddToSelection', {
              item: item
          });
        }
      } else {
        if (fin) {
          fin.desktop.InterApplicationBus.publish('igDemo:gridRemoveFromSelection', {
              item: item
          });
        }
      }
  }

  ngOnInit() {
    this.stockData = this.stockDataService.getMarketData()
    this.histData = this.stockDataService.getHistoricData()
  }

  ngAfterViewInit() {
    this.selectedColumn.bodyTemplate = this.checkbox;
    this.grid1.width = '100%'
    this.grid1.height = '100%'
    this.grid1.cdr.detectChanges()

    if (fin !== undefined) {
        
      fin.desktop.main(() => this.onMain());
    }
  }

  private onMain() {
    let self = this;
    fin.desktop.InterApplicationBus.subscribe("*", "igDemo:chartAddToSelection", (m, uuid, name) => {
      let date = new Date(m.item.TimeStamp);
    
      
      let item: any = null;
      for (let i = 0; i < self.histData.length; i++) {
        if (self.histData[i].TimeStamp.getTime() === date.getTime()) {
          item = self.histData[i];
          
          break;
        }
      }

      item.Selected = true;
      self._ngZone.run(() => self.grid1.markForCheck());
    });

    fin.desktop.InterApplicationBus.subscribe("*", "igDemo:chartRemoveFromSelection", (m, uuid, name) => {
      let date = new Date(m.item.TimeStamp);
    
      
      let item: any = null;
      for (let i = 0; i < self.histData.length; i++) {
        if (self.histData[i].TimeStamp.getTime() === date.getTime()) {
          item = self.histData[i];
          
          break;
        }
      }

      item.Selected = false;
      self._ngZone.run(() => self.grid1.markForCheck());
    });

    fin.desktop.InterApplicationBus.publish("igDemo:gridJoined", {

    });
  }

  // onEditDone(row: IgxGridRowComponent) {
  //   let item = <StockData><any>row.rowData;
  //   if (item.Selected) {
  //     if (fin) {
  //       fin.desktop.InterApplicationBus.publish('igDemo:gridAddToSelection', {
  //           item: item
  //       });
  //     }
  //   } else {
  //     if (fin) {
  //       fin.desktop.InterApplicationBus.publish('igDemo:gridRemoveFromSelection', {
  //           item: item
  //       });
  //     }
  //   }
  // }

  onSelection(cell: IgxGridCellComponent) {
    this.stockSelected.emit(cell.row.rowData);
    // this.currSelection = cell.row.rowData;

    // if (fin) {
    //   fin.desktop.InterApplicationBus.publish('igDemo:gridSelectionChanged', {
    //       item: this.currSelection
    //   });
    // }
  }
}