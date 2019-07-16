const rows = document.querySelectorAll(".row");
const rowToKey = {
    103: rows[0],
    104: rows[1],
    105: rows[2],
    100: rows[3],
    101: rows[4],
    102: rows[5],
    97: rows[6],
    98: rows[7],
    99: rows[8]
};

let oneKeyAgo = 103;
let twoKeysAgo = 100;
let nextKey = 101;
let combo = 0;
let score = 0;
const player = JSON.parse(localStorage.getItem("player")) || {
    power: 0,
    highScore: 0,
    highScores: [0, 0, 0, 0, 0]
};

let lastHighScore = player.highScore;

Array.min = function(array) {
    return Math.min(...array);
};

Array.max = function(array) {
    return Math.max(...array);
};

function sortNumber(a, b) {
    return a - b;
}

const subtext = document.querySelector(".subtext");
const counter = document.querySelector(".counter");
const power = document.querySelector(".powerNumber");
const timer = document.querySelector(".timer");
const updateCounter = loss => {
    if (combo > 1) {
        counter.innerHTML = `COMBO: ${combo}`;
        timer.classList.add("active");
        counter.classList.remove("grow");
        setTimeout(() => {
            counter.classList.add("grow");
            counter.style.color = rainbow(10, combo);
        }, 10);
    } else {
        subtext.innerHTML = "";
        if (score > 0) counter.innerHTML = "";
        timer.classList.remove("active");
    }

    if (score > player.highScore) {
        player.highScore = score;
    }

    if (loss) {
        document.querySelector(".scoreNumber").innerHTML = 0;
        power.innerHTML = player.power;
    } else {
        score += combo;
        document.querySelector(".scoreNumber").innerHTML = score;
    }
};

function updateHighscores() {
    if (player.highScore > lastHighScore) {
        subtext.innerHTML = `NEW HIGH SCORE! ${player.highScore}`;
    }

    lastHighScore = player.highScore;

    if (Array.min(player.highScores) < score) {
        player.highScores.sort(sortNumber);
        player.highScores[0] = score;
        player.highScores.sort(sortNumber);
    }

    for (i = 1; i < 6; i++) {
        document.getElementById(`highScore${i}Display`).innerHTML = player.highScores[5 - i];
    }

}

const save = () => {
    localStorage.setItem("player", JSON.stringify(player));
};

const win = () => {
    timerTime = 175;
    combo++;
    updateCounter();

    save();
};

const lose = () => {
    timerTime = 175;
    oneKeyAgo = 103;
    twoKeysAgo = 100;
    nextKey = 101;
    combo = 0;
    player.power += score;
    updateCounter(true);
    updateHighscores();
    score = 0;
    counter.innerHTML = "TRY AGAIN";

    save();
};

function onLoad() {
    updateCounter(true);
    updateHighscores();
}

let timerSpeed = 10;
let timerTime = 175;
let lastTime = performance.now();
const gameLoop = time => {
    const delta = time - lastTime;
    if (combo > 1) {
        timerSpeed = combo;
        timerTime = Math.max(0, timerTime - (timerSpeed * (delta / 333.33)));
        timer.style.width = `${timerTime}px`;

        if (timerTime === 0) {
            combo = 0;
            updateCounter();
        }
    }

    lastTime = time;
    requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);

document.addEventListener("keyup", e => {
    e.preventDefault();

    if (!e.getModifierState("NumLock") && e.keyCode !== 144) alert("Please enable NumLock!");

    const keyEl = rowToKey[e.keyCode];
    keyEl.classList.remove("down");
    setTimeout(() => keyEl.classList.add("down"), 10);

    if (e.keyCode === nextKey) {
        const rect = keyEl.getBoundingClientRect();
        explode(rect.x + 25, rect.y + 25);
        win();

        twoKeysAgo = oneKeyAgo;
        oneKeyAgo = nextKey;

        if (nextKey === 101 && twoKeysAgo === 103) {
            nextKey = 104;
        } else if (nextKey === 101 && twoKeysAgo === 104) {
            nextKey = 105;
        } else if (nextKey === 101 && twoKeysAgo === 105) {
            nextKey = 102;
        } else if (nextKey === 101 && twoKeysAgo === 102) {
            nextKey = 99;
        } else if (nextKey === 101 && twoKeysAgo === 99) {
            nextKey = 98;
        } else if (nextKey === 101 && twoKeysAgo === 98) {
            nextKey = 97;
        } else if (nextKey === 101 && twoKeysAgo === 97) {
            nextKey = 100;
        } else if (nextKey === 101 && twoKeysAgo === 100) {
            nextKey = 103;
        } else if (nextKey !== 101) {
            nextKey = 101;
        }
    } else if (e.keyCode !== nextKey) {
        lose();
    }
});

// stolen from somewhere
function rainbow(numOfSteps, step) {
    let r, g, b;
    const h = step / numOfSteps;
    const i = ~~(h * 6);
    const f = h * 6 - i;
    const q = 1 - f;
    switch (i % 6) {
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    const c = `#${(`00${(~ ~(r * 255)).toString(16)}`).slice(-2)}${(`00${(~ ~(g * 255)).toString(16)}`).slice(-2)}${(`00${(~ ~(b * 255)).toString(16)}`).slice(-2)}`;
    return (c);
}