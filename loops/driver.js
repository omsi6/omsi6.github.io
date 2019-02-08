'use strict';

let gameSpeed = 1;
let baseManaPerSecond = 50;

let curTime = new Date();
let gameTicksLeft = 0;
let radarUpdateTime = 0;
let timeCounter = 0;

function getSpeedMult(zone) {
    if (isNaN(zone)) zone = curTown;
    var speedMult = 1;

    //dark ritual
    if (zone === 0 && getBuffLevel("Ritual") > 0) speedMult *= 1 + Math.min(getBuffLevel("Ritual"), 20) / 10;
    else if (zone === 1 && getBuffLevel("Ritual") > 20) speedMult *= 1 + Math.min(getBuffLevel("Ritual")-20, 20) / 20;
    else if (zone === 2 && getBuffLevel("Ritual") > 40) speedMult *= 1 + Math.min(getBuffLevel("Ritual")-40, 20) / 40;

    //chronomancy
    speedMult *= Math.pow(1 + getSkillLevel("Chronomancy") / 60, 0.25);

    return speedMult;
}

function getActualGameSpeed() {
    return gameSpeed * getSpeedMult() * bonusSpeed;
}

function tick() {
    let newTime = new Date();
    gameTicksLeft += newTime - curTime;
    radarUpdateTime += newTime - curTime;
    curTime = newTime;
    if(stop) {
        addOffline(gameTicksLeft * offlineRatio);
        gameTicksLeft = 0;
        return;
    }
    prevState.stats = JSON.parse(JSON.stringify(stats));

    while (gameTicksLeft > (1000 / baseManaPerSecond)) {
        if(gameTicksLeft > 2000) {
            window.fps /= 2;
            console.warn('too fast! (${gameTicksLeft})');
            statGraph.graphObject.options.animation.duration = 0;
            gameTicksLeft = 0;
        }
        if(stop) {
            return;
        }
        timer++;
        timeCounter += 1/baseManaPerSecond/getActualGameSpeed();

        actions.tick();
        for(let i = 0; i < dungeons.length; i++) {
            for(let j = 0; j < dungeons[i].length; j++) {
                let level = dungeons[i][j];
                if(level.ssChance < 1) {
                    level.ssChance += .0000001;
                    if(level.ssChance > 1) {
                        level.ssChance = 1;
                    }
                }
            }
        }

        if(shouldRestart || timer >= timeNeeded) {
            prepareRestart();
        }

        if(timer % (300*gameSpeed) === 0) {
            save();
        }
        gameTicksLeft -= ((1000 / baseManaPerSecond) / getActualGameSpeed());
        if(bonusSpeed > 1) {
            addOffline(-1 * (gameTicksLeft * ((bonusSpeed - 1)/bonusSpeed)) / getSpeedMult());
        }
    }

    if(radarUpdateTime > 1000) {
        view.updateStatGraphNeeded = true;
        radarUpdateTime -= 1000;
    }

    view.update();

}

function recalcInterval(fps) {
    window.fps = fps;
    if(mainTickLoop !== undefined) {
        clearInterval(mainTickLoop);
    }
    if(isFileSystem) {
        mainTickLoop = setInterval(tick, 1000/fps);
    } else {
        doWork.postMessage({stop: true});
        doWork.postMessage({start: true, ms: (1000 / fps)});
    }
}

function pauseGame() {
    stop = !stop;
    document.title = stop ? "*PAUSED* Idle Loops" : "Idle Loops";
    document.getElementById('pausePlay').innerHTML = _txt("time_controls>"+ (stop ? 'play_button' : 'pause_button'));
    if(!stop && (shouldRestart || timer >= timeNeeded)) {
        restart();
    }
}

function prepareRestart() {
    let curAction = actions.getNextValidAction();
    if(document.getElementById("pauseBeforeRestart").checked) {
        if(!curAction) {
            pauseGame();
        } else {
            actions.completedTicks += actions.getNextValidAction().ticks
            view.updateTotalTicks();
            pauseGame();
        }
    } else if(document.getElementById("pauseOnFailedLoop").checked) {
        if(actions.currentPos < actions.next.length-1) {
            if(!curAction) {
                pauseGame();
            } else {
                actions.completedTicks += actions.getNextValidAction().ticks
                view.updateTotalTicks();
                pauseGame();
            }
        } else {
            restart();
        }
    } else {
        restart();
    }
}

function restart() {
    shouldRestart = false;
    timer = 0;
    timeCounter = 0;
    timeNeeded = timeNeededInitial;
    document.title = "Idle Loops";
    if(initialGold) { //debugging only
        gold = initialGold;
        addGold(0);
    } else {
        addGold(-gold);
    }
    //items
    addReputation(-reputation);
    addSupplies(-supplies);
    addHerbs(-herbs);
    addHide(-hide);
    addPotions(-potions);
    addTeamNum(-teamNum);
    addArmor(-armor);
    addBlood(-blood);
    addArtifacts(-artifacts);
    //single items with icons
    addGlasses(-glasses);
    addPickaxe(-pickaxe);
    addLoopingPotion(-loopingPotion);
    restartStats();
    for(let i = 0; i < towns.length; i++) {
        towns[i].restart();
    }
    for(let i = 0; i < skillList.length; i++) {
        view.updateSkill(skillList[i]);
    }
    actions.restart();
    view.updateCurrentActionsDivs();
    // save();
}

