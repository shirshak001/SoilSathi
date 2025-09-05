import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyBmLdHHj8_vhF0gxMdIGOLrMJ2gI8lB85s'); // Replace with your actual API key

export interface DiagnosisResponse {
  Summary: string;
  remedies: {
    Diagnosis: {
      Disease: string;
      Pathogen: string;
      Hosts: string;
      Symptoms: string;
      Lifecycle: string;
      'Environmental Triggers': string;
    };
    'Detailed Remedial Plan': {
      'Immediate Action': string;
      'Traditional Remedy': string;
      'Natural/Organic Solution': string;
      'Modern/Synthetic Solution': string;
      'Cultural Practices': string;
    };
  };
  product: {
    'Curated Product List': Array<{
      Product: string;
      'Active Ingredient': string;
      'Use Case': string;
      Type: string;
      Registration: string;
    }>;
    'Application Protocol': string;
  };
}

export const getPlantDiagnosis = async (diseaseName: string): Promise<DiagnosisResponse> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are an 'Expert Agricultural Diagnostic & Prescription System'—a multi-disciplinary agricultural advisor:

1. A veteran agronomist with decades of on-field farming and crop protection experience.
2. A plant pathologist deeply knowledgeable in microbiology, entomology, nematology, and plant physiology.
3. A data scientist skilled at analyzing peer-reviewed research, extension bulletins, FAO/ICAR/CABI reports, and regulatory pesticide databases.
4. A practitioner of indigenous farming wisdom and sustainable agriculture practices.

TASK: You will be given *only the disease name. From this, you will infer and deliver a **scientifically accurate, practical, and actionable* disease management plan.

Your response must:
- Start with a concise *Summary* (overview of the disease, severity, and prevention insight).
- Deduce likely *host crops, **causative organism with taxonomy, **pathogen lifecycle, **epidemiology, and **favorable conditions.
- Provide **balanced interventions: Traditional, Organic/Natural, and Modern/Synthetic.
- Include **specific product recommendations* with brand names, formulations, and regulatory approvals.
- Include *precise dosages, **PHI (Pre-Harvest Interval), **REI (Re-Entry Interval), and safety precautions.
- Explicitly state if any fact is uncertain or region-specific.
- Avoid vague generalizations or hallucinated information.
- Output strictly in **JSON format* with {remedies, product} keys.`;

    const userPrompt = `Disease Name: ${diseaseName}

Respond in this exact structure:

{
  "Summary": "A short, precise overview of the disease, its severity, risk to crops, and one key prevention insight.",
  "remedies": {
    "Diagnosis": {
      "Disease": "Full disease name with synonyms.",
      "Pathogen": "Causative organism with full taxonomy (Kingdom, Phylum, Class, Order, Family, Genus, Species).",
      "Hosts": "List of major susceptible crops or ornamental plants.",
      "Symptoms": "Detailed symptomology with early, mid, and late-stage indicators.",
      "Lifecycle": "Key stages of pathogen lifecycle and infection mechanism.",
      "Environmental Triggers": "Temperature, humidity, irrigation, and environmental conditions favoring infection."
    },
    "Detailed Remedial Plan": {
      "Immediate Action": "Emergency cultural and sanitation measures to contain spread.",
      "Traditional Remedy": "Proven indigenous or farmer-practiced solution (with recipe, application rate, and schedule).",
      "Natural/Organic Solution": "Certified organic treatments, biofungicides, or botanicals with exact dosages.",
      "Modern/Synthetic Solution": "Specific fungicides, bactericides, or chemicals. Include active ingredients, recommended dosage, PHI, REI, and safety precautions.",
      "Cultural Practices": "Comprehensive IPM guidelines: resistant varieties, crop rotation, irrigation adjustments, canopy management, mulching, soil health, and sanitation."
    }
  },
  "product": {
    "Curated Product List": [
      {
        "Product": "Brand name and formulation (e.g., Mancozeb 75% WP)",
        "Active Ingredient": "Specify chemical or microbial component.",
        "Use Case": "Specific target purpose.",
        "Type": "Synthetic, Organic, Biocontrol, Botanical Extract, etc.",
        "Registration": "Approval body (EPA, CIBRC, OMRI, etc.)."
      },
      {
        "Product": "Brand name and formulation",
        "Active Ingredient": "Chemical/microbial",
        "Use Case": "Purpose",
        "Type": "Synthetic/Organic/Biocontrol",
        "Registration": "Regulatory body"
      },
      {
        "Product": "Brand name and formulation",
        "Active Ingredient": "Chemical/microbial",
        "Use Case": "Purpose",
        "Type": "Synthetic/Organic/Biocontrol",
        "Registration": "Regulatory body"
      }
    ],
    "Application Protocol": "Chronological schedule for treatments: pre-planting seed treatment, foliar sprays, systemic applications, compatible mixes, and intervals. Include PPE requirements, spray calibration, and resistance management strategy."
  }
}

Rules:
- Always include a clear *Summary* at the top.
- All advice must be *scientifically accurate, actionable, and detailed*.
- State uncertainties explicitly: "Further localized research required" if applicable.
- Use precise, farmer-friendly language and standard agricultural units (g/L, mL/L, kg/ha).`;

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    try {
      const jsonResponse = JSON.parse(text);
      return jsonResponse as DiagnosisResponse;
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as DiagnosisResponse;
      }
      throw new Error('Failed to parse AI response as JSON');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};