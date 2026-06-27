// Players names

let player1in = document.getElementById("player-one-name-input");
let player2in = document.getElementById("player-two-name-input");
let playerNamesBtn = document.querySelector(".players-data button");
let playerNamesDiv = document.querySelector(".players-data");
let player1h1 = document.querySelector(
  ".main-content main .score .player-one .player-name",
);
let player2h1 = document.querySelector(
  ".main-content main .score .player-two .player-name",
);

let player1name, player2name;
let scoreLimit = document.getElementById("points-limit");
let scoreLimitIn;

function playerNameCheckInputsValue() {
  if (
    player1in.value === "" ||
    player2in.value === "" ||
    scoreLimit.value === ""
  ) {
    playerNamesBtn.classList.add("unclick");
  } else {
    playerNamesBtn.classList.remove("unclick");
  }
}

player1in.addEventListener("input", playerNameCheckInputsValue);
player2in.addEventListener("input", playerNameCheckInputsValue);
scoreLimit.addEventListener("input", playerNameCheckInputsValue);

playerNamesBtn.addEventListener("click", () => {
  if (!playerNamesBtn.classList.contains("unclick")) {
    player1name = player1in.value;
    player2name = player2in.value;
    playerNamesDiv.classList.add("close");
    setNames();
  } else return;
});

function setNames() {
  player1h1.textContent = player1name;
  player2h1.textContent = player2name;
  scoreLimitIn = Number(scoreLimit.value);
}

// score
let player1scoreP = document.querySelector(
  ".main-content main .score .player-one p",
);
let player2scoreP = document.querySelector(
  ".main-content main .score .player-two p",
);

let player1score = 0;
let player2score = 0;

function initScore() {
  player1scoreP.textContent = player1score;
  player2scoreP.textContent = player2score;
}

initScore();

// next question
let nextQuesDiv = document.querySelector(".next-ques");
let nextQuesBtn = document.querySelector(".next-ques button");

nextQuesBtn.addEventListener("click", () => {
  nextQuesDiv.classList.add("close");
  setQues();
});

function checkAllUnclicked() {
  const allAnswers = document.querySelectorAll(".answer");

  const unclickedAnswers = document.querySelectorAll(".answer.unclick");

  if (allAnswers.length === unclickedAnswers.length) {
    nextQuesDiv.classList.remove("close");
  }
}

// winning page
let winPage = document.querySelector(".win-page");
let winnerName, loserName, winnerScore, loserScore;
let winnerNameP = document.querySelector(".winner .winner-name");
let loserNameP = document.querySelector(".loser .loser-name");
let winnerScoreP = document.querySelector(".winner .winner-score");
let loserScoreP = document.querySelector(".loser .loser-score");

function setWinning() {
  if (player1score > player2score) {
    winnerName = player1name;
    winnerScore = player1score;
    loserName = player2name;
    loserScore = player2score;
  } else {
    winnerName = player2name;
    winnerScore = player2score;
    loserName = player1name;
    loserScore = player1score;
  }
  winnerNameP.textContent = winnerName;
  winnerScoreP.textContent = winnerScore;
  loserNameP.textContent = loserName;
  loserScoreP.textContent = loserScore;
  winPage.classList.remove("close");
  confetti({
    particleCount: 250,
    spread: 200,
    origin: { y: 0.6 },
  });
}

function calcScore() {
  let currentAns;
  answersDiv.addEventListener("click", (e) => {
    let target = e.target;
    currentAns = target.closest(".answer");
    poi = Number(currentAns.querySelector(".point-span span").textContent);
    if (target.closest("button.add-to-player-one")) {
      currentAns.classList.add("unclick");
      player1score += poi;
    }
    if (target.closest("button.add-to-player-two")) {
      currentAns.classList.add("unclick");
      player2score += poi;
    }
    checkAllUnclicked();
    initScore();
    console.log(player1score);
    console.log(player2score);
    console.log(scoreLimitIn);
    if (player1score >= scoreLimitIn || player2score >= scoreLimitIn) {
      setWinning();
    } else return;
  });
}

