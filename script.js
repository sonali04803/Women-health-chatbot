const states = {
  "Rajasthan": "Hot", "Kerala": "Humid", "Punjab": "Cold", "Maharashtra": "Moderate",
  "Tamil Nadu": "Humid", "Uttarakhand": "Cold", "Gujarat": "Hot", "West Bengal": "Humid",
  "Karnataka": "Moderate", "Delhi": "Extreme", "Himachal Pradesh": "Cold", "Assam": "Humid",
  "Goa": "Humid", "Madhya Pradesh": "Moderate", "Telangana": "Hot", "Bihar": "Moderate",
  "Jharkhand": "Moderate", "Odisha": "Humid", "Chhattisgarh": "Moderate", "Jammu and Kashmir": "Cold"
};

const months = [
  "January","February","March","April","May","June","July","August","September","October","November","December"
];

const seasonalImpact = {
  "January": "Winter","February": "Winter","March": "Spring","April": "Summer","May": "Summer",
  "June": "Monsoon","July": "Monsoon","August": "Monsoon","September": "Monsoon","October": "Post-Monsoon",
  "November": "Autumn","December": "Winter"
};

const healthTips = {
  "Hot": {
    message: "☀️ Hot weather may increase dehydration and fatigue.",
    food: ["Coconut water", "Curd", "Watermelon", "Mint chutney", "Buttermilk"],
    health: ["Stay hydrated", "Avoid heavy workouts during noon", "Use sunscreen"],
    cloth: ["Wear loose cotton clothes", "Prefer light colors", "Use breathable fabrics"]
  },
  "Cold": {
    message: "❄️ Cold weather can cause cramps and bloating.",
    food: ["Dates", "Ginger tea", "Dry fruits", "Warm soups", "Turmeric milk"],
    health: ["Keep yourself warm", "Avoid cold drinks", "Do light indoor stretches"],
    cloth: ["Wear layers", "Use thermal wear", "Keep extremities warm"]
  },
  "Humid": {
    message: "💧 Humid weather may lead to skin irritation and discomfort.",
    food: ["Cucumber", "Fresh juices", "Light dals", "Steamed veggies", "Herbal teas"],
    health: ["Shower twice a day", "Avoid oily food", "Stay hydrated"],
    cloth: ["Wear breathable cotton clothes", "Avoid synthetic fabrics", "Use light colors"]
  },
  "Moderate": {
    message: "🌤 Moderate climate is usually balanced for menstrual comfort.",
    food: ["Leafy greens", "Seasonal fruits", "Whole grains", "Simple khichdi", "Lemon water"],
    health: ["Regular walks", "Stay hydrated", "Do gentle yoga", "Keep routine consistent"],
    cloth: ["Comfortable cotton wear", "Seasonal light layers", "Comfortable footwear"]
  },
  "Extreme": {
    message: "🌪 Extreme weather can affect mood and energy levels.",
    food: ["Balanced diet", "Avoid junk food", "Seasonal fruits", "Plenty of water", "Warm + cold food balance"],
    health: ["Stay indoors during weather extremes", "Adapt routine daily", "Listen to your body", "Stay layered"],
    cloth: ["Layer clothing", "Adjust fabric to weather", "Protect from strong winds"]
  }
};

const chatBox = document.getElementById("chatBox");
const form = document.getElementById("chatForm");
const input = document.getElementById("userInput");

let step = 0;
let userData = {};
let afterReport = false;

const botSay = (message, delay = 700) => {
  setTimeout(() => {
    const msg = document.createElement("div");
    msg.classList.add("bot-message");
    msg.textContent = message;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    showOptions();
  }, delay);
};

const askQuestion = () => {
  const questions = [
    "Which state were you previously living in?",
    "Which state are you currently living in?",
    "Which month is it currently?",
    "When did your last period start? (YYYY-MM-DD)"
  ];
  botSay(questions[step]);
};

