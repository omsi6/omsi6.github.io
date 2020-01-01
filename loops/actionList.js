"use strict";

function withoutSpaces(name) {
    return name.replace(/ /gu, '');
}

function translateClassNames(name) {
    // construct a new action object with appropriate prototype
    const nameWithoutSpaces = withoutSpaces(name);
    if (nameWithoutSpaces in Action) {
        return Object.create(Action[nameWithoutSpaces]);
    }
    console.log(`error trying to create ${name}`);
    return false;
}

const cappedActions = [
    "Smash Pots",
    "Pick Locks",
    "Short Quest",
    "Long Quest",
    "Gather Herbs",
    "Wild Mana",
    "Hunt",
    "Gamble",
    "Mana Geyser",
    "Mine Soulstones"
];
const trainingActions = [
    "Train Speed",
    "Train Strength",
    "Train Dexterity",
    "Sit By Waterfall",
    "Read Books",
    "Bird Watching"
];
function hasCap(name) {
    return cappedActions.includes(name);
}
function getTravelNum(name) {
    if (name === "Face Judgement" && resources.reputation <= 50) return 2;
    if (name === "Face Judgement" && resources.reputation >= 50) return 1;
    if (name === "Start Journey" || name === "Continue On" || name === "Start Trek" || name === "Fall From Grace") return 1;
    return 0;
}
function isTraining(name) {
    return trainingActions.includes(name);
}

function getXMLName(name) {
    return name.toLowerCase().replace(/ /gu, "_");
}

const townNames = ["Beginnersville", "Forest Path", "Merchanton", "Mt. Olympus", "Valhalla", "Adeptsville"];


// there are 4 types of actions
// 1: progress actions. progress actions have a progress bar and use 100,200,300,etc. leveling system (wander, meet people)
// 2: basic actions. basic actions have no additional UI (haggle, train strength)
// 3: multipart actions. multipart actions have multiple distinct parts to get through before repeating. they also get a bonus depending on how often you complete them

// exp mults are default 100%, 150% for skill training actions, 200% for actions that cost a resource, 300% for actions that cost 2 resources, and 500% for actions that cost soulstones
// todo: ^^ currently some actions are too high, but I am saving these balance changes for the z5/z6 update

// actions are all sorted below by town in order

function Action(name, extras) {
    this.name = name;
    // many actions have to override this (in extras) for save compatibility, because the
    // varName is often used in parts of the game state
    this.varName = withoutSpaces(name);
    Object.assign(this, extras);
}

/* eslint-disable no-invalid-this */
// not all actions have tooltip2 or labelDone, but among actions that do, the XML format is
// always the same; these are loaded lazily once (and then they become own properties of the
// specific Action object)
defineLazyGetter(Action.prototype, "tooltip", function() {
    return _txt(`actions>${getXMLName(this.name)}>tooltip`);
});
defineLazyGetter(Action.prototype, "tooltip2", function() {
    return _txt(`actions>${getXMLName(this.name)}>tooltip2`);
});
defineLazyGetter(Action.prototype, "label", function() {
    return _txt(`actions>${getXMLName(this.name)}>label`);
});
defineLazyGetter(Action.prototype, "labelDone", function() {
    return _txt(`actions>${getXMLName(this.name)}>label_done`);
});

// all actions to date with info text have the same info text, so presently this is
// centralized here (function will not be called by the game code if info text is not
// applicable)
Action.prototype.infoText = function() {
    return `${_txt(`actions>${getXMLName(this.name)}>info_text1`)}
            <i class='fa fa-arrow-left'></i>
            ${_txt(`actions>${getXMLName(this.name)}>info_text2`)}
            <i class='fa fa-arrow-left'></i>
            ${_txt(`actions>${getXMLName(this.name)}>info_text3`)}
            <br><span class='bold'>${`${_txt("actions>tooltip>total_found")}: `}</span><div id='total${this.varName}'></div>
            <br><span class='bold'>${`${_txt("actions>tooltip>total_checked")}: `}</span><div id='checked${this.varName}'></div>`;
};

// same as Action, but contains shared code to load segment names for multipart actions.
// (constructor takes number of segments as a second argument)
function MultipartAction(name, segments, extras) {
    Action.call(this, name, extras);
    this.segments = segments;
}
MultipartAction.prototype = Object.create(Action.prototype);
MultipartAction.prototype.constructor = MultipartAction;
// lazily calculate segment names when explicitly requested (to give chance for localization
// code to be loaded first)
defineLazyGetter(MultipartAction.prototype, 'segmentNames', function() {
    return Array.from(
        _txtsObj(`actions>${getXMLName(this.name)}>segment_names>name`)
    ).map(elt => elt.textContent);
});
MultipartAction.prototype.getSegmentName = function(segment) {
    return this.segmentNames[segment % this.segmentNames.length];
};
/* eslint-enable no-invalid-this */

// same as MultipartAction, but includes shared code to generate dungeon completion tooltip
// as well as specifying 7 segments (constructor takes dungeon ID number as a second
// argument)
function DungeonAction(name, dungeonNum, extras) {
    MultipartAction.call(this, name, 7, extras);
    this.dungeonNum = dungeonNum;
}
DungeonAction.prototype = Object.create(MultipartAction.prototype);
DungeonAction.prototype.constructor = DungeonAction;
DungeonAction.prototype.completedTooltip = function() {
    let ssDivContainer = "";
    for (let i = 0; i < dungeons[this.dungeonNum].length; i++) {
        ssDivContainer += `Floor ${i + 1} |
                            <div class='bold'>${_txt(`actions>${getXMLName(this.name)}>chance_label`)} </div> <div id='soulstoneChance${this.dungeonNum}_${i}'></div>% - 
                            <div class='bold'>${_txt(`actions>${getXMLName(this.name)}>last_stat_label`)} </div> <div id='soulstonePrevious${this.dungeonNum}_${i}'>NA</div> - 
                            <div class='bold'>${_txt(`actions>${getXMLName(this.name)}>label_done`)}</div> <div id='soulstoneCompleted${this.dungeonNum}_${i}'></div><br>`;
    }
    return _txt(`actions>${getXMLName(this.name)}>completed_tooltip`) + ssDivContainer;
};
DungeonAction.prototype.getPartName = function() {
    const floor = Math.floor((towns[this.townNum][`${this.varName}LoopCounter`] + 0.0001) / this.segments + 1);
    return `${_txt(`actions>${getXMLName(this.name)}>label_part`)} ${floor <= dungeons[this.dungeonNum].length ? numberToWords(floor) : _txt(`actions>${getXMLName(this.name)}>label_complete`)}`;
};


// town 1
Action.Wander = new Action("Wander", {
    expMult: 1,
    townNum: 0,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0].getLevel(this.varName) >= 20;
            case 2:
                return towns[0].getLevel(this.varName) >= 40;
            case 3:
                return towns[0].getLevel(this.varName) >= 60;
            case 4:
                return towns[0].getLevel(this.varName) >= 80;
            case 5:
                return towns[0].getLevel(this.varName) >= 100;
        }
        return false;
    },
    stats: {
        Per: 0.2,
        Con: 0.2,
        Cha: 0.2,
        Spd: 0.3,
        Luck: 0.1
    },
    affectedBy: ["Buy Glasses"],
    manaCost() {
        return 250;
    },
    visible() {
        return true;
    },
    unlocked() {
        return true;
    },
    finish() {
        towns[0].finishProgress(this.varName, 200 * (resources.glasses ? 4 : 1));
    }
});
function adjustPots() {
    towns[0].totalPots = towns[0].getLevel("Wander") * 5;
}
function adjustLocks() {
    towns[0].totalLocks = towns[0].getLevel("Wander");
}

Action.SmashPots = new Action("Smash Pots", {
    expMult: 1,
    townNum: 0,
    varName: "Pots",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0][`good${this.varName}`] >= 50;
        }
        return false;
    },
    stats: {
        Str: 0.2,
        Per: 0.2,
        Spd: 0.6
    },
    manaCost() {
        return Math.ceil(50 / (1 + getSkillLevel("Practical") / 100));
    },
    visible() {
        return true;
    },
    unlocked() {
        return true;
    },
    // note this name is misleading: it is used for mana and gold gain.
    goldCost() {
        return Math.floor(100 * Math.pow(1 + getSkillLevel("Dark") / 60, 0.25));
    },
    finish() {
        towns[0].finishRegular(this.varName, 10, () => {
            const manaGain = this.goldCost();
            addMana(manaGain);
            return manaGain;
        });
    }
});

Action.PickLocks = new Action("Pick Locks", {
    varName: "Locks",
    expMult: 1,
    townNum: 0,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0][`checked${this.varName}`] >= 1;
            case 2:
                return towns[0][`checked${this.varName}`] >= 50;
            case 3:
                return towns[0][`good${this.varName}`] >= 10;
        }
        return false;
    },
    stats: {
        Dex: 0.5,
        Per: 0.3,
        Spd: 0.1,
        Luck: 0.1
    },
    manaCost() {
        return 400;
    },
    visible() {
        return towns[0].getLevel("Wander") >= 3;
    },
    unlocked() {
        return towns[0].getLevel("Wander") >= 20;
    },
    goldCost() {
        let practical = getSkillLevel("Practical");
        practical = practical <= 200 ? practical : 200;
        return Math.floor(10 * (1 + practical / 100));
    },
    finish() {
        towns[0].finishRegular(this.varName, 10, () => {
            const goldGain = this.goldCost();
            addResource("gold", goldGain);
            return goldGain;
        });
    }
});

Action.BuyGlasses = new Action("Buy Glasses", {
    expMult: 1,
    townNum: 0,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.glassesBought;
        }
        return false;
    },
    stats: {
        Cha: 0.7,
        Spd: 0.3
    },
    allowed() {
        return 1;
    },
    canStart() {
        return resources.gold >= 10;
    },
    cost() {
        addResource("gold", -10);
    },
    manaCost() {
        return 50;
    },
    visible() {
        return towns[0].getLevel("Wander") >= 3;
    },
    unlocked() {
        return towns[0].getLevel("Wander") >= 20;
    },
    finish() {
        addResource("glasses", true);
        unlockStory("glassesBought");
    }
});

