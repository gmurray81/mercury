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
    public tickerHistories = {}


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
            stockRecord.Selected = false;
            return stockRecord
        }
    }

    public getTickerHistory(stock: WikiPriceData): StockData[] {
        if (this.tickerHistories[stock.Ticker])
            return this.tickerHistories[stock.Ticker]
        else
            return this.tickerHistories[stock.Ticker] = this.generateStockHistory(stock)
    }

    generateStockHistory(finalStockRecord: WikiPriceData): StockData[] {
        const stockHistory = []
        let previousStockRecord = new StockData(finalStockRecord)

        for (let i = 0; i < 200; i++) {
            const nextDate = new Date(previousStockRecord.TimeStamp.getTime() - 1 * 24 * 60 * 60 * 1000)

            const stockPricesOfTheDay = []
            let previousPrice = previousStockRecord.Open
            for (let j = 0; j < 4; j++) {
                const nextPrice = simulatePriceChange(previousPrice)
                stockPricesOfTheDay.push(nextPrice)
                previousPrice = nextPrice
            }
            stockPricesOfTheDay.sort((i1, i2) => i1 - i2)
            const nextHigh = stockPricesOfTheDay.pop()
            let nextOpen
            let nextClose
            if (Math.round(Math.random())) {
                nextOpen = stockPricesOfTheDay.pop()
                nextClose = stockPricesOfTheDay.pop()
            } else {
                nextClose = stockPricesOfTheDay.pop()
                nextOpen = stockPricesOfTheDay.pop()
            }
            const nextLow = stockPricesOfTheDay.pop()

            const nextStockRecord = new StockData({
                TimeStamp: nextDate,
                Open: nextOpen,
                High: nextHigh,
                Low: nextLow,
                Close: nextClose,
                Volume: previousStockRecord.Volume
            })
            stockHistory.push(nextStockRecord)
            previousStockRecord = nextStockRecord
        }

        return stockHistory.sort((i1, i2) => i1.TimeStamp.getTime() - i2.TimeStamp.getTime())

        function simulatePriceChange(previousPrice: number): number {
            const percentageAdjustment = ((Math.random() - 1) / 10)
            const nextPrice = previousPrice + 2 * percentageAdjustment
            return nextPrice
        }
    }
}