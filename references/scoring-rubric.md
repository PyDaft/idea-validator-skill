# Scoring Rubric

Use these anchors so scores mean the same thing from one idea to the next. Pick the closest anchor and adjust by 1 if the idea falls between two.

## 1-10 dimensions

### Problem severity (higher = more painful)
- **1-2**: Mild annoyance; users rarely notice.
- **3-4**: Inconvenience with an easy workaround.
- **5-6**: Real friction; workaround costs noticeable time or money.
- **7-8**: Blocks a key workflow; users complain unprompted or churn over it.
- **9-10**: Hair-on-fire; users pay for hacks, or it's a deal-breaker for buying.

### Reach (higher = more users)
- **1-2**: One customer or a handful of users.
- **3-4**: A niche segment (under 5% of users).
- **5-6**: A meaningful segment (5-25%).
- **7-8**: Most users in a core segment (25-60%).
- **9-10**: Nearly every user, or a large new market.

### Impact (higher = bigger effect per user / on company goals)
- **1-2**: Barely noticeable change.
- **3-4**: Small improvement to a secondary metric.
- **5-6**: Clear improvement to a metric we track.
- **7-8**: Moves a top-level company metric (activation, retention, revenue).
- **9-10**: Transformative; changes how users perceive the product.

### Revenue potential (higher = more money made or protected)
- **1-2**: No credible revenue link.
- **3-4**: Indirect, hard to attribute.
- **5-6**: Supports upsell or retention in one segment.
- **7-8**: Unblocks deals or measurably reduces churn.
- **9-10**: Opens a new revenue line or a large new segment.

### Strategic fit (higher = more aligned)
- **1-2**: Off-strategy; pulls the team in a new direction.
- **3-4**: Tangential.
- **5-6**: Neutral; fits the product but not current goals.
- **7-8**: Supports a stated goal or OKR.
- **9-10**: Core to the company's main bet this year.

### Confidence (higher = more evidence)
- **1-2**: Gut feel or a single anecdote.
- **3-4**: A few requests, mostly from one source.
- **5-6**: Repeated requests across several customers, or some supporting data.
- **7-8**: Quantitative data plus qualitative research agree.
- **9-10**: Validated by an experiment, prototype test or pilot.

### Effort (higher = MORE effort; this is a cost)
- **1-2**: Hours to a couple of days; config or copy change.
- **3-4**: About a sprint for one engineer.
- **5-6**: Several sprints for a small team.
- **7-8**: A quarter for a team; new infrastructure or integrations.
- **9-10**: Multi-quarter, multiple teams, or a new platform.

### Risk (higher = riskier; this is a cost)
Consider technical, adoption, legal/compliance, brand and opportunity-cost risk.
- **1-2**: Well understood and easily reversible.
- **3-4**: Minor unknowns.
- **5-6**: Meaningful unknowns in one area.
- **7-8**: Several unknowns, or hard to reverse.
- **9-10**: High chance of failure, or serious downside if it goes wrong.

## RICE score out of 10

Score Reach, Impact, Confidence and Effort each 1-10 using the anchors above, then:

RICE score (1-10) = (Reach × Impact × Confidence × (11 − Effort)) ^ (1/4)

This is the geometric mean, so effort is flipped to make higher always better. Round to one decimal. Example: R 6, I 7, C 4, E 5 → (6 × 7 × 4 × 6)^¼ = 1008^¼ ≈ 5.6/10. Note how the low confidence pulls the score down even with decent reach and impact. That's intended.

Rough reading: 7+ strong · 5-7 promising but check the weak factor · below 5 weak.

## Classic RICE number

RICE = (Reach × Impact × Confidence) ÷ Effort

Use these units (standard Intercom RICE), so the result can be ranked against other backlog items:
- **Reach**: estimated users or accounts affected per quarter (a number).
- **Impact**: 3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal.
- **Confidence**: 100% = high, 80% = medium, 50% = low. Use 50% for anything with confidence score ≤ 4.
- **Effort**: person-months.

Show the inputs, e.g. `RICE = (2,000 × 2 × 50%) ÷ 3 = 667`. If reach is unknown, give a range and the RICE range it implies.

## Value vs Effort quadrant

Value ≈ average of Impact, Reach and Revenue potential. Effort is the Effort score.

| | Low effort (≤ 5) | High effort (> 5) |
|---|---|---|
| **High value (> 5)** | Quick win: do it soon | Big bet: needs strong confidence first |
| **Low value (≤ 5)** | Fill-in: only if spare capacity | Money pit: avoid |

## Kano categories (for the chosen solution)
- **Basic expectation**: users are dissatisfied without it but not delighted by it (e.g. SSO for enterprise).
- **Performance**: more is better, linearly (e.g. speed, fewer clicks).
- **Delighter**: unexpected, creates excitement, but users don't miss it if absent.
- **Indifferent**: users don't care either way. A red flag.
