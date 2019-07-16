/* eslint-disable multiline-comment-style */
// lots of stuff here copied from Trimps (https://trimps.github.io/), since it is a calculator for it afterall
// lots of the math and the idea behind this is based off of the heirloom spreadsheet made by nsheetz from the Trimps discord
// code for spire td damage calcutations (tdcalc.js) from swaq/bhad (http://swaqvalley.com/td_calc/) with permission
// beta VM/XP calculations from ymhsbmbesitwf
// improved miner eff calculation from GhostFrog
// minor help from SpectralFlame, Razenpok, and GhostFrog
// I hope this tool is useful! :)

// patch notes: (maybe move these somewhere visible on the main page later, instead of just a link in the corner)

/*

v1.18 radiating heirloom support for test version
v1.17 next core upgrade display
v1.16 more accurate core calculations
v1.15 fix empty mods breaking, fix breaking if spire 1 not cleared, fix log notation
v1.14 fix no core hard caps
v1.13 add core weighting, heirloom cost display, truncate gain/eff display nums, bug fixes, code cleanup, and html/css cleanup
v1.12 allow swapping of weighted heirlooms from carried looms, move new vm/xp calculations to a beta switch and use legacy calcs by default, fix crit dmg/chance calcs breaking if the shield only had one of said stats, fix all calcs breaking if you didn't have trimp attack, new versioning system
v1.11 fix classy breaking caluclations, minor code cleanup
v1.10 new miner eff, vmdc, and fluffy exp gain calculations with new inputs to make them work, lots of background cleanup and a better localstorage usage system, improved/minor fixes to css
v1.09 fix NaN values at equip level input of 1
v1.08 equipment level input
v1.07 fix charged crits not being properly accounted for, fix relentless math being wrong at low levels
v1.06 fix base prices not actually being enforced
v1.05 make heirloom animations disabled if save has them turned off, display additional information about each heirloom in a ? tooltip in the corner of heirloom containers
v1.04 fix floating point errors being displayed
v1.03 make calculation happen automatically on save input
v1.02 make save input clear on input focus, fix plagued heirloom animation
v1.01: make custom weights save on refresh, add description of weights to help tooltip
v1.00: release

*/

let save;
let time;
const globalVersion = 1.18;
document.getElementById("versionNumber").textContent = globalVersion;

const checkboxNames = ["E4", "E5", "CC", "Beta"];
const textboxNames = ["VMWeight", "XPWeight", "weaponLevels", "portalZone", "voidZone"];
const inputs = {
    VMWeight: 12,
    XPWeight: 11.25,
    weaponLevels: 90,
    portalZone: 1,
    voidZone: 1,
    version: globalVersion,
    E4: false,
    E5: false,
    CC: false,
    Beta: false,
    preferredShield: {
        name: "",
        index: 0
    },
    preferredStaff: {
        name: "",
        index: 0
    },
    preferredCore: {
        name: "",
        index: 0
    },
    coreUnlocked: false,
    setInput(name, value) {
        if (checkboxNames.includes(name)) document.getElementById(`${name}Input`).checked = value;
        else if (textboxNames.includes(name)) document.getElementById(`${name}Input`).value = value;

        this[name] = value;
        localStorage.setItem("heirloomsInputs", JSON.stringify(inputs));
    }
};

if (localStorage.getItem("heirloomsInputs") !== null) {
    const savedInputs = JSON.parse(localStorage.getItem("heirloomsInputs"));
    for (input in JSON.parse(localStorage.getItem("heirloomsInputs"))) {
        if (input === "VMWeight" && savedInputs[input] === 12) continue;
        else if (input === "XPWeight" && savedInputs[input] === 11.25) continue;
        else if (input === "coreUnlocked" && savedInputs[input]) {
            document.getElementById("coreOldContainer").style.display = "block";
            document.getElementById("nextUpgradesContainer").innerHTML =
                `You have ??? Nullifium and ??? Spirestones.
                <br>
                Your next upgrades should be ??? at ??? Nullifium, and ??? at ??? Spirestones.`;
        }
        inputs.setInput(input, savedInputs[input]);
    }
}

function updateVersion() {
    if (inputs.version < 1.18) inputs.version = 1.18;
}

