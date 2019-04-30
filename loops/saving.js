function startGame() {
    window.doWork = new Worker("interval.js");
    window.doWork.onmessage = function(event) {
        if (event.data === "interval.start") {
            tick();
        }
    };
    load();
}

function cheat() {
    if (gameSpeed === 1) gameSpeed = 20;
    else gameSpeed = 1;
}

let mainTickLoop;
const saveName = "idleLoops1";

// this is to hide the cheat button if you aren't supposed to cheat
if (window.location.href === "http://10.0.0.3:8080/loops/") document.getElementById("cheat").style.display = "inline-block";

const timeNeededInitial = 5 * 50;
// eslint-disable-next-line prefer-const
let timer = timeNeededInitial;
// eslint-disable-next-line prefer-const
let timeNeeded = timeNeededInitial;
// eslint-disable-next-line prefer-const
let stop = false;
const view = new View();
const actions = new Actions();
const towns = [];
// eslint-disable-next-line prefer-const
let curTown = 0;

const statList = ["Dex", "Str", "Con", "Spd", "Per", "Cha", "Int", "Luck", "Soul"];
const stats = {};
let totalTalent = 0;
// eslint-disable-next-line prefer-const
let shouldRestart = true;

// eslint-disable-next-line prefer-const
let resources = {
    gold: 0,
    reputation: 0,
    herbs: 0,
    hide: 0,
    potions: 0,
    teamMembers: 0,
    armor: 0,
    blood: 0,
    artifacts: 0,
    glasses: false,
    supplies: false,
    pickaxe: false,
    loopingPotion: false
};
const resourcesTemplate = copyObject(resources);
// eslint-disable-next-line prefer-const
let guild = "";

let curLoadout = 0;
let loadouts = [];
let loadoutnames = ["1", "2", "3", "4", "5"];
const skillList = ["Combat", "Magic", "Practical", "Alchemy", "Crafting", "Dark", "Chronomancy", "Pyromancy", "Restoration", "Spatiomancy"];
const skills = {};
const buffList = ["Ritual", "Imbuement", "Feast"];
const buffHardCaps = [666, 490, 100];
const buffs = {};
// eslint-disable-next-line prefer-const
let townShowing = 0;
// eslint-disable-next-line prefer-const
let actionStoriesShowing = false;
let townsUnlocked = [];
let statShowing;
let skillShowing;
let curActionShowing;
let dungeonShowing;
let actionTownNum;
let trainingLimits;
let storyShowing = 0;
let storyMax = 0;
const storyReqs = {
    maxSQuestsInALoop: false,
    maxLQuestsInALoop: false,
    heal10PatientsInALoop: false,
    failedHeal: false,
    clearSDungeon: false,
    haggle: false,
    haggle15TimesInALoop: false,
    haggle16TimesInALoop: false,
    glassesBought: false,
    partyThrown: false,
    strengthTrained: false,
    suppliesBought: false,
    suppliesBoughtWithoutHaggling: false,
    smallDungeonAttempted: false,
    satByWaterfall: false,
    dexterityTrained: false,
    speedTrained: false,
    birdsWatched: false,
    darkRitualThirdSegmentReached: false,
    failedBrewPotions: false,
    failedBrewPotionsNegativeRep: false,
    potionBrewed: false
};
let currentTheme = "normal";

const curDate = new Date();
let totalOfflineMs = 0;
// eslint-disable-next-line prefer-const
let bonusSpeed = 1;
const offlineRatio = 1;
let dungeons;

// eslint-disable-next-line prefer-const
let curAdvGuildSegment = 0;
// eslint-disable-next-line prefer-const
let curCraftGuildSegment = 0;


function closeTutorial() {
    document.getElementById("tutorial").style.display = "none";
}

function clearSave() {
    window.localStorage[saveName] = "";
    load();
}

function loadDefaults() {
    initializeStats();
    initializeSkills();
    initializeBuffs();
}

function loadUISettings() {
    document.getElementById("expandableList").style.height = localStorage.getItem("actionListHeight");
    curActionsDiv.style.maxHeight = `${parseInt(localStorage.getItem("actionListHeight")) - 43}px`;
    nextActionsDiv.style.maxHeight = `${parseInt(localStorage.getItem("actionListHeight")) - 43}px`;
}

function saveUISettings() {
    if ((document.getElementById("expandableList").style.height === "")) localStorage.setItem("actionListHeight", document.getElementById("expandableList").style.height = "500px");
    else localStorage.setItem("actionListHeight", document.getElementById("expandableList").style.height);
}

