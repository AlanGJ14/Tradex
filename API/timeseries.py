import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
from chronos import ChronosPipeline
import yfinance as yf

pipeline = ChronosPipeline.from_pretrained(
  "amazon/chronos-t5-small",
  torch_dtype=torch.bfloat16,
)

def load_data(ticker, period):
    df = yf.download(ticker, period=period)
    close_prices = df["Close"].dropna().values.astype(np.float32)
    df.reset_index(inplace=True)
    return close_prices, df["Date"]

def normalize_series(series):
    mean = series.mean()
    std = series.std()
    return (series - mean) / std, mean, std

def predict_stock(prices, prediction_length=12):
    series_norm, mean, std = normalize_series(prices)
    context = torch.tensor(series_norm, dtype=torch.float32)
    forecast = pipeline.predict(context, prediction_length)
    forecast_rescaled = forecast * std + mean
    return adjust_forecast_continuity(forecast_rescaled, prices[-1])

def json_plot(history, forecast, dates):
    prediction_lenght = len(forecast[0][0])
    last_date = dates.iloc[-1]
    forecast_index = pd.date_range(
      start=last_date + pd.Timedelta(days=1), periods=prediction_lenght, freq='D'
    )
    _, median, _ = np.quantile(forecast[0].numpy(), [0.1, 0.5, 0.9], axis=0)

    return {
        "context_dates": list(dates.astype(str)),
        "context": history.reshape(-1).tolist(),
        "forecast_dates": [str(d) for d in forecast_index],
        "forecast": median.tolist()
    }

def plot_forecast(history, forecast, dates):
    prediction_lenght = len(forecast[0][0])
    last_date = dates.iloc[-1]
    forecast_index = pd.date_range(
      start=last_date + pd.Timedelta(days=1), periods=prediction_lenght, freq='D'
    )
    low, median, high = np.quantile(forecast[0].numpy(), [0.1, 0.5, 0.9], axis=0)
    plt.plot(dates, history, label="Histórico", color="royalblue")
    plt.plot(forecast_index, median, label="Pronóstico (mediana)", color="tomato")
    plt.fill_between(forecast_index, low, high, color="tomato", alpha=0.3, label="Intervalo 80%")
    plt.legend()
    plt.grid()
    plt.show()

def adjust_forecast_continuity(forecast_rescaled, last_value):
    delta = forecast_rescaled[0][0] - last_value
    return forecast_rescaled - delta

if __name__ == "__main__":
    data, dates = load_data('^NDX', "30d")
    prediction = predict_stock(data)
    prediction = adjust_forecast_continuity(prediction, data[-1])
    plot_forecast(data, prediction, dates)