updateVersion();

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isEmpty(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function updateInput(name, value, position) {
    const inputDiv = document.getElementById(`${name}Input`);
    if (checkboxNames.includes(name)) inputs[name] = inputDiv.checked;
    else if (name === "VMWeight" && inputDiv.value === "") {
        inputs[name] = 12;
    } else if (name === "XPWeight" && inputDiv.value === "") {
        inputs[name] = 11.25;
    } else if (name.includes("preferred") && position !== undefined) {
        const cachedL = document.getElementById("inventoryColumn1").children.length + document.getElementById("inventoryColumn2").children.length;
        const type = name.split("preferred")[1];
        for (let i = 0; i < cachedL; i++) {
            if (document.getElementById(`carriedHeirloom${i}`).classList[3].includes(type)) document.getElementById(`carriedHeirloom${i}`).classList.remove("selected");
        }
        if (value === inputs[`preferred${type}`].name) {
            if (containsDuplicate(save.global.heirloomsCarried, value)) {
                if (position === inputs[`preferred${type}`].index) {
                    inputs[name].name = "";
                    inputs[name].index = -1;
                } else {
                    document.getElementById(`carriedHeirloom${position}`).classList.add("selected");
                    inputs[name].name = value;
                    inputs[name].index = position;
                }
            } else {
                inputs[name].name = "";
                inputs[name].index = -1;
            }
        } else {
            document.getElementById(`carriedHeirloom${position}`).classList.add("selected");
            inputs[name].name = value;
            inputs[name].index = position;
        }
    } else if (isNumeric(inputDiv.value)) {
        inputs[name] = parseFloat(inputDiv.value);
    }
    if (save) {
        calculate(true);
    }
    localStorage.setItem("heirloomsInputs", JSON.stringify(inputs));
}

// remove old data
localStorage.removeItem("VMWeight");
localStorage.removeItem("XPWeight");
localStorage.removeItem("ELWeight");

localStorage.removeItem("heirloomInputs");

Math.log = (function() {
    const log = Math.log;
    return function(n, base) {
        return log(n) / (base ? log(base) : 1);
    };
}());

const modNames = {
    breedSpeed: "Breed Speed",
    critChance: "Crit Chance, additive",
    critDamage: "Crit Damage, additive",
    plaguebringer: "Plaguebringer",
    playerEfficiency: "Player Efficiency",
    storageSize: "Storage Size",
    trainerEfficiency: "Trainer Efficiency",
    trimpAttack: "Trimp Attack",
    trimpBlock: "Trimp Block",
    trimpHealth: "Trimp Health",
    voidMaps: "Void Map Drop Chance",
    prismatic: "Prismatic Shield",
    gammaBurst: "Gamma Burst",

    DragimpSpeed: "Dragimp Efficiency",
    ExplorerSpeed: "Explorer Efficiency",
    FarmerSpeed: "Farmer Efficiency",
    FluffyExp: "Fluffy Exp",
    LumberjackSpeed: "Lumberjack Efficiency",
    MinerSpeed: "Miner Efficiency",
    ScientistSpeed: "Scientist Efficiency",
    foodDrop: "Food Drop Rate",
    fragmentsDrop: "Fragment Drop Rate",
    gemsDrop: "Gem Drop Rate",
    metalDrop: "Metal Drop Rate",
    woodDrop: "Wood Drop Rate",

    fireTrap: "Fire Trap Damage",
    poisonTrap: "Poison Trap Damage",
    lightningTrap: "Lightning Trap Damage",
    strengthEffect: "Strength Tower Effect",
    condenserEffect: "Condenser Effect",
    runestones: "Runestone Drop Rate"
};

const fancyModNames = {
    breedSpeed: "Breed Speed",
    critChance: "Crit Chance",
    critDamage: "Crit Damage",
    plaguebringer: "Plaguebringer",
    playerEfficiency: "Player Efficiency",
    storageSize: "Storage Size",
    trainerEfficiency: "Trainer Efficiency",
    trimpAttack: "Trimp Attack",
    trimpBlock: "Trimp Block",
    trimpHealth: "Trimp Health",
    voidMaps: "Void Map Drop Chance",
    prismatic: "Prismatic Shield",
    gammaBurst: "Gamma Burst",

    DragimpSpeed: "Dragimp Efficiency",
    ExplorerSpeed: "Explorer Efficiency",
    FarmerSpeed: "Farmer Efficiency",
    FluffyExp: "Fluffy Exp",
    LumberjackSpeed: "Lumberjack Efficiency",
    MinerSpeed: "Miner Efficiency",
    ScientistSpeed: "Scientist Efficiency",
    foodDrop: "Food Drop Rate",
    fragmentsDrop: "Fragment Drop Rate",
    gemsDrop: "Gem Drop Rate",
    metalDrop: "Metal Drop Rate",
    woodDrop: "Wood Drop Rate",

    fireTrap: "Fire",
    poisonTrap: "Poison",
    lightningTrap: "Lightning",
    strengthEffect: "Strength",
    condenserEffect: "Condenser",
    runestones: "Runestones"
};

const modsToWeigh = ["trimpAttack", "critDamage", "critChance", "voidMaps", "plaguebringer", "FluffyExp", "MinerSpeed", "fireTrap", "poisonTrap", "lightningTrap", "strengthEffect", "condenserEffect", "runestones"];
const modsToWeighShield = ["trimpAttack", "critDamage", "critChance", "voidMaps", "plaguebringer"];
const modsToWeighStaff = ["FluffyExp", "MinerSpeed"];
const modsToWeighCore = ["fireTrap", "poisonTrap", "lightningTrap", "strengthEffect", "condenserEffect", "runestones"];

const rarityNames = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Magnificent", "Ethereal", "Magmatic", "Plagued", "Radiating"];

const basePrices = [5, 10, 15, 25, 75, 150, 400, 1000, 2500, 5000];
const coreBasePrices = [20, 200, 2000, 20000, 200000, 2000000, 20000000, 200000000, 2000000000, 20000000000];
const priceIncreases = [1.5, 1.5, 1.25, 1.19, 1.15, 1.12, 1.1, 1.06, 1.04, 1.03];

const stepAmounts = {
    playerEfficiency: [1, 1, 1, 2, 4, 8, 16, 32, 64, 128],
    trainerEfficiency: [1, 1, 1, 2, 2, 2, 2, 2, 2, 0],
    storageSize: [4, 4, 4, 4, 8, 16, 16, 16, 16, 0],
    breedSpeed: [1, 1, 1, 1, 3, 3, 3, 3, 3, 5],
    trimpHealth: [2, 2, 2, 2, 5, 5, 5, 6, 8, 10],
    trimpBlock: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    gammaBurst: [0, 0, 0, 0, 0, 0, 0, 0, 0, 100],
    prismatic: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2],

    critChance: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.5, 0.5],
    critDamage: [5, 5, 5, 5, 10, 10, 10, 10, 15, 20],
    trimpAttack: [2, 2, 2, 2, 5, 5, 5, 6, 8, 10],
    voidMaps: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.25, 0.25],
    plaguebringer: [0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0],

    metalDrop: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
    foodDrop: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
    woodDrop: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
    gemsDrop: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
    fragmentsDrop: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
    FarmerSpeed: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
    LumberjackSpeed: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
    DragimpSpeed: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
    ExplorerSpeed: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
    ScientistSpeed: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],

    FluffyExp: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    MinerSpeed: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],

    fireTrap: [1, 1, 1, 1, 2, 3, 4],
    poisonTrap: [1, 1, 1, 1, 2, 3, 4],
    lightningTrap: [0, 0, 1, 1, 2, 2, 3],
    strengthEffect: [1, 1, 1, 1, 2, 2, 3],
    condenserEffect: [0, 0.25, 0.25, 0.25, 0.5, 0.5, 0.5],
    runestones: [1, 1, 1, 1, 2, 3, 4]
};

const maxAmounts = {
    playerEfficiency: [16, 16, 16, 32, 64, 128, 256, 512, 1024, 2048],
    trainerEfficiency: [20, 20, 20, 40, 60, 80, 100, 120, 140, 0],
    storageSize: [64, 64, 64, 128, 256, 512, 768, 1024, 1280, 0],
    breedSpeed: [10, 10, 10, 20, 100, 130, 160, 190, 220, 280],
    trimpHealth: [20, 20, 20, 40, 100, 150, 200, 260, 356, 460],
    trimpBlock: [7, 7, 7, 10, 40, 60, 80, 100, 120, 0],
    gammaBurst: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2000],
    prismatic: [0, 0, 0, 0, 0, 0, 0, 0, 0, 50],

    critChance: [2.6, 2.6, 2.6, 5.0, 7.4, 9.8, 12.2, 15.9, 30, 50],
    critDamage: [60, 60, 60, 100, 200, 300, 400, 500, 650, 850],
    trimpAttack: [20, 20, 20, 40, 100, 150, 200, 260, 356, 460],
    voidMaps: [7, 7, 7, 11, 16, 22, 30, 38, 50, 60],
    plaguebringer: [0, 0, 0, 0, 0, 0, 0, 0, 15, 0],

    metalDrop: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    foodDrop: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    woodDrop: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    gemsDrop: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    fragmentsDrop: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    FarmerSpeed: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    LumberjackSpeed: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    DragimpSpeed: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    ExplorerSpeed: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    ScientistSpeed: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],

    FluffyExp: [0, 0, 0, 0, 0, 0, 0, 0, 50, 100],
    MinerSpeed: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],

    fireTrap: [25, 25, 25, 50, 100, 199, 400],
    poisonTrap: [25, 25, 25, 50, 100, 199, 400],
    lightningTrap: [0, 0, 10, 20, 50, 100, 199],
    strengthEffect: [10, 10, 10, 20, 50, 100, 199],
    condenserEffect: [0, 5, 5, 10, 15, 20, 30],
    runestones: [25, 25, 25, 50, 100, 199, 400]
};

const hardCaps = {
    critChance: [30, 30, 30, 30, 30, 30, 30, 30, 100],
    voidMaps: [50, 50, 50, 50, 50, 50, 50, 50, 80],
    plaguebringer: [0, 0, 0, 0, 0, 0, 0, 0, 75],
    prismatic: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 150],

    condenserEffect: [0, 10, 10, 15, 25, 35, 50]
};

