function startGame () {
    if (isFileSystem) {
    } else {
        window.doWork = new Worker('interval.js');
        window.doWork.onmessage = function (event) {
            if (event.data === 'interval.start') {
                tick();
            }
        };
    }
    displayBetaSaveNote();
    load();
}

function cheat() {
    if (gameSpeed === 1) gameSpeed = 20;
    else gameSpeed = 1;
}

let mainTickLoop;
let isFileSystem = !!location.href.match("file");
let isBeta = !!location.href.match(/beta/i);
let saveName = !isBeta ? "idleLoops1" :  "idleLoopsBeta";

//this is to hide the cheat button if you aren't supposed to cheat
if (window.location.href === "http://10.0.0.3:8080/loops/") document.getElementById("cheat").style.display = "inline-block"

let timeNeededInitial = 5 * 50;
let timer = timeNeededInitial;
let timeNeeded = timeNeededInitial;
let stop = false;
const view = new View();
const actions = new Actions();
const towns = [];
let curTown = 0;

let statList = ["Dex", "Str", "Con", "Spd", "Per", "Cha", "Int", "Luck", "Soul"];
const stats = {};
let totalTalent = 0;
let prevState = {};
let shouldRestart = true;

let gold = 0, initialGold = 0;
let reputation = 0;
let supplies = 0;
let herbs = 0;
let hide = 0;
let potions = 0;
let teamNum = 0;
let guild = "";
let armor = 0;
let blood = 0;
let artifacts = 0;

let glasses = 0;
let pickaxe = 0;
let loopingPotion = 0;

let curLoadout = 0;
let loadouts = [];
let loadoutnames = ["1", "2", "3", "4", "5"];
const skillList = ["Combat", "Magic", "Practical", "Alchemy", "Crafting", "Dark", "Chronomancy", "Pyromancy"];
let skills = {};
const buffList = ["Ritual", "Imbuement", "Feast"];
const buffHardCaps = [666, 490, 100];
let buffs = {};
let townShowing = 0;
let maxTown;
let statShowing;
let actionTownNum;
let trainingLimits;
let storyShowing = 0;
let storyMax = 0;

let curDate = new Date();
let totalOfflineMs = 0;
let bonusSpeed = 1;
let offlineRatio = .8;
let dungeons;

window.curAdvGuildSegment = 0;
window.curCraftGuildSegment = 0;


function closeTutorial() {
    document.getElementById("tutorial").style.display="none";
}

function clearSave() {
    window.localStorage[saveName] = "";
    load();
}

function loadDefaults() {
    initializeStats();
    prevState.stats = JSON.parse(JSON.stringify(stats));
    initializeSkills();
    initializeBuffs();
}

function loadUISettings() {
    document.getElementById("expandableList").style.height = localStorage.getItem("actionListHeight");
    document.getElementById("curActionsList").style.maxHeight = parseInt(localStorage.getItem("actionListHeight"))-43+"px"
    document.getElementById("nextActionsList").style.maxHeight = parseInt(localStorage.getItem("actionListHeight"))-43+"px"
}

function saveUISettings() {
    if((document.getElementById("expandableList").style.height !== "")) localStorage.setItem("actionListHeight", document.getElementById("expandableList").style.height);
    else localStorage.setItem("actionListHeight", document.getElementById("expandableList").style.height = "500px");
}

