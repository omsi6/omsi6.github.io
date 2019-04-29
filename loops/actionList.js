"use strict";
function translateClassNames(name) {
    if (name === "Wander") {
        return new Wander();
    }
    if (name === "Smash Pots") {
        return new SmashPots();
    }
    if (name === "Pick Locks") {
        return new PickLocks();
    }
    if (name === "Buy Glasses") {
        return new BuyGlasses();
    }
    if (name === "Buy Mana") {
        return new BuyMana();
    }
    if (name === "Meet People") {
        return new MeetPeople();
    }
    if (name === "Train Strength") {
        return new TrainStrength();
    }
    if (name === "Short Quest") {
        return new ShortQuest();
    }
    if (name === "Investigate") {
        return new Investigate();
    }
    if (name === "Long Quest") {
        return new LongQuest();
    }
    if (name === "Warrior Lessons") {
        return new WarriorLessons();
    }
    if (name === "Mage Lessons") {
        return new MageLessons();
    }
    if (name === "Throw Party") {
        return new ThrowParty();
    }
    if (name === "Heal The Sick") {
        return new HealTheSick();
    }
    if (name === "Fight Monsters") {
        return new FightMonsters();
    }
    if (name === "Small Dungeon") {
        return new SmallDungeon();
    }
    if (name === "Buy Supplies") {
        return new BuySupplies();
    }
    if (name === "Haggle") {
        return new Haggle();
    }
    if (name === "Start Journey") {
        return new StartJourney();
    }
    if (name === "Open Rift") {
        return new OpenRift();
    }
    // town 2
    if (name === "Explore Forest") {
        return new ExploreForest();
    }
    if (name === "Wild Mana") {
        return new WildMana();
    }
    if (name === "Gather Herbs") {
        return new GatherHerbs();
    }
    if (name === "Hunt") {
        return new Hunt();
    }
    if (name === "Sit By Waterfall") {
        return new SitByWaterfall();
    }
    if (name === "Old Shortcut") {
        return new OldShortcut();
    }
    if (name === "Talk To Hermit") {
        return new TalkToHermit();
    }
    if (name === "Practical Magic") {
        return new PracticalMagic();
    }
    if (name === "Learn Alchemy") {
        return new LearnAlchemy();
    }
    if (name === "Brew Potions") {
        return new BrewPotions();
    }
    if (name === "Train Dexterity") {
        return new TrainDexterity();
    }
    if (name === "Train Speed") {
        return new TrainSpeed();
    }
    if (name === "Follow Flowers") {
        return new FollowFlowers();
    }
    if (name === "Bird Watching") {
        return new BirdWatching();
    }
    if (name === "Clear Thicket") {
        return new ClearThicket();
    }
    if (name === "Talk To Witch") {
        return new TalkToWitch();
    }
    if (name === "Dark Magic") {
        return new DarkMagic();
    }
    if (name === "Dark Ritual") {
        return new DarkRitual();
    }
    if (name === "Continue On") {
        return new ContinueOn();
    }
    // town 3
    if (name === "Explore City") {
        return new ExploreCity();
    }
    if (name === "Gamble") {
        return new Gamble();
    }
    if (name === "Get Drunk") {
        return new GetDrunk();
    }
    if (name === "Purchase Mana") {
        return new PurchaseMana();
    }
    if (name === "Sell Potions") {
        return new SellPotions();
    }
    if (name === "Read Books") {
        return new ReadBooks();
    }
    if (name === "Adventure Guild") {
        return new JoinAdvGuild();
    }
    if (name === "Gather Team") {
        return new GatherTeam();
    }
    if (name === "Large Dungeon") {
        return new LargeDungeon();
    }
    if (name === "Crafting Guild") {
        return new CraftingGuild();
    }
    if (name === "Craft Armor") {
        return new CraftArmor();
    }
    if (name === "Apprentice") {
        return new Apprentice();
    }
    if (name === "Mason") {
        return new Mason();
    }
    if (name === "Architect") {
        return new Architect();
    }
    if (name === "Buy Pickaxe") {
        return new BuyPickaxe();
    }
    if (name === "Start Trek") {
        return new StartTrek();
    }
    // town 4 
    if (name === "Climb Mountain") {
        return new ClimbMountain();
    }
    if (name === "Mana Geyser") {
        return new ManaGeyser();
    }
    if (name === "Decipher Runes") {
        return new DecipherRunes();
    }
    if (name === "Chronomancy") {
        return new Chronomancy();
    }
    if (name === "Looping Potion") {
        return new LoopingPotion();
    }
    if (name === "Pyromancy") {
        return new Pyromancy();
    }
    if (name === "Explore Cavern") {
        return new ExploreCavern();
    }
    if (name === "Mine Soulstones") {
        return new MineSoulstones();
    }
    if (name === "Hunt Trolls") {
        return new HuntTrolls();
    }
    if (name === "Check Walls") {
        return new CheckWalls();
    }
    if (name === "Take Artifacts") {
        return new TakeArtifacts();
    }
    if (name === "Imbue Mind") {
        return new ImbueMind();
    }
    if (name === "Face Judgement") {
        return new FaceJudgement();
    }
    // town 5
    if (name === "Look Around") {
        return new LookAround();
    }
    if (name === "Great Feast") {
        return new GreatFeast();
    }
    if (name === "Fall From Grace") {
        return new FallFromGrace();
    }
    // town 6
    if (name === "Survey Area") {
        return new SurveyArea();
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

// town 1
function Wander() {
    this.name = "Wander";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0].getLevel("Wander") >= 20;
            case 2:
                return towns[0].getLevel("Wander") >= 40;
            case 3:
                return towns[0].getLevel("Wander") >= 60;
            case 4:
                return towns[0].getLevel("Wander") >= 80;
            case 5:
                return towns[0].getLevel("Wander") >= 100;
        }
        return false;
    };
    
    this.varName = "Wander";
    this.stats = {
        Per: 0.2,
        Con: 0.2,
        Cha: 0.2,
        Spd: 0.3,
        Luck: 0.1
    };
    this.affectedBy = ["Buy Glasses"];
    this.manaCost = function() {
        return 250;
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return true;
    };
    this.finish = function() {
        towns[0].finishProgress(this.varName, 200 * (resources.glasses ? 4 : 1));
    };
}
function adjustPots() {
    towns[0].totalPots = towns[0].getLevel("Wander") * 5;
}
function adjustLocks() {
    towns[0].totalLocks = towns[0].getLevel("Wander");
}

function SmashPots() {
    this.varName = "Pots";
    this.name = "Smash Pots";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.tooltip2 = _txt(`actions>${getXMLName(this.name)}>tooltip2`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.infoText = `${_txt(`actions>${getXMLName(this.name)}>info_text1`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text2`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text3`)}
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_found")}: `}</span><div id='total${this.varName}'></div>
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_checked")}: `}</span><div id='checked${this.varName}'></div>`;
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0].goodPots >= 50;
        }
        return false;
    };

    this.stats = {
        Str: 0.2,
        Per: 0.2,
        Spd: 0.6
    };
    this.manaCost = function() {
        return Math.ceil(50 / (1 + getSkillLevel("Practical") / 100));
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return true;
    };
    this.finish = function() {
        towns[0].finishRegular(this.varName, 10, () => {
            addMana(goldCostSmashPots());
            return goldCostSmashPots();
        });
    };
}
function goldCostSmashPots() {
    return Math.floor(100 * Math.pow(1 + getSkillLevel("Dark") / 60, 0.25));
}

function PickLocks() {
    this.varName = "Locks";
    this.name = "Pick Locks";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.tooltip2 = _txt(`actions>${getXMLName(this.name)}>tooltip2`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.infoText = `${_txt(`actions>${getXMLName(this.name)}>info_text1`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text2`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text3`)}
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_found")}: `}</span><div id='total${this.varName}'></div>
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_checked")}: `}</span><div id='checked${this.varName}'></div>`;
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0].checkedLocks >= 1;
            case 2:
                return towns[0].totalLocks >= 50;
            case 3:
                return towns[0].goodLocks >= 10;
        }
        return false;
    };

    this.stats = {
        Dex: 0.5,
        Per: 0.3,
        Spd: 0.1,
        Luck: 0.1
    };
    this.manaCost = function() {
        return 400;
    };
    this.visible = function() {
        return towns[0].getLevel("Wander") >= 3;
    };
    this.unlocked = function() {
        return towns[0].getLevel("Wander") >= 20;
    };
    this.finish = function() {
        towns[0].finishRegular(this.varName, 10, () => {
            const goldGain = goldCostLocks();
            addResource("gold", goldGain);
            return goldGain;
        });
    };
}
function goldCostLocks() {
    let practical = getSkillLevel("Practical");
    practical = practical <= 200 ? practical : 200;
    return Math.floor(10 * (1 + practical / 100));
}

function BuyGlasses() {
    this.name = "Buy Glasses";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.glassesBought;
        }
        return false;
    };

    this.varName = "Glasses";
    this.stats = {
        Cha: 0.7,
        Spd: 0.3
    };
    this.allowed = function() {
        return 1;
    };
    this.canStart = function() {
        return resources.gold >= 10;
    };
    this.cost = function() {
        addResource("gold", -10);
    };
    this.manaCost = function() {
        return 50;
    };
    this.visible = function() {
        return towns[0].getLevel("Wander") >= 3;
    };
    this.unlocked = function() {
        return towns[0].getLevel("Wander") >= 20;
    };
    this.finish = function() {
        addResource("glasses", true);
        unlockStory("glassesBought");
    };
}

function BuyMana() {
    this.name = "Buy Mana";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.varName = "Gold";
    this.stats = {
        Cha: 0.7,
        Int: 0.2,
        Luck: 0.1
    };
    this.manaCost = function() {
        return 100;
    };
    this.visible = function() {
        return towns[0].getLevel("Wander") >= 3;
    };
    this.unlocked = function() {
        return towns[0].getLevel("Wander") >= 20;
    };
    this.finish = function() {
        addMana(resources.gold * 50);
        resetResource("gold");
    };
}

