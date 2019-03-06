//lots of stuff here copied from Trimps (https://trimps.github.io/), since it is a calculator for it afterall
//lots of the math and the idea behind this is based off of the heirloom spreadsheet made by nsheetz from the Trimps discord
//major help for improved VM/XP calculations from ymhsbmbesitwf
//help for improved miner eff calculation from GhostFrog
//minor help from SpectralFlame, and Razenpok
//I hope this tool is useful! :)

//patch notes: (maybe move these somewhere visible on the main page later, instead of just a link in the corner)

/*

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

let inputs = {
	VMWeight: 1,
	XPWeight: 1,
	weaponLevels: 90,
	portalZone: 1,
	voidZone: 1,
	E4: false,
	E5: false,
	CC: false,
	Legacy: false,
	setInput: function (name, value) {
		this[name] = value;
		if (name === "E4" || name === "E5" || name === "CC" || name === "Legacy") document.getElementById(name + "Input").checked = value;
		else document.getElementById(name + "Input").value = value;
		localStorage.setItem("heirloomInputs", JSON.stringify(inputs))
	}
}

if (localStorage.getItem("heirloomInputs") !== null) {
	let savedInputs = JSON.parse(localStorage.getItem("heirloomInputs"))
	for (input in JSON.parse(localStorage.getItem("heirloomInputs"))) {
		if ((input === "VMWeight" || input === "XPWeight") && savedInputs[input] === 1) continue
		inputs.setInput(input, savedInputs[input])
	}
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function updateInput(name) {
	let inputDiv = document.getElementById(name + "Input")
	if (name === "E4" || name === "E5" || name === "CC" || name === "Legacy") inputs[name] = inputDiv.checked
	else if (isNumeric(inputDiv.value)) inputs[name] = parseFloat(inputDiv.value)
	if (save) {
		calculate(true)
	}
	localStorage.setItem("heirloomInputs", JSON.stringify(inputs))
}

//remove old data
localStorage.removeItem("VMWeight")
localStorage.removeItem("XPWeight")
localStorage.removeItem("ELWeight")

Math.log = (function () {
	var log = Math.log;
	return function (n, base) {
		return log(n) / (base ? log(base) : 1);
	};
})();

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
	woodDrop: "Wood Drop Rate"
}

const fancyModNames = {
	critChance: "Crit Chance",
	critDamage: "Crit Damage",
	plaguebringer: "Plaguebringer",
	trimpAttack: "Trimp Attack",
	voidMaps: "Void Map Drop Chance",

	FluffyExp: "Fluffy Exp",
	MinerSpeed: "Miner Efficiency",
}

const modsToWeigh = ["trimpAttack", "critDamage", "critChance", "voidMaps", "plaguebringer", "FluffyExp", "MinerSpeed"]
const modsToWeighShield = ["trimpAttack", "critDamage", "critChance", "voidMaps", "plaguebringer"]
const modsToWeighStaff = ["FluffyExp", "MinerSpeed"]

const rarityNames = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Magnificent", "Ethereal", "Magmatic", "Plagued"];

const basePrices = [5, 10, 15, 25, 75, 150, 400, 1000, 2500]
const priceIncreases = [2, 1.5, 1.25, 1.19, 1.15, 1.12, 1.1, 1.06, 1.04]

const stepAmounts = {
	critChance: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.3, 0.5],
	critDamage: [5, 5, 5, 5, 10, 10, 10, 10, 15],
	trimpAttack: [1, 1, 2, 2, 5, 5, 5, 6, 8],
	voidMaps: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.25],
	plaguebringer: [0, 0, 0, 0, 0, 0, 0, 0, 0.5],
	FluffyExp: [0, 0, 0, 0, 0, 0, 0, 0, 1],
	MinerSpeed: [1, 1, 1, 1, 2, 4, 8, 16, 32]
}

const maxAmounts = {
	critChance: [0.6, 1.4, 2.6, 5.0, 7.4, 9.8, 12.2, 15.9, 30],
	critDamage: [20, 40, 60, 100, 200, 300, 400, 500, 650],
	trimpAttack: [2, 6, 20, 40, 100, 150, 200, 260, 356],
	voidMaps: [1.5, 4, 7, 11, 16, 22, 30, 38, 50],
	plaguebringer: [0, 0, 0, 0, 0, 0, 0, 0, 15],
	FluffyExp: [0, 0, 0, 0, 0, 0, 0, 0, 50],
	MinerSpeed: [2, 3, 6, 12, 40, 80, 160, 320, 640]
}

const hardCaps = {
	critChance: [30, 30, 30, 30, 30, 30, 30, 30, 100],
	voidMaps: [50, 50, 50, 50, 50, 50, 50, 50, 80],
	plaguebringer: [0, 0, 0, 0, 0, 0, 0, 0, 75]
}

//below code is from /u/ymhsbmbesitwf on reddit
/**
 * Useful constants.
 */