Action.BuyMana = new Action("Buy Mana", {
    expMult: 1,
    townNum: 0,
    stats: {
        Cha: 0.7,
        Int: 0.2,
        Luck: 0.1
    },
    manaCost() {
        return 100;
    },
    visible() {
        return towns[0].getLevel("Wander") >= 3;
    },
    unlocked() {
        return towns[0].getLevel("Wander") >= 20;
    },
    finish() {
        addMana(resources.gold * 50);
        resetResource("gold");
    },
});

Action.MeetPeople = new Action("Meet People", {
    expMult: 1,
    townNum: 0,
    varName: "Met",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0].getLevel(this.varName) >= 1;
            case 2:
                return towns[0].getLevel(this.varName) >= 20;
            case 3:
                return towns[0].getLevel(this.varName) >= 40;
            case 4:
                return towns[0].getLevel(this.varName) >= 60;
            case 5:
                return towns[0].getLevel(this.varName) >= 80;
            case 6:
                return towns[0].getLevel(this.varName) >= 100;
        }
        return false;
    },
    stats: {
        Int: 0.1,
        Cha: 0.8,
        Soul: 0.1
    },
    manaCost() {
        return 800;
    },
    visible() {
        return towns[0].getLevel("Wander") >= 10;
    },
    unlocked() {
        return towns[0].getLevel("Wander") >= 22;
    },
    finish() {
        towns[0].finishProgress(this.varName, 200);
    },
});
function adjustSQuests() {
    towns[0].totalSQuests = towns[0].getLevel("Met");
}

Action.TrainStrength = new Action("Train Strength", {
    expMult: 4,
    townNum: 0,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.strengthTrained;
            case 2:
                return getTalent("Str") >= 100;
            case 3:
                return getTalent("Str") >= 1000;
        }
        return false;
    },
    stats: {
        Str: 0.8,
        Con: 0.2
    },
    allowed() {
        return trainingLimits;
    },
    manaCost() {
        return 2000;
    },
    visible() {
        return towns[0].getLevel("Met") >= 1;
    },
    unlocked() {
        return towns[0].getLevel("Met") >= 5;
    },
    finish() {
        unlockStory("strengthTrained");
    },
});

Action.ShortQuest = new Action("Short Quest", {
    expMult: 1,
    townNum: 0,
    varName: "SQuests",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0][`checked${this.varName}`] >= 1;
            case 2:
                // 20 small quests in a loop
                return storyReqs.maxSQuestsInALoop;
        }
        return false;
    },
    stats: {
        Str: 0.2,
        Dex: 0.1,
        Cha: 0.3,
        Spd: 0.2,
        Luck: 0.1,
        Soul: 0.1
    },
    manaCost() {
        return 600;
    },
    visible() {
        return towns[0].getLevel("Met") >= 1;
    },
    unlocked() {
        return towns[0].getLevel("Met") >= 5;
    },
    goldCost() {
        let practical = Math.max(getSkillLevel("Practical") - 100, 0);
        practical = Math.min(practical, 200);
        return Math.floor(20 * (1 + practical / 100));
    },
    finish() {
        towns[0].finishRegular(this.varName, 5, () => {
            const goldGain = this.goldCost();
            addResource("gold", goldGain);
            return goldGain;
        });
        if (towns[0][`good${this.varName}`] >= 20 && towns[0][`goodTemp${this.varName}`] <= towns[0][`good${this.varName}`] - 20) unlockStory("maxSQuestsInALoop");
    },
});

Action.Investigate = new Action("Investigate", {
    expMult: 1,
    townNum: 0,
    varName: "Secrets",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0].getLevel(this.varName) >= 20;
            case 2:
                return towns[0].getLevel(this.varName) >= 40;
            case 3:
                return towns[0].getLevel(this.varName) >= 60;
            case 4:
                return towns[0].getLevel(this.varName) >= 80;
            case 5:
                return towns[0].getLevel(this.varName) >= 100;
        }
        return false;
    },
    stats: {
        Per: 0.3,
        Cha: 0.4,
        Spd: 0.2,
        Luck: 0.1
    },
    manaCost() {
        return 1000;
    },
    visible() {
        return towns[0].getLevel("Met") >= 5;
    },
    unlocked() {
        return towns[0].getLevel("Met") >= 25;
    },
    finish() {
        towns[0].finishProgress(this.varName, 500);
    },
});
function adjustLQuests() {
    towns[0].totalLQuests = Math.floor(towns[0].getLevel("Secrets") / 2);
}

Action.LongQuest = new Action("Long Quest", {
    expMult: 1,
    townNum: 0,
    varName: "LQuests",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0][`checked${this.varName}`] >= 1;
            case 2:
                // 10 long quests in a loop
                return storyReqs.maxLQuestsInALoop;
        }
        return false;
    },
    stats: {
        Str: 0.2,
        Int: 0.2,
        Con: 0.4,
        Spd: 0.2
    },
    manaCost() {
        return 1500;
    },
    visible() {
        return towns[0].getLevel("Secrets") >= 1;
    },
    unlocked() {
        const toUnlock = towns[0].getLevel("Secrets") >= 10;
        if (toUnlock && !isVisible(document.getElementById("skillList"))) {
            document.getElementById("skillList").style.display = "inline-block";
        }
        return toUnlock;
    },
    goldCost() {
        let practical = Math.max(getSkillLevel("Practical") - 200, 0);
        practical = Math.min(practical, 200);
        return Math.floor(30 * (1 + practical / 100));
    },
    finish() {
        towns[0].finishRegular(this.varName, 5, () => {
            addResource("reputation", 1);
            const goldGain = this.goldCost();
            addResource("gold", goldGain);
            return goldGain;
        });
        if (towns[0][`good${this.varName}`] >= 10 && towns[0][`goodTemp${this.varName}`] <= towns[0][`good${this.varName}`] - 10) unlockStory("maxLQuestsInALoop");
    },
});

Action.ThrowParty = new Action("Throw Party", {
    expMult: 2,
    townNum: 0,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.partyThrown;
        }
        return false;
    },
    stats: {
        Cha: 0.8,
        Soul: 0.2
    },
    manaCost() {
        return 1600;
    },
    canStart() {
        return resources.reputation >= 2;
    },
    cost() {
        addResource("reputation", -2);
    },
    visible() {
        return towns[0].getLevel("Secrets") >= 20;
    },
    unlocked() {
        return towns[0].getLevel("Secrets") >= 30;
    },
    finish() {
        towns[0].finishProgress("Met", 3200);
        unlockStory("partyThrown");
    },
});

Action.WarriorLessons = new Action("Warrior Lessons", {
    expMult: 1.5,
    townNum: 0,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return getSkillLevel("Combat") >= 1;
            case 2:
                return getSkillLevel("Combat") >= 100;
            case 3:
                return getSkillLevel("Combat") >= 200;
            case 4:
                return getSkillLevel("Combat") >= 250;
        }
        return false;
    },
    stats: {
        Str: 0.5,
        Dex: 0.3,
        Con: 0.2
    },
    skills: {
        Combat: 100
    },
    manaCost() {
        return 1000;
    },
    canStart() {
        return resources.reputation >= 2;
    },
    visible() {
        return towns[0].getLevel("Secrets") >= 10;
    },
    unlocked() {
        return towns[0].getLevel("Secrets") >= 20;
    },
    finish() {
        handleSkillExp(this.skills);
    },
});

Action.MageLessons = new Action("Mage Lessons", {
    expMult: 1.5,
    townNum: 0,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return getSkillLevel("Magic") >= 1;
            case 2:
                return getSkillLevel("Magic") >= 100;
            case 3:
                return getSkillLevel("Magic") >= 200;
            case 4:
                return getSkillLevel("Magic") >= 250;
            case 5:
                return getSkillLevel("Alchemy") >= 10;
            case 6:
                return getSkillLevel("Alchemy") >= 50;
            case 7:
                return getSkillLevel("Alchemy") >= 100;
        }
        return false;
    },
    stats: {
        Per: 0.3,
        Int: 0.5,
        Con: 0.2
    },
    skills: {
        Magic() {
            return 100 * (1 + getSkillLevel("Alchemy") / 100);
        }
    },
    manaCost() {
        return 1000;
    },
    canStart() {
        return resources.reputation >= 2;
    },
    visible() {
        return towns[0].getLevel("Secrets") >= 10;
    },
    unlocked() {
        return towns[0].getLevel("Secrets") >= 20;
    },
    finish() {
        handleSkillExp(this.skills);
    },
});

Action.HealTheSick = new MultipartAction("Heal The Sick", 3, {
    expMult: 1,
    townNum: 0,
    varName: "Heal",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0].totalHeal >= 1;
            case 2:
                // 10 patients healed in a loop
                return storyReqs.heal10PatientsInALoop;
            case 3:
                // fail reputation req
                return storyReqs.failedHeal;
        }
        return false;
    },
    stats: {
        Per: 0.2,
        Int: 0.2,
        Cha: 0.2,
        Soul: 0.4
    },
    skills: {
        Magic: 10
    },
    loopStats: ["Per", "Int", "Cha"],
    manaCost() {
        return 2500;
    },
    canStart() {
        return resources.reputation >= 1;
    },
    loopCost(segment) {
        return fibonacci(2 + Math.floor((towns[0].HealLoopCounter + segment) / this.segments + 0.0000001)) * 5000;
    },
    tickProgress(offset) {
        return getSkillLevel("Magic") * (1 + getLevel(this.loopStats[(towns[0].HealLoopCounter + offset) % this.loopStats.length]) / 100) * Math.sqrt(1 + towns[0].totalHeal / 100);
    },
    loopsFinished() {
        addResource("reputation", 3);
    },
    getPartName() {
        return `${_txt(`actions>${getXMLName(this.name)}>label_part`)} ${numberToWords(Math.floor((towns[0].HealLoopCounter + 0.0001) / this.segments + 1))}`;
    },
    visible() {
        return towns[0].getLevel("Secrets") >= 20;
    },
    unlocked() {
        return getSkillLevel("Magic") >= 12;
    },
    finish() {
        handleSkillExp(this.skills);
        if (towns[0].HealLoopCounter / 3 + 1 >= 10) unlockStory("heal10PatientsInALoop");
    },
});