function load() {
    loadDefaults();
    loadUISettings();

    let toLoad = {};
    if(window.localStorage[saveName]) { //has a save file
        closeTutorial();
        toLoad = JSON.parse(window.localStorage[saveName]);
    }

    for(let property in toLoad.stats) {
        if (toLoad.stats.hasOwnProperty(property)) {
            stats[property].talent = toLoad.stats[property].talent;
            stats[property].soulstone = toLoad.stats[property].soulstone;
        }
    }
    for(let property in toLoad.skills) {
        if (toLoad.skills.hasOwnProperty(property)) {
            skills[property].exp = toLoad.skills[property].exp;
        }
    }

    for(let property in toLoad.buffs) {
        if (toLoad.buffs.hasOwnProperty(property)) {
            buffs[property].amt = toLoad.buffs[property].amt;
        }
    }

    if(toLoad.totalTalent === undefined) {
        var temptotalTalent = 0;
        for(let property in toLoad.stats) {
            if (toLoad.stats.hasOwnProperty(property)) {
                temptotalTalent += toLoad.stats[property].talent * 100;
            }
        }
        totalTalent = temptotalTalent;
    } else {
        totalTalent = toLoad.totalTalent
    }

    maxTown = toLoad.maxTown !== undefined ? toLoad.maxTown : 0;
    actionTownNum = toLoad.actionTownNum !== undefined ? toLoad.actionTownNum : 0;
    trainingLimits = toLoad.trainingLimits !== undefined ? toLoad.trainingLimits : 10;

    let expLimit = 505000;
    towns[0] = new Town(0);
    let town = towns[0];
    town.expWander = toLoad.expWander !== undefined ? (toLoad.expWander > expLimit ? expLimit : toLoad.expWander) : 0;
    town.expMet = toLoad.expMet !== undefined ? (toLoad.expMet > expLimit ? expLimit : toLoad.expMet) : 0;
    town.expSecrets = toLoad.expSecrets !== undefined ? (toLoad.expSecrets > expLimit ? expLimit : toLoad.expSecrets): 0;
    town.totalHeal = toLoad.totalHeal !== undefined ? toLoad.totalHeal : 0;
    town.totalFight = toLoad.totalFight !== undefined ? toLoad.totalFight : 0;
    town.totalSDungeon = toLoad.totalSDungeon !== undefined ? toLoad.totalSDungeon : 0;

    towns[1] = new Town(1);
    town = towns[1];
    town.expForest = toLoad.expForest !== undefined ? toLoad.expForest : 0;
    town.expShortcut = toLoad.expShortcut !== undefined ? toLoad.expShortcut : 0;
    town.expHermit = toLoad.expHermit !== undefined ? toLoad.expHermit : 0;
    town.expFlowers = toLoad.expFlowers !== undefined ? toLoad.expFlowers : 0;
    town.expThicket = toLoad.expThicket !== undefined ? toLoad.expThicket : 0;
    town.expWitch = toLoad.expWitch !== undefined ? toLoad.expWitch : 0;
    town.totalDarkRitual = toLoad.totalDarkRitual !== undefined ? toLoad.totalDarkRitual : 0;

    towns[2] = new Town(2);
    town = towns[2];
    town.expCity = toLoad.expCity !== undefined ? toLoad.expCity : 0;
    town.expDrunk = toLoad.expDrunk !== undefined ? toLoad.expDrunk : 0;
    town.totalAdvGuild = toLoad.totalAdvGuild !== undefined ? toLoad.totalAdvGuild : 0;
    town.totalCraftGuild = toLoad.totalCraftGuild !== undefined ? toLoad.totalCraftGuild : 0;
    town.totalLDungeon = toLoad.totalLDungeon !== undefined ? toLoad.totalLDungeon : 0;
    town.expApprentice = toLoad.expApprentice !== undefined ? toLoad.expApprentice : 0;
    town.expMason = toLoad.expMason !== undefined ? toLoad.expMason : 0;
    town.expArchitect = toLoad.expArchitect !== undefined ? toLoad.expArchitect : 0;

    towns[3] = new Town(3);
    town = towns[3];
    town.expMountain = toLoad.expMountain !== undefined ? toLoad.expMountain : 0;
    town.expRunes = toLoad.expRunes !== undefined ? toLoad.expRunes : 0;
    town.expCavern = toLoad.expCavern !== undefined ? toLoad.expCavern : 0;
    town.expIllusions = toLoad.expIllusions !== undefined ? toLoad.expIllusions : 0;
    town.totalHuntTrolls = toLoad.totalHuntTrolls !== undefined ? toLoad.totalHuntTrolls : 0;
    town.totalImbueMind = toLoad.totalImbueMind !== undefined ? toLoad.totalImbueMind : 0;

    towns[4] = new Town(4);
    town = towns[4];

    towns[5] = new Town(5);
    town = towns[5];

    actions.next = [];
    if(toLoad.nextList) {
        for (let i = 0; i < toLoad.nextList.length; i++) {
            let action = toLoad.nextList[i];
            if (action.name === "Guided Tour") {// && action.name !== "Throw Party") {
                continue;
            }
            if(action.name === "Sell Gold") {
                action.name = "Buy Mana";
            }
            if(action.name === "Tournament") {
                action.name = "Buy Pickaxe";
            }
            actions.next.push(action);
        }
    }
    loadouts = [[],[],[],[],[],[]];
    if(toLoad.loadouts) {
        for (let i = 0; i < toLoad.loadouts.length; i++) {
            if(!toLoad.loadouts[i]) {
                continue;
            }
            for (let j = 0; j < toLoad.loadouts[i].length; j++) {
                let action = toLoad.loadouts[i][j];
                if (action.name === "Guided Tour") { // && action.name !== "Throw Party") {
                    continue;
                }
                if(action.name === "Sell Gold") {
                    action.name = "Buy Mana";
                }
                if(action.name === "Tournament") {
                    action.name = "Buy Pickaxe";
                }
                loadouts[i].push(action);
            }
        }
    }
    if(toLoad.loadoutnames) {
        for (let i=0; i<5; i++) {
            loadoutnames[i] = toLoad.loadoutnames[i];
        }
    }
    curLoadout = toLoad.curLoadout
    let elem = document.getElementById("load"+curLoadout);
    if(elem) {
        removeClassFromDiv(document.getElementById("load" + curLoadout), "unused");
    }

    dungeons = [[], []];
    let level = {ssChance:1,completed:0};
    for(let i = 0; i < dungeons.length; i++) {
        for(let j = 0; j < 6 + i*3; j++) {
            if(toLoad.dungeons && toLoad.dungeons[i][j]) {
                dungeons[i][j] = toLoad.dungeons[i][j];
            } else {
                dungeons[i][j] = copyArray(level);
            }
            dungeons[i][j].lastStat = "NA";
        }
    }

    view.initalize();

    for(let i = 0; i < towns.length; i++) {
        town = towns[i];
        for(let j = 0; j < town.totalActionList.length; j++) {
            let action = town.totalActionList[j];
            if (town.varNames.indexOf(action.varName) !== -1) {
                const varName = action.varName;
                if (toLoad["total" + varName] !== undefined)
                    town["total" + varName] = toLoad["total" + varName];
                if (toLoad["checked" + varName] !== undefined)
                    town["checked" + varName] = toLoad["checked" + varName];
                if (toLoad["good" + varName] !== undefined)
                    town["good" + varName] = toLoad["good" + varName];
                if (toLoad["good" + varName] !== undefined)
                    town["goodTemp" + varName] = toLoad["good" + varName];
                if(toLoad["searchToggler" + varName] !== undefined) {
                    document.getElementById("searchToggler" + varName).checked = toLoad["searchToggler" + varName];
                }
                view.updateRegular(action.varName, i);
            }
        }
    }

    document.getElementById("repeatLastAction").checked = toLoad.repeatLast;
    document.getElementById("audioCueToggle").checked = toLoad.pingOnPause !== undefined ? toLoad.pingOnPause : false;
    document.getElementById("hotkeysToggle").checked = toLoad.hotkeys !== undefined ? toLoad.hotkeys : true;
    if (toLoad.updateRate) document.getElementById("updateRate").value = toLoad.updateRate;
    else document.getElementById("updateRate").value = 50;
    storyShowing = toLoad.storyShowing !== undefined ? toLoad.storyShowing : 0;
    storyMax = toLoad.storyMax !== undefined ? toLoad.storyMax : 0;

    totalOfflineMs = toLoad.totalOfflineMs !== undefined ? toLoad.totalOfflineMs : 0;
    addOffline(Math.floor((new Date() - new Date(toLoad.date)) * offlineRatio));

    if(toLoad.version75 === undefined) {
        let total = towns[0].totalSDungeon;
        dungeons[0][0].completed = Math.floor(total/2);
        dungeons[0][1].completed = Math.floor(total/4);
        dungeons[0][2].completed = Math.floor(total/8);
        dungeons[0][3].completed = Math.floor(total/16);
        dungeons[0][4].completed = Math.floor(total/32);
        dungeons[0][5].completed = Math.floor(total/64);
        towns[0].totalSDungeon = dungeons[0][0].completed + dungeons[0][1].completed + dungeons[0][2].completed + dungeons[0][3].completed + dungeons[0][4].completed + dungeons[0][5].completed
    }

    adjustAll();

    view.changeStatView();
    view.updateNextActions();
    view.updateMultiPartActions();
    view.update();
    recalcInterval(toLoad.updateRate);
    pauseGame();

}

