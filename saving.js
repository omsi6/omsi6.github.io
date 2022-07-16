function startGame() {
    window.doWork = new Worker("interval.js");
    window.doWork.onmessage = function(event) {
        if (event.data === "interval.start") {
            tick();
        }
    };
    load();
    setScreenSize();
}

function cheat() {
    if (gameSpeed === 1) gameSpeed = 20;
    else gameSpeed = 1;
}

function cheatBonus()
{
    totalOfflineMs = 1000000000000000;
}

function cheatSurvey()
{
    for(i= 0; i<9; i++)
    {
        varName = "SurveyZ" + i
        towns[i][`exp${varName}`] = 505000;
        view.updateProgressAction(varName, towns[i]);
    }
}

function cheatProgress()
{
    for (const action of totalActionList)
    {
        if (action.type == "progress")
        {
            towns[action.townNum][`exp${action.varName}`] = 505000;
            view.updateProgressAction(action.varName, towns[action.townNum]);
        }
    }
    stonesUsed = {1:250, 3:250, 5:250, 6:250};
}

function cheatTalent(stat, targetTalentLevel) 
{
    stats[stat].talent = getExpOfLevel(targetTalentLevel);
    view.updateStats();
}

function cheatSoulstone(stat, targetSS)
{
    stats[stat].soulstone = targetSS;
    view.updateSoulstones();
}


let mainTickLoop;
const saveName = "idleLoops1";

// this is to hide the cheat button if you aren't supposed to cheat
if (window.location.href.includes("http://127.0.0.2:8080")) document.getElementById("cheat").style.display = "inline-block";

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
    favors: 0,
    enchantments: 0,
    houses: 0,
    pylons: 0,
    zombie: 0,
    meat: 0,
    power: 0,
    glasses: false,
    supplies: false,
    pickaxe: false,
    loopingPotion: false,
    citizenship: false,
    pegasus: false,
    key: false,
    stone: false
};
const resourcesTemplate = copyObject(resources);
// eslint-disable-next-line prefer-const
let guild = "";
let portalUsed = false;
let stoneLoc = 0;
let curLoadout = 0;
let loadouts;
let loadoutnames;
//let loadoutnames = ["1", "2", "3", "4", "5"];
const skillList = ["Combat", "Magic", "Practical", "Alchemy", "Crafting", "Dark", "Chronomancy", "Pyromancy", "Restoration", "Spatiomancy", "Mercantilism", "Divine", "Commune", "Wunderkind", "Gluttony", "Thievery"];
const skills = {};
const buffList = ["Ritual", "Imbuement", "Imbuement2", "Feast", "Aspirant", "Heroism", "Imbuement3"];
const dungeonFloors = [6, 9, 20];
const trialFloors = [50, 100, 7, 1000, 25];
const buffHardCaps = {
    Ritual: 666,
    Imbuement: 500,
    Imbuement2: 500,
    Imbuement3: 7,
    Feast: 100,
    Aspirant: 20,
    Heroism: 50
};
const buffCaps = {
    Ritual: 666,
    Imbuement: 500,
    Imbuement2: 500,
    Imbuement3: 7,
    Feast: 100,
    Aspirant: 20,
    Heroism: 50
};
const buffs = {};
let goldInvested = 0;
let stonesUsed;
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
let trainingLimits = 10;
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
    potionBrewed: false,
    failedGamble: false,
    failedGambleLowMoney: false,
    potionSold: false,
    sell20PotionsInALoop: false,
    sellPotionFor100Gold: false,
    advGuildTestsTaken: false,
    advGuildRankEReached: false,
    advGuildRankDReached: false,
    advGuildRankCReached: false,
    advGuildRankBReached: false,
    advGuildRankAReached: false,
    advGuildRankSReached: false,
    advGuildRankUReached: false,
    advGuildRankGodlikeReached: false,
    teammateGathered: false,
    fullParty: false,
    failedGatherTeam: false,
    largeDungeonAttempted: false,
    clearLDungeon: false,
    craftGuildTestsTaken: false,
    craftGuildRankEReached: false,
    craftGuildRankDReached: false,
    craftGuildRankCReached: false,
    craftGuildRankBReached: false,
    craftGuildRankAReached: false,
    craftGuildRankSReached: false,
    craftGuildRankUReached: false,
    craftGuildRankGodlikeReached: false,
    armorCrafted: false,
    craft10Armor: false,
    failedCraftArmor: false,
    booksRead: false,
    pickaxeBought: false,
    loopingPotionMade: false,
    slay10TrollsInALoop: false,
    imbueMindThirdSegmentReached: false,
    judgementFaced: false,
    acceptedIntoValhalla: false,
    castIntoShadowRealm: false,
    fellFromGrace: false
};