Action.FightMonsters = new MultipartAction("Fight Monsters", 3, {
    expMult: 1,
    townNum: 0,
    varName: "Fight",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0].totalFight >= 1;
            case 2:
                return towns[0].totalFight >= 100;
            case 3:
                return towns[0].totalFight >= 500;
            case 4:
                return towns[0].totalFight >= 1000;
            case 5:
                return towns[0].totalFight >= 5000;
            case 6:
                return towns[0].totalFight >= 10000;
            case 7:
                return towns[0].totalFight >= 20000;
        }
        return false;
    },
    stats: {
        Str: 0.3,
        Spd: 0.3,
        Con: 0.3,
        Luck: 0.1
    },
    skills: {
        Combat: 10
    },
    loopStats: ["Spd", "Spd", "Spd", "Str", "Str", "Str", "Con", "Con", "Con"],
    manaCost() {
        return 2000;
    },
    canStart() {
        return resources.reputation >= 2;
    },
    loopCost(segment) {
        return fibonacci(Math.floor((towns[0].FightLoopCounter + segment) - towns[0].FightLoopCounter / 3 + 0.0000001)) * 10000;
    },
    tickProgress(offset) {
        return getSelfCombat() * (1 + getLevel(this.loopStats[(towns[0].FightLoopCounter + offset) % this.loopStats.length]) / 100) * Math.sqrt(1 + towns[0].totalFight / 100);
    },
    loopsFinished() {
        // empty
    },
    segmentFinished() {
        addResource("gold", 20);
    },
    getPartName() {
        const monster = Math.floor(towns[0].FightLoopCounter / 3 + 0.0000001);
        if (monster >= this.segmentNames.length) return this.altSegmentNames[monster % 3];
        return this.segmentNames[monster];
    },
    getSegmentName(segment) {
        return `${this.segmentModifiers[segment % 3]} ${this.getPartName()}`;
    },
    visible() {
        return towns[0].getLevel("Secrets") >= 20;
    },
    unlocked() {
        return getSkillLevel("Combat") >= 10;
    },
    finish() {
        handleSkillExp(this.skills);
    },
});
// lazily loaded to allow localization code to load first
defineLazyGetter(Action.FightMonsters, "altSegmentNames",
    () => Array.from(_txtsObj("actions>fight_monsters>segment_alt_names>name"))
               .map(elt => elt.textContent));
defineLazyGetter(Action.FightMonsters, "segmentModifiers",
    () => Array.from(_txtsObj("actions>fight_monsters>segment_modifiers>segment_modifier"))
               .map(elt => elt.textContent));

Action.SmallDungeon = new DungeonAction("Small Dungeon", 0, {
    expMult: 1,
    townNum: 0,
    varName: "SDungeon",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.smallDungeonAttempted;
            case 2:
                return towns[0][`total${this.varName}`] >= 1000;
            case 3:
                return towns[0][`total${this.varName}`] >= 5000;
            case 4:
                return towns[0][`total${this.varName}`] >= 10000;
            case 5:
                return storyReqs.clearSDungeon;
        }
        return false;
    },
    stats: {
        Str: 0.1,
        Dex: 0.4,
        Con: 0.3,
        Cha: 0.1,
        Luck: 0.1
    },
    skills: {
        Combat: 5,
        Magic: 5
    },
    loopStats: ["Dex", "Con", "Dex", "Cha", "Dex", "Str", "Luck"],
    manaCost() {
        return 2000;
    },
    canStart() {
        const curFloor = Math.floor((towns[this.townNum].SDungeonLoopCounter) / this.segments + 0.0000001);
        return resources.reputation >= 2 && curFloor < dungeons[this.dungeonNum].length;
    },
    loopCost(segment) {
        return precision3(Math.pow(2, Math.floor((towns[this.townNum].SDungeonLoopCounter + segment) / this.segments + 0.0000001)) * 15000);
    },
    tickProgress(offset) {
        const floor = Math.floor((towns[this.townNum].SDungeonLoopCounter) / this.segments + 0.0000001);
        return (getSelfCombat() + getSkillLevel("Magic")) * (1 + getLevel(this.loopStats[(towns[this.townNum].SDungeonLoopCounter + offset) % this.loopStats.length]) / 100) * Math.sqrt(1 + dungeons[this.dungeonNum][floor].completed / 200);
    },
    loopsFinished() {
        const curFloor = Math.floor((towns[this.townNum].SDungeonLoopCounter) / this.segments + 0.0000001 - 1);
        const success = finishDungeon(this.dungeonNum, curFloor);
        if (success === true && storyMax <= 1) {
            unlockGlobalStory(1);
        } else if (success === false && storyMax <= 2) {
            unlockGlobalStory(2);
        }
    },
    visible() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 15;
    },
    unlocked() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    },
    finish() {
        handleSkillExp(this.skills);
        unlockStory("smallDungeonAttempted");
        if (towns[0].SDungeonLoopCounter >= 42) unlockStory("clearSDungeon");
    },
});
function finishDungeon(dungeonNum, floorNum) {
    const floor = dungeons[dungeonNum][floorNum];
    if (!floor) {
        return false;
    }
    floor.completed++;
    const rand = Math.random();
    if (rand <= floor.ssChance) {
        const statToAdd = statList[Math.floor(Math.random() * statList.length)];
        floor.lastStat = statToAdd;
        stats[statToAdd].soulstone = stats[statToAdd].soulstone ? (stats[statToAdd].soulstone + Math.pow(10, dungeonNum)) : 1;
        floor.ssChance *= 0.98;
        view.updateSoulstones();
        return true;
    }
    return false;
}

Action.BuySupplies = new Action("Buy Supplies", {
    expMult: 1,
    townNum: 0,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.suppliesBought;
            case 2:
                return storyReqs.suppliesBoughtWithoutHaggling;
        }
        return false;
    },
    stats: {
        Cha: 0.8,
        Luck: 0.1,
        Soul: 0.1
    },
    allowed() {
        return 1;
    },
    manaCost() {
        return 200;
    },
    canStart() {
        return resources.gold >= towns[0].suppliesCost && !resources.supplies;
    },
    cost() {
        addResource("gold", -towns[0].suppliesCost);
    },
    visible() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 15;
    },
    unlocked() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    },
    finish() {
        addResource("supplies", true);
        if (towns[0].suppliesCost === 300) unlockStory("suppliesBoughtWithoutHaggling");
        unlockStory("suppliesBought");
    },
});

Action.Haggle = new Action("Haggle", {
    expMult: 1,
    townNum: 0,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.haggle;
            case 2:
                return storyReqs.haggle15TimesInALoop;
            case 3:
                return storyReqs.haggle16TimesInALoop;
        }
        return false;
    },
    stats: {
        Cha: 0.8,
        Luck: 0.1,
        Soul: 0.1
    },
    manaCost() {
        return 100;
    },
    canStart() {
        return resources.reputation >= 1;
    },
    cost() {
        addResource("reputation", -1);
    },
    visible() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 15;
    },
    unlocked() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    },
    finish() {
        if (towns[0].suppliesCost === 20) unlockStory("haggle15TimesInALoop");
        else if (towns[0].suppliesCost === 0) unlockStory("haggle16TimesInALoop");
        towns[0].suppliesCost -= 20;
        if (towns[0].suppliesCost < 0) {
            towns[0].suppliesCost = 0;
        }
        view.updateResource("supplies");
        unlockStory("haggle");
    },
});

Action.StartJourney = new Action("Start Journey", {
    expMult: 2,
    townNum: 0,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].unlocked;
        }
        return false;
    },
    stats: {
        Con: 0.4,
        Per: 0.3,
        Spd: 0.3
    },
    allowed() {
        return 1;
    },
    manaCost() {
        return 1000;
    },
    canStart() {
        return resources.supplies;
    },
    cost() {
        addResource("supplies", false);
    },
    visible() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 15;
    },
    unlocked() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    },
    finish() {
        unlockTown(1);
    },
});

Action.OpenRift = new Action("Open Rift", {
    expMult: 1,
    townNum: 0,
    stats: {
        Int: 0.2,
        Luck: 0.1,
        Soul: 0.7
    },
    allowed() {
        return 1;
    },
    manaCost() {
        return 100000;
    },
    visible() {
        return (getSkillLevel("Dark") >= 100 && getSkillLevel("Magic")) >= 15;
    },
    unlocked() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    },
    finish() {
        unlockTown(1);
    },
});

// town 2
Action.ExploreForest = new Action("Explore Forest", {
    expMult: 1,
    townNum: 1,
    varName: "Forest",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].getLevel(this.varName) >= 1;
            case 2:
                return towns[1].getLevel(this.varName) >= 10;
            case 3:
                return towns[1].getLevel(this.varName) >= 20;
            case 4:
                return towns[1].getLevel(this.varName) >= 40;
            case 5:
                return towns[1].getLevel(this.varName) >= 50;
            case 6:
                return towns[1].getLevel(this.varName) >= 60;
            case 7:
                return towns[1].getLevel(this.varName) >= 80;
            case 8:
                return towns[1].getLevel(this.varName) >= 100;
        }
        return false;
    },
    stats: {
        Per: 0.4,
        Con: 0.2,
        Spd: 0.2,
        Luck: 0.2
    },
    affectedBy: ["Buy Glasses"],
    manaCost() {
        return 400;
    },
    visible() {
        return true;
    },
    unlocked() {
        return true;
    },
    finish() {
        towns[1].finishProgress(this.varName, 100 * (resources.glasses ? 2 : 1));
    },
});
function adjustWildMana() {
    towns[1].totalWildMana = towns[1].getLevel("Forest") * 5 + towns[1].getLevel("Thicket") * 5;
}
function adjustHunt() {
    towns[1].totalHunt = towns[1].getLevel("Forest") * 2;
}
function adjustHerbs() {
    towns[1].totalHerbs = towns[1].getLevel("Forest") * 5 + towns[1].getLevel("Shortcut") * 2 + towns[1].getLevel("Flowers") * 13;
}