function MeetPeople() {
    this.name = "Meet People";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0].getLevel("Met") >= 1;
            case 2:
                return towns[0].getLevel("Met") >= 20;
            case 3:
                return towns[0].getLevel("Met") >= 40;
            case 4:
                return towns[0].getLevel("Met") >= 60;
            case 5:
                return towns[0].getLevel("Met") >= 80;
            case 6:
                return towns[0].getLevel("Met") >= 100;
        }
        return false;
    };

    this.varName = "Met";
    this.stats = {
        Int: 0.1,
        Cha: 0.8,
        Soul: 0.1
    };
    this.manaCost = function() {
        return 800;
    };
    this.visible = function() {
        return towns[0].getLevel("Wander") >= 10;
    };
    this.unlocked = function() {
        return towns[0].getLevel("Wander") >= 22;
    };
    this.finish = function() {
        towns[0].finishProgress(this.varName, 200);
    };
}
function adjustSQuests() {
    towns[0].totalSQuests = towns[0].getLevel("Met");
}

function TrainStrength() {
    this.name = "Train Strength";
    this.expMult = 4;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.strengthTrained;
            case 2:
                return getTalent("Str") >= 100;
            case 3:
                return getTalent("Str") >= 1000;
        }
        return false;
    };

    this.varName = "trStr";
    this.stats = {
        Str: 0.8,
        Con: 0.2
    };
    this.allowed = function() {
        return trainingLimits;
    };
    this.manaCost = function() {
        return 2000;
    };
    this.visible = function() {
        return towns[0].getLevel("Met") >= 1;
    };
    this.unlocked = function() {
        return towns[0].getLevel("Met") >= 5;
    };
    this.finish = function() {
        unlockStory("strengthTrained");
    };
}

function ShortQuest() {
    this.varName = "SQuests";
    this.name = "Short Quest";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.tooltip2 = _txt(`actions>${getXMLName(this.name)}>tooltip2`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.infoText = `${_txt(`actions>${getXMLName(this.name)}>info_text1`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text2`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text3`)}
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_found")}: `}</span><div id='total${this.varName}'></div>
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_checked")}: `}</span><div id='checked${this.varName}'></div>`;
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0].checkedSQuests >= 1;
            case 2:
                // 20 small quests in a loop
                return storyReqs.maxSQuestsInALoop;
        }
        return false;
    };

    this.stats = {
        Str: 0.2,
        Dex: 0.1,
        Cha: 0.3,
        Spd: 0.2,
        Luck: 0.1,
        Soul: 0.1
    };
    this.manaCost = function() {
        return 600;
    };
    this.visible = function() {
        return towns[0].getLevel("Met") >= 1;
    };
    this.unlocked = function() {
        return towns[0].getLevel("Met") >= 5;
    };
    this.finish = function() {
        towns[0].finishRegular(this.varName, 5, () => {
            const goldGain = goldCostSQuests();
            addResource("gold", goldGain);
            return goldGain;
        });
        if (towns[0].goodSQuests >= 20 && towns[0].goodTempSQuests <= towns[0].goodSQuests - 20) unlockStory("maxSQuestsInALoop");
    };
}
function goldCostSQuests() {
    let practical = getSkillLevel("Practical") - 100;
    practical = Math.min(practical, 200);
    return Math.floor(20 * (1 + practical / 100));
}

function Investigate() {
    this.name = "Investigate";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0].getLevel("Secrets") >= 20;
            case 2:
                return towns[0].getLevel("Secrets") >= 40;
            case 3:
                return towns[0].getLevel("Secrets") >= 60;
            case 4:
                return towns[0].getLevel("Secrets") >= 80;
            case 5:
                return towns[0].getLevel("Secrets") >= 100;
        }
        return false;
    };

    this.varName = "Secrets";
    this.stats = {
        Per: 0.3,
        Cha: 0.4,
        Spd: 0.2,
        Luck: 0.1
    };
    this.manaCost = function() {
        return 1000;
    };
    this.visible = function() {
        return towns[0].getLevel("Met") >= 5;
    };
    this.unlocked = function() {
        return towns[0].getLevel("Met") >= 25;
    };
    this.finish = function() {
        towns[0].finishProgress(this.varName, 500);
    };
}
function adjustLQuests() {
    towns[0].totalLQuests = Math.floor(towns[0].getLevel("Secrets") / 2);
}

function LongQuest() {
    this.varName = "LQuests";
    this.name = "Long Quest";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.tooltip2 = _txt(`actions>${getXMLName(this.name)}>tooltip2`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.infoText = `${_txt(`actions>${getXMLName(this.name)}>info_text1`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text2`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text3`)}
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_found")}: `}</span><div id='total${this.varName}'></div>
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_checked")}: `}</span><div id='checked${this.varName}'></div>`;
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[0].checkedLQuests >= 1;
            case 2:
                // 10 long quests in a loop
                return storyReqs.maxLQuestsInALoop;
        }
        return false;
    };

    this.stats = {
        Str: 0.2,
        Int: 0.2,
        Con: 0.4,
        Spd: 0.2
    };
    this.manaCost = function() {
        return 1500;
    };
    this.visible = function() {
        return towns[0].getLevel("Secrets") >= 1;
    };
    this.unlocked = function() {
        const toUnlock = towns[0].getLevel("Secrets") >= 10;
        if (toUnlock && !isVisible(document.getElementById("skillList"))) {
            document.getElementById("skillList").style.display = "inline-block";
        }
        return toUnlock;
    };
    this.finish = function() {
        towns[0].finishRegular(this.varName, 5, () => {
            addResource("reputation", 1);
            const goldGain = goldCostLQuests();
            addResource("gold", goldGain);
            return goldGain;
        });
        if (towns[0].goodLQuests >= 10 && towns[0].goodTempLQuests <= towns[0].goodLQuests - 10) unlockStory("maxLQuestsInALoop");
    };
}
function goldCostLQuests() {
    let practical = getSkillLevel("Practical") - 200;
    practical = Math.min(practical, 200);
    return Math.floor(30 * (1 + practical / 100));
}

function ThrowParty() {
    this.name = "Throw Party";
    this.expMult = 2;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.partyThrown;
        }
        return false;
    };

    this.varName = "Party";
    this.stats = {
        Cha: 0.8,
        Soul: 0.2
    };
    this.manaCost = function() {
        return 1600;
    };
    this.canStart = function() {
        return resources.reputation >= 2;
    };
    this.cost = function() {
        addResource("reputation", -2);
    };
    this.visible = function() {
        return towns[0].getLevel("Secrets") >= 20;
    };
    this.unlocked = function() {
        return towns[0].getLevel("Secrets") >= 30;
    };
    this.finish = function() {
        towns[0].finishProgress("Met", 3200);
        unlockStory("partyThrown");
    };
}

function WarriorLessons() {
    this.name = "Warrior Lessons";
    this.expMult = 1.5;
    this.tooltip = "Learning to fight is probably important; you have a long journey ahead of you.<br>Requires 2 reputation.<br>Unlocked at 20% Investigated.";
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
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
    };

    this.varName = "trCombat";
    this.stats = {
        Str: 0.5,
        Dex: 0.3,
        Con: 0.2
    };
    this.skills = {
        Combat: 100
    };
    this.manaCost = function() {
        return 1000;
    };
    this.canStart = function() {
        return resources.reputation >= 2;
    };
    this.visible = function() {
        return towns[0].getLevel("Secrets") >= 10;
    };
    this.unlocked = function() {
        return towns[0].getLevel("Secrets") >= 20;
    };
    this.finish = function() {
        handleSkillExp(this.skills);
    };
}

function MageLessons() {
    this.name = "Mage Lessons";
    this.expMult = 1.5;
    this.tooltip = "The mystic got you into this mess, maybe it can help you get out of it.<br>Requires 2 reputation.<br>Unlocked at 20% Investigated.";
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
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
    };

    this.varName = "trMagic";
    this.stats = {
        Per: 0.3,
        Int: 0.5,
        Con: 0.2
    };
    this.skills = {
        Magic() {
            return 100 * (1 + getSkillLevel("Alchemy") / 100);
        }
    };
    this.manaCost = function() {
        return 1000;
    };
    this.canStart = function() {
        return resources.reputation >= 2;
    };
    this.visible = function() {
        return towns[0].getLevel("Secrets") >= 10;
    };
    this.unlocked = function() {
        return towns[0].getLevel("Secrets") >= 20;
    };
    this.finish = function() {
        handleSkillExp(this.skills);
    };
}

function HealTheSick() {
    this.varName = "Heal";
    this.name = "Heal The Sick";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.storyReqs = function(storyNum) {
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
    };

    this.stats = {
        Per: 0.2,
        Int: 0.2,
        Cha: 0.2,
        Soul: 0.4
    };
    this.skills = {
        Magic: 10
    };
    this.loopStats = ["Per", "Int", "Cha"];
    this.segments = 3;
    this.segmentNames = [];
    $(_txtsObj(`actions>${getXMLName(this.name)}>segment_names>name`)).each((_index, segmentName) => {
        this.segmentNames.push($(segmentName).text());
    });
    this.manaCost = function() {
        return 2500;
    };
    this.canStart = function() {
        return resources.reputation >= 1;
    };
    this.loopCost = function(segment) {
        return fibonacci(2 + Math.floor((towns[0].HealLoopCounter + segment) / this.segments + 0.0000001)) * 5000;
    };
    this.tickProgress = function(offset) {
        return getSkillLevel("Magic") * (1 + getLevel(this.loopStats[(towns[0].HealLoopCounter + offset) % this.loopStats.length]) / 100) * Math.sqrt(1 + towns[0].totalHeal / 100);
    };
    this.loopsFinished = function() {
        addResource("reputation", 3);
    };
    this.getPartName = function() {
        return `${_txt(`actions>${getXMLName(this.name)}>label_part`)} ${numberToWords(Math.floor((towns[0].HealLoopCounter + 0.0001) / this.segments + 1))}`;
    };
    this.getSegmentName = function(segment) {
        return this.segmentNames[segment % 3];
    };
    this.visible = function() {
        return towns[0].getLevel("Secrets") >= 20;
    };
    this.unlocked = function() {
        return getSkillLevel("Magic") >= 12;
    };
    this.finish = function() {
        handleSkillExp(this.skills);
        if (towns[0].HealLoopCounter / 3 + 1 >= 10) unlockStory("heal10PatientsInALoop");
    };
}