const showOptions = () => {
  // Remove existing options
  const oldOptions = document.querySelectorAll(".options");
  oldOptions.forEach(o => o.remove());

  const optionsDiv = document.createElement("div");
  optionsDiv.classList.add("options");

  if (step === 0 || step === 1) {
    Object.keys(states).forEach(state => {
      const btn = document.createElement("button");
      btn.classList.add("option-btn");
      btn.textContent = state;
      btn.onclick = () => selectOption(state);
      optionsDiv.appendChild(btn);
    });
  } else if (step === 2) {
    months.forEach(month => {
      const btn = document.createElement("button");
      btn.classList.add("option-btn");
      btn.textContent = month;
      btn.onclick = () => selectOption(month);
      optionsDiv.appendChild(btn);
    });
  }

  chatBox.appendChild(optionsDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
};

const selectOption = (value) => {
  const msg = document.createElement("div");
  msg.classList.add("user-message");
  msg.textContent = value;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (!afterReport) {
    if (step === 0) userData.prevState = value;
    else if (step === 1) userData.currState = value;
    else if (step === 2) userData.month = value;

    step++;
    if (step < 3) askQuestion();
    else botSay("Please enter the date of your last period start (YYYY-MM-DD).");
  }
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userText = input.value.trim();
  if (!userText) return;

  const msg = document.createElement("div");
  msg.classList.add("user-message");
  msg.textContent = userText;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (step === 3 && !afterReport) {
    let date = new Date(userText);
    if (isNaN(date)) {
      botSay("❗ Please enter a valid date in YYYY-MM-DD format.");
      return;
    }
    userData.periodDate = date;
    input.value = "";
    generateReport();
  } else if (afterReport) {
    handleAfterReport(userText);
  }
});

const generateReport = () => {
  const { prevState, currState, month, periodDate } = userData;

  const prevWeather = states[prevState] || "Moderate";
  const currWeather = states[currState] || "Moderate";
  const season = seasonalImpact[month] || "Moderate";

  const climateSummary = `You’ve moved from a ${prevWeather} region (${prevState}) to a ${currWeather} region (${currState}) during the ${season} season.`;

  let climateAdvice = "";
  if (prevWeather !== currWeather) {
    climateAdvice = `⚠️ This transition from ${prevWeather} to ${currWeather} may cause temporary imbalance — cramps, fatigue, or mood changes are possible.`;
  } else {
    climateAdvice = `💫 Your climate remains similar, but seasonal changes (${season}) may still affect your cycle.`;
  }

  const data = healthTips[currWeather];

  const nextPeriod = new Date(periodDate);
  nextPeriod.setDate(nextPeriod.getDate() + 28);
  const ovulation = new Date(periodDate);
  ovulation.setDate(ovulation.getDate() + 14);
  const fertileStart = new Date(periodDate);
  fertileStart.setDate(fertileStart.getDate() + 11);
  const fertileEnd = new Date(periodDate);
  fertileEnd.setDate(fertileEnd.getDate() + 16);

  const report = document.createElement("div");
  report.classList.add("bot-message");
  report.innerHTML = `
    <div class="report">
      <h2>🌸 Your Health & Climate Report</h2>
      <p><b>Climate Summary:</b> ${climateSummary}</p>
      <p>${climateAdvice}</p>
      <p><b>Season Impact:</b> ${season} season affects your mood and energy levels slightly.</p>
      <p><b>${data.message}</b></p>

      <h3>🍏 Food Suggestions:</h3>
      <ul>${data.food.map(f => `<li>${f}</li>`).join('')}</ul>

      <h3>💪 Health Tips:</h3>
      <ul>${data.health.map(h => `<li>${h}</li>`).join('')}</ul>

      <h3>👗 Clothing Tips:</h3>
      <ul>${data.cloth.map(c => `<li>${c}</li>`).join('')}</ul>

      <p><b>Estimated Next Period:</b> ${nextPeriod.toDateString()}</p>
      <p><b>Ovulation Date:</b> ${ovulation.toDateString()}</p>
      <p><b>Fertile Window:</b> ${fertileStart.toDateString()} – ${fertileEnd.toDateString()}</p>
    </div>
  `;
  chatBox.appendChild(report);
  chatBox.scrollTop = chatBox.scrollHeight;

  afterReport = true;
  botSay("Before we finish, could you tell me if you’ve faced any previous issues like cramps, irregular periods, dizziness, or mood swings?");
};

const handleAfterReport = (response) => {
  const text = response.toLowerCase();
  input.value = "";

  if (text.includes("cramp")) {
    botSay("🌿 Cramps can be painful — try light stretches, warm fluids, and magnesium-rich foods.");
  } else if (text.includes("irregular")) {
    botSay("💗 Irregular periods may be linked to stress or hormones — yoga and balanced sleep can help regulate them.");
  } else if (text.includes("mood")) {
    botSay("🧘 Mood swings? Meditation, breathing exercises, and vitamin B help a lot!");
  } else if (text.includes("dizzy")) {
    botSay("🥤 Dizziness can result from dehydration or low iron. Eat iron-rich foods and drink plenty of fluids.");
  } else {
    botSay("✨ That’s good to hear! Staying consistent with sleep and hydration is still important.");
  }

  botSay("💖 Remember, your body adapts with time — listen to it, rest well, and take care of yourself.");
  afterReport = false;
};

askQuestion();
