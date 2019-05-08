/* eslint-disable */
/* jshint esversion: 6 */

//from swaq/bhad (http://swaqvalley.com/td_calc/) with permission
//modified to suit the lack of visual needs
function startTDCalc() {
    var save_string = document.getElementById("saveInput").value
    parsed = JSON.parse(LZString.decompressFromBase64(save_string));
    if (parsed == null) return;
    game = parsed;
    $("#spireRows").val(game.playerSpire.main.rowsAllowed);
    buildSpire();
    loadLoadout("save");
    rsChecker = game.playerSpire.main.runestones + getCostOfBuild("quick");
    $("#maxAutoRS").val(Math.ceil(rsChecker));
    displayRsLimit();
    getCostOfBuild();
}
function getClipboardText(ev) {
    return ev.clipboardData.getData("text/plain").replace(/\s/g, '');
}
$(document).ready(function () {
    resetCounts();
    buildSpire();
    getTrapLocalStorage();
    setLockedTraps();
});
var trapLayout;
var direction = "<div style='color:white; line-height: 100%; position:absolute; width:100%; bottom:0%'> → </div>";
// FOR PRETTIFY TO work WITHOUT INPUTTING SAVE
var game = {
    options: {
        menu: {
            standardNotation: {
                enabled: 4
            }
        }
    },
    playerSpire: {
        main: {
            maxEnemies: 2
        }
    }
};

var strengthLocations = [];
var lightColStacks = [0, 0, 0, 0, 0];
var path = [];
var selectedTrap = null;
var counts = {};
var addStack = 0;
var detailed = [{}];
var selectedList = [];
var ticks = 0;
var slowsOnKill = 0;
var fireKill = false;
var finalToxicity = 0;
var typeOfTraps = ["fire", "frost", "poison", "lightning", "strength", "condenser", "knowledge"];
var towers = ["strength", "condenser", "knowledge"];
var damageTaken;
var damage;
var upgradeableTraps = ["fire", "frost", "poison", "lightning"];
var lockableTraps = ["poison", "lightning", "strength", "condenser", "knowledge"];
var loadouts = [{}];
var rsChecker = 1e200;
var totalRows = 1;

function buildSpire() {
    trapLayout = game.playerSpire.main.layout;
    strengthLocations = [];
    lightColStacks = [0, 0, 0, 0, 0];
    $("#layout").empty();
    rows = game.playerSpire.main.rowsAllowed;
    setLockedTraps();
    detailed = [{}];
    path = [];
    makeDetailed();
}

function doSomething(e) {
    if (e.target !== e.currentTarget) {
        if (e.buttons == 1 || e.buttons == 3) {
            e.target.click();
        } else {
            return;
        }
    }
    e.stopPropagation();
}

function runInformation() {
    imAnEnemy();
    imAnEnemy(getMaxEnemyHP());
    getCostOfBuild();
    setLockedTraps();
}

function clearLayout(cellStart) {
    var oldSelect = selectedTrap;
    for (var i = cellStart; i < trapLayout.length; i++) {
        changeCell(i, "Empty");
    }
    selectTrap(oldSelect);
    runInformation();
}

var modNamesToTraps = {
    fireTrap: "fire",
    poisonTrap: "poison",
    lightningTrap: "lightning",
    strengthEffect: "strength",
    condenserEffect: "condenser",
    runestones: "runestones",
}

function loadCore(core, overwrite, overwriteValue) {
    if (!isEmpty(core)) {
        //reset data
        traps.fire.coreMult = 1;
        traps.poison.coreMult = 1;
        traps.lightning.coreMult = 1;
        traps.strength.coreMult = 1;
        traps.condenser.coreMult = 1;
        traps.runestones.coreMult = 1;

        for (let mod of core.mods) {
            let bonus = mod[1];
            traps[modNamesToTraps[mod[0]]].coreMult = 1 + bonus / 100;
        }

        //overwrite lets you overwrite one of the core values, to make it easier to calc upg gain
        if (overwrite !== undefined) {
            traps[overwrite].coreMult = 1 + overwriteValue / 100
        }
    }
}

function toggleSelection(cell, cellObject) {
    if (cell >= trapLayout.length || cell < 0) return;
    cellObject.classList.toggle("selected");
    if (detailed[cell].selected == undefined || detailed[cell].selected == false) {
        detailed[cell].selected = true;
    } else {
        detailed[cell].selected = false;
    }
}

function selectCell(cell) {
    if (cell >= trapLayout.length || cell < 0) return;
    trapLayout[$("#layout").find("#trapCell" + cell).index()].classList.add("selected");
    detailed[cell].selected = true;
}

function unselectCell(cell, cellObject) {
    if (cell >= trapLayout.length || cell < 0) return;
    cellObject.classList.remove("selected");
    detailed[cell].selected = false;
}

function unselectAll() {
    for (var i = 0; i < trapLayout.length; i++) {
        // Since we're unselecting all of them it doesn't matter that
        // the index order for trapLayout is different than detailed
        unselectCell(i, trapLayout[i]);
    }
}

function insertSelection(loc) {
    if (loc >= trapLayout.length || loc < 0) return;

    var insertType = selectedTrap;
    selectedTrap = "Empty";
    var first = 0;
    var last = -1;
    var newTraps = [];

    for (var i = 0; i < trapLayout.length; i++) {
        if (detailed[i].selected == undefined || detailed[i].selected == false) {
            if (first > last) {
                first++;
            } else {
                newTraps[newTraps.length] = null;
            }
        } else {
            last = i;
            newTraps[newTraps.length] = detailed[i].type;

            if (insertType == "Move") {
                setTrap(i, true);
            }
        }
    }

    if (last != -1) {
        for (var e = 0; e < newTraps.length && e + loc < trapLayout.length && e <= last - first; e++) {
            if (newTraps[e] != null) {
                // Empty all cells first to clear any Strength towers
                setTrap(e + loc, true);
            }
        }

        // Refresh detailed
        imAnEnemy();

        for (var n = 0; n < newTraps.length && n + loc < trapLayout.length && n <= last - first; n++) {
            selectedTrap = newTraps[n];
            setTrap(n + loc, true);
        }
    }

    selectTrap(insertType);
    runInformation();
}

