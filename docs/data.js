/*
  EDIT THIS FILE to update the story without touching the visualization code.
  Probabilities use decimals: 0.477 = 47.7%.
*/
window.STORY_CONFIG = {
  meta: {
    title: "Will the Fed increase rates?",
    dek: "Using Treasury yields across different maturities (e.g., 3-month, 6-month, 10-year, and 30-year) to estimate the probability of a Federal Reserve interest-rate hike in September, October, November, and December 2026.",
    asOf: "September 14, 2026",
    author: "Tien Le",
  },

  model: {
    conditionalHazard: 0.477,
    bootstrapLow: 0.323,
    bootstrapHigh: 0.767,
    noHikeThroughDecember: 0.143,
    trainingMonths: 211,
    historicalHikeMonths: 20,
  },

  yields: [
    { label: "3-month", value: 4.07, color: "#6c63ff" },
    { label: "6-month", value: 4.12, color: "#ff4f8b" },
    { label: "10-year", value: 4.96, color: "#ff9f1c" },
    { label: "30-year", value: 5.35, color: "#00a896" },
  ],
  targetUpper: 3.75,
  latestYieldDate: "September 11, 2026",

  months: [
    {
      name: "September",
      short: "SEP",
      meeting: "September 15–16",
      conditional: 0.477,
      firstHike: 0.477,
      survivalAfter: 0.523,
      scheduled: true,
      note: "The first opportunity in our forecast window.",
    },
    {
      name: "October",
      short: "OCT",
      meeting: "October 27–28",
      conditional: 0.477,
      firstHike: 0.249,
      survivalAfter: 0.273,
      scheduled: true,
      note: "October only becomes the first hike if September passes without one.",
    },
    {
      name: "November",
      short: "NOV",
      meeting: "No scheduled meeting",
      conditional: 0,
      firstHike: 0,
      survivalAfter: 0.273,
      scheduled: false,
      note: "No regular FOMC meeting means a structural zero in this model.",
    },
    {
      name: "December",
      short: "DEC",
      meeting: "December 8–9",
      conditional: 0.477,
      firstHike: 0.130,
      survivalAfter: 0.143,
      scheduled: true,
      note: "For December to be first, both September and October must pass without a hike.",
    },
  ],

  professional: {
    marketProbability: 0.90,
    label: "about 90%",
    description: "September probability implied by fed-funds futures and reported by Reuters on September 14.",
  },

  sources: [
    {
      label: "Federal Reserve H.15 Treasury series via FRED",
      url: "https://fred.stlouisfed.org/categories/115",
    },
    {
      label: "Federal funds target range via FRED",
      url: "https://fred.stlouisfed.org/series/DFEDTARU",
    },
    {
      label: "Official 2026 FOMC calendar",
      url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    },
    {
      label: "Reuters professional forecast comparison",
      url: "https://www.reuters.com/business/goldman-sachs-now-expects-fed-hike-rates-september-2026-09-14/",
    },
  ],
};