// below code is from /u/ymhsbmbesitwf on reddit
/**
 * useful constants
 */
// trimps updates.js : getAchievementStrengthLevel()
const achievementTiers = [15, 100, 300, 600, 1000, 2000];
// trimps main.js : prestigeEquipment(what, fromLoad, noInc)
// trimps config.js : prestige
const attackPrestigeMultiplier = Math.pow(1.19, 13);
// trimps main.js : checkVoidMap()
// actual chance works independently from Heirloom Bonus.
const averageCellsAfterMin = 891.0401556784;
// trimps config.js : badGuys
// world enemies with all relevant Exotic Imp-orts unlocked, lies only by up to 3.7% otherwise.
const averageBadGuyHealthMod = (0.7 + 1.3 + 1.3 + 1 + 0.7 + 0.8 + 1.1 + 1.6 + 1.5 + 1 + 1 + 1 + 1 + 1) / 14;
// trimps main.js : Fluffy
const fluffyRewards = { voidance: 12, critChance: 14, megaCrit: 15, voidelicious: 17 };
// trimps config.js : goldenUpgrades
// trimps main.js: buyGoldenUpgrade(what)
const goldenVoid = [0.0, 0.02, 0.06, 0.12, 0.2, 0.3, 0.42, 0.56, 0.72];

/**
 * variables that need to be read from save / settings.
 */

// portalZone recommended default: save.global.highestLevelCleared + 1
// because save.global.lastPortal can be sometimes wrong,
// e.g. artificially low after c^2 (Trimp etc) and players
// might not recognize the significance

// voidZone recommended default: save.stats.highestVoidMap

/**
 * Prestige + Fluffinity + Level
 */
function fluffyRewardsAvailable() {
    // trimps main.js : Fluffy 
    const fluffyLevel = Math.floor(Math.log(((save.global.fluffyExp / (1000 * Math.pow(5, save.global.fluffyPrestige))) * 3) + 1) / Math.log(4));
    return (save.global.fluffyPrestige + (save.talents.fluffyAbility.purchased ? 1 : 0) + fluffyLevel);
}

/**
 * should account for everything except:
 * 1) Z1-Z10 health nerfs: irrelevant
 * 2) Nature enemies: ignored on purpose
 * 3) Magma placement: this random factor shouldn't influence the average too much
 */
function totalEnemyHealthInZone(zone) {
    // trimps config.js getEnemyHealth: function (level, name, ignoreImpStat)
    let amt = 130 * Math.sqrt(zone) * Math.pow(3.265, zone / 2) - 110;
    let averageCell = (0 + 98) / 2;
    let total = 0;
    if (zone < 60) {
        total += ((amt * 0.4) + ((amt * 0.4) * (averageCell / 110))) * averageBadGuyHealthMod * 99;
        // blimp
        total += ((amt * 0.4) + ((amt * 0.4) * (99 / 110))) * 2;
    } else {
        amt *= Math.pow(1.1, zone - 59);
        // trimps main.js Corruption
        let corruptionStart = 181;
        if (save.talents.headstart3.purchased) corruptionStart = 151;
        else if (save.talents.headstart2.purchased) corruptionStart = 166;
        else if (save.talents.headstart1.purchased) corruptionStart = 176;
        if (zone < corruptionStart) {
            total += ((amt * 0.5) + ((amt * 0.8) * (averageCell / 100))) * averageBadGuyHealthMod * 99;
        } else {
            let corruptionCells = Math.min(Math.floor((zone - corruptionStart) / 3) + 2, 80);
            const corruptionMaxCell = Math.min(((Math.floor(corruptionCells / 6) + 1) * 10) - 1, 98);
            let corruptionStatScale = 10 * Math.pow(1.05, Math.floor((zone - 150) / 6));
            // corruptTough, corruptDodge
            corruptionStatScale = ((corruptionStatScale * 4) + (corruptionStatScale * 5) + (corruptionStatScale / 0.7)) / 6;
            let healthyCells = 0;
            let healthyMaxCell = -1;
            let healthyStatScale = 14 * Math.pow(1.05, Math.floor((zone - 150) / 6));
            // healthyTough
            healthyStatScale = ((healthyStatScale * 4) + (healthyStatScale * 7.5)) / 5;
            // checking Spire II Achievement, because current run might not be there yet.
            if ((zone > 300) && (save.achievements.spire2Timed.highest !== 0)) {
                healthyCells = Math.min(Math.floor((zone - 300) / 15) + 2, 80);
                healthyMaxCell = Math.min((Math.floor(healthyCells / 6) + 1) * 10, 98);
                corruptionCells -= healthyCells;
            }
            let averageHealth = 0;
            let corruptionCellsOverlap = 0;
            // overlap (average)
            if (healthyCells > 0) {
                averageCell = (0 + healthyMaxCell) / 2;
                averageHealth = ((amt * 0.5) + ((amt * 0.8) * (averageCell / 100))) * averageBadGuyHealthMod;
                corruptionCellsOverlap = (healthyMaxCell - healthyCells) / (corruptionMaxCell - healthyCells) * corruptionCells;
                total += averageHealth * healthyStatScale * healthyCells;
                total += averageHealth * corruptionStatScale * corruptionCellsOverlap;
                total += averageHealth * ((healthyMaxCell + 1) - healthyCells - corruptionCellsOverlap);
            }
            // corruption
            if (healthyMaxCell < corruptionMaxCell) {
                averageCell = ((healthyMaxCell + 1) + corruptionMaxCell) / 2;
                averageHealth = ((amt * 0.5) + ((amt * 0.8) * (averageCell / 100))) * averageBadGuyHealthMod;
                total += averageHealth * corruptionStatScale * (corruptionCells - corruptionCellsOverlap);
                total += averageHealth * (((corruptionMaxCell + 1) - (healthyMaxCell + 1)) - (corruptionCells - corruptionCellsOverlap));
            }
            // above Corruption
            if (corruptionMaxCell < 98) {
                averageCell = ((corruptionMaxCell + 1) + 98) / 2;
                averageHealth = ((amt * 0.5) + ((amt * 0.8) * (averageCell / 100))) * averageBadGuyHealthMod;
                total += averageHealth * (98 - corruptionMaxCell);
            }
        }
        // improbability
        total += ((amt * 0.4) + ((amt * 0.4) * (99 / 110))) * 6;
    }
    return total;
}

/**
 * has to include Classy, so it's accurate only for saves with intended Perk allocation
 * and will result in slightly higher (I think) Fluffy priority with some c^2 specs.
 * now includes Spire rewards, since almost all runs clear at least few rows of top Spire.
 */
function totalFluffyExpModifierUpToZone(zone) {
    let start = 300;
    if (save.portal.Classy.level) {
        start = Math.floor(start - (save.portal.Classy.level * 2));
    }
    let i = 0;
    let modifier = 0;
    for (i = start; i < zone; ++i) {
        modifier += Math.pow(1.015, i - start) * ((start % 100 === 0) ? 3 : 1);
    }
    return modifier;
}

/**
 * should account for everything except:
 * 1) Looting bonuses: on purpose
 * 2) Fluffy / Daily bonuses: on purpose
 * 3) Spire Rows: many runs don't clear top Spire, don't want to guess the rows
 */