function shiftTraps(loc) {
    if (loc >= trapLayout.length || loc < 0) return;

    var shiftType = selectedTrap;
    selectedTrap = "Move";
    var shiftDir = 1;
    var newLoc = loc + 1;
    if (shiftType == "ShiftDown") {
        shiftDir = -1;
    } else if (shiftType != "ShiftUp" || newLoc >= trapLayout.length) {
        selectTrap(shiftType);
        return;
    }

    unselectAll();

    var i = loc
    while (i < trapLayout.length && i >= 0 && detailed[i].type != "Empty") {
        if (!(i == 0 && shiftType == "ShiftDown")) {
            selectCell(i);
        }
        i += shiftDir;
    }

    if (shiftType == "ShiftDown") {
        newLoc = Math.max(i, 0);
    }

    insertSelection(newLoc);
    unselectAll();
    selectTrap(shiftType);
    runInformation();
}

function setTrap(number, noEnemy) {
    if (selectedTrap == null || selectedTrap == detailed[number].type) return false;
    if (selectedTrap == "Info") {
        debug = "<tbody>";
        for (var x in detailed[number]) {
            if (x == "div") continue;
            debug += "<tr>";
            debug += "<td>" + x + "</td>";
            debug += "<td>" + detailed[number][x].toString() + "</td>";
            debug += "</tr>";
        }
        debug += "</tbody>";
        $(".debug").html(debug);
        return true;
    } else {
        $(".debug").html("");
    }

    var search = trapLayout;
    var row = Math.floor(number / 5);
    if (strengthLocations[row] == true && selectedTrap == "Strength") {
        for (s = row * 5; s < (row + 1) * 5; s++) {
            if (detailed[s].type == "Strength") {
                selectedTrap = "Empty";
                setTrap(s, true);
                selectedTrap = "Strength";
                break;
            }
        }
    }

    switch (selectedTrap) {
        case "Strength":
            strengthLocations[row] = true;
            break;
        case "Lightning":
            lightColStacks[number % 5]++;
        // Fall through to default
        default:
            if (detailed[number].type == "Strength") {
                strengthLocations[row] = false;
            }
            break;
    }

    if (detailed[number].type == "Lightning" && lightColStacks[number % 5] > 0) {
        lightColStacks[number % 5]--;
    }

    detailed[number].selected = false;
    detailed[number].type = selectedTrap;
    if (noEnemy != true && $("#instantUpdate").is(":checked")) {
        runInformation();
    }
    return true;
}

function makePath() {
    length = trapLayout.length;
    path = [];
    for (var x = 0; x < length; x++) {
        path.push({ type: game.playerSpire.main.layout[x].trap.name });
    }
}

function selectTrap(type) {
    if (type == null || selectedTrap == type || (lockableTraps.includes(type.toLowerCase()) && traps[type.toLowerCase()].locked)) {
        return;
    }
    var search = $("#trapSelector").children();
    var length = search.length;
    selectedTrap = type;
    for (var o = 0; o < length; o++) {
        if (search[o].classList.contains(type + "TrapBox")) {
            search[o].classList += " selected";
        } else {
            search[o].classList.remove("selected");
        }
    }
}

var traps = {
    fire: {
        locked: false,
        damage: 50,
        cost: 100,
        increase: 1.5,
        level: 1,
        maxLevel: 8,
        upgrades: [0, 0, 5e4, 5e6, 2.5e7, 7.5e7, 5e9, 5e11, 1e14],
        unlock: [0, 0, 250, 300, 375, 425, 500, 590, 650],
        dmgs: [0, 50, 500, 2500, 5e3, 10e3, 10e4, 10e5, 10e7],
        coreMult: 1
    },
    frost: {
        locked: false,
        damage: 10,
        slow: 3,
        effect: 2,
        cost: 100,
        increase: 5,
        level: 1,
        maxLevel: 6,
        fireIncrease: 1.25,
        upgrades: [0, 0, 1e4, 5e5, 2.5e6, 1e8, 5e10],
        unlock: [0, 0, 230, 275, 330, 430, 530],
        dmgs: [0, 10, 50, 500, 2500, 5000, 25000],
        slows: [0, 3, 4, 4, 4, 4, 5],
    },
    poison: {
        locked: true,
        defaultStack: 5,
        cost: 500,
        increase: 1.75,
        level: 1,
        maxLevel: 7,
        upgrades: [0, 0, 1e7, 5e7, 7.5e8, 1e11, 1e12, 4e13],
        unlock: [0, 0, 350, 400, 450, 550, 600, 625],
        stacks: [0, 5, 10, 10, 20, 40, 80, 160],
        coreMult: 1
    },
    lightning: {
        locked: true,
        damage: 50,
        effect: 2,
        length: 1,
        damageBuff: 2,
        cost: 1000,
        increase: 3,
        level: 1,
        maxLevel: 6,
        upgrades: [0, 0, 5e8, 5e9, 2.5e11, 1e12, 1e15],
        unlock: [0, 0, 440, 500, 575, 600, 675],
        dmgs: [0, 50, 500, 5000, 5000, 5e4, 5e5],
        dmgbuffs: [0, 2, 2, 4, 4, 4, 8],
        lengths: [0, 1, 2, 2, 2, 3, 3],
        coreMult: 1
    },
    strength: {
        locked: true,
        effect: 2, //100%
        cost: 3000,
        increase: 100,
        level: 1,
        maxLevel: 1,
        unlock: [0, 0],
        coreMult: 1
    },
    condenser: {
        locked: true,
        effect: 0.25, // 25%
        cost: 6000,
        increase: 100,
        level: 1,
        maxLevel: 1,
        unlock: [0, 0],
        coreMult: 1
    },
    knowledge: {
        locked: true,
        slow: 5,
        effect: 3,
        cost: 9000,
        increase: 100,
        level: 1,
        maxLevel: 1,
        unlock: [0, 0],
    },
    runestones: {
        coreMult: 1
    }
};