function load() {
    loadDefaults();
    loadUISettings();

    let toLoad = {};
    // has a save file
    if (window.localStorage[saveName]) {
        closeTutorial();
        toLoad = JSON.parse(window.localStorage[saveName]);
    }

    for (const property in toLoad.stats) {
        if (toLoad.stats.hasOwnProperty(property)) {
            stats[property].talent = toLoad.stats[property].talent;
            stats[property].soulstone = toLoad.stats[property].soulstone;
        }
    }
    for (const property in toLoad.skills) {
        if (toLoad.skills.hasOwnProperty(property)) {
            skills[property].exp = toLoad.skills[property].exp;
        }
    }

    for (const property in toLoad.buffs) {
        if (toLoad.buffs.hasOwnProperty(property)) {
            buffs[property].amt = toLoad.buffs[property].amt;
        }
    }

    for (const property in toLoad.buffs) {
        if (toLoad.buffs.hasOwnProperty(property)) {
            buffs[property].amt = toLoad.buffs[property].amt;
        }
    }

    if (toLoad.storyReqs !== undefined) {
        for (const property in storyReqs) {
            if (toLoad.storyReqs.hasOwnProperty(property)) {
                storyReqs[property] = toLoad.storyReqs[property];
            }
        }
    }

    if (toLoad.totalTalent === undefined) {
        let temptotalTalent = 0;
        for (const property in toLoad.stats) {
            if (toLoad.stats.hasOwnProperty(property)) {
                temptotalTalent += toLoad.stats[property].talent * 100;
            }
        }
        totalTalent = temptotalTalent;
    } else {
        totalTalent = toLoad.totalTalent;
    }

    if (toLoad.maxTown) {
        townsUnlocked = [0];
        for (let i = 1; i <= toLoad.maxTown; i++) {
            townsUnlocked.push(i);
        }
    } else {
        townsUnlocked = toLoad.townsUnlocked === undefined ? [0] : toLoad.townsUnlocked;
    }
    actionTownNum = toLoad.actionTownNum === undefined ? 0 : toLoad.actionTownNum;
    trainingLimits = toLoad.trainingLimits === undefined ? 10 : toLoad.trainingLimits;

    const expLimit = 505000;
    towns[0] = new Town(0);
    let currentTown = towns[0];
    currentTown.expWander = toLoad.expWander === undefined ? 0 : Math.min(toLoad.expWander, expLimit);
    currentTown.expMet = toLoad.expMet === undefined ? 0 : Math.min(toLoad.expMet, expLimit);
    currentTown.expSecrets = toLoad.expSecrets === undefined ? 0 : Math.min(toLoad.expSecrets, expLimit);
    currentTown.totalHeal = toLoad.totalHeal === undefined ? 0 : toLoad.totalHeal;
    currentTown.totalFight = toLoad.totalFight === undefined ? 0 : toLoad.totalFight;
    currentTown.totalSDungeon = toLoad.totalSDungeon === undefined ? 0 : toLoad.totalSDungeon;

    towns[1] = new Town(1);
    currentTown = towns[1];
    currentTown.expForest = toLoad.expForest === undefined ? 0 : toLoad.expForest;
    currentTown.expShortcut = toLoad.expShortcut === undefined ? 0 : toLoad.expShortcut;
    currentTown.expHermit = toLoad.expHermit === undefined ? 0 : toLoad.expHermit;
    currentTown.expFlowers = toLoad.expFlowers === undefined ? 0 : toLoad.expFlowers;
    currentTown.expThicket = toLoad.expThicket === undefined ? 0 : toLoad.expThicket;
    currentTown.expWitch = toLoad.expWitch === undefined ? 0 : toLoad.expWitch;
    currentTown.totalDarkRitual = toLoad.totalDarkRitual === undefined ? 0 : toLoad.totalDarkRitual;

    towns[2] = new Town(2);
    currentTown = towns[2];
    currentTown.expCity = toLoad.expCity === undefined ? 0 : toLoad.expCity;
    currentTown.expDrunk = toLoad.expDrunk === undefined ? 0 : toLoad.expDrunk;
    currentTown.totalAdvGuild = toLoad.totalAdvGuild === undefined ? 0 : toLoad.totalAdvGuild;
    currentTown.totalCraftGuild = toLoad.totalCraftGuild === undefined ? 0 : toLoad.totalCraftGuild;
    currentTown.totalLDungeon = toLoad.totalLDungeon === undefined ? 0 : toLoad.totalLDungeon;
    currentTown.expApprentice = toLoad.expApprentice === undefined ? 0 : toLoad.expApprentice;
    currentTown.expMason = toLoad.expMason === undefined ? 0 : toLoad.expMason;
    currentTown.expArchitect = toLoad.expArchitect === undefined ? 0 : toLoad.expArchitect;

    towns[3] = new Town(3);
    currentTown = towns[3];
    currentTown.expMountain = toLoad.expMountain === undefined ? 0 : toLoad.expMountain;
    currentTown.expRunes = toLoad.expRunes === undefined ? 0 : toLoad.expRunes;
    currentTown.expCavern = toLoad.expCavern === undefined ? 0 : toLoad.expCavern;
    currentTown.expIllusions = toLoad.expIllusions === undefined ? 0 : toLoad.expIllusions;
    currentTown.totalHuntTrolls = toLoad.totalHuntTrolls === undefined ? 0 : toLoad.totalHuntTrolls;
    currentTown.totalImbueMind = toLoad.totalImbueMind === undefined ? 0 : toLoad.totalImbueMind;

    towns[4] = new Town(4);
    currentTown = towns[4];

    towns[5] = new Town(5);
    currentTown = towns[5];

    actions.next = [];
    if (toLoad.nextList) {
        for (const action of toLoad.nextList) {
            if (action.name === "Guided Tour") {
                continue;
            }
            if (action.name === "Sell Gold") {
                action.name = "Buy Mana";
            }
            if (action.name === "Tournament") {
                action.name = "Buy Pickaxe";
            }
            if (action.name === "Train Dex") {
                action.name = "Train Dexterity";
            }
            actions.next.push(action);
        }
    }
    actions.nextLast = copyObject(actions.next);
    loadouts = [[], [], [], [], [], []];
    if (toLoad.loadouts) {
        for (let i = 0; i < toLoad.loadouts.length; i++) {
            if (!toLoad.loadouts[i]) {
                continue;
            }
            for (const action of toLoad.loadouts[i]) {
                if (action.name === "Guided Tour") {
                    continue;
                }
                if (action.name === "Sell Gold") {
                    action.name = "Buy Mana";
                }
                if (action.name === "Tournament") {
                    action.name = "Buy Pickaxe";
                }
                if (action.name === "Train Dex") {
                    action.name = "Train Dexterity";
                }
                loadouts[i].push(action);
            }
        }
    }
    if (toLoad.loadoutnames) {
        for (let i = 0; i < 5; i++) {
            loadoutnames[i] = toLoad.loadoutnames[i];
        }
    } else {
        loadoutnames = ["1", "2", "3", "4", "5"];
    }
    curLoadout = toLoad.curLoadout;
    const elem = document.getElementById(`load${curLoadout}`);
    if (elem) {
        removeClassFromDiv(document.getElementById(`load${curLoadout}`), "unused");
    }

    dungeons = [[], []];
    const level = { ssChance: 1, completed: 0 };
    for (let i = 0; i < dungeons.length; i++) {
        for (let j = 0; j < 6 + i * 3; j++) {
            if (toLoad.dungeons && toLoad.dungeons[i][j]) {
                dungeons[i][j] = toLoad.dungeons[i][j];
            } else {
                dungeons[i][j] = copyArray(level);
            }
            dungeons[i][j].lastStat = "NA";
        }
    }

    currentTheme = toLoad.currentTheme === undefined ? "normal" : toLoad.currentTheme;
    view.initalize();

    for (const town of towns) {
        for (const action of town.totalActionList) {
            if (town.varNames.indexOf(action.varName) !== -1) {
                const varName = action.varName;
                if (toLoad[`total${varName}`] !== undefined)
                    town[`total${varName}`] = toLoad[`total${varName}`];
                if (toLoad[`checked${varName}`] !== undefined)
                    town[`checked${varName}`] = toLoad[`checked${varName}`];
                if (toLoad[`good${varName}`] !== undefined)
                    town[`good${varName}`] = toLoad[`good${varName}`];
                if (toLoad[`good${varName}`] !== undefined)
                    town[`goodTemp${varName}`] = toLoad[`good${varName}`];
                if (toLoad[`searchToggler${varName}`] !== undefined) {
                    document.getElementById(`searchToggler${varName}`).checked = toLoad[`searchToggler${varName}`];
                }
                view.updateRegular(action.varName, town.index);
            }
        }
    }

    document.getElementById("repeatLastAction").checked = toLoad.repeatLast;
    document.getElementById("audioCueToggle").checked = toLoad.pingOnPause === undefined ? false : toLoad.pingOnPause;
    document.getElementById("hotkeysToggle").checked = toLoad.hotkeys === undefined ? true : toLoad.hotkeys;
    if (toLoad.updateRate) document.getElementById("updateRate").value = toLoad.updateRate;
    else document.getElementById("updateRate").value = 50;
    storyShowing = toLoad.storyShowing === undefined ? 0 : toLoad.storyShowing;
    storyMax = toLoad.storyMax === undefined ? 0 : toLoad.storyMax;

    totalOfflineMs = toLoad.totalOfflineMs === undefined ? 0 : toLoad.totalOfflineMs;
    // capped at 1 month of gain
    addOffline(Math.min(Math.floor((new Date() - new Date(toLoad.date)) * offlineRatio), 2678400000));

    if (toLoad.version75 === undefined) {
        const total = towns[0].totalSDungeon;
        dungeons[0][0].completed = Math.floor(total / 2);
        dungeons[0][1].completed = Math.floor(total / 4);
        dungeons[0][2].completed = Math.floor(total / 8);
        dungeons[0][3].completed = Math.floor(total / 16);
        dungeons[0][4].completed = Math.floor(total / 32);
        dungeons[0][5].completed = Math.floor(total / 64);
        towns[0].totalSDungeon = dungeons[0][0].completed + dungeons[0][1].completed + dungeons[0][2].completed + dungeons[0][3].completed + dungeons[0][4].completed + dungeons[0][5].completed;
    }

    adjustAll();

    view.updateLoadoutNames();
    view.changeStatView();
    view.updateNextActions();
    view.updateMultiPartActions();
    view.updateStories(true);
    view.update();
    recalcInterval(toLoad.updateRate);
    pauseGame();

}

