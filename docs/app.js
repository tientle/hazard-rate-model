const config = window.STORY_CONFIG;
const $ = (selector) => document.querySelector(selector);
const pct = (value) => `${(value * 100).toFixed(1)}%`;

$("#story-title").innerHTML = config.meta.title.replace("increase rates?", "<em>increase rates?</em>");
// $("#story-dek").textContent = config.meta.dek;
$("#as-of").textContent = `AS OF ${config.meta.asOf.toUpperCase()}`;
$("#author").textContent = config.meta.author;
$("#footer-date").textContent = config.meta.asOf;
$("#hero-probability").textContent = (config.model.conditionalHazard * 100).toFixed(1);
$("#model-comparison-value").textContent = pct(config.model.conditionalHazard);
$("#market-comparison-value").textContent = config.professional.label;
$("#model-comparison-label").textContent = pct(config.model.conditionalHazard);
$("#market-comparison-label").textContent = `≈${Math.round(config.professional.marketProbability * 100)}%`;
$("#model-comparison-bar").style.setProperty("--width", pct(config.model.conditionalHazard));
$("#market-comparison-bar").style.setProperty("--width", pct(config.professional.marketProbability));
$("#takeaway-hazard").textContent = pct(config.model.conditionalHazard);
$("#takeaway-survival").textContent = pct(config.model.noHikeThroughDecember);
$("#takeaway-interval").textContent = `${Math.round(config.model.bootstrapLow * 100)}–${Math.round(config.model.bootstrapHigh * 100)}%`;
$("#source-list").innerHTML = config.sources
  .map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.label}</a></li>`)
  .join("");

document.querySelectorAll(".month-step").forEach((step) => {
  const month = config.months[Number(step.dataset.month)];
  step.querySelector(".month-pill").textContent = month.name.toUpperCase();
  step.querySelector("h3").textContent = month.scheduled
    ? `${pct(month.conditional)} hazard, ${pct(month.firstHike)} first-hike chance`
    : "No meeting, no routine hike";
  step.querySelector("p").textContent = month.note;
});

const viz = $("#viz");
const cardStage = $("#card-stage");
const cardKicker = $("#card-kicker");
const cardTitle = $("#card-title");
const cardCopy = $("#card-copy");

function setCopy(stage, kicker, title, copy) {
  cardStage.textContent = stage;
  // cardKicker.textContent = kicker;
  cardTitle.textContent = title;
  cardCopy.textContent = copy;
}

function renderCurve() {
  const max = Math.max(...config.yields.map((d) => d.value));
  viz.innerHTML = `<div class="yield-chart">
    ${config.yields.map((d) => `<div class="yield-bar-row">
      <span>${d.label}</span>
      <div class="yield-bar"><i style="--w:${(d.value / max) * 100}%;--c:${d.color}"></i></div>
      <b>${d.value.toFixed(2)}%</b>
    </div>`).join("")}
    <div class="target-line">Fed target ceiling · ${config.targetUpper.toFixed(2)}%</div>
  </div>`;
  setCopy("THE SIGNAL", "Four yields walk into a model…", "The curve gives us clues.", `Latest complete curve: ${config.latestYieldDate}.`);
}

function renderTraining() {
  const dots = Array.from({ length: 90 }, (_, i) => `<i class="${i % 19 === 3 || i % 23 === 8 ? "hike" : ""}"></i>`).join("");
  viz.innerHTML = `<div class="history-dots" aria-label="Stylized history of hike and non-hike months">${dots}</div>`;
  setCopy("THE TRAINING DATA", `${config.model.historicalHikeMonths} hike months in ${config.model.trainingMonths} months`, "History is useful.", "Hikes are rare and clustered, so the model uses regularization and time-ordered validation.");
}

function renderHazard() {
  viz.innerHTML = `<div class="hazard-dial"><b>${pct(config.model.conditionalHazard)}</b><span>conditional hazard</span></div>`;
  setCopy("THE HAZARD", "Given no earlier hike", "Almost a coin flip at a scheduled meeting.", `Bootstrap range: ${pct(config.model.bootstrapLow)}–${pct(config.model.bootstrapHigh)}. Wide on purpose.`);
}

function renderMonths() {
  viz.innerHTML = `<div class="month-line">${config.months.map((m) => `<div class="month-node ${m.scheduled ? "" : "off"}">
    <i style="--scale:${Math.max(m.firstHike, .03)}"></i><b>${m.short}</b><span>${pct(m.firstHike)} first</span>
  </div>`).join("")}</div>`;
  setCopy("THE TIMELINE", "Hazard × survival", "Later does not mean likelier.", "Each later first-hike probability must survive every earlier opportunity.");
}

function renderMonth(index) {
  const month = config.months[index];
  viz.innerHTML = `<div class="single-month">
    <div class="big-month">${month.short}</div>
    <div class="prob-row"><span>Conditional hazard</span><b>${pct(month.conditional)}</b></div>
    <div class="prob-row"><span>First-hike probability</span><b>${pct(month.firstHike)}</b></div>
    <div class="prob-row"><span>Meeting</span><b>${month.meeting}</b></div>
    <div class="survival-track" title="Survival after ${month.name}"><i style="--width:${month.survivalAfter * 100}%"></i></div>
  </div>`;
  setCopy(`${month.name.toUpperCase()} 2026`, month.scheduled ? "A scheduled decision" : "Calendar check", month.note, `${pct(month.survivalAfter)} probability of reaching the next month without a hike.`);
}

function renderScene(step) {
  const scene = step.dataset.scene;
  if (scene === "curve") renderCurve();
  if (scene === "train") renderTraining();
  if (scene === "hazard") renderHazard();
  if (scene === "months") renderMonths();
  if (scene === "month") renderMonth(Number(step.dataset.month));
}

const steps = [...document.querySelectorAll(".step")];
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    steps.forEach((step) => step.classList.remove("is-active"));
    entry.target.classList.add("is-active");
    renderScene(entry.target);
  });
}, { rootMargin: "-38% 0px -42% 0px", threshold: 0 });

steps.forEach((step) => observer.observe(step));
renderCurve();

window.addEventListener("scroll", () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  $("#progress-bar").style.width = `${scrollable ? (window.scrollY / scrollable) * 100 : 0}%`;
}, { passive: true });