function resetCounts() {
    counts = {
        "fire": 0,
        "frost": 0,
        "poison": 0,
        "lightning": 0,
        "strength": 0,
        "condenser": 0,
        "knowledge": 0,
        "empty": 0,
    };
}
// create detailed
function makeDetailed() {
    for (var x = 0; x < 5 * game.playerSpire.main.rowsAllowed; x++) {
        if (detailed[x] == undefined) {
            detailed[x] = {};
        }
    }
}

function imAnEnemy(health = 0) {
    // hey you're an enemy cool
    makePath();
    resetCounts();
    ticks = 0;
    pathLength = trapLayout.length;

    damageTaken = 0; // Damage you've taken
    chilledFor = 0; // Chilled by Frost Trap
    frozenFor = 0; // Frozen by knowledge
    poisonStack = 0; // Current Poison Stack you have, will take damage at end of turn
    thisTurnDamage = 0;
    shockedFor = 0;
    addDamage = 0;
    var instaKill = false;

    for (var p = 0; p < pathLength; p++) {
        detailed[p].row = Math.floor(p / 5);
        detailed[p].killCount = 0;
        if (detailed[p].type == undefined) {
            detailed[p].type = path[p].type
        }
        if (chilledFor > 0 && frozenFor == 0) {
            detailed[p].chilled = true;
            chilledFor -= 1;
        } else {
            detailed[p].chilled = false;
        }
        if (frozenFor > 0 && chilledFor == 0) {
            detailed[p].frozen = true;
            frozenFor -= 1;
        } else {
            detailed[p].frozen = false;
        }
        if (strengthLocations[detailed[p].row]) {
            detailed[p].strengthed = true;
        } else {
            detailed[p].strengthed = false;
        }
        if (shockedFor > 0) {
            detailed[p].shocked = true;
        } else {
            detailed[p].shocked = false;
        }
        switch (detailed[p].type) {
            case "Empty":
                counts.empty++;
                break;
            case "Fire":
                counts.fire++;
                addDamage = calcFire(p, shockedFor);
                break;
            case "Frost":
                counts.frost++;
                addDamage = calcFrost(p);
                chilledFor = traps.frost.slow;
                if (detailed[p].shocked) chilledFor *= traps.lightning.effect;
                if (detailed[p].frozen) {
                    frozenFor = 0;
                    detailed[p].frozen = false;
                }
                break;
            case "Poison":
                counts.poison++;
                var toxy = calcPoison(p, shockedFor, health, damageTaken);
                addStack = toxy.stack;
                addDamage = toxy.damage;
                break;
            case "Lightning":
                counts.lightning++;
                shockedFor = traps.lightning.length;
                addDamage = calcLightning(p);
                break;
            case "Strength":
                counts.strength++;
                strengthLocations[detailed[p].row] = true;
                addDamage = calcStrength(p, shockedFor);
                break;
            case "Condenser":
                counts.condenser++;
                var condensed = calcCondenser(p, shockedFor);
                addDamage += poisonStack * condensed.damageFactor;
                poisonStack *= condensed.poisonMult;
                break;
            case "Knowledge":
                counts.knowledge++;
                if (detailed[p].chilled) {
                    chilledFor = 0;
                    frozenFor = traps.knowledge.slow;
                    if (detailed[p].shocked) frozenFor *= traps.lightning.effect;
                }
                break;
        }

        if (health != 0 && detailed[p].type == "Fire" && traps.fire.level >= 4 && damageTaken + addDamage > health * 0.8 && !instaKill) {
            addDamage += health * 0.2;
            instaKill = true;
        } else if (detailed[p].type != "Condenser") {
            // Condenser poison stack damage is complicated and is handled in the case statement above
            addDamage += poisonStack * multipleDamage(detailed[p], "poisonDamage");
        }

        detailed[p].addedPoison = addStack;
        detailed[p].poisonStacks = poisonStack;
        detailed[p].damageTaken = addDamage;
        detailed[p].allDamageTaken = damageTaken + addDamage;
        // turn new stacks into old stacks
        poisonStack += addStack;
        addStack = 0;
        ticks += 1;
        if ($("#hideExtra").is(":checked")) {
            innerHTML = "<div class = 'turnDamage'>" + prettify((addDamage * 100) / 100) + "</div>";
            icons = "<div class='icons'>";
            if (detailed[p].chilled && detailed[p].type != "Knowledge" && detailed[p].type != "Frost") {
                ticks += 1;
                icons += "C";
            }
            if (detailed[p].frozen && detailed[p].type != "Frost" && detailed[p].type != "Knowledge") {
                ticks += 2;
                icons += "F";
            }
            if (detailed[p].shocked || ((detailed[p].frozen || detailed[p].chilled) && detailed[p].type == "Lightning")) {
                repeat = 1;
                if (detailed[p].chilled && detailed[p].type != "Frost" && detailed[p].type != "Knowledge") {
                    if (detailed[p].type == "Lightning") repeat--;
                    repeat++;
                }
                if (detailed[p].frozen && detailed[p].type != "Frost" && detailed[p].type != "Knowledge") {
                    repeat += 2;
                    if (detailed[p].type == "Lightning") repeat--;
                }
                if (repeat > shockedFor && detailed[p].type != "Lightning") repeat = shockedFor;
                icons += "S".repeat(repeat);
            }
            if (instaKill && detailed[p].type == "Fire") {
                icons += "X";
            }
            innerHTML += icons + "</div>";
            if (p == 0) {
                innerHTML += direction;
            }
            path[p].innerHTML = innerHTML;
        } else {
            path[p].innerHTML = "";
        }

        // damage
        damageTaken += addDamage;
        addDamage = 0;

        shockedFor -= subtractShocks(p, shockedFor);
    }

    finalToxicity = poisonStack;

    if (health != 0) {
        estimatedMaxDifficulty(health);
    } else if (damageTaken == 0) {
        estimatedMaxDifficulty(0);
    }

    $("#allDamage").text(prettify(Math.round(damageTaken)));

    // turn new damage into old damage;
    return damageTaken;
}