function voidHeliumInZone(zone) {
    // trimps config.js Cthulimp.loot
    let amt = ((zone >= 60) ? 10 : 2) * ((zone >= 230) ? 3 : 1);
    let corruptionStart = 181;
    if (save.talents.headstart3.purchased) corruptionStart = 151;
    else if (save.talents.headstart2.purchased) corruptionStart = 166;
    else if (save.talents.headstart1.purchased) corruptionStart = 176;
    if (zone >= corruptionStart) {
        amt *= 2;
        const healthyCells = ((zone > 300) && (save.achievements.spire2Timed.highest !== 0)) ? Math.min(Math.floor((zone - 300) / 15) + 2, 80) : 0;
        const corruptionCells = Math.min(Math.floor((zone - corruptionStart) / 3) + 2, 80) - healthyCells;
        amt *= 1 + 0.15 * corruptionCells + 0.45 * healthyCells;
    }
    // trimp main.js rewardResource(what, baseAmt, level, checkMapLootScale, givePercentage)
    // if zone >= 19 to prevent NaN results
    if (zone >= 19) amt *= ((zone - 19) * 1.35) + Math.pow(1.23, Math.sqrt((zone - 19) * 1.35));
    if (save.global.sLevel >= 5) {
        amt *= Math.pow(1.005, zone);
    }
    return amt;
}

/**
 * average VMs gathered up to zone, with starting bonuses based on portal.
 */
function voidMapsUpToZone(zone, portal, heirloomBonus) {
    let voidMaps = 0;
    // trimps updates.js : resetGame(keepPortal)
    if (save.talents.voidSpecial.purchased) {
        voidMaps += Math.floor(portal / 100);
        if (save.talents.voidSpecial2.purchased) {
            voidMaps += Math.floor((portal + 50) / 100);
        }
    }
    // trimps main.js : Fluffy
    const fluffyAvailable = fluffyRewardsAvailable();
    if (fluffyAvailable >= fluffyRewards.voidance) {
        voidMaps += 2;
        if (fluffyAvailable >= fluffyRewards.voidelicious) {
            voidMaps += 16;
        }
    }
    // trimps main.js : getAvailableGoldenUpgrades()
    // trimps updates.js : countExtraAchievementGoldens()
    let goldenUpgrades = Math.floor((save.global.achievementBonus - 2000) / 500);
    if (goldenUpgrades <= 0)
        goldenUpgrades = 0;
    let goldenMax = 8;
    // reasonable assumption by omsi6
    if (!save.talents.voidSpecial.purchased) {
        goldenUpgrades = 0;
        goldenMax = 0;
    }
    let goldenTier = 6;
    while ((goldenTier > 0) && (save.global.achievementBonus < achievementTiers[goldenTier - 1])) {
        --goldenTier;
    }
    const goldenFrequency = 50 - ((goldenTier - 1) * 5);
    // trimps main.js : checkVoidMap()
    const max = save.global.highestLevelCleared;
    let zonesCleared = 0;
    while ((zonesCleared < zone) && (goldenUpgrades <= goldenMax)) {
        let min = (max > 80) ? (1000 + ((max - 80) * 13)) : 1000;
        min *= (1 - (heirloomBonus / 100));
        min *= (1 - goldenVoid[goldenUpgrades]);
        let zonesWithCurrentUpgrade = goldenFrequency;
        if (((zonesCleared + zonesWithCurrentUpgrade) > zone) || (goldenUpgrades === goldenMax)) {
            zonesWithCurrentUpgrade = zone - zonesCleared;
        }
        voidMaps += (zonesWithCurrentUpgrade * 100) / (min + averageCellsAfterMin);
        zonesCleared += zonesWithCurrentUpgrade;
        ++goldenUpgrades;
    }
    return voidMaps;
}

function getUpgValue(type, heirloom) {
    for (const mod of heirloom.mods) {
        if (mod[0] === type) {
            return mod[1];
        }
    }
    return false;
}

// add arrays for max normal values, if below or equal to, return normal price, else divide the amount over the normal value by the step to get amount and calculate the price with the amount
function getUpgCost(type, heirloom) {
    const rarity = heirloom.rarity;
    const value = getUpgValue(type, heirloom);
    let basePrice;
    if (heirloom.type === "Core") {
        basePrice = coreBasePrices[heirloom.rarity];
    } else {
        basePrice = basePrices[heirloom.rarity];
    }
    if (value <= maxAmounts[type][rarity] || !isNumeric(value)) {
        return basePrice;
    }
    const amount = (value - maxAmounts[type][rarity]) / stepAmounts[type][rarity];
    if (hardCaps[type]) {
        return (value >= hardCaps[type][rarity]) ? 1e20 : Math.floor(basePrice * Math.pow(priceIncreases[rarity], amount));
    }
    return Math.floor(basePrice * Math.pow(priceIncreases[rarity], amount));
}