Action.WildMana = new Action("Wild Mana", {
    expMult: 1,
    townNum: 1,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1][`checked${this.varName}`] >= 1;
        }
        return false;
    },
    stats: {
        Con: 0.2,
        Int: 0.6,
        Soul: 0.2
    },
    manaCost() {
        return Math.ceil(150 / (1 + getSkillLevel("Practical") / 100));
    },
    visible() {
        return true;
    },
    unlocked() {
        return towns[1].getLevel("Forest") >= 2;
    },
    goldCost() {
        return Math.floor(250 * Math.pow(1 + getSkillLevel("Dark") / 60, 0.25));
    },
    finish() {
        towns[1].finishRegular(this.varName, 10, () => {
            const manaGain = this.goldCost();
            addMana(manaGain);
            return manaGain;
        });
    }
});

Action.GatherHerbs = new Action("Gather Herbs", {
    expMult: 1,
    townNum: 1,
    varName: "Herbs",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1][`checked${this.varName}`] >= 1;
        }
        return false;
    },
    stats: {
        Str: 0.4,
        Dex: 0.3,
        Int: 0.3
    },
    manaCost() {
        return Math.ceil(200 * (1 - towns[1].getLevel("Hermit") * 0.005));
    },
    visible() {
        return towns[1].getLevel("Forest") >= 2;
    },
    unlocked() {
        return towns[1].getLevel("Forest") >= 10;
    },
    finish() {
        towns[1].finishRegular(this.varName, 10, () => {
            addResource("herbs", 1);
            return 1;
        });
    },
});

Action.Hunt = new Action("Hunt", {
    expMult: 1,
    townNum: 1,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1][`checked${this.varName}`] >= 1;
            case 2:
                return towns[1][`good${this.varName}`] >= 10;
            case 3:
                return towns[1][`good${this.varName}`] >= 20;
        }
        return false;
    },
    stats: {
        Dex: 0.2,
        Con: 0.2,
        Per: 0.2,
        Spd: 0.4
    },
    manaCost() {
        return 800;
    },
    visible() {
        return towns[1].getLevel("Forest") >= 10;
    },
    unlocked() {
        return towns[1].getLevel("Forest") >= 40;
    },
    finish() {
        towns[1].finishRegular(this.varName, 10, () => {
            addResource("hide", 1);
            return 1;
        });
    },
});

Action.SitByWaterfall = new Action("Sit By Waterfall", {
    expMult: 4,
    townNum: 1,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.satByWaterfall;
        }
        return false;
    },
    stats: {
        Con: 0.2,
        Soul: 0.8
    },
    allowed() {
        return trainingLimits;
    },
    manaCost() {
        return 2000;
    },
    visible() {
        return towns[1].getLevel("Forest") >= 10;
    },
    unlocked() {
        return towns[1].getLevel("Forest") >= 70;
    },
    finish() {
        unlockStory("satByWaterfall");
    },
});

Action.OldShortcut = new Action("Old Shortcut", {
    expMult: 1,
    townNum: 1,
    varName: "Shortcut",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].getLevel(this.varName) >= 1;
            case 2:
                return towns[1].getLevel(this.varName) >= 10;
            case 3:
                return towns[1].getLevel(this.varName) >= 20;
            case 4:
                return towns[1].getLevel(this.varName) >= 40;
            case 5:
                return towns[1].getLevel(this.varName) >= 60;
            case 6:
                return towns[1].getLevel(this.varName) >= 80;
            case 7:
                return towns[1].getLevel(this.varName) >= 100;
        }
        return false;
    },
    stats: {
        Per: 0.3,
        Con: 0.4,
        Spd: 0.2,
        Luck: 0.1
    },
    manaCost() {
        return 800;
    },
    visible() {
        return true;
    },
    unlocked() {
        return towns[1].getLevel("Forest") >= 20;
    },
    finish() {
        towns[1].finishProgress(this.varName, 100);
        view.adjustManaCost("Continue On");
    },
});

Action.TalkToHermit = new Action("Talk To Hermit", {
    expMult: 1,
    townNum: 1,
    varName: "Hermit",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].getLevel(this.varName) >= 1;
            case 2:
                return towns[1].getLevel(this.varName) >= 10;
            case 3:
                return towns[1].getLevel(this.varName) >= 20;
            case 4:
                return towns[1].getLevel(this.varName) >= 40;
            case 5:
                return towns[1].getLevel(this.varName) >= 60;
            case 6:
                return towns[1].getLevel(this.varName) >= 80;
            case 7:
                return towns[1].getLevel(this.varName) >= 100;
        }
        return false;
    },
    stats: {
        Con: 0.5,
        Cha: 0.3,
        Soul: 0.2
    },
    manaCost() {
        return 1200;
    },
    visible() {
        return true;
    },
    unlocked() {
        return towns[1].getLevel("Shortcut") >= 20 && getSkillLevel("Magic") >= 40;
    },
    finish() {
        towns[1].finishProgress(this.varName, 50 * (1 + towns[1].getLevel("Shortcut") / 100));
        view.adjustManaCost("Learn Alchemy");
        view.adjustManaCost("Gather Herbs");
        view.adjustManaCost("Practical Magic");
    },
});

Action.PracticalMagic = new Action("Practical Magic", {
    expMult: 1.5,
    townNum: 1,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return getSkillLevel("Practical") >= 1;
        }
        return false;
    },
    stats: {
        Per: 0.3,
        Con: 0.2,
        Int: 0.5
    },
    skills: {
        Practical: 100
    },
    manaCost() {
        return Math.ceil(4000 * (1 - towns[1].getLevel("Hermit") * 0.005));
    },
    visible() {
        return towns[1].getLevel("Hermit") >= 10;
    },
    unlocked() {
        return towns[1].getLevel("Hermit") >= 20 && getSkillLevel("Magic") >= 50;
    },
    finish() {
        handleSkillExp(this.skills);
        view.adjustManaCost("Wild Mana");
        view.adjustManaCost("Smash Pots");
        view.adjustGoldCosts();
    },
});

Action.LearnAlchemy = new Action("Learn Alchemy", {
    expMult: 1.5,
    townNum: 1,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return skills.Alchemy.exp >= 50;
            case 2:
                return getSkillLevel("Alchemy") >= 25;
            case 3:
                return getSkillLevel("Alchemy") >= 50;
        }
        return false;
    },
    stats: {
        Con: 0.3,
        Per: 0.1,
        Int: 0.6
    },
    skills: {
        Magic: 50,
        Alchemy: 50
    },
    canStart() {
        return resources.herbs >= 10;
    },
    cost() {
        addResource("herbs", -10);
    },
    manaCost() {
        return Math.ceil(5000 * (1 - towns[1].getLevel("Hermit") * 0.005));
    },
    visible() {
        return towns[1].getLevel("Hermit") >= 10;
    },
    unlocked() {
        return towns[1].getLevel("Hermit") >= 40 && getSkillLevel("Magic") >= 60;
    },
    finish() {
        handleSkillExp(this.skills);
        view.adjustExpGain(Action.MageLessons);
    },
});

Action.BrewPotions = new Action("Brew Potions", {
    expMult: 1.5,
    townNum: 1,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.potionBrewed;
            case 2:
                return storyReqs.failedBrewPotions;
            case 3:
                return storyReqs.failedBrewPotionsNegativeRep;
        }
        return false;
    },
    stats: {
        Dex: 0.3,
        Int: 0.6,
        Luck: 0.1,
    },
    skills: {
        Magic: 50,
        Alchemy: 25
    },
    canStart() {
        return resources.herbs >= 10 && resources.reputation >= 5;
    },
    cost() {
        addResource("herbs", -10);
    },
    manaCost() {
        return Math.ceil(4000);
    },
    visible() {
        return getSkillLevel("Alchemy") >= 1;
    },
    unlocked() {
        return getSkillLevel("Alchemy") >= 10;
    },
    finish() {
        addResource("potions", 1);
        handleSkillExp(this.skills);
        unlockStory("potionBrewed");
    },
});

Action.TrainDexterity = new Action("Train Dexterity", {
    expMult: 4,
    townNum: 1,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.dexterityTrained;
        }
        return false;
    },
    stats: {
        Dex: 0.8,
        Con: 0.2
    },
    allowed() {
        return trainingLimits;
    },
    manaCost() {
        return 2000;
    },
    visible() {
        return towns[1].getLevel("Forest") >= 20;
    },
    unlocked() {
        return towns[1].getLevel("Forest") >= 60;
    },
    finish() {
        unlockStory("dexterityTrained");
    },
});

Action.TrainSpeed = new Action("Train Speed", {
    expMult: 4,
    townNum: 1,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.speedTrained;
        }
        return false;
    },
    stats: {
        Spd: 0.8,
        Con: 0.2
    },
    allowed() {
        return trainingLimits;
    },
    manaCost() {
        return 2000;
    },
    visible() {
        return towns[1].getLevel("Forest") >= 20;
    },
    unlocked() {
        return towns[1].getLevel("Forest") >= 80;
    },
    finish() {
        unlockStory("speedTrained");
    },
});