// Trimps updates.js : getAchievementStrengthLevel()
const achievementTiers = [15, 100, 300, 600, 1000, 2000];
// Trimps main.js : prestigeEquipment(what, fromLoad, noInc)
// Trimps config.js : prestige
const attackPrestigeMultiplier = Math.pow(1.19, 13);
// Trimps main.js : checkVoidMap()
// Actual chance works independently from Heirloom Bonus.
const averageCellsAfterMin = 891.0401556784;
// Trimps config.js : badGuys
// World enemies with all relevant Exotic Imp-orts unlocked, lies only by up to 3.7% otherwise.
const averageBadGuyHealthMod = (0.7 + 1.3 + 1.3 + 1 + 0.7 + 0.8 + 1.1 + 1.6 + 1.5 + 1 + 1 + 1 + 1 + 1) / 14;
// Trimps main.js : Fluffy
const fluffyRewards = { voidance: 12, critChance: 14, megaCrit: 15, voidelicious: 17 };
// Trimps config.js : goldenUpgrades
// Trimps main.js: buyGoldenUpgrade(what)
const goldenVoid = [0.0, 0.02, 0.06, 0.12, 0.2, 0.3, 0.42, 0.56, 0.72];

/**
 * Variables that need to be read from save / settings.
 */
let portalZone = -1; // recommended default: save.global.highestLevelCleared + 1
// because save.global.lastPortal can be sometimes wrong,
// e.g. artificially low after c^2 (Trimp etc) and players
// might not recognize the significance
let voidZone = -1;   // recommended default: save.stats.highestVoidMap

/**
 * Prestige + Fluffinity + Level
 */
function fluffyRewardsAvailable() {
	// Trimps main.js : Fluffy 
	let fluffyLevel = Math.floor(Math.log(((save.global.fluffyExp / (1000 * Math.pow(5, save.global.fluffyPrestige))) * 3) + 1) / Math.log(4));
	return (save.global.fluffyPrestige + (save.talents.fluffyAbility.purchased ? 1 : 0) + fluffyLevel);
}

/**
 * Should account for everything except:
 * 1) Z1-Z10 health nerfs: irrelevant
 * 2) Nature enemies: ignored on purpose
 * 3) Magma placement: this random factor shouldn't influence the average too much
 */
function totalEnemyHealthInZone(zone) {
	// Trimps config.js getEnemyHealth: function (level, name, ignoreImpStat)
	let amt = 130 * Math.sqrt(zone) * Math.pow(3.265, zone / 2) - 110;
	let averageCell = (0 + 98) / 2;
	let total = 0;
	if (zone < 60) {
		total += ((amt * 0.4) + ((amt * 0.4) * (averageCell / 110))) * averageBadGuyHealthMod * 99;
		total += ((amt * 0.4) + ((amt * 0.4) * (99 / 110))) * 2; // Blimp
	} else {
		amt *= Math.pow(1.1, zone - 59);
		// Trimps main.js Corruption
		let corruptionStart = save.talents.headstart.purchased ? (save.talents.headstart2.purchased ? ((save.talents.headstart3.purchased) ? 151 : 166) : 176) : 181;
		if (zone < corruptionStart) {
			total += ((amt * 0.5) + ((amt * 0.8) * (averageCell / 100))) * averageBadGuyHealthMod * 99;
		} else {
			let corruptionCells = Math.min(Math.floor((zone - corruptionStart) / 3) + 2, 80);
			let corruptionMaxCell = Math.min(((Math.floor(corruptionCells / 6) + 1) * 10) - 1, 98);
			let corruptionStatScale = 10 * Math.pow(1.05, Math.floor((zone - 150) / 6));
			// corruptTough, corruptDodge
			corruptionStatScale = ((corruptionStatScale * 4) + (corruptionStatScale * 5) + (corruptionStatScale / 0.7)) / 6;
			let healthyCells = 0;
			let healthyMaxCell = -1;
			let healthyStatScale = 14 * Math.pow(1.05, Math.floor((zone - 150) / 6));
			// healthyTough
			healthyStatScale = ((healthyStatScale * 4) + (healthyStatScale * 7.5)) / 5;
			// Checking Spire II Achievement, because current run might not be there yet.
			if ((zone > 300) && (save.achievements.spire2Timed.highest != 0)) {
				healthyCells = Math.min(Math.floor((zone - 300) / 15) + 2, 80);
				healthyMaxCell = Math.min((Math.floor(healthyCells / 6) + 1) * 10, 98);
				corruptionCells -= healthyCells;
			}
			let averageHealth = 0;
			let corruptionCellsOverlap = 0;
			// Overlap (average)
			if (healthyCells > 0) {
				averageCell = (0 + healthyMaxCell) / 2;
				averageHealth = ((amt * 0.5) + ((amt * 0.8) * (averageCell / 100))) * averageBadGuyHealthMod;
				corruptionCellsOverlap = (healthyMaxCell - healthyCells) / (corruptionMaxCell - healthyCells) * corruptionCells;
				total += averageHealth * healthyStatScale * healthyCells;
				total += averageHealth * corruptionStatScale * corruptionCellsOverlap;
				total += averageHealth * ((healthyMaxCell + 1) - healthyCells - corruptionCellsOverlap);
			}
			// Corruption
			if (healthyMaxCell < corruptionMaxCell) {
				averageCell = ((healthyMaxCell + 1) + corruptionMaxCell) / 2;
				averageHealth = ((amt * 0.5) + ((amt * 0.8) * (averageCell / 100))) * averageBadGuyHealthMod;
				total += averageHealth * corruptionStatScale * (corruptionCells - corruptionCellsOverlap);
				total += averageHealth * (((corruptionMaxCell + 1) - (healthyMaxCell + 1)) - (corruptionCells - corruptionCellsOverlap));
			}
			// Above Corruption
			if (corruptionMaxCell < 98) {
				averageCell = ((corruptionMaxCell + 1) + 98) / 2;
				averageHealth = ((amt * 0.5) + ((amt * 0.8) * (averageCell / 100))) * averageBadGuyHealthMod;
				total += averageHealth * (98 - corruptionMaxCell);
			}
		}
		total += ((amt * 0.4) + ((amt * 0.4) * (99 / 110))) * 6; // Improbability
	}
	return total;
}

