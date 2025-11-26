// Utility: clamp value
function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

// Grab elements
const temperatureInput = document.getElementById("temperature");
const temperatureValue = document.getElementById("temperature-value");
const maxTokensInput = document.getElementById("max-tokens");
const maxTokensValue = document.getElementById("max-tokens-value");
const safetyModeInput = document.getElementById("safety-mode");
const safetyLabel = document.getElementById("safety-label");
const samplingLabel = document.getElementById("sampling-label");
const samplingTopPBtn = document.getElementById("sampling-top-p");
const samplingTopKBtn = document.getElementById("sampling-top-k");

const promptInput = document.getElementById("prompt-input");
const promptStatus = document.getElementById("prompt-status");
const generateButton = document.getElementById("generate-button");

const summaryEl = document.getElementById("summary");
const responseAEl = document.getElementById("response-a");
const responseBEl = document.getElementById("response-b");
const metaAEl = document.getElementById("meta-a");
const metaBEl = document.getElementById("meta-b");
const behaviorNotesEl = document.getElementById("behavior-notes-text");

const presetButtons = document.querySelectorAll(".btn-preset");

// Initialize display values
temperatureValue.textContent = temperatureInput.value;
maxTokensValue.textContent = maxTokensInput.value;

// Handle sliders
temperatureInput.addEventListener("input", () => {
  temperatureValue.textContent = temperatureInput.value;
});

maxTokensInput.addEventListener("input", () => {
  maxTokensValue.textContent = maxTokensInput.value;
});

// Safety mode toggle
safetyModeInput.addEventListener("change", () => {
  if (safetyModeInput.checked) {
    safetyLabel.textContent = "Strict Safety";
    safetyLabel.style.background = "var(--danger-soft)";
    safetyLabel.style.color = "var(--danger)";
  } else {
    safetyLabel.textContent = "Standard";
    safetyLabel.style.background = "rgba(43, 48, 65, 0.9)";
    safetyLabel.style.color = "var(--text-muted)";
  }
});

// Sampling mode toggle
function setSamplingMode(mode) {
  if (mode === "top-p") {
    samplingTopPBtn.classList.add("toggle-btn-active");
    samplingTopKBtn.classList.remove("toggle-btn-active");
    samplingLabel.textContent = "Top-p style";
  } else {
    samplingTopKBtn.classList.add("toggle-btn-active");
    samplingTopPBtn.classList.remove("toggle-btn-active");
    samplingLabel.textContent = "Top-k style";
  }
}

samplingTopPBtn.addEventListener("click", () => setSamplingMode("top-p"));
samplingTopKBtn.addEventListener("click", () => setSamplingMode("top-k"));

// Preset prompts
const presets = {
  explain:
    "Explain retrieval-augmented generation (RAG) to a non-technical stakeholder using a simple analogy.",
  summarize:
    "Summarize this policy for an internal FAQ: the system logs user actions, retains them for 30 days, and allows users to export or delete their data.",
  debug:
    "I keep getting a timeout error from this API call. How would you help me debug it as a junior engineer?"
};

presetButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-preset");
    promptInput.value = presets[key] || "";
    promptStatus.textContent = "Loaded preset prompt.";
  });
});

// Generate pseudo-random but deterministic-ish variation
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function randomFromArray(arr, seed) {
  if (!arr.length) return "";
  const idx = seed % arr.length;
  return arr[idx];
}

// Detect if prompt might be "unsafe-ish"
function looksSensitive(prompt) {
  const lower = prompt.toLowerCase();
  const keywords = [
    "hack",
    "bypass",
    "jailbreak",
    "exploit",
    "self-harm",
    "suicide",
    "harm someone",
    "illegal"
  ];
  return keywords.some((k) => lower.includes(k));
}