function getUpgGain(type, heirloom) {
    const value = getUpgValue(type, heirloom);
    const stepAmount = stepAmounts[type][heirloom.rarity];
    if (type === "trimpAttack") {
        // this below line is just to allow the heirloom to still be weighed, even if the heirloom is missing trimp attack (/ 10000 is "arbitrary", just there to keep numbers reasonable)
        if (!isNumeric(value)) return 1 + stepAmount / 10000;
        return (value + 100 + stepAmount) / (value + 100);
    }
    if (type === "critDamage") {
        const relentlessness = save.portal.Relentlessness.level;
        let critChance = relentlessness * 5;
        let megaCritMult = 5;
        let critDmgNormalizedBefore = 0;
        let critDmgNormalizedAfter = 0;
        if (isNumeric(getUpgValue("critChance", heirloom))) {
            if (inputs.CC) critChance += getUpgValue("critChance", heirloom) * 1.5;
            else critChance += getUpgValue("critChance", heirloom);
        }
        if (inputs.E4) {
            critChance += 50;
        }
        if (inputs.E5) {
            megaCritMult += 2;
        }
        if (inputs.CC) {
            megaCritMult += 1;
        }
        const megaCrits = Math.min(Math.floor(critChance / 100), 2);
        critChance = Math.min(critChance - megaCrits * 100, 100) / 100;
        const critDamage = value + 230 * Math.min(relentlessness, 1) + 30 * Math.max((Math.min(relentlessness, 10) - 1), 0);
        switch (megaCrits) {
            case 2:
                critDmgNormalizedBefore = critDamage * megaCritMult * ((1 - critChance) + megaCritMult * critChance);
                break;
            case 1:
                critDmgNormalizedBefore = critDamage * ((1 - critChance) + megaCritMult * critChance);
                break;
            case 0:
                critDmgNormalizedBefore = critDamage * critChance + ((1 - critChance) * 100);
                break;
        }
        switch (megaCrits) {
            case 2:
                critDmgNormalizedAfter = (critDamage + stepAmount) * megaCritMult * ((1 - critChance) + megaCritMult * critChance);
                break;
            case 1:
                critDmgNormalizedAfter = (critDamage + stepAmount) * ((1 - critChance) + megaCritMult * critChance);
                break;
            case 0:
                critDmgNormalizedAfter = (critDamage + stepAmount) * critChance + ((1 - critChance) * 100);
                break;
        }

        return critDmgNormalizedAfter / critDmgNormalizedBefore;
    }
    if (type === "critChance") {
        const relentlessness = save.portal.Relentlessness.level;
        let critChanceBefore = relentlessness * 5;
        let critChanceAfter = relentlessness * 5;
        let critDamage = 230 * Math.min(relentlessness, 1) + 30 * Math.min(relentlessness, 9);
        let megaCritMult = 5;
        let critDmgNormalizedBefore = 0;
        let critDmgNormalizedAfter = 0;
        if (inputs.CC) critChanceBefore += value * 1.5;
        else critChanceBefore += value;
        if (isNumeric(getUpgValue("critDamage", heirloom))) {
            critDamage += getUpgValue("critDamage", heirloom);
        }
        if (inputs.E4) {
            critChanceBefore += 50;
        }
        if (inputs.E5) {
            megaCritMult += 2;
        }
        if (inputs.CC) {
            megaCritMult += 1;
        }
        const megaCritsBefore = Math.min(Math.floor(critChanceBefore / 100), 2);
        const megaCritsAfter = Math.min(Math.floor((critChanceBefore + ((inputs.CC) ? stepAmount * 1.5 : stepAmount)) / 100), 2);
        critChanceAfter = Math.min((critChanceBefore + ((inputs.CC) ? stepAmount * 1.5 : stepAmount)) - megaCritsAfter * 100, 100) / 100;
        critChanceBefore = Math.min(critChanceBefore - megaCritsBefore * 100, 100) / 100;
        switch (megaCritsBefore) {
            case 2:
                critDmgNormalizedBefore = critDamage * megaCritMult * ((1 - critChanceBefore) + megaCritMult * critChanceBefore);
                break;
            case 1:
                critDmgNormalizedBefore = critDamage * ((1 - critChanceBefore) + megaCritMult * critChanceBefore);
                break;
            case 0:
                critDmgNormalizedBefore = critDamage * critChanceBefore + ((1 - critChanceBefore) * 100);
                break;
        }
        switch (megaCritsAfter) {
            case 2:
                critDmgNormalizedAfter = critDamage * megaCritMult * ((1 - critChanceAfter) + megaCritMult * critChanceAfter);
                break;
            case 1:
                critDmgNormalizedAfter = critDamage * ((1 - critChanceAfter) + megaCritMult * critChanceAfter);
                break;
            case 0:
                critDmgNormalizedAfter = critDamage * critChanceAfter + ((1 - critChanceAfter) * 100);
                break;
        }

        return critDmgNormalizedAfter / critDmgNormalizedBefore;
    }
    if (type === "voidMaps") {
        if (inputs.Beta) {
            const voidMapsOld = voidMapsUpToZone(inputs.voidZone, inputs.portalZone, value);
            const voidMapsNew = voidMapsUpToZone(inputs.voidZone, inputs.portalZone, value + stepAmount);
            let upgGain = voidMapsNew / voidMapsOld;

            // using step 10 for Prestige reasons, 30 in Magma is the lowest common denominator with Nature.
            // It's prefered to using 1 or 5 zones, because Corrupted/Healthy stats jump a bit every 6 zones.
            const zoneStep = (inputs.portalZone > 235) ? 30 : 10;
            // ignoring cost scaling. Has little effect in late, but might lie a bit in early game.
            // Buying multiple levels of last few Prestiges (or even Prestiges themselves) used to be
            // difficult before unlocking Jestimp and Motivation II, not sure how it is now with Caches.
            // Example results (formatted to display average per zone scaling)
            //  Z20: 1.843938^10 / 9.596448^2
            //  Z49: 1.823788^10 / 9.596448^2
            //  Z55: 2.019369^10 / 9.596448^2
            //  Z60: 2.003003^10 / 9.596448^2
            // Z100: 1.997119^10 / 9.596448^2
            // Z180: 2.048560^10 / 9.596448^2
            // Z235: 2.017895^10 / 9.596448^2
            // Z236: 2.027765^30 / 9.596448^6
            // Z450: 2.006783^30 / 9.596448^6
            // Z650: 2.006184^30 / 9.596448^6
            // Results will be slightly different without Headstarts.
            let attackScalingNeeded = totalEnemyHealthInZone(inputs.portalZone + zoneStep) / totalEnemyHealthInZone(inputs.portalZone);
            attackScalingNeeded /= Math.pow(attackPrestigeMultiplier, zoneStep / 5);
            let heliumScaling = voidHeliumInZone(inputs.voidZone + zoneStep) / voidHeliumInZone(inputs.voidZone);
            const voidMapsHigherZone = voidMapsUpToZone(inputs.voidZone + zoneStep, inputs.portalZone + zoneStep, value);
            heliumScaling *= voidMapsHigherZone / voidMapsOld;
            // scaling upgGain to Trimp Attack by comparing Helium gained (VM only)
            upgGain = Math.pow(upgGain, Math.log(attackScalingNeeded) / Math.log(heliumScaling));

            // adding VMWeight (default: 1) in a manner consistent with previous calculation
            return (1 + (upgGain - 1) * inputs.VMWeight);
        }
        return (value + stepAmount * inputs.VMWeight) / (value);
    }
    if (type === "FluffyExp") {
        if (inputs.Beta) {
            let upgGain = (value + 100 + stepAmount) / (value + 100);
            // avoiding weird stuff with zero division.
            // Results in very low Fluffy priority if portalZone is <301 for some reason. Shouldn't be a problem.
            if (inputs.portalZone >= 301) {
                // scaling to Attack by comparing Exp gained from additional zones
                const pushGain = totalFluffyExpModifierUpToZone(inputs.portalZone + 30) / totalFluffyExpModifierUpToZone(inputs.portalZone);
                let attackScalingNeeded = totalEnemyHealthInZone(inputs.portalZone + 30) / totalEnemyHealthInZone(inputs.portalZone);
                attackScalingNeeded /= Math.pow(attackPrestigeMultiplier, 30 / 5);
                upgGain = Math.pow(upgGain, Math.log(attackScalingNeeded) / Math.log(pushGain));
            }
            // adding XPWeight (default: 1) in a manner consistent with previous calculation
            return (1 + (upgGain - 1) * inputs.XPWeight);
        }
        return (value + 100 + stepAmount * inputs.XPWeight) / (value + 100);
    }
    if (type === "plaguebringer") {
        return (value + 100 + stepAmount) / (value + 100);
    }
    if (type === "MinerSpeed") {
        return (Math.log((value + 100 + stepAmount) / (value + 100) * (Math.pow(1.2, inputs.weaponLevels) - 1) + 1) / Math.log(1.2)) / inputs.weaponLevels;
    }
    if (modsToWeighCore.includes(type)) {
        loadCore(heirloom);
        const before = getMaxEnemyHP();
        const beforeRS = estimatedMaxDifficulty(getMaxEnemyHP()).runestones;
        loadCore(heirloom, modNamesToTraps[type], value + stepAmount);
        const after = getMaxEnemyHP();
        const afterRS = estimatedMaxDifficulty(getMaxEnemyHP()).runestones;
        // 0.971 is the andrew constant, thanks andrew
        // also ghostfrog, pls pm me to tell me how I did this wrong again
        if (type === "runestones") return (afterRS / beforeRS - 1) * 0.971;
        return after / before - 1;
    }
    return false;
}

