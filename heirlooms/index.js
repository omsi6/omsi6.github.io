/* eslint-disable multiline-comment-style */
// lots of stuff here copied from Trimps (https://trimps.github.io/), since it is a calculator for it afterall
// lots of the math and the idea behind this is based off of the heirloom spreadsheet (https://bit.ly/2OpQgBM) made by nsheetz from the Trimps discord
// code for spire td damage calcutations (tdcalc.js) from swaq/bhad (http://swaqvalley.com/td_calc/) with permission
// beta VM/XP calculations from ymhsbmbesitwf
// improved miner eff calculation from GhostFrog
// minor help from SpectralFlame, Razenpok, and GhostFrog
// I hope this tool is useful! :)

// patch notes: (maybe move these somewhere visible on the main page later, instead of just a link in the corner)

/*

v1.21 health mod weighting for u2, prismatic value fixes, and code restructuring
v1.20 full v5.00 heirloom system support, show inventory heirlooms on hover, equipped heirloom distinction, comprehensive reworking of upgeff/upggain displays/calculations, full support for empty/missing heirlooms, code cleanup
v1.19 plaguebringer on radiating heirlooms
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
const globalVersion = 1.21;
document.getElementById("versionNumber").textContent = globalVersion;

const checkboxNames = ["fluffyE4L10", "fluffyE5L10", "chargedCrits", "universe2", "scruffyE0L2", "scruffyE0L3", "Beta"];
const textboxNames = ["VMWeight", "XPWeight", "weaponLevels", "portalZone", "voidZone"];
const inputs = {
    VMWeight: 12,
    XPWeight: 11.25,
    weaponLevels: 90,
    portalZone: 1,
    voidZone: 1,
    version: globalVersion,
    fluffyE4L10: false,
    fluffyE5L10: false,
    chargedCrits: false,
    Beta: false,
    preferredShield: 0,
    preferredStaff: 0,
    preferredCore: 0,
    coreUnlocked: false,
    universe2Unlocked: false,
    universe2: false,
    scruffyE0L2: false,
    scruffyE0L3: false,
    setInput(name, value) {
        if (checkboxNames.includes(name)) document.getElementById(`${name}Input`).checked = value;
        else if (textboxNames.includes(name)) document.getElementById(`${name}Input`).value = value;

        // check here to avoid setting obsolete inputs
        if (this[name] !== undefined) this[name] = value;
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
                Your next upgrades should be ??? at ??? more Nullifium, ??? at ??? more Nullifium, and ??? at ??? Spirestones.`;
        } else if (input === "universe2Unlocked" && savedInputs[input]) {
            document.getElementById("universe2CheckboxesContainer").style.display = "flex";
            document.getElementById("heirloomInventory").style.height = "20.2rem";
            document.getElementById("heirloomInventory").style.paddingTop = "1.9rem";
        }
        inputs.setInput(input, savedInputs[input]);
    }
}

function updateVersion() {
    if (inputs.version < 1.20) {
        const savedInputs = JSON.parse(localStorage.getItem("heirloomsInputs"));
        inputs.preferredShield = 0;
        inputs.preferredStaff = 0;
        inputs.preferredCore = 0;
        inputs.fluffyE4L10 = savedInputs.E4;
        inputs.fluffyE5L10 = savedInputs.E5;
        inputs.chargedCrits = savedInputs.CC;
        inputs.version = 1.20;
    }
    if (inputs.version < 1.21) {
        inputs.version = 1.21;
    }
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
    } else if (name.includes("preferred")) {
        const cachedL = document.getElementById("inventoryColumn1").children.length + document.getElementById("inventoryColumn2").children.length;
        const type = name.split("preferred")[1];
        for (let i = 0; i < cachedL; i++) {
            if (document.getElementById(`carriedHeirloom${i}`).classList[3].includes(type)) document.getElementById(`carriedHeirloom${i}`).classList.remove("selected");
        }
        if (inputs[name] === value) {
            inputs[name] = 0;
        } else {
            inputs[name] = value;
            document.getElementById(`carriedHeirloom${position}`).classList.add("selected");
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

const mods = {
    breedSpeed: {
        name: "Breed Speed",
        fullName: "Breed Speed",
        type: "Shield",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 1, 3, 3, 3, 3, 3, 5],
        softCaps: [10, 10, 10, 20, 100, 130, 160, 190, 220, 280],
    },
    critChance: {
        name: "Crit Chance",
        fullName: "Crit Chance, additive",
        type: "Shield",
        weighable: () => true,
        stepAmounts: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.5, 0.5],
        softCaps: [2.6, 2.6, 2.6, 5, 7.4, 9.8, 12.2, 15.9, 30, 50],
        hardCaps: [30, 30, 30, 30, 30, 30, 30, 30, 100, 125],
        heirloopy: true
    },
    critDamage: {
        name: "Crit Damage",
        fullName: "Crit Damage, additive",
        type: "Shield",
        weighable: () => true,
        stepAmounts: [5, 5, 5, 5, 10, 10, 10, 10, 15, 20],
        softCaps: [60, 60, 60, 100, 200, 300, 400, 500, 650, 850],
    },
    plaguebringer: {
        name: "Plaguebringer",
        fullName: "Plaguebringer",
        type: "Shield",
        weighable: () => true,
        stepAmounts: [0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.5],
        softCaps: [0, 0, 0, 0, 0, 0, 0, 0, 15, 30],
        hardCaps: [0, 0, 0, 0, 0, 0, 0, 0, 75, 100],
        heirloopy: true
    }, 
    playerEfficiency: {
        name: "Player Efficiency",
        fullName: "Player Efficiency",
        type: "Shield",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 2, 4, 8, 16, 32, 64, 128],
        softCaps: [16, 16, 16, 32, 64, 128, 256, 512, 1024, 2048],
    },
    storageSize: {
        name: "Storage Size",
        fullName: "Storage Size",
        type: "Shield",
        weighable: () => false,
        stepAmounts: [4, 4, 4, 4, 8, 16, 16, 16, 16, 0],
        softCaps: [64, 64, 64, 128, 256, 512, 768, 1024, 1280, 0],
    },
    trainerEfficiency: {
        name: "Trainer Efficiency",
        fullName: "Trainer Efficiency",
        type: "Shield",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 2, 2, 2, 2, 2, 2, 0],
        softCaps: [20, 20, 20, 40, 60, 80, 100, 120, 140, 0],
    },
    trimpAttack: {
        name: "Trimp Attack",
        fullName: "Trimp Attack",
        type: "Shield",
        weighable: () => true,
        stepAmounts: [2, 2, 2, 2, 5, 5, 5, 6, 8, 10],
        softCaps: [20, 20, 20, 40, 100, 150, 200, 260, 356, 460],
    },
    trimpBlock: {
        name: "Trimp Block",
        fullName: "Trimp Block",
        type: "Shield",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        softCaps: [7, 7, 7, 10, 40, 60, 80, 100, 120, 0],
    },
    trimpHealth: {
        name: "Trimp Health",
        fullName: "Trimp Health",
        type: "Shield",
        weighable: () => inputs.universe2,
        stepAmounts: [2, 2, 2, 2, 5, 5, 5, 6, 8, 10],
        softCaps: [20, 20, 20, 40, 100, 150, 200, 260, 356, 460],
    },
    voidMaps: {
        name: "Void Map Drop Chance",
        fullName: "Void Map Drop Chance",
        type: "Shield",
        weighable: () => true,
        stepAmounts: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.25, 0.25],
        softCaps: [7, 7, 7, 11, 16, 22, 30, 38, 50, 60],
        hardCaps: [50, 50, 50, 50, 50, 50, 50, 50, 80, 99],
        heirloopy: true
    },
    prismatic: {
        name: "Prismatic Shield",
        fullName: "Prismatic Shield",
        type: "Shield",
        weighable: () => inputs.universe2,
        stepAmounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        softCaps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 50],
        hardCaps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 250],
        immutable: true,
    },
    gammaBurst: {
        name: "Gamma Burst",
        fullName: "Gamma Burst",
        type: "Shield",
        weighable: () => true,
        stepAmounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 100],
        softCaps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2000],
    },

    DragimpSpeed: {
        name: "Dragimp Efficiency",
        fullName: "Dragimp Efficiency",
        type: "Staff",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    ExplorerSpeed: {
        name: "Explorer Efficiency",
        fullName: "Explorer Efficiency",
        type: "Staff",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    FarmerSpeed: {
        name: "Farmer Efficiency",
        fullName: "Farmer Efficiency",
        type: "Staff",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    FluffyExp: {
        name: "Pet Exp",
        fullName: "Pet Exp",
        type: "Staff",
        weighable: () => true,
        stepAmounts: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        softCaps: [0, 0, 0, 0, 0, 0, 0, 0, 50, 100],
        heirloopy: true
    },
    LumberjackSpeed: {
        name: "Lumberjack Efficiency",
        fullName: "Lumberjack Efficiency",
        type: "Staff",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    MinerSpeed: {
        name: "Miner Efficiency",
        fullName: "Miner Efficiency",
        type: "Staff",
        weighable: () => true,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    ScientistSpeed: {
        name: "Scientist Efficiency",
        fullName: "Scientist Efficiency",
        type: "Staff",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    foodDrop: {
        name: "Food Drop Rate",
        fullName: "Food Drop Rate",
        type: "Staff",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    fragmentsDrop: {
        name: "Fragment Drop Rate",
        fullName: "Fragment Drop Rate",
        type: "Staff",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    gemsDrop: {
        name: "Gem Drop Rate",
        fullName: "Gem Drop Rate",
        type: "Staff",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    metalDrop: {
        name: "Metal Drop Rate",
        fullName: "Metal Drop Rate",
        type: "Staff",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    woodDrop: {
        name: "Wood Drop Rate",
        fullName: "Wood Drop Rate",
        type: "Staff",
        weighable: () => false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },

    fireTrap: {
        name: "Fire",
        fullName: "Fire Trap Damage",
        type: "Core",
        weighable: () => true,
        stepAmounts: [1, 1, 1, 1, 2, 3, 4],
        softCaps: [25, 25, 25, 50, 100, 199, 400],
        immutable: true,
    },
    poisonTrap: {
        name: "Poison",
        fullName: "Poison Trap Damage",
        type: "Core",
        weighable: () => true,
        stepAmounts: [1, 1, 1, 1, 2, 3, 4],
        softCaps: [25, 25, 25, 50, 100, 199, 400],
        immutable: true,
    },
    lightningTrap: {
        name: "Lightning",
        fullName: "Lightning Trap Damage",
        type: "Core",
        weighable: () => true,
        stepAmounts: [0, 0, 1, 1, 2, 2, 3],
        softCaps: [0, 0, 10, 20, 50, 100, 199],
        immutable: true,
    },
    strengthEffect: {
        name: "Strength",
        fullName: "Strength Tower Effect",
        type: "Core",
        weighable: () => true,
        stepAmounts: [1, 1, 1, 1, 2, 2, 3],
        softCaps: [10, 10, 10, 20, 50, 100, 199],
        immutable: true,
    },
    condenserEffect: {
        name: "Condenser",
        fullName: "Condenser Effect",
        type: "Core",
        weighable: () => true,
        stepAmounts: [0, 0.25, 0.25, 0.25, 0.5, 0.5, 0.5],
        softCaps: [0, 5, 5, 10, 15, 20, 30],
        hardCaps: [0, 10, 10, 15, 25, 35, 50],
        immutable: true,
    },
    runestones: {
        name: "Runestones",
        fullName: "Runestone Drop Rate",
        type: "Core",
        weighable: () => true,
        stepAmounts: [1, 1, 1, 1, 2, 3, 4],
        softCaps: [25, 25, 25, 50, 100, 199, 400],
        immutable: true,
    },

    empty: {
        name: "Empty",
        fullName: "Empty",
        weighable: () => false
    }
};

function getStepAmount(type, rarity) {
    if ((mods[type].heirloopy && inputs.scruffyE0L3) || mods[type].immutable) return mods[type].stepAmounts[rarity];
    if (inputs.universe2) return mods[type].stepAmounts[rarity] / 10;
    return mods[type].stepAmounts[rarity];
}

const rarityNames = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Magnificent", "Ethereal", "Magmatic", "Plagued", "Radiating"];
const basePrices = [5, 10, 15, 25, 75, 150, 400, 1000, 2500, 7500];
const coreBasePrices = [20, 200, 2000, 20000, 200000, 2000000, 20000000, 200000000, 2000000000, 20000000000];
const priceIncreases = [1.5, 1.5, 1.25, 1.19, 1.15, 1.12, 1.1, 1.06, 1.04, 1.03];

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
// trimps main.js : Scruffy
const scruffyRewards = { prism: 2, heirloopy: 3 };
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
// trimps main.js : fluffyLevel formula
function isUniverse2Unlocked() {
    const fluffyLevel = Math.floor(Math.log(((save.global.fluffyExp / (1000 * Math.pow(5, save.global.fluffyPrestige))) * 3) + 1) / Math.log(4));
    if (save.global.fluffyPrestige > 8 || (save.global.fluffyPrestige === 8 && fluffyLevel === 10)) return true;
    return false;
}

function fluffyRewardsAvailable() {
    const fluffyLevel = Math.floor(Math.log(((save.global.fluffyExp / (1000 * Math.pow(5, save.global.fluffyPrestige))) * 3) + 1) / Math.log(4));
    return (save.global.fluffyPrestige + (save.talents.fluffyAbility.purchased ? 1 : 0) + fluffyLevel);
}

function scruffyRewardsAvailable() {
    const scruffyLevel = Math.floor(Math.log(((save.global.fluffyExp2 / (1000 * Math.pow(5, save.global.fluffyPrestige2))) * 3) + 1) / Math.log(4));
    return (save.global.fluffyPrestige2 + (save.talents.fluffyAbility.purchased ? 1 : 0) + scruffyLevel);
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
            if ((mods[type].heirloopy && inputs.scruffyE0L3) || mods[type].immutable) return mod[1];
            if (inputs.universe2) return mod[1] / 10;
            return mod[1];
        }
    }
    return false;
}

function getDefaultUpgValue(type, heirloom) {
    for (const mod of heirloom.mods) {
        if (mod[0] === type) {
            return mod[1];
        }
    }
    return false;
}

function valueDisplay(type, value) {
    if (type === "empty") return "Empty";
    if ((mods[type].heirloopy && inputs.scruffyE0L3) || mods[type].immutable) return `${parseFloat(value.toPrecision(4))}% ${mods[type].fullName}`;
    return `${parseFloat(inputs.universe2 ? (value / 10).toPrecision(4) : value.toPrecision(4))}% ${mods[type].fullName}`;
}

function hasUpgradableMods(heirloom) {
    if (isEmpty(heirloom)) return false;
    for (const mod of heirloom.mods) {
        if (mods[mod[0]].weighable()) return true;
    }
    return false;
}

// add arrays for max normal values, if below or equal to, return normal price, else divide the amount over the normal value by the step to get amount and calculate the price with the amount
function getUpgCost(type, heirloom) {
    const rarity = heirloom.rarity;
    const value = getDefaultUpgValue(type, heirloom);
    let basePrice;
    if (heirloom.type === "Core") {
        basePrice = coreBasePrices[heirloom.rarity];
    } else {
        basePrice = basePrices[heirloom.rarity];
    }
    if (value <= mods[type].softCaps[rarity] || !isNumeric(value)) {
        return basePrice;
    }
    const amount = (value - mods[type].softCaps[rarity]) / mods[type].stepAmounts[rarity];
    if (mods[type].hardCaps) {
        return (value >= mods[type].hardCaps[rarity]) ? 1e20 : Math.floor(basePrice * Math.pow(priceIncreases[rarity], amount));
    }
    return Math.floor(basePrice * Math.pow(priceIncreases[rarity], amount));
}

function getUpgGain(type, heirloom) {
    const value = getUpgValue(type, heirloom);
    const stepAmount = getStepAmount(type, heirloom.rarity);
    if (type === "trimpAttack") {
        return (value + 100 + stepAmount) / (value + 100);
    }
    if (type === "trimpHealth") {
        return (value + 100 + stepAmount) / (value + 100);
    }
    if (type === "prismatic") {
        // 50 base, 50 from prismatic palace
        let shieldPercent = 100;
        shieldPercent += save.portal.Prismal.radLevel;
        if (inputs.scruffyE0L2) shieldPercent += 25;

        return (value + shieldPercent + 100 + stepAmount) / (value + shieldPercent + 100);
    }
    if (type === "critDamage") {
        const relentlessness = save.portal.Relentlessness.level;
        let critChance = relentlessness * 5;
        let megaCritMult = 5;
        let critDmgNormalizedBefore = 0;
        let critDmgNormalizedAfter = 0;
        if (isNumeric(getUpgValue("critChance", heirloom))) {
            if (inputs.chargedCrits) critChance += getUpgValue("critChance", heirloom) * 1.5;
            else critChance += getUpgValue("critChance", heirloom);
        }
        if (inputs.fluffyE4L10) {
            critChance += 50;
        }
        if (inputs.fluffyE5L10) {
            megaCritMult += 2;
        }
        if (inputs.chargedCrits) {
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
        if (inputs.chargedCrits) critChanceBefore += value * 1.5;
        else critChanceBefore += value;
        if (isNumeric(getUpgValue("critDamage", heirloom))) {
            critDamage += getUpgValue("critDamage", heirloom);
        }
        if (inputs.fluffyE4L10) {
            critChanceBefore += 50;
        }
        if (inputs.fluffyE5L10) {
            megaCritMult += 2;
        }
        if (inputs.chargedCrits) {
            megaCritMult += 1;
        }
        const megaCritsBefore = Math.min(Math.floor(critChanceBefore / 100), 2);
        const megaCritsAfter = Math.min(Math.floor((critChanceBefore + ((inputs.chargedCrits) ? stepAmount * 1.5 : stepAmount)) / 100), 2);
        critChanceAfter = Math.min((critChanceBefore + ((inputs.chargedCrits) ? stepAmount * 1.5 : stepAmount)) - megaCritsAfter * 100, 100) / 100;
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
        if (inputs.universe2) return (value + stepAmount * (inputs.VMWeight / 10)) / (value);
        return (value + stepAmount * inputs.VMWeight) / (value);
    }
    if (type === "gammaBurst") {
        return (((value + stepAmount) / 100 + 1) / 5) / ((value / 100 + 1) / 5);
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
    if (mods[type].type === "Core") {
        loadCore(heirloom);
        const before = getMaxEnemyHP();
        const beforeRS = estimatedMaxDifficulty(getMaxEnemyHP()).runestones;
        loadCore(heirloom, modNamesToTraps[type], value + stepAmount);
        const after = getMaxEnemyHP();
        const afterRS = estimatedMaxDifficulty(getMaxEnemyHP()).runestones;
        // 0.971 is the andrew constant, thanks andrew
        // also ghostfrog, pls pm me to tell me how I did this wrong again
        if (type === "runestones") return (afterRS / beforeRS) * 0.971;
        return after / before;
    }
    return false;
}

function getUpgEff(type, heirloom) {
    if (mods[type].weighable()) {
        if (heirloom.type === "Core") return ((getUpgGain(type, heirloom) - 1) / (getUpgCost(type, heirloom) / coreBasePrices[heirloom.rarity])) + 1;
        return ((getUpgGain(type, heirloom) - 1) / (getUpgCost(type, heirloom) / basePrices[heirloom.rarity])) + 1;
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

function updateModContainer(divName, heirloom) {
    let infoText = "Below is a list of the calulated costs, gains, and efficiency of each weighted upgrade, taken from the stats displayed on this heirloom.<br><br>";

    if (isEmpty(heirloom)) {
        // if that heirloom is not equipped
        document.getElementById(`${divName}Container`).classList.value = `heirloomContainer`;
        document.getElementById(`${divName}Info`).innerHTML = "This is where you would normally see additional information about this heirloom's mods, but you don't have one equipped.";
        document.getElementById(`${divName}?`).style.display = "block";
        document.getElementById(`${divName}Icon`).classList.value = "icomoon icon-sad3";
        document.getElementById(`${divName}Name`).textContent = "Nothing.";
        document.getElementById(`${divName}Equipped`).style.display = "none";
        document.getElementById(`${divName}Spent`).textContent = "";
        for (let i = 0; i < 6; i++) {
            document.getElementById(`${divName}ModContainer${i}`).style.opacity = 0;
        }
    } else {
        let bestEfficiency = 1;
        for (mod of heirloom.mods) {
            if (getUpgEff(mod[0], heirloom) > bestEfficiency) bestEfficiency = getUpgEff(mod[0], heirloom);
        }
        for (let i = 0; i < 6; i++) {
            const mod = heirloom.mods[i];
            if (mod) {
                document.getElementById(`${divName}Mod${i}`).textContent = `${valueDisplay(mod[0], mod[1])}`;
                document.getElementById(`${divName}ModContainer${i}`).style.opacity = 1;
                if (mods[mod[0]].weighable()) {
                    infoText +=
                        `${mods[mod[0]].name}:
                            <ul>
                            <li>Cost: ${getUpgCost(mod[0], heirloom) === 1e20 ? "∞" : prettifyCommas(getUpgCost(mod[0], heirloom))}</li>
                            <li>Gain: ${humanify((getUpgGain(mod[0], heirloom) - 1) * 100, 4)}%</li>
                            <li>Efficiency: ${humanify((getUpgEff(mod[0], heirloom) - 1) / (bestEfficiency - 1) * 100, 2)}%</li>
                        </ul>`;
                }
            } else {
                document.getElementById(`${divName}ModContainer${i}`).style.opacity = 0;
            }
        }
        const heirloomValue = getHeirloomSpent(heirloom);
        let infoValueText = "";
        for (const mod of heirloom.mods) {
            const cost = getModCost(mod[0], heirloom);
            if (mod[0] !== "empty" && cost > 0) infoValueText += `<li>${mods[mod[0]].name}: +${prettifyCommas(cost)} (${humanify(cost / heirloomValue * 100, 2)}%)</li>`;
        }
        infoText +=
            `${heirloom.type === "Core" ? "Spirestone" : "Nullifium"} Value:
            <ul>
                ${heirloom.replaceSpent ? `<li>Mod changes: ${prettifyCommas(heirloom.replaceSpent)} (${humanify(heirloom.replaceSpent / heirloomValue * 100, 2)}%)</li>` : ""}
                ${infoValueText}
                <li>Total: ${prettifyCommas(heirloomValue)}</li>
            </ul>`;
        if (divName.includes("core")) {
            loadCore(heirloom);
            infoText += `<br>Your spire deals <span style="color: #fff59d">${prettify(Math.round(getMaxEnemyHP()))}</span> damage with this core, and averages <span style="color: #9fa8da">${prettify(Math.round(estimatedMaxDifficulty(getMaxEnemyHP()).runestones))}</span> runestones per enemy, while managing a threat of <span style="color: #ef9a9a">${Math.round(estimatedMaxDifficulty(getMaxEnemyHP()).difficulty)}</span>.`;
        }
        if (infoText.length === 263) {
            document.getElementById(`${divName}Info`).innerHTML = "This is where you would normally see additional information about this heirloom's mods, but this heirloom has no weighted mods, and no Nullifium spent on it.";
        } else {
            document.getElementById(`${divName}Info`).innerHTML = infoText;
        }
        document.getElementById(`${divName}?`).style.display = "block";

        if (save.options.menu.showHeirloomAnimations.enabled && heirloom.rarity >= 7) {
            document.getElementById(`${divName}Container`).classList.value = `heirloomContainer heirloomRare${heirloom.rarity}Anim`;
        } else {
            document.getElementById(`${divName}Container`).classList.value = `heirloomContainer heirloomRare${heirloom.rarity}`;
        }

        let iconName;
        if (heirloom.type === "Shield") iconName = "icomoon icon-shield3";
        else if (heirloom.type === "Staff") iconName = "glyphicon glyphicon-grain";
        else if (heirloom.type === "Core") iconName = "glyphicon glyphicon-adjust";
        document.getElementById(`${divName}Icon`).classList.value = iconName;

        if (divName.includes("Old")) document.getElementById(`${divName}Name`).textContent = `${heirloom.name} (Old)`;
        else document.getElementById(`${divName}Name`).textContent = `${heirloom.name} (New)`;

        if (inputs[`preferred${heirloom.type}`] === 0) document.getElementById(`${divName}Equipped`).style.display = "flex";
        else document.getElementById(`${divName}Equipped`).style.display = "none";
        if (heirloom.type === "Core") document.getElementById(`${divName}Spent`).textContent = `${prettify(heirloomValue)} Ss Spent`;
        else document.getElementById(`${divName}Spent`).textContent = `${prettify(heirloomValue)} / ${prettify(getEffectiveNullifium())} Nu Spent`;
    }
}

function addHeirloomToInventory(heirloom, num) {
    let iconName;
    if (heirloom.type === "Shield") iconName = "icomoon icon-shield3 tinyIcon";
    else if (heirloom.type === "Staff") iconName = "glyphicon glyphicon-grain tinyIcon";
    else if (heirloom.type === "Core") iconName = "glyphicon glyphicon-adjust tinyIcon";
    const totalDiv = `<div id="carriedHeirloom${num}" class="heirloomMod heirloomRare${heirloom.rarity}${save.options.menu.showHeirloomAnimations.enabled && heirloom.rarity >= 7 ? "Anim" : ""} inventoryHeirloom ${heirloom.type}" onclick="updateInput('preferred${heirloom.type}', ${heirloom.repSeed}, ${num})" onmouseenter="createHeirloomPopup(${num})" onmousemove="moveHeirloomPopup(event)" onmouseleave="deleteHeirloomPopup()">
                        <div class="heirloomIconContainer inventoryHeirloomIconContainer">
                            <span class="${iconName}"></span>
                        </div>
                        <div class="inventoryHeirloomName">${heirloom.name}</div>
                    </div>`;
    if (num < 7) document.getElementById("inventoryColumn1").innerHTML += totalDiv;
    else document.getElementById("inventoryColumn2").innerHTML += totalDiv;
}

function createHeirloomPopup(num) {
    const heirloom = save.global.heirloomsCarried[num];
    let iconName;
    if (heirloom.type === "Shield") iconName = "icomoon icon-shield3";
    else if (heirloom.type === "Staff") iconName = "glyphicon glyphicon-grain";
    else if (heirloom.type === "Core") iconName = "glyphicon glyphicon-adjust";
    const heirloomValue = getHeirloomSpent(heirloom);
    let totalDiv =
        `<div class="heirloomContainerTopRow">
            <div class="heirloomIconContainer">
                <span class="${iconName}"></span>
            </div>
            <div>
                <span class="heirloomName" id="heirloomPopupName">${heirloom.name}</span>
            </div>
        </div>
        <div class="heirloomSpentContainer">
            <span class="heirloomSpent" id="heirloomPopupSpent">${prettify(heirloomValue)} ${heirloom.type === "Core" ? "Ss spent" : `/ ${prettify(getEffectiveNullifium())} Nu Spent`}</span>
        </div>`;
    for (const mod of heirloom.mods) {
        totalDiv +=
            `<div>
                • 
                <span class="heirloomMod">${valueDisplay(mod[0], mod[1])}</span>
            </div>`;
    }
    document.getElementById("heirloomPopup").classList.value = `heirloomRare${heirloom.rarity}${save.options.menu.showHeirloomAnimations.enabled && heirloom.rarity >= 7 ? "Anim" : ""}`;
    document.getElementById("heirloomPopup").style.display = "flex";
    document.getElementById("heirloomPopup").style.height = `${10 + heirloom.mods.length * 3.5}rem`;
    document.getElementById("heirloomPopup").innerHTML = totalDiv;
}

function moveHeirloomPopup(event) {
    document.getElementById("heirloomPopup").style.left = `${event.clientX}px`;
    document.getElementById("heirloomPopup").style.top = `${event.clientY}px`;
}

function deleteHeirloomPopup() {
    document.getElementById("heirloomPopup").style.display = "none";
    document.getElementById("heirloomPopup").innerHTML = "";
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
            const stepAmount = mods[mod[0]].stepAmounts[heirloom.rarity];
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

function getHeirloomSpent(heirloom) {
    if (isEmpty(heirloom)) return 0;
    let cost = 0;
    if (heirloom.replaceSpent) cost += heirloom.replaceSpent;
    for (const mod of heirloom.mods) {
        if (mod[0] !== "empty") cost += getModCost(mod[0], heirloom);
    }
    if (heirloom.type === "Core") return cost;
    return cost;
}

function getHeirloomNullifiumRatio() {
    if (save.talents.heirloom2.purchased) return 0.7;
    if (save.talents.heirloom.purchased) return 0.6;
    return 0.5;
}

function getEffectiveNullifium() {
    return Math.floor(save.global.nullifium * getHeirloomNullifiumRatio());
}

function calculate(manualInput) {
    if (JSON.parse(LZString.decompressFromBase64(document.getElementById("saveInput").value)) !== null) save = JSON.parse(LZString.decompressFromBase64(document.getElementById("saveInput").value));
    if (save === undefined) return;
    if (save.talents.heirloom === undefined) {
        alert("You're attempting to import a save from a Trimps version before 5.0.0. Save exports from versions before v5.0.0 are no longer supported.");
        return;
    }

    if (!manualInput) {
        inputs.setInput("fluffyE4L10", fluffyRewardsAvailable() >= fluffyRewards.critChance);
        inputs.setInput("fluffyE5L10", fluffyRewardsAvailable() >= fluffyRewards.megaCrit);
        inputs.setInput("chargedCrits", save.talents.crit.purchased);
        inputs.setInput("scruffyE0L2", scruffyRewardsAvailable() >= scruffyRewards.prism);
        inputs.setInput("scruffyE0L3", scruffyRewardsAvailable() >= scruffyRewards.heirloopy);
        inputs.setInput("universe2", save.global.universe === 2);
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

    let startingShield = save.global.ShieldEquipped;
    let startingStaff = save.global.StaffEquipped;
    let startingCore = save.global.CoreEquipped;

    for (const i in save.global.heirloomsCarried) {
        if (save.global.heirloomsCarried[i].repSeed === inputs.preferredShield) {
            startingShield = save.global.heirloomsCarried[i];
            document.getElementById(`carriedHeirloom${i}`).classList.add("selected");
        } else if (save.global.heirloomsCarried[i].repSeed === inputs.preferredStaff) {
            startingStaff = save.global.heirloomsCarried[i];
            document.getElementById(`carriedHeirloom${i}`).classList.add("selected");
        } else if (save.global.heirloomsCarried[i].repSeed === inputs.preferredCore) {
            startingCore = save.global.heirloomsCarried[i];
            document.getElementById(`carriedHeirloom${i}`).classList.add("selected");
        }
    }

    const newShield = JSON.parse(JSON.stringify(startingShield));
    const newStaff = JSON.parse(JSON.stringify(startingStaff));
    const newCore = JSON.parse(JSON.stringify(startingCore));

    let spirestones = save.playerSpire.main.spirestones;

    const shieldAddAmounts = [0, 0, 0, 0, 0, 0];
    const staffAddAmounts = [0, 0, 0, 0, 0, 0];
    const coreAddAmounts = [0, 0, 0, 0, 0, 0];

    let shieldEff = 0;
    let staffEff = 0;
    let coreEff = 0;
    let shieldCost = 0;
    let staffCost = 0;
    let coreCost = 0;
    let staffName = "";
    let shieldName = "";
    let coreName = "";
    let shieldModToUpgrade = [];
    let staffModToUpgrade = [];
    let coreModToUpgrade = [];

    // show cores by default if you know they exist
    // and init player spire stuff
    if (save.global.spiresCompleted >= 1) {
        inputs.setInput("coreUnlocked", true);
        startTDCalc();
        loadCore(startingCore);
    }

    if (isUniverse2Unlocked()) {
        inputs.setInput("universe2Unlocked", true);
        document.getElementById("universe2CheckboxesContainer").style.display = "flex";
        document.getElementById("heirloomInventory").style.height = "20.2rem";
        document.getElementById("heirloomInventory").style.paddingTop = "1.9rem";
    }

    if (!isEmpty(startingShield)) {
        let shieldNullifium = getEffectiveNullifium() - getHeirloomSpent(startingShield);
        while (true) {
            shieldEff = 0;
            for (const mod of newShield.mods) {
                if (getUpgEff(mod[0], newShield) > shieldEff) {
                    shieldEff = getUpgEff(mod[0], newShield);
                    shieldCost = getUpgCost(mod[0], newShield);
                    shieldName = mod[0];
                    shieldModToUpgrade = mod;
                }
            }

            if (mods[shieldName].weighable() && shieldNullifium >= shieldCost) {
                newShield.mods[newShield.mods.indexOf(shieldModToUpgrade)][1] += mods[newShield.mods[newShield.mods.indexOf(shieldModToUpgrade)][0]].stepAmounts[newShield.rarity];
                newShield.mods[newShield.mods.indexOf(shieldModToUpgrade)][3] += 1;
                shieldAddAmounts[newShield.mods.indexOf(shieldModToUpgrade)] += 1;
                shieldNullifium -= shieldCost;
            } else {
                break;
            }
        }
    }

    if (!isEmpty(startingStaff)) {
        let staffNullifium = getEffectiveNullifium() - getHeirloomSpent(startingStaff);
        while (true) {
            staffEff = 0;
            for (const mod of newStaff.mods) {
                if (getUpgEff(mod[0], newStaff) > staffEff) {
                    staffEff = getUpgEff(mod[0], newStaff);
                    staffCost = getUpgCost(mod[0], newStaff);
                    staffName = mod[0];
                    staffModToUpgrade = mod;
                }
            }

            if (mods[staffName].weighable() && staffNullifium >= staffCost) {
                newStaff.mods[newStaff.mods.indexOf(staffModToUpgrade)][1] += mods[newStaff.mods[newStaff.mods.indexOf(staffModToUpgrade)][0]].stepAmounts[newStaff.rarity];
                newStaff.mods[newStaff.mods.indexOf(staffModToUpgrade)][3] += 1;
                staffAddAmounts[newStaff.mods.indexOf(staffModToUpgrade)] += 1;
                staffNullifium -= staffCost;
            } else {
                break;
            }
        }
    }

    if (!isEmpty(startingCore)) {
        while (true) {
            coreEff = 0;
            for (const mod of newCore.mods) {
                if (getUpgEff(mod[0], newCore) > coreEff) {
                    coreEff = getUpgEff(mod[0], newCore);
                    coreCost = getUpgCost(mod[0], newCore);
                    coreName = mod[0];
                    coreModToUpgrade = mod;
                }
            }

            if (mods[coreName].weighable() && spirestones >= coreCost) {
                newCore.mods[newCore.mods.indexOf(coreModToUpgrade)][1] += mods[newCore.mods[newCore.mods.indexOf(coreModToUpgrade)][0]].stepAmounts[newCore.rarity];
                newCore.mods[newCore.mods.indexOf(coreModToUpgrade)][3] += 1;
                coreAddAmounts[newCore.mods.indexOf(coreModToUpgrade)] += 1;
                spirestones -= coreCost;
            } else {
                break;
            }
        }
    }

    
    // current nu/ss, next goal nu price, next goal name
    const shieldNextUpgradeCost = Math.ceil((shieldCost / getHeirloomNullifiumRatio()) - (save.global.nullifium - (getHeirloomSpent(newShield) / getHeirloomNullifiumRatio())));
    const staffNextUpgradeCost = Math.ceil((staffCost / getHeirloomNullifiumRatio()) - (save.global.nullifium - (getHeirloomSpent(newStaff) / getHeirloomNullifiumRatio())));
    if (hasUpgradableMods(startingShield) && hasUpgradableMods(startingStaff)) {
        document.getElementById("nextUpgradesContainer").innerHTML =
        `You have ${prettify(save.global.nullifium)} Nullifium${inputs.coreUnlocked ? "." : ` and ${prettify(spirestones)} Spirestones.`}
        <br>
        Your next upgrade${isEmpty(startingCore)
        ? `s should be ${mods[shieldName].name} at ${prettify(shieldNextUpgradeCost)} more Nullifium, and ${mods[staffName].name} at ${prettify(staffNextUpgradeCost)} more Nullifium.`
        : `s should be ${mods[shieldName].name} at ${prettify(shieldNextUpgradeCost)} more Nullifium, ${mods[staffName].name} at ${prettify(staffNextUpgradeCost)} more Nullifium, and ${mods[coreName].name} at ${prettify(coreCost)} Spirestones.`}`;
    } else if (hasUpgradableMods(startingShield)) {
        document.getElementById("nextUpgradesContainer").innerHTML =
        `You have ${prettify(save.global.nullifium)} Nullifium${inputs.coreUnlocked ? "." : ` and ${prettify(spirestones)} Spirestones.`}
        <br>
        Your next upgrade${isEmpty(startingCore)
        ? ` should be ${mods[shieldName].name} at ${prettify(shieldNextUpgradeCost)} more Nullifium.`
        : `s should be ${mods[shieldName].name} at ${prettify(shieldNextUpgradeCost)} more Nullifium, and ${mods[coreName].name} at ${prettify(coreCost)} Spirestones.`}`;
    } else if (hasUpgradableMods(startingStaff)) {
        document.getElementById("nextUpgradesContainer").innerHTML =
        `You have ${prettify(save.global.nullifium)} Nullifium${inputs.coreUnlocked ? "." : ` and ${prettify(spirestones)} Spirestones.`}
        <br>
        Your next upgrade${isEmpty(startingCore)
        ? ` should be ${mods[staffName].name} at ${prettify(staffNextUpgradeCost)} more Nullifium.`
        : `s should be ${mods[staffName].name} at ${prettify(staffNextUpgradeCost)} more Nullifium, and ${mods[coreName].name} at ${prettify(coreCost)} Spirestones.`}`;
    } else if (!hasUpgradableMods(startingShield) && !hasUpgradableMods(startingStaff)) {
        document.getElementById("nextUpgradesContainer").innerHTML =
        `You have ${prettify(save.global.nullifium)} Nullifium${inputs.coreUnlocked ? "." : ` and ${prettify(spirestones)} Spirestones.`}
        <br>
        ${isEmpty(startingCore)
        ? `You have no mods to upgrade.`
        : `Your next upgrade should be ${mods[coreName].name} at ${prettify(coreCost)} Spirestones.`}`;
    }

    // add upg amounts
    for (let i = 0; i < 6; i++) {
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

    updateModContainer("shieldOld", startingShield);
    updateModContainer("shieldNew", newShield);
    updateModContainer("staffOld", startingStaff);
    updateModContainer("staffNew", newStaff);
    updateModContainer("coreOld", startingCore);
    updateModContainer("coreNew", newCore);

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