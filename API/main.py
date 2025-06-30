from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import timeseries
import news
import traceback

app = FastAPI(title="Tradex API", version="1.0.0")

# Configurar CORS - Más permisivo para desarrollo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

TICKER = "^NDX"
KEYWORD = "Nasdaq"

# Inicializar el analizador al inicio
try:
    analyzer = news.FinancialSentimentAnalyzer(TICKER, KEYWORD)
    print(f"✅ Analizador inicializado para {TICKER}")
except Exception as e:
    print(f"❌ Error inicializando analizador: {e}")
    analyzer = None

@app.get("/")
def read_root():
    return {"message": "Tradex API is running", "status": "ok"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "ticker": TICKER}

@app.get("/timeseries")
def predict():
    try:
        print(f"📊 Cargando datos para {TICKER}...")
        data, dates = timeseries.load_data(TICKER, "30d")
        print(f"✅ Datos cargados: {len(data)} puntos")
        
        print("🔮 Generando predicción...")
        prediction = timeseries.predict_stock(data)
        print("✅ Predicción generada")
        
        result = timeseries.json_plot(data, prediction, dates)
        print("✅ JSON generado exitosamente")
        return result
        
    except Exception as e:
        print(f"❌ Error en /timeseries: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error generating prediction: {str(e)}")

@app.get("/news")
def sentiment():
    try:
        if analyzer is None:
            raise HTTPException(status_code=500, detail="News analyzer not initialized")
            
        print(f"📰 Analizando noticias para {KEYWORD}...")
        result = analyzer.run()
        print(f"✅ Análisis completado: {len(result.get('Titles', []))} artículos")
        return result
        
    except Exception as e:
        print(f"❌ Error en /news: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error analyzing news: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)