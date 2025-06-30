interface SentimentSummaryProps {
    generalSummary: string;
    generalSentiment: string;
    generalScore: number;
    totalArticles: number;
}

export default function SentimentSummary({
    generalSummary,
    generalSentiment,
    generalScore,
    totalArticles
}: SentimentSummaryProps) {
    const getSentimentColor = (sentiment: string) => {
        switch (sentiment.toLowerCase()) {
            case 'positive':
                return 'text-green-600 dark:text-green-400';
            case 'negative':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    const getSentimentBg = (sentiment: string) => {
        switch (sentiment.toLowerCase()) {
            case 'positive':
                return 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800';
            case 'negative':
                return 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800';
            default:
                return 'bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800';
        }
    };

    const getSentimentIcon = (sentiment: string) => {
        switch (sentiment.toLowerCase()) {
            case 'positive':
                return '📈';
            case 'negative':
                return '📉';
            default:
                return '➖';
        }
    };

    return (
        <div className={`rounded-xl p-6 border-2 ${getSentimentBg(generalSentiment)} mb-8`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-card-foreground flex items-center gap-3">
                    {getSentimentIcon(generalSentiment)}
                    Resumen General del Sentimiento
                </h2>
                <div className="text-right">
                    <div className={`text-3xl font-bold ${getSentimentColor(generalSentiment)}`}>
                        {generalSentiment}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Score: {generalScore.toFixed(3)}
                    </div>
                </div>
            </div>

            <div className="bg-background/50 rounded-lg p-4 mb-4">
                <p className="text-card-foreground leading-relaxed">
                    {generalSummary}
                </p>
            </div>

            <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Basado en {totalArticles} artículos analizados</span>
                <span>Nasdaq (^NDX)</span>
            </div>
        </div>
    );
}