function FightMonsters() {
    this.varName = "Fight";
    this.name = "Fight Monsters";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.storyReqs = function(storyNum) {
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
    };

    this.stats = {
        Str: 0.3,
        Spd: 0.3,
        Con: 0.3,
        Luck: 0.1
    };
    this.skills = {
        Combat: 10
    };
    this.loopStats = ["Spd", "Spd", "Spd", "Str", "Str", "Str", "Con", "Con", "Con"];
    this.segments = 3;
    this.segmentNames = [];
    this.altSegmentNames = [];
    this.segmentModifiers = [];
    $(_txtsObj("actions>fight_monsters>segment_names>name")).each((_index, monsterName) => {
        this.segmentNames.push($(monsterName).text());
    });
    $(_txtsObj("actions>fight_monsters>segment_alt_names>name")).each((_index, monsterName) => {
        this.altSegmentNames.push($(monsterName).text());
    });
    $(_txtsObj("actions>fight_monsters>segment_modifiers>segment_modifier")).each((_index, modName) => {
        this.segmentModifiers.push($(modName).text());
    });
    this.manaCost = function() {
        return 2000;
    };
    this.canStart = function() {
        return resources.reputation >= 2;
    };
    this.loopCost = function(segment) {
        return fibonacci(Math.floor((towns[0].FightLoopCounter + segment) - towns[0].FightLoopCounter / 3 + 0.0000001)) * 10000;
    };
    this.tickProgress = function(offset) {
        return getSelfCombat() * (1 + getLevel(this.loopStats[(towns[0].FightLoopCounter + offset) % this.loopStats.length]) / 100) * Math.sqrt(1 + towns[0].totalFight / 100);
    };
    this.loopsFinished = function() {
        // empty
    };
    this.segmentFinished = function() {
        addResource("gold", 20);
    };
    this.getPartName = function() {
        const monster = Math.floor(towns[0].FightLoopCounter / 3 + 0.0000001);
        if (monster >= this.segmentNames.length) return this.altSegmentNames[monster % 3];
        return this.segmentNames[monster];
    };
    this.getSegmentName = function(segment) {
        return `${this.segmentModifiers[segment % 3]} ${this.getPartName()}`;
    };
    this.visible = function() {
        return towns[0].getLevel("Secrets") >= 20;
    };
    this.unlocked = function() {
        return getSkillLevel("Combat") >= 10;
    };
    this.finish = function() {
        handleSkillExp(this.skills);
    };
}
// spd, defensive, aggressive
function getMonsterName(FightLoopCounter) {
    let name = new FightMonsters().segmentNames[Math.floor(FightLoopCounter / 3 + 0.0000001)];
    if (!name) {
        name = new FightMonsters().altSegmentNames[Math.floor(FightLoopCounter / 3 + 0.0000001) % 3];
    }
    return name;
}

function SmallDungeon() {
    this.varName = "SDungeon";
    this.name = "Small Dungeon";
    this.expMult = 1;
    this.townNum = 0;
    this.dungeonNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.smallDungeonAttempted;
            case 2:
                return towns[0].totalSDungeon >= 1000;
            case 3:
                return towns[0].totalSDungeon >= 5000;
            case 4:
                return towns[0].totalSDungeon >= 10000;
            case 5:
                return storyReqs.clearSDungeon;
        }
        return false;
    };

    this.stats = {
        Str: 0.1,
        Dex: 0.4,
        Con: 0.3,
        Cha: 0.1,
        Luck: 0.1
    };
    this.skills = {
        Combat: 5,
        Magic: 5
    };
    this.loopStats = ["Dex", "Con", "Dex", "Cha", "Dex", "Str", "Luck"];
    this.segments = 7;
    this.segmentNames = [];
    $(_txtsObj(`actions>${getXMLName(this.name)}>segment_names>name`)).each((_index, segmentName) => {
        this.segmentNames.push($(segmentName).text());
    });
    let ssDivContainer = "";
    for (let i = 0; i < dungeons[this.dungeonNum].length; i++) {
        ssDivContainer += `Floor ${i + 1} |
                            <div class='bold'>${_txt(`actions>${getXMLName(this.name)}>chance_label`)} </div> <div id='soulstoneChance${this.dungeonNum}_${i}'></div>% - 
                            <div class='bold'>${_txt(`actions>${getXMLName(this.name)}>last_stat_label`)} </div> <div id='soulstonePrevious${this.dungeonNum}_${i}'>NA</div> - 
                            <div class='bold'>${_txt(`actions>${getXMLName(this.name)}>label_done`)}</div> <div id='soulstoneCompleted${this.dungeonNum}_${i}'></div><br>`;
    }
    this.completedTooltip = _txt(`actions>${getXMLName(this.name)}>completed_tooltip`) + ssDivContainer;
    this.manaCost = function() {
        return 2000;
    };
    this.canStart = function() {
        const curFloor = Math.floor((towns[this.townNum].SDungeonLoopCounter) / this.segments + 0.0000001);
        return resources.reputation >= 2 && curFloor < dungeons[this.dungeonNum].length;
    };
    this.loopCost = function(segment) {
        return precision3(Math.pow(2, Math.floor((towns[this.townNum].SDungeonLoopCounter + segment) / this.segments + 0.0000001)) * 15000);
    };
    this.tickProgress = function(offset) {
        const floor = Math.floor((towns[this.townNum].SDungeonLoopCounter) / this.segments + 0.0000001);
        return (getSelfCombat() + getSkillLevel("Magic")) * (1 + getLevel(this.loopStats[(towns[this.townNum].SDungeonLoopCounter + offset) % this.loopStats.length]) / 100) * Math.sqrt(1 + dungeons[this.dungeonNum][floor].completed / 200);
    };
    this.loopsFinished = function() {
        const curFloor = Math.floor((towns[this.townNum].SDungeonLoopCounter) / this.segments + 0.0000001 - 1);
        const success = finishDungeon(this.dungeonNum, curFloor);
        if (success === true && storyMax <= 1) {
            unlockGlobalStory(1);
        } else if (success === false && storyMax <= 2) {
            unlockGlobalStory(2);
        }
    };
    this.getPartName = function() {
        const floor = Math.floor((towns[0].SDungeonLoopCounter + 0.0001) / this.segments + 1);
        return _txt(`actions>${getXMLName(this.name)}>label_part`) + floor <= dungeons[this.dungeonNum].length ? numberToWords(floor) : _txt(`actions>${getXMLName(this.name)}>label_complete`);
    };
    this.getSegmentName = function(segment) {
        return this.segmentNames[segment % this.segmentNames.length];
    };
    this.visible = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 15;
    };
    this.unlocked = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    };
    this.finish = function() {
        handleSkillExp(this.skills);
        unlockStory("smallDungeonAttempted");
        if (towns[0].SDungeonLoopCounter >= 42) unlockStory("clearSDungeon");
    };
}
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

function BuySupplies() {
    this.name = "Buy Supplies";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.suppliesBought;
            case 2:
                return storyReqs.suppliesBoughtWithoutHaggling;
        }
        return false;
    };

    this.varName = "Supplies";
    this.stats = {
        Cha: 0.8,
        Luck: 0.1,
        Soul: 0.1
    };
    this.allowed = function() {
        return 1;
    };
    this.manaCost = function() {
        return 200;
    };
    this.canStart = function() {
        return resources.gold >= towns[0].suppliesCost && !resources.supplies;
    };
    this.cost = function() {
        addResource("gold", -towns[0].suppliesCost);
    };
    this.visible = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 15;
    };
    this.unlocked = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    };
    this.finish = function() {
        addResource("supplies", true);
        if (towns[0].suppliesCost === 300) unlockStory("suppliesBoughtWithoutHaggling");
        unlockStory("suppliesBought");
    };
}

function Haggle() {
    this.name = "Haggle";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.haggle;
            case 2:
                return storyReqs.haggle15TimesInALoop;
            case 3:
                return storyReqs.haggle16TimesInALoop;
        }
        return false;
    };

    this.varName = "Haggle";
    this.stats = {
        Cha: 0.8,
        Luck: 0.1,
        Soul: 0.1
    };
    this.manaCost = function() {
        return 100;
    };
    this.canStart = function() {
        return resources.reputation >= 1;
    };
    this.cost = function() {
        addResource("reputation", -1);
    };
    this.visible = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 15;
    };
    this.unlocked = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    };
    this.finish = function() {
        if (towns[0].suppliesCost === 20) unlockStory("haggle15TimesInALoop");
        else if (towns[0].suppliesCost === 0) unlockStory("haggle16TimesInALoop");
        towns[0].suppliesCost -= 20;
        if (towns[0].suppliesCost < 0) {
            towns[0].suppliesCost = 0;
        }
        view.updateResource("supplies");
        unlockStory("haggle");
    };
}

function StartJourney() {
    this.name = "Start Journey";
    this.expMult = 2;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].unlocked;
        }
        return false;
    };

    this.varName = "Journey";
    this.stats = {
        Con: 0.4,
        Per: 0.3,
        Spd: 0.3
    };
    this.allowed = function() {
        return 1;
    };
    this.manaCost = function() {
        return 1000;
    };
    this.canStart = function() {
        return resources.supplies;
    };
    this.cost = function() {
        addResource("supplies", false);
    };
    this.visible = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 15;
    };
    this.unlocked = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    };
    this.finish = function() {
        unlockTown(1);
    };
}

function OpenRift() {
    this.name = "Open Rift";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.varName = "OpenRift";
    this.stats = {
        Int: 0.2,
        Luck: 0.1,
        Soul: 0.7
    };
    this.allowed = function() {
        return 1;
    };
    this.manaCost = function() {
        return 100000;
    };
    this.visible = function() {
        return (getSkillLevel("Dark") >= 100 && getSkillLevel("Magic")) >= 15;
    };
    this.unlocked = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    };
    this.finish = function() {
        unlockTown(1);
    };
}

