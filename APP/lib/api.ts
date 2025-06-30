const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface NewsData {
    Titles: string[];
    Links: string[];
    Dates: string[];
    Summaries: string[];
    Sentiments: string[];
    Scores: number[];
    "General Summary": string;
    "General Sentiment": string;
    "General Score": number;
}

export interface TimeSeriesData {
    context_dates: string[];
    context: number[];
    forecast_dates: string[];
    forecast: number[];
}

// Función helper para hacer peticiones con mejor manejo de errores
async function apiRequest<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔗 Haciendo petición a: ${url}`);

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos timeout

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log(`📡 Respuesta de ${endpoint}: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Error en ${endpoint}:`, errorText);
            throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
        }

        const data = await response.json();
        console.log(`✅ Datos recibidos de ${endpoint}:`, Object.keys(data));
        return data;

    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                throw new Error('La petición tardó demasiado tiempo. Verifica que la API esté funcionando.');
            }
            if (error.message.includes('fetch')) {
                throw new Error(`No se pudo conectar con la API en ${url}. Verifica que esté ejecutándose en el puerto 8000.`);
            }
        }
        console.error(`❌ Error en petición a ${endpoint}:`, error);
        throw error;
    }
}

export async function fetchNewsData(): Promise<NewsData> {
    return apiRequest<NewsData>('/news');
}

export async function fetchTimeSeriesData(): Promise<TimeSeriesData> {
    return apiRequest<TimeSeriesData>('/timeseries');
}

// Función para verificar si la API está disponible
export async function checkAPIHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        return response.ok;
    } catch {
        return false;
    }
}