const curDate = new Date();
let totalOfflineMs = 0;
// eslint-disable-next-line prefer-const
let bonusSpeed = 1;
const offlineRatio = 1;

// eslint-disable-next-line prefer-const
let curAdvGuildSegment = 0;
// eslint-disable-next-line prefer-const
let curCraftGuildSegment = 0;
// eslint-disable-next-line prefer-const
let curWizCollegeSegment = 0;
// eslint-disable-next-line prefer-const
let curFightFrostGiantsSegment = 0;
// eslint-disable-next-line prefer-const
let curFightJungleMonstersSegment = 0;
// eslint-disable-next-line prefer-const
let curThievesGuildSegment = 0;

const options = {
    theme: "normal",
    keepCurrentList: false,
    repeatLastAction: false,
    addActionsToTop: false,
    pauseBeforeRestart: false,
    pauseOnFailedLoop: false,
    pingOnPause: false,
    autoMaxTraining: false,
    hotkeys: true,
    updateRate: 50
};

function setOption(option, value) {
    options[option] = value;
    if (option === "updateRate") recalcInterval(options.updateRate);
}

function loadOption(option, value) {
    if (option === "updateRate") document.getElementById(`${option}Input`).value = value;
    else document.getElementById(`${option}Input`).checked = value;
}

function closeTutorial() {
    document.getElementById("tutorial").style.display = "none";
}