Action.FollowFlowers = new Action("Follow Flowers", {
    expMult: 1,
    townNum: 1,
    varName: "Flowers",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].getLevel(this.varName) >= 1;
            case 2:
                return towns[1].getLevel(this.varName) >= 10;
            case 3:
                return towns[1].getLevel(this.varName) >= 20;
            case 4:
                return towns[1].getLevel(this.varName) >= 40;
            case 5:
                return towns[1].getLevel(this.varName) >= 60;
            case 6:
                return towns[1].getLevel(this.varName) >= 80;
            case 7:
                return towns[1].getLevel(this.varName) >= 100;
        }
        return false;
    },
    stats: {
        Per: 0.7,
        Con: 0.1,
        Spd: 0.2
    },
    affectedBy: ["Buy Glasses"],
    manaCost() {
        return 300;
    },
    visible() {
        return towns[1].getLevel("Forest") >= 30;
    },
    unlocked() {
        return towns[1].getLevel("Forest") >= 50;
    },
    finish() {
        towns[1].finishProgress(this.varName, 100 * (resources.glasses ? 2 : 1));
    },
});

Action.BirdWatching = new Action("Bird Watching", {
    expMult: 4,
    townNum: 1,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.birdsWatched;
        }
        return false;
    },
    stats: {
        Per: 0.8,
        Int: 0.2
    },
    affectedBy: ["Buy Glasses"],
    allowed() {
        return trainingLimits;
    },
    manaCost() {
        return 2000;
    },
    canStart() {
        return resources.glasses;
    },
    visible() {
        return towns[1].getLevel("Flowers") >= 30;
    },
    unlocked() {
        return towns[1].getLevel("Flowers") >= 80;
    },
    finish() {
        unlockStory("birdsWatched");
    },
});

Action.ClearThicket = new Action("Clear Thicket", {
    expMult: 1,
    townNum: 1,
    varName: "Thicket",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].getLevel(this.varName) >= 1;
            case 2:
                return towns[1].getLevel(this.varName) >= 10;
            case 3:
                return towns[1].getLevel(this.varName) >= 20;
            case 4:
                return towns[1].getLevel(this.varName) >= 40;
            case 5:
                return towns[1].getLevel(this.varName) >= 60;
            case 6:
                return towns[1].getLevel(this.varName) >= 80;
            case 7:
                return towns[1].getLevel(this.varName) >= 100;
        }
        return false;
    },
    stats: {
        Dex: 0.1,
        Str: 0.2,
        Per: 0.3,
        Con: 0.2,
        Spd: 0.2
    },
    manaCost() {
        return 500;
    },
    visible() {
        return towns[1].getLevel("Flowers") >= 10;
    },
    unlocked() {
        return towns[1].getLevel("Flowers") >= 20;
    },
    finish() {
        towns[1].finishProgress(this.varName, 100);
    },
});

Action.TalkToWitch = new Action("Talk To Witch", {
    expMult: 1,
    townNum: 1,
    varName: "Witch",
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].getLevel(this.varName) >= 1;
            case 2:
                return towns[1].getLevel(this.varName) >= 10;
            case 3:
                return towns[1].getLevel(this.varName) >= 20;
            case 4:
                return towns[1].getLevel(this.varName) >= 40;
            case 5:
                return towns[1].getLevel(this.varName) >= 50;
            case 6:
                return towns[1].getLevel(this.varName) >= 60;
            case 7:
                return towns[1].getLevel(this.varName) >= 80;
            case 8:
                return towns[1].getLevel(this.varName) >= 100;
        }
        return false;
    },
    stats: {
        Cha: 0.3,
        Int: 0.2,
        Soul: 0.5
    },
    manaCost() {
        return 1500;
    },
    visible() {
        return towns[1].getLevel("Thicket") >= 20;
    },
    unlocked() {
        return towns[1].getLevel("Thicket") >= 60 && getSkillLevel("Magic") >= 80;
    },
    finish() {
        towns[1].finishProgress(this.varName, 100);
        view.adjustManaCost("Dark Magic");
        view.adjustManaCost("Dark Ritual");
    },
});

Action.DarkMagic = new Action("Dark Magic", {
    expMult: 1.5,
    townNum: 1,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return getSkillLevel("Dark") >= 1;
            case 2:
                return getSkillLevel("Dark") >= 25;
            case 3:
                return getSkillLevel("Dark") >= 50;
        }
        return false;
    },
    stats: {
        Con: 0.2,
        Int: 0.5,
        Soul: 0.3
    },
    skills: {
        Dark() {
            return Math.floor(100 * (1 + getBuffLevel("Ritual") / 100));
        }
    },
    manaCost() {
        return Math.ceil(6000 * (1 - towns[1].getLevel("Witch") * 0.005));
    },
    canStart() {
        return resources.reputation <= 0;
    },
    cost() {
        addResource("reputation", -1);
    },
    visible() {
        return towns[1].getLevel("Witch") >= 10;
    },
    unlocked() {
        return towns[1].getLevel("Witch") >= 20 && getSkillLevel("Magic") >= 100;
    },
    finish() {
        handleSkillExp(this.skills);
        view.adjustGoldCost("Pots", Action.SmashPots.goldCost());
        view.adjustGoldCost("WildMana", Action.WildMana.goldCost());
    },
});

Action.DarkRitual = new MultipartAction("Dark Ritual", 3, {
    expMult: 10,
    townNum: 1,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.darkRitualThirdSegmentReached;
            case 2:
                return getBuffLevel("Ritual") >= 1;
        }
        return false;
    },
    stats: {
        Spd: 0.1,
        Int: 0.1,
        Soul: 0.8
    },
    loopStats: ["Spd", "Int", "Soul"],
    manaCost() {
        return Math.ceil(50000 * (1 - towns[1].getLevel("Witch") * 0.005));
    },
    allowed() {
        return 1;
    },
    canStart() {
        let tempCanStart = true;
        const tempSoulstonesToSacrifice = Math.floor((towns[this.townNum][`total${this.varName}`] + 1) * 50 / 9);
        let name = "";
        let soulstones = -1;
        for (const stat in stats) {
            if (stats[stat].soulstone > soulstones) {
                name = stat;
                soulstones = stats[stat].soulstone;
            }
        }
        for (const stat in stats) {
            if (stat !== name) {
                if (stats[stat].soulstone < tempSoulstonesToSacrifice) tempCanStart = false;
            }
        }
        if (stats[name].soulstone < (towns[this.townNum][`total${this.varName}`] + 1) * 50 - tempSoulstonesToSacrifice * 8) tempCanStart = false;
        return resources.reputation <= -5 && towns[this.townNum].DarkRitualLoopCounter === 0 && tempCanStart && getBuffLevel("Ritual") < parseInt(document.getElementById("buffRitualCap").value);
    },
    loopCost(segment) {
        return 1000000 * (segment * 2 + 1);
    },
    tickProgress(offset) {
        return getSkillLevel("Dark") * (1 + getLevel(this.loopStats[(towns[1].DarkRitualLoopCounter + offset) % this.loopStats.length]) / 100) / (1 - towns[1].getLevel("Witch") * 0.005);
    },
    loopsFinished() {
        addBuffAmt("Ritual", 1);
        const tempSoulstonesToSacrifice = Math.floor(towns[this.townNum][`total${this.varName}`] * 50 / 9);
        let name = "";
        let soulstones = -1;
        for (const stat in stats) {
            if (stats[stat].soulstone > soulstones) {
                name = stat;
                soulstones = stats[stat].soulstone;
            }
        }
        for (const stat in stats) {
            if (stat !== name) {
                stats[stat].soulstone -= tempSoulstonesToSacrifice;
            }
        }
        stats[name].soulstone -= towns[this.townNum][`total${this.varName}`] * 50 - tempSoulstonesToSacrifice * 8;
        view.updateSoulstones();
        view.adjustGoldCost("DarkRitual", this.goldCost());
    },
    getPartName() {
        return "Perform Dark Ritual";
    },
    visible() {
        return towns[1].getLevel("Witch") >= 20;
    },
    unlocked() {
        const toUnlock = towns[1].getLevel("Witch") >= 50 && getSkillLevel("Dark") >= 50;
        if (toUnlock && !isVisible(document.getElementById("buffList"))) {
            document.getElementById("buffList").style.display = "flex";
            document.getElementById(`buffRitualContainer`).style.display = "flex";
        }
        return toUnlock;
    },
    goldCost() {
        return 50 * (getBuffLevel("Ritual") + 1);
    },
    finish() {
        view.updateBuff("Ritual");
        view.adjustExpGain(Action.DarkMagic);
        if (towns[1].DarkRitualLoopCounter >= 2) unlockStory("darkRitualThirdSegmentReached");
    },
});

Action.ContinueOn = new Action("Continue On", {
    expMult: 2,
    townNum: 1,
    storyReqs(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[2].unlocked;
        }
        return false;
    },
    stats: {
        Con: 0.4,
        Per: 0.2,
        Spd: 0.4
    },
    allowed() {
        return 1;
    },
    manaCost() {
        return Math.ceil(8000 - (60 * towns[1].getLevel("Shortcut")));
    },
    visible() {
        return true;
    },
    unlocked() {
        return true;
    },
    finish() {
        unlockTown(2);
    },
});

Action.ExploreCity = new Action("Explore City", {
    expMult: 1,
    townNum: 2,
    varName: "City",
    stats: {
        Con: 0.1,
        Per: 0.3,
        Cha: 0.2,
        Spd: 0.3,
        Luck: 0.1
    },
    affectedBy: ["Buy Glasses"],
    manaCost() {
        return 750;
    },
    visible() {
        return true;
    },
    unlocked() {
        return true;
    },
    finish() {
        towns[2].finishProgress(this.varName, 100 * (resources.glasses ? 2 : 1));
    },
});
function adjustSuckers() {
    towns[2].totalGamble = towns[2].getLevel("City") * 3;
}