function getUpgEff(type, shield, heirloom) {
    if (type === "trimpAttack") {
        return 1;
    }
    if (modsToWeighShield.includes(type)) {
        return Math.log(getUpgGain(type, heirloom), getUpgGain("trimpAttack", shield)) * getUpgCost("trimpAttack", shield) / getUpgCost(type, heirloom);
    }
    if (modsToWeighStaff.includes(type)) {
        return Math.log(getUpgGain(type, heirloom), getUpgGain("trimpAttack", shield)) * getUpgCost("trimpAttack", shield) / getUpgCost(type, heirloom);
    }
    if (modsToWeighCore.includes(type)) {
        return (getUpgGain(type, heirloom) * 100 / getUpgCost(type, heirloom)) * coreBasePrices[heirloom.rarity];
    }
    return false;
}

function prettifySub(number) {
    number = parseFloat(number);
    const floor = Math.floor(number);
    // number is an integer, just show it as-is
    if (number === floor) return number;
    return number.toFixed(3 - floor.toString().length);
}

function prettify(number) {
    const numberTmp = number;
    if (!isFinite(number)) return "<span class='icomoon icon-infinity'></span>";
    if (number >= 1000 && number < 10000) return Math.floor(number);
    if (number === 0) return prettifySub(0);
    if (number < 0) return `-${prettify(-number)}`;
    if (number < 0.005) return (Number(number)).toExponential(2);

    let base = Math.floor(Math.log(number) / Math.log(1000));
    if (base <= 0) return prettifySub(number);

    if (game.options.menu.standardNotation.enabled === 5) {
        // thanks ZXV
        const logBase = game.options.menu.standardNotation.logBase;
        const exponent = Math.log(number) / Math.log(logBase);
        return `${prettifySub(exponent)}L${logBase}`;
    }


    number /= Math.pow(1000, base);
    if (number >= 999.5) {
        // 999.5 rounds to 1000 and we don’t want to show “1000K” or such
        number /= 1000;
        ++base;
    }
    
    let suffices;
    let suffix;
    if (game.options.menu.standardNotation.enabled === 3) {
        suffices = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        if (base <= suffices.length) suffix = suffices[base - 1];
        else {
            let suf2 = (base % suffices.length) - 1;
            if (suf2 < 0) suf2 = suffices.length - 1;
            suffix = suffices[Math.ceil(base / suffices.length) - 2] + suffices[suf2];
        }
    } else {
        suffices = [
            "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "Ud",
            "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Od", "Nd", "V", "Uv", "Dv",
            "Tv", "Qav", "Qiv", "Sxv", "Spv", "Ov", "Nv", "Tg", "Utg", "Dtg", "Ttg",
            "Qatg", "Qitg", "Sxtg", "Sptg", "Otg", "Ntg", "Qaa", "Uqa", "Dqa", "Tqa",
            "Qaqa", "Qiqa", "Sxqa", "Spqa", "Oqa", "Nqa", "Qia", "Uqi", "Dqi",
            "Tqi", "Qaqi", "Qiqi", "Sxqi", "Spqi", "Oqi", "Nqi", "Sxa", "Usx",
            "Dsx", "Tsx", "Qasx", "Qisx", "Sxsx", "Spsx", "Osx", "Nsx", "Spa",
            "Usp", "Dsp", "Tsp", "Qasp", "Qisp", "Sxsp", "Spsp", "Osp", "Nsp",
            "Og", "Uog", "Dog", "Tog", "Qaog", "Qiog", "Sxog", "Spog", "Oog",
            "Nog", "Na", "Un", "Dn", "Tn", "Qan", "Qin", "Sxn", "Spn", "On",
            "Nn", "Ct", "Uc"
        ];
        if (save.options.menu.standardNotation.enabled === 2 || (save.options.menu.standardNotation.enabled === 1 && base > suffices.length) || (save.options.menu.standardNotation.enabled === 4 && base > 31))
            suffix = `e${(base) * 3}`;
        else if (save.options.menu.standardNotation.enabled && base <= suffices.length)
            suffix = suffices[base - 1];
        else {
            let exponent = parseFloat(numberTmp).toExponential(2);
            exponent = exponent.replace("+", "");
            return exponent;
        }
    }
    return prettifySub(number) + suffix;
}

function prettifyCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/gu, ",");
}

function humanify(num, places) {
    return (Number(num)).toFixed(places).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/u, "$1");
}

function updateModContainer(divName, shield, staff, core) {
    let infoText = "Below is a list of the calulated costs, gains, and efficiency of each weighted upgrade, taken from the stats displayed on this heirloom.<br><br>";
    let heirloomToUse;
    if (divName.includes("shield")) {
        heirloomToUse = shield;
    } else if (divName.includes("staff")) {
        heirloomToUse = staff;
    } else {
        heirloomToUse = core;
    }

    if (!isEmpty(heirloomToUse) && !isEmpty(shield)) {
        for (let i = 0; i < 5; i++) {
            if (heirloomToUse.mods[i]) {
                if (heirloomToUse.mods[i][0] === "empty") document.getElementById(`${divName}Mod${i}`).textContent = "Empty";
                else document.getElementById(`${divName}Mod${i}`).textContent = `${parseFloat(heirloomToUse.mods[i][1].toPrecision(4)).toString()}% ${modNames[heirloomToUse.mods[i][0]]}`;
                document.getElementById(`${divName}ModContainer${i}`).style.opacity = 1;
                if (modsToWeigh.includes(heirloomToUse.mods[i][0])) {
                    if (heirloomToUse.type === "Core") {
                        infoText +=
                            `${fancyModNames[heirloomToUse.mods[i][0]]}:
                                <ul>
                                <li>Cost: ${prettifyCommas(getUpgCost(heirloomToUse.mods[i][0], heirloomToUse))}</li>
                                <li>Gain: ${humanify(getUpgGain(heirloomToUse.mods[i][0], heirloomToUse) * 100, 4)}%</li>
                                <li>Efficiency: ${humanify(getUpgEff(heirloomToUse.mods[i][0], shield, heirloomToUse), 4)}</li>
                            </ul>`;
                    } else {
                        infoText +=
                            `${fancyModNames[heirloomToUse.mods[i][0]]}:
                                <ul>
                                <li>Cost: ${prettifyCommas(getUpgCost(heirloomToUse.mods[i][0], heirloomToUse))}</li>
                                <li>Gain: ${humanify(getUpgGain(heirloomToUse.mods[i][0], heirloomToUse), 4)}</li>
                                <li>Efficiency: ${humanify(getUpgEff(heirloomToUse.mods[i][0], shield, heirloomToUse), 4)}</li>
                            </ul>`;
                    }
                }
            } else {
                document.getElementById(`${divName}Mod${i}`).textContent = "N/A";
                document.getElementById(`${divName}ModContainer${i}`).style.opacity = 0;
            }
        }
        const heirloomValue = getHeirloomCost(heirloomToUse);
        const baseValue = heirloomToUse.type === "Core" ? coreBasePrices[heirloomToUse.rarity] : basePrices[heirloomToUse.rarity];
        let infoValueText = "";
        for (const mod of heirloomToUse.mods) {
            const cost = getModCost(mod[0], heirloomToUse)
            if (mod[0] !== "empty" && cost > 0) infoValueText += `<li>${fancyModNames[mod[0]]}: +${prettifyCommas(cost)} (${humanify(cost / heirloomValue * 100, 2)}%)</li>`;
        }
        infoText +=
            `${heirloomToUse.type === "Core" ? "Spirestone" : "Nullifium"} Value:
            <ul>
                <li>Base: ${prettifyCommas(baseValue)} (${humanify(baseValue / heirloomValue * 100, 2)}%)</li>
                ${infoValueText}
                <li>Total: ${prettifyCommas(heirloomValue)}</li>
            </ul>`;
        if (divName.includes("core")) {
            loadCore(core);
            infoText += `<br>Your spire deals <span style="color: #fff59d">${prettify(Math.round(getMaxEnemyHP()))}</span> damage with this core, and averages <span style="color: #9fa8da">${prettify(Math.round(estimatedMaxDifficulty(getMaxEnemyHP()).runestones))}</span> runestones per enemy, while managing a threat of <span style="color: #ef9a9a">${Math.round(estimatedMaxDifficulty(getMaxEnemyHP()).difficulty)}</span>.`;
        }
        if (infoText.length === 149) {
            document.getElementById(`${divName}Info`).innerHTML = "This is where you would normally see additional information about this heirloom's mods, but this heirloom has no weighted mods.";
        } else {
            document.getElementById(`${divName}Info`).innerHTML = infoText;
        }
        document.getElementById(`${divName}?`).style.display = "block";

        if (save.options.menu.showHeirloomAnimations.enabled && heirloomToUse.rarity >= 7) {
            document.getElementById(`${divName}Container`).classList.value = `heirloomContainer heirloomRare${heirloomToUse.rarity}Anim`;
        } else {
            document.getElementById(`${divName}Container`).classList.value = `heirloomContainer heirloomRare${heirloomToUse.rarity}`;
        }

        if (divName.includes("Old")) document.getElementById(`${divName}Name`).textContent = `${heirloomToUse.name} (Old)`;
        else document.getElementById(`${divName}Name`).textContent = `${heirloomToUse.name} (New)`;
    } else {
        // if that heirloom is not equipped
        if (infoText.length === 149) {
            document.getElementById(`${divName}Info`).innerHTML = "This is where you would normally see additional information about this heirloom's mods, but you don't have one equipped.";
        } else {
            document.getElementById(`${divName}Info`).innerHTML = infoText;
        }
        document.getElementById(`${divName}?`).style.display = "block";
        document.getElementById(`${divName}Name`).textContent = "Nothing.";
    }
}