function getMaxEnemyHP() {
    var lowerBound = 0;

    var testHP = imAnEnemy();
    while (testHP < damageByHealth(testHP)) {
        lowerBound = testHP;
        testHP *= 10;
    }
    var upperBound = testHP;

    var midPoint = 0;
    while (((upperBound - lowerBound) / lowerBound) > 0.0001 && upperBound > lowerBound + 1) {
        midPoint = lowerBound + ((upperBound - lowerBound) / 2);
        var newDamage = damageByHealth(midPoint);
        if (newDamage > midPoint) {
            lowerBound = midPoint;
        } else {
            upperBound = midPoint;
        }
    }

    return Math.floor(lowerBound);
}

function damageByHealth(hp, tally = false) {
    // Hello, my name is Inigo Montoya...
    var damageDealt = 0;
    var chilledFor = 0; // Chilled by Frost Trap
    var frozenFor = 0; // Frozen by knowledge
    var poisonStack = 0; // Current Poison Stack you have, will take damage at end of turn
    var shockedFor = 0;
    var addDamage = 0;

    slowsOnKill = 0;
    fireKill = false;
    var deadEnemy = false;

    for (var p = 0; p < trapLayout.length; p++) {
        if (!tally) {
            detailed[p].killCount = 0;
        }
        if (chilledFor > 0 && frozenFor == 0) {
            chilledFor -= 1;
        }
        if (frozenFor > 0 && chilledFor == 0) {
            frozenFor -= 1;
        }

        switch (detailed[p].type) {
            case "Fire":
                addDamage = calcFire(p, shockedFor);
                break;
            case "Frost":
                addDamage = calcFrost(p);
                chilledFor = traps.frost.slow;
                if (detailed[p].shocked) chilledFor = traps.frost.slow * traps.lightning.effect;
                if (detailed[p].frozen) {
                    frozenFor = 0;
                }
                break;
            case "Poison":
                var toxy = calcPoison(p, shockedFor, hp, damageDealt);
                addStack = toxy.stack;
                addDamage = toxy.damage;
                break;
            case "Lightning":
                shockedFor = traps.lightning.length;
                addDamage = calcLightning(p);
                break;
            case "Strength":
                addDamage = calcStrength(p, shockedFor);
                break;
            case "Condenser":
                var condensed = calcCondenser(p, shockedFor);
                addDamage += poisonStack * condensed.damageFactor;
                poisonStack *= condensed.poisonMult;
                break;
            case "Knowledge":
                if (detailed[p].chilled) {
                    chilledFor = 0;
                    frozenFor = traps.knowledge.slow;
                    if (detailed[p].shocked) frozenFor *= traps.lightning.effect;
                }
                break;
        }

        if (hp != 0 && detailed[p].type == "Fire" && traps.fire.level >= 4 && damageDealt + addDamage > hp * 0.8) {
            addDamage += hp * 0.2;
        } else if (detailed[p].type != "Condenser") {
            // Condenser poison stack damage is complicated and is handled in the case statement above
            addDamage += poisonStack * multipleDamage(detailed[p], "poisonDamage");
        }

        shockedFor -= subtractShocks(p, shockedFor);

        // turn new stacks into old stacks
        poisonStack += addStack;
        addStack = 0;

        // damage
        damageDealt += addDamage;
        addDamage = 0;

        if (tally) {
            if (hp > damageDealt) {
                if (detailed[p].type != "Knowledge" && detailed[p].type != "Frost") {
                    if (detailed[p].chilled) {
                        slowsOnKill++;
                    } else if (detailed[p].frozen) {
                        slowsOnKill += 2;
                    }
                }
            } else {
                if (!deadEnemy) {
                    deadEnemy = true;
                    detailed[p].killCount++
                    if (detailed[p].type == "Fire") {
                        fireKill = true;
                    }
                }
            }
        }
    }

    return damageDealt;
}

function calcFire(c, shocked) {
    var thisFireDamage = traps.fire.damage * traps.fire.coreMult * lightColMult(c);
    var thisAddDamage = thisFireDamage;
    if (detailed[c].shocked) thisAddDamage = thisFireDamage * traps.lightning.damageBuff * traps.lightning.coreMult;
    if (detailed[c].chilled || detailed[c].frozen) thisAddDamage += thisFireDamage * getLightningMultiplier(shocked, 1);
    if (detailed[c].frozen) thisAddDamage += thisFireDamage * getLightningMultiplier(shocked, 2);
    if (strengthLocations[detailed[c].row]) thisAddDamage *= traps.strength.effect * traps.strength.coreMult;
    if (detailed[c].chilled && traps.frost.level >= 3) thisAddDamage *= traps.frost.fireIncrease;
    return thisAddDamage;
}