// town 2
function ExploreForest() {
    this.name = "Explore Forest";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].getLevel("Forest") >= 1;
            case 2:
                return towns[1].getLevel("Forest") >= 10;
            case 3:
                return towns[1].getLevel("Forest") >= 20;
            case 4:
                return towns[1].getLevel("Forest") >= 40;
            case 5:
                return towns[1].getLevel("Forest") >= 50;
            case 6:
                return towns[1].getLevel("Forest") >= 60;
            case 7:
                return towns[1].getLevel("Forest") >= 80;
            case 8:
                return towns[1].getLevel("Forest") >= 100;
        }
        return false;
    };

    this.varName = "Forest";
    this.stats = {
        Per: 0.4,
        Con: 0.2,
        Spd: 0.2,
        Luck: 0.2
    };
    this.affectedBy = ["Buy Glasses"];
    this.manaCost = function() {
        return 400;
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return true;
    };
    this.finish = function() {
        towns[1].finishProgress(this.varName, 100 * (resources.glasses ? 2 : 1));
    };
}
function adjustWildMana() {
    towns[1].totalWildMana = towns[1].getLevel("Forest") * 5 + towns[1].getLevel("Thicket") * 5;
}
function adjustHunt() {
    towns[1].totalHunt = towns[1].getLevel("Forest") * 2;
}
function adjustHerbs() {
    towns[1].totalHerbs = towns[1].getLevel("Forest") * 5 + towns[1].getLevel("Shortcut") * 2 + towns[1].getLevel("Flowers") * 13;
}

function WildMana() {
    this.varName = "WildMana";
    this.name = "Wild Mana";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.tooltip2 = _txt(`actions>${getXMLName(this.name)}>tooltip2`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.infoText = `${_txt(`actions>${getXMLName(this.name)}>info_text1`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text2`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text3`)}
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_found")}: `}</span><div id='total${this.varName}'></div>
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_checked")}: `}</span><div id='checked${this.varName}'></div>`;
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].checkedWildMana >= 1;
        }
        return false;
    };

    this.stats = {
        Con: 0.2,
        Int: 0.6,
        Soul: 0.2
    };
    this.manaCost = function() {
        return Math.ceil(150 / (1 + getSkillLevel("Practical") / 100));
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Forest") >= 2;
    };
    this.finish = function() {
        towns[1].finishRegular(this.varName, 10, () => {
            addMana(goldCostWildMana());
            return goldCostWildMana();
        });
    };
}
function goldCostWildMana() {
    return Math.floor(250 * Math.pow(1 + getSkillLevel("Dark") / 60, 0.25));
}

function GatherHerbs() {
    this.varName = "Herbs";
    this.name = "Gather Herbs";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.infoText = `${_txt(`actions>${getXMLName(this.name)}>info_text1`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text2`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text3`)}
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_found")}: `}</span><div id='total${this.varName}'></div>
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_checked")}: `}</span><div id='checked${this.varName}'></div>`;
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].checkedHerbs >= 1;
        }
        return false;
    };

    this.stats = {
        Str: 0.4,
        Dex: 0.3,
        Int: 0.3
    };
    this.manaCost = function() {
        return Math.ceil(200 * (1 - towns[1].getLevel("Hermit") * 0.005));
    };
    this.visible = function() {
        return towns[1].getLevel("Forest") >= 2;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Forest") >= 10;
    };
    this.finish = function() {
        towns[1].finishRegular(this.varName, 10, () => {
            addResource("herbs", 1);
            return 1;
        });
    };
}

function Hunt() {
    this.varName = "Hunt";
    this.name = "Hunt";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.infoText = `${_txt(`actions>${getXMLName(this.name)}>info_text1`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text2`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text3`)}
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_found")}: `}</span><div id='total${this.varName}'></div>
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_checked")}: `}</span><div id='checked${this.varName}'></div>`;
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].checkedHunt >= 1;
            case 2:
                return towns[1].goodHunt >= 10;
            case 3:
                return towns[1].goodHunt >= 20;
        }
        return false;
    };

    this.stats = {
        Dex: 0.2,
        Con: 0.2,
        Per: 0.2,
        Spd: 0.4
    };
    this.manaCost = function() {
        return 800;
    };
    this.visible = function() {
        return towns[1].getLevel("Forest") >= 10;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Forest") >= 40;
    };
    this.finish = function() {
        towns[1].finishRegular(this.varName, 10, () => {
            addResource("hide", 1);
            return 1;
        });
    };
}

function SitByWaterfall() {
    this.name = "Sit By Waterfall";
    this.expMult = 4;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.satByWaterfall;
        }
        return false;
    };

    this.varName = "Waterfall";
    this.stats = {
        Con: 0.2,
        Soul: 0.8
    };
    this.allowed = function() {
        return trainingLimits;
    };
    this.manaCost = function() {
        return 2000;
    };
    this.visible = function() {
        return towns[1].getLevel("Forest") >= 10;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Forest") >= 70;
    };
    this.finish = function() {
        unlockStory("satByWaterfall");
    };
}

function OldShortcut() {
    this.name = "Old Shortcut";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].getLevel("Shortcut") >= 1;
            case 2:
                return towns[1].getLevel("Shortcut") >= 10;
            case 3:
                return towns[1].getLevel("Shortcut") >= 20;
            case 4:
                return towns[1].getLevel("Shortcut") >= 40;
            case 5:
                return towns[1].getLevel("Shortcut") >= 60;
            case 6:
                return towns[1].getLevel("Shortcut") >= 80;
            case 7:
                return towns[1].getLevel("Shortcut") >= 100;
        }
        return false;
    };

    this.varName = "Shortcut";
    this.stats = {
        Per: 0.3,
        Con: 0.4,
        Spd: 0.2,
        Luck: 0.1
    };
    this.manaCost = function() {
        return 800;
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Forest") >= 20;
    };
    this.finish = function() {
        towns[1].finishProgress(this.varName, 100);
        view.adjustManaCost("Continue On");
    };
}

function TalkToHermit() {
    this.name = "Talk To Hermit";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].getLevel("Hermit") >= 1;
            case 2:
                return towns[1].getLevel("Hermit") >= 10;
            case 3:
                return towns[1].getLevel("Hermit") >= 20;
            case 4:
                return towns[1].getLevel("Hermit") >= 40;
            case 5:
                return towns[1].getLevel("Hermit") >= 60;
            case 6:
                return towns[1].getLevel("Hermit") >= 80;
            case 7:
                return towns[1].getLevel("Hermit") >= 100;
        }
        return false;
    };

    this.varName = "Hermit";
    this.stats = {
        Con: 0.5,
        Cha: 0.3,
        Soul: 0.2
    };
    this.manaCost = function() {
        return 1200;
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Shortcut") >= 20 && getSkillLevel("Magic") >= 40;
    };
    this.finish = function() {
        towns[1].finishProgress(this.varName, 50 * (1 + towns[1].getLevel("Shortcut") / 100));
        view.adjustManaCost("Learn Alchemy");
        view.adjustManaCost("Gather Herbs");
        view.adjustManaCost("Practical Magic");
    };
}

function PracticalMagic() {
    this.name = "Practical Magic";
    this.expMult = 1.5;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return getSkillLevel("Practical") >= 1;
        }
        return false;
    };

    this.varName = "trPractical";
    this.stats = {
        Per: 0.3,
        Con: 0.2,
        Int: 0.5
    };
    this.skills = {
        Practical: 100
    };
    this.manaCost = function() {
        return Math.ceil(4000 * (1 - towns[1].getLevel("Hermit") * 0.005));
    };
    this.visible = function() {
        return towns[1].getLevel("Hermit") >= 10;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Hermit") >= 20 && getSkillLevel("Magic") >= 50;
    };
    this.finish = function() {
        handleSkillExp(this.skills);
        view.adjustManaCost("Wild Mana");
        view.adjustManaCost("Smash Pots");
        view.adjustGoldCosts();
    };
}

function LearnAlchemy() {
    this.name = "Learn Alchemy";
    this.expMult = 1.5;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return skills.Alchemy.exp >= 50;
            case 2:
                return getSkillLevel("Alchemy") >= 25;
            case 3:
                return getSkillLevel("Alchemy") >= 50;
        }
        return false;
    };

    this.varName = "learnAlchemy";
    this.stats = {
        Con: 0.3,
        Per: 0.1,
        Int: 0.6
    };
    this.skills = {
        Magic: 50,
        Alchemy: 50
    };
    this.canStart = function() {
        return resources.herbs >= 10;
    };
    this.cost = function() {
        addResource("herbs", -10);
    };
    this.manaCost = function() {
        return Math.ceil(5000 * (1 - towns[1].getLevel("Hermit") * 0.005));
    };
    this.visible = function() {
        return towns[1].getLevel("Hermit") >= 10;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Hermit") >= 40 && getSkillLevel("Magic") >= 60;
    };
    this.finish = function() {
        handleSkillExp(this.skills);
        view.adjustExpGain(new MageLessons());
    };
}

function BrewPotions() {
    this.varName = "Potions";
    this.name = "Brew Potions";
    this.expMult = 1.5;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.potionBrewed;
            case 2:
                return storyReqs.failedBrewPotions;
            case 3:
                return storyReqs.failedBrewPotionsNegativeRep;
        }
        return false;
    };

    this.stats = {
        Dex: 0.3,
        Int: 0.6,
        Luck: 0.1,
    };
    this.skills = {
        Magic: 50,
        Alchemy: 25
    };
    this.canStart = function() {
        return resources.herbs >= 10 && resources.reputation >= 5;
    };
    this.cost = function() {
        addResource("herbs", -10);
    };
    this.manaCost = function() {
        return Math.ceil(4000);
    };
    this.visible = function() {
        return getSkillLevel("Alchemy") >= 1;
    };
    this.unlocked = function() {
        return getSkillLevel("Alchemy") >= 10;
    };
    this.finish = function() {
        addResource("potions", 1);
        handleSkillExp(this.skills);
        unlockStory("potionBrewed");
    };
}

