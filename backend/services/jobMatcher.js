const { GoogleGenerativeAI } =
require("@google/generative-ai");

const genAI =
new GoogleGenerativeAI(
process.env.GEMINI_API_KEY
);

const calculateJobMatches =
async (resumeText)=>{

try{

let model;

try{

model =
genAI.getGenerativeModel({
model:"gemini-2.5-flash"
});

}
catch{

model =
genAI.getGenerativeModel({
model:"gemini-1.5-flash"
});

}

const prompt = `

You are an AI Job Matching Engine.

Analyze this resume.

Return ONLY valid JSON.

Format:

{
  "jobMatches":[
    {
      "title":"",
      "match":0
    }
  ]
}

Rules:

- Recommend top 10 jobs.
- Match score between 0 and 100.
- Sort highest match first.
- Use real software industry roles.
- No explanation.
- JSON only.

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
.replace(/```json/g,"")
.replace(/```/g,"")
.trim();

return JSON.parse(cleaned);

}

catch(error){

console.log(
"JOB MATCH ERROR:",
error
);

return {

jobMatches:[
{
title:
"Software Developer",
match:70
}
]

};

}

};

module.exports =
calculateJobMatches;