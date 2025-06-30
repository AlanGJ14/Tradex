interface NewsCardProps {
    title: string;
    summary: string;
    link: string;
    date: string;
    sentiment: string;
    score: number;
}

export default function NewsCard({ title, summary, link, date, sentiment, score }: NewsCardProps) {
    const getSentimentColor = (sentiment: string) => {
        switch (sentiment.toLowerCase()) {
            case 'positive':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'negative':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
        }
    };

    const getSentimentBorder = (sentiment: string) => {
        switch (sentiment.toLowerCase()) {
            case 'positive':
                return 'border-l-green-500';
            case 'negative':
                return 'border-l-red-500';
            default:
                return 'border-l-gray-300';
        }
    };

    return (
        <div className={`bg-card border border-border rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${getSentimentBorder(sentiment)}`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-card-foreground line-clamp-2">
                    {title}
                </h3>
                <div className="flex flex-col items-end gap-2 ml-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSentimentColor(sentiment)}`}>
                        {sentiment}
                    </span>
                    <span className="text-sm text-muted-foreground font-mono">
                        {score.toFixed(3)}
                    </span>
                </div>
            </div>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {summary}
            </p>

            <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                    {new Date(date).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </span>
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 text-sm font-medium hover:underline transition-colors"
                >
                    Leer más →
                </a>
            </div>
        </div>
    );
}