function clearSave() {
    window.localStorage[saveName] = "";
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

    loadouts = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []];
    loadoutnames = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], []];

    let toLoad = {};
    // has a save file
    if (window.localStorage[saveName] && window.localStorage[saveName] !== "null") {
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
            // need the min for people with broken buff amts from pre 0.93
            buffs[property].amt = Math.min(toLoad.buffs[property].amt, buffHardCaps[property]);
        }
    }

    /*if (toLoad.buffCaps !== undefined) {
        for (const property in buffCaps) {
            if (toLoad.buffCaps.hasOwnProperty(property)) {
                buffCaps[property] = toLoad.buffCaps[property];
                document.getElementById(`buff${property}Cap`).value = buffCaps[property];
            }
        }
    }*/

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
    for (let i = 0; i <= 8; i++) {
        towns[i] = new Town(i);
    }
    actionTownNum = toLoad.actionTownNum === undefined ? 0 : toLoad.actionTownNum;
    trainingLimits = 10 + getBuffLevel("Imbuement");
    goldInvested = toLoad.goldInvested === undefined ? 0 : toLoad.goldInvested;
    stonesUsed = toLoad.stonesUsed === undefined ? {1:0, 3:0, 5:0, 6:0} : toLoad.stonesUsed;

    actions.next = [];
    if (toLoad.nextList) {
        for (const action of toLoad.nextList) {
            if (action.name === "Sell Gold") {
                action.name = "Buy Mana";
            }
            if (action.name === "Tournament") {
                action.name = "Buy Pickaxe";
            }
            if (action.name === "Train Dex") {
                action.name = "Train Dexterity";
            }
            if (action.name === "Buy Mana") {
                action.name = "Buy Mana Z1";
            }
            if (action.name === "Purchase Mana") {
                action.name = "Buy Mana Z3";
            }
            actions.next.push(action);
        }
    }
    actions.nextLast = copyObject(actions.next);

    if (toLoad.loadouts) {
        for (let i = 0; i < loadouts.length; i++) {
            if (!toLoad.loadouts[i]) {
                continue;
            }
            //Translates old actions that no longer exist
            for (const action of toLoad.loadouts[i]) {
                if (action.name === "Sell Gold") {
                    action.name = "Buy Mana";
                }
                if (action.name === "Tournament") {
                    action.name = "Buy Pickaxe";
                }
                if (action.name === "Train Dex") {
                    action.name = "Train Dexterity";
                }
                if (action.name === "Buy Mana") {
                    action.name = "Buy Mana Z1";
                }
                if (action.name === "Purchase Mana") {
                    action.name = "Buy Mana Z3";
                }
                loadouts[i].push(action);
            }
        }
    }
    for (let i = 0; i < loadoutnames.length; i++) {
        loadoutnames[i] = "Loadout " + (i + 1);
    }
    if (toLoad.loadoutnames) {
        for (let i = 0; i < loadoutnames.length; i++) {
            if(toLoad.loadoutnames[i] != undefined && toLoad.loadoutnames != "")
                loadoutnames[i] = toLoad.loadoutnames[i];
            else
                loadoutnames[i] = "Loadout " + (i + 1);
        }
    }
    curLoadout = toLoad.curLoadout;
    const elem = document.getElementById(`load${curLoadout}`);
    if (elem) {
        removeClassFromDiv(document.getElementById(`load${curLoadout}`), "unused");
    }

    /*if (toLoad.dungeons) {
        if (toLoad.dungeons.length < dungeons.length) {
            toLoad.dungeons.push([]);
        }
    }*/
    const level = { ssChance: 1, completed: 0 };
    let floors = 0;
    if(toLoad.dungeons === undefined) toLoad.dungeons = copyArray(dungeons);
    for (let i = 0; i < dungeons.length; i++) {
        floors = dungeonFloors[i];
        for (let j = 0; j < floors; j++) {
            if (toLoad.dungeons[i] != undefined && toLoad.dungeons && toLoad.dungeons[i][j]) {
                dungeons[i][j] = toLoad.dungeons[i][j];
            } else {
                dungeons[i][j] = copyArray(level);
            }
            dungeons[i][j].lastStat = "NA";
        }
    }

    const trialLevel = {completed: 0};
    if(toLoad.trials === undefined) toLoad.trials = copyArray(trials);
    for (let i = 0; i < trials.length; i++) {
        floors = trialFloors[i];
        trials[i].highestFloor = 0;
        for (let j = 0; j < floors; j++) {
            if (toLoad.trials[i] != undefined && toLoad.trials && toLoad.trials[i][j]) {
                trials[i][j] = toLoad.trials[i][j];
                if (trials[i][j].completed > 0) trials[i].highestFloor = j;
            } else {
                trials[i][j] = copyArray(trialLevel);
            }
        }
    }

    if (toLoad.options === undefined) {
        options.theme = toLoad.currentTheme === undefined ? "normal" : toLoad.currentTheme;
        options.repeatLastAction = toLoad.repeatLast;
        options.pingOnPause = toLoad.pingOnPause === undefined ? false : toLoad.pingOnPause;
        options.autoMaxTraining = toLoad.autoMaxTraining === undefined ? true : toLoad.autoMaxTraining;
        options.hotkeys = toLoad.hotkeys === undefined ? true : toLoad.hotkeys;
        options.updateRate = toLoad.updateRate === undefined ? 50 : toLoad.updateRate;
    } else {
        for (const option in toLoad.options) {
            options[option] = toLoad.options[option];
        }
    }

    for (const town of towns) {
        for (const action of town.totalActionList) {
            if (action.type === "progress")
                town[`exp${action.varName}`] = toLoad[`exp${action.varName}`] === undefined ? 0 : toLoad[`exp${action.varName}`];
            else if (action.type === "multipart")
                town[`total${action.varName}`] = toLoad[`total${action.varName}`] === undefined ? 0 : toLoad[`total${action.varName}`];
            else if (action.type === "limited") {
                const varName = action.varName;
                if (toLoad[`total${varName}`] !== undefined)
                    town[`total${varName}`] = toLoad[`total${varName}`];
                if (toLoad[`checked${varName}`] !== undefined)
                    town[`checked${varName}`] = toLoad[`checked${varName}`];
                if (toLoad[`good${varName}`] !== undefined)
                    town[`good${varName}`] = toLoad[`good${varName}`];
                if (toLoad[`good${varName}`] !== undefined)
                    town[`goodTemp${varName}`] = toLoad[`good${varName}`];
            }
        }
    }
    
    view.initalize();

    for (const town of towns) {
        for (const action of town.totalActionList) {
            if (action.type === "limited") {
                const varName = action.varName;
                if (toLoad[`searchToggler${varName}`] !== undefined) {
                    document.getElementById(`searchToggler${varName}`).checked = toLoad[`searchToggler${varName}`];
                }
                view.updateRegular(action.varName, town.index);
            }
        }
    }

    for (const option in options) {
        loadOption(option, options[option]);
    }
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

    if(getExploreProgress() >= 100) addResource("glasses", true);

    adjustAll();

    view.updateLoadoutNames();
    view.changeStatView();
    view.updateNextActions();
    view.updateMultiPartActions();
    view.updateStories(true);
    view.update();
    recalcInterval(options.updateRate);
    pauseGame();

}

