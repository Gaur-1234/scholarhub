const {
  GoogleGenerativeAI
} = require("@google/generative-ai");

const genAI =
new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const analyzeResume =
async (resumeText) => {

  try {

    const model =
    genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const prompt = `

You are an ATS Resume Analyzer.

Analyze this resume and return ONLY valid JSON.

Format:

{
  "atsScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingSkills": [],
  "suggestions": [],
  "summary": "",
  "verdict": ""
}

Rules:

- ATS score between 0 and 100
- strengths max 5
- weaknesses max 5
- missingSkills max 10
- suggestions max 5
- summary under 100 words
- verdict should be:
  Excellent Resume
  Good Resume
  Average Resume
  Needs Improvement

Resume:

${resumeText}

`;

    const result =
    await model.generateContent(
      prompt
    );

    const response =
    result.response.text();

    const cleaned =
    response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(
      cleaned
    );

  }

  catch (error) {

    console.log(
      "GEMINI ERROR:",
      error
    );

    throw error;

  }

};

module.exports =
analyzeResume;