function save() {
    const toSave = {};
    toSave.curLoadout = curLoadout;
    toSave.dungeons = dungeons;
    toSave.townsUnlocked = townsUnlocked;
    toSave.actionTownNum = actionTownNum;
    toSave.trainingLimits = trainingLimits;

    let currentTown = towns[0];
    toSave.stats = stats;
    toSave.totalTalent = totalTalent;
    toSave.skills = skills;
    toSave.buffs = buffs;
    toSave.expWander = currentTown.expWander;
    toSave.expMet = currentTown.expMet;
    toSave.expSecrets = currentTown.expSecrets;
    toSave.totalHeal = currentTown.totalHeal;
    toSave.totalFight = currentTown.totalFight;
    toSave.totalSDungeon = currentTown.totalSDungeon;

    currentTown = towns[1];
    toSave.expForest = currentTown.expForest;
    toSave.expShortcut = currentTown.expShortcut;
    toSave.expHermit = currentTown.expHermit;
    toSave.expFlowers = currentTown.expFlowers;
    toSave.expThicket = currentTown.expThicket;
    toSave.expWitch = currentTown.expWitch;
    toSave.totalDarkRitual = currentTown.totalDarkRitual;

    currentTown = towns[2];
    toSave.expCity = currentTown.expCity;
    toSave.expDrunk = currentTown.expDrunk;
    toSave.totalAdvGuild = currentTown.totalAdvGuild;
    toSave.totalCraftGuild = currentTown.totalCraftGuild;
    toSave.totalLDungeon = currentTown.totalLDungeon;
    toSave.version75 = true;
    toSave.expApprentice = currentTown.expApprentice;
    toSave.expMason = currentTown.expMason;
    toSave.expArchitect = currentTown.expArchitect;

    currentTown = towns[3];
    toSave.expMountain = currentTown.expMountain;
    toSave.expRunes = currentTown.expRunes;
    toSave.expCavern = currentTown.expCavern;
    toSave.expIllusions = currentTown.expIllusions;
    toSave.totalHuntTrolls = currentTown.totalHuntTrolls;
    toSave.totalImbueMind = currentTown.totalImbueMind;

    currentTown = towns[4];

    currentTown = towns[5];

    for (const town of towns) {
        for (const action of town.totalActionList) {
            if (town.varNames.indexOf(action.varName) !== -1) {
                const varName = action.varName;
                toSave[`total${varName}`] = town[`total${varName}`];
                toSave[`checked${varName}`] = town[`checked${varName}`];
                toSave[`good${varName}`] = town[`good${varName}`];
                toSave[`goodTemp${varName}`] = town[`good${varName}`];
                if (document.getElementById(`searchToggler${varName}`)) {
                    toSave[`searchToggler${varName}`] = document.getElementById(`searchToggler${varName}`).checked;
                }
            }
        }
    }
    toSave.nextList = actions.next;
    toSave.loadouts = loadouts;
    toSave.loadoutnames = loadoutnames;
    toSave.repeatLast = document.getElementById("repeatLastAction").checked;
    toSave.pingOnPause = document.getElementById("audioCueToggle").checked;
    toSave.hotkeys = document.getElementById("hotkeysToggle").checked;
    if (parseFloat(document.getElementById("updateRate").value) > 0) toSave.updateRate = parseFloat(document.getElementById("updateRate").value);
    else toSave.updateRate = 50;
    toSave.storyShowing = storyShowing;
    toSave.storyMax = storyMax;
    toSave.storyReqs = storyReqs;
    toSave.currentTheme = currentTheme;

    toSave.date = new Date();
    toSave.totalOfflineMs = totalOfflineMs;

    window.localStorage[saveName] = JSON.stringify(toSave);
}