Action.Gamble = new Action("Gamble", {
    expMult: 2,
    townNum: 2,
    stats: {
        Cha: 0.2,
        Luck: 0.8
    },
    canStart() {
        return resources.gold >= 20 && resources.reputation >= -5;
    },
    cost() {
        addResource("gold", -20);
        addResource("reputation", -1);
    },
    manaCost() {
        return 1000;
    },
    visible() {
        return true;
    },
    unlocked() {
        return towns[2].getLevel("City") >= 10;
    },
    finish() {
        towns[2].finishRegular(this.varName, 10, () => {
            addResource("gold", 60);
            return 60;
        });
    },
});

Action.GetDrunk = new Action("Get Drunk", {
    expMult: 3,
    townNum: 2,
    varName: "Drunk",
    stats: {
        Str: 0.1,
        Cha: 0.5,
        Con: 0.2,
        Soul: 0.2
    },
    canStart() {
        return resources.reputation >= -3;
    },
    cost() {
        addResource("reputation", -1);
    },
    manaCost() {
        return 1000;
    },
    visible() {
        return true;
    },
    unlocked() {
        return towns[2].getLevel("City") >= 20;
    },
    finish() {
        towns[2].finishProgress(this.varName, 100);
    },
});

Action.PurchaseMana = new Action("Purchase Mana", {
    expMult: 1,
    townNum: 2,
    stats: {
        Cha: 0.7,
        Int: 0.2,
        Luck: 0.1
    },
    manaCost() {
        return 100;
    },
    visible() {
        return true;
    },
    unlocked() {
        return true;
    },
    finish() {
        addMana(resources.gold * 50);
        resetResource("gold");
    },
});

Action.SellPotions = new Action("Sell Potions", {
    expMult: 1,
    townNum: 2,
    stats: {
        Cha: 0.7,
        Int: 0.2,
        Luck: 0.1
    },
    manaCost() {
        return 1000;
    },
    visible() {
        return true;
    },
    unlocked() {
        return true;
    },
    finish() {
        addResource("gold", resources.potions * getSkillLevel("Alchemy"));
        resetResource("potions");
    },
});

// the guild actions are somewhat unique in that they override the default segment naming
// with their own segment names, and so do not use the segmentNames inherited from
// MultipartAction
Action.AdventureGuild = new MultipartAction("Adventure Guild", 3, {
    expMult: 1,
    townNum: 2,
    varName: "AdvGuild",
    stats: {
        Str: 0.4,
        Dex: 0.3,
        Con: 0.3
    },
    loopStats: ["Str", "Dex", "Con"],
    manaCost() {
        return 3000;
    },
    allowed() {
        return 1;
    },
    canStart() {
        return guild === "";
    },
    loopCost(segment) {
        return precision3(Math.pow(1.2, towns[2][`${this.varName}LoopCounter`] + segment)) * 5e6;
    },
    tickProgress(offset) {
        return (getSkillLevel("Magic") / 2 +
                getSelfCombat("Combat")) *
                (1 + getLevel(this.loopStats[(towns[2][`${this.varName}LoopCounter`] + offset) % this.loopStats.length]) / 100) *
                Math.sqrt(1 + towns[2][`total${this.varName}`] / 1000);
    },
    loopsFinished() {
        // empty
    },
    segmentFinished() {
        curAdvGuildSegment++;
        addMana(200);
    },
    getPartName() {
        return `Rank ${getAdvGuildRank().name}`;
    },
    getSegmentName(segment) {
        return `Rank ${getAdvGuildRank(segment % 3).name}`;
    },
    visible() {
        return towns[2].getLevel("Drunk") >= 5;
    },
    unlocked() {
        return towns[2].getLevel("Drunk") >= 20;
    },
    finish() {
        guild = "Adventure";
    },
});
function getAdvGuildRank(offset) {
    let name = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS", "SSSS", "U", "UU", "UUU", "UUUU"][Math.floor(curAdvGuildSegment / 3 + 0.00001)];

    const segment = (offset === undefined ? 0 : offset - (curAdvGuildSegment % 3)) + curAdvGuildSegment;
    let bonus = precision3(1 + segment / 20 + Math.pow(segment, 2) / 300);
    if (name) {
        if (offset === undefined) {
            name += ["-", "", "+"][curAdvGuildSegment % 3];
        } else {
            name += ["-", "", "+"][offset % 3];
        }
    } else {
        name = "Godlike";
        bonus = 10;
    }
    name += `, Mult x${bonus}`;
    return { name, bonus };
}

Action.GatherTeam = new Action("Gather Team", {
    expMult: 3,
    townNum: 2,
    stats: {
        Per: 0.2,
        Cha: 0.5,
        Int: 0.2,
        Luck: 0.1
    },
    affectedBy: ["Adventure Guild"],
    allowed() {
        return 5;
    },
    canStart() {
        return guild === "Adventure" && resources.gold >= (resources.teamMembers + 1) * 200;
    },
    cost() {
        // cost comes after finish
        addResource("gold", -(resources.teamMembers) * 200);
    },
    manaCost() {
        return 2000;
    },
    visible() {
        return towns[2].getLevel("Drunk") >= 10;
    },
    unlocked() {
        return towns[2].getLevel("Drunk") >= 20;
    },
    finish() {
        addResource("teamMembers", 1);
    },
});

Action.LargeDungeon = new DungeonAction("Large Dungeon", 1, {
    expMult: 2,
    townNum: 2,
    varName: "LDungeon",
    stats: {
        Str: 0.2,
        Dex: 0.2,
        Con: 0.2,
        Cha: 0.3,
        Luck: 0.1
    },
    skills: {
        Combat: 15,
        Magic: 15
    },
    loopStats: ["Cha", "Spd", "Str", "Cha", "Dex", "Dex", "Str"],
    affectedBy: ["Gather Team"],
    manaCost() {
        return 6000;
    },
    canStart() {
        const curFloor = Math.floor((towns[this.townNum].LDungeonLoopCounter) / this.segments + 0.0000001);
        return resources.teamMembers >= 1 && curFloor < dungeons[this.dungeonNum].length;
    },
    loopCost(segment) {
        return precision3(Math.pow(3, Math.floor((towns[this.townNum].LDungeonLoopCounter + segment) / this.segments + 0.0000001)) * 5e5);
    },
    tickProgress(offset) {
        const floor = Math.floor((towns[this.townNum].LDungeonLoopCounter) / this.segments + 0.0000001);
        return (getTeamCombat() + getSkillLevel("Magic")) * (1 + getLevel(this.loopStats[(towns[this.townNum].LDungeonLoopCounter + offset) % this.loopStats.length]) / 100) * Math.sqrt(1 + dungeons[this.dungeonNum][floor].completed / 200);
    },
    loopsFinished() {
        const curFloor = Math.floor((towns[this.townNum].LDungeonLoopCounter) / this.segments + 0.0000001 - 1);
        finishDungeon(this.dungeonNum, curFloor);
    },
    visible() {
        return towns[2].getLevel("Drunk") >= 5;
    },
    unlocked() {
        return towns[2].getLevel("Drunk") >= 20;
    },
    finish() {
        handleSkillExp(this.skills);
    },
});

Action.CraftingGuild = new MultipartAction("Crafting Guild", 3, {
    expMult: 1,
    townNum: 2,
    varName: "CraftGuild",
    stats: {
        Dex: 0.3,
        Per: 0.3,
        Int: 0.4
    },
    skills: {
        Crafting: 50
    },
    loopStats: ["Int", "Per", "Dex"],
    manaCost() {
        return 3000;
    },
    allowed() {
        return 1;
    },
    canStart() {
        return guild === "";
    },
    loopCost(segment) {
        return precision3(Math.pow(1.2, towns[2][`${this.varName}LoopCounter`] + segment)) * 2e6;
    },
    tickProgress(offset) {
        return (getSkillLevel("Magic") / 2 +
                getSkillLevel("Crafting")) *
                (1 + getLevel(this.loopStats[(towns[2][`${this.varName}LoopCounter`] + offset) % this.loopStats.length]) / 100) *
                Math.sqrt(1 + towns[2][`total${this.varName}`] / 1000);
    },
    loopsFinished() {
        // empty
    },
    segmentFinished() {
        curCraftGuildSegment++;
        handleSkillExp(this.skills);
        addResource("gold", 10);
    },
    getPartName() {
        return `Rank ${getCraftGuildRank().name}`;
    },
    getSegmentName(segment) {
        return `Rank ${getCraftGuildRank(segment % 3).name}`;
    },
    visible() {
        return towns[2].getLevel("Drunk") >= 5;
    },
    unlocked() {
        return towns[2].getLevel("Drunk") >= 30;
    },
    finish() {
        guild = "Crafting";
    },
});
function getCraftGuildRank(offset) {
    let name = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS", "SSSS", "U", "UU", "UUU", "UUUU"][Math.floor(curCraftGuildSegment / 3 + 0.00001)];

    const segment = (offset === undefined ? 0 : offset - (curCraftGuildSegment % 3)) + curCraftGuildSegment;
    let bonus = precision3(1 + segment / 20 + Math.pow(segment, 2) / 300);
    if (name) {
        if (offset === undefined) {
            name += ["-", "", "+"][curCraftGuildSegment % 3];
        } else {
            name += ["-", "", "+"][offset % 3];
        }
    } else {
        name = "Godlike";
        bonus = 10;
    }
    name += `, Mult x${bonus}`;
    return { name, bonus };
}

Action.CraftArmor = new Action("Craft Armor", {
    expMult: 1,
    townNum: 2,
    stats: {
        Str: 0.1,
        Dex: 0.3,
        Con: 0.3,
        Int: 0.3
    },
    // this.affectedBy = ["Crafting Guild"];
    canStart() {
        return resources.hide >= 2;
    },
    cost() {
        addResource("hide", -2);
    },
    manaCost() {
        return 1000;
    },
    visible() {
        return towns[2].getLevel("Drunk") >= 15;
    },
    unlocked() {
        return towns[2].getLevel("Drunk") >= 30;
    },
    finish() {
        addResource("armor", 1);
    },
});

