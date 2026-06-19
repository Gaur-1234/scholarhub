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

   let model;

try{

  model =
  genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

}
catch{

  model =
  genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

}

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
  "verdict": "",
    "recommendedRoles":[
    {
      "role":"",
      "description":"",
      "salaryRange":"",
      "requiredSkills":[],
      "growth":""
    }
  ]
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
- recommendedRoles max 10
Based on skills, projects, technologies and experience,
recommend the top 10 most suitable software industry roles.
For each role provide:

- role
- description
- salaryRange
- requiredSkills
- growth

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

  // Gemini busy fallback

  if(
    error.message &&
    (
      error.message.includes("503") ||
      error.message.includes("Service Unavailable")
    )
  ){

    return {

      atsScore: 60,

      strengths: [
        "Resume uploaded successfully"
      ],

      weaknesses: [
        "AI service temporarily unavailable"
      ],

      missingSkills: [],

      suggestions: [
        "Please try analysis again in a few minutes"
      ],

      summary:
      "Gemini is currently experiencing high demand.",

      verdict:
      "Needs Improvement"

    };

  }

  throw error;

}

};

module.exports =
analyzeResume;