/**
 * Has to include Classy, so it's accurate only for saves with intended Perk allocation
 * and will result in slightly higher (I think) Fluffy priority with some c^2 specs.
 * Now includes Spire rewards, since almost all runs clear at least few rows of top Spire.
 */
function totalFluffyExpModifierUpToZone(zone) {
	let start = 300;
	if (save.portal.Classy.level) {
		start = Math.floor(start - (save.portal.Classy.level * save.portal.Classy.modifier));
	}
	let i = 0;
	let modifier = 0;
	for (i = start; i < zone; ++i) {
		modifier += Math.pow(1.015, i - start) * ((start % 100 == 0) ? 3 : 1);
	}
	return modifier;
}

/**
 * Should account for everything except:
 * 1) Looting bonuses: on purpose
 * 2) Fluffy / Daily bonuses: on purpose
 * 3) Spire Rows: many runs don't clear top Spire, don't want to guess the rows
 */
function voidHeliumInZone(zone) {
	// Trimps config.js Cthulimp.loot
	let amt = ((zone >= 60) ? 10 : 2) * ((zone >= 230) ? 3 : 1);
	let corruptionStart = save.talents.headstart.purchased ? (save.talents.headstart2.purchased ? ((save.talents.headstart3.purchased) ? 151 : 166) : 176) : 181;
	if (zone >= corruptionStart) {
		amt *= 2;
		let healthyCells = ((zone > 300) && (save.achievements.spire2Timed.highest != 0)) ? Math.min(Math.floor((zone - 300) / 15) + 2, 80) : 0;
		let corruptionCells = Math.min(Math.floor((zone - corruptionStart) / 3) + 2, 80) - healthyCells;
		amt *= 1 + 0.15 * corruptionCells + 0.45 * healthyCells;
	}
	// Trimp main.js rewardResource(what, baseAmt, level, checkMapLootScale, givePercentage)
	// if zone >= 19 to prevent NaN results
	if (zone >= 19) amt *= ((zone - 19) * 1.35) + Math.pow(1.23, Math.sqrt((zone - 19) * 1.35));
	if (save.global.sLevel >= 5) {
		amt *= Math.pow(1.005, zone);
	}
	return amt;
}

/**
 * Average VMs gathered up to zone, with starting bonuses based on portal.
 */
function voidMapsUpToZone(zone, portal, heirloomBonus) {
	let voidMaps = 0;
	// Trimps updates.js : resetGame(keepPortal)
	if (save.talents.voidSpecial.purchased) {
		voidMaps += Math.floor(portal / 100);
		if (save.talents.voidSpecial2.purchased) {
			voidMaps += Math.floor((portal + 50) / 100);
		}
	}
	// Trimps main.js : Fluffy
	let fluffyAvailable = fluffyRewardsAvailable();
	if (fluffyAvailable >= fluffyRewards.voidance) {
		voidMaps += 2;
		if (fluffyAvailable >= fluffyRewards.voidelicious) {
			voidMaps += 16;
		}
	}
	// Trimps main.js : getAvailableGoldenUpgrades()
	// Trimps updates.js : countExtraAchievementGoldens()
	let goldenUpgrades = Math.floor((save.global.achievementBonus - 2000) / 500);
	if (goldenUpgrades <= 0)
		goldenUpgrades = 0;
	let goldenMax = 8;
	// Reasonable assumption by omsi6
	if (!save.talents.voidSpecial.purchased) {
		goldenUpgrades = 0;
		goldenMax = 0;
	}
	let goldenTier = 6;
	while ((goldenTier > 0) && (save.global.achievementBonus < achievementTiers[goldenTier - 1])) {
		--goldenTier;
	}
	let goldenFrequency = 50 - ((goldenTier - 1) * 5);
	// Trimps main.js : checkVoidMap()
	let max = save.global.highestLevelCleared;
	let zonesCleared = 0;
	while ((zonesCleared < zone) && (goldenUpgrades <= goldenMax)) {
		let min = (max > 80) ? (1000 + ((max - 80) * 13)) : 1000;
		min *= (1 - (heirloomBonus / 100));
		min *= (1 - goldenVoid[goldenUpgrades]);
		let zonesWithCurrentUpgrade = goldenFrequency;
		if (((zonesCleared + zonesWithCurrentUpgrade) > zone) || (goldenUpgrades == goldenMax)) {
			zonesWithCurrentUpgrade = zone - zonesCleared;
		}
		voidMaps += (zonesWithCurrentUpgrade * 100) / (min + averageCellsAfterMin);
		zonesCleared += zonesWithCurrentUpgrade;
		++goldenUpgrades;
	}
	return voidMaps;
}