function save() {
    let toSave = {};
    toSave.curLoadout = curLoadout;
    toSave.dungeons = dungeons;
    toSave.maxTown = maxTown;
    toSave.actionTownNum = actionTownNum;
    toSave.trainingLimits = trainingLimits;

    let town = towns[0];
    toSave.stats = stats;
    toSave.totalTalent = totalTalent;
    toSave.skills = skills;
    toSave.buffs = buffs ;
    toSave.expWander = town.expWander;
    toSave.expMet = town.expMet;
    toSave.expSecrets = town.expSecrets;
    toSave.totalHeal = town.totalHeal;
    toSave.totalFight = town.totalFight;
    toSave.totalSDungeon = town.totalSDungeon;

    town = towns[1];
    toSave.expForest = town.expForest;
    toSave.expShortcut = town.expShortcut;
    toSave.expHermit = town.expHermit;
    toSave.expFlowers = town.expFlowers;
    toSave.expThicket = town.expThicket;
    toSave.expWitch = town.expWitch;
    toSave.totalDarkRitual = town.totalDarkRitual

    town = towns[2];
    toSave.expCity = town.expCity;
    toSave.expDrunk = town.expDrunk;
    toSave.totalAdvGuild = town.totalAdvGuild;
    toSave.totalCraftGuild = town.totalCraftGuild;
    toSave.totalLDungeon = town.totalLDungeon;
    toSave.version75 = true;
    toSave.expApprentice = town.expApprentice;
    toSave.expMason = town.expMason;
    toSave.expArchitect = town.expArchitect;

    town = towns[3];
    toSave.expMountain = town.expMountain;
    toSave.expRunes = town.expRunes;
    toSave.expCavern = town.expCavern;
    toSave.expIllusions = town.expIllusions;
    toSave.totalHuntTrolls = town.totalHuntTrolls
    toSave.totalImbueMind = town.totalImbueMind

    town = towns[4];

    town = towns[5];


    for(let i = 0; i < towns.length; i++) {
        town = towns[i];
        for(let j = 0; j < town.totalActionList.length; j++) {
            let action = town.totalActionList[j];
            if (town.varNames.indexOf(action.varName) !== -1) {
                const varName = action.varName;
                toSave["total" + varName] = town["total" + varName];
                toSave["checked" + varName] = town["checked" + varName];
                toSave["good" + varName] = town["good" + varName];
                toSave["goodTemp" + varName] = town["good" + varName];
                if(document.getElementById("searchToggler" + varName)) {
                    toSave["searchToggler"+varName] = document.getElementById("searchToggler" + varName).checked;
                }
            }
        }
    }
    toSave.nextList = actions.next;
    toSave.loadouts = loadouts;
    toSave.loadoutnames = loadoutnames
    toSave.repeatLast = document.getElementById("repeatLastAction").checked;
    toSave.pingOnPause = document.getElementById("audioCueToggle").checked;
    toSave.hotkeys = document.getElementById("hotkeysToggle").checked;
    if (parseFloat(document.getElementById("updateRate").value) > 0) toSave.updateRate = parseFloat(document.getElementById("updateRate").value);
    else toSave.updateRate = 50;
    toSave.storyShowing = storyShowing;
    toSave.storyMax = storyMax;
    toSave.date = new Date();
    toSave.totalOfflineMs = totalOfflineMs;

    saveUISettings()

    window.localStorage[saveName] = JSON.stringify(toSave);
}

