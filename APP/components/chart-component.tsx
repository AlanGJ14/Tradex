import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TimeSeriesData } from '../lib/api';

interface ChartComponentProps {
    data: TimeSeriesData;
}

export default function ChartComponent({ data }: ChartComponentProps) {
    // Combinar datos históricos y predicciones
    const chartData = [
        ...data.context_dates.map((date, index) => ({
            date: new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
            historical: data.context[index],
            forecast: null,
        })),
        ...data.forecast_dates.map((date, index) => ({
            date: new Date(date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
            historical: null,
            forecast: data.forecast[index],
        }))
    ];

    const currentPrice = data.context[data.context.length - 1];
    const lastForecast = data.forecast[data.forecast.length - 1];
    const change = lastForecast - currentPrice;
    const changePercent = ((change / currentPrice) * 100);

    return (
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-card-foreground mb-2">
                        Predicción NASDAQ (^NDX)
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold">
                            Precio actual: ${currentPrice.toFixed(2)}
                        </span>
                        <span className={`font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-muted-foreground">Predicción a 12 días</div>
                    <div className="text-xl font-bold">${lastForecast.toFixed(2)}</div>
                </div>
            </div>

            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="date"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                color: 'hsl(var(--card-foreground))'
                            }}
                            formatter={(
                                value: string | number,
                                name: string
                            ): [string, string] => {
                                let num: number | null = null;
                                if (typeof value === 'number') num = value;
                                else if (typeof value === 'string' && !isNaN(Number(value))) num = Number(value);
                                return [
                                    num !== null ? `$${num.toFixed(2)}` : 'N/A',
                                    name === 'historical' ? 'Histórico' : 'Predicción'
                                ];
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="historical"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={false}
                            name="Histórico"
                            connectNulls={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="forecast"
                            stroke="hsl(var(--destructive))"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            name="Predicción"
                            connectNulls={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 text-xs text-muted-foreground text-center">
                * Las predicciones se basan en modelos de series temporales y pueden no reflejar la realidad del mercado
            </div>
        </div>
    );
}