function getUpgValue(type, heirloom) {
	for (let mod of heirloom.mods) {
		if (mod[0] === type) {
			return mod[1]
		}
	}
}

//add arrays for max normal values, if below or equal to, return normal price, else divide the amount over the normal value by the step to get amount and calculate the price with the amount
function getUpgCost(type, heirloom) {
	let rarity = heirloom.rarity
	let value = getUpgValue(type, heirloom)
	if (value <= maxAmounts[type][rarity]) {
		return basePrices[rarity];
	}
	let amount = (value - maxAmounts[type][rarity]) / stepAmounts[type][rarity];
	if (type === "critChance") {
		return (value >= hardCaps[type][rarity]) ? 1e10 : Math.floor(basePrices[rarity] * Math.pow(priceIncreases[rarity], amount));
	} else if (type === "voidMaps") {
		return (value >= hardCaps[type][rarity]) ? 1e10 : Math.floor(basePrices[rarity] * Math.pow(priceIncreases[rarity], amount));
	} else if (type === "plaguebringer") {
		return (value >= hardCaps[type][rarity]) ? 1e10 : Math.floor(basePrices[rarity] * Math.pow(priceIncreases[rarity], amount));
	}
	return Math.floor(basePrices[rarity] * Math.pow(priceIncreases[rarity], amount));
}

function getUpgGain(type, heirloom) {
	let value = getUpgValue(type, heirloom);
	let stepAmount = stepAmounts[type][heirloom.rarity];
	if (type === "trimpAttack") {
		return (value + 100 + stepAmount) / (value + 100)
	} else if (type === "critDamage") {
		var relentlessness = save.portal.Relentlessness.level
		let critChance = relentlessness * 5;
		let megaCritMult = 5;
		let critDmgNormalizedBefore = 0;
		let critDmgNormalizedAfter = 0;
		if (inputs.CC) critChance += getUpgValue("critChance", heirloom) * 1.5
		else critChance += getUpgValue("critChance", heirloom)
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
		const critDamage = value + 230 * Math.min(relentlessness, 1) + 30 * Math.max((Math.min(relentlessness, 10) - 1), 0)
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
	} else if (type === "critChance") {
		var relentlessness = save.portal.Relentlessness.level
		let critChanceBefore = relentlessness * 5;
		let critChanceAfter = relentlessness * 5;
		let critDamage = 230 * Math.min(relentlessness, 1) + 30 * Math.min(relentlessness, 9);
		let megaCritMult = 5;
		let critDmgNormalizedBefore = 0;
		let critDmgNormalizedAfter = 0;
		if (inputs.CC) critChanceBefore += value * 1.5
		else critChanceBefore += value
		critDamage += getUpgValue("critDamage", heirloom)
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
	} if (type === "voidMaps") {
		//legacy mode return
		if (inputs.Legacy) {
			return (value + stepAmount * inputs.VMWeight) / (value)
		}

		let voidMapsOld = voidMapsUpToZone(inputs.voidZone, inputs.portalZone, value);
		let voidMapsNew = voidMapsUpToZone(inputs.voidZone, inputs.portalZone, value + stepAmount);
		let upgGain = voidMapsNew / voidMapsOld;
		
		// Using step 10 for Prestige reasons, 30 in Magma is the lowest common denominator with Nature.
		// It's prefered to using 1 or 5 zones, because Corrupted/Healthy stats jump a bit every 6 zones.
		let zoneStep = (inputs.portalZone > 235) ? 30 : 10;
		// Ignoring cost scaling. Has little effect in late, but might lie a bit in early game.
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
		let voidMapsHigherZone = voidMapsUpToZone(inputs.voidZone + zoneStep, inputs.portalZone + zoneStep, value);
		heliumScaling *= voidMapsHigherZone / voidMapsOld;
		// Scaling upgGain to Trimp Attack by comparing Helium gained (VM only)
		upgGain = Math.pow(upgGain, Math.log(attackScalingNeeded) / Math.log(heliumScaling));

		// Adding VMWeight (default: 1) in a manner consistent with previous calculation
		return (1 + (upgGain - 1) * inputs.VMWeight);
	} else if (type === "FluffyExp") {
		//legacy mode return
		if (inputs.Legacy) {
			return (value + 100 + stepAmount * inputs.XPWeight) / (value + 100)
		}
		
		let upgGain = (value + 100 + stepAmount) / (value + 100);
		// Avoiding weird stuff with zero division.
		// Results in very low Fluffy priority if portalZone is <301 for some reason. Shouldn't be a problem.
		if (inputs.portalZone >= 301) {
			// Scaling to Attack by comparing Exp gained from additional zones
			let pushGain = totalFluffyExpModifierUpToZone(inputs.portalZone + 30) / totalFluffyExpModifierUpToZone(inputs.portalZone);
			let attackScalingNeeded = totalEnemyHealthInZone(inputs.portalZone + 30) / totalEnemyHealthInZone(inputs.portalZone);
			attackScalingNeeded /= Math.pow(attackPrestigeMultiplier, 30 / 5);
			upgGain = Math.pow(upgGain, Math.log(attackScalingNeeded) / Math.log(pushGain));
		}
		// Adding XPWeight (default: 1) in a manner consistent with previous calculation
		return (1 + (upgGain - 1) * inputs.XPWeight);
	} else if (type === "plaguebringer") {
		return (value + 100 + stepAmount) / (value + 100)
	} else if (type === "MinerSpeed") {
		return (Math.log((value + 100 + stepAmount) / (value + 100) * (Math.pow(1.2, inputs.weaponLevels) - 1) + 1) / Math.log(1.2)) / inputs.weaponLevels
	}
}