function isOldAction(name) {
    if(name === "Wander") {
        return true
    } else if(name === "Smash Pots") {
        return true
    } else if(name === "Pick Locks") {
        return true
    } else if(name === "Buy Glasses") {
        return true
    } else if(name === "Buy Mana") {
        return true
    } else if(name === "Meet People") {
        return true
    } else if(name === "Train Strength") {
        return true
    } else if(name === "Short Quest") {
        return true
    } else if(name === "Investigate") {
        return true
    } else if(name === "Long Quest") {
        return true
    } else if(name === "Warrior Lessons") {
        return true
    } else if(name === "Mage Lessons") {
        return true
    } else if(name === "Throw Party") {
        return true
    } else if(name === "Heal The Sick") {
        return true
    } else if(name === "Fight Monsters") {
        return true
    } else if(name === "Small Dungeon") {
        return true
    } else if(name === "Buy Supplies") {
        return true
    } else if(name === "Haggle") {
        return true
    } else if(name === "Start Journey") {
        return true
    }
    //town 2
    if(name === "Explore Forest") {
        return true
    } else if(name === "Wild Mana") {
        return true
    } else if(name === "Gather Herbs") {
        return true
    } else if(name === "Hunt") {
        return true
    } else if(name === "Sit By Waterfall") {
        return true
    } else if(name === "Old Shortcut") {
        return true
    } else if(name === "Talk To Hermit") {
        return true
    } else if(name === "Practical Magic") {
        return true
    } else if(name === "Learn Alchemy") {
        return true
    } else if(name === "Brew Potions") {
        return true
    } else if(name === "Train Dex") {
        return true
    } else if(name === "Train Speed") {
        return true
    }else if (name === "Continue On") {
        return true
    }
    //town 3
    if(name === "Explore City") {
        return true
    } else if(name === "Gamble") {
        return true
    } else if(name === "Get Drunk") {
        return true
    } else if(name === "Purchase Mana") {
        return true
    } else if(name === "Sell Potions") {
        return true
    } else if(name === "Read Books") {
        return true
    } else if(name === "Adventure Guild") {
        return true
    } else if(name === "Gather Team") {
        return true
    } else if(name === "Large Dungeon") {
        return true
    } else if(name === "Crafting Guild") {
        return true
    } else if(name === "Craft Armor") {
        return true
    } else if(name === "Apprentice") {
        return true
    } else if(name === "Mason") {
        return true
    } else if(name === "Architect") {
        return true
    }

    return false
}

