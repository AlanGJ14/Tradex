"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Forecast {
  context_dates: string[];
  context: number[];
  forecast_dates: string[];
  forecast: number[];
}

interface Props {
  forecast: Forecast;
}

const PredictionChart: React.FC<Props> = ({ forecast }) => {
  const contextData = forecast.context_dates.map((date, index) => ({
    date,
    context: forecast.context[index],
  }));

  const forecastData = forecast.forecast_dates.map((date, index) => ({
    date: date.split(" ")[0],
    forecast: forecast.forecast[index],
  }));

  const combinedData = [
    ...contextData.map((item) => ({
      date: item.date,
      context: item.context,
      forecast: null,
    })),
    ...forecastData.map((item) => ({
      date: item.date,
      context: null,
      forecast: item.forecast,
    })),
  ];

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "1rem",
        padding: "1rem",
      }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis domain={["dataMin", "dataMax"]} stroke="#9ca3af" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="context"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#f59e0b"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictionChart;
