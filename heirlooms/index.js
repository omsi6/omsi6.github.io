/* eslint-disable multiline-comment-style */
// lots of stuff here copied from Trimps (https://trimps.github.io/), since it is a calculator for it afterall
// lots of the math and the idea behind this is based off of the heirloom spreadsheet (https://bit.ly/2OpQgBM) made by nsheetz from the Trimps discord
// code for spire td damage calcutations (tdcalc.js) from swaq/bhad (http://swaqvalley.com/td_calc/) with permission
// beta VM/XP calculations from ymhsbmbesitwf (currently unused)
// improved miner eff calculation from GhostFrog
// minor help from SpectralFlame, Razenpok, and GhostFrog
// I hope this tool is useful! :)

// patch notes: (maybe move these somewhere visible on the main page later, instead of just a link in the corner)

/*

v1.34 fix edge case where equipped display wouldn't appear
v1.33 add daily crit bonus input, remove beta mode, unify handling of input defaults and displaying of them
v1.32 fix next mod upg cost display, fix upg affordability display on cores
v1.31 fix error with unweighable mods
v1.30 fix edge case for crit stat weighing
v1.29 support for forcing crit breakpoints, code cleanup
v1.28 support for breed speed, allow trimp health in u1, add hp weight input
v1.27 fix heirlooms with all unweighable mods erroring
v1.26 support for v5.1.0 heirloom icons, remaining nu displays, and mod affordability displays
v1.25 remove jquery, remove all needless code in tdcalc.js, general code cleanup
v1.24 fix and improve crit damage/chance weightings for u2, add better display conditions for checkboxes
v1.23 fix incorrect spirestone count visibility condition
v1.22 fix runestones mod weighting breaking
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
const globalVersion = 1.34;
document.getElementById("versionNumber").textContent = globalVersion;

const checkboxNames = ["fluffyE4L10", "fluffyE5L10", "chargedCrits", "universe2", "scruffyE0L2", "scruffyE0L3", "scruffyE0L7"];
const textboxNames = ["VMWeight", "XPWeight", "HPWeight", "weaponLevels", "dailyCrit"];
const inputs = {
    VMWeight: 12,
    XPWeight: 11.25,
    HPWeight: 0,
    weaponLevels: 90,
    dailyCrit: 0,
    version: globalVersion,
    fluffyE4L10: false,
    fluffyE5L10: false,
    chargedCrits: false,
    preferredShield: 0,
    preferredStaff: 0,
    preferredCore: 0,
    universe2: false,
    scruffyE0L2: false,
    scruffyE0L3: false,
    scruffyE0L7: false,
    masteriesUnlocked: false,
    coreUnlocked: false,
    universe2Unlocked: false,
    fluffyUnlocked: false,
    setInput(name, value) {
        if (checkboxNames.includes(name)) document.getElementById(`${name}Input`).checked = value;
        else if (textboxNames.includes(name)) document.getElementById(`${name}Input`).value = value;

        // check here to avoid setting obsolete inputs
        if (this[name] !== undefined) this[name] = value;
        localStorage.setItem("heirloomsInputs", JSON.stringify(inputs));
    }
};

let savedInputs;
if (localStorage.getItem("heirloomsInputs") !== null) {
    savedInputs = JSON.parse(localStorage.getItem("heirloomsInputs"));
    for (input in savedInputs) {
        if (input === "VMWeight" && savedInputs[input] === 12) continue;
        else if (input === "XPWeight" && savedInputs[input] === 11.25) continue;
        else if (input === "HPWeight" && savedInputs[input] === 0) continue;
        else if (input === "weaponLevels" && savedInputs[input] === 90) continue;
        else if (input === "dailyCrit" && savedInputs[input] === 0) continue;
        else if (input === "coreUnlocked" && savedInputs[input]) {
            document.getElementById("coreOldContainer").style.display = "block";
            document.getElementById("nextUpgradesContainer").innerHTML =
                `You have ??? Nullifium and ??? Spirestones.
                <br>
                Your next upgrades should be ??? at ??? more Nullifium, ??? at ??? more Nullifium, and ??? at ??? Spirestones.`;
        } else if (input === "universe2Unlocked" && savedInputs[input]) {
            document.getElementById("universe2CheckboxContainer").style.display = "flex";
            if (savedInputs.universe2 && document.getElementById("fluffyCheckboxesContainer").style.display !== "flex") document.getElementById("scruffyCheckboxesContainer").style.display = "flex";
        } else if (input === "fluffyUnlocked" && savedInputs[input]) {
            if (document.getElementById("scruffyCheckboxesContainer").style.display !== "flex") document.getElementById("fluffyCheckboxesContainer").style.display = "flex";
        } 
        inputs.setInput(input, savedInputs[input]);
    }
}

function updateVersion() {
    if (inputs.version < 1.20) {
        inputs.preferredShield = 0;
        inputs.preferredStaff = 0;
        inputs.preferredCore = 0;
        inputs.fluffyE4L10 = savedInputs.E4;
        inputs.fluffyE5L10 = savedInputs.E5;
        inputs.chargedCrits = savedInputs.CC;
        inputs.version = 1.20;
    }
    if (inputs.version < 1.25) {
        inputs.beta = savedInputs.Beta;
        inputs.version = 1.25;
    }
    if (inputs.version < 1.34) {
        inputs.version = 1.34;
    }
}

updateVersion();

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function updateInput(name, value, position) {
    const inputDiv = document.getElementById(`${name}Input`);
    if (checkboxNames.includes(name)) inputs[name] = inputDiv.checked;
    else if (name === "VMWeight" && inputDiv.value === "") {
        inputs[name] = 12;
    } else if (name === "XPWeight" && inputDiv.value === "") {
        inputs[name] = 11.25;
    } else if (name === "HPWeight" && inputDiv.value === "") {
        inputs[name] = 0;
    } else if (name === "weaponLevels" && inputDiv.value === "") {
        inputs[name] = 90;
    } else if (name === "dailyCrit" && inputDiv.value === "") {
        inputs[name] = 0;
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
    if (inputs.universe2) { 
        document.getElementById("scruffyCheckboxesContainer").style.display = "flex";
        document.getElementById("fluffyCheckboxesContainer").style.display = "none";
    } else if (inputs.fluffyUnlocked) {
        document.getElementById("scruffyCheckboxesContainer").style.display = "none";
        document.getElementById("fluffyCheckboxesContainer").style.display = "flex";
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
        get weighable() { return !inputs.universe2; },
        stepAmounts: [1, 1, 1, 1, 3, 3, 3, 3, 3, 5],
        softCaps: [10, 10, 10, 20, 100, 130, 160, 190, 220, 280],
    },
    critChance: {
        name: "Crit Chance",
        fullName: "Crit Chance, additive",
        type: "Shield",
        weighable: true,
        stepAmounts: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.5, 0.5],
        softCaps: [2.6, 2.6, 2.6, 5, 7.4, 9.8, 12.2, 15.9, 30, 50],
        hardCaps: [30, 30, 30, 30, 30, 30, 30, 30, 100, 125],
        heirloopy: true
    },
    critDamage: {
        name: "Crit Damage",
        fullName: "Crit Damage, additive",
        type: "Shield",
        weighable: true,
        stepAmounts: [5, 5, 5, 5, 10, 10, 10, 10, 15, 20],
        softCaps: [60, 60, 60, 100, 200, 300, 400, 500, 650, 850],
    },
    plaguebringer: {
        name: "Plaguebringer",
        fullName: "Plaguebringer",
        type: "Shield",
        weighable: true,
        stepAmounts: [0, 0, 0, 0, 0, 0, 0, 0, 0.5, 0.5],
        softCaps: [0, 0, 0, 0, 0, 0, 0, 0, 15, 30],
        hardCaps: [0, 0, 0, 0, 0, 0, 0, 0, 75, 100],
        heirloopy: true
    }, 
    playerEfficiency: {
        name: "Player Efficiency",
        fullName: "Player Efficiency",
        type: "Shield",
        weighable: false,
        stepAmounts: [1, 1, 1, 2, 4, 8, 16, 32, 64, 128],
        softCaps: [16, 16, 16, 32, 64, 128, 256, 512, 1024, 2048],
    },
    storageSize: {
        name: "Storage Size",
        fullName: "Storage Size",
        type: "Shield",
        weighable: false,
        stepAmounts: [4, 4, 4, 4, 8, 16, 16, 16, 16, 0],
        softCaps: [64, 64, 64, 128, 256, 512, 768, 1024, 1280, 0],
    },
    trainerEfficiency: {
        name: "Trainer Efficiency",
        fullName: "Trainer Efficiency",
        type: "Shield",
        weighable: false,
        stepAmounts: [1, 1, 1, 2, 2, 2, 2, 2, 2, 0],
        softCaps: [20, 20, 20, 40, 60, 80, 100, 120, 140, 0],
    },
    trimpAttack: {
        name: "Trimp Attack",
        fullName: "Trimp Attack",
        type: "Shield",
        weighable: true,
        stepAmounts: [2, 2, 2, 2, 5, 5, 5, 6, 8, 10],
        softCaps: [20, 20, 20, 40, 100, 150, 200, 260, 356, 460],
    },
    trimpBlock: {
        name: "Trimp Block",
        fullName: "Trimp Block",
        type: "Shield",
        weighable: false,
        stepAmounts: [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        softCaps: [7, 7, 7, 10, 40, 60, 80, 100, 120, 0],
    },
    trimpHealth: {
        name: "Trimp Health",
        fullName: "Trimp Health",
        type: "Shield",
        weighable: true,
        stepAmounts: [2, 2, 2, 2, 5, 5, 5, 6, 8, 10],
        softCaps: [20, 20, 20, 40, 100, 150, 200, 260, 356, 460],
    },
    voidMaps: {
        name: "Void Map Drop Chance",
        fullName: "Void Map Drop Chance",
        type: "Shield",
        weighable: true,
        stepAmounts: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.25, 0.25],
        softCaps: [7, 7, 7, 11, 16, 22, 30, 38, 50, 60],
        hardCaps: [50, 50, 50, 50, 50, 50, 50, 50, 80, 99],
        heirloopy: true
    },
    prismatic: {
        name: "Prismatic Shield",
        fullName: "Prismatic Shield",
        type: "Shield",
        get weighable() { return inputs.universe2; },
        stepAmounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        softCaps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 50],
        hardCaps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 250],
        immutable: true,
    },
    gammaBurst: {
        name: "Gamma Burst",
        fullName: "Gamma Burst",
        type: "Shield",
        weighable: true,
        stepAmounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 100],
        softCaps: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2000],
    },

    DragimpSpeed: {
        name: "Dragimp Efficiency",
        fullName: "Dragimp Efficiency",
        type: "Staff",
        weighable: false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    ExplorerSpeed: {
        name: "Explorer Efficiency",
        fullName: "Explorer Efficiency",
        type: "Staff",
        weighable: false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    FarmerSpeed: {
        name: "Farmer Efficiency",
        fullName: "Farmer Efficiency",
        type: "Staff",
        weighable: false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    FluffyExp: {
        name: "Pet Exp",
        fullName: "Pet Exp",
        type: "Staff",
        weighable: true,
        stepAmounts: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
        softCaps: [0, 0, 0, 0, 0, 0, 0, 0, 50, 100],
        heirloopy: true
    },
    LumberjackSpeed: {
        name: "Lumberjack Efficiency",
        fullName: "Lumberjack Efficiency",
        type: "Staff",
        weighable: false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    MinerSpeed: {
        name: "Miner Efficiency",
        fullName: "Miner Efficiency",
        type: "Staff",
        weighable: true,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    ScientistSpeed: {
        name: "Scientist Efficiency",
        fullName: "Scientist Efficiency",
        type: "Staff",
        weighable: false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    foodDrop: {
        name: "Food Drop Rate",
        fullName: "Food Drop Rate",
        type: "Staff",
        weighable: false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    fragmentsDrop: {
        name: "Fragment Drop Rate",
        fullName: "Fragment Drop Rate",
        type: "Staff",
        weighable: false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    gemsDrop: {
        name: "Gem Drop Rate",
        fullName: "Gem Drop Rate",
        type: "Staff",
        weighable: false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    metalDrop: {
        name: "Metal Drop Rate",
        fullName: "Metal Drop Rate",
        type: "Staff",
        weighable: false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },
    woodDrop: {
        name: "Wood Drop Rate",
        fullName: "Wood Drop Rate",
        type: "Staff",
        weighable: false,
        stepAmounts: [1, 1, 1, 1, 2, 4, 8, 16, 32, 64],
        softCaps: [6, 6, 6, 12, 40, 80, 160, 320, 640, 1280],
    },

    fireTrap: {
        name: "Fire",
        fullName: "Fire Trap Damage",
        type: "Core",
        weighable: true,
        stepAmounts: [1, 1, 1, 1, 2, 3, 4],
        softCaps: [25, 25, 25, 50, 100, 199, 400],
        immutable: true,
    },
    poisonTrap: {
        name: "Poison",
        fullName: "Poison Trap Damage",
        type: "Core",
        weighable: true,
        stepAmounts: [1, 1, 1, 1, 2, 3, 4],
        softCaps: [25, 25, 25, 50, 100, 199, 400],
        immutable: true,
    },
    lightningTrap: {
        name: "Lightning",
        fullName: "Lightning Trap Damage",
        type: "Core",
        weighable: true,
        stepAmounts: [0, 0, 1, 1, 2, 2, 3],
        softCaps: [0, 0, 10, 20, 50, 100, 199],
        immutable: true,
    },
    strengthEffect: {
        name: "Strength",
        fullName: "Strength Tower Effect",
        type: "Core",
        weighable: true,
        stepAmounts: [1, 1, 1, 1, 2, 2, 3],
        softCaps: [10, 10, 10, 20, 50, 100, 199],
        immutable: true,
    },
    condenserEffect: {
        name: "Condenser",
        fullName: "Condenser Effect",
        type: "Core",
        weighable: true,
        stepAmounts: [0, 0.25, 0.25, 0.25, 0.5, 0.5, 0.5],
        softCaps: [0, 5, 5, 10, 15, 20, 30],
        hardCaps: [0, 10, 10, 15, 25, 35, 50],
        immutable: true,
    },
    runestones: {
        name: "Runestones",
        fullName: "Runestone Drop Rate",
        type: "Core",
        weighable: true,
        stepAmounts: [1, 1, 1, 1, 2, 3, 4],
        softCaps: [25, 25, 25, 50, 100, 199, 400],
        immutable: true,
    },

    empty: {
        name: "Empty",
        fullName: "Empty",
        weighable: false,
    }
};

function getStepAmount(type, rarity) {
    if ((mods[type].heirloopy && inputs.scruffyE0L3) || mods[type].immutable) return mods[type].stepAmounts[rarity];
    if (inputs.universe2) return mods[type].stepAmounts[rarity] / 10;
    return mods[type].stepAmounts[rarity];
}

function getSoftCap(type, rarity) {
    if ((mods[type].heirloopy && inputs.scruffyE0L3) || mods[type].immutable) return mods[type].softCaps[rarity];
    if (inputs.universe2) return mods[type].softCaps[rarity] / 10;
    return mods[type].softCaps[rarity];
}

function getHardCap(type, rarity) {
    if ((mods[type].heirloopy && inputs.scruffyE0L3) || mods[type].immutable) return mods[type].hardCaps[rarity];
    if (inputs.universe2) return mods[type].hardCaps[rarity] / 10;
    return mods[type].hardCaps[rarity];
}

function normalizedCrit(critChance, critDamage, megaCrits, megaCritMult) {
    if (megaCrits === 0) {
        return critDamage * critChance + ((1 - critChance) * 100);
    }
    const lowCrit = 1 - critChance;
    return critDamage * Math.pow(megaCritMult, megaCrits - 1) * (lowCrit + critChance * megaCritMult);
}

const rarityNames = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Magnificent", "Ethereal", "Magmatic", "Plagued", "Radiating"];
const basePrices = [5, 10, 15, 25, 75, 150, 400, 1000, 2500, 7500];
const coreBasePrices = [20, 200, 2000, 20000, 200000, 2000000, 20000000, 200000000, 2000000000, 20000000000];
const priceIncreases = [1.5, 1.5, 1.25, 1.19, 1.15, 1.12, 1.1, 1.06, 1.04, 1.03];

class Heirloom {
    constructor(heirloom) {
        // preserve the info of the heirloom
        Object.assign(this, heirloom);
        // then add custom info we need
        if (!this.isEmpty()) {
            this.isCore = this.type === "Core";
            this.basePrice = this.isCore ? coreBasePrices[this.rarity] : basePrices[this.rarity];
            this.priceIncrease = priceIncreases[this.rarity];
            this.class = save.options.menu.showHeirloomAnimations.enabled && this.rarity >= 7
                ? `heirloomRare${this.rarity}Anim`
                : `heirloomRare${this.rarity}`;
            this.iconClass = (this.icon.includes("*")) ? `icomoon icon-${this.icon.split("*")[1]}` : `glyphicon glyphicon-${this.icon}`;
            this.stepAmounts = {};
            for (const mod of this.mods) {
                if (mod[0] === "empty") continue;
                this.stepAmounts[mod[0]] = getStepAmount(mod[0], this.rarity);
            }
            this.softCaps = {};
            for (const mod of this.mods) {
                if (mod[0] === "empty") continue;
                this.softCaps[mod[0]] = getSoftCap(mod[0], this.rarity);
            }
            this.hardCaps = {};
            for (const mod of this.mods) {
                if (mods[mod[0]].hardCaps !== undefined) this.hardCaps[mod[0]] = getHardCap(mod[0], this.rarity);
            }
        }
    }

    // custom methods for ease of use
    isEmpty() {
        if (this.type === undefined) return true;
        return false;
    }

    hasUpgradableMods() {
        if (this.isEmpty()) return false;
        for (const mod of this.mods) {
            if (mods[mod[0]].weighable) return true;
        }
        return false;
    }

    getModValue(type) {
        for (const mod of this.mods) {
            if (mod[0] === type) {
                if ((mods[type].heirloopy && inputs.scruffyE0L3) || mods[type].immutable) return mod[1];
                if (inputs.universe2) return mod[1] / 10;
                return mod[1];
            }
        }
        return 0;
    }

    getModDefaultValue(type) {
        for (const mod of this.mods) {
            if (mod[0] === type) {
                return mod[1];
            }
        }
        return 0;
    }

    getModGain(type) {
        const value = this.getModValue(type);
        const stepAmount = this.stepAmounts[type];
        if (this.hardCaps[type] && value === this.hardCaps[type]) return 1;
        if (type === "trimpAttack") {
            return (value + 100 + stepAmount) / (value + 100);
        }
        if (type === "trimpHealth") {
            return (value + 100 + stepAmount * inputs.HPWeight) / (value + 100);
        }
        if (type === "breedSpeed") {
            // magic number is log(1.01) / log(1 / 0.98)
            return 100 * Math.pow(value + stepAmount * inputs.HPWeight, 0.492524625) / (100 * Math.pow(value, 0.492524625));
        }
        if (type === "prismatic") {
            // 50 base, 50 from prismatic palace
            let shieldPercent = 100;
            shieldPercent += save.portal.Prismal.radLevel;
            if (inputs.scruffyE0L2) shieldPercent += 25;

            return (value + shieldPercent + 100 + stepAmount * inputs.HPWeight) / (value + shieldPercent + 100);
        }
        if (type === "critDamage") {
            const relentlessness = (inputs.universe2) ? 0 : save.portal.Relentlessness.level;
            const criticality = (inputs.universe2) ? save.portal.Criticality.radLevel : 0;
            let critChance = relentlessness * 5 + inputs.dailyCrit;
            let megaCritMult = 5;
            if (inputs.chargedCrits) critChance += this.getModValue("critChance") * 1.5;
            else critChance += this.getModValue("critChance");
            if ((inputs.fluffyE4L10 && !inputs.universe2) || (inputs.scruffyE0L7 && inputs.universe2)) critChance += 50;
            if (critChance === 0) return 1;
            if (inputs.fluffyE5L10 && !inputs.universe2) megaCritMult += 2;
            if (inputs.chargedCrits) megaCritMult += 1;
            const megaCrits = Math.floor(critChance / 100);
            critChance = Math.min(critChance - megaCrits * 100, 100) / 100;
            const critDamage = value + 230 * Math.min(relentlessness, 1) + 30 * Math.max(Math.min(relentlessness, 10) - 1, 0) + criticality * 10;
            const critDmgNormalizedBefore = normalizedCrit(critChance, critDamage, megaCrits, megaCritMult);
            const critDmgNormalizedAfter = normalizedCrit(critChance, critDamage + stepAmount, megaCrits, megaCritMult);

            return critDmgNormalizedAfter / critDmgNormalizedBefore;
        }
        if (type === "critChance") {
            const relentlessness = (inputs.universe2) ? 0 : save.portal.Relentlessness.level;
            const criticality = (inputs.universe2) ? save.portal.Criticality.radLevel : 0;
            let critChanceBefore = relentlessness * 5 + inputs.dailyCrit;
            let critChanceAfter = relentlessness * 5 + inputs.dailyCrit;
            let critDamage = 230 * Math.min(relentlessness, 1) + 30 * Math.max(Math.min(relentlessness, 10) - 1, 0) + criticality * 10;
            let megaCritMult = 5;
            if (inputs.chargedCrits) critChanceBefore += value * 1.5;
            else critChanceBefore += value;
            if (inputs.chargedCrits) critChanceAfter += value * 1.5;
            else critChanceAfter += value;
            if (isNumeric(this.getModValue("critDamage"))) {
                critDamage += this.getModValue("critDamage");
            }
            if (critDamage === 0) return 1;
            if ((inputs.fluffyE4L10 && !inputs.universe2) || (inputs.scruffyE0L7 && inputs.universe2)) {
                critChanceBefore += 50;
            }
            if (inputs.fluffyE5L10 && !inputs.universe2) {
                megaCritMult += 2;
            }
            if (inputs.chargedCrits) {
                megaCritMult += 1;
            }
            const megaCritsBefore = Math.floor(critChanceBefore / 100);
            const megaCritsAfter = Math.floor((critChanceBefore + ((inputs.chargedCrits) ? stepAmount * 1.5 : stepAmount)) / 100);
            critChanceAfter = Math.min((critChanceBefore + ((inputs.chargedCrits) ? stepAmount * 1.5 : stepAmount)) - megaCritsAfter * 100, 100) / 100;
            critChanceBefore = Math.min(critChanceBefore - megaCritsBefore * 100, 100) / 100;
            const critDmgNormalizedBefore = normalizedCrit(critChanceBefore, critDamage, megaCritsBefore, megaCritMult);
            const critDmgNormalizedAfter = normalizedCrit(critChanceAfter, critDamage, megaCritsAfter, megaCritMult);

            return critDmgNormalizedAfter / critDmgNormalizedBefore;
        }
        if (type === "voidMaps") {
            if (inputs.universe2) return (value + stepAmount * (inputs.VMWeight / 10)) / (value);
            return (value + stepAmount * inputs.VMWeight) / (value);
        }
        if (type === "gammaBurst") {
            return (((value + stepAmount) / 100 + 1) / 5) / ((value / 100 + 1) / 5);
        }
        if (type === "FluffyExp") {
            return (value + 100 + stepAmount * inputs.XPWeight) / (value + 100);
        }
        if (type === "plaguebringer") {
            return (value + 100 + stepAmount) / (value + 100);
        }
        if (type === "MinerSpeed") {
            return (Math.log((value + 100 + stepAmount) / (value + 100) * (Math.pow(1.2, inputs.weaponLevels) - 1) + 1) / Math.log(1.2)) / inputs.weaponLevels;
        }
        if (this.isCore) {
            loadCore(this);
            const before = getMaxEnemyHP();
            const beforeRS = estimatedMaxDifficulty(getMaxEnemyHP()).runestones;
            loadCore(this, modNamesToTraps[type], value + stepAmount);
            const after = getMaxEnemyHP();
            const afterRS = estimatedMaxDifficulty(getMaxEnemyHP()).runestones;
            // 0.971 is the andrew constant, thanks andrew
            // also ghostfrog, pls pm me to tell me how I did this wrong again
            if (type === "runestones") return (afterRS / beforeRS - 1) * 0.971 + 1;
            return after / before;
        }
        return 0;
    }

    getModEfficiency(type) {
        if (mods[type].weighable) {
            return ((this.getModGain(type) - 1) / (this.getModCost(type) / this.basePrice)) + 1;
        }
        return 0;
    }

    // add arrays for max normal values, if below or equal to, return normal price, else divide the amount over the normal value by the step to get amount and calculate the price with the amount
    getModCost(type) {
        if (type === "empty") {
            return 1e20;
        }
        const value = this.getModValue(type);
        if (value <= this.softCaps[type] || !isNumeric(value)) {
            return this.basePrice;
        }
        const amount = (value - this.softCaps[type]) / this.stepAmounts[type];
        if (this.hardCaps) {
            return (value >= this.hardCaps[type]) ? 1e20 : Math.floor(this.basePrice * Math.pow(this.priceIncrease, amount));
        }
        return Math.floor(this.basePrice * Math.pow(this.priceIncrease, amount));
    }

    getModSpent(type) {
        let cost = 0;
        if (type === "empty") return cost;
        const dummyHeirloom = new Heirloom(JSON.parse(JSON.stringify(this)));
        for (const mod of dummyHeirloom.mods) {
            if (mod[0] === type) {
                const stepAmount = mods[type].stepAmounts[this.rarity];
                const name = type;
                const targetValue = mod[1];
                mod[1] -= (mod[3] * stepAmount);
                while (mod[1] < targetValue) {
                    cost += dummyHeirloom.getModCost(name);
                    mod[1] += stepAmount;
                }
            }
        }
        return cost;
    }

    getTotalSpent() {
        if (this.isEmpty()) return 0;
        let cost = 0;
        if (this.replaceSpent) cost += this.replaceSpent;
        for (const mod of this.mods) {
            if (mod[0] !== "empty") cost += this.getModSpent(mod[0]);
        }
        if (this.isCore) return cost;
        return cost;
    }

    getDamageMult() {
        const trimpAttackMult = 1 + this.getModValue("trimpAttack") / 100;
        const relentlessness = (inputs.universe2) ? 0 : save.portal.Relentlessness.level;
        const criticality = (inputs.universe2) ? save.portal.Criticality.radLevel : 0;
        let critChance = relentlessness * 5 + inputs.dailyCrit;
        let megaCritMult = 5;
        if (inputs.chargedCrits) critChance += this.getModValue("critChance") * 1.5;
        else critChance += this.getModValue("critChance");
        if ((inputs.fluffyE4L10 && !inputs.universe2) || (inputs.scruffyE0L7 && inputs.universe2)) critChance += 50;
        if (inputs.fluffyE5L10 && !inputs.universe2) megaCritMult += 2;
        if (inputs.chargedCrits) megaCritMult += 1;
        const megaCrits = Math.floor(critChance / 100);
        critChance = Math.min(critChance - megaCrits * 100, 100) / 100;
        const critDamage = this.getModValue("critDamage") + 230 * Math.min(relentlessness, 1) + 30 * Math.max(Math.min(relentlessness, 10) - 1, 0) + criticality * 10;
        const critDmgNormalized = normalizedCrit(critChance, critDamage, megaCrits, megaCritMult);

        return trimpAttackMult * critDmgNormalized / 100;
    }

    forceCritBreakpoint() {
        if (this.isEmpty()) return new Heirloom();
        const heirloom = new Heirloom(JSON.parse(JSON.stringify(this)));
        let currency = getEffectiveNullifium() - this.getTotalSpent();
        let efficiency = 0;
        let paid = 0;
        let cost = 0;
        let name = "";
        let index = -1;
        const purchases = [0, 0, 0, 0, 0, 0];
        const relentlessness = (inputs.universe2) ? 0 : save.portal.Relentlessness.level;
        let critChance = relentlessness * 5 + inputs.dailyCrit;
        if ((inputs.fluffyE4L10 && !inputs.universe2) || (inputs.scruffyE0L7 && inputs.universe2)) critChance += 50;
        const megaCrits = Math.floor((critChance + (inputs.chargedCrits) ? heirloom.getModValue("critChance") * 1.5 : heirloom.getModValue("critChance")) / 100);

        while (true) {
            while (Math.floor((critChance + (inputs.chargedCrits) ? heirloom.getModValue("critChance") * 1.5 : heirloom.getModValue("critChance")) / 100) === megaCrits) {
                cost = heirloom.getModCost("critChance");
                index = heirloom.mods.indexOf(heirloom.mods.filter(mod => mod[0] === "critChance")[0]);
                if (currency >= cost) {
                    heirloom.mods[index][1] += mods.critChance.stepAmounts[heirloom.rarity];
                    heirloom.mods[index][3] += 1;
                    purchases[index] += 1;
                    currency -= cost;
                    paid += cost;
                } else {
                    break;
                }
            }

            efficiency = 0;
            for (const mod of heirloom.mods) {
                if (heirloom.getModEfficiency(mod[0]) > efficiency) {
                    efficiency = heirloom.getModEfficiency(mod[0]);
                    cost = heirloom.getModCost(mod[0]);
                    name = mod[0];
                    index = heirloom.mods.indexOf(mod);
                }
            }

            if (name === "") break;
            if (mods[name].weighable && currency >= cost) {
                heirloom.mods[index][1] += mods[name].stepAmounts[heirloom.rarity];
                heirloom.mods[index][3] += 1;
                purchases[index] += 1;
                currency -= cost;
                paid += cost;
            } else {
                break;
            }
        }

        const nextCost = Math.floor((cost - (getEffectiveNullifium() - heirloom.getTotalSpent())) / getHeirloomNullifiumRatio());
        heirloom.paid = paid;
        heirloom.next = { name, cost: nextCost };
        heirloom.purchases = purchases;
        heirloom.successful = Math.floor((critChance + (inputs.chargedCrits) ? heirloom.getModValue("critChance") * 1.5 : heirloom.getModValue("critChance")) / 100) > megaCrits;
        return heirloom;
    }

    calculatePurchases() {
        if (this.isEmpty()) return new Heirloom();
        const heirloom = new Heirloom(JSON.parse(JSON.stringify(this)));
        let currency = (this.isCore) ? save.playerSpire.main.spirestones : getEffectiveNullifium() - this.getTotalSpent();
        let efficiency = 0;
        let paid = 0;
        let cost = 0;
        let name = "";
        let index = -1;
        const purchases = [0, 0, 0, 0, 0, 0];

        while (true) {
            efficiency = 0;
            for (const mod of heirloom.mods) {
                if (heirloom.getModEfficiency(mod[0]) > efficiency) {
                    efficiency = heirloom.getModEfficiency(mod[0]);
                    cost = heirloom.getModCost(mod[0]);
                    name = mod[0];
                    index = heirloom.mods.indexOf(mod);
                }
            }

            if (name === "") break;
            if (mods[name].weighable && currency >= cost) {
                heirloom.mods[index][1] += mods[name].stepAmounts[heirloom.rarity];
                heirloom.mods[index][3] += 1;
                purchases[index] += 1;
                currency -= cost;
                paid += cost;
            } else {
                break;
            }
        }

        if (heirloom.type === "Shield") {
            const forcedCritHeirloom = this.forceCritBreakpoint();
            if (forcedCritHeirloom.getDamageMult() > heirloom.getDamageMult() && forcedCritHeirloom.successful) return forcedCritHeirloom;
        }

        const nextCost = (heirloom.isCore)
            ? Math.floor(cost - currency)
            : Math.floor((cost - (getEffectiveNullifium() - heirloom.getTotalSpent())) / getHeirloomNullifiumRatio());
        heirloom.paid = paid;
        heirloom.next = { name, cost: nextCost };
        heirloom.purchases = purchases;
        return heirloom;
    }
}

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
const scruffyRewards = { prism: 2, heirloopy: 3, critChance: 7 };
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

function valueDisplay(type, value) {
    if (type === "empty") return "Empty";
    if ((mods[type].heirloopy && inputs.scruffyE0L3) || mods[type].immutable) return `${parseFloat(value.toPrecision(4))}% ${mods[type].fullName}`;
    return `${parseFloat(inputs.universe2 ? (value / 10).toPrecision(4) : value.toPrecision(4))}% ${mods[type].fullName}`;
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

    const notation = save.options.menu.standardNotation.enabled;

    let base = Math.floor(Math.log(number) / Math.log(1000));
    if (base <= 0) return prettifySub(number);

    if (notation === 5) {
        // thanks ZXV
        const logBase = save.options.menu.standardNotation.logBase;
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
    if (notation === 3) {
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
        if (notation === 2 || (notation === 1 && base > suffices.length) || (notation === 4 && base > 31))
            suffix = `e${(base) * 3}`;
        else if (notation && base <= suffices.length)
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

function updateModContainer(divName, heirloom, spirestones) {
    let infoText = "Below is a list of the calulated costs, gains, and efficiency of each weighted upgrade, taken from the stats displayed on this heirloom.<br><br>";

    if (heirloom.isEmpty()) {
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
            if (heirloom.getModEfficiency(mod[0]) > bestEfficiency) bestEfficiency = heirloom.getModEfficiency(mod[0]);
        }

        const heirloomToSpend = heirloom.isCore ? spirestones : getEffectiveNullifium() - heirloom.getTotalSpent();
        for (let i = 0; i < 6; i++) {
            const mod = heirloom.mods[i];
            if (mod) {
                document.getElementById(`${divName}Mod${i}`).textContent = `${valueDisplay(mod[0], mod[1])}`;
                document.getElementById(`${divName}ModContainer${i}`).style.opacity = 1;
                if (heirloom.getModCost(mod[0]) <= heirloomToSpend) document.getElementById(`${divName}Mod${i}Notification`).textContent = "!";
                else document.getElementById(`${divName}Mod${i}Notification`).textContent = "•";
                if (mods[mod[0]].weighable) {
                    infoText +=
                        `${mods[mod[0]].name}:
                            <ul>
                            <li>Cost: ${heirloom.getModCost(mod[0]) === 1e20 ? "∞" : prettifyCommas(heirloom.getModCost(mod[0]))}</li>
                            <li>Gain: ${humanify((heirloom.getModGain(mod[0]) - 1) * 100, 4)}%</li>
                            <li>Efficiency: ${humanify((heirloom.getModEfficiency(mod[0]) - 1) / (bestEfficiency - 1) * 100, 2)}%</li>
                        </ul>`;
                }
            } else {
                document.getElementById(`${divName}ModContainer${i}`).style.opacity = 0;
            }
        }
        const heirloomValue = heirloom.getTotalSpent();
        let infoValueText = "";
        for (const mod of heirloom.mods) {
            const cost = heirloom.getModSpent(mod[0]);
            if (mod[0] !== "empty" && cost > 0) infoValueText += `<li>${mods[mod[0]].name}: +${prettifyCommas(cost)} (${humanify(cost / heirloomValue * 100, 2)}%)</li>`;
        }
        infoText +=
            `${heirloom.isCore ? "Spirestone" : "Nullifium"} Value:
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
        document.getElementById(`${divName}Container`).classList.value = `heirloomContainer ${heirloom.class}`;

        if (divName.includes("Old")) document.getElementById(`${divName}Name`).textContent = `${heirloom.name} (Old)`;
        else document.getElementById(`${divName}Name`).textContent = `${heirloom.name} (New)`;

        if (!save.global.heirloomsCarried.filter(loom => loom.repSeed === inputs[`preferred${heirloom.type}`]).length > 0) document.getElementById(`${divName}Equipped`).style.display = "flex";
        else document.getElementById(`${divName}Equipped`).style.display = "none";
        if (heirloom.isCore) document.getElementById(`${divName}Spent`).textContent = `${prettify(heirloomValue)} Ss Spent`;
        else document.getElementById(`${divName}Spent`).textContent = `${prettify(heirloomValue)} / ${prettify(getEffectiveNullifium())} Nu Spent - ${prettify(getEffectiveNullifium() - heirloomValue)} Unspent`;

        if (heirloom.purchases) {
            for (let i = 0; i < 6; i++) {
                document.getElementById(`${divName}Mod${i}Plus`).textContent = (heirloom.purchases[i] === 0) ? "" : `+${heirloom.purchases[i]}`;
            }
        }

        document.getElementById(`${divName}Icon`).classList.value = heirloom.iconClass;
    }
}

function addHeirloomToInventory(heirloom, num) {
    const totalDiv = `<div id="carriedHeirloom${num}" class="heirloomMod ${heirloom.class} inventoryHeirloom ${heirloom.type}" onclick="updateInput('preferred${heirloom.type}', ${heirloom.repSeed}, ${num})" onmouseenter="createHeirloomPopup(${num})" onmousemove="moveHeirloomPopup(event)" onmouseleave="deleteHeirloomPopup()">
                        <div class="heirloomIconContainer inventoryHeirloomIconContainer">
                            <span class="${heirloom.iconClass} tinyIcon"></span>
                        </div>
                        <div class="inventoryHeirloomName">${heirloom.name}</div>
                    </div>`;
    if (num < 7) document.getElementById("inventoryColumn1").innerHTML += totalDiv;
    else document.getElementById("inventoryColumn2").innerHTML += totalDiv;
}

function createHeirloomPopup(num) {
    const heirloom = save.global.heirloomsCarried[num];
    const heirloomValue = heirloom.getTotalSpent();
    const heirloomToSpend = heirloom.isCore ? save.playerSpire.main.spirestones : getEffectiveNullifium() - heirloom.getTotalSpent();
    let totalDiv =
        `<div class="heirloomContainerTopRow">
            <div class="heirloomIconContainer">
                <span class="${heirloom.iconClass}"></span>
            </div>
            <div>
                <span class="heirloomName" id="heirloomPopupName">${heirloom.name}</span>
            </div>
        </div>
        <div class="heirloomSpentContainer">
            <span class="heirloomSpent" id="heirloomPopupSpent">${prettify(heirloomValue)} ${heirloom.isCore ? "Ss spent" : `/ ${prettify(getEffectiveNullifium())} Nu Spent`}</span>
        </div>`;
    for (const mod of heirloom.mods) {
        totalDiv +=
            `<div>
                ${heirloom.getModCost(mod[0]) <= heirloomToSpend ? "!" : "•"}
                <span class="heirloomMod">${valueDisplay(mod[0], mod[1])}</span>
            </div>`;
    }
    document.getElementById("heirloomPopup").classList.value = heirloom.class;
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
    // for even older saves
    if (save.global.stringVersion === undefined) {

        return;
    }
    // version checking the save
    const saveVersion = save.global.stringVersion.split(".");
    if (parseInt(saveVersion[0], 10) < 5 || (parseInt(saveVersion[0], 10) === 5 && parseInt(saveVersion[1], 10) < 1)) {
        alert("You're attempting to import a save from a Trimps version before 5.1.0. Save exports from versions before v5.1.0 are no longer supported.");
        return;
    }

    for (const i in save.global.heirloomsCarried) {
        save.global.heirloomsCarried[i] = new Heirloom(save.global.heirloomsCarried[i]);
    }

    if (!manualInput) {
        inputs.setInput("fluffyE4L10", fluffyRewardsAvailable() >= fluffyRewards.critChance);
        inputs.setInput("fluffyE5L10", fluffyRewardsAvailable() >= fluffyRewards.megaCrit);
        inputs.setInput("scruffyE0L2", scruffyRewardsAvailable() >= scruffyRewards.prism);
        inputs.setInput("scruffyE0L3", scruffyRewardsAvailable() >= scruffyRewards.heirloopy);
        inputs.setInput("scruffyE0L7", scruffyRewardsAvailable() >= scruffyRewards.critChance);
        inputs.setInput("chargedCrits", save.talents.crit.purchased);
        inputs.setInput("universe2", save.global.universe === 2);
        if (inputs.universe2) {
            document.getElementById("scruffyCheckboxesContainer").style.display = "flex";
            document.getElementById("fluffyCheckboxesContainer").style.display = "none";

        } else if (inputs.fluffyUnlocked) {
            document.getElementById("fluffyCheckboxesContainer").style.display = "flex";
            document.getElementById("scruffyCheckboxesContainer").style.display = "none";
        }
        document.getElementById("inventoryColumn1").innerHTML = "";
        document.getElementById("inventoryColumn2").innerHTML = "";
        for (const i in save.global.heirloomsCarried) {
            save.global.heirloomsCarried[i] = new Heirloom(save.global.heirloomsCarried[i]);
            addHeirloomToInventory(save.global.heirloomsCarried[i], i);
        }
    }

    const nullifium = save.global.nullifium;
    let spirestones = save.playerSpire.main.spirestones;

    save.global.ShieldEquipped = new Heirloom(save.global.ShieldEquipped);
    save.global.StaffEquipped = new Heirloom(save.global.StaffEquipped);
    save.global.CoreEquipped = new Heirloom(save.global.CoreEquipped);
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

    if (save.global.highestLevelCleared >= 180) {
        inputs.setInput("masteriesUnlocked", true);
    }

    // init player spire stuff
    if (save.global.spiresCompleted >= 1) {
        inputs.setInput("coreUnlocked", true);
        startTDCalc();
        loadCore(startingCore);
    }

    if (isUniverse2Unlocked()) {
        inputs.setInput("universe2Unlocked", true);
        document.getElementById("universe2CheckboxContainer").style.display = "flex";
        if (inputs.universe2 && document.getElementById("fluffyCheckboxesContainer").style.display !== "flex") document.getElementById("scruffyCheckboxesContainer").style.display = "flex";
    }

    if (save.global.spiresCompleted >= 2) {
        inputs.setInput("fluffyUnlocked", true);
        if (document.getElementById("scruffyCheckboxesContainer").style.display !== "flex") document.getElementById("fluffyCheckboxesContainer").style.display = "flex";
    }

    let newShield = new Heirloom();
    let newStaff = new Heirloom();
    let newCore = new Heirloom();
    if (!startingShield.isEmpty()) {
        newShield = startingShield.calculatePurchases();
    }

    if (!startingStaff.isEmpty()) {
        newStaff = startingStaff.calculatePurchases();
    }

    if (!startingCore.isEmpty()) {
        newCore = startingCore.calculatePurchases();
        spirestones -= newCore.paid;
    }
    
    // current nu/ss, next goal nu price, next goal name
    if (startingShield.hasUpgradableMods() && startingStaff.hasUpgradableMods()) {
        document.getElementById("nextUpgradesContainer").innerHTML =
        `You have ${prettify(nullifium)} Nullifium${inputs.coreUnlocked ? ` and ${prettify(spirestones)} Spirestones.` : "."}
        <br>
        Your next upgrade${startingCore.isEmpty()
        ? `s should be ${mods[newShield.next.name].name} at ${prettify(newShield.next.cost)} more Nullifium, and ${mods[newStaff.next.name].name} at ${prettify(newStaff.next.cost)} more Nullifium.`
        : `s should be ${mods[newShield.next.name].name} at ${prettify(newShield.next.cost)} more Nullifium, ${mods[newStaff.next.name].name} at ${prettify(newStaff.next.cost)} more Nullifium, and ${mods[newCore.next.name].name} at ${prettify(newCore.next.cost)} Spirestones.`}`;
    } else if (startingShield.hasUpgradableMods()) {
        document.getElementById("nextUpgradesContainer").innerHTML =
        `You have ${prettify(nullifium)} Nullifium${inputs.coreUnlocked ? ` and ${prettify(spirestones)} Spirestones.` : "."}
        <br>
        Your next upgrade${startingCore.isEmpty()
        ? ` should be ${mods[newShield.next.name].name} at ${prettify(newShield.next.cost)} more Nullifium.`
        : `s should be ${mods[newShield.next.name].name} at ${prettify(newShield.next.cost)} more Nullifium, and ${mods[newCore.next.name].name} at ${prettify(newCore.next.cost)} Spirestones.`}`;
    } else if (startingStaff.hasUpgradableMods()) {
        document.getElementById("nextUpgradesContainer").innerHTML =
        `You have ${prettify(nullifium)} Nullifium${inputs.coreUnlocked ? ` and ${prettify(spirestones)} Spirestones.` : "."}
        <br>
        Your next upgrade${startingCore.isEmpty()
        ? ` should be ${mods[newStaff.next.name].name} at ${prettify(newStaff.next.cost)} more Nullifium.`
        : `s should be ${mods[newStaff.next.name].name} at ${prettify(newStaff.next.cost)} more Nullifium, and ${mods[newCore.next.name].name} at ${prettify(newCore.next.cost)} Spirestones.`}`;
    } else if (!startingShield.hasUpgradableMods() && !startingStaff.hasUpgradableMods()) {
        document.getElementById("nextUpgradesContainer").innerHTML =
        `You have ${prettify(nullifium)} Nullifium${inputs.coreUnlocked ? "." : ` and ${prettify(spirestones)} Spirestones.`}
        <br>
        ${startingCore.isEmpty()
        ? `You have no mods to upgrade.`
        : `Your next upgrade should be ${mods[newCore.next.name].name} at ${prettify(newCore.next.cost)} Spirestones.`}`;
    }

    updateModContainer("shieldOld", startingShield);
    updateModContainer("shieldNew", newShield);
    updateModContainer("staffOld", startingStaff);
    updateModContainer("staffNew", newStaff);
    updateModContainer("coreOld", startingCore, save.playerSpire.main.spirestones);
    updateModContainer("coreNew", newCore, spirestones);

    // animation
    document.getElementById("shieldNewContainer").style.animation = "moveDown 1s 1 cubic-bezier(0, 0, 0, 1)";
    document.getElementById("shieldNewContainer").style.opacity = 1;
    document.getElementById("staffNewContainer").style.animation = "moveDown 1s 1 cubic-bezier(0, 0, 0, 1)";
    document.getElementById("staffNewContainer").style.opacity = 1;
    if (startingCore.isEmpty()) {
        document.getElementById("coreOldContainer").style.display = "none";
        document.getElementById("coreNewContainer").style.display = "none";
    } else {
        document.getElementById("coreNewContainer").style.animation = "moveDown 1s 1 cubic-bezier(0, 0, 0, 1)";
        document.getElementById("coreOldContainer").style.display = "block";
        document.getElementById("coreNewContainer").style.display = "block";
    }
}