function createOldsave() {
    let toSave = {};
    toSave.curLoadout = Math.min(curLoadout, 5);
    toSave.dungeons = [dungeons[0], dungeons[1]];
    toSave.maxTown = Math.min(maxTown, 2);
    toSave.actionTownNum = 0;
    toSave.trainingLimits = 10;

    let town = towns[0];
    toSave.stats = stats;
    toSave.skills = {};
    for (let i=0; i<4; i++) {
        toSave.skills[buffList[i]] = skills[buffList[i]]
    }
    toSave.expWander = town.expWander;
    toSave.expMet = town.expMet;
    toSave.expSecrets = town.expSecrets;
    toSave.totalHeal = town.totalHeal;
    toSave.totalFight = town.totalFight;
    toSave.totalSDungeon = town.totalSDungeon;

    town = towns[1];
    toSave.expForest = town.expForest;
    toSave.expShortcut = town.expShortcut;
    toSave.expHermit = town.expHermit;

    town = towns[2];
    toSave.expCity = town.expCity;
    toSave.expDrunk = town.expDrunk;
    toSave.totalAdvGuild = town.totalAdvGuild;
    toSave.totalCraftGuild = town.totalCraftGuild;
    toSave.totalLDungeon = town.totalLDungeon;
    toSave.version75 = true;
    toSave.expApprentice = town.expApprentice;
    toSave.expMason = town.expMason;
    toSave.expArchitect = town.expArchitect;

    for(let i = 0; i < towns.length; i++) {
        town = towns[i];
        for(let j = 0; j < town.totalActionList.length; j++) {
            let action = town.totalActionList[j];
            if (town.varNames.indexOf(action.varName) !== -1) {
                const varName = action.varName;
                toSave["total" + varName] = town["total" + varName];
                toSave["checked" + varName] = town["checked" + varName];
                toSave["good" + varName] = town["good" + varName];
                toSave["goodTemp" + varName] = town["good" + varName];
                if(document.getElementById("searchToggler" + varName)) {
                    toSave["searchToggler"+varName] = document.getElementById("searchToggler" + varName).checked;
                }
            }
        }
    }
    toSave.nextList = actions.next;
    toSave.loadouts = loadouts;
    toSave.loadoutnames = loadoutnames
    toSave.repeatLast = document.getElementById("repeatLastAction").checked;
    toSave.pingOnPause = document.getElementById("audioCueToggle").checked;
    toSave.storyShowing = storyShowing;
    toSave.storyMax = storyMax;
    toSave.date = new Date();
    toSave.totalOfflineMs = totalOfflineMs;

    saveUISettings()

    window.localStorage[saveName] = JSON.stringify(toSave);
}

