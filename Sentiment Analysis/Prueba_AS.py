import feedparser
from transformers import pipeline

class FinancialSentimentAnalyzer:

    def __init__(self, ticker: str, keyword: str):
        self.ticker = ticker
        self.keyword = keyword.lower()
        self.pipe = pipeline("text-classification", model="ProsusAI/finbert")
        self.rss_url = f'https://finance.yahoo.com/rss/headline?s={self.ticker}'
        self.total_score = 0
        self.num_articles = 0

    def fetch_feed(self):
        return feedparser.parse(self.rss_url)

    def analyze_sentiment(self, text: str):
        result = self.pipe(text)[0]
        return result['label'], result['score']

    def process_entries(self):
        feed = self.fetch_feed()
        for entry in feed.entries:
            if self.keyword not in entry.summary.lower():
                continue

            print(f'Titulo: {entry.title}')
            print(f'Link: {entry.link}')
            print(f'Publicado: {entry.published}')
            print(f'Resumen: {entry.summary}')

            label, score = self.analyze_sentiment(entry.summary)

            print(f'Sentiment {label}, Puntuación: {score}')
            print('-' * 40)

            if label == 'positive':
                self.total_score += score
                self.num_articles += 1
            elif label == 'negative':
                self.total_score -= score
                self.num_articles += 1

    def calculate_overall_sentiment(self):
        if self.num_articles == 0:
            return "No hay artículos relevantes", 0.0

        final_score = self.total_score / self.num_articles
        sentiment = (
            "Positive" if final_score >= 0.15
            else "Negative" if final_score <= -0.15
            else "Neutral"
        )
        return sentiment, final_score

    def run(self):
        self.process_entries()
        sentiment, score = self.calculate_overall_sentiment()
        print(f'Overall Sentiment: {sentiment} ({score})')