Action.Apprentice = new Action("Apprentice", {
    expMult: 1.5,
    townNum: 2,
    stats: {
        Dex: 0.2,
        Int: 0.4,
        Cha: 0.4
    },
    skills: {
        Crafting() {
            return 10 * (1 + towns[2].getLevel("Apprentice") / 100);
        }
    },
    affectedBy: ["Crafting Guild"],
    canStart() {
        return guild === "Crafting";
    },
    manaCost() {
        return 2000;
    },
    visible() {
        return towns[2].getLevel("Drunk") >= 20;
    },
    unlocked() {
        return towns[2].getLevel("Drunk") >= 40;
    },
    finish() {
        towns[2].finishProgress(this.varName, 30 * getCraftGuildRank().bonus);
        handleSkillExp(this.skills);
        view.adjustExpGain(Action.Apprentice);
    },
});

Action.Mason = new Action("Mason", {
    expMult: 2,
    townNum: 2,
    stats: {
        Dex: 0.2,
        Int: 0.5,
        Cha: 0.3
    },
    skills: {
        Crafting() {
            return 20 * (1 + towns[2].getLevel("Mason") / 100);
        }
    },
    affectedBy: ["Crafting Guild"],
    canStart() {
        return guild === "Crafting";
    },
    manaCost() {
        return 2000;
    },
    visible() {
        return towns[2].getLevel("Drunk") >= 40;
    },
    unlocked() {
        return towns[2].getLevel("Drunk") >= 60 && towns[2].getLevel("Apprentice") >= 100;
    },
    finish() {
        towns[2].finishProgress(this.varName, 20 * getCraftGuildRank().bonus);
        handleSkillExp(this.skills);
    },
});

Action.Architect = new Action("Architect", {
    expMult: 2.5,
    townNum: 2,
    stats: {
        Dex: 0.2,
        Int: 0.6,
        Cha: 0.2
    },
    skills: {
        Crafting() {
            return 40 * (1 + towns[2].getLevel("Architect") / 100);
        }
    },
    affectedBy: ["Crafting Guild"],
    canStart() {
        return guild === "Crafting";
    },
    manaCost() {
        return 2000;
    },
    visible() {
        return towns[2].getLevel("Drunk") >= 60;
    },
    unlocked() {
        return towns[2].getLevel("Drunk") >= 80 && towns[2].getLevel("Mason") >= 100;
    },
    finish() {
        towns[2].finishProgress(this.varName, 10 * getCraftGuildRank().bonus);
        handleSkillExp(this.skills);
    },
});

Action.ReadBooks = new Action("Read Books", {
    expMult: 4,
    townNum: 2,
    stats: {
        Int: 0.8,
        Soul: 0.2
    },
    affectedBy: ["Buy Glasses"],
    allowed() {
        return trainingLimits;
    },
    canStart() {
        return resources.glasses;
    },
    manaCost() {
        return 2000;
    },
    visible() {
        return towns[2].getLevel("City") >= 5;
    },
    unlocked() {
        return towns[2].getLevel("City") >= 50;
    },
    finish() {
        // empty
    },
});

Action.BuyPickaxe = new Action("Buy Pickaxe", {
    expMult: 1,
    townNum: 2,
    stats: {
        Cha: 0.8,
        Int: 0.1,
        Spd: 0.1
    },
    allowed() {
        return 1;
    },
    canStart() {
        return resources.gold >= 200;
    },
    cost() {
        addResource("gold", -200);
    },
    manaCost() {
        return 3000;
    },
    visible() {
        return towns[2].getLevel("City") >= 60;
    },
    unlocked() {
        return towns[2].getLevel("City") >= 90;
    },
    finish() {
        addResource("pickaxe", true);
    },
});

Action.StartTrek = new Action("Start Trek", {
    expMult: 2,
    townNum: 2,
    stats: {
        Con: 0.7,
        Per: 0.2,
        Spd: 0.1
    },
    allowed() {
        return 1;
    },
    manaCost() {
        return Math.ceil(12000);
    },
    visible() {
        return towns[2].getLevel("City") >= 30;
    },
    unlocked() {
        return towns[2].getLevel("City") >= 60;
    },
    finish() {
        unlockTown(3);
    },
});

Action.ClimbMountain = new Action("Climb Mountain", {
    expMult: 1,
    townNum: 3,
    varName: "Mountain",
    stats: {
        Dex: 0.1,
        Str: 0.2,
        Con: 0.4,
        Per: 0.2,
        Spd: 0.1
    },
    affectedBy: ["Buy Pickaxe"],
    manaCost() {
        return 800;
    },
    visible() {
        return true;
    },
    unlocked() {
        return true;
    },
    finish() {
        towns[3].finishProgress(this.varName, 100 * (resources.pickaxe ? 2 : 1));
    },
});

Action.ManaGeyser = new Action("Mana Geyser", {
    expMult: 1,
    townNum: 3,
    varName: "Geysers",
    stats: {
        Str: 0.6,
        Per: 0.3,
        Int: 0.1,
    },
    affectedBy: ["Buy Pickaxe"],
    manaCost() {
        return 2000;
    },
    canStart() {
        return resources.pickaxe;
    },
    visible() {
        return true;
    },
    unlocked() {
        return towns[3].getLevel("Mountain") >= 2;
    },
    finish() {
        towns[3].finishRegular(this.varName, 100, () => {
            addMana(5000);
            return 5000;
        });
    },
});
function adjustGeysers() {
    towns[3].totalGeysers = towns[3].getLevel("Mountain") * 10;
}

Action.DecipherRunes = new Action("Decipher Runes", {
    expMult: 1,
    townNum: 3,
    varName: "Runes",
    stats: {
        Per: 0.3,
        Int: 0.7
    },
    affectedBy: ["Buy Glasses"],
    manaCost() {
        return 1200;
    },
    visible() {
        return towns[3].getLevel("Mountain") >= 2;
    },
    unlocked() {
        return towns[3].getLevel("Mountain") >= 20;
    },
    finish() {
        towns[3].finishProgress(this.varName, 100 * (resources.glasses ? 2 : 1));
        view.adjustManaCost("Chronomancy");
        view.adjustManaCost("Pyromancy");
    },
});

Action.Chronomancy = new Action("Chronomancy", {
    expMult: 2,
    townNum: 3,
    stats: {
        Soul: 0.1,
        Spd: 0.3,
        Int: 0.6
    },
    skills: {
        Chronomancy: 100
    },
    manaCost() {
        return Math.ceil(10000 * (1 - towns[3].getLevel("Runes") * 0.005));
    },
    visible() {
        return towns[3].getLevel("Runes") >= 8;
    },
    unlocked() {
        return towns[3].getLevel("Runes") >= 30 && getSkillLevel("Magic") >= 150;
    },
    finish() {
        handleSkillExp(this.skills);
    },
});

Action.LoopingPotion = new Action("Looping Potion", {
    expMult: 2,
    townNum: 3,
    stats: {
        Dex: 0.2,
        Int: 0.7,
        Soul: 0.1,
    },
    skills: {
        Alchemy: 100
    },
    canStart() {
        return resources.herbs >= 200;
    },
    cost() {
        addResource("herbs", -200);
    },
    manaCost() {
        return Math.ceil(30000);
    },
    visible() {
        return getSkillLevel("Alchemy") >= 10 && getSkillLevel("Chronomancy") >= 20;
    },
    unlocked() {
        return getSkillLevel("Alchemy") >= 60 && getSkillLevel("Chronomancy") >= 100;
    },
    finish() {
        addResource("loopingPotion", true);
        handleSkillExp(this.skills);
    },
});

Action.Pyromancy = new Action("Pyromancy", {
    expMult: 2,
    townNum: 3,
    stats: {
        Per: 0.2,
        Int: 0.7,
        Soul: 0.1
    },
    skills: {
        Pyromancy: 100
    },
    manaCost() {
        return Math.ceil(14000 * (1 - towns[3].getLevel("Runes") * 0.005));
    },
    visible() {
        return towns[3].getLevel("Runes") >= 16;
    },
    unlocked() {
        return towns[3].getLevel("Runes") >= 60 && getSkillLevel("Magic") >= 200;
    },
    finish() {
        handleSkillExp(this.skills);
    },
});

Action.ExploreCavern = new Action("Explore Cavern", {
    expMult: 1,
    townNum: 3,
    varName: "Cavern",
    stats: {
        Dex: 0.1,
        Str: 0.3,
        Con: 0.2,
        Per: 0.3,
        Spd: 0.1
    },
    manaCost() {
        return 1500;
    },
    visible() {
        return towns[3].getLevel("Mountain") >= 10;
    },
    unlocked() {
        return towns[3].getLevel("Mountain") >= 40;
    },
    finish() {
        towns[3].finishProgress(this.varName, 100);
    },
});

Action.MineSoulstones = new Action("Mine Soulstones", {
    expMult: 1,
    townNum: 3,
    stats: {
        Str: 0.6,
        Dex: 0.1,
        Con: 0.3,
    },
    affectedBy: ["Buy Pickaxe"],
    manaCost() {
        return 5000;
    },
    canStart() {
        return resources.pickaxe;
    },
    visible() {
        return towns[3].getLevel("Cavern") >= 2;
    },
    unlocked() {
        return towns[3].getLevel("Cavern") >= 20;
    },
    finish() {
        towns[3].finishRegular(this.varName, 10, () => {
            const statToAdd = statList[Math.floor(Math.random() * statList.length)];
            stats[statToAdd].soulstone += 1;
            view.updateSoulstones();
        });
    },
});

function adjustMineSoulstones() {
    towns[3].totalMineSoulstones = towns[3].getLevel("Cavern") * 3;
}

