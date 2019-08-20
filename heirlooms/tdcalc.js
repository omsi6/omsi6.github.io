/* jshint esversion: 6 */

// from swaq/bhad (http://swaqvalley.com/td_calc/) with permission
// modified to suit the lack of visual needs
function startTDCalc() {
    buildSpire();
    loadLoadout();
}

let trapLayout;
let strengthLocations = [];
let lightColStacks = [0, 0, 0, 0, 0];
let path = [];
let selectedTrap = null;
let detailed = [{}];
let ticks = 0;
let slowsOnKill = 0;
let fireKill = false;
let finalToxicity = 0;
const upgradeableTraps = ["fire", "frost", "poison", "lightning"];

function buildSpire() {
    trapLayout = save.playerSpire.main.layout;
    strengthLocations = [];
    lightColStacks = [0, 0, 0, 0, 0];
    rows = save.playerSpire.main.rowsAllowed;
    detailed = [{}];
    path = [];
    makeDetailed();
}

function runInformation() {
    imAnEnemy();
    imAnEnemy(getMaxEnemyHP());
}

const modNamesToTraps = {
    fireTrap: "fire",
    poisonTrap: "poison",
    lightningTrap: "lightning",
    strengthEffect: "strength",
    condenserEffect: "condenser",
    runestones: "runestones",
};

function loadCore(core, overwrite, overwriteValue) {
    if (!core.isEmpty()) {
        // reset data
        traps.fire.coreMult = 1;
        traps.poison.coreMult = 1;
        traps.lightning.coreMult = 1;
        traps.strength.coreMult = 1;
        traps.condenser.coreMult = 1;
        traps.runestones.coreMult = 1;

        for (const mod of core.mods) {
            const bonus = mod[1];
            traps[modNamesToTraps[mod[0]]].coreMult = 1 + bonus / 100;
        }

        // overwrite lets you overwrite one of the core values, to make it easier to calc upg gain
        if (overwrite !== undefined) {
            traps[overwrite].coreMult = 1 + overwriteValue / 100;
        }
    }
}

function insertSelection(loc) {
    if (loc >= trapLayout.length || loc < 0) return;

    const insertType = selectedTrap;
    selectedTrap = "Empty";
    let first = 0;
    let last = -1;
    const newTraps = [];

    for (let i = 0; i < trapLayout.length; i++) {
        if (detailed[i].selected === undefined || detailed[i].selected === false) {
            if (first > last) {
                first++;
            } else {
                newTraps[newTraps.length] = null;
            }
        } else {
            last = i;
            newTraps[newTraps.length] = detailed[i].type;

            if (insertType === "Move") {
                setTrap(i);
            }
        }
    }

    if (last !== -1) {
        for (let e = 0; e < newTraps.length && e + loc < trapLayout.length && e <= last - first; e++) {
            if (newTraps[e] !== null) {
                // empty all cells first to clear any Strength towers
                setTrap(e + loc);
            }
        }

        // refresh detailed
        imAnEnemy();

        for (let n = 0; n < newTraps.length && n + loc < trapLayout.length && n <= last - first; n++) {
            selectedTrap = newTraps[n];
            setTrap(n + loc);
        }
    }

    runInformation();
}