function isOldAction(name) {
    if (name === "Wander") {
        return true;
    }
    if (name === "Smash Pots") {
        return true;
    }
    if (name === "Pick Locks") {
        return true;
    }
    if (name === "Buy Glasses") {
        return true;
    }
    if (name === "Buy Mana") {
        return true;
    }
    if (name === "Meet People") {
        return true;
    }
    if (name === "Train Strength") {
        return true;
    }
    if (name === "Short Quest") {
        return true;
    }
    if (name === "Investigate") {
        return true;
    }
    if (name === "Long Quest") {
        return true;
    }
    if (name === "Warrior Lessons") {
        return true;
    }
    if (name === "Mage Lessons") {
        return true;
    }
    if (name === "Throw Party") {
        return true;
    }
    if (name === "Heal The Sick") {
        return true;
    }
    if (name === "Fight Monsters") {
        return true;
    }
    if (name === "Small Dungeon") {
        return true;
    }
    if (name === "Buy Supplies") {
        return true;
    }
    if (name === "Haggle") {
        return true;
    }
    if (name === "Start Journey") {
        return true;
    }
    // town 2
    if (name === "Explore Forest") {
        return true;
    }
    if (name === "Wild Mana") {
        return true;
    }
    if (name === "Gather Herbs") {
        return true;
    }
    if (name === "Hunt") {
        return true;
    }
    if (name === "Sit By Waterfall") {
        return true;
    }
    if (name === "Old Shortcut") {
        return true;
    }
    if (name === "Talk To Hermit") {
        return true;
    }
    if (name === "Practical Magic") {
        return true;
    }
    if (name === "Learn Alchemy") {
        return true;
    }
    if (name === "Brew Potions") {
        return true;
    }
    if (name === "Train Dex") {
        return true;
    }
    if (name === "Train Speed") {
        return true;
    }
    if (name === "Continue On") {
        return true;
    }
    // town 3
    if (name === "Explore City") {
        return true;
    }
    if (name === "Gamble") {
        return true;
    }
    if (name === "Get Drunk") {
        return true;
    }
    if (name === "Purchase Mana") {
        return true;
    }
    if (name === "Sell Potions") {
        return true;
    }
    if (name === "Read Books") {
        return true;
    }
    if (name === "Adventure Guild") {
        return true;
    }
    if (name === "Gather Team") {
        return true;
    }
    if (name === "Large Dungeon") {
        return true;
    }
    if (name === "Crafting Guild") {
        return true;
    }
    if (name === "Craft Armor") {
        return true;
    }
    if (name === "Apprentice") {
        return true;
    }
    if (name === "Mason") {
        return true;
    }
    if (name === "Architect") {
        return true;
    }

    return false;
}

