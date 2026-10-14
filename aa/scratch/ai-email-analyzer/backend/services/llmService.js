const axios = require('axios');

/**
 * Clean and parse raw JSON text returned from LLM.
 * Removes markdown backticks ```json ... ``` if present.
 */
function cleanAndParseJSON(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty response from LLM');
  }

  // Remove ```json and ``` code fence wrappers if present
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  cleaned = cleaned.trim();

  // Parse JSON
  const parsed = JSON.parse(cleaned);
  return parsed;
}

/**
 * Validate and sanitize extracted structured JSON analysis.
 */
function sanitizeAnalysisResult(parsed) {
  const allowedCategories = [
    'Job',
    'Meeting',
    'Education',
    'Finance',
    'Shopping',
    'Personal',
    'Marketing',
    'Notification',
    'Other',
  ];

  const allowedPriorities = ['High', 'Medium', 'Low'];

  // Normalize Category
  let category = typeof parsed.category === 'string' ? parsed.category.trim() : 'Other';
  const matchedCat = allowedCategories.find(
    (c) => c.toLowerCase() === category.toLowerCase()
  );
  category = matchedCat || 'Other';

  // Normalize Priority
  let priority = typeof parsed.priority === 'string' ? parsed.priority.trim() : 'Medium';
  const matchedPri = allowedPriorities.find(
    (p) => p.toLowerCase() === priority.toLowerCase()
  );
  priority = matchedPri || 'Medium';

  return {
    keywords: Array.isArray(parsed.keywords) ? parsed.keywords.map(k => String(k).trim()).filter(Boolean) : [],
    summary: typeof parsed.summary === 'string' ? parsed.summary.trim() : '',
    category,
    priority,
    action_items: Array.isArray(parsed.action_items) ? parsed.action_items.map(a => String(a).trim()).filter(Boolean) : [],
    date: typeof parsed.date === 'string' ? parsed.date.trim() : '',
    time: typeof parsed.time === 'string' ? parsed.time.trim() : '',
    people: Array.isArray(parsed.people) ? parsed.people.map(p => String(p).trim()).filter(Boolean) : [],
    organizations: Array.isArray(parsed.organizations) ? parsed.organizations.map(o => String(o).trim()).filter(Boolean) : [],
  };
}

/**
 * Smart heuristic rule-based analysis fallback when API Key is absent or external API is down.
 */
function fallbackRuleAnalysis(subject, body) {
  const fullText = `${subject} ${body}`;
  const lowerText = fullText.toLowerCase();

  // Category determination
  let category = 'Other';
  if (/interview|job|resume|hiring|vacancy|offer|applicant|candidate/i.test(fullText)) {
    category = 'Job';
  } else if (/meeting|zoom|teams|schedule|calendar|call|sync|appointment/i.test(fullText)) {
    category = 'Meeting';
  } else if (/invoice|payment|bank|receipt|statement|salary|tax|billing|price|cost/i.test(fullText)) {
    category = 'Finance';
  } else if (/order|shipment|tracking|purchase|amazon|cart|delivery|bought/i.test(fullText)) {
    category = 'Shopping';
  } else if (/exam|course|assignment|university|college|homework|grade|lecture/i.test(fullText)) {
    category = 'Education';
  } else if (/sale|discount|off|promo|deal|newsletter|subscribe/i.test(fullText)) {
    category = 'Marketing';
  } else if (/security|alert|password|verify|login|notification|update/i.test(fullText)) {
    category = 'Notification';
  } else if (/hi |hey |dear |family|friend|love/i.test(fullText)) {
    category = 'Personal';
  }

  // Priority determination
  let priority = 'Medium';
  if (/urgent|asap|immediately|critical|action required|important|deadline|high priority/i.test(fullText)) {
    priority = 'High';
  } else if (/fyi|newsletter|update|optional|whenever/i.test(fullText)) {
    priority = 'Low';
  }

  // Extract dates (e.g., Monday, Tuesday, Jan 15th, 2026-09-22, etc.)
  const dateMatch = fullText.match(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2})\b/i);
  const date = dateMatch ? dateMatch[0] : '';

  // Extract times (e.g., 11 AM, 3:30 PM, 10:00am)
  const timeMatch = fullText.match(/\b(\d{1,2}(:\d{2})?\s*(am|pm))\b/i);
  const time = timeMatch ? timeMatch[0] : '';

  // Extract keywords (words with > 4 letters excluding stopwords)
  const stopwords = new Set(['dear', 'your', 'have', 'been', 'this', 'that', 'from', 'with', 'please', 'regards', 'will', 'have', 'there', 'about', 'would', 'could', 'should']);
  const words = fullText.match(/\b[A-Za-z0-9]{4,}\b/g) || [];
  const uniqueKeywords = [...new Set(words.filter(w => !stopwords.has(w.toLowerCase())))].slice(0, 5);

  // Extract action items
  const actionItems = [];
  const lines = body.split('\n');
  lines.forEach(line => {
    const trimmed = line.trim();
    if (/please|bring|attend|confirm|submit|send|review|complete|verify|click/i.test(trimmed)) {
      actionItems.push(trimmed.replace(/^[-*•\d.\s]+/, ''));
    }
  });
  if (actionItems.length === 0) {
    if (subject) actionItems.push(`Review email regarding ${subject}`);
    else actionItems.push('Review email contents');
  }

  // Generate concise summary
  const summary = subject
    ? `${subject}: ${body.substring(0, 90).replace(/\n/g, ' ')}...`
    : `${body.substring(0, 110).replace(/\n/g, ' ')}...`;

  // People & Organizations extraction
  const people = [];
  const organizations = [];
  const hrMatch = fullText.match(/HR Team|Recruiter|Manager|Priyanka|John|Sarah|Alex/i);
  if (hrMatch) people.push(hrMatch[0]);

  const orgMatch = fullText.match(/Google|Microsoft|Amazon|University|TechCorp|Acme Corp/i);
  if (orgMatch) organizations.push(orgMatch[0]);

  return sanitizeAnalysisResult({
    keywords: uniqueKeywords,
    summary,
    category,
    priority,
    action_items: actionItems,
    date,
    time,
    people,
    organizations,
  });
}