function calcFrost(c) {
    return (detailed[c].shocked ? traps.frost.damage * traps.lightning.damageBuff * traps.lightning.coreMult : traps.frost.damage);
}

function calcPoison(c, shocked, hp, dmg) {
    var output = {};
    var lastCell = (c == trapLayout.length - 1);
    var baseStack = traps.poison.defaultStack * lightColMult(c);
    baseStack *= traps.poison.coreMult;

    if (traps.poison.level >= 3) {
        if (c > 0) {
            if (detailed[c - 1].type == "Poison") {
                baseStack *= 3;
            }
        }
        if (!lastCell) {
            if (detailed[c + 1].type == "Poison") {
                baseStack *= 3;
            }
        }
        if (hp != 0 && traps.poison.level >= 5 && dmg > 0.25 * hp) {
            baseStack *= 5;
        }
    }
    if (!lastCell) {
        if (traps.frost.level >= 4 && detailed[c + 1].type == "Frost") {
            baseStack *= 4;
        }
    }

    output.stack = baseStack;
    if (detailed[c].shocked) {
        output.stack *= traps.lightning.damageBuff * traps.lightning.coreMult;
    }
    output.damage = output.stack;
    if (detailed[c].chilled || detailed[c].frozen) {
        output.stack += baseStack * getLightningMultiplier(shocked, 1);
        output.damage += output.stack;
    }
    if (detailed[c].frozen) {
        output.stack += baseStack * getLightningMultiplier(shocked, 2);
        output.damage += output.stack;
    }

    return output;
}

function calcLightning(c) {
    var baseDamage = traps.lightning.damage * traps.lightning.coreMult;
    var shockMult = traps.lightning.damageBuff * traps.lightning.coreMult;
    var thisAddDamage = baseDamage;
    if (detailed[c].shocked) thisAddDamage *= shockMult;
    if (detailed[c].chilled || detailed[c].frozen) thisAddDamage += baseDamage * shockMult;
    if (detailed[c].frozen) thisAddDamage += baseDamage * shockMult;
    return thisAddDamage;
}

function calcStrength(c, shocked) {
    var strengthDamage = getStrengthDamage(detailed[c]);
    var thisAddDamage = strengthDamage;
    if (detailed[c].shocked) thisAddDamage = strengthDamage * traps.lightning.damageBuff * traps.lightning.coreMult;
    if (detailed[c].chilled || detailed[c].frozen) thisAddDamage += strengthDamage * getLightningMultiplier(shocked, 1);
    if (detailed[c].frozen) thisAddDamage += strengthDamage * getLightningMultiplier(shocked, 2);
    return thisAddDamage;
}

function calcCondenser(c, shocked) {
    var output = {};
    var thisBaseEffect = traps.condenser.effect;
    thisBaseEffect *= traps.condenser.coreMult;
    output.poisonMult = 1;
    if (detailed[c].shocked) {
        output.poisonMult *= (traps.lightning.effect * thisBaseEffect) + 1;
    } else {
        output.poisonMult *= thisBaseEffect + 1;
    }
    output.damageFactor = output.poisonMult;
    if (detailed[c].chilled || detailed[c].frozen) {
        output.poisonMult *= thisBaseEffect * getLightningMultiplier(shocked, 1, "condenser") + 1;
        output.damageFactor += output.poisonMult;
    }
    if (detailed[c].frozen) {
        output.poisonMult *= thisBaseEffect * getLightningMultiplier(shocked, 2, "condenser") + 1;
        output.damageFactor += output.poisonMult;
    }
    return output;
}

function subtractShocks(c, shocked) {
    var adjust = (shocked < 0 ? shocked : 0);
    if (shocked > 0 && detailed[c].type != "Lightning") {
        if (detailed[c].type != "Frost" && detailed[c].type != "Knowledge") {
            if (detailed[c].chilled) {
                adjust = 2;
            } else if (detailed[c].frozen) {
                adjust = 3;
            } else {
                adjust = 1;
            }
        } else {
            adjust = 1;
        }
    }
    return adjust;
}

function multipleDamage(index, type) {
    returnN = 0;
    if (index.type != "Frost" && index.type != "Knowledge") {
        if (index.frozen) {
            returnN += traps.knowledge.effect;
        } else if (index.chilled) {
            returnN += traps.frost.effect;
        }
    }
    if (index.shocked && (type != "poisonDamage")) {
        returnN += traps.lightning.effect;
    }

    if (returnN == 0) returnN = 1;
    return returnN;
}

function getStrengthDamage(data) {
    var rowStart = data.row * 5;
    var amountOfFire = 0;
    var returnDamage = traps.fire.damage * traps.fire.coreMult * traps.strength.effect * traps.strength.coreMult;
    for (var x = rowStart; x < rowStart + 5; x++) {
        if (path[x].type == "Fire") {
            amountOfFire += lightColMult(x);
        }
    }
    if (data.chilled && traps.frost.level >= 3) returnDamage *= traps.frost.fireIncrease;
    return returnDamage * amountOfFire;
}