function save() {
    const toSave = {};
    toSave.curLoadout = curLoadout;
    toSave.dungeons = dungeons;
    toSave.trials = trials;
    toSave.townsUnlocked = townsUnlocked;
    toSave.actionTownNum = actionTownNum;

    toSave.stats = stats;
    toSave.totalTalent = totalTalent;
    toSave.skills = skills;
    toSave.buffs = buffs;
    toSave.goldInvested = goldInvested;
    toSave.stonesUsed = stonesUsed;
    toSave.version75 = true;

    for (const town of towns) {
        for (const action of town.totalActionList) {
            if (action.type === "progress") {
                toSave[`exp${action.varName}`] = town[`exp${action.varName}`];
            } else if (action.type === "multipart") {
                toSave[`total${action.varName}`] = town[`total${action.varName}`];
            } else if (action.type === "limited") {
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
    toSave.options = options;
    toSave.storyShowing = storyShowing;
    toSave.storyMax = storyMax;
    toSave.storyReqs = storyReqs;
    //toSave.buffCaps = buffCaps;

    toSave.date = new Date();
    toSave.totalOfflineMs = totalOfflineMs;

    window.localStorage[saveName] = JSON.stringify(toSave);
}

function exportSave() {
    save();
    // idle loops save version 01. patch v0.94, moved from old save system to lzstring base 64
    document.getElementById("exportImport").value = `ILSV01${LZString.compressToBase64(window.localStorage[saveName])}`;
    document.getElementById("exportImport").select();
    document.execCommand("copy");
}

function importSave() {
    const saveData = document.getElementById("exportImport").value;
    if (saveData === "") {
        if (confirm("Importing nothing will delete your save. Are you sure you want to delete your save?")) {
            clearSave();
        } else {
            return;
        }
    }
    // idle loops save version 01. patch v0.94, moved from old save system to lzstring base 64
    if (saveData.substr(0, 6) === "ILSV01") {
        window.localStorage[saveName] = LZString.decompressFromBase64(saveData.substr(6));
    } else {
        // handling for old saves from stopsign or patches prior to v0.94
        window.localStorage[saveName] = decode(saveData);
    }
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