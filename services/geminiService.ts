import { GoogleGenAI, Type, Schema } from "@google/genai";
import { NutritionalResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Actúa como un Sistema de Análisis Nutricional Visual altamente preciso. Tu tarea es analizar la imagen de un plato de comida, identificar los alimentos presentes, estimar la cantidad visible y, basándote en bases de datos nutricionales estándar (USDA/referencias globales), calcular las calorías totales y el desglose de macronutrientes para la porción estimada.

Tu análisis debe ser una estimación basada en la apariencia visual.
`;

export const analyzeFoodImage = async (
  base64Image: string,
  context: string = ""
): Promise<NutritionalResponse> => {
  
  // Clean base64 string if it contains metadata
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  const promptText = `
    El usuario ha proporcionado una imagen de un alimento.
    Contexto Adicional: ${context ? context : 'Ninguno proporcionado'}.
    Unidad de Medida Deseada: Gramos.
    
    Analiza la imagen y devuelve los datos nutricionales.
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      nombre_plato_estimado: { type: Type.STRING },
      analisis_total: {
        type: Type.OBJECT,
        properties: {
          calorias_totales_kcal: { type: Type.NUMBER },
          proteinas_g: { type: Type.NUMBER },
          carbohidratos_g: { type: Type.NUMBER },
          grasas_g: { type: Type.NUMBER },
        },
        required: ["calorias_totales_kcal", "proteinas_g", "carbohidratos_g", "grasas_g"],
      },
      detalle_componentes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            alimento: { type: Type.STRING },
            cantidad_estimada: { type: Type.STRING },
            calorias_kcal: { type: Type.NUMBER },
            macros_g: {
              type: Type.OBJECT,
              properties: {
                proteina: { type: Type.NUMBER },
                carbohidrato: { type: Type.NUMBER },
                grasa: { type: Type.NUMBER },
              },
            },
          },
        },
      },
      aviso_precision: { type: Type.STRING },
    },
    required: ["nombre_plato_estimado", "analisis_total", "detalle_componentes", "aviso_precision"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response text from Gemini");

    // Clean potential markdown blocks just in case
    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const data = JSON.parse(text);

    // Final safety check for strict mode structure
    if (!data.analisis_total) {
       data.analisis_total = {
         calorias_totales_kcal: 0,
         proteinas_g: 0,
         carbohidratos_g: 0,
         grasas_g: 0
       };
    }

    return data as NutritionalResponse;
  } catch (error) {
    console.error("Error analyzing food:", error);
    throw error;
  }
};