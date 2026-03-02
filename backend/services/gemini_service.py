import os
import json
import re
import time
import traceback
from pathlib import Path
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted
from dotenv import load_dotenv
from backend_logic import query_response, query_lease

# Load .env from the backend directory explicitly
_backend_env = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=_backend_env, override=True)

class GeminiService:
    def __init__(self):
        # API Key from .env
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables. Check .env")
        
        genai.configure(api_key=api_key)
        
        # User specifically asked for Gemini 2.5 Flash
        # We verified the model name via gensai.list_models()
        self.model_name = "models/gemini-2.5-flash" 
        self.model = genai.GenerativeModel(self.model_name)

    async def analyze_lease(self, filename: str, raw_text: str):
        # 2-minute overview summary prompt with strict JSON structure
        prompt = f"""
You are Leasify, an informational rental-lease analyzer (NOT a lawyer).
Your job: extract only what is explicitly present in the lease text and produce a short, reliable summary.
DO NOT guess. If something is missing or unclear, set it to null and explain briefly in "missing_reason". Do not use strong vocabulary,
instead opt for powerful, neutral language. Always support key outputs with an EXACT quote from the lease in "evidence_quote". Try to produce at least 7 annotations.
For questions, try to generate at least 3-5 high-priority questions that a tenant should ask their landlord to clarify potential risks or obligations in the lease. Focus on the most critical uncertainties that could impact the tenant's financial or legal situation. 
Make sure the questions are easily understood by users and directly related to the most important lease terms. If the lease text is truncated and you suspect missing sections, mark "text_incomplete": true.
INPUT
- LEASE TITLE / FILE: {filename}
- RAW TEXT (may be partial): {raw_text[:20000]}

SPEED MODE (IMPORTANT)
- Do NOT summarize the entire lease.
- Only analyze the MOST IMPORTANT 6–10 clauses that typically create financial risk or major obligations:
- For Highlights/Annotations, generate between 7-15 annotations focused on the most critical lease terms, especially those that could lead to financial risk or major obligations for the tenant. Prioritize clarity and relevance in your annotations, ensuring they directly address key points in the lease that tenants should be aware of.
  1) Rent amount & due date
  2) Security deposit & deductions
  3) Fees (late, cleaning, admin, utilities)
  4) Lease term & renewal/auto-renew
  5) Early termination / break lease
  6) Maintenance responsibilities (who pays for what)
  7) Landlord entry
  8) Subletting/guests/pets
  9) Arbitration / legal rights / attorney fees (if present)
  10) Notice periods (move-out, renewal, rent increase)

RELIABILITY RULES
- Use ONLY information that appears in the RAW TEXT.
- Every numeric value must be supported by an evidence quote.
- If multiple values exist (conflicting rent amounts, multiple terms), list the options and mark "ambiguous": true.
- Keep evidence quotes short (max 280 characters) but EXACT.
- If the text is truncated and you suspect missing sections, mark "text_incomplete": true.

OUTPUT REQUIREMENT
Return ONLY valid JSON matching this schema exactly:

{{
  "title": "{filename}",
  "text_incomplete": true/false,
  "basic_info": {{
    "address": {{
      "value": string|null,
      "evidence_quote": string|null,
      "missing_reason": string|null
    }}
  }},
  "overview": {{
    "risk_score": int,
    "overview_contents": string,
    "rent_monthly": {{
      "value": number|null,
      "evidence_quote": string|null,
      "missing_reason": string|null,
      "ambiguous": true/false
    }},
    "security_deposit": {{
      "value": number|null,
      "evidence_quote": string|null,
      "missing_reason": string|null,
      "ambiguous": true/false
    }},
    "lease_term_days": {{
      "value": int|null,
      "evidence_quote": string|null,
      "missing_reason": string|null,
      "ambiguous": true/false
    }},
    "notice_period": {{
      "value": string|null,
      "evidence_quote": string|null,
      "missing_reason": string|null
    }},
    "late_fees": {{
      "value": string|null,
      "evidence_quote": string|null,
      "missing_reason": string|null
    }},
    "early_termination": {{
      "value": string|null,
      "evidence_quote": string|null,
      "missing_reason": string|null
    }},
    "utilities": {{
      "value": string|null,
      "evidence_quote": string|null,
      "missing_reason": string|null
    }}
  }},
  "results": [
    {{
      "annotationText": "EXACT TEXT FROM THE LEASE AGREEMENT",
      "annotationLevel": "good"|"mix"|"bad",
      "annotationDesc": "CONCISE DESCRIPTION OF THE ANNOTATION, JUSTIFICATION OF LEVEL+IMPACT",
      "risk_title": string,
      "severity": "HIGH"|"MEDIUM"|"LOW",
      "evidence_location_hint": string|null
    }}
  ],
  "questions": [
    {{
      "question_priority": "high"|"medium"|"low",
      "question_explanation": string|null. Explain why this question is important and what information is missing that prevents a clear analysis. Be concise but specific.,
      "question_title": string. A concise question that a tenant should ask their landlord or property manager to clarify potential risks or obligations in the lease. Focus on the most critical uncertainties that could impact the tenant's financial or legal situation.
    }}
  ]
}}

STYLE
- overview_contents must be a list of 10-15 plain-language bullet points (using • or -) summarizing the most critical points.
- risk_contents must be <= 50 words.
- evidence_location_hint: use any available section header, clause title, or nearby keyword to help UI highlighting.
"""

        max_retries = 3
        for attempt in range(max_retries):
            try:
                print(f"Calling Gemini ({self.model_name}) for analysis... (attempt {attempt + 1}/{max_retries})")
                response = self.model.generate_content(prompt)
                response_text = response.text
                
                # Robust JSON extraction from AI markdown block
                json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                if json_match:
                    data = json.loads(json_match.group(0))
                    print("data: ", data)
                    # Double-check that full_text is present for the highlighter
                    if "full_text" not in data or len(data["full_text"]) < 100:
                        data["full_text"] = raw_text
                    
                    return data
                else:
                    print(f"Gemini output was not valid JSON: {response_text}")
                    raise Exception("AI response was not in the expected JSON format.")
                    
            except ResourceExhausted as e:
                wait_time = 35 * (attempt + 1)  # 35s, 70s, 105s
                print(f"Gemini rate limit hit (attempt {attempt + 1}/{max_retries}). Waiting {wait_time}s before retry...")
                if attempt < max_retries - 1:
                    time.sleep(wait_time)
                else:
                    print(f"All {max_retries} retries exhausted. Rate limit still active.")
                    raise Exception(
                        "Gemini free-tier rate limit reached (20 requests/day for gemini-2.5-flash). "
                        "Wait ~30 seconds and try again, or upgrade your Google AI API plan."
                    )
            except Exception as e:
                print(f"Gemini Service Detail Error: {traceback.format_exc()}")
                raise Exception("AI analysis failed at the cloud level. Try again.")

# Shared singleton for the API to use
gemini_service = GeminiService()