function getUpgEff(type, shield, staff) {
	if (type === "trimpAttack") {
		return 1
	} else if (modsToWeighShield.includes(type)) {
		return Math.log(getUpgGain(type, shield), getUpgGain("trimpAttack", shield)) * getUpgCost("trimpAttack", shield) / getUpgCost(type, shield)
	} else if (modsToWeighStaff.includes(type)) {
		return Math.log(getUpgGain(type, staff), getUpgGain("trimpAttack", shield)) * getUpgCost("trimpAttack", shield) / getUpgCost(type, staff)
	}
}

function prettifySub(number) {
	number = parseFloat(number);
	var floor = Math.floor(number);
	if (number === floor) // number is an integer, just show it as-is
		return number;
	var precision = 3 - floor.toString().length; // use the right number of digits

	return number.toFixed(3 - floor.toString().length);
}

function prettify(number) {
	var numberTmp = number;
	if (!isFinite(number)) return "<span class='icomoon icon-infinity'></span>";
	if (number >= 1000 && number < 10000) return Math.floor(number);
	if (number == 0) return prettifySub(0);
	if (number < 0) return "-" + prettify(-number);
	if (number < 0.005) return (+number).toExponential(2);

	var base = Math.floor(Math.log(number) / Math.log(1000));
	if (base <= 0) return prettifySub(number);
	number /= Math.pow(1000, base);
	if (number >= 999.5) {
		// 999.5 rounds to 1000 and we don’t want to show “1000K” or such
		number /= 1000;
		++base;
	}
	if (save.options.menu.standardNotation.enabled == 3) {
		var suffices = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
		if (base <= suffices.length) suffix = suffices[base - 1];
		else {
			var suf2 = (base % suffices.length) - 1;
			if (suf2 < 0) suf2 = suffices.length - 1;
			suffix = suffices[Math.ceil(base / suffices.length) - 2] + suffices[suf2];
		}
	}
	else {
		var suffices = [
			'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud',
			'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Od', 'Nd', 'V', 'Uv', 'Dv',
			'Tv', 'Qav', 'Qiv', 'Sxv', 'Spv', 'Ov', 'Nv', 'Tg', 'Utg', 'Dtg', 'Ttg',
			'Qatg', 'Qitg', 'Sxtg', 'Sptg', 'Otg', 'Ntg', 'Qaa', 'Uqa', 'Dqa', 'Tqa',
			'Qaqa', 'Qiqa', 'Sxqa', 'Spqa', 'Oqa', 'Nqa', 'Qia', 'Uqi', 'Dqi',
			'Tqi', 'Qaqi', 'Qiqi', 'Sxqi', 'Spqi', 'Oqi', 'Nqi', 'Sxa', 'Usx',
			'Dsx', 'Tsx', 'Qasx', 'Qisx', 'Sxsx', 'Spsx', 'Osx', 'Nsx', 'Spa',
			'Usp', 'Dsp', 'Tsp', 'Qasp', 'Qisp', 'Sxsp', 'Spsp', 'Osp', 'Nsp',
			'Og', 'Uog', 'Dog', 'Tog', 'Qaog', 'Qiog', 'Sxog', 'Spog', 'Oog',
			'Nog', 'Na', 'Un', 'Dn', 'Tn', 'Qan', 'Qin', 'Sxn', 'Spn', 'On',
			'Nn', 'Ct', 'Uc'
		];
		var suffix;
		if (save.options.menu.standardNotation.enabled == 2 || (save.options.menu.standardNotation.enabled == 1 && base > suffices.length) || (save.options.menu.standardNotation.enabled == 4 && base > 31))
			suffix = "e" + ((base) * 3);
		else if (save.options.menu.standardNotation.enabled && base <= suffices.length)
			suffix = suffices[base - 1];
		else {
			var exponent = parseFloat(numberTmp).toExponential(2);
			exponent = exponent.replace('+', '');
			return exponent;
		}
	}
	return prettifySub(number) + suffix;
}

function prettifyCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculate(manualInput) {
	if (JSON.parse(LZString.decompressFromBase64(document.getElementById("saveInput").value)) !== null) save = JSON.parse(LZString.decompressFromBase64(document.getElementById("saveInput").value))

	let nu = save.global.nullifium

	let startingShield = save.global.ShieldEquipped
	let startingStaff = save.global.StaffEquipped

	if (!manualInput) {
		inputs.setInput("E4", fluffyRewardsAvailable() >= fluffyRewards.critChance)
		inputs.setInput("E5", fluffyRewardsAvailable() >= fluffyRewards.megaCrit)
		inputs.setInput("CC", save.talents.crit.purchased)
		for (let input in inputs) {
			if (input === "setInput") continue
			if (document.getElementById(input+"Input").value === "") {
				switch (input) {
					case "portalZone":
						inputs.setInput(input, save.global.highestLevelCleared + 1)
					break
					case "voidZone":
						inputs.setInput(input, save.stats.highestVoidMap.valueTotal)
					break
				}
			}
		}
	}

	let shieldAddAmounts = [0, 0, 0, 0, 0]
	let staffAddAmounts = [0, 0, 0, 0, 0]

	let newShield = JSON.parse(JSON.stringify(startingShield))
	let newStaff = JSON.parse(JSON.stringify(startingStaff))

	let cost = 0;
	let name = ""
	let modToUpgrade = []

	while (true) {
		let eff = 0
		for (let mod of newShield.mods) {
			if (getUpgEff(mod[0], newShield, newStaff) > eff) {
				eff = getUpgEff(mod[0], newShield, newStaff);
				cost = getUpgCost(mod[0], newShield);
				name = mod[0]
				modToUpgrade = mod
			}
		}

		for (let mod of newStaff.mods) {
			if (getUpgEff(mod[0], newShield, newStaff) > eff) {
				eff = getUpgEff(mod[0], newShield, newStaff);
				cost = getUpgCost(mod[0], newStaff);
				name = mod[0]
				modToUpgrade = mod
			}
		}

		if (modsToWeighShield.includes(name) && nu > cost) {
			newShield.mods[newShield.mods.indexOf(modToUpgrade)][1] += stepAmounts[newShield.mods[newShield.mods.indexOf(modToUpgrade)][0]][newShield.rarity]
			shieldAddAmounts[newShield.mods.indexOf(modToUpgrade)] += 1;
			nu -= cost;
		} else if (modsToWeighStaff.includes(name) && nu > cost) {
			newStaff.mods[newStaff.mods.indexOf(modToUpgrade)][1] += stepAmounts[newStaff.mods[newStaff.mods.indexOf(modToUpgrade)][0]][newStaff.rarity]
			staffAddAmounts[newStaff.mods.indexOf(modToUpgrade)] += 1;
			nu -= cost;
		} else {
			break;
		}
	}


	//current nu, next goal price, next goal name
	document.getElementById("nuAmount").textContent = prettify(nu);
	document.getElementById("nuCost").textContent = prettify(cost);
	document.getElementById("nextUpgrade").textContent = fancyModNames[name];

	//heirloom names
	document.getElementById("shieldOldName").textContent = startingShield.name + " (Old)";
	document.getElementById("shieldNewName").textContent = startingShield.name + " (New)";
	document.getElementById("staffOldName").textContent = startingStaff.name + " (Old)";
	document.getElementById("staffNewName").textContent = startingStaff.name + " (New)";

	//add rarity styles to equip divs
	if (save.options.menu.showHeirloomAnimations.enabled && startingShield.rarity >= 7) {
		document.getElementById("shieldOldContainer").classList.value = "heirloomContainer heirloomRare" + startingShield.rarity + "Anim";
		document.getElementById("shieldNewContainer").classList.value = "heirloomContainer heirloomRare" + startingShield.rarity + "Anim";
	} else {
		document.getElementById("shieldOldContainer").classList.value = "heirloomContainer heirloomRare" + startingShield.rarity;
		document.getElementById("shieldNewContainer").classList.value = "heirloomContainer heirloomRare" + startingShield.rarity;
	}
	if (save.options.menu.showHeirloomAnimations.enabled && startingStaff.rarity >= 7) {
		document.getElementById("staffOldContainer").classList.value = "heirloomContainer heirloomRare" + startingStaff.rarity + "Anim";
		document.getElementById("staffNewContainer").classList.value = "heirloomContainer heirloomRare" + startingStaff.rarity + "Anim";
	} else {
		document.getElementById("staffOldContainer").classList.value = "heirloomContainer heirloomRare" + startingStaff.rarity;
		document.getElementById("staffNewContainer").classList.value = "heirloomContainer heirloomRare" + startingStaff.rarity;
	}

	//add upg amounts
	for (let i = 0; i < 5; i++) {
		if (shieldAddAmounts[i] === 0) {
			document.getElementById("shieldNewMod" + i + "Plus").textContent = "";
		} else {
			document.getElementById("shieldNewMod" + i + "Plus").textContent = "+" + shieldAddAmounts[i];
		}

		if (staffAddAmounts[i] === 0) {
			document.getElementById("staffNewMod" + i + "Plus").textContent = "";
		} else {
			document.getElementById("staffNewMod" + i + "Plus").textContent = "+" + staffAddAmounts[i];
		}
	}



	//add current stats to old divs
	let infoText = "Below is a list of the calulated costs, gains, and efficiency of each weighted upgrade, taken from the stats displayed on this heirloom.<br><br>"
	for (let i = 0; i < 5; i++) {
		if (startingShield.mods[i]) {
			if (startingShield.mods[i][0] === "empty") document.getElementById("shieldOldMod" + i).textContent = "Empty";
			else document.getElementById("shieldOldMod" + i).textContent = parseFloat(startingShield.mods[i][1].toPrecision(4)).toString() + "% " + modNames[startingShield.mods[i][0]];
			document.getElementById("shieldOldModContainer" + i).style.opacity = 1;
			if (modsToWeigh.includes(startingShield.mods[i][0])) {
				infoText += fancyModNames[startingShield.mods[i][0]] + ":<ul>"
				infoText += "<li>Cost: " + prettifyCommas(getUpgCost(startingShield.mods[i][0], startingShield)) + "</li>"
				infoText += "<li>Gain: " + getUpgGain(startingShield.mods[i][0], startingShield) + "</li>"
				infoText += "<li>Efficiency: " + getUpgEff(startingShield.mods[i][0], startingShield) + "</li>"
				infoText += "</ul>"
			}
		}
		else {
			document.getElementById("shieldOldMod" + i).textContent = "N/A";
			document.getElementById("shieldOldModContainer" + i).style.opacity = 0;
		}
	}
	infoText += "</ul>"
	if (infoText === "Below is a list of the calulated costs, gains, and efficiency of each weighted upgrade, taken from the stats displayed on this heirloom.<br><br></ul>") {
		document.getElementById("shieldOldInfo").innerHTML = "This is where you would normally see additional information about this heirloom's mods, but this heirloom has no weighted mods."
	} else {
		document.getElementById("shieldOldInfo").innerHTML = infoText
	}

	infoText = "Below is a list of the calulated costs, gains, and efficiency of each weighted upgrade, taken from the stats displayed on this heirloom.<br><br>"
	for (let i = 0; i < 5; i++) {
		if (startingStaff.mods[i]) {
			if (startingStaff.mods[i][0] === "empty") document.getElementById("staffOldMod" + i).textContent = "Empty";
			else document.getElementById("staffOldMod" + i).textContent = parseFloat(startingStaff.mods[i][1].toPrecision(4)).toString() + "% " + modNames[startingStaff.mods[i][0]];
			document.getElementById("staffOldModContainer" + i).style.opacity = 1;
			if (modsToWeigh.includes(startingStaff.mods[i][0])) {
				infoText += fancyModNames[startingStaff.mods[i][0]] + ":<ul>"
				infoText += "<li>Cost: " + prettifyCommas(getUpgCost(startingStaff.mods[i][0], startingStaff)) + "</li>"
				infoText += "<li>Gain: " + getUpgGain(startingStaff.mods[i][0], startingStaff) + "</li>"
				infoText += "<li>Efficiency: " + getUpgEff(startingStaff.mods[i][0], startingShield, startingStaff) + "</li>"
				infoText += "</ul>"
			}
		}
		else {
			document.getElementById("staffOldMod" + i).textContent = "N/A";
			document.getElementById("staffOldModContainer" + i).style.opacity = 0;
		}
	}
	infoText += "</ul>"
	if (infoText === "Below is a list of the calulated costs, gains, and efficiency of each weighted upgrade, taken from the stats displayed on this heirloom.<br><br></ul>") {
		document.getElementById("staffOldInfo").innerHTML = "This is where you would normally see additional information about this heirloom's mods, but this heirloom has no weighted mods."
	} else {
		document.getElementById("staffOldInfo").innerHTML = infoText
	}

	//add new stats to new divs
	infoText = "Below is a list of the calulated costs, gains, and efficiency of each weighted upgrade, taken from the stats displayed on this heirloom.<br><br>"
	for (let i = 0; i < 5; i++) {
		if (newShield.mods[i]) {
			if (newShield.mods[i][0] === "empty") document.getElementById("shieldNewMod" + i).textContent = "Empty";
			else document.getElementById("shieldNewMod" + i).textContent = parseFloat(newShield.mods[i][1].toPrecision(4)).toString() + "% " + modNames[newShield.mods[i][0]];
			document.getElementById("shieldNewModContainer" + i).style.opacity = 1;
			if (modsToWeigh.includes(newShield.mods[i][0])) {
				infoText += fancyModNames[newShield.mods[i][0]] + ":<ul>"
				infoText += "<li>Cost: " + prettifyCommas(getUpgCost(newShield.mods[i][0], newShield)) + "</li>"
				infoText += "<li>Gain: " + getUpgGain(newShield.mods[i][0], newShield) + "</li>"
				infoText += "<li>Efficiency: " + getUpgEff(newShield.mods[i][0], newShield) + "</li>"
				infoText += "</ul>"
			}
		}
		else {
			document.getElementById("shieldNewMod" + i).textContent = "N/A";
			document.getElementById("shieldNewModContainer" + i).style.opacity = 0;
		}
	}
	infoText += "</ul>"
	if (infoText === "Below is a list of the calulated costs, gains, and efficiency of each weighted upgrade, taken from the stats displayed on this heirloom.<br><br></ul>") {
		document.getElementById("shieldNewInfo").innerHTML = "This is where you would normally see additional information about this heirloom's mods, but this heirloom has no weighted mods."
	} else {
		document.getElementById("shieldNewInfo").innerHTML = infoText
	}

	infoText = "Below is a list of the calulated costs, gains, and efficiency of each weighted upgrade, taken from the stats displayed on this heirloom.<br><br>"
	for (let i = 0; i < 5; i++) {
		if (newStaff.mods[i]) {
			if (newStaff.mods[i][0] === "empty") document.getElementById("staffNewMod" + i).textContent = "Empty";
			else document.getElementById("staffNewMod" + i).textContent = parseFloat(newStaff.mods[i][1].toPrecision(4)).toString() + "% " + modNames[newStaff.mods[i][0]];
			document.getElementById("staffNewModContainer" + i).style.opacity = 1;
			if (modsToWeigh.includes(newStaff.mods[i][0])) {
				infoText += fancyModNames[newStaff.mods[i][0]] + ":<ul>"
				infoText += "<li>Cost: " + prettifyCommas(getUpgCost(newStaff.mods[i][0], newStaff)) + "</li>"
				infoText += "<li>Gain: " + getUpgGain(newStaff.mods[i][0], newStaff) + "</li>"
				infoText += "<li>Efficiency: " + getUpgEff(newStaff.mods[i][0], newShield, newStaff) + "</li>"
				infoText += "</ul>"
			}
		}
		else {
			document.getElementById("staffNewMod" + i).textContent = "N/A";
			document.getElementById("staffNewModContainer" + i).style.opacity = 0;
		}
	}
	infoText += "</ul>"
	if (infoText === "Below is a list of the calulated costs, gains, and efficiency of each weighted upgrade, taken from the stats displayed on this heirloom.<br><br></ul>") {
		document.getElementById("staffNewInfo").innerHTML = "This is where you would normally see additional information about this heirloom's mods, but this heirloom has no weighted mods."
	} else {
		document.getElementById("staffNewInfo").innerHTML = infoText
	}

	//animation
	document.getElementById("shieldOldContainer").style.animation = "moveLeft 1s 1 cubic-bezier(0, 0, 0, 1)"
	document.getElementById("shieldNewContainer").style.animation = "moveRight 1s 1 cubic-bezier(0, 0, 0, 1)"
	document.getElementById("shieldNewContainer").style.opacity = 1
	document.getElementById("staffOldContainer").style.animation = "moveLeft 1s 1 cubic-bezier(0, 0, 0, 1)"
	document.getElementById("staffNewContainer").style.animation = "moveRight 1s 1 cubic-bezier(0, 0, 0, 1)"
	document.getElementById("staffNewContainer").style.opacity = 1

	document.getElementById("shieldOldContainer").style.transform = ""
	document.getElementById("staffOldContainer").style.transform = ""

	document.getElementById("shieldOld?").style.display = "block"
	document.getElementById("shieldNew?").style.display = "block"
	document.getElementById("staffOld?").style.display = "block"
	document.getElementById("staffNew?").style.display = "block"
}