function addActionToList(name, townNum, isTravelAction) {
    for(let i = 0; i < towns[townNum].totalActionList.length; i++) {
        let action = towns[townNum].totalActionList[i];
        if(action.name === name) {
            if(action.visible() && action.unlocked() && (!action.allowed || getNumOnList(action.name) < action.allowed())) {
                let addAmount = actions.addAmount;
                if(action.allowed) {
                    let numMax = action.allowed();
                    let numHave = getNumOnList(action.name);
                    if((numMax - numHave) < addAmount) {
                        addAmount = numMax - numHave;
                    }
                }
                if(isTravelAction) {
                    actionTownNum = townNum+1;
                    actions.addAction(name, 1);
                } else {
                    actions.addAction(name, addAmount);
                }
            }
        }
    }
    view.updateNextActions();
    view.updateLockedHidden();
}

//mana and gold

function addMana(amount) {
    timeNeeded += amount;
}

function addGold(amount) {
    gold += amount;
    view.updateGold();
}

//items

function addReputation(amount) {
    reputation += amount;
    view.updateReputation();
}

function addSupplies(amount) {
    supplies += amount;
    view.updateSupplies();
}

function addHerbs(amount) {
    herbs += amount;
    view.updateHerbs();
}

function addHide(amount) {
    hide += amount;
    view.updateHide();
}

function addPotions(amount) {
    potions += amount;
    view.updatePotions();
}

function addTeamNum(amount) {
    teamNum += amount;
    view.updateTeamNum();
    view.updateTeamCombat();
}

function addArmor(amount) {
    armor += amount;
    view.updateArmor();
    view.updateTeamCombat();
}

function addBlood(amount) {
    blood += amount;
    view.updateBlood();
}

function addArtifacts(amount) {
    artifacts += amount;
    view.updateArtifacts();
}

//single items with icons

function addPickaxe(amount) {
    pickaxe += amount;
    view.updatePickaxe();
}

function addGlasses(amount) {
    glasses += amount;
    view.updateGlasses();
}

function addLoopingPotion(amount) {
    loopingPotion += amount;
    view.updateLoopingPotion();
}

function changeActionAmount(amount, num) {
    actions.addAmount = amount;
    document.getElementById("amountCustom").value = amount
    view.updateAddAmount(num);
}

function setCustomActionAmount() {
    if (parseInt(document.getElementById("amountCustom").value) !== NaN) var value = parseInt(document.getElementById("amountCustom").value)
    else value = 1
    if (value >= 0 && value <= Number.MAX_VALUE) actions.addAmount = Math.min(value, 1e12)
    if (value === 1) {
        view.updateAddAmount(1);
    } else if (value === 5) {
        view.updateAddAmount(2);
    } else if (value === 10) {
        view.updateAddAmount(3);
    } else {
        view.updateAddAmount(0);
    }
}

function selectLoadout(num) {
    if(curLoadout === num) {
        curLoadout = 0;
    } else {
        curLoadout = num;
    }
    view.updateLoadout(curLoadout);
}

function saveList() {
    if(curLoadout === 0) {
        save();
        return;
    }
    if (isNaN(document.getElementById("amountCustom").value)) {
        if (document.getElementById("amountCustom").value.length > 30) {
            document.getElementById("amountCustom").value = "30 Letter Max";
        } else {
            loadoutnames[curLoadout-1] = document.getElementById("amountCustom").value;
        }
    } else {
        // If the loadout has already been saved under a non-numeric name
        // and the user tries to save under a numeric name, the loadout will
        // be saved under an old name.
        if (!isNaN(loadoutnames[curLoadout-1])) {
            // If both the old AND the new names are numeric, then we insist on a non-numeric name.
            document.getElementById("amountCustom").value = "Enter a name!";
        }
    }
    loadouts[curLoadout] = copyArray(actions.next);
    save();
    for (let i=0; i<5; i++) {
        document.getElementById("load"+(i+1)+"name").textContent = loadoutnames[i]
    }
}

function loadList() {
    if(curLoadout === 0) {
        return;
    }
    document.getElementById("amountCustom").value = actions.addAmount;
    if(!loadouts[curLoadout]) {
        actions.next = [];
    } else {
        actions.next = copyArray(loadouts[curLoadout]);
    }
    // view.updateCurrentActionsDivs();
    view.updateNextActions();
}

function clearList() {
    actions.next = [];
    view.updateNextActions();
}

function unlockTown(townNum) {
    if(townNum > maxTown) {
        maxTown = townNum;
        view.showTown(townNum); //refresh current
    }
    curTown = townNum;
}