function displayHeatMap() {
    if (damageTaken == undefined) return;
    damageByHealth(damageTaken, false); // reset kill counts
    var simResult = simThreat(damageTaken, finalToxicity, Number($("#maxDifficulty").text()));
    makePath();

    for (var p = 0; p < trapLayout.length; p++) {
        var percent = detailed[p].killCount / (simCount / 100);
        var intense = 0.5;
        var innerHTML = "";
        if (percent != 0) {
            innerHTML = "<div class='turnDamage'>" + percent + "%</div>";
            intense = Number(0.5 - (percent / 100) * 4).toPrecision(2);
            if (intense < 0) intense = 0;
        }
        if (p == 0) {
            innerHTML += direction;
        }
        var style = "width: 100%; height: 100%; vertical-align: bottom; z-index: 1; background-color: rgba(0,0,0," + intense + ")";
        innerHTML += "<div style='" + style + "'>&nbsp;</div>";
        path[p].innerHTML = innerHTML;
    }

    $('#simResults').html("Escaped enemies: " + simResult.escaped / (simCount / 100) + "%<br>Average Rs: " + prettify(simResult.rs) + "<br>Threat: " + Math.round(simResult.threat));
}

function getCostOfBuild(reason) {
    cost = 0;
    for (var x of typeOfTraps) {
        thisCost = traps[x].cost * (1 - (Math.pow(traps[x].increase, counts[x]))) / (1 - traps[x].increase);
        if (reason != "quick") {
            var innerBox = null;
            var typeName = " Trap ";
            if (towers.includes(x)) {
                innerBox = $('#' + x + 'Trap');
                typeName = " Tower ";
            } else {
                innerBox = $('#' + x + 'TrapText')
            }
            if (traps[x].locked) {
                innerBox.text("???");
            } else {
                innerBox.text(capitalizeFirstLetter(x) + typeName + romanNumeral(traps[x].level) + " (" + prettify(getNextCost(x, counts[x])) + ") ");
            }
        }
        cost += thisCost;
    }
    if (reason != "quick") {
        $("#costOfBuild").text(prettify(cost));
        if (rsChecker != 1e200) {
            if (cost < rsChecker) {
                $("#costOfBuild").removeClass("redText").addClass("greenText");
            } else {
                $("#costOfBuild").addClass("redText").removeClass("greenText");
            }
            $("#spareRs").text(prettify(rsChecker - cost));
        } else {
            $("#spareRs").text("");
        }
        if ($('#maxAutoRS').val() != Math.ceil(rsChecker)) {
            $('#maxAutoRS').val(Math.ceil(cost));
            displayRsLimit();
        }
    }
    return cost;
}

function displayRsLimit() {
    var inputVal = $('#maxAutoRS').val();
    $('#rsLimit').text("Crowdsource Rs limit: " + prettify(Math.round(inputVal)));
    $('#maxAutoRS').prop("step", Math.ceil(inputVal * 0.01));
}

// Developed with trial and error and curve fitting
// Maximum known error of ~15% (e.g. 29.6% vs 25.8% around 2,300 damage)
function escapePercent(damage) {
    var est = 0;
    if (damage < 1460) {
        est = (1 / 3);
    } else if (damage < 6880) {
        est = 0.96 - 0.086 * Math.log(damage);
    } else if (damage < 10000) {
        est = 0.2;
    } else {
        est = 1 / (Math.log(damage * 10) / Math.log(10));
    }
    return est;
}

function getHealthWith(difficulty, killPct) {
    var scaledMod = Math.pow(1.012, difficulty);
    var health = 10 + (difficulty * 4) + scaledMod;
    var difPct = 0.00053 * difficulty;
    if (difPct > 0.85) difPct = 0.85;
    if (difPct < 0.15) difPct = 0.15;
    // The (2/3) here an estimate for Math.random()
    var health = (health * (1 - difPct)) + (killPct * difPct * health);
    return Math.floor(health);
}

function estimatedMaxDifficulty(maxHealth) {
    damage = maxHealth;
    var killPct = 1 - escapePercent(maxHealth);
    var difficulty = 1;
    min = 1;
    max = 5000;
    do {
        if (damage == 0 || damage == null || damage == undefined) {
            break;
        }
        check = ((max + min) / 2);
        var health = getHealthWith(check, killPct);
        if (damage > health) {
            min = check;
        } else {
            max = check;
        }
        if (health <= damage && (damage - health) <= 1 || (max - min) <= 1) {
            difficulty = check;
            break;
        }
    } while (true);

    var avgReward = 0;
    var steps = 1000;
    for (var h = 0; h < steps; h++) {
        if (h / steps < killPct) {
            avgReward += getRsReward(getHealthWith(difficulty, h / steps), difficulty);
        } else if (traps.poison.level >= 6) {
            // Poison leaking bonus for escaped enemies
            avgReward += finalToxicity * 0.1;
        }
    }
    avgReward /= steps;
    avgReward *= traps.runestones.coreMult;

    $("#maxRS").text(prettify(avgReward));
    $("#maxDifficulty").text(prettify(Math.round(difficulty)));
    $("#enemyHealth").text(prettify(Math.round(maxHealth)));
    gotRows = getRows(difficulty);
    
    return {difficulty: difficulty, runestones: avgReward}
}

function getRsReward(health, threat) {
    reward = Math.ceil(health / 600);
    reward += threat / 20;
    reward *= Math.pow(1.00116, threat);
    if (detailed[trapLayout.length - 1].type == "Fire" && traps.fire.level >= 7) {
        reward *= 1.2;
    }
    if (traps.frost.level >= 5) {
        reward *= 1 + (ticks - trapLayout.length) * 0.02;
    }
    return reward;
}

function saveLoadout(number) {
    loadouts[number] = {};
    loadouts[number].detailed = JSON.parse(JSON.stringify(detailed));
    loadouts[number].traps = JSON.parse(JSON.stringify(traps));
    localStorage.setItem("loadouts", JSON.stringify(loadouts));
}

function getTrapLocalStorage() {
    if (localStorage.getItem("loadouts") == null) {
        return;
    } else {
        loadouts = JSON.parse(localStorage.getItem("loadouts"));
    }
}