function exportSave() {
    save();
    document.getElementById("exportImport").value = encode(window.localStorage[saveName]);
    document.getElementById("exportImport").select();
    document.execCommand('copy');
}

function importSave() {
    if (document.getElementById("exportImport").value === "") {
        if (!confirm("Importing nothing will delete your save. Are you sure you want to delete your save?")) {
            return false;
        }
    }
    window.localStorage[saveName] = decode(document.getElementById("exportImport").value);
    // console.log(window.localStorage[saveName]);
    actions.next = [];
    actions.current = [];
    load();
    pauseGame();
}

function displayBetaSaveNote() {
    // console.log(isBeta);
    if(!isBeta) return;
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById("betaSave").style.display = "block";
    });
}

function moveSaveToBeta() {
    window.localStorage[saveName] = window.localStorage.idleLoops1;
    location.reload();
}

function moveSaveFromBeta() {
    save();
    window.localStorage.idleLoops1 = window.localStorage[saveName];
}

function exportCurrentList() {
    let toReturn = "";
    for(let i = 0; i < actions.next.length; i++) {
        let action = actions.next[i];
        toReturn += action.loops + "x " + action.name;
        if(i !== actions.next.length - 1) {
            toReturn += "\n";
        }
    }
    document.getElementById("exportImportList").value = toReturn;
    document.getElementById("exportImportList").select();
    document.execCommand('copy');
    document.getElementById("exportImportList").value = "";
}

function importCurrentList() {
    let toImport = document.getElementById("exportImportList").value.split("\n");
    actions.next = [];
    for(let i = 0; i < toImport.length; i++) {
        if(!toImport[i]) {
            continue;
        }
        let name = toImport[i].substr(toImport[i].indexOf("x")+1).trim();
        let loops = toImport[i].substr(0, toImport[i].indexOf("x"));
        let action = translateClassNames(name);
        if(action && action.unlocked()) {
            actions.next.push({name:name, loops:Number(loops)})
        }
    }
    view.updateNextActions();
}

// setInterval(tick, 20);