// Generate a simulated response string based on parameters
function generateSimulatedResponse(prompt, params, variantLabel) {
  const { temperature, maxTokens, safetyMode, samplingMode } = params;
  const baseHash = simpleHash(prompt + variantLabel);
  const toneSeed = baseHash + Math.round(temperature * 10);
  const detailSeed = baseHash + maxTokens;
  const isSensitive = looksSensitive(prompt);

  const styleWordsLow = [
    "straightforward",
    "concise",
    "structured",
    "focused",
    "predictable"
  ];
  const styleWordsHigh = [
    "exploratory",
    "imaginative",
    "conversational",
    "playful",
    "speculative"
  ];

  const samplingPhrases = {
    "top-p": [
      "stays close to the most likely interpretations",
      "samples from a narrower band of high-probability ideas"
    ],
    "top-k": [
      "dips into less likely but still plausible directions",
      "pulls in more unusual phrasings and edge cases"
    ]
  };

  const safetyIntroStrict = isSensitive
    ? "Because your prompt touches on potentially sensitive or risky behavior, this response leans cautious.\n\n"
    : "";

  const styleWord =
    temperature < 0.5
      ? randomFromArray(styleWordsLow, toneSeed)
      : randomFromArray(styleWordsHigh, toneSeed);

  const samplingPhrase = randomFromArray(
    samplingPhrases[samplingMode],
    baseHash
  );

  const lengthDescriptor =
    maxTokens <= 128
      ? "short, high-signal outline"
      : maxTokens <= 320
      ? "balanced explanation with moderate detail"
      : "more expansive answer with layered detail";

  const intro =
    variantLabel === "A"
      ? `Here's a ${styleWord} answer that prioritizes clarity over flair.\n\n`
      : `Here's a ${styleWord} answer that leans into variation and nuance.\n\n`;

  const coreExplanation =
    "1. **What this response is trying to do**\n" +
    "- Restate your prompt in simpler terms.\n" +
    "- Break the idea into a few clear steps.\n" +
    "- Call out trade-offs or things to watch.\n\n" +
    "2. **How the parameters are influencing this response**\n" +
    `- Temperature is set to ${temperature.toFixed(
      1
    )}, which nudges the model toward a ${styleWord} style.\n` +
    `- The sampling mode behaves like **${samplingMode}**, which ${samplingPhrase}.\n` +
    `- Max tokens (${maxTokens}) encourages a ${lengthDescriptor}.\n\n`;

  let sensitivitySection = "";
  if (isSensitive && safetyMode) {
    sensitivitySection =
      "3. **Safety behavior**\n" +
      "- Because strict safety mode is on, the model avoids step-by-step instructions that could be misused.\n" +
      "- It focuses on high-level reasoning, cautions, and safer alternatives instead of operational detail.\n\n";
  } else if (isSensitive && !safetyMode) {
    sensitivitySection =
      "3. **Safety behavior**\n" +
      "- Safety mode is relaxed here, so the model would be more willing to discuss edge cases.\n" +
      "- In a real system, this configuration would require additional review before being exposed to end users.\n\n";
  }

  const closing =
    "4. **How you’d talk about this in an interview**\n" +
    "- Point out how a small temperature change would alter phrasing and specificity.\n" +
    "- Explain how stricter safety shifts the model from 'doing' to 'advising'.\n" +
    "- Connect these choices to the context: onboarding, support, internal tools, or external user flows.\n";

  // Soft length control by trimming paragraphs if tokens are low
  let fullText =
    safetyIntroStrict + intro + coreExplanation + sensitivitySection + closing;

  if (maxTokens <= 128) {
    // Keep intro + brief param highlight
    const trimmed = intro +
      "Because max tokens is low, this version prioritizes a compact explanation rather than full detail.\n\n" +
      "Key takeaway: you can adjust temperature, sampling, and safety to shape tone and risk — even when space is tight.";
    fullText = safetyIntroStrict + trimmed;
  } else if (maxTokens <= 192) {
    // Moderate trimming
    const paragraphs = fullText.split("\n\n");
    fullText = paragraphs.slice(0, 4).join("\n\n");
  }

  return fullText;
}