function TrainDexterity() {
    this.name = "Train Dexterity";
    this.expMult = 4;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.dexterityTrained;
        }
        return false;
    };

    this.varName = "trDex";
    this.stats = {
        Dex: 0.8,
        Con: 0.2
    };
    this.allowed = function() {
        return trainingLimits;
    };
    this.manaCost = function() {
        return 2000;
    };
    this.visible = function() {
        return towns[1].getLevel("Forest") >= 20;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Forest") >= 60;
    };
    this.finish = function() {
        unlockStory("dexterityTrained");
    };
}

function TrainSpeed() {
    this.name = "Train Speed";
    this.expMult = 4;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.speedTrained;
        }
        return false;
    };

    this.varName = "trSpd";
    this.stats = {
        Spd: 0.8,
        Con: 0.2
    };
    this.allowed = function() {
        return trainingLimits;
    };
    this.manaCost = function() {
        return 2000;
    };
    this.visible = function() {
        return towns[1].getLevel("Forest") >= 20;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Forest") >= 80;
    };
    this.finish = function() {
        unlockStory("speedTrained");
    };
}

function FollowFlowers() {
    this.name = "Follow Flowers";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].getLevel("Flowers") >= 1;
            case 2:
                return towns[1].getLevel("Flowers") >= 10;
            case 3:
                return towns[1].getLevel("Flowers") >= 20;
            case 4:
                return towns[1].getLevel("Flowers") >= 40;
            case 5:
                return towns[1].getLevel("Flowers") >= 60;
            case 6:
                return towns[1].getLevel("Flowers") >= 80;
            case 7:
                return towns[1].getLevel("Flowers") >= 100;
        }
        return false;
    };

    this.varName = "Flowers";
    this.stats = {
        Per: 0.7,
        Con: 0.1,
        Spd: 0.2
    };
    this.affectedBy = ["Buy Glasses"];
    this.manaCost = function() {
        return 300;
    };
    this.visible = function() {
        return towns[1].getLevel("Forest") >= 30;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Forest") >= 50;
    };
    this.finish = function() {
        towns[1].finishProgress(this.varName, 100 * (resources.glasses ? 2 : 1));
    };
}

function BirdWatching() {
    this.name = "Bird Watching";
    this.expMult = 4;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.birdsWatched;
        }
        return false;
    };

    this.varName = "BirdWatching";
    this.stats = {
        Per: 0.8,
        Int: 0.2
    };
    this.affectedBy = ["Buy Glasses"];
    this.allowed = function() {
        return trainingLimits;
    };
    this.manaCost = function() {
        return 2000;
    };
    this.canStart = function() {
        return resources.glasses;
    };
    this.visible = function() {
        return towns[1].getLevel("Flowers") >= 30;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Flowers") >= 80;
    };
    this.finish = function() {
        unlockStory("birdsWatched");
    };
}

function ClearThicket() {
    this.name = "Clear Thicket";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].getLevel("Thicket") >= 1;
            case 2:
                return towns[1].getLevel("Thicket") >= 10;
            case 3:
                return towns[1].getLevel("Thicket") >= 20;
            case 4:
                return towns[1].getLevel("Thicket") >= 40;
            case 5:
                return towns[1].getLevel("Thicket") >= 60;
            case 6:
                return towns[1].getLevel("Thicket") >= 80;
            case 7:
                return towns[1].getLevel("Thicket") >= 100;
        }
        return false;
    };

    this.varName = "Thicket";
    this.stats = {
        Dex: 0.1,
        Str: 0.2,
        Per: 0.3,
        Con: 0.2,
        Spd: 0.2
    };
    this.manaCost = function() {
        return 500;
    };
    this.visible = function() {
        return towns[1].getLevel("Flowers") >= 10;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Flowers") >= 20;
    };
    this.finish = function() {
        towns[1].finishProgress(this.varName, 100);
    };
}

function TalkToWitch() {
    this.name = "Talk To Witch";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[1].getLevel("Witch") >= 1;
            case 2:
                return towns[1].getLevel("Witch") >= 10;
            case 3:
                return towns[1].getLevel("Witch") >= 20;
            case 4:
                return towns[1].getLevel("Witch") >= 40;
            case 5:
                return towns[1].getLevel("Witch") >= 50;
            case 6:
                return towns[1].getLevel("Witch") >= 60;
            case 7:
                return towns[1].getLevel("Witch") >= 80;
            case 8:
                return towns[1].getLevel("Witch") >= 100;
        }
        return false;
    };

    this.varName = "Witch";
    this.stats = {
        Cha: 0.3,
        Int: 0.2,
        Soul: 0.5
    };
    this.manaCost = function() {
        return 1500;
    };
    this.visible = function() {
        return towns[1].getLevel("Thicket") >= 20;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Thicket") >= 60 && getSkillLevel("Magic") >= 80;
    };
    this.finish = function() {
        towns[1].finishProgress(this.varName, 100);
        view.adjustManaCost("Dark Magic");
        view.adjustManaCost("Dark Ritual");
    };
}

function DarkMagic() {
    this.name = "Dark Magic";
    this.expMult = 1.5;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return getSkillLevel("Dark") >= 1;
            case 2:
                return getSkillLevel("Dark") >= 25;
            case 3:
                return getSkillLevel("Dark") >= 50;
        }
        return false;
    };

    this.varName = "trDark";
    this.stats = {
        Con: 0.2,
        Int: 0.5,
        Soul: 0.3
    };
    this.skills = {
        Dark() {
            return Math.floor(100 * (1 + getBuffLevel("Ritual") / 100));
        }
    };
    this.manaCost = function() {
        return Math.ceil(6000 * (1 - towns[1].getLevel("Witch") * 0.005));
    };
    this.canStart = function() {
        return resources.reputation <= 0;
    };
    this.cost = function() {
        addResource("reputation", -1);
    };
    this.visible = function() {
        return towns[1].getLevel("Witch") >= 10;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Witch") >= 20 && getSkillLevel("Magic") >= 100;
    };
    this.finish = function() {
        handleSkillExp(this.skills);
        view.adjustGoldCost("Pots", goldCostSmashPots());
        view.adjustGoldCost("WildMana", goldCostWildMana());
    };
}

function DarkRitual() {
    this.varName = "DarkRitual";
    this.name = "Dark Ritual";
    this.expMult = 10;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.tooltip2 = _txt(`actions>${getXMLName(this.name)}>tooltip2`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return storyReqs.darkRitualThirdSegmentReached;
            case 2:
                return getBuffLevel("Ritual") >= 1;
        }
        return false;
    };

    this.stats = {
        Spd: 0.1,
        Int: 0.1,
        Soul: 0.8
    };
    this.loopStats = ["Spd", "Int", "Soul"];
    this.segments = 3;
    this.segmentNames = [];
    $(_txtsObj(`actions>${getXMLName(this.name)}>segment_names>name`)).each((_index, segmentName) => {
        this.segmentNames.push($(segmentName).text());
    });
    this.manaCost = function() {
        return Math.ceil(50000 * (1 - towns[1].getLevel("Witch") * 0.005));
    };
    this.allowed = function() {
        return 1;
    };
    this.canStart = function() {
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
    };
    this.loopCost = function(segment) {
        return 1000000 * (segment * 2 + 1);
    };
    this.tickProgress = function(offset) {
        return getSkillLevel("Dark") * (1 + getLevel(this.loopStats[(towns[1].DarkRitualLoopCounter + offset) % this.loopStats.length]) / 100) / (1 - towns[1].getLevel("Witch") * 0.005);
    };
    this.loopsFinished = function() {
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
        view.adjustGoldCost("DarkRitual", goldCostDarkRitual());
    };
    this.getPartName = function() {
        return "Perform Dark Ritual";
    };
    this.getSegmentName = function(segment) {
        return this.segmentNames[segment % 3];
    };
    this.visible = function() {
        return towns[1].getLevel("Witch") >= 20;
    };
    this.unlocked = function() {
        const toUnlock = towns[1].getLevel("Witch") >= 50 && getSkillLevel("Dark") >= 50;
        if (toUnlock && !isVisible(document.getElementById("buffList"))) {
            document.getElementById("buffList").style.display = "flex";
            document.getElementById(`buffRitualContainer`).style.display = "flex";
        }
        return toUnlock;
    };
    this.finish = function() {
        view.updateBuff("Ritual");
        view.adjustExpGain(new DarkMagic());
        if (towns[1].DarkRitualLoopCounter >= 2) unlockStory("darkRitualThirdSegmentReached");
    };
}
function goldCostDarkRitual() {
    return 50 * (getBuffLevel("Ritual") + 1);
}

function ContinueOn() {
    this.varName = "Continue";
    this.name = "Continue On";
    this.expMult = 2;
    this.townNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.storyReqs = function(storyNum) {
        switch (storyNum) {
            case 1:
                return towns[2].unlocked;
        }
        return false;
    };

    this.stats = {
        Con: 0.4,
        Per: 0.2,
        Spd: 0.4
    };
    this.allowed = function() {
        return 1;
    };
    this.manaCost = function() {
        return Math.ceil(8000 - (60 * towns[1].getLevel("Shortcut")));
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return true;
    };
    this.finish = function() {
        unlockTown(2);
    };
}

function ExploreCity() {
    this.name = "Explore City";
    this.expMult = 1;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.varName = "City";
    this.stats = {
        Con: 0.1,
        Per: 0.3,
        Cha: 0.2,
        Spd: 0.3,
        Luck: 0.1
    };
    this.affectedBy = ["Buy Glasses"];
    this.manaCost = function() {
        return 750;
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return true;
    };
    this.finish = function() {
        towns[2].finishProgress(this.varName, 100 * (resources.glasses ? 2 : 1));
    };
}
function adjustSuckers() {
    towns[2].totalGamble = towns[2].getLevel("City") * 3;
}

