import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { of } from 'rxjs/observable/of'

import { WikiPriceData } from '../models/wikiPriceData'
import { StockData } from '../models/stockData'

declare function require(url: string)
const quandleData = require('../data/quandl.json')
const alphaVantageData = require('../data/alphaVantage.json')

@Injectable()
export class StockDataService {
    public getMarketData(): WikiPriceData[] {
        return quandleData.map(toMarketData)

        function toMarketData(quandleRecord) {
            const stockRecord = new WikiPriceData(quandleRecord)
            stockRecord.TimeStamp = new Date(quandleRecord.TimeStamp)
            return stockRecord
        }
    }

    public getHistoricData(): StockData[] {
        return alphaVantageData.map(toHistoricData).sort((i1, i2) => i1.TimeStamp.getTime() - i2.TimeStamp.getTime())

        function toHistoricData(alphaVantageRecord): StockData {
            const stockRecord = new StockData(alphaVantageRecord)
            stockRecord.TimeStamp = new Date(alphaVantageRecord.TimeStamp)
            return stockRecord
        }
    }
}