function addHeirloomToInventory(heirloom, num) {
    let iconName;
    if (heirloom.type === "Shield") iconName = "icomoon icon-shield3 tinyIcon";
    else if (heirloom.type === "Staff") iconName = "glyphicon glyphicon-grain tinyIcon";
    else if (heirloom.type === "Core") iconName = "glyphicon glyphicon-adjust tinyIcon";
    const totalDiv = `<div id="carriedHeirloom${num}" class="heirloomMod heirloomRare${heirloom.rarity}${save.options.menu.showHeirloomAnimations.enabled && heirloom.rarity >= 7 ? "Anim" : ""} inventoryHeirloom ${heirloom.type}" onclick="updateInput('preferred${heirloom.type}', '${heirloom.name}', ${num})">
                        <div class="heirloomIconContainer inventoryHeirloomIconContainer">
                            <span class="${iconName}"></span>
                        </div>
                        <div class="inventoryHeirloomName">${heirloom.name}</div>
                    </div>`;
    if (num < 7) document.getElementById("inventoryColumn1").innerHTML += totalDiv;
    else document.getElementById("inventoryColumn2").innerHTML += totalDiv;
}

function containsDuplicate(heirlooms, name) {
    let shieldCount = 0;
    let staffCount = 0;
    let coreCount = 0;
    for (const heirloom of heirlooms) {
        if (heirloom.name === name && heirloom.type === "Shield") {
            if (shieldCount > 0) return true;
            shieldCount++;
        }
        if (heirloom.name === name && heirloom.type === "Staff") {
            if (staffCount > 0) return true;
            staffCount++;
        }
        if (heirloom.name === name && heirloom.type === "Core") {
            if (coreCount > 0) return true;
            coreCount++;
        }
    }
    return false;
}

function getModCost(type, heirloom) {
    let cost = 0;
    if (type === "empty") return cost;
    for (const mod of heirloom.mods) {
        if (mod[0] === type) {
            console.log(mod[0])
            const stepAmount = stepAmounts[mod[0]][heirloom.rarity];
            const name = mod[0];
            const targetValue = mod[1];
            let currentValue = mod[1] - (mod[3] * stepAmount);
            let modCost = 0;
            while (currentValue < targetValue) {
                modCost += getUpgCost(name, { type: heirloom.type, mods: [[name, currentValue]], rarity: heirloom.rarity });
                currentValue += stepAmount;
            }
            cost += modCost;
        }
    }
    return cost;
}

function getHeirloomCost(heirloom) {
    let cost = 0;
    for (const mod of heirloom.mods) {
        if (mod[0] !== "empty") cost += getModCost(mod[0], heirloom);
    }
    if (heirloom.type === "Core") return cost + coreBasePrices[heirloom.rarity];
    return cost + basePrices[heirloom.rarity];
}