function getRows(difficulty) {
    var maxRows = Math.floor((difficulty / 100));
    if (maxRows > 20) maxRows = 20;
    $("#maxRows").html(maxRows);
    return maxRows;
}
//annoying code from stackoverflow
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getNextCost(type, count) {
    return Math.floor(Math.pow(traps[type].increase, (count)) * traps[type].cost);
}

function changeTrapLevel(type, direction) {
    if (traps[type].locked) return;
    if (direction == "down" && (traps[type].level - 1) < 1) {
        return;
    }
    if (direction == "up" && (traps[type].level + 1) > traps[type].maxLevel) {
        return;
    }
    if (direction == "up") {
        traps[type].level++;
    }
    if (direction == "down") {
        traps[type].level--;
    }
    updateTrapDamage(type, traps[type].level);
}

function updateTrapDamage(type, level, noEnemy) {
    if (!upgradeableTraps.includes(type)) return;
    var selector = "." + capitalizeFirstLetter(type) + "TrapBox";
    var newTitle = "";
    traps[type].level = level;
    if (type == "fire") {
        traps.fire.damage = traps.fire.dmgs[level];
        newTitle += "Deals " + prettify(traps.fire.damage) + " damage. Hotkey: 1";
    }
    if (type == "frost") {
        traps.frost.damage = traps.frost.dmgs[level];
        traps.frost.slow = traps.frost.slows[level];
        newTitle += "Deals " + prettify(traps.frost.damage) + " damage. Slows for " + traps.frost.slow + " cells. Length increased " + traps.lightning.effect + "x by lightning. Hotkey: 2";
    }
    if (type == "poison") {
        traps.poison.defaultStack = traps.poison.stacks[level];
        newTitle += "Adds " + prettify(traps.poison.defaultStack) + " poison stacks. Hotkey: 3";
    }
    if (type == "lightning") {
        traps.lightning.damage = traps.lightning.dmgs[level];
        traps.lightning.damageBuff = traps.lightning.dmgbuffs[level];
        traps.lightning.length = traps.lightning.lengths[level];
        newTitle += "Deals " + prettify(traps.lightning.damage) + " damage. The next " + traps.lightning.length + " tick" + (traps.lightning.length == 1 ? " has " : "s have ") + traps.lightning.effect + "x the effect and " + traps.lightning.damageBuff + "x more damage. Hotkey: 4";
    }
    if (noEnemy != true) {
        runInformation();
        getCostOfUpgrades();
    }
    $("#trapSelector >" + selector).attr("title", newTitle);
}

function setLockedTraps() {
    // $("#spireRows").
    // game.global.highestLevelCleared + 1 >= nextUpgrade.unlockAt

    var rows = $("#spireRows").val();
    for (var x of lockableTraps) {
        traps[x].locked = true;
        if (x == "strength" && rows >= 2) {
            traps[x].locked = false;
        } else if (traps.frost.level >= 2) {
            if ((x == "poison" || x == "condenser") && rows >= 4 && (game.global == undefined || game.global.spiresCompleted >= 2)) {
                traps[x].locked = false;
            } else if ((x == "lightning" || x == "knowledge") && rows >= 6 && (game.global == undefined || game.global.spiresCompleted >= 3)) {
                traps[x].locked = false;
            }
        }
        updateLockedDisplay(x, traps[x].locked);
    }

    // Update text for box
    getCostOfBuild();
}

function updateLockedDisplay(type, locked) {
    var boxElem = $("#" + type + "Trap");
    if (boxElem.length < 1) return;
    if (locked) {
        boxElem[0].classList.add("DisabledBox");
        $('#' + type + 'Trap').attr("title", "Locked");
    } else {
        boxElem[0].classList.remove("DisabledBox");
        if (upgradeableTraps.includes(type)) {
            updateTrapDamage(type, traps[type].level, true);
        } else {
            switch (type) {
                case "strength":
                    $('#strengthTrap').attr("title", "Doubles damage of Fire traps in the same row. Deals damage like a Fire trap multiplied by the number of Fire traps in the row. Limit one per row. Hotkey: 5");
                    break;
                case "condenser":
                    $('#condenserTrap').attr("title", "Increases Poison Stack by 25%. Increases by 50% when affected by lightning. Hotkey: 6");
                    break;
                case "knowledge":
                    $('#knowledgeTrap').attr("title", "Chilled enemies become frozen for 5 cells. Length increased 2x by lightning. Hotkey: 7");
                    break;
            }
        }
    }
}

function getCostOfUpgrades() {
    upgradeCost = 0;
    for (var x of upgradeableTraps) {
        if (traps[x].level > 1) {
            length = traps[x].level + 1;
            for (var u = 0; length > u; u++) {
                upgradeCost += traps[x].upgrades[u];
            }
        }
    }
    $("#costOfUpgrades").text(prettify((upgradeCost)));
    return upgradeCost;
}

function getLightningMultiplier(length, times, type) {
    length -= times;
    if (length == 0 || length < 0) {
        return 1;
    } else if (length >= 1) {
        if (type == "condenser") {
            return traps.lightning.effect;
        } else {
            return traps.lightning.damageBuff * traps.lightning.coreMult;
        }
    }
}

function lightColMult(cell) {
    return traps.lightning.level >= 4 ? (1 + 0.1 * lightColStacks[cell % 5] * traps.lightning.coreMult) : 1;
}

