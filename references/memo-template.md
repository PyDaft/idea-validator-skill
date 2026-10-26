# PM Memo: content template

`scripts/build_memo.js` turns a JSON file with the fields below into a formatted .docx (Outfit font, 1.5 line spacing, 3 pt before/after). The script controls layout, so put your effort into the words.

## Writing rules for the memo

- **Directive, active voice.** "We should not build the two-way sync this quarter." Not "It is recommended that consideration be given to…".
- **Push back honestly.** If the idea is weak, say so in the Bottom Line and the Decision box. Pair every "no" with what would earn a "yes".
- **Standalone.** A VP who never saw the chat should follow it. Define acronyms once.
- **Short.** Most fields are 1-3 sentences. Tables carry the detail. Aim for 2-4 pages.
- `**bold**` inside any string renders as bold. Strings can be a single string or an array of strings (one paragraph each) where noted.
- Omit any optional field you have nothing real to say for; its section is skipped. Don't pad.

## Fields

```json
{
  "title": "PM Memo: Salesforce Two-Way Sync",
  "to": "Sales leadership; Product review",
  "from": "[PM name], Product",
  "date": "2026-10-26",
  "source": "Sales (Acme Corp deal, $120k ARR)",
  "subject": "Should we build a two-way Salesforce sync to close Acme?",

  "decision": "NEEDS MORE INFO",          // exactly "GO", "NO-GO" or "NEEDS MORE INFO"
  "decisionRationale": "One or two directive sentences explaining the call. For NO-GO, say parked or killed.",

  "bottomLine": ["2-4 sentences: the real problem, the call, the main reason, and what happens next."],

  "problemStatement": ["The problem in plain words, not the proposed solution."],
  "jtbd": "When [situation], [user] wants to [motivation], so they can [outcome].",
  "rootCause": ["Why users face this, from first principles."],

  "affectedUsers": {
    "summary": "Who, how many, how often. Show the estimate's reasoning.",
    "segments": [
      { "segment": "Mid-market ops managers", "size": "~120 accounts (15%)", "pain": "Re-key deal data weekly; ~2 hrs/week" }
    ]
  },

  "rice": {
    "reach":      { "score": 4, "input": "~150 accounts/qtr", "why": "..." },
    "impact":     { "score": 6, "input": "High (2)",          "why": "..." },
    "confidence": { "score": 3, "input": "Low (50%)",         "why": "One customer asking" },
    "effort":     { "score": 7, "input": "6 person-months",   "why": "..." },
    "formula": "(150 × 2 × 50%) ÷ 6 = 25",
    "normalized": "4.1 = (4 × 6 × 3 × 4)^¼"
  },

  "scorecard": [
    { "dimension": "Problem severity", "score": 6, "why": "..." }
    // all 8 dimensions: Problem severity, Reach, Impact, Revenue potential,
    // Strategic fit, Confidence, Effort (higher = more), Risk (higher = more)
  ],
  "overall": "5/10. One line on why, if it differs from the average.",
  "quadrant": "Big bet: high value, high effort",
  "kano": "Basic expectation for enterprise buyers",

  "risks": [
    { "risk": "Sync conflicts corrupt CRM data", "likelihood": "Medium", "impact": "High", "mitigation": "Ship one-way first; monitor conflict rate" }
  ],
  "premortem": ["12 months on, this failed because… (3-5 bullets)"],

  "alternatives": {
    "headers": ["Dimension", "A: Two-way sync", "B: One-way sync", "C: Zapier template", "Do nothing"],
    "rows": [
      ["User value", "High", "Medium", "Low-Medium", "None"],
      ["Effort", "6 pm", "2 pm", "1 week", "0"]
      // also: time to market, technical risk, scalability, strategic fit, reversibility
    ],
    "notes": "Optional sentence naming the recommended option."
  },

  "mentalModels": {
    "firstPrinciples": "...",
    "systems": "Product + Behavior + User + Environment: ...",
    "notTheUser": "Assumptions resting on opinion rather than evidence: ...",
    "inversion": "Summary of the pre-mortem's biggest failure mode and its guard."
  },

  "recommendation": ["What we do, in directive voice. Name the option chosen."],
  "pushback": ["The message the PM sends back to the requester: honest, respectful, with a path to yes."],
  "goCriteria": ["Evidence that would flip the decision, e.g. '5+ customers in pipeline confirm the need'"],

  "validation": ["Cheapest experiment first, then scenarios and edge cases to test"],
  "nextSteps": [
    { "action": "Call 5 mid-market customers about CRM workflow", "owner": "PM", "due": "Nov 7" }
  ],
  "openQuestions": ["Assumptions made and questions still open"]
}
```

The `//` comments above are explanation only. The real JSON file must not contain comments.