function calculate(manualInput) {
    if (JSON.parse(LZString.decompressFromBase64(document.getElementById("saveInput").value)) !== null) save = JSON.parse(LZString.decompressFromBase64(document.getElementById("saveInput").value));
    if (save === undefined) return;

    let nu = save.global.nullifium;
    let ss = save.playerSpire.main.spirestones;

    let startingShield = save.global.ShieldEquipped;
    let startingStaff = save.global.StaffEquipped;
    let startingCore = save.global.CoreEquipped;

    if (!manualInput) {
        inputs.setInput("E4", fluffyRewardsAvailable() >= fluffyRewards.critChance);
        inputs.setInput("E5", fluffyRewardsAvailable() >= fluffyRewards.megaCrit);
        inputs.setInput("CC", save.talents.crit.purchased);
        document.getElementById("inventoryColumn1").innerHTML = "";
        document.getElementById("inventoryColumn2").innerHTML = "";
        for (const i in save.global.heirloomsCarried) {
            addHeirloomToInventory(save.global.heirloomsCarried[i], i);
        }
        for (const input in inputs) {
            if (!textboxNames.includes(input)) continue;
            if (document.getElementById(`${input}Input`).value === "") {
                switch (input) {
                    case "portalZone":
                        inputs.setInput(input, save.global.highestLevelCleared + 1);
                        break;
                    case "voidZone":
                        inputs.setInput(input, save.stats.highestVoidMap.valueTotal);
                        break;
                }
            }
        }
    }

    for (const i in save.global.heirloomsCarried) {
        if (save.global.heirloomsCarried[i].name === inputs.preferredShield.name && save.global.heirloomsCarried[i].type === "Shield") {
            if (containsDuplicate(save.global.heirloomsCarried, save.global.heirloomsCarried[i].name)) {
                if (parseInt(i) === inputs.preferredShield.index) {
                    startingShield = save.global.heirloomsCarried[i];
                    document.getElementById(`carriedHeirloom${i}`).classList.add("selected");
                }
            } else {
                startingShield = save.global.heirloomsCarried[i];
                document.getElementById(`carriedHeirloom${i}`).classList.add("selected");
            }
        } else if (save.global.heirloomsCarried[i].name === inputs.preferredStaff.name && save.global.heirloomsCarried[i].type === "Staff") {
            if (containsDuplicate(save.global.heirloomsCarried, save.global.heirloomsCarried[i].name)) {
                if (parseInt(i) === inputs.preferredStaff.index) {
                    startingStaff = save.global.heirloomsCarried[i];
                    document.getElementById(`carriedHeirloom${i}`).classList.add("selected");
                }
            } else {
                startingStaff = save.global.heirloomsCarried[i];
                document.getElementById(`carriedHeirloom${i}`).classList.add("selected");
            }
        } else if (save.global.heirloomsCarried[i].name === inputs.preferredCore.name && save.global.heirloomsCarried[i].type === "Core") {
            if (containsDuplicate(save.global.heirloomsCarried, save.global.heirloomsCarried[i].name)) {
                if (parseInt(i) === inputs.preferredCore.index) {
                    startingCore = save.global.heirloomsCarried[i];
                    document.getElementById(`carriedHeirloom${i}`).classList.add("selected");
                }
            } else {
                startingCore = save.global.heirloomsCarried[i];
                document.getElementById(`carriedHeirloom${i}`).classList.add("selected");
            }
        }
    }

    // show cores by default if you know they exist
    // and init player spire stuff
    if (save.global.spiresCompleted >= 1) {
        inputs.setInput("coreUnlocked", true);
        startTDCalc();
        loadCore(startingCore);
    }

    const shieldAddAmounts = [0, 0, 0, 0, 0];
    const staffAddAmounts = [0, 0, 0, 0, 0];
    const coreAddAmounts = [0, 0, 0, 0, 0];

    const newShield = JSON.parse(JSON.stringify(startingShield));
    const newStaff = JSON.parse(JSON.stringify(startingStaff));
    const newCore = JSON.parse(JSON.stringify(startingCore));

    let cost = 0;
    let coreCost = 0;
    let name = "";
    let coreName = "";
    let modToUpgrade = [];

    if (!isEmpty(startingShield) && !isEmpty(startingStaff)) {
        while (true) {
            let eff = 0;
            for (const mod of newShield.mods) {
                if (getUpgEff(mod[0], newShield, newShield) > eff) {
                    eff = getUpgEff(mod[0], newShield, newShield);
                    cost = getUpgCost(mod[0], newShield);
                    name = mod[0];
                    modToUpgrade = mod;
                }
            }

            for (const mod of newStaff.mods) {
                if (getUpgEff(mod[0], newShield, newStaff) > eff) {
                    eff = getUpgEff(mod[0], newShield, newStaff);
                    cost = getUpgCost(mod[0], newStaff);
                    name = mod[0];
                    modToUpgrade = mod;
                }
            }

            if (modsToWeighShield.includes(name) && nu > cost) {
                newShield.mods[newShield.mods.indexOf(modToUpgrade)][1] += stepAmounts[newShield.mods[newShield.mods.indexOf(modToUpgrade)][0]][newShield.rarity];
                shieldAddAmounts[newShield.mods.indexOf(modToUpgrade)] += 1;
                nu -= cost;
            } else if (modsToWeighStaff.includes(name) && nu > cost) {
                newStaff.mods[newStaff.mods.indexOf(modToUpgrade)][1] += stepAmounts[newStaff.mods[newStaff.mods.indexOf(modToUpgrade)][0]][newStaff.rarity];
                staffAddAmounts[newStaff.mods.indexOf(modToUpgrade)] += 1;
                nu -= cost;
            } else {
                break;
            }
        }
    }

    if (!isEmpty(startingCore)) {
        while (true) {
            let eff = 0;
            for (const mod of newCore.mods) {
                if (getUpgEff(mod[0], false, newCore) > eff) {
                    eff = getUpgEff(mod[0], false, newCore);
                    coreCost = getUpgCost(mod[0], newCore);
                    coreName = mod[0];
                    modToUpgrade = mod;
                }
            }

            if (modsToWeighCore.includes(coreName) && ss > coreCost) {
                newCore.mods[newCore.mods.indexOf(modToUpgrade)][1] += stepAmounts[newCore.mods[newCore.mods.indexOf(modToUpgrade)][0]][newCore.rarity];
                coreAddAmounts[newCore.mods.indexOf(modToUpgrade)] += 1;
                ss -= coreCost;
            } else {
                break;
            }
        }
    }

    // current nu/ss, next goal nu price, next goal name
    document.getElementById("nextUpgradesContainer").innerHTML =
        `You have ${prettify(nu)} Nullifium${isEmpty(startingCore) ? "." : ` and ${prettify(ss)} Spirestones.`}
        <br>
        Your next upgrade${isEmpty(startingCore)
        ? ` should be ${fancyModNames[name]} at ${prettify(cost)} Nullifium.`
        : `s should be ${fancyModNames[name]} at ${prettify(cost)} Nullifium, and ${fancyModNames[coreName]} at ${prettify(coreCost)} Spirestones.`}`;

    // add upg amounts
    for (let i = 0; i < 5; i++) {
        if (shieldAddAmounts[i] === 0) {
            document.getElementById(`shieldNewMod${i}Plus`).textContent = "";
        } else {
            document.getElementById(`shieldNewMod${i}Plus`).textContent = `+${shieldAddAmounts[i]}`;
        }

        if (staffAddAmounts[i] === 0) {
            document.getElementById(`staffNewMod${i}Plus`).textContent = "";
        } else {
            document.getElementById(`staffNewMod${i}Plus`).textContent = `+${staffAddAmounts[i]}`;
        }

        if (coreAddAmounts[i] === 0) {
            document.getElementById(`coreNewMod${i}Plus`).textContent = "";
        } else {
            document.getElementById(`coreNewMod${i}Plus`).textContent = `+${coreAddAmounts[i]}`;
        }
    }

    updateModContainer("shieldOld", startingShield, startingStaff, startingCore);
    updateModContainer("shieldNew", newShield, newStaff, newCore);
    updateModContainer("staffOld", startingShield, startingStaff, startingCore);
    updateModContainer("staffNew", newShield, newStaff, newCore);
    updateModContainer("coreOld", startingShield, startingStaff, startingCore);
    updateModContainer("coreNew", newShield, newStaff, newCore);

    // animation
    document.getElementById("shieldNewContainer").style.animation = "moveDown 1s 1 cubic-bezier(0, 0, 0, 1)";
    document.getElementById("shieldNewContainer").style.opacity = 1;
    document.getElementById("staffNewContainer").style.animation = "moveDown 1s 1 cubic-bezier(0, 0, 0, 1)";
    document.getElementById("staffNewContainer").style.opacity = 1;
    if (isEmpty(startingCore)) {
        document.getElementById("coreOldContainer").style.display = "none";
        document.getElementById("coreNewContainer").style.display = "none";
    } else {
        document.getElementById("coreNewContainer").style.animation = "moveDown 1s 1 cubic-bezier(0, 0, 0, 1)";
        document.getElementById("coreOldContainer").style.display = "block";
        document.getElementById("coreNewContainer").style.display = "block";
    }
}