//lots of stuff here copied from Trimps (https://trimps.github.io/), since it is a calculator for it afterall
//lots of the math and the idea behind this is based off of the heirloom spreadsheet made by nsheetz from the Trimps discord
//minor help from SpectralFlame, and Razenpok
//I hope this tool is useful! :)

let save;

let VMWeight = 12;
let XPWeight = 11.25;
let hasE4 = false;
let hasE5 = false;
let hasCC =  false;

Math.log = (function() {
  var log = Math.log;
  return function(n, base) {
    return log(n)/(base ? log(base) : 1);
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

//add arrays for max normal values, if below or equal to, return normal price, else divide the amount over the normal value by the step to get amount and calculate the price with the amount
function getUpgCost(type, heirloom) {
	let rarity = heirloom.rarity
	let value = 0;
	for (let i in heirloom.mods) { 
		if (heirloom.mods[i][0] === type) {
			value = heirloom.mods[i][1]
		}
	}
	if (value <= maxAmounts[type]) {
		return basePrices[rarity];
	}
	let amount = (value-maxAmounts[type][rarity]) / stepAmounts[type][rarity];
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
	let value = 0;
	let rarity = heirloom.rarity
	if (type === "trimpAttack") {
		for (let i in heirloom.mods) { 
			if (heirloom.mods[i][0] === type) {
				value = heirloom.mods[i][1];
			}
		}
		return (value+100+stepAmounts[type][rarity]) / (value+100)
	} else if (type === "critDamage") {
		var relentlessness = save.portal.Relentlessness.level
		let critChance = relentlessness * 5;
		let megaCritMult = 5;
		let critDmgNormalizedBefore = 0;
		let critDmgNormalizedAfter = 0;
		for (let mod of heirloom.mods) { 
			if (mod[0] === type) {
				value = mod[1];
			}
			if (mod[0] === "critChance") {
				critChance += mod[1];
				if (hasCC) {
					critChance += mod[1] / 2;
				}
			}
		}
		if (hasE4) {
			critChance += 50;
		}
		if (hasE5) {
			megaCritMult += 2;
		}
		if (hasCC) {
			megaCritMult += 1;
		}
		const megaCrits = Math.min(Math.floor(critChance / 100), 2);
		critChance = Math.min(critChance - megaCrits * 100, 100) / 100;
		const critDamage = value + 230 * Math.min(relentlessness, 1) + 30 * Math.min(relentlessness, 9);
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
				critDmgNormalizedAfter = (critDamage + stepAmounts[type][rarity]) * megaCritMult * ((1 - critChance) + megaCritMult * critChance);
				break;
			case 1:
				critDmgNormalizedAfter = (critDamage + stepAmounts[type][rarity]) * ((1 - critChance) + megaCritMult * critChance);
				break;
			case 0:
				critDmgNormalizedAfter = (critDamage + stepAmounts[type][rarity]) * critChance + ((1 - critChance) * 100);
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
		for (let mod of heirloom.mods) { 
			if (mod[0] === type) {
				value = mod[1];
				critChanceBefore += mod[1];
				if (hasCC) {
					critChanceBefore += mod[1] / 2;
				}
			}
			if (mod[0] === "critDamage") {
				critDamage += mod[1];
			}
		}
		if (hasE4) {
			critChanceBefore += 50;
		}
		if (hasE5) {
			megaCritMult += 2;
		}
		if (hasCC) {
			megaCritMult += 1;
		}
		const megaCritsBefore = Math.min(Math.floor(critChanceBefore / 100), 2);
		const megaCritsAfter = Math.min(Math.floor((critChanceBefore + stepAmounts[type][rarity]) / 100), 2);
		critChanceAfter = Math.min((critChanceBefore + stepAmounts[type][rarity]) - megaCritsAfter * 100, 100) / 100;
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
	} else if (type === "voidMaps") {
		for (let i in heirloom.mods) { 
			if (heirloom.mods[i][0] === type) {
				value = heirloom.mods[i][1];
			}
		}
		return (value + stepAmounts[type][rarity] * VMWeight) / (value)
	} else if (type === "plaguebringer") {
		for (let i in heirloom.mods) { 
			if (heirloom.mods[i][0] === type) {
				value = heirloom.mods[i][1];
			}
		}
		return (value + 100 + stepAmounts[type][rarity]) / (value + 100)
	} else if (type === "FluffyExp") {
		for (let i in heirloom.mods) { 
			if (heirloom.mods[i][0] === type) {
				value = heirloom.mods[i][1];
			}
		}
		return (value + 100 + stepAmounts[type][rarity] * XPWeight) / (value + 100)
	} else if (type === "MinerSpeed") {
		//maybe make the assumed equip level adjustable? I think 90 is a good balance assuming it's not though
		var equipLevels = 90;
		for (let i in heirloom.mods) { 
			if (heirloom.mods[i][0] === type) {
				value = heirloom.mods[i][1];
			}
		}
		return (Math.log((value + 100 + stepAmounts[type][rarity]) / (value + 100), ((1 - Math.pow(1.2, equipLevels)) / (1 - Math.pow(1.2, equipLevels - 1)))) + equipLevels) / equipLevels
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

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
  }

function updateWeight(type) {
	switch(type) {
		case "VM":
			if(isNumeric(document.getElementById("VMInput").value))
			VMWeight = parseFloat(document.getElementById("VMInput").value)
			break;
		case "XP":
		if(isNumeric(document.getElementById("XPInput").value))
			XPWeight = parseFloat(document.getElementById("XPInput").value)
			break;
	}
	if (save) {
		calculate(true)
	}
}

function updateCheckboxes() {
	hasE4 = document.getElementById("hasE4").checked
	hasE5 = document.getElementById("hasE5").checked
	hasCC = document.getElementById("hasCC").checked
	if (save) {
		calculate(true)
	}
}

function prettifySub(number){
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

	var base = Math.floor(Math.log(number)/Math.log(1000));
	if (base <= 0) return prettifySub(number);
	number /= Math.pow(1000, base);
	if (number >= 999.5) {
		// 999.5 rounds to 1000 and we don’t want to show “1000K” or such
		number /= 1000;
		++base;
	}
	if (save.options.menu.standardNotation.enabled == 3){
		var suffices = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
		if (base <= suffices.length) suffix = suffices[base -1];
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
			suffix = suffices[base-1];
		else
		{
			var exponent = parseFloat(numberTmp).toExponential(2);
			exponent = exponent.replace('+', '');
			return exponent;
		}
	}
	return prettifySub(number) + suffix;
}

function calculate(manualInput) {
	save = JSON.parse(LZString.decompressFromBase64(document.getElementById("saveInput").value))

	let nu = save.global.nullifium

	let startingShield = save.global.ShieldEquipped
	let startingStaff = save.global.StaffEquipped

	let fluffyLevel = Math.floor(Math.log10(((save.global.fluffyExp / (1000 * Math.pow(5, save.global.fluffyPrestige))) * (4 - 1)) + 1) / Math.log10(4));
	let fluffinity = (save.talents.fluffyAbility.purchased) ? 1 : 0;

	if (!manualInput) {
		hasE4 = (fluffyLevel + save.global.fluffyPrestige + fluffinity >= 14) ? true : false;
		hasE5 = (fluffyLevel + save.global.fluffyPrestige + fluffinity >= 15) ? true : false;
		hasCC = save.talents.crit.purchased;
		document.getElementById("hasE4").checked = hasE4
		document.getElementById("hasE5").checked = hasE5
		document.getElementById("hasCC").checked = hasCC
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
	document.getElementById("shieldOldName").textContent  = startingShield.name + " (Old)";
	document.getElementById("shieldNewName").textContent  = startingShield.name + " (New)";
	document.getElementById("staffOldName").textContent  = startingStaff.name + " (Old)";
	document.getElementById("staffNewName").textContent  = startingStaff.name + " (New)";

	//add rarity styles to equip divs
	document.getElementById("shieldOldContainer").classList.value = "heirloomContainer heirloomRare"+startingShield.rarity;
	document.getElementById("shieldNewContainer").classList.value = "heirloomContainer heirloomRare"+startingShield.rarity;
	document.getElementById("staffOldContainer").classList.value = "heirloomContainer heirloomRare"+startingStaff.rarity;
	document.getElementById("staffNewContainer").classList.value = "heirloomContainer heirloomRare"+startingStaff.rarity;

	//add upg amounts
	for (let i=0; i<5; i++) {
		if (shieldAddAmounts[i] === 0) {
			document.getElementById("shieldNewMod"+i+"Plus").textContent = "";
		} else {
			document.getElementById("shieldNewMod"+i+"Plus").textContent = "+"+shieldAddAmounts[i];
		}

		if (staffAddAmounts[i] === 0) {
			document.getElementById("staffNewMod"+i+"Plus").textContent = "";
		} else {
			document.getElementById("staffNewMod"+i+"Plus").textContent = "+"+staffAddAmounts[i];
		}
	}

	//add current stats to old divs
	for (let i=0; i<5; i++) {
		if (startingShield.mods[i]) {
			if (startingShield.mods[i][0] === "empty") document.getElementById("shieldOldMod"+i).textContent = "Empty";
			else document.getElementById("shieldOldMod"+i).textContent = startingShield.mods[i][1] + "% " + modNames[startingShield.mods[i][0]];
			document.getElementById("shieldOldModContainer"+i).style.opacity = 1;
		}
		else {
			document.getElementById("shieldOldMod"+i).textContent = "N/A";
			document.getElementById("shieldOldModContainer"+i).style.opacity = 0;
		}
	}
	for (let i=0; i<5; i++) {
		if (startingStaff.mods[i]) {
			if (startingStaff.mods[i][0] === "empty") document.getElementById("staffOldMod"+i).textContent = "Empty";
			else document.getElementById("staffOldMod"+i).textContent = startingStaff.mods[i][1] + "% " + modNames[startingStaff.mods[i][0]];
			document.getElementById("staffOldModContainer"+i).style.opacity = 1;
		}
		else {
			document.getElementById("staffOldMod"+i).textContent = "N/A";
			document.getElementById("staffOldModContainer"+i).style.opacity = 0;
		}
	}

	//add new stats to new divs
	for (let i=0; i<5; i++) {
		if (newShield.mods[i]) {
			if (newShield.mods[i][0] === "empty") document.getElementById("shieldNewMod"+i).textContent = "Empty";
			else document.getElementById("shieldNewMod"+i).textContent = newShield.mods[i][1] + "% " + modNames[newShield.mods[i][0]];
			document.getElementById("shieldNewModContainer"+i).style.opacity = 1;
		}
		else {
			document.getElementById("shieldNewMod"+i).textContent = "N/A";
			document.getElementById("shieldNewModContainer"+i).style.opacity = 0;
		}
	}
	for (let i=0; i<5; i++) {
		if (newStaff.mods[i]) {
			if (newStaff.mods[i][0] === "empty") document.getElementById("staffNewMod"+i).textContent = "Empty";
			else document.getElementById("staffNewMod"+i).textContent = newStaff.mods[i][1] + "% " + modNames[newStaff.mods[i][0]];
			document.getElementById("staffNewModContainer"+i).style.opacity = 1;
		}
		else {
			document.getElementById("staffNewMod"+i).textContent = "N/A";
			document.getElementById("staffNewModContainer"+i).style.opacity = 0;
		}
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
}