// Set all categories
let allCateg = Object.keys(data);
let selCategoriesDiv = document.querySelector(".select-category .categories");

function setCategContainer() {
  selCategoriesDiv.innerHTML = "";
  for (let i = 0; i < allCateg.length; i++) {
    let c = document.createElement("div");
    c.classList.add("category");
    c.innerHTML = `
      <input type="checkbox" name="select-category-checkbox" id="${data[allCateg[i]].id}-category">
      <label for="${data[allCateg[i]].id}-category">${data[allCateg[i]].ar}</label>`;
    selCategoriesDiv.appendChild(c);
  }
}

setCategContainer();

// Select categories
let selCategDiv = document.querySelector(".select-category");
let selCategBtn = document.querySelector(".select-category button");
let categBtns = document.querySelectorAll(".select-category .category input");

function selCatCheckInputsValue() {
  let checkedItems = document.querySelectorAll(
    ".select-category .category input:checked",
  );

  if (checkedItems.length > 0) {
    selCategBtn.classList.remove("unclick");
  } else {
    selCategBtn.classList.add("unclick");
  }
}

let currentCateg = [];
let currentData = {};
let currentQues = [];
let quesToken = [];

let questionH1 = document.querySelector(".main-content main .question h1");
let answersDiv = document.querySelector("aside.answers");

categBtns.forEach((cat) => {
  cat.addEventListener("change", selCatCheckInputsValue);
});

selCategBtn.addEventListener("click", () => {
  if (!selCategBtn.classList.contains("unclick")) {
    categBtns.forEach((categ) => {
      if (categ.checked) {
        currentCateg.push(categ.id.split("-")[0]);
      } else return;
    });
    for (let i = 0; i < currentCateg.length; i++) {
      currentData[currentCateg[i]] = data[currentCateg[i]];
    }
    setQuesArr();
    selCategDiv.classList.add("close");
  } else return;
});

// set questions
let currentQuestion;

function setQuesArr() {
  for (let i = 0; i < currentCateg.length; i++) {
    for (let o = 0; o < currentData[currentCateg[i]].qs.length; o++) {
      currentQues.push(currentData[currentCateg[i]].qs[o]);
    }
  }
  setQues();
  // console.log(currentQues);
}

function setQues() {
  if (currentQues.length === 0) {
    return;
  }

  // اختيار مؤشر عشوائي
  let random = Math.floor(Math.random() * currentQues.length);

  // استخراج السؤال وحذفه من المصفوفة الأصلية في خطوة واحدة
  // splice تعيد مصفوفة تحتوي على العناصر المحذوفة، لذا نأخذ العنصر الأول [0]
  currentQuestion = currentQues.splice(random, 1)[0];

  // console.log("السؤال المختار:", currentQuestion);
  // console.log("عدد الأسئلة المتبقية:", currentQues.length);

  setQuestionDiv();
}

function setQuestionDiv() {
  // question
  questionH1.textContent = currentQuestion.q;

  // answers
  answersDiv.innerHTML = "";
  for (let f = 0; f < currentQuestion.ans.length; f++) {
    let a = document.createElement("div");
    a.classList.add("answer");
    a.innerHTML = `
      <p class="point-span"><span>${currentQuestion.ans[f].points}</span></p>
      <h1><span>${currentQuestion.ans[f].text}</span></h1>
      <button title="أضف للاعب ${player1name}" class="add-to-player-one">
          <i class="fa-solid fa-circle-plus"></i>
      </button>
      <button title="أضف للاعب ${player2name}" class="add-to-player-two">
          <i class="fa-solid fa-circle-plus"></i>
      </button>`;
    answersDiv.appendChild(a);
  }

  calcScore();
}

let nextQuesMainBtn = document.querySelector(".btn-div");
nextQuesMainBtn.addEventListener("click", () => {
  setQues();
});