function Gamble() {
    this.varName = "Gamble";
    this.name = "Gamble";
    this.expMult = 2;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.infoText = `${_txt(`actions>${getXMLName(this.name)}>info_text1`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text2`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text3`)}
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_found")}: `}</span><div id='total${this.varName}'></div>
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_checked")}: `}</span><div id='checked${this.varName}'></div>`;

    this.stats = {
        Cha: 0.2,
        Luck: 0.8
    };
    this.canStart = function() {
        return resources.gold >= 20 && resources.reputation >= -5;
    };
    this.cost = function() {
        addResource("gold", -20);
        addResource("reputation", -1);
    };
    this.manaCost = function() {
        return 1000;
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return towns[2].getLevel("City") >= 10;
    };
    this.finish = function() {
        towns[2].finishRegular(this.varName, 10, () => {
            addResource("gold", 60);
            return 60;
        });
    };
}

function GetDrunk() {
    this.name = "Get Drunk";
    this.expMult = 3;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.varName = "Drunk";
    this.stats = {
        Str: 0.1,
        Cha: 0.5,
        Con: 0.2,
        Soul: 0.2
    };
    this.canStart = function() {
        return resources.reputation >= -3;
    };
    this.cost = function() {
        addResource("reputation", -1);
    };
    this.manaCost = function() {
        return 1000;
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return towns[2].getLevel("City") >= 20;
    };
    this.finish = function() {
        towns[2].finishProgress(this.varName, 100);
    };
}

function PurchaseMana() {
    this.varName = "Gold2";
    this.name = "Purchase Mana";
    this.expMult = 1;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.stats = {
        Cha: 0.7,
        Int: 0.2,
        Luck: 0.1
    };
    this.manaCost = function() {
        return 100;
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return true;
    };
    this.finish = function() {
        addMana(resources.gold * 50);
        resetResource("gold");
    };
}

function SellPotions() {
    this.varName = "SellPotions";
    this.name = "Sell Potions";
    this.expMult = 1;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.stats = {
        Cha: 0.7,
        Int: 0.2,
        Luck: 0.1
    };
    this.manaCost = function() {
        return 1000;
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return true;
    };
    this.finish = function() {
        addResource("gold", resources.potions * getSkillLevel("Alchemy"));
        resetResource("potions");
    };
}

function JoinAdvGuild() {
    this.varName = "AdvGuild";
    this.name = "Adventure Guild";
    this.expMult = 1;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.stats = {
        Str: 0.4,
        Dex: 0.3,
        Con: 0.3
    };
    this.loopStats = ["Str", "Dex", "Con"];
    this.segments = 3;
    this.manaCost = function() {
        return 3000;
    };
    this.allowed = function() {
        return 1;
    };
    this.canStart = function() {
        return guild === "";
    };
    this.loopCost = function(segment) {
        return precision3(Math.pow(1.2, towns[2].AdvGuildLoopCounter + segment)) * 5e6;
    };
    this.tickProgress = function(offset) {
        return (getSkillLevel("Magic") / 2 +
                getSelfCombat("Combat")) *
                (1 + getLevel(this.loopStats[(towns[2].AdvGuildLoopCounter + offset) % this.loopStats.length]) / 100) *
                Math.sqrt(1 + towns[2].totalAdvGuild / 1000);
    };
    this.loopsFinished = function() {
        // empty
    };
    this.segmentFinished = function() {
        curAdvGuildSegment++;
        addMana(200);
    };
    this.getPartName = function() {
        return `Rank ${getAdvGuildRank().name}`;
    };
    this.getSegmentName = function(segment) {
        return `Rank ${getAdvGuildRank(segment % 3).name}`;
    };
    this.visible = function() {
        return towns[2].getLevel("Drunk") >= 5;
    };
    this.unlocked = function() {
        return towns[2].getLevel("Drunk") >= 20;
    };
    this.finish = function() {
        guild = "Adventure";
    };
}
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

function GatherTeam() {
    this.varName = "GatherTeam";
    this.name = "Gather Team";
    this.expMult = 3;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.stats = {
        Per: 0.2,
        Cha: 0.5,
        Int: 0.2,
        Luck: 0.1
    };
    this.affectedBy = ["Adventure Guild"];
    this.allowed = function() {
        return 5;
    };
    this.canStart = function() {
        return guild === "Adventure" && resources.gold >= (resources.teamMembers + 1) * 200;
    };
    this.cost = function() {
        // cost comes after finish
        addResource("gold", -(resources.teamMembers) * 200);
    };
    this.manaCost = function() {
        return 2000;
    };
    this.visible = function() {
        return towns[2].getLevel("Drunk") >= 10;
    };
    this.unlocked = function() {
        return towns[2].getLevel("Drunk") >= 20;
    };
    this.finish = function() {
        addResource("teamMembers", 1);
    };
}

function LargeDungeon() {
    this.varName = "LDungeon";
    this.name = "Large Dungeon";
    this.expMult = 2;
    this.townNum = 2;
    this.dungeonNum = 1;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.stats = {
        Str: 0.2,
        Dex: 0.2,
        Con: 0.2,
        Cha: 0.3,
        Luck: 0.1
    };
    this.skills = {
        Combat: 15,
        Magic: 15
    };
    this.loopStats = ["Cha", "Spd", "Str", "Cha", "Dex", "Dex", "Str"];
    this.segments = 7;
    this.segmentNames = [];
    $(_txtsObj(`actions>${getXMLName(this.name)}>segment_names>name`)).each((_index, segmentName) => {
        this.segmentNames.push($(segmentName).text());
    });
    let ssDivContainer = "";
    for (let i = 0; i < dungeons[this.dungeonNum].length; i++) {
        ssDivContainer += `Floor ${i + 1} |
                            <div class='bold'>${_txt(`actions>${getXMLName(this.name)}>chance_label`)} </div> <div id='soulstoneChance${this.dungeonNum}_${i}'></div>% - 
                            <div class='bold'>${_txt(`actions>${getXMLName(this.name)}>last_stat_label`)} </div> <div id='soulstonePrevious${this.dungeonNum}_${i}'>NA</div> - 
                            <div class='bold'>${_txt(`actions>${getXMLName(this.name)}>label_done`)}</div> <div id='soulstoneCompleted${this.dungeonNum}_${i}'></div><br>`;
    }
    this.completedTooltip = _txt(`actions>${getXMLName(this.name)}>completed_tooltip`) +
        ssDivContainer;
    this.affectedBy = ["Gather Team"];
    this.manaCost = function() {
        return 6000;
    };
    this.canStart = function() {
        const curFloor = Math.floor((towns[this.townNum].LDungeonLoopCounter) / this.segments + 0.0000001);
        return resources.teamMembers >= 1 && curFloor < dungeons[this.dungeonNum].length;
    };
    this.loopCost = function(segment) {
        return precision3(Math.pow(3, Math.floor((towns[this.townNum].LDungeonLoopCounter + segment) / this.segments + 0.0000001)) * 5e5);
    };
    this.tickProgress = function(offset) {
        const floor = Math.floor((towns[this.townNum].LDungeonLoopCounter) / this.segments + 0.0000001);
        return (getTeamCombat() + getSkillLevel("Magic")) * (1 + getLevel(this.loopStats[(towns[this.townNum].LDungeonLoopCounter + offset) % this.loopStats.length]) / 100) * Math.sqrt(1 + dungeons[this.dungeonNum][floor].completed / 200);
    };
    this.loopsFinished = function() {
        const curFloor = Math.floor((towns[this.townNum].LDungeonLoopCounter) / this.segments + 0.0000001 - 1);
        const success = finishDungeon(this.dungeonNum, curFloor);
        if (success && storyMax <= 1) {
            // unlockGlobalStory(1);
        } else if (storyMax <= 2) {
            // unlockGlobalStory(2);
        }
    };
    this.getPartName = function() {
        const floor = Math.floor((towns[2].LDungeonLoopCounter + 0.0001) / this.segments + 1);
        return _txt(`actions>${getXMLName(this.name)}>label_part`) + floor <= dungeons[this.dungeonNum].length ? numberToWords(floor) : _txt(`actions>${getXMLName(this.name)}>label_complete`);
    };
    this.getSegmentName = function(segment) {
        return this.segmentNames[segment % this.segmentNames.length];
    };
    this.visible = function() {
        return towns[2].getLevel("Drunk") >= 5;
    };
    this.unlocked = function() {
        return towns[2].getLevel("Drunk") >= 20;
    };
    this.finish = function() {
        handleSkillExp(this.skills);
    };
}

function CraftingGuild() {
    this.name = "Crafting Guild";
    this.expMult = 1;
    this.townNum = 2;

    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.varName = "CraftGuild";
    this.stats = {
        Dex: 0.3,
        Per: 0.3,
        Int: 0.4
    };
    this.skills = {
        Crafting: 50
    };
    this.loopStats = ["Int", "Per", "Dex"];
    this.segments = 3;
    this.manaCost = function() {
        return 3000;
    };
    this.allowed = function() {
        return 1;
    };
    this.canStart = function() {
        return guild === "";
    };
    this.loopCost = function(segment) {
        return precision3(Math.pow(1.2, towns[2].CraftGuildLoopCounter + segment)) * 2e6;
    };
    this.tickProgress = function(offset) {
        return (getSkillLevel("Magic") / 2 +
                getSkillLevel("Crafting")) *
                (1 + getLevel(this.loopStats[(towns[2].CraftGuildLoopCounter + offset) % this.loopStats.length]) / 100) *
                Math.sqrt(1 + towns[2].totalCraftGuild / 1000);
    };
    this.segmentFinished = function() {
        curCraftGuildSegment++;
        handleSkillExp(this.skills);
        addResource("gold", 10);
    };
    this.getPartName = function() {
        return `Rank ${getCraftGuildRank().name}`;
    };
    this.getSegmentName = function(segment) {
        return `Rank ${getCraftGuildRank(segment % 3).name}`;
    };
    this.visible = function() {
        return towns[2].getLevel("Drunk") >= 5;
    };
    this.unlocked = function() {
        return towns[2].getLevel("Drunk") >= 30;
    };
    this.finish = function() {
        guild = "Crafting";
    };
}
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

