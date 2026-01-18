
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentResult, Quadrant } from './types';

export const analyzeResults = async (
  scores: Record<string, number>,
  responses: { question: string, answer: string }[],
  lang: 'en' | 'zh'
): Promise<AssessmentResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a direct, insightful development assessor specializing in the HUMAN 3.0 model.
  Analyze development across Mind, Body, Spirit, and Vocation. 
  Identify Metatypes, Lifestyle Archetypes, and "Glitches" (AI, PEDs, etc.).
  Tell hard truths with respect. Focus on root causes, not symptoms.
  Output MUST be in ${lang === 'zh' ? 'Chinese' : 'English'}.`;

  const prompt = `Assess this profile based on HUMAN 3.0 framework:
  Average Scores (1-3): ${JSON.stringify(scores)}
  User Answers: ${JSON.stringify(responses)}
  
  Required Analysis:
  - Generate a unique METATYPE name (e.g., "The Digital Hermit", "The Fractured Visionary").
  - Identify Lifestyle Archetype (Workaholic, Seeker, Optimizer, Drifter, Specialist, Integrated).
  - Detect "False Transformations" (Knowledge without Skill).
  - Assess Glitch Risk (High for levels < 2.5).
  - Define the primary "Block" (one quadrant limiting another).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          averageLevel: { type: Type.NUMBER },
          metatype: { type: Type.STRING },
          metatypeDescription: { type: Type.STRING },
          lifestyleArchetype: { type: Type.STRING },
          lifestyleDescription: { type: Type.STRING },
          quadrantDetails: {
            type: Type.OBJECT,
            properties: {
              Mind: { type: Type.OBJECT, properties: { phase: {type: Type.STRING}, levelDescriptor: {type: Type.STRING}, truth: {type: Type.STRING} } },
              Body: { type: Type.OBJECT, properties: { phase: {type: Type.STRING}, levelDescriptor: {type: Type.STRING}, truth: {type: Type.STRING} } },
              Spirit: { type: Type.OBJECT, properties: { phase: {type: Type.STRING}, levelDescriptor: {type: Type.STRING}, truth: {type: Type.STRING} } },
              Vocation: { type: Type.OBJECT, properties: { phase: {type: Type.STRING}, levelDescriptor: {type: Type.STRING}, truth: {type: Type.STRING} } },
            }
          },
          crossQuadrantDynamics: {
            type: Type.OBJECT,
            properties: {
              primaryBlock: { type: Type.STRING },
              unlockOpportunity: { type: Type.STRING },
              hiddenPattern: { type: Type.STRING }
            }
          },
          coreProblem: { type: Type.STRING },
          strategy: {
            type: Type.OBJECT,
            properties: {
              shortTerm: { type: Type.OBJECT, properties: { daily: {type: Type.ARRAY, items: {type: Type.STRING}}, challenge: {type: Type.STRING}, metric: {type: Type.STRING} } },
              midTerm: { type: Type.OBJECT, properties: { shift: {type: Type.STRING}, skill: {type: Type.STRING}, milestone: {type: Type.STRING} } },
              longTerm: { type: Type.OBJECT, properties: { goal: {type: Type.STRING}, integration: {type: Type.STRING} } },
            }
          },
          glitchAssessment: { type: Type.STRING },
          theTruth: { type: Type.STRING },
          immediateAction: { type: Type.STRING }
        },
        required: ["averageLevel", "metatype", "metatypeDescription", "lifestyleArchetype", "coreProblem", "theTruth", "immediateAction"]
      }
    }
  });

  const data = JSON.parse(response.text);
  return {
    quadrantScores: scores as Record<Quadrant, number>,
    ...data
  };
};