Action.HuntTrolls = new MultipartAction("Hunt Trolls", 5, {
    expMult: 1.5,
    townNum: 3,
    stats: {
        Str: 0.3,
        Dex: 0.3,
        Con: 0.2,
        Per: 0.1,
        Int: 0.1
    },
    skills: {
        Combat: 1000
    },
    loopStats: ["Per", "Con", "Dex", "Str", "Int"],
    manaCost() {
        return 8000;
    },
    loopCost(segment) {
        return precision3(Math.pow(2, Math.floor((towns[this.townNum].HuntTrollsLoopCounter + segment) / this.segments + 0.0000001)) * 1e6);
    },
    tickProgress(offset) {
        return (getSelfCombat() * (1 + getLevel(this.loopStats[(towns[3].HuntTrollsLoopCounter + offset) % this.loopStats.length]) / 100) * Math.sqrt(1 + towns[3].totalHuntTrolls / 100));
    },
    loopsFinished() {
        handleSkillExp(this.skills);
        addResource("blood", 1);
    },
    getPartName() {
        return "Hunt Troll";
    },
    visible() {
        return towns[3].getLevel("Cavern") >= 5;
    },
    unlocked() {
        return towns[3].getLevel("Cavern") >= 50;
    },
    finish() {
        // nothing
    },
});

Action.CheckWalls = new Action("Check Walls", {
    expMult: 1,
    townNum: 3,
    varName: "Illusions",
    stats: {
        Spd: 0.1,
        Dex: 0.1,
        Per: 0.4,
        Int: 0.4
    },
    manaCost() {
        return 3000;
    },
    visible() {
        return towns[3].getLevel("Cavern") >= 40;
    },
    unlocked() {
        return towns[3].getLevel("Cavern") >= 80;
    },
    finish() {
        towns[3].finishProgress(this.varName, 100);
    },
});

Action.TakeArtifacts = new Action("Take Artifacts", {
    expMult: 1,
    townNum: 3,
    varName: "Artifacts",
    stats: {
        Spd: 0.2,
        Per: 0.6,
        Int: 0.2,
    },
    manaCost() {
        return 1500;
    },
    visible() {
        return towns[3].getLevel("Illusions") >= 1;
    },
    unlocked() {
        return towns[3].getLevel("Illusions") >= 5;
    },
    finish() {
        towns[3].finishRegular(this.varName, 25, () => {
            addResource("artifacts", 1);
        });
    },
});
function adjustArtifacts() {
    towns[3].totalArtifacts = towns[3].getLevel("Illusions") * 5;
}

Action.ImbueMind = new MultipartAction("Imbue Mind", 3, {
    expMult: 5,
    townNum: 3,
    stats: {
        Spd: 0.1,
        Per: 0.1,
        Int: 0.8
    },
    loopStats: ["Spd", "Per", "Int"],
    manaCost() {
        return 500000;
    },
    allowed() {
        return 1;
    },
    canStart() {
        let tempCanStart = true;
        const tempSoulstonesToSacrifice = Math.floor((towns[this.townNum][`total${this.varName}`] + 1) * 20 / 9);
        let name = "";
        let soulstones = -1;
        for (const stat in stats) {
            if (stats[stat].soulstone > soulstones) {
                name = stat;
                soulstones = stats[stat].soulstone;
            }
        }
        for (const stat in stats) {
            if (stat !== name) {
                if (stats[stat].soulstone < tempSoulstonesToSacrifice) tempCanStart = false;
            }
        }
        if (stats[name].soulstone < (towns[this.townNum][`total${this.varName}`] + 1) * 20 - tempSoulstonesToSacrifice * 8) tempCanStart = false;
        return towns[3].ImbueMindLoopCounter === 0 && tempCanStart && getBuffLevel("Imbuement") < parseInt(document.getElementById("buffImbuementCap").value);
    },
    loopCost(segment) {
        return 100000000 * (segment * 5 + 1);
    },
    tickProgress(offset) {
        return getSkillLevel("Magic") * (1 + getLevel(this.loopStats[(towns[3].ImbueMindLoopCounter + offset) % this.loopStats.length]) / 100);
    },
    loopsFinished() {
        trainingLimits++;
        addBuffAmt("Imbuement", 1);
        const tempSoulstonesToSacrifice = Math.floor(towns[this.townNum][`total${this.varName}`] * 20 / 9);
        let name = "";
        let soulstones = -1;
        for (const stat in stats) {
            if (stats[stat].soulstone > soulstones) {
                name = stat;
                soulstones = stats[stat].soulstone;
            }
        }
        for (const stat in stats) {
            if (stat !== name) {
                stats[stat].soulstone -= tempSoulstonesToSacrifice;
            }
        }
        stats[name].soulstone -= towns[this.townNum][`total${this.varName}`] * 20 - tempSoulstonesToSacrifice * 8;
        view.updateSoulstones();
        view.adjustGoldCost("ImbueMind", this.goldCost());
    },
    getPartName() {
        return "Imbue Mind";
    },
    visible() {
        return towns[3].getLevel("Illusions") >= 50;
    },
    unlocked() {
        const toUnlock = towns[3].getLevel("Illusions") >= 70 && getSkillLevel("Magic") >= 300;
        if (toUnlock && !isVisible(document.getElementById("buffList"))) {
            document.getElementById("buffList").style.display = "flex";
            document.getElementById(`buffImbuementContainer`).style.display = "flex";
        }
        return toUnlock;
    },
    goldCost() {
        return 20 * (getBuffLevel("Imbuement") + 1);
    },
    finish() {
        view.updateBuff("Imbuement");
    },
});

Action.FaceJudgement = new Action("Face Judgement", {
    expMult: 2,
    townNum: 3,
    stats: {
        Cha: 0.3,
        Luck: 0.2,
        Soul: 0.5,
    },
    allowed() {
        return 1;
    },
    manaCost() {
        return 30000;
    },
    visible() {
        return towns[3].getLevel("Mountain") >= 40;
    },
    unlocked() {
        return towns[3].getLevel("Mountain") >= 100;
    },
    finish() {
        // todo: allow you to unlock the new zones
        // if (resources.reputation >= 50) unlockTown(4);
        // else if (resources.reputation <= 50) unlockTown(5);
    },
});

Action.FallFromGrace = new Action("Fall From Grace", {
    expMult: 2,
    townNum: 4,
    stats: {
        Dex: 0.4,
        Luck: 0.3,
        Spd: 0.2,
        Int: 0.1,
    },
    allowed() {
        return 1;
    },
    manaCost() {
        return 30000;
    },
    visible() {
        return true;
    },
    unlocked() {
        return true;
    },
    finish() {
        // todo: allow you to unlock new zone
        // unlockTown(5);
    },
});

// todo: make this correct
Action.GreatFeast = new MultipartAction("Great Feast", 3, {
    expMult: 5,
    townNum: 4,
    stats: {
        Spd: 0.1,
        Int: 0.1,
        Soul: 0.8
    },
    loopStats: ["Spd", "Int", "Soul"],
    manaCost() {
        return Math.ceil(50000 * (1 - towns[1].getLevel("Witch") * 0.005));
    },
    allowed() {
        return 1;
    },
    canStart() {
        let tempCanStart = true;
        const tempSoulstonesToSacrifice = Math.floor((towns[1][`total${this.varName}`] + 1) * 50 / 9);
        let name = "";
        let soulstones = 0;
        for (const stat in stats) {
            if (stats[stat].soulstone > soulstones) {
                name = stat;
                soulstones = stats[stat].soulstone;
            }
        }
        for (const stat in stats) {
            if (stat !== name) {
                if (stats[stat].soulstone < tempSoulstonesToSacrifice) tempCanStart = false;
            }
        }
        if (stats[name].soulstone < (towns[1][`total${this.varName}`] + 1) * 50 - tempSoulstonesToSacrifice * 8) tempCanStart = false;
        return resources.reputation <= -5 && towns[1].DarkRitualLoopCounter === 0 && tempCanStart && getBuffLevel("Feast") < parseInt(document.getElementById("buffFeastCap").value);
    },
    loopCost(segment) {
        return 1000000 * (segment * 2 + 1);
    },
    tickProgress(offset) {
        return getSkillLevel("Dark") * (1 + getLevel(this.loopStats[(towns[1].DarkRitualLoopCounter + offset) % this.loopStats.length]) / 100) / (1 - towns[1].getLevel("Witch") * 0.005);
    },
    loopsFinished() {
        addBuffAmt("Feast", 1);
        const tempSoulstonesToSacrifice = Math.floor(towns[this.townNum][`total${this.varName}`] * 5000 / 9);
        let name = "";
        let soulstones = -1;
        for (const stat in stats) {
            if (stats[stat].soulstone > soulstones) {
                name = stat;
                soulstones = stats[stat].soulstone;
            }
        }
        for (const stat in stats) {
            if (stat !== name) {
                stats[stat].soulstone -= tempSoulstonesToSacrifice;
            }
        }
        stats[name].soulstone -= towns[this.townNum][`total${this.varName}`] * 5000 - tempSoulstonesToSacrifice * 8;
        view.updateSoulstones();
        view.adjustGoldCost("GreatFeast", this.goldCost());
    },
    getPartName() {
        return "Host Great Feast";
    },
    visible() {
        return towns[1].getLevel("Thicket") >= 50;
    },
    unlocked() {
        const toUnlock = false;
        if (toUnlock && !isVisible(document.getElementById("buffList"))) {
            document.getElementById("buffList").style.display = "flex";
            document.getElementById(`buffFeastContainer`).style.display = "flex";
        }
        return toUnlock;
    },
    goldCost() {
        return 5000 * (getBuffLevel("Feast") + 1);
    },
    finish() {
        view.updateBuff("Feast");
    },
});

const actionsWithGoldCost = Object.values(Action).filter(
    action => action.goldCost !== undefined
);