// Compare parameter sets and generate plain-language notes
function generateBehaviorNotes(paramsA, paramsB) {
  const notes = [];

  const tempDiff = paramsB.temperature - paramsA.temperature;
  if (Math.abs(tempDiff) >= 0.2) {
    notes.push(
      tempDiff > 0
        ? "Response B uses a higher temperature, so it feels more varied and less predictable than Response A."
        : "Response B uses a lower temperature, so it feels more focused and repetitive compared to Response A."
    );
  }

  const tokenDiff = paramsB.maxTokens - paramsA.maxTokens;
  if (Math.abs(tokenDiff) >= 64) {
    notes.push(
      tokenDiff > 0
        ? "Response B is allowed more tokens, so it leans into longer, more detailed explanations."
        : "Response B is constrained to fewer tokens, encouraging shorter, more compressed answers."
    );
  }

  if (paramsA.safetyMode !== paramsB.safetyMode) {
    notes.push(
      paramsB.safetyMode
        ? "Response B runs with stricter safety, so it avoids operational detail and leans into high-level guidance."
        : "Response B relaxes safety slightly, which would need guardrails before being exposed to end users."
    );
  }

  if (paramsA.samplingMode !== paramsB.samplingMode) {
    notes.push(
      paramsB.samplingMode === "top-k"
        ? "Response B samples from a slightly wider set of possibilities (top-k style), which can introduce more unusual or unexpected phrasings."
        : "Response B narrows its focus to high-probability continuations (top-p style), which tends to keep the narrative tighter."
    );
  }

  if (!notes.length) {
    notes.push(
      "Both responses use very similar parameters, so the behavioral differences will be subtle. In a real system, you would widen the gap between temperature, sampling, or safety to create a clearer contrast."
    );
  }

  return notes.join(" ");
}

// Build summary badge
function setSummary(text, type) {
  const badgeClass =
    type === "ok"
      ? "summary-badge summary-badge-ok"
      : type === "warn"
      ? "summary-badge summary-badge-warn"
      : "summary-badge summary-badge-idle";

  summaryEl.innerHTML = `
    <div class="${badgeClass}">
      ${text}
    </div>
  `;
}

// Handle main generate click
generateButton.addEventListener("click", () => {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    promptStatus.textContent = "Please enter a prompt first.";
    setSummary("No prompt provided — nothing to compare yet.", "warn");
    return;
  }

  promptStatus.textContent = "";

  // Base params (Response A) from user controls
  const paramsA = {
    temperature: parseFloat(temperatureInput.value),
    maxTokens: parseInt(maxTokensInput.value, 10),
    safetyMode: safetyModeInput.checked,
    samplingMode: samplingTopPBtn.classList.contains("toggle-btn-active")
      ? "top-p"
      : "top-k"
  };

  // Derived params (Response B) to highlight contrast
  const paramsB = {
    temperature: clamp(paramsA.temperature + 0.4, 0, 1),
    maxTokens: clamp(paramsA.maxTokens + 128, 64, 512),
    safetyMode: !paramsA.safetyMode,
    samplingMode: paramsA.samplingMode === "top-p" ? "top-k" : "top-p"
  };

  const responseA = generateSimulatedResponse(prompt, paramsA, "A");
  const responseB = generateSimulatedResponse(prompt, paramsB, "B");
  const notes = generateBehaviorNotes(paramsA, paramsB);

  responseAEl.textContent = responseA;
  responseBEl.textContent = responseB;

  metaAEl.textContent = `Temperature ${paramsA.temperature.toFixed(
    1
  )}, max tokens ${paramsA.maxTokens}, ${paramsA.samplingMode}, ${
    paramsA.safetyMode ? "strict safety" : "standard safety"
  }.`;

  metaBEl.textContent = `Temperature ${paramsB.temperature.toFixed(
    1
  )}, max tokens ${paramsB.maxTokens}, ${paramsB.samplingMode}, ${
    paramsB.safetyMode ? "strict safety" : "standard safety"
  }.`;

  behaviorNotesEl.textContent = notes;

  setSummary(
    "Comparison generated. Use the two responses and behavior notes to explain how parameter choices shape model behavior.",
    "ok"
  );
});
