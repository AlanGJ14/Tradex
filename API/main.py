from fastapi import FastAPI
import timeseries
import news

app = FastAPI()
TICKER = "^NDX"
KEYWORD = "Nasdaq"

analyzer = news.FinancialSentimentAnalyzer(TICKER, KEYWORD)
data, dates = timeseries.load_data(TICKER, "30d")

@app.get("/timeseries")
def predict():
    prediction = timeseries.predict_stock(data)
    return timeseries.json_plot(data, prediction, dates)

@app.get("/news")
def sentiment():
    return analyzer.run()