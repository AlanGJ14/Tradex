import Prueba_AS
import ResumenGeneral

if __name__ == "__main__":
    ticker = "^NDX"
    keyword = "Nasdaq"

    analyzer = Prueba_AS.FinancialSentimentAnalyzer(ticker, keyword)
    analyzer.run()
    
    resumen_general = ResumenGeneral.ResumenGeneral()
    analizador = Prueba_AS.FinancialSentimentAnalyzer(ticker, keyword)

    feed = analizador.fetch_feed()

    for entry in feed.entries:
        if keyword.lower() not in entry.summary.lower():
            continue

        label, score = analizador.analyze_sentiment(entry.summary)

        resumen_general.agregar_resumen_y_sentimiento(entry.summary, label, score)

        print(f'Titulo: {entry.title}')
        print(f'Sentiment: {label}, Score: {score}')
        print('-' * 40)

    resumen_general.mostrar_resultado_final()