function CraftArmor() {
    this.varName = "CraftArmor";
    this.name = "Craft Armor";
    this.expMult = 1;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.stats = {
        Str: 0.1,
        Dex: 0.3,
        Con: 0.3,
        Int: 0.3
    };
    // this.affectedBy = ["Crafting Guild"];
    this.canStart = function() {
        return resources.hide >= 2;
    };
    this.cost = function() {
        addResource("hide", -2);
    };
    this.manaCost = function() {
        return 1000;
    };
    this.visible = function() {
        return towns[2].getLevel("Drunk") >= 15;
    };
    this.unlocked = function() {
        return towns[2].getLevel("Drunk") >= 30;
    };
    this.finish = function() {
        addResource("armor", 1);
    };
}

function Apprentice() {
    this.varName = "Apprentice";
    this.name = "Apprentice";
    this.expMult = 1.5;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.stats = {
        Dex: 0.2,
        Int: 0.4,
        Cha: 0.4
    };
    this.skills = {
        Crafting() {
            return 10 * (1 + towns[2].getLevel("Apprentice") / 100);
        }
    };
    this.affectedBy = ["Crafting Guild"];
    this.canStart = function() {
        return guild === "Crafting";
    };
    this.manaCost = function() {
        return 2000;
    };
    this.visible = function() {
        return towns[2].getLevel("Drunk") >= 20;
    };
    this.unlocked = function() {
        return towns[2].getLevel("Drunk") >= 40;
    };
    this.finish = function() {
        towns[2].finishProgress(this.varName, 30 * getCraftGuildRank().bonus);
        handleSkillExp(this.skills);
        view.adjustExpGain(new Apprentice());
    };
}

function Mason() {
    this.varName = "Mason";
    this.name = "Mason";
    this.expMult = 2;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.stats = {
        Dex: 0.2,
        Int: 0.5,
        Cha: 0.3
    };
    this.skills = {
        Crafting() {
            return 20 * (1 + towns[2].getLevel("Mason") / 100);
        }
    };
    this.affectedBy = ["Crafting Guild"];
    this.canStart = function() {
        return guild === "Crafting";
    };
    this.manaCost = function() {
        return 2000;
    };
    this.visible = function() {
        return towns[2].getLevel("Drunk") >= 40;
    };
    this.unlocked = function() {
        return towns[2].getLevel("Drunk") >= 60 && towns[2].getLevel("Apprentice") >= 100;
    };
    this.finish = function() {
        towns[2].finishProgress(this.varName, 20 * getCraftGuildRank().bonus);
        handleSkillExp(this.skills);
    };
}

function Architect() {
    this.varName = "Architect";
    this.name = "Architect";
    this.expMult = 2.5;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.stats = {
        Dex: 0.2,
        Int: 0.6,
        Cha: 0.2
    };
    this.skills = {
        Crafting() {
            return 40 * (1 + towns[2].getLevel("Architect") / 100);
        }
    };
    this.affectedBy = ["Crafting Guild"];
    this.canStart = function() {
        return guild === "Crafting";
    };
    this.manaCost = function() {
        return 2000;
    };
    this.visible = function() {
        return towns[2].getLevel("Drunk") >= 60;
    };
    this.unlocked = function() {
        return towns[2].getLevel("Drunk") >= 80 && towns[2].getLevel("Mason") >= 100;
    };
    this.finish = function() {
        towns[2].finishProgress(this.varName, 10 * getCraftGuildRank().bonus);
        handleSkillExp(this.skills);
    };
}

function ReadBooks() {
    this.varName = "ReadBooks";
    this.name = "Read Books";
    this.expMult = 4;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.stats = {
        Int: 0.8,
        Soul: 0.2
    };
    this.affectedBy = ["Buy Glasses"];
    this.allowed = function() {
        return trainingLimits;
    };
    this.canStart = function() {
        return resources.glasses;
    };
    this.manaCost = function() {
        return 2000;
    };
    this.visible = function() {
        return towns[2].getLevel("City") >= 5;
    };
    this.unlocked = function() {
        return towns[2].getLevel("City") >= 50;
    };
    this.finish = function() {
        // empty
    };
}

function BuyPickaxe() {
    this.name = "Buy Pickaxe";
    this.expMult = 1;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.varName = "Pickaxe";
    this.stats = {
        Cha: 0.8,
        Int: 0.1,
        Spd: 0.1
    };
    this.allowed = function() {
        return 1;
    };
    this.canStart = function() {
        return resources.gold >= 200;
    };
    this.cost = function() {
        addResource("gold", -200);
    };
    this.manaCost = function() {
        return 3000;
    };
    this.visible = function() {
        return towns[2].getLevel("City") >= 60;
    };
    this.unlocked = function() {
        return towns[2].getLevel("City") >= 90;
    };
    this.finish = function() {
        addResource("pickaxe", true);
    };
}

function StartTrek() {
    this.varName = "StartTrek";
    this.name = "Start Trek";
    this.expMult = 2;
    this.townNum = 2;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.stats = {
        Con: 0.7,
        Per: 0.2,
        Spd: 0.1
    };
    this.allowed = function() {
        return 1;
    };
    this.manaCost = function() {
        return Math.ceil(12000);
    };
    this.visible = function() {
        return towns[2].getLevel("City") >= 30;
    };
    this.unlocked = function() {
        return towns[2].getLevel("City") >= 60;
    };
    this.finish = function() {
        unlockTown(3);
    };
}

function ClimbMountain() {
    this.name = "Climb Mountain";
    this.expMult = 1;
    this.townNum = 3;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.varName = "Mountain";
    this.stats = {
        Dex: 0.1,
        Str: 0.2,
        Con: 0.4,
        Per: 0.2,
        Spd: 0.1
    };
    this.affectedBy = ["Buy Pickaxe"];
    this.manaCost = function() {
        return 800;
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return true;
    };
    this.finish = function() {
        towns[3].finishProgress(this.varName, 100 * (resources.pickaxe ? 2 : 1));
    };
}

function ManaGeyser() {
    this.varName = "Geysers";
    this.name = "Mana Geyser";
    this.expMult = 1;
    this.townNum = 3;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.infoText = `${_txt(`actions>${getXMLName(this.name)}>info_text1`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text2`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text3`)}
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_found")}: `}</span><div id='total${this.varName}'></div>
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_checked")}: `}</span><div id='checked${this.varName}'></div>`;

    this.stats = {
        Str: 0.6,
        Per: 0.3,
        Int: 0.1,
    };
    this.affectedBy = ["Buy Pickaxe"];
    this.manaCost = function() {
        return 2000;
    };
    this.canStart = function() {
        return resources.pickaxe;
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Mountain") >= 2;
    };
    this.finish = function() {
        towns[3].finishRegular(this.varName, 100, () => {
            addMana(5000);
            return 5000;
        });
    };
}
function adjustGeysers() {
    towns[3].totalGeysers = towns[3].getLevel("Mountain") * 10;
}

function DecipherRunes() {
    this.name = "Decipher Runes";
    this.expMult = 1;
    this.townNum = 3;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.varName = "Runes";
    this.stats = {
        Per: 0.3,
        Int: 0.7
    };
    this.affectedBy = ["Buy Glasses"];
    this.manaCost = function() {
        return 1200;
    };
    this.visible = function() {
        return towns[3].getLevel("Mountain") >= 2;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Mountain") >= 20;
    };
    this.finish = function() {
        towns[3].finishProgress(this.varName, 100 * (resources.glasses ? 2 : 1));
        view.adjustManaCost("Chronomancy");
        view.adjustManaCost("Pyromancy");
    };
}

function Chronomancy() {
    this.name = "Chronomancy";
    this.expMult = 2;
    this.townNum = 3;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.varName = "trChronomancy";
    this.stats = {
        Soul: 0.1,
        Spd: 0.3,
        Int: 0.6
    };
    this.skills = {
        Chronomancy: 100
    };
    this.manaCost = function() {
        return Math.ceil(10000 * (1 - towns[3].getLevel("Runes") * 0.005));
    };
    this.visible = function() {
        return towns[3].getLevel("Runes") >= 8;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Runes") >= 30 && getSkillLevel("Magic") >= 150;
    };
    this.finish = function() {
        handleSkillExp(this.skills);
    };
}

function LoopingPotion() {
    this.varName = "LoopingPotion";
    this.name = "Looping Potion";
    this.expMult = 2;
    this.townNum = 3;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.stats = {
        Dex: 0.2,
        Int: 0.7,
        Soul: 0.1,
    };
    this.skills = {
        Alchemy: 100
    };
    this.canStart = function() {
        return resources.herbs >= 200;
    };
    this.cost = function() {
        addResource("herbs", -200);
    };
    this.manaCost = function() {
        return Math.ceil(30000);
    };
    this.visible = function() {
        return getSkillLevel("Alchemy") >= 10 && getSkillLevel("Chronomancy") >= 20;
    };
    this.unlocked = function() {
        return getSkillLevel("Alchemy") >= 60 && getSkillLevel("Chronomancy") >= 100;
    };
    this.finish = function() {
        addResource("loopingPotion", true);
        handleSkillExp(this.skills);
    };
}

function Pyromancy() {
    this.name = "Pyromancy";
    this.expMult = 2;
    this.townNum = 3;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.varName = "trPyromancy";
    this.stats = {
        Per: 0.2,
        Int: 0.7,
        Soul: 0.1
    };
    this.skills = {
        Pyromancy: 100
    };
    this.manaCost = function() {
        return Math.ceil(14000 * (1 - towns[3].getLevel("Runes") * 0.005));
    };
    this.visible = function() {
        return towns[3].getLevel("Runes") >= 16;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Runes") >= 60 && getSkillLevel("Magic") >= 200;
    };
    this.finish = function() {
        handleSkillExp(this.skills);
    };
}

function ExploreCavern() {
    this.name = "Explore Cavern";
    this.expMult = 1;
    this.townNum = 3;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.varName = "Cavern";
    this.stats = {
        Dex: 0.1,
        Str: 0.3,
        Con: 0.2,
        Per: 0.3,
        Spd: 0.1
    };
    this.manaCost = function() {
        return 1500;
    };
    this.visible = function() {
        return towns[3].getLevel("Mountain") >= 10;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Mountain") >= 40;
    };
    this.finish = function() {
        towns[3].finishProgress(this.varName, 100);
    };
}

