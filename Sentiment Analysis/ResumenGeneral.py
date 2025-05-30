from transformers import pipeline


class ResumenGeneral:
    def __init__(self):
        self.resumenes = []
        self.sentimientos = []
        self.summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

    def agregar_resumen_y_sentimiento(self, resumen: str, sentimiento: str, score: float):
        self.resumenes.append(resumen)
        self.sentimientos.append((sentimiento.lower(), score))

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

        # Hacer un resumen final de todos los resúmenes intermedios
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

    def mostrar_resultado_final(self):
        resumen = self.generar_resumen_general()
        sentimiento, score = self.calcular_sentimiento_absoluto()
        print("\n===== RESUMEN GENERAL =====")
        print(resumen)
        print(f"\nSentimiento Absoluto: {sentimiento} ({score})")
