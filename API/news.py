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
        self.resumenes = []
        self.sentimientos = []
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

    def agregar_resumen_y_sentimiento(self, resumen: str, sentimiento: str, score: float):
        self.resumenes.append(resumen)
        self.sentimientos.append((sentimiento.lower(), score))

    def fetch_feed(self):
        return feedparser.parse(self.rss_url)

    def analyze_sentiment(self, text: str):
        result = self.pipe(text)[0]
        return result['label'], result['score']

    def run(self):
        dictionary = {"Titles": [], 
                      "Links":[], 
                      "Dates":[], 
                      "Summaries":[], 
                      "Sentiments": [],
                      "Scores": [],
                      "General Summary": None, 
                      "General Sentiment": None, 
                      "General Score": None}
        
        feed = self.fetch_feed()
        for entry in feed.entries:
            if self.keyword not in entry.summary.lower():
                continue

            dictionary["Titles"].append(entry.title)
            dictionary["Links"].append(entry.link)
            dictionary["Dates"].append(entry.published)
            dictionary["Summaries"].append(entry.summary)

            label, score = self.analyze_sentiment(entry.summary)
            self.agregar_resumen_y_sentimiento(entry.summary, label, score)

            dictionary["Sentiments"].append(label)
            dictionary["Scores"].append(score)

            if label == 'positive':
                self.total_score += score
                self.num_articles += 1
            elif label == 'negative':
                self.total_score -= score
                self.num_articles += 1
        
        resumen = self.generar_resumen_general()
        sentimiento, score = self.calcular_sentimiento_absoluto()
        dictionary["General Summary"] = resumen
        dictionary["General Sentiment"] = sentimiento
        dictionary["General Score"] = score

        return dictionary

    def dividir_en_fragmentos(self, texto, max_palabras=400):
        palabras = texto.split()
        for i in range(0, len(palabras), max_palabras):
            yield " ".join(palabras[i:i+max_palabras])

    def generar_resumen_general(self):
        if not self.resumenes:
            return "No hay resúmenes disponibles."

        texto_completo = " ".join(self.resumenes)
        fragmentos = list(self.dividir_en_fragmentos(texto_completo))

        resúmenes_intermedios = []
        for fragmento in fragmentos:
            resumen = self.summarizer(fragmento, max_length=130, min_length=30, do_sample=False)[0]['summary_text']
            resúmenes_intermedios.append(resumen)

        resumen_final = self.summarizer(" ".join(resúmenes_intermedios), max_length=150, min_length=50, do_sample=False)[0]['summary_text']
        return resumen_final
    
    def calcular_sentimiento_absoluto(self):
        if not self.sentimientos:
            return "Sin datos", 0.0

        total_score = 0
        count = 0

        for label, score in self.sentimientos:
            if label == 'positive':
                total_score += score
                count += 1
            elif label == 'negative':
                total_score -= score
                count += 1

        if count == 0:
            return "Neutral", 0.0

        promedio = total_score / count
        sentimiento_final = (
            "Positive" if promedio >= 0.15
            else "Negative" if promedio <= -0.15
            else "Neutral"
        )

        return sentimiento_final, promedio