function MineSoulstones() {
    this.varName = "MineSoulstones";
    this.name = "Mine Soulstones";
    this.expMult = 1;
    this.townNum = 3;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.infoText = `${_txt(`actions>${getXMLName(this.name)}>info_text1`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text2`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text3`)}
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_found")}: `}</span><div id='total${this.varName}'></div>
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_checked")}: `}</span><div id='checked${this.varName}'></div>`;

    this.stats = {
        Str: 0.6,
        Dex: 0.1,
        Con: 0.3,
    };
    this.affectedBy = ["Buy Pickaxe"];
    this.manaCost = function() {
        return 5000;
    };
    this.canStart = function() {
        return resources.pickaxe;
    };
    this.visible = function() {
        return towns[3].getLevel("Cavern") >= 2;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Cavern") >= 20;
    };
    this.finish = function() {
        towns[3].finishRegular(this.varName, 10, () => {
            const statToAdd = statList[Math.floor(Math.random() * statList.length)];
            stats[statToAdd].soulstone += 1;
            view.updateSoulstones();
        });
    };
}

function adjustMineSoulstones() {
    towns[3].totalMineSoulstones = towns[3].getLevel("Cavern") * 3;
}

function HuntTrolls() {
    this.varName = "HuntTrolls";
    this.name = "Hunt Trolls";
    this.expMult = 1.5;
    this.townNum = 3;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.stats = {
        Str: 0.3,
        Dex: 0.3,
        Con: 0.2,
        Per: 0.1,
        Int: 0.1
    };
    this.skills = {
        Combat: 1000
    };
    this.loopStats = ["Per", "Con", "Dex", "Str", "Int"];
    this.segments = 5;
    this.segmentNames = [];
    $(_txtsObj(`actions>${getXMLName(this.name)}>segment_names>name`)).each((_index, segmentName) => {
        this.segmentNames.push($(segmentName).text());
    });
    this.manaCost = function() {
        return 8000;
    };
    this.loopCost = function(segment) {
        return precision3(Math.pow(2, Math.floor((towns[this.townNum].HuntTrollsLoopCounter + segment) / this.segments + 0.0000001)) * 1e6);
    };
    this.tickProgress = function(offset) {
        return (getSelfCombat() * (1 + getLevel(this.loopStats[(towns[3].HuntTrollsLoopCounter + offset) % this.loopStats.length]) / 100) * Math.sqrt(1 + towns[3].totalHuntTrolls / 100));
    };
    this.loopsFinished = function() {
        handleSkillExp(this.skills);
        addResource("blood", 1);
    };
    this.getPartName = function() {
        return "Hunt Troll";
    };
    this.getSegmentName = function(segment) {
        return this.segmentNames[segment % 5];
    };
    this.visible = function() {
        return towns[3].getLevel("Cavern") >= 5;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Cavern") >= 50;
    };
    this.finish = function() {
        // nothing
    };
}

function CheckWalls() {
    this.name = "Check Walls";
    this.expMult = 1;
    this.townNum = 3;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.varName = "Illusions";
    this.stats = {
        Spd: 0.1,
        Dex: 0.1,
        Per: 0.4,
        Int: 0.4
    };
    this.manaCost = function() {
        return 3000;
    };
    this.visible = function() {
        return towns[3].getLevel("Cavern") >= 40;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Cavern") >= 80;
    };
    this.finish = function() {
        towns[3].finishProgress(this.varName, 100);
    };
}

function TakeArtifacts() {
    this.varName = "Artifacts";
    this.name = "Take Artifacts";
    this.expMult = 1;
    this.townNum = 3;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);
    this.infoText = `${_txt(`actions>${getXMLName(this.name)}>info_text1`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text2`)}
                    <i class='fa fa-arrow-left'></i>
                    ${_txt(`actions>${getXMLName(this.name)}>info_text3`)}
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_found")}: `}</span><div id='total${this.varName}'></div>
                    <br><span class='bold'>${`${_txt("actions>tooltip>total_checked")}: `}</span><div id='checked${this.varName}'></div>`;

    this.stats = {
        Spd: 0.2,
        Per: 0.6,
        Int: 0.2,
    };
    this.manaCost = function() {
        return 1500;
    };
    this.visible = function() {
        return towns[3].getLevel("Illusions") >= 1;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Illusions") >= 5;
    };
    this.finish = function() {
        towns[3].finishRegular(this.varName, 25, () => {
            addResource("artifacts", 1);
        });
    };
}
function adjustArtifacts() {
    towns[3].totalArtifacts = towns[3].getLevel("Illusions") * 5;
}

function ImbueMind() {
    this.varName = "ImbueMind";
    this.name = "Imbue Mind";
    this.expMult = 5;
    this.townNum = 3;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.tooltip2 = _txt(`actions>${getXMLName(this.name)}>tooltip2`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.stats = {
        Spd: 0.1,
        Per: 0.1,
        Int: 0.8
    };
    this.loopStats = ["Spd", "Per", "Int"];
    this.segments = 3;
    this.segmentNames = [];
    $(_txtsObj(`actions>${getXMLName(this.name)}>segment_names>name`)).each((_index, segmentName) => {
        this.segmentNames.push($(segmentName).text());
    });
    this.manaCost = function() {
        return 500000;
    };
    this.allowed = function() {
        return 1;
    };
    this.canStart = function() {
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
    };
    this.loopCost = function(segment) {
        return 100000000 * (segment * 5 + 1);
    };
    this.tickProgress = function(offset) {
        return getSkillLevel("Magic") * (1 + getLevel(this.loopStats[(towns[3].ImbueMindLoopCounter + offset) % this.loopStats.length]) / 100);
    };
    this.loopsFinished = function() {
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
        view.adjustGoldCost("ImbueMind", goldCostImbueMind());
    };
    this.getPartName = function() {
        return "Imbue Mind";
    };
    this.getSegmentName = function(segment) {
        return this.segmentNames[segment % 3];
    };
    this.visible = function() {
        return towns[3].getLevel("Illusions") >= 50;
    };
    this.unlocked = function() {
        const toUnlock = towns[3].getLevel("Illusions") >= 70 && getSkillLevel("Magic") >= 300;
        if (toUnlock && !isVisible(document.getElementById("buffList"))) {
            document.getElementById("buffList").style.display = "flex";
            document.getElementById(`buffImbueContainer`).style.display = "flex";
        }
        return toUnlock;
    };
    this.finish = function() {
        view.updateBuff("Imbuement");
    };
}
function goldCostImbueMind() {
    return 20 * (getBuffLevel("Imbuement") + 1);
}

function FaceJudgement() {
    this.varName = "FaceJudgement";
    this.name = "Face Judgement";
    this.expMult = 2;
    this.townNum = 3;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.stats = {
        Cha: 0.3,
        Luck: 0.2,
        Soul: 0.5,
    };
    this.allowed = function() {
        return 1;
    };
    this.manaCost = function() {
        return 30000;
    };
    this.visible = function() {
        return towns[3].getLevel("Mountain") >= 40;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Mountain") >= 100;
    };
    this.finish = function() {
        // todo: allow you to unlock the new zones
        // if (resources.reputation >= 50) unlockTown(4);
        // else if (resources.reputation <= 50) unlockTown(5);
    };
}

function FallFromGrace() {
    this.varName = "FallFromGrace";
    this.name = "Fall From Grace";
    this.expMult = 2;
    this.townNum = 4;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);

    this.stats = {
        Dex: 0.4,
        Luck: 0.3,
        Spd: 0.2,
        Int: 0.1,
    };
    this.allowed = function() {
        return 1;
    };
    this.manaCost = function() {
        return 30000;
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return true;
    };
    this.finish = function() {
        // todo: allow you to unlock new zone
        // unlockTown(5);
    };
}

// todo: make this correct
function GreatFeast() {
    this.varName = "GreatFeast";
    this.name = "Great Feast";
    this.expMult = 5;
    this.townNum = 4;
    this.tooltip = _txt(`actions>${getXMLName(this.name)}>tooltip`);
    this.tooltip2 = _txt(`actions>${getXMLName(this.name)}>tooltip2`);
    this.label = _txt(`actions>${getXMLName(this.name)}>label`);
    this.labelDone = _txt(`actions>${getXMLName(this.name)}>label_done`);

    this.stats = {
        Spd: 0.1,
        Int: 0.1,
        Soul: 0.8
    };
    this.loopStats = ["Spd", "Int", "Soul"];
    this.segments = 3;
    this.segmentNames = [];
    $(_txtsObj(`actions>${getXMLName(this.name)}>segment_names>name`)).each((_index, segmentName) => {
        this.segmentNames.push($(segmentName).text());
    });
    this.manaCost = function() {
        return Math.ceil(50000 * (1 - towns[1].getLevel("Witch") * 0.005));
    };
    this.allowed = function() {
        return 1;
    };
    this.canStart = function() {
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
    };
    this.loopCost = function(segment) {
        return 1000000 * (segment * 2 + 1);
    };
    this.tickProgress = function(offset) {
        return getSkillLevel("Dark") * (1 + getLevel(this.loopStats[(towns[1].DarkRitualLoopCounter + offset) % this.loopStats.length]) / 100) / (1 - towns[1].getLevel("Witch") * 0.005);
    };
    this.loopsFinished = function() {
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
        view.adjustGoldCost("GreatFeast", goldCostGreatFeast());
    };
    this.getPartName = function() {
        return "Host Great Feast";
    };
    this.getSegmentName = function(segment) {
        return this.segmentNames[segment % 3];
    };
    this.visible = function() {
        return towns[1].getLevel("Thicket") >= 50;
    };
    this.unlocked = function() {
        const toUnlock = false;
        if (toUnlock && !isVisible(document.getElementById("buffList"))) {
            document.getElementById("buffList").style.display = "flex";
            document.getElementById(`buffFeastContainer`).style.display = "flex";
        }
        return toUnlock;
    };
    this.finish = function() {
        view.updateBuff("Feast");
    };
}
function goldCostGreatFeast() {
    return 5000 * (getBuffLevel("Feast") + 1);
}