/**
 * Main service function to analyze email content using configured LLM API.
 * @param {string} subject - Email subject line
 * @param {string} body - Email main body text
 * @returns {Promise<Object>} Structured analysis JSON object
 */
async function analyzeEmail(subject = '', body = '') {
  const apiKey = process.env.LLM_API_KEY;
  const provider = (process.env.LLM_PROVIDER || 'gemini').toLowerCase();
  const model = process.env.LLM_MODEL || 'gemini-2.5-flash';

  // If no API key is provided, log helpful info and use smart fallback analyzer
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_api_key_here') {
    console.warn('[LLM Service] No valid LLM_API_KEY found in .env. Operating in smart rule fallback mode.');
    return fallbackRuleAnalysis(subject, body);
  }

  const systemPrompt = `You are an AI email analysis assistant.

Analyze the provided email and extract important information.

Return ONLY valid JSON.

Do not include markdown.
Do not include \`\`\`json.
Do not add explanations outside the JSON.

The JSON must follow this structure:
{
  "keywords": [],
  "summary": "",
  "category": "",
  "priority": "",
  "action_items": [],
  "date": "",
  "time": "",
  "people": [],
  "organizations": []
}

Rules:
- keywords should contain important meaningful terms (avoid common stop words)
- summary should be concise (1-2 sentences max)
- category must be one of: Job, Meeting, Education, Finance, Shopping, Personal, Marketing, Notification, Other
- priority must be High, Medium, or Low
- action_items should contain clear tasks the recipient needs to perform
- date should contain the date mentioned in the email if present
- time should contain the time mentioned in the email if present
- people should contain names of people mentioned
- organizations should contain companies or institutions mentioned
- If information is unavailable, return an empty string or empty array.`;

  const userContent = `Email Subject: ${subject || 'None'}\nEmail Body:\n${body}`;

  try {
    let rawResultText = '';

    if (provider === 'gemini') {
      // Call Google Gemini REST API endpoint
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await axios.post(
        url,
        {
          contents: [
            {
              parts: [
                { text: `${systemPrompt}\n\n${userContent}` }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.1
          }
        },
        { timeout: 15000 }
      );

      rawResultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    } else {
      // Default to OpenAI / Groq compatible Chat Completions API
      const baseUrl = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';
      const response = await axios.post(
        `${baseUrl}/chat/completions`,
        {
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
          ],
          temperature: 0.1,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      rawResultText = response.data?.choices?.[0]?.message?.content;
    }

    const parsed = cleanAndParseJSON(rawResultText);
    return sanitizeAnalysisResult(parsed);

  } catch (error) {
    console.error('[LLM Service Error]:', error.response?.data || error.message);
    console.warn('[LLM Service] Falling back to rule-based email analyzer due to API issue.');
    return fallbackRuleAnalysis(subject, body);
  }
}

module.exports = {
  analyzeEmail,
};