// start old save

function exportOldSave() {
    // eslint-disable-next-line max-len
    if (!confirm("This will give you your save file with all save data for any content added in this fork removed.This will allow you to import your save back to stopsign.github.io, but you will lose any progress you made on features exclusive to this fork.")) return;
    const toSave = {};
    toSave.curLoadout = Math.min(curLoadout, 4);
    toSave.dungeons = [dungeons[0], dungeons[1]];
    if (towns[2].unlocked()) toSave.maxTown = 2;
    else if (towns[1].unlocked()) toSave.maxTown = 1;
    else if (towns[0].unlocked()) toSave.maxTown = 0;
    toSave.actionTownNum = 0;
    toSave.trainingLimits = 10;

    let currentTown = towns[0];
    toSave.stats = stats;
    toSave.skills = {};
    for (let i = 0; i < 4; i++) {
        toSave.skills[skillList[i]] = skills[skillList[i]];
    }
    toSave.expWander = currentTown.expWander;
    toSave.expMet = currentTown.expMet;
    toSave.expSecrets = currentTown.expSecrets;
    toSave.totalHeal = currentTown.totalHeal;
    toSave.totalFight = currentTown.totalFight;
    toSave.totalSDungeon = currentTown.totalSDungeon;

    currentTown = towns[1];
    toSave.expForest = currentTown.expForest;
    toSave.expShortcut = currentTown.expShortcut;
    toSave.expHermit = currentTown.expHermit;

    currentTown = towns[2];
    toSave.expCity = currentTown.expCity;
    toSave.expDrunk = currentTown.expDrunk;
    toSave.totalAdvGuild = currentTown.totalAdvGuild;
    toSave.totalCraftGuild = currentTown.totalCraftGuild;
    toSave.totalLDungeon = currentTown.totalLDungeon;
    toSave.version75 = true;
    toSave.expApprentice = currentTown.expApprentice;
    toSave.expMason = currentTown.expMason;
    toSave.expArchitect = currentTown.expArchitect;

    for (const town of towns) {
        for (const action of town.totalActionList) {
            if (town.varNames.indexOf(action.varName) !== -1) {
                const varName = action.varName;
                toSave[`total${varName}`] = town[`total${varName}`];
                toSave[`checked${varName}`] = town[`checked${varName}`];
                toSave[`good${varName}`] = town[`good${varName}`];
                toSave[`goodTemp${varName}`] = town[`good${varName}`];
                if (document.getElementById(`searchToggler${varName}`)) {
                    toSave[`searchToggler${varName}`] = document.getElementById(`searchToggler${varName}`).checked;
                }
            }
        }
    }
    const tempNextList = [];
    for (let i = 0; i < actions.next.length; i++) {
        if (isOldAction(actions.next[i].name)) tempNextList[tempNextList.length] = actions.next[i];
    }
    for (const action of tempNextList) {
        action.disabled = undefined;
    }
    toSave.nextList = tempNextList;
    const tempLoadouts = [[], [], [], [], []];
    for (let i = 0; i < 5; i++) {
        for (let l = 0; l < loadouts[i].length; l++) {
            if (isOldAction(loadouts[i][l].name)) tempLoadouts[i][tempLoadouts[i].length] = loadouts[i][l];
        }
    }
    toSave.loadouts = tempLoadouts;
    toSave.repeatLast = document.getElementById("repeatLastAction").checked;
    toSave.pingOnPause = document.getElementById("audioCueToggle").checked;
    toSave.storyShowing = storyShowing;
    toSave.storyMax = storyMax;
    toSave.date = new Date();
    toSave.totalOfflineMs = totalOfflineMs;

    document.getElementById("exportImport").value = encode(JSON.stringify(toSave));
    document.getElementById("exportImport").select();
    document.execCommand("copy");
}

