import { GoogleGenAI, Type } from "@google/genai";
import { Dataset, AnalysisResponse } from "../types";
import { getSampleData } from "../utils/dataUtils";

export const analyzeData = async (
  dataset: Dataset, 
  userQuery: string,
  history: { role: string; content: string }[] = [],
  apiKey: string
): Promise<AnalysisResponse> => {
  
  if (!apiKey) {
    return {
      answer: "API Key is missing. Please enter your Google Gemini API Key in the settings.",
    };
  }

  // Initialize client with the specific key provided for this call
  const ai = new GoogleGenAI({ apiKey });
  
  const modelId = "gemini-3-pro-preview"; // Using Pro for complex analysis
  
  const dataContext = getSampleData(dataset, 20); // Provide top 20 rows and stats
  
  const systemInstruction = `
    You are an expert Senior Data Analyst. You are analyzing a dataset named "${dataset.name}".
    
    Your goal is to answer user questions about the data accurately, professionally, and concisely.
    
    CONTEXT PROVIDED:
    1. Schema and Statistical Summary of columns.
    2. The first 20 rows of the dataset as a CSV sample.
    
    RESPONSE FORMAT:
    You must return a JSON object with the following structure:
    {
      "answer": "Your detailed markdown formatted analysis here.",
      "chart": {
        "type": "bar" | "line" | "scatter" | "area" | "pie",
        "xAxis": "column_name_for_x_axis",
        "yAxis": "column_name_for_y_axis",
        "title": "Chart Title",
        "description": "Brief explanation of the chart"
      } (OR null if no chart is relevant)
    }
    
    GUIDELINES:
    - If the user asks for trends, comparisons, or distributions, ALWAYS try to recommend a visualization (chart).
    - Ensure 'xAxis' and 'yAxis' exactly match column names from the provided schema.
    - If the data is time-series, prefer 'line' or 'area' charts.
    - If comparing categories, prefer 'bar' charts.
    - If looking for correlations, prefer 'scatter'.
    - Keep the "answer" helpful, insightful, and use formatting (bold, lists) for readability.
  `;

  const prompt = `
    ${dataContext}
    
    User Question: "${userQuery}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        thinkingConfig: {
           thinkingBudget: 2048 // Give it some budget to think about the stats
        },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            chart: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ["bar", "line", "scatter", "area", "pie"] },
                xAxis: { type: Type.STRING },
                yAxis: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
              },
              nullable: true
            }
          },
          required: ["answer"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text) as AnalysisResponse;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      answer: "I encountered an error while analyzing the data. Please check if your API Key is valid and has access to Gemini 3 Pro.",
    };
  }
};
