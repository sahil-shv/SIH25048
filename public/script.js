let lang = "en"; // default language
let score = 0;
let puzzleAnswer = 0;

document.getElementById("langSwitch").addEventListener("click", () => {
  lang = lang === "en" ? "hi" : "en";
  document.getElementById("langSwitch").innerText =
    lang === "en" ? "Switch to हिंदी" : "Switch to English";
  newPuzzle();
});

// Generate random puzzle
function newPuzzle() {
  let a = Math.floor(Math.random() * 10) + 1;
  let b = Math.floor(Math.random() * 10) + 1;
  puzzleAnswer = a + b;
  document.getElementById("puzzle").innerText =
    lang === "hi"
      ? `${a} + ${b} कितना होगा?`
      : `What is ${a} + ${b}?`;
  document.getElementById("result").innerText = "";
}

function checkAnswer() {
  const ans = parseInt(document.getElementById("answer").value);
  if (ans === puzzleAnswer) {
    score++;
    document.getElementById("result").innerText =
      lang === "hi" ? "सही उत्तर ✅" : "Correct ✅";
  } else {
    document.getElementById("result").innerText =
      lang === "hi" ? "गलत उत्तर ❌" : "Wrong ❌";
    updateDashboard("Student", "Weak in Addition");
  }
  newPuzzle();
}

// AI Tutor Chat
async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatWindow = document.getElementById("chatWindow");

  const msg = input.value.trim();
  if (!msg) return;

  chatWindow.innerHTML += `<p><b>You:</b> ${msg}</p>`;
  input.value = "";

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, lang })
    });

    const data = await res.json();
    chatWindow.innerHTML += `<p><b>AI:</b> ${data.reply}</p>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;

  } catch (err) {
    chatWindow.innerHTML += `<p><b>AI:</b> Error, offline mode only.</p>`;
  }
}

// Teacher Dashboard
function updateDashboard(student, issue) {
  const dash = document.getElementById("dashboard");
  const li = document.createElement("li");
  li.innerText = `${student}: ${issue}`;
  dash.appendChild(li);
}

// Load first puzzle
newPuzzle();
