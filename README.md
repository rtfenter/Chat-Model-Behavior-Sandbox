# Chat Model Behavior Sandbox  
[![Live Demo](https://img.shields.io/badge/Live%20Demo-000?style=for-the-badge)](https://rtfenter.github.io/Chat-Model-Behavior-Sandbox/)

### A small interactive sandbox for seeing how chat model parameters shape behavior, tone, and safety.

This project is part of my **AI & ML UX Systems Series**, focused on recruiter-friendly prototypes that demonstrate applied AI reasoning, model behavior, and ML-aware product design.

The goal of this sandbox is to provide a simple, legible way to show how chat model parameters (temperature, top-k, max tokens, and safety constraints) change outputs — in a format that’s easy to use in interviews, portfolio reviews, and technical conversations.

---

## Purpose

Most AI PM interviews eventually ask some version of:

- “How do model parameters affect behavior?”  
- “What happens if you increase temperature?”  
- “How would you make the model safer or more predictable?”  

Those questions are hard to answer abstractly.

This sandbox makes those answers visible:

- You enter a prompt.  
- You adjust parameters.  
- You see the model’s behavior change in real time.

Instead of hand-waving, you can walk a recruiter or hiring manager through a clean, visual explanation of **why** the model behaves differently — and what that means for UX, safety, and product design.

---

## Features (MVP)

This prototype will include:

- **Prompt input panel**  
  - Single text box for a user/system prompt  
  - A few preset prompts (e.g., “Explain this to a 10-year-old,” “Summarize this policy,” “Help debug this code”)

- **Parameter controls**  
  - Temperature slider  
  - Top-k or top-p toggle (with simple explanation tooltips)  
  - Max tokens slider  
  - “Safety mode” toggle (e.g., stricter vs. looser constraints)  

- **Side-by-side response view**  
  - Two response panels showing outputs under different parameter sets  
  - Visual hints for differences (e.g., creativity vs. focus, length, tone)

- **Behavior summary**  
  - Short, human-readable summary of what changed between runs  
  - “Higher temperature → more varied, less predictable responses”  
  - “Stricter safety → more refusals, more guarded tone”

This tool is intentionally minimal and aimed at conceptual clarity, not full model configuration.

---

## Demo Screenshot

<img width="2804" height="2174" alt="Screenshot 2025-11-26 at 16-36-14 Chat Model Behavior Sandbox" src="https://github.com/user-attachments/assets/b94827c0-9ed0-49d9-ba9c-e9c569270715" />

---

## Behavior Flow Diagram

```
    [Prompt + Context]
              |
      +-------+--------+
      | Parameter Set A|
      | (temp, top-k,  |
      |  max tokens,   |
      |  safety mode)  |
      +-------+--------+
              |
              v
      [Model Response A]
              |
              v
      Summary: How A behaves
    (tone, length, creativity)


    [Same Prompt]
              |
      +-------+--------+
      | Parameter Set B|
      | (temp, top-k,  |
      |  max tokens,   |
      |  safety mode)  |
      +-------+--------+
              |
              v
      [Model Response B]
              |
              v
      Summary: How B behaves
    (tone, length, creativity)


    → User compares A vs B to see
      how parameters change behavior.
```

---

## Top-k vs Top-p (Nucleus Sampling)

```A simple visual for understanding how each sampling method decides which tokens the model is allowed to choose from.

Token Probability Distribution (example)
A: 0.35
B: 0.25
C: 0.15
D: 0.10
E: 0.07
F: 0.03

Top-k
------
Choose the top k tokens by probability.
If k = 3 → A, B, C are allowed.
Fixed-width selection.

Top-p (Nucleus Sampling)
------------------------
Choose the smallest set of tokens whose cumulative probability ≥ p.
If p = 0.9 → A + B + C + D (0.35 + 0.25 + 0.15 + 0.10 = 0.85, add D to reach ≥ 0.9).
Adaptive probability-based selection.

Summary
--------
• Top-k = “Take the top k tokens.” (constant size)
• Top-p = “Take tokens until probabilities add up to p.” (flexible size)
• Both control how predictable or varied the model’s next token can be.

```

---

## Why Chat Model Behavior Matters

Model behavior isn’t just a research concern — it’s a **product** concern.

Even small parameter changes can affect:

- how confident or cautious answers feel  
- how often the model refuses vs. complies  
- how repetitive or creative responses become  
- how long answers are, and whether they fit UI constraints  
- how predictable the system feels to end users  

AI PMs are expected to:

- understand these trade-offs  
- design controls that are safe and understandable  
- communicate those choices to engineers, designers, and stakeholders  

This sandbox turns those responsibilities into something you can **show**, not just describe.

---

## How This Maps to Real Systems

Each component corresponds to real model configuration concerns:

### Temperature  
Controls how deterministic vs. varied the model’s responses are.  
Product impact: creativity vs. reliability in user-facing flows.

### Top-k / Top-p  
Controls how “wide” the model samples from possible next tokens.  
Product impact: subtle changes in diversity, weird edge cases, and style.

### Max Tokens  
Controls output length.  
Product impact: latency, cost, truncation risk, and layout fit.

### Safety Mode  
Represents safety policies, guardrails, or restricted modes.  
Product impact: user trust, refusal frequency, and regulatory alignment.

### Behavior Summary  
Provides a quick explanation you can use in interviews to connect **parameter changes** to **user experience outcomes**.

This sandbox models a small but critical slice of AI product decision-making: how you tune behavior so users get responses that are both useful and predictable.

---

## Part of the AI & ML UX Systems Series

Main repo:  
https://github.com/rtfenter/AI-ML-UX-Systems-Series

This prototype is one of five recruiter-friendly tools designed to show applied AI product thinking:

- Minimal RAG Query Explorer  
- **Chat Model Behavior Sandbox** ← _this repo_  
- Model Explainer Playground (XAI Lite)  
- Prompt–Response Variation Explorer  
- Embeddings Visual Map (Mini Version)  

Each one is intentionally small, legible, and easy to demo live in an interview.

---

## Status

MVP is implemented and active.  
This sandbox will focus on clear, static front-end interactions that simulate model behavior patterns, not a full production LLM stack.

---
## Local Use

Everything runs client-side.

To run locally:

1. Clone the repo  
2. Open `index.html` in your browser  

That’s it — static HTML + JS, no backend required.
