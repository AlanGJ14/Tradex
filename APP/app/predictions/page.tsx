'use client';

import { useState, useEffect } from 'react';
import { fetchTimeSeriesData, TimeSeriesData } from '../../lib/api';
import ChartComponent from '../../components/chart-component';

export default function PredictionsPage() {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTimeSeriesData = async () => {
      try {
        setLoading(true);
        const data = await fetchTimeSeriesData();
        setTimeSeriesData(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las predicciones. Verifica que la API esté ejecutándose.');
        console.error('Error loading timeseries:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTimeSeriesData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-4 text-lg text-muted-foreground">Cargando predicciones...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
              Error al cargar los datos
            </h2>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!timeSeriesData) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-muted-foreground">
              No hay datos disponibles
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Predicciones de Mercado
          </h1>
          <p className="text-muted-foreground text-lg">
            Predicciones basadas en series temporales usando modelos de IA avanzados
          </p>
        </div>

        <ChartComponent data={timeSeriesData} />

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Datos Históricos
            </h3>
            <p className="text-2xl font-bold text-primary">
              {timeSeriesData.context.length} días
            </p>
            <p className="text-sm text-muted-foreground">
              Últimos 30 días de datos
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Predicción
            </h3>
            <p className="text-2xl font-bold text-destructive">
              {timeSeriesData.forecast.length} días
            </p>
            <p className="text-sm text-muted-foreground">
              Horizonte de predicción
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Modelo
            </h3>
            <p className="text-lg font-bold text-accent-foreground">
              Chronos T5-Small
            </p>
            <p className="text-sm text-muted-foreground">
              Amazon´s pre-trained model
            </p>
          </div>
        </div>

        <div className="mt-6 bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold text-card-foreground mb-2">
            ⚠️ Aviso Importante
          </h4>
          <p className="text-sm text-muted-foreground">
            Las predicciones mostradas son generadas por modelos de inteligencia artificial y tienen fines educativos únicamente. 
            No constituyen consejos de inversión y no deben utilizarse como base para decisiones financieras. 
            Los mercados financieros son inherentemente impredecibles y están sujetos a múltiples factores externos.
          </p>
        </div>
      </div>
    </div>
  );
}