// end old save

function exportSave() {
    save();
    document.getElementById("exportImport").value = encode(window.localStorage[saveName]);
    document.getElementById("exportImport").select();
    document.execCommand("copy");
}

function importSave() {
    if (document.getElementById("exportImport").value === "") {
        if (!confirm("Importing nothing will delete your save. Are you sure you want to delete your save?")) {
            return;
        }
    }
    window.localStorage[saveName] = decode(document.getElementById("exportImport").value);
    actions.next = [];
    actions.current = [];
    load();
    pauseGame();
    restart();
}

function exportCurrentList() {
    let toReturn = "";
    for (const action of actions.next) {
        toReturn += `${action.loops}x ${action.name}`;
        toReturn += "\n";
    }
    document.getElementById("exportImportList").value = toReturn.slice(0, -1);
    document.getElementById("exportImportList").select();
    document.execCommand("copy");
}

function importCurrentList() {
    const toImport = document.getElementById("exportImportList").value.split("\n");
    actions.next = [];
    for (let i = 0; i < toImport.length; i++) {
        if (!toImport[i]) {
            continue;
        }
        const name = toImport[i].substr(toImport[i].indexOf("x") + 1).trim();
        const loops = toImport[i].substr(0, toImport[i].indexOf("x"));
        const action = translateClassNames(name);
        if (action && action.unlocked()) {
            actions.next.push({ name, loops: Number(loops), disabled: false });
        }
    }
    view.updateNextActions();
}

// setInterval(tick, 20);