function adjustAll() {
    adjustPots();
    adjustLocks();
    adjustSQuests();
    adjustLQuests();
    adjustWildMana();
    adjustHerbs();
    adjustHunt();
    adjustSuckers();
    adjustGeysers();
    adjustMineSoulstones();
    adjustArtifacts();
    view.adjustManaCost("Continue On");
}

function capAmount(index, townNum) {
    let varName = "good"+translateClassNames(actions.next[index].name).varName;
    let alreadyExisting = getNumOnList(actions.next[index].name)- actions.next[index].loops;
    let newLoops = towns[townNum][varName] - alreadyExisting;
    actions.next[index].loops = newLoops < 0 ? 0 : newLoops;
    view.updateNextActions();
}

function capTraining(index) {
    let alreadyExisting = getNumOnList(actions.next[index].name) - actions.next[index].loops;
    let newLoops = trainingLimits - alreadyExisting;
    actions.next[index].loops = newLoops < 0 ? 0 : newLoops;
    view.updateNextActions();
}

function addLoop(index) {
    let theClass = translateClassNames(actions.next[index].name);
    let addAmount = actions.addAmount;
    if(theClass.allowed) {
        let numMax = theClass.allowed();
        let numHave = getNumOnList(theClass.name);
        if((numMax - numHave) < addAmount) {
            addAmount = numMax - numHave;
        }
    }
    if (actions.next[index].loops + addAmount !== Infinity) actions.next[index].loops += addAmount;
    else actions.next[index].loops = 1e12;
    view.updateNextActions();
    view.updateLockedHidden();
}
function removeLoop(index) {
    actions.next[index].loops -= actions.addAmount;
    if(actions.next[index].loops < 0) {
        actions.next[index].loops = 0;
    }
    view.updateNextActions();
    view.updateLockedHidden();
}
function split(index) {
    const toSplit = actions.next[index];
    actions.addAction(toSplit.name, Math.ceil(toSplit.loops/2), index);
    toSplit.loops = Math.floor(toSplit.loops/2);
    view.updateNextActions();
}
function handleDragStart(event) {
    let index = event.target.getAttribute("data-index");
    draggedDecorate(index);
    event.dataTransfer.setData('text/html', index);
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDragDrop(event) {
    let indexOfDroppedOverElement = event.target.getAttribute("data-index");
    dragExitUndecorate(indexOfDroppedOverElement);
    let initialIndex = event.dataTransfer.getData("text/html");
    moveQueuedAction(initialIndex, indexOfDroppedOverElement);
}

function moveQueuedAction(initialIndex, resultingIndex) {
    initialIndex = Number(initialIndex);
    resultingIndex = Number(resultingIndex);
    if (initialIndex < 0 || initialIndex > actions.next.length || resultingIndex < 0 || resultingIndex > actions.next.length - 1) {
        return;
    }
    let difference = initialIndex - resultingIndex;
    if (difference === 0) {
        return;
    }

    let delta = Math.abs(difference);
   
    if (difference > 0) {
        for (let i = 0; i < delta; i++) {
            const temp = actions.next[initialIndex-i-1];
            actions.next[initialIndex-i-1] = actions.next[initialIndex-i];
            actions.next[initialIndex-i] = temp;
        }
    } else {
        for (let i = 0; i < delta; i++) {
            const temp = actions.next[initialIndex+i+1];
            actions.next[initialIndex+i+1] = actions.next[initialIndex+i];
            actions.next[initialIndex+i] = temp;
        }
    }
    
    view.updateNextActions();
}

function moveUp(index) {
    if(index <= 0) {
        return;
    }
    const temp = actions.next[index-1];
    actions.next[index-1] = actions.next[index];
    actions.next[index] = temp;
    view.updateNextActions();
}
function moveDown(index) {
    if(index >= actions.next.length - 1) {
        return;
    }
    const temp = actions.next[index+1];
    actions.next[index+1] = actions.next[index];
    actions.next[index] = temp;
    view.updateNextActions();
}
function removeAction(index) {
    let travelNum = getTravelNum(actions.next[index].name);
    if(travelNum) {
        actionTownNum = travelNum - 1;
    }

    actions.next.splice(index, 1);
    view.updateNextActions();
    view.updateLockedHidden();
}

function addOffline(num) {
    if(num) {
        if(totalOfflineMs + num < 0 && bonusSpeed > 1) {
            toggleOffline();
        }
        totalOfflineMs += num;
        if(totalOfflineMs < 0) {
            totalOfflineMs = 0;
        }
        document.getElementById("bonusSeconds").innerHTML = intToString(totalOfflineMs / 1000, 2);
    }
}

function toggleOffline() {
    if(bonusSpeed === 1) { //go fast
        bonusSpeed = 4;
        document.getElementById('isBonusOn').innerHTML = _txt("time_controls>bonus_seconds>state>on");
    } else { //take it slow
        bonusSpeed = 1;
        document.getElementById('isBonusOn').innerHTML = _txt("time_controls>bonus_seconds>state>off");
    }
}
