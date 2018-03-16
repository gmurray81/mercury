export class StockData {
    constructor(parameters: any) {
        this.TimeStamp = parameters.TimeStamp
        this.Open = parameters.Open
        this.High = parameters.High
        this.Low = parameters.Low
        this.Close = parameters.Close
        this.Volume = parameters.Volume
    }

    public TimeStamp: Date
    public Open: number
    public High: number
    public Low: number
    public Close: number
    public Volume: number
    public Selected: boolean
}