function loadLoadout(location, data) {
    var oldSelected = selectedTrap;
    if (location == "save") {
        if (game.playerSpire.main.layout == null) return;
        var index = game.playerSpire.main.layout.length;
        for (var x = 0; index > x; x++) {
            selectedTrap = game.playerSpire.main.layout[x].trap.name;
            setTrap(x, true);
        }
        for (var t in game.playerSpire.traps) {
            updateTrapDamage(t.toLowerCase(), game.playerSpire.traps[t].level, true);
        }
    } else if (location == "preset") {
        if (data == null) return;
        workWith = data.detailed;
        length = workWith.length;
        $("#spireRows").val(length / 5);
        buildSpire();
        for (var p = 0; p < length; p++) {
            if (workWith[p] == undefined) continue;
            selectedTrap = workWith[p].type;
            setTrap(p, true);
        }
        for (var s of upgradeableTraps) {
            traps[s].level = data.traps[s].level;
            updateTrapDamage(s.toLowerCase(), traps[s].level, true);
        }
    }
    runInformation();
    getCostOfUpgrades();
    selectTrap(oldSelected);
}

function changeRows() {
    var oldSelect = selectedTrap;
    oldData = {};
    oldData.detailed = detailed;
    oldData.traps = traps;
    buildSpire();
    length = $("#spireRows").val() * 5;
    for (var p = 0; p < length; p++) {
        if (oldData.detailed[p] == undefined) continue;
        selectedTrap = oldData.detailed[p].type;
        setTrap(p, true);
    }
    for (var s of upgradeableTraps) {
        traps[s].level = oldData.traps[s].level;
        updateTrapDamage(s.toLowerCase(), traps[s].level, true);
    }
    runInformation();
    getCostOfUpgrades();
    selectedTrap = oldSelect;
}

// Credits to bhad for import backend bones
function importLayout(string) {
    var oldSelect = selectedTrap;

    if (isNaN(string.charAt(0))) return;
    firstSplit = string.split("+");
    if (firstSplit.length != 3) return;

    importedLayout = firstSplit[0].split("");
    importedTrapLevels = firstSplit[1].split("");
    importedRows = firstSplit[2];

    if (importedRows < 0 || importedRows > 20) return;
    if (importedLayout.length != importedRows * 5) return;
    if (importedTrapLevels.length != upgradeableTraps.length) return;

    document.getElementById("spireRows").value = importedRows; // sets rows from layout
    buildSpire();

    // sets Trap
    for (var x in importedLayout) {
        cell = Number(x);
        if (cell == NaN || exportIndexes[importedLayout[cell]] == undefined) continue;
        selectedTrap = exportIndexes[importedLayout[cell]];
        setTrap(cell, true);
    }
    // set Trap Levels
    for (var t in importedTrapLevels) {
        trapLevel = Number(importedTrapLevels[t]);
        if (trapLevel == NaN || upgradeableTraps[t] == undefined || importedTrapLevels[t] == undefined) continue;
        updateTrapDamage(upgradeableTraps[t], trapLevel, true);
    }

    runInformation();
    getCostOfUpgrades();
    selectedTrap = oldSelect;
}


// From trimps.js
function prettify(a) {
    var yourNotation = game.options.menu.standardNotation.enabled;
    var exDigit = 0;
    if ($("#extraPrecision").is(":checked"))
        exDigit = 1;
    notations = [
        [], "KMBTQaQiSxSpOcNoDcUdDdTdQadQidSxdSpdOdNdVUvDvTvQavQivSxvSpvOvNvTgUtgDtgTtgQatgQitgSxtgSptgOtgNtgQaaUqaDqaTqaQaqaQiqaSxqaSpqaOqaNqaQiaUqiDqiTqiQaqiQiqiSxqiSpqiOqiNqiSxaUsxDsxTsxQasxQisxSxsxSpsxOsxNsxSpaUspDspTspQaspQispSxspSpspOspNspOgUogDogTogQaogQiogSxogSpogOogNogNaUnDnTnQanQinSxnSpnOnNnCtUc".split(/(?=[A-Z])/), [], "a b c d e f g h i j k l m n o p q r s t u v w x y z aa ab ac ad ae af ag ah ai aj ak al am an ao ap aq ar as at au av aw ax ay az ba bb bc bd be bf bg bh bi bj bk bl bm bn bo bp bq br bs bt bu bv bw bx by bz ca cb cc cd ce cf cg ch ci cj ck cl cm cn co cp cq cr cs ct cu cv cw cx".split(" "), "KMBTQaQiSxSpOcNoDcUdDdTdQadQidSxdSpdOdNdVUvDvTvQavQivSxvSpvOvNvTg".split(/(?=[A-Z])/)
    ];
    if (0 > a)
        return "-" + prettify(-a);
    if (1e4 > a)
        return +a.toPrecision(4) + "";
    if ("0" === yourNotation)
        return a.toExponential(2 + exDigit).replace("+", "");
    for (var b = 0; a >= 999.5;)
        a /= 1e3,
            b++; // jshint ignore:line
    var c = notations[yourNotation || 1],
        d = b > c.length ? "e" + 3 * b : c[b - 1];
    return +a.toPrecision(3 + exDigit) + d;
}

function romanNumeral(number) {
    //This is only accurate up to 399, but that's more than plenty for this game. Probably not the cleanest converter ever, but I thought of it myself, it works, and I'm proud.
    var numeral = "";
    while (number >= 100) {
        number -= 100;
        numeral += "C";
    }
    //77
    if (number >= 90) {
        number -= 90;
        numeral += "XC";
    }
    if (number >= 50) {
        number -= 50;
        numeral += "L";
    }
    if (number >= 40) {
        number -= 40;
        numeral += "XL";
    }
    while (number >= 10) {
        number -= 10;
        numeral += "X";
    }
    if (number >= 9) {
        number -= 9;
        numeral += "IX";
    }
    if (number >= 5) {
        number -= 5;
        numeral += "V";
    }
    if (number >= 4) {
        number -= 4;
        numeral += "IV";
    }
    while (number >= 1) {
        number -= 1;
        numeral += "I";
    }
    return numeral;
}
