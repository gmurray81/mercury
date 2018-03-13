export class WikiPriceData {
    constructor(parameters: any) {
        this.Ticker = parameters.Ticker
        this.TimeStamp = parameters.TimeStamp
        this.Open = parameters.Open
        this.High = parameters.High
        this.Low = parameters.Low
        this.Close = parameters.Close
        this.Volume = parameters.Volume
        this.ExDivided = parameters.ExDivided
        this.SplitRatio = parameters.SplitRatio
        this.AdjustedOpen = parameters.AdjustedOpen
        this.AdjustedHigh = parameters.AdjustedHigh
        this.AdjustedLow = parameters.AdjustedLow
        this.AdjustedClose = parameters.AdjustedClose
        this.AdjustedVolume = parameters.AdjustedVolume
    }

    public Ticker: string
    public TimeStamp: Date
    public Open: number
    public High: number
    public Low: number
    public Close: number
    public Volume: number
    public ExDivided: number
    public SplitRatio: number
    public AdjustedOpen: number
    public AdjustedHigh: number
    public AdjustedLow: number
    public AdjustedClose: number
    public AdjustedVolume: number
}