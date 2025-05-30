#pip install git+https://github.com/amazon-science/chronos-forecasting.git

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
from chronos import ChronosPipeline
import yfinance as yf

ticker_symbol = '^NDX'
stock_data = yf.download(ticker_symbol, period="365d")
stock_data_close = stock_data['Close'].values
last_day_price = stock_data_close[-1][0]

pipeline = ChronosPipeline.from_pretrained(
  "amazon/chronos-t5-small",
  torch_dtype=torch.bfloat16,
)

#context must be either a 1D tensor, a list of 1D tensors,
#or a left-padded 2D tensor with batch as the first dimension
context = torch.tensor(stock_data_close, dtype=torch.float32) # shape [num_series, num_samples]
prediction_length = 12
forecast = pipeline.predict(context, prediction_length)  # shape [num_series, num_samples, prediction_length
# visualize the forecast
forecast_index = range(len(stock_data_close), len(stock_data_close) + prediction_length)

first_prediction = forecast[0][0]
forecast_adjusted = [i + last_day_price - first_prediction for i in forecast[0]] 


low, median, high = np.quantile(forecast_adjusted, [0.1, 0.5, 0.9], axis=0)
plt.figure(figsize=(8, 4))
plt.plot(stock_data_close, color="royalblue", label="historical data")
plt.plot(forecast_index, median, color="tomato", label="median forecast")
plt.fill_between(forecast_index, low, high, color="tomato", alpha=0.3, label="80% prediction interval")
plt.legend()
plt.grid()
plt.show()