function setTrap(number) {
    if (selectedTrap === null || selectedTrap === detailed[number].type) return false;

    const row = Math.floor(number / 5);
    if (strengthLocations[row] === true && selectedTrap === "Strength") {
        for (s = row * 5; s < (row + 1) * 5; s++) {
            if (detailed[s].type === "Strength") {
                selectedTrap = "Empty";
                setTrap(s);
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
        // fall through to default
        default:
            if (detailed[number].type === "Strength") {
                strengthLocations[row] = false;
            }
            break;
    }

    if (detailed[number].type === "Lightning" && lightColStacks[number % 5] > 0) {
        lightColStacks[number % 5]--;
    }

    detailed[number].selected = false;
    detailed[number].type = selectedTrap;
    return true;
}

function makePath() {
    const length = trapLayout.length;
    path = [];
    for (let x = 0; x < length; x++) {
        path.push({ type: save.playerSpire.main.layout[x].trap.name });
    }
}

const traps = {
    fire: {
        locked: false,
        damage: 50,
        level: 1,
        maxLevel: 8,
        dmgs: [0, 50, 500, 2500, 5e3, 10e3, 10e4, 10e5, 10e7],
        coreMult: 1
    },
    frost: {
        locked: false,
        damage: 10,
        slow: 3,
        effect: 2,
        level: 1,
        maxLevel: 6,
        fireIncrease: 1.25,
        dmgs: [0, 10, 50, 500, 2500, 5000, 25000],
        slows: [0, 3, 4, 4, 4, 4, 5],
    },
    poison: {
        locked: true,
        defaultStack: 5,
        level: 1,
        maxLevel: 7,
        stacks: [0, 5, 10, 10, 20, 40, 80, 160],
        coreMult: 1
    },
    lightning: {
        locked: true,
        damage: 50,
        effect: 2,
        length: 1,
        damageBuff: 2,
        level: 1,
        maxLevel: 6,
        dmgs: [0, 50, 500, 5000, 5000, 5e4, 5e5],
        dmgbuffs: [0, 2, 2, 4, 4, 4, 8],
        lengths: [0, 1, 2, 2, 2, 3, 3],
        coreMult: 1
    },
    strength: {
        locked: true,
        // 100%
        effect: 2,
        level: 1,
        maxLevel: 1,
        coreMult: 1
    },
    condenser: {
        locked: true,
        // 25%
        effect: 0.25,
        level: 1,
        maxLevel: 1,
        coreMult: 1
    },
    knowledge: {
        locked: true,
        slow: 5,
        effect: 3,
        level: 1,
        maxLevel: 1,
    },
    runestones: {
        coreMult: 1
    }
};

// create detailed
function makeDetailed() {
    for (let x = 0; x < 5 * save.playerSpire.main.rowsAllowed; x++) {
        if (detailed[x] === undefined) {
            detailed[x] = {};
        }
    }
}

function imAnEnemy(health = 0) {
    // hey you're an enemy cool
    makePath();
    ticks = 0;
    pathLength = trapLayout.length;

    // damage you've taken
    let damageTaken = 0;
    // chilled by Frost Trap
    let chilledFor = 0;
    // frozen by knowledge
    let frozenFor = 0;
    // current Poison Stack you have, will take damage at end of turn
    let poisonStack = 0;
    let shockedFor = 0;
    let addDamage = 0;
    let addStack = 0;
    let instaKill = false;

    let toxy;
    let condensed;

    for (let p = 0; p < pathLength; p++) {
        detailed[p].row = Math.floor(p / 5);
        detailed[p].killCount = 0;
        if (detailed[p].type === undefined) {
            detailed[p].type = path[p].type;
        }
        if (chilledFor > 0 && frozenFor === 0) {
            detailed[p].chilled = true;
            chilledFor -= 1;
        } else {
            detailed[p].chilled = false;
        }
        if (frozenFor > 0 && chilledFor === 0) {
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
                break;
            case "Fire":
                addDamage = calcFire(p, shockedFor);
                break;
            case "Frost":
                addDamage = calcFrost(p);
                chilledFor = traps.frost.slow;
                if (detailed[p].shocked) chilledFor *= traps.lightning.effect;
                if (detailed[p].frozen) {
                    frozenFor = 0;
                    detailed[p].frozen = false;
                }
                break;
            case "Poison":
                toxy = calcPoison(p, shockedFor, health, damageTaken);
                addStack = toxy.stack;
                addDamage = toxy.damage;
                break;
            case "Lightning":
                shockedFor = traps.lightning.length;
                addDamage = calcLightning(p);
                break;
            case "Strength":
                strengthLocations[detailed[p].row] = true;
                addDamage = calcStrength(p, shockedFor);
                break;
            case "Condenser":
                condensed = calcCondenser(p, shockedFor);
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

        if (health !== 0 && detailed[p].type === "Fire" && traps.fire.level >= 4 && damageTaken + addDamage > health * 0.8 && !instaKill) {
            addDamage += health * 0.2;
            instaKill = true;
        } else if (detailed[p].type !== "Condenser") {
            // condenser poison stack damage is complicated and is handled in the case statement above
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

        // damage
        damageTaken += addDamage;
        addDamage = 0;

        shockedFor -= subtractShocks(p, shockedFor);
    }

    finalToxicity = poisonStack;

    if (health !== 0) {
        estimatedMaxDifficulty(health);
    } else if (damageTaken === 0) {
        estimatedMaxDifficulty(0);
    }

    // turn new damage into old damage;
    return damageTaken;
}

function getMaxEnemyHP() {
    let lowerBound = 0;
    let testHP = imAnEnemy();
    while (testHP < damageByHealth(testHP)) {
        lowerBound = testHP;
        testHP *= 10;
    }

    let upperBound = testHP;
    let midPoint = 0;
    while (((upperBound - lowerBound) / lowerBound) > 0.0001 && upperBound > lowerBound + 1) {
        midPoint = lowerBound + ((upperBound - lowerBound) / 2);
        const newDamage = damageByHealth(midPoint);
        if (newDamage > midPoint) {
            lowerBound = midPoint;
        } else {
            upperBound = midPoint;
        }
    }

    return Math.floor(lowerBound);
}

function damageByHealth(hp, tally = false) {
    let damageDealt = 0;
    // chilled by Frost Trap
    let chilledFor = 0;
    // frozen by knowledge
    let frozenFor = 0;
    // current Poison Stack you have, will take damage at end of turn
    let poisonStack = 0;
    let shockedFor = 0;
    let addDamage = 0;
    let addStack = 0;

    slowsOnKill = 0;
    fireKill = false;
    let deadEnemy = false;

    let toxy;
    let condensed;

    for (let p = 0; p < trapLayout.length; p++) {
        if (!tally) {
            detailed[p].killCount = 0;
        }
        if (chilledFor > 0 && frozenFor === 0) {
            chilledFor -= 1;
        }
        if (frozenFor > 0 && chilledFor === 0) {
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
                toxy = calcPoison(p, shockedFor, hp, damageDealt);
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
                condensed = calcCondenser(p, shockedFor);
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

        if (hp !== 0 && detailed[p].type === "Fire" && traps.fire.level >= 4 && damageDealt + addDamage > hp * 0.8) {
            addDamage += hp * 0.2;
        } else if (detailed[p].type !== "Condenser") {
            // condenser poison stack damage is complicated and is handled in the case statement above
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
                if (detailed[p].type !== "Knowledge" && detailed[p].type !== "Frost") {
                    if (detailed[p].chilled) {
                        slowsOnKill++;
                    } else if (detailed[p].frozen) {
                        slowsOnKill += 2;
                    }
                }
            } else if (!deadEnemy) {
                deadEnemy = true;
                detailed[p].killCount++;
                if (detailed[p].type === "Fire") {
                    fireKill = true;
                }
            }
        }
    }

    return damageDealt;
}

function calcFire(c, shocked) {
    const thisFireDamage = traps.fire.damage * traps.fire.coreMult * lightColMult(c);
    let thisAddDamage = thisFireDamage;
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
    const output = {};
    const lastCell = (c === trapLayout.length - 1);
    let baseStack = traps.poison.defaultStack * lightColMult(c) * traps.poison.coreMult;

    if (traps.poison.level >= 3) {
        if (c > 0) {
            if (detailed[c - 1].type === "Poison") {
                baseStack *= 3;
            }
        }
        if (!lastCell) {
            if (detailed[c + 1].type === "Poison") {
                baseStack *= 3;
            }
        }
        if (hp !== 0 && traps.poison.level >= 5 && dmg > 0.25 * hp) {
            baseStack *= 5;
        }
    }
    if (!lastCell) {
        if (traps.frost.level >= 4 && detailed[c + 1].type === "Frost") {
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
    const baseDamage = traps.lightning.damage * traps.lightning.coreMult;
    const shockMult = traps.lightning.damageBuff * traps.lightning.coreMult;
    let thisAddDamage = baseDamage;
    if (detailed[c].shocked) thisAddDamage *= shockMult;
    if (detailed[c].chilled || detailed[c].frozen) thisAddDamage += baseDamage * shockMult;
    if (detailed[c].frozen) thisAddDamage += baseDamage * shockMult;
    return thisAddDamage;
}

function calcStrength(c, shocked) {
    const strengthDamage = getStrengthDamage(detailed[c]);
    let thisAddDamage = strengthDamage;
    if (detailed[c].shocked) thisAddDamage = strengthDamage * traps.lightning.damageBuff * traps.lightning.coreMult;
    if (detailed[c].chilled || detailed[c].frozen) thisAddDamage += strengthDamage * getLightningMultiplier(shocked, 1);
    if (detailed[c].frozen) thisAddDamage += strengthDamage * getLightningMultiplier(shocked, 2);
    return thisAddDamage;
}

function calcCondenser(c, shocked) {
    const output = {};
    const thisBaseEffect = traps.condenser.effect * traps.condenser.coreMult;
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
    let adjust = (shocked < 0 ? shocked : 0);
    if (shocked > 0 && detailed[c].type !== "Lightning") {
        if (detailed[c].type !== "Frost" && detailed[c].type !== "Knowledge") {
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
    let returnN = 0;
    if (index.type !== "Frost" && index.type !== "Knowledge") {
        if (index.frozen) {
            returnN += traps.knowledge.effect;
        } else if (index.chilled) {
            returnN += traps.frost.effect;
        }
    }
    if (index.shocked && (type !== "poisonDamage")) {
        returnN += traps.lightning.effect;
    }

    if (returnN === 0) returnN = 1;
    return returnN;
}

function getStrengthDamage(data) {
    const rowStart = data.row * 5;
    let returnDamage = traps.fire.damage * traps.fire.coreMult * traps.strength.effect * traps.strength.coreMult;
    let amountOfFire = 0;
    for (let x = rowStart; x < rowStart + 5; x++) {
        if (path[x].type === "Fire") {
            amountOfFire += lightColMult(x);
        }
    }
    if (data.chilled && traps.frost.level >= 3) returnDamage *= traps.frost.fireIncrease;
    return returnDamage * amountOfFire;
}

// developed with trial and error and curve fitting
// Maximum known error of ~15% (e.g. 29.6% vs 25.8% around 2,300 damage)
function escapePercent(damage) {
    let est = 0;
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
    const scaledMod = Math.pow(1.012, difficulty);
    let health = 10 + (difficulty * 4) + scaledMod;
    let difPct = 0.00053 * difficulty;
    if (difPct > 0.85) difPct = 0.85;
    if (difPct < 0.15) difPct = 0.15;
    // the (2/3) here an estimate for Math.random()
    health = (health * (1 - difPct)) + (killPct * difPct * health);
    return Math.floor(health);
}

function estimatedMaxDifficulty(maxHealth) {
    const damage = maxHealth;
    const killPct = 1 - escapePercent(maxHealth);
    let difficulty = 1;
    min = 1;
    max = 5000;
    while (true) {
        if (damage === 0 || damage === null || damage === undefined) {
            break;
        }
        check = ((max + min) / 2);
        const health = getHealthWith(check, killPct);
        if (damage > health) {
            min = check;
        } else {
            max = check;
        }
        if (health <= damage && (damage - health) <= 1 || (max - min) <= 1) {
            difficulty = check;
            break;
        }
    }

    let avgReward = 0;
    const steps = 1000;
    for (let h = 0; h < steps; h++) {
        if (h / steps < killPct) {
            avgReward += getRsReward(getHealthWith(difficulty, h / steps), difficulty);
        } else if (traps.poison.level >= 6) {
            // poison leaking bonus for escaped enemies
            avgReward += finalToxicity * 0.1;
        }
    }
    avgReward /= steps;
    avgReward *= traps.runestones.coreMult;
    
    return { difficulty, runestones: avgReward };
}

function getRsReward(health, threat) {
    reward = Math.ceil(health / 600);
    reward += threat / 20;
    reward *= Math.pow(1.00116, threat);
    if (detailed[trapLayout.length - 1].type === "Fire" && traps.fire.level >= 7) {
        reward *= 1.2;
    }
    if (traps.frost.level >= 5) {
        reward *= 1 + (ticks - trapLayout.length) * 0.02;
    }
    return reward;
}

function getRows(difficulty) {
    const maxRows = Math.min(Math.floor((difficulty / 100)), 20);
    return maxRows;
}

function updateTrapDamage(type, level, noEnemy) {
    if (!upgradeableTraps.includes(type)) return;
    traps[type].level = level;
    if (type === "fire") {
        traps.fire.damage = traps.fire.dmgs[level];
    }
    if (type === "frost") {
        traps.frost.damage = traps.frost.dmgs[level];
        traps.frost.slow = traps.frost.slows[level];
    }
    if (type === "poison") {
        traps.poison.defaultStack = traps.poison.stacks[level];
    }
    if (type === "lightning") {
        traps.lightning.damage = traps.lightning.dmgs[level];
        traps.lightning.damageBuff = traps.lightning.dmgbuffs[level];
        traps.lightning.length = traps.lightning.lengths[level];
    }
    if (noEnemy !== true) {
        runInformation();
    }
}

function getLightningMultiplier(length, times, type) {
    if (length - times === 0 || length - times < 0) {
        return 1;
    }
    if (length - times >= 1) {
        if (type === "condenser") {
            return traps.lightning.effect;
        } 
        return traps.lightning.damageBuff * traps.lightning.coreMult;
    }
    return 1;
}

function lightColMult(cell) {
    return traps.lightning.level >= 4 ? (1 + 0.1 * lightColStacks[cell % 5] * traps.lightning.coreMult) : 1;
}

function loadLoadout() {
    if (save.playerSpire.main.layout === null) return;
    const index = save.playerSpire.main.layout.length;
    for (let x = 0; index > x; x++) {
        selectedTrap = save.playerSpire.main.layout[x].trap.name;
        setTrap(x);
    }
    for (const trap in save.playerSpire.traps) {
        updateTrapDamage(trap.toLowerCase(), save.playerSpire.traps[trap].level, true);
    }
    runInformation();
}
