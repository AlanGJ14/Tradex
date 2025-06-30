'use client';

import { useState, useEffect } from 'react';
import { fetchNewsData, NewsData } from '../../lib/api';
import NewsCard from '../../components/news-card';
import SentimentSummary from '../../components/sentiment-summary';

export default function NewsPage() {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNewsData = async () => {
      try {
        setLoading(true);
        const data = await fetchNewsData();
        setNewsData(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las noticias. Verifica que la API esté ejecutándose.');
        console.error('Error loading news:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNewsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-4 text-lg text-muted-foreground">Cargando análisis de noticias...</span>
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

  if (!newsData) {
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
            Análisis de Sentimiento - Noticias Financieras
          </h1>
          <p className="text-muted-foreground text-lg">
            Análisis en tiempo real del sentimiento del mercado basado en noticias del NASDAQ
          </p>
        </div>

        <SentimentSummary
          generalSummary={newsData["General Summary"]}
          generalSentiment={newsData["General Sentiment"]}
          generalScore={newsData["General Score"]}
          totalArticles={newsData.Titles.length}
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newsData.Titles.map((title, index) => (
            <NewsCard
              key={index}
              title={title}
              summary={newsData.Summaries[index]}
              link={newsData.Links[index]}
              date={newsData.Dates[index]}
              sentiment={newsData.Sentiments[index]}
              score={newsData.Scores[index]}
            />
          ))}
        </div>

        {newsData.Titles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No se encontraron noticias relacionadas con NASDAQ en este momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}