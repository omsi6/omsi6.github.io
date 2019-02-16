'use strict';
function translateClassNames(name) {
    if(name === "Wander") {
        return new Wander();
    } else if(name === "Smash Pots") {
        return new SmashPots();
    } else if(name === "Pick Locks") {
        return new PickLocks();
    } else if(name === "Buy Glasses") {
        return new BuyGlasses();
    } else if(name === "Buy Mana") {
        return new BuyMana();
    } else if(name === "Meet People") {
        return new MeetPeople();
    } else if(name === "Train Strength") {
        return new TrainStr();
    } else if(name === "Short Quest") {
        return new ShortQuest();
    } else if(name === "Investigate") {
        return new Investigate();
    } else if(name === "Long Quest") {
        return new LongQuest();
    } else if(name === "Warrior Lessons") {
        return new WarriorLessons();
    } else if(name === "Mage Lessons") {
        return new MageLessons();
    } else if(name === "Throw Party") {
        return new ThrowParty();
    } else if(name === "Heal The Sick") {
        return new HealTheSick();
    } else if(name === "Fight Monsters") {
        return new FightMonsters();
    } else if(name === "Small Dungeon") {
        return new SmallDungeon();
    } else if(name === "Buy Supplies") {
        return new BuySupplies();
    } else if(name === "Haggle") {
        return new Haggle();
    } else if(name === "Start Journey") {
        return new StartJourney();
    } else if(name === "Open Rift") {
        return new OpenRift();
    }
    //town 2
    if(name === "Explore Forest") {
        return new ExploreForest();
    } else if(name === "Wild Mana") {
        return new WildMana();
    } else if(name === "Gather Herbs") {
        return new GatherHerbs();
    } else if(name === "Hunt") {
        return new Hunt();
    } else if(name === "Sit By Waterfall") {
        return new SitByWaterfall();
    } else if(name === "Old Shortcut") {
        return new OldShortcut();
    } else if(name === "Talk To Hermit") {
        return new TalkToHermit();
    } else if(name === "Practical Magic") {
        return new PracticalMagic();
    } else if(name === "Learn Alchemy") {
        return new LearnAlchemy();
    } else if(name === "Brew Potions") {
        return new BrewPotions();
    } else if(name === "Train Dex") {
        return new TrainDex();
    } else if(name === "Train Speed") {
        return new TrainSpd();
    } else if(name === "Follow Flowers") {
        return new FollowFlowers();
    } else if(name === "Bird Watching") {
        return new BirdWatching();
    } else if(name === "Clear Thicket") {
        return new ClearThicket();
    } else if(name === "Talk To Witch") {
        return new TalkToWitch();
    } else if(name === "Dark Magic") {
        return new DarkMagic();
    } else if(name === "Dark Ritual") {
        return new DarkRitual();
    } else if (name === "Continue On") {
        return new ContinueOn();
    }
    //town 3
    if(name === "Explore City") {
        return new ExploreCity();
    } else if(name === "Gamble") {
        return new Gamble();
    } else if(name === "Get Drunk") {
        return new GetDrunk();
    } else if(name === "Purchase Mana") {
        return new PurchaseMana();
    } else if(name === "Sell Potions") {
        return new SellPotions();
    } else if(name === "Read Books") {
        return new ReadBooks();
    } else if(name === "Adventure Guild") {
        return new JoinAdvGuild();
    } else if(name === "Gather Team") {
        return new GatherTeam();
    } else if(name === "Large Dungeon") {
        return new LargeDungeon();
    } else if(name === "Crafting Guild") {
        return new CraftingGuild();
    } else if(name === "Craft Armor") {
        return new CraftArmor();
    } else if(name === "Apprentice") {
        return new Apprentice();
    } else if(name === "Mason") {
        return new Mason();
    } else if(name === "Architect") {
        return new Architect();
    } else if(name === "Buy Pickaxe") {
        return new BuyPickaxe();
    } else if (name === "Start Trek") {
        return new StartTrek();
    }
    // town 4 
    if(name === "Climb Mountain") {
        return new ClimbMountain();
    } else if(name === "Mana Geyser") {
        return new ManaGeyser();
    } else if(name === "Decipher Runes") {
        return new DecipherRunes();
    } else if(name === "Chronomancy") {
        return new Chronomancy();
    } else if(name === "Looping Potion") {
        return new LoopingPotion();
    } else if(name === "Pyromancy") {
        return new Pyromancy();
    } else if(name === "Explore Cavern") {
        return new ExploreCavern();
    } else if(name === "Mine Soulstones") {
        return new MineSoulstones();
    } else if(name === "Hunt Trolls") {
        return new HuntTrolls();
    } else if(name === "Check Walls") {
        return new CheckWalls();
    } else if(name === "Take Artifacts") {
        return new TakeArtifacts();
    } else if(name === "Imbue Mind") {
        return new ImbueMind();
    } else if(name === "Face Judgement") {
        return new FaceJudgement();
    }
    // town 5
    if(name === "Look Around") {
        return new LookAround();
    } else if(name === "Great Feast") {
        return new GreatFeast();
    } else if(name === "Fall From Grace") {
        return new FallFromGrace();
    }
    // town 6
    if(name === "Survey Area") {
        return new SurveyArea();
    }
    console.log('error trying to create ' + name);
}

function hasCap(name) {
  return (name === "Smash Pots" || name === "Pick Locks" || name === "Short Quest" || name === "Long Quest" || name === "Gather Herbs" || name === "Wild Mana" || name === "Hunt" || name === "Gamble" || name === "Mana Geyser" || name === "Mine Soulstones");
}
function getTravelNum(name) {
    if (name === "Face Judgement" && reputation <= 50) return 2
    else if (name === "Face Judgement" && reputation >= 50) return 1
    else if (name === "Start Journey" || name === "Continue On" || name === "Start Trek" || name === "Fall From Grace") return 1
    return 0
}
function isTraining(name) {
    return (name === "Train Speed" || name === "Train Strength" || name === "Train Dex" || name === "Sit By Waterfall" || name === "Read Books" || name === "Bird Watching");
}

let townNames = ["Beginnersville", "Forest Path", "Merchanton", "Mt. Olympus"];


//Progress actions
//Progress actions have a progress bar and use 100,200,300,etc. leveling system

function Wander() {
    this.name = "Wander";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt("actions>wander>tooltip");
    this.label = _txt("actions>wander>label");
    this.labelDone = _txt("actions>wander>label_done");
    
    this.varName = "Wander";
    this.stats = {
        Per:.2,
        Con:.2,
        Cha:.2,
        Spd:.3,
        Luck:.1
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
        towns[0].finishProgress(this.varName, 200 * (glasses ? 4 : 1), function() {
            adjustPots();
            adjustLocks();
        });
    };
}
function adjustPots() {
    towns[0].totalPots = towns[0].getLevel("Wander") * 5;
}
function adjustLocks() {
    towns[0].totalLocks = towns[0].getLevel("Wander");
}

function MeetPeople() {
    this.name = "Meet People";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt("actions>meet_people>tooltip");
    this.label = _txt("actions>meet_people>label");
    this.labelDone = _txt("actions>meet_people>label_done");

    this.varName = "Met";
    this.stats = {
        Int:.1,
        Cha:.8,
        Soul:.1
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
        towns[0].finishProgress(this.varName, 200, function() {
            adjustSQuests();
        });
    };
}
function adjustSQuests() {
    towns[0].totalSQuests = towns[0].getLevel("Met");
}

function Investigate() {
    this.name = "Investigate";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt("actions>investigate>tooltip");
    this.label = _txt("actions>investigate>label");
    this.labelDone = _txt("actions>investigate>label_done");

    this.varName = "Secrets";
    this.stats = {
        Per:.3,
        Cha:.4,
        Spd:.2,
        Luck:.1
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
        towns[0].finishProgress(this.varName, 500, function() {
            adjustLQuests();
        });
    };
}
function adjustLQuests() {
    towns[0].totalLQuests = Math.floor(towns[0].getLevel("Secrets")/2);
}

function ExploreForest() {
    this.name = "Explore Forest";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt("actions>explore_forest>tooltip");
    this.label = _txt("actions>explore_forest>label");
    this.labelDone = _txt("actions>explore_forest>label_done");

    this.varName = "Forest";
    this.stats = {
        Per:.4,
        Con:.2,
        Spd:.2,
        Luck:.2
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
        towns[1].finishProgress(this.varName, 100 * (glasses ? 2 : 1), function() {
            adjustWildMana();
            adjustHunt();
            adjustHerbs();
        });
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

function OldShortcut() {
    this.name = "Old Shortcut";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt("actions>old_shortcut>tooltip");
    this.label = _txt("actions>old_shortcut>label");
    this.labelDone = _txt("actions>old_shortcut>label_done");

    this.varName = "Shortcut";
    this.stats = {
        Per:.3,
        Con:.4,
        Spd:.2,
        Luck:.1
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
        towns[1].finishProgress(this.varName, 100, function() {
            adjustHerbs();
            view.adjustManaCost("Continue On");
        });
    };
}

function TalkToHermit() {
    this.name = "Talk To Hermit";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt("actions>hermit>tooltip");
    this.label = _txt("actions>hermit>label");
    this.labelDone = _txt("actions>hermit>label_done");

    this.varName = "Hermit";
    this.stats = {
        Con:.5,
        Cha:.3,
        Soul:.2
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
        towns[1].finishProgress(this.varName, 50 * (1 + towns[1].getLevel("Shortcut")/100), function() {
            view.adjustManaCost("Learn Alchemy");
            view.adjustManaCost("Gather Herbs");
            view.adjustManaCost("Practical Magic");
        });
    };
}

function ExploreCity() {
    this.name = "Explore City";
    this.expMult = 1;
    this.townNum = 2;
    this.tooltip = _txt("actions>explore_city>tooltip");
    this.label = _txt("actions>explore_city>label");
    this.labelDone = _txt("actions>explore_city>label_done");

    this.varName = "City";
    this.stats = {
        Con:.1,
        Per:.3,
        Cha:.2,
        Spd:.3,
        Luck:.1
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
        towns[2].finishProgress(this.varName, 100 * (glasses ? 2 : 1), function() {
            adjustSuckers();
        });
    };
}
function adjustSuckers() {
    towns[2].totalGamble = towns[2].getLevel("City") * 3;
}

function GetDrunk() {
    this.name = "Get Drunk";
    this.expMult = 3;
    this.townNum = 2;
    this.tooltip = _txt("actions>get_drunk>tooltip");
    this.label = _txt("actions>get_drunk>label");
    this.labelDone = _txt("actions>get_drunk>label_done");

    this.varName = "Drunk";
    this.stats = {
        Str:.1,
        Cha:.5,
        Con:.2,
        Soul:.2
    };
    this.canStart = function() {
        return reputation >= -3
    };
    this.cost = function() {
        addReputation(-1);
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
        towns[2].finishProgress(this.varName, 100, function() {
        });
    };
}

function Apprentice() {
    this.varName = "Apprentice";
    this.name = "Apprentice";
    this.expMult = 1.5;
    this.townNum = 2;
    this.tooltip = _txt("actions>apprentice>tooltip");
    this.label = _txt("actions>apprentice>label");
    this.labelDone = _txt("actions>apprentice>label_done");

    this.stats = {
        Dex:.2,
        Int:.4,
        Cha:.4
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
        towns[2].finishProgress(this.varName, 30 * getCraftGuildRank().bonus, function() {
        });
        addSkillExp("Crafting", 10 * (1 + towns[2].getLevel(this.varName)/100));
    };
}

function Mason() {
    this.varName = "Mason";
    this.name = "Mason";
    this.expMult = 2;
    this.townNum = 2;
    this.tooltip = _txt("actions>mason>tooltip");
    this.label = _txt("actions>mason>label");
    this.labelDone = _txt("actions>mason>label_done");

    this.stats = {
        Dex:.2,
        Int:.5,
        Cha:.3
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
        towns[2].finishProgress(this.varName, 20 * getCraftGuildRank().bonus, function() {
        });
        addSkillExp("Crafting", 20 * (1 + towns[2].getLevel(this.varName)/100));
    };
}

function Architect() {
    this.varName = "Architect";
    this.name = "Architect";
    this.expMult = 2.5;
    this.townNum = 2;
    this.tooltip = _txt("actions>architect>tooltip");
    this.label = _txt("actions>architect>label");
    this.labelDone = _txt("actions>architect>label_done");

    this.stats = {
        Dex:.2,
        Int:.6,
        Cha:.2
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
        towns[2].finishProgress(this.varName, 10 * getCraftGuildRank().bonus, function() {
        });
        addSkillExp("Crafting", 40 * (1 + towns[2].getLevel(this.varName)/100));
    };
}

//Basic actions
//Basic actions have no additional UI

function BuyGlasses() {
    this.name = "Buy Glasses";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt("actions>buy_glasses>tooltip");
    this.label = _txt("actions>buy_glasses>label");

    this.varName = "Glasses";
    this.stats = {
        Cha:.7,
        Spd:.3
    };
    this.allowed = function() {
        return 1;
    };
    this.canStart = function() {
        return gold >= 10;
    };
    this.cost = function() {
        addGold(-10);
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
        addGlasses(1);
    };
}

function BuyMana() {
    this.name = "Buy Mana";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt("actions>buy_mana>tooltip");
    this.label = _txt("actions>buy_mana>label");

    this.varName = "Gold";
    this.stats = {
        Cha:.7,
        Int:.2,
        Luck:.1
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
        addMana(gold * 50);
        addGold(-gold);
    };
}

function TrainStr() {
    this.name = "Train Strength";
    this.expMult = 4;
    this.townNum = 0;
    this.tooltip = _txt("actions>train_str>tooltip");
    this.label = _txt("actions>train_str>label");

    this.varName = "trStr";
    this.stats = {
        Str:.8,
        Con:.2
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
    };
}

function ThrowParty() {
    this.name = "Throw Party";
    this.expMult = 2;
    this.townNum = 0;
    this.tooltip = _txt("actions>throw_party>tooltip");
    this.label = _txt("actions>throw_party>label");

    this.varName = "Party";
    this.stats = {
        Cha:.8,
        Soul:.2
    };
    this.manaCost = function() {
        return 1600;
    };
    this.canStart = function() {
        return reputation >= 2;
    };
    this.cost = function() {
        addReputation(-2);
    };
    this.visible = function() {
        return towns[0].getLevel("Secrets") >= 20;
    };
    this.unlocked = function() {
        return towns[0].getLevel("Secrets") >= 30;
    };
    this.finish = function() {
        towns[0].finishProgress("Met", 3200, function() {
            adjustSQuests();
        });
    };
}

function WarriorLessons() {
    this.name = "Warrior Lessons";
    this.expMult = 1.5;
    this.tooltip = "Learning to fight is probably important; you have a long journey ahead of you.<br>Requires 2 reputation.<br>Unlocked at 20% Investigated.";
    this.townNum = 0;
    this.tooltip = _txt("actions>warrior_lesson>tooltip");
    this.label = _txt("actions>warrior_lesson>label");

    this.varName = "trCombat";
    this.stats = {
        Str:.5,
        Dex:.3,
        Con:.2
    };
    this.manaCost = function() {
        return 1000;
    };
    this.canStart = function() {
        return reputation >= 2;
    };
    this.cost = function() {
    };
    this.visible = function() {
        return towns[0].getLevel("Secrets") >= 10;
    };
    this.unlocked = function() {
        return towns[0].getLevel("Secrets") >= 20;
    };
    this.finish = function() {
        addSkillExp("Combat", 100);
    };
}

function MageLessons() {
    this.name = "Mage Lessons";
    this.expMult = 1.5;
    this.tooltip = "The mystic got you into this mess, maybe it can help you get out of it.<br>Requires 2 reputation.<br>Unlocked at 20% Investigated.";
    this.townNum = 0;
    this.tooltip = _txt("actions>mage_lesson>tooltip");
    this.label = _txt("actions>mage_lesson>label");

    this.varName = "trMagic";
    this.stats = {
        Per:.3,
        Int:.5,
        Con:.2
    };
    this.manaCost = function() {
        return 1000;
    };
    this.canStart = function() {
        return reputation >= 2;
    };
    this.cost = function() {
    };
    this.visible = function() {
        return towns[0].getLevel("Secrets") >= 10;
    };
    this.unlocked = function() {
        return towns[0].getLevel("Secrets") >= 20;
    };
    this.finish = function() {
        addSkillExp("Magic", 100 * (1 + getSkillLevel("Alchemy")/100));
    };
}

function BuySupplies() {
    this.name = "Buy Supplies";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt("actions>buy_supplies>tooltip");
    this.label = _txt("actions>buy_supplies>label");

    this.varName = "Supplies";
    this.stats = {
        Cha:.8,
        Luck:.1,
        Soul:.1
    };
    this.allowed = function() {
        return 1;
    };
    this.manaCost = function() {
        return 200;
    };
    this.canStart = function() {
        return gold >= towns[0].suppliesCost && supplies === 0;
    };
    this.cost = function() {
        addGold(-towns[0].suppliesCost);
    };
    this.visible = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 15;
    };
    this.unlocked = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    };
    this.finish = function() {
        addSupplies(1);
    };
}

function Haggle() {
    this.name = "Haggle";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt("actions>haggle>tooltip");
    this.label = _txt("actions>haggle>label");

    this.varName = "Haggle";
    this.stats = {
        Cha:.8,
        Luck:.1,
        Soul:.1
    };
    this.manaCost = function() {
        return 100;
    };
    this.canStart = function() {
        return reputation >= 1;
    };
    this.cost = function() {
        addReputation(-1);
    };
    this.visible = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 15;
    };
    this.unlocked = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    };
    this.finish = function() {
        towns[0].suppliesCost -= 20;
        if(towns[0].suppliesCost < 0 ) {
            towns[0].suppliesCost = 0;
        }
        view.updateSupplies();
    };
}

function StartJourney() {
    this.name = "Start Journey";
    this.expMult = 2;
    this.townNum = 0;
    this.tooltip = _txt("actions>start_journey>tooltip");
    this.label = _txt("actions>start_journey>label");

    this.varName = "Journey";
    this.stats = {
        Con:.4,
        Per:.3,
        Spd:.3
    };
    this.allowed = function() {
        return 1;
    };
    this.manaCost = function() {
        return 1000;
    };
    this.canStart = function() {
        return supplies === 1;
    };
    this.cost = function() {
        addSupplies(-1);
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
    this.expMult = 3;
    this.townNum = 0;
    this.tooltip = _txt("actions>open_rift>tooltip");
    this.label = _txt("actions>open_rift>label");

    this.varName = "OpenRift";
    this.stats = {
        Int:.2,
        Luck:.1,
        Soul:.7
    };
    this.allowed = function() {
        return 1;
    };
    this.manaCost = function() {
        return 20000;
    };
    this.canStart = function() {
        return supplies === 1;
    };
    this.visible = function() {
        return (getSkillLevel("Dark") >= 100 &&  getSkillLevel("Magic")) >= 15;
    };
    this.unlocked = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    };
    this.finish = function() {
        unlockTown(1);
    };
}

function SitByWaterfall() {
    this.name = "Sit By Waterfall";
    this.expMult = 4;
    this.townNum = 1;
    this.tooltip = _txt("actions>train_soul>tooltip");
    this.label = _txt("actions>train_soul>label");

    this.varName = "Waterfall";
    this.stats = {
        Con:.2,
        Soul:.8
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
    };
}

function PracticalMagic() {
    this.name = "Practical Magic";
    this.expMult = 1.5;
    this.townNum = 1;
    this.tooltip = _txt("actions>practical_magic>tooltip");
    this.label = _txt("actions>practical_magic>label");

    this.varName = "trPractical";
    this.stats = {
        Per:.3,
        Con:.2,
        Int:.5
    };
    this.manaCost = function() {
        return Math.ceil(4000 * (1 - towns[1].getLevel("Hermit") * .005))
    };
    this.visible = function() {
        return towns[1].getLevel("Hermit") >= 10;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Hermit") >= 20 && getSkillLevel("Magic") >= 50;
    };
    this.finish = function() {
        addSkillExp("Practical", 100);
        view.adjustManaCost("Wild Mana");
        view.adjustManaCost("Smash Pots");
        view.adjustGoldCosts();
    };
}

function LearnAlchemy() {
    this.name = "Learn Alchemy";
    this.expMult = 1.5;
    this.tooltip = "You can listen to him yammer while making light healing and remedy potions.<br>You're starting to think the potion that caused you to loop time was a complex one.<br>You provide the ingredients; costs 10 herbs.<br>Gives alchemy and magic skill.<br>Unlocked with both 40% Hermit Knowledge and 60 Magic.";
    this.townNum = 1;
    this.tooltip = _txt("actions>learn_alchemy>tooltip");
    this.label = _txt("actions>learn_alchemy>label");

    this.varName = "trAlchemy";
    this.stats = {
        Con:.3,
        Per:.1,
        Int:.6
    };
    this.canStart = function() {
        return herbs >= 10;
    };
    this.cost = function() {
        addHerbs(-10);
    };
    this.manaCost = function() {
        return Math.ceil(5000 * (1 - towns[1].getLevel("Hermit") * .005))
    };
    this.visible = function() {
        return towns[1].getLevel("Hermit") >= 10;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Hermit") >= 40 && getSkillLevel("Magic") >= 60;
    };
    this.finish = function() {
        addSkillExp("Alchemy", 50);
        addSkillExp("Magic", 50);
    };
}

function BrewPotions() {
    this.varName = "Potions";
    this.name = "Brew Potions";
    this.expMult = 1.5;
    this.townNum = 1;
    this.tooltip = _txt("actions>brew_potions>tooltip");
    this.label = _txt("actions>brew_potions>label");

    this.stats = {
        Dex:.3,
        Int:.6,
        Luck:.1,
    };
    this.canStart = function() {
        return herbs >= 10 && reputation >= 5;
    };
    this.cost = function() {
        addHerbs(-10);
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
        addPotions(1);
        addSkillExp("Alchemy", 25);
        addSkillExp("Magic", 50);
    };
}

function TrainDex() {
    this.name = "Train Dex";
    this.expMult = 4;
    this.townNum = 1;
    this.tooltip = _txt("actions>train_dex>tooltip");
    this.label = _txt("actions>train_dex>label");

    this.varName = "trDex";
    this.stats = {
        Dex:.8,
        Con:.2
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
    };
}

function TrainSpd() {
    this.name = "Train Speed";
    this.expMult = 4;
    this.townNum = 1;
    this.tooltip = _txt("actions>train_spd>tooltip");
    this.label = _txt("actions>train_spd>label");

    this.varName = "trSpd";
    this.stats = {
        Spd:.8,
        Con:.2
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
    };
}

function FollowFlowers() {
    this.name = "Follow Flowers";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt("actions>follow_flowers>tooltip");
    this.label = _txt("actions>follow_flowers>label");
    this.labelDone = _txt("actions>follow_flowers>label_done");

    this.varName = "Flowers";
    this.stats = {
        Per:.7,
        Con:.1,
        Spd:.2
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
        towns[1].finishProgress(this.varName, 100 * (glasses ? 2 : 1), function() {
            adjustHerbs();
        });
    };
}

function BirdWatching() {
    this.name = "Bird Watching";
    this.expMult = 4;
    this.townNum = 1;
    this.tooltip = _txt("actions>bird_watching>tooltip");
    this.label = _txt("actions>bird_watching>label");

    this.varName = "BirdWatching";
    this.stats = {
        Per:.8,
        Int:.2
    };
    this.affectedBy = ["Buy Glasses"];
    this.allowed = function() {
        return trainingLimits;
    };
    this.manaCost = function() {
        return 2000;
    };
    this.canStart = function() {
        return glasses;
    };
    this.visible = function() {
        return towns[1].getLevel("Flowers") >= 30;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Flowers") >= 80;
    };
    this.finish = function() {
    };
}

function ClearThicket() {
    this.name = "Clear Thicket";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt("actions>clear_thicket>tooltip");
    this.label = _txt("actions>clear_thicket>label");
    this.labelDone = _txt("actions>clear_thicket>label_done");

    this.varName = "Thicket";
    this.stats = {
        Dex:.1,
        Str:.2,
        Per:.3,
        Con:.2,
        Spd:.2
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
        towns[1].finishProgress(this.varName, 100, function() {
            adjustWildMana();
        });
    };
}

function TalkToWitch() {
    this.name = "Talk To Witch";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt("actions>witch>tooltip");
    this.label = _txt("actions>witch>label");
    this.labelDone = _txt("actions>witch>label_done");

    this.varName = "Witch";
    this.stats = {
        Cha:.3,
        Int:.2,
        Soul:.5
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
        towns[1].finishProgress(this.varName, 100, function() {
            view.adjustManaCost("Dark Magic");
            view.adjustManaCost("Dark Ritual");
        });
    };
}

function DarkMagic() {
    this.name = "Dark Magic";
    this.expMult = 1.5;
    this.townNum = 1;
    this.tooltip = _txt("actions>dark_magic>tooltip");
    this.label = _txt("actions>dark_magic>label");

    this.varName = "trDark";
    this.stats = {
        Con:.2,
        Int:.5,
        Soul:.3
    };
    this.manaCost = function() {
        return Math.ceil(6000 * (1 - towns[1].getLevel("Witch") * .005));
    };
    this.canStart = function() {
        return reputation <= 0;
    };
    this.cost = function() {
        addReputation(-1);
    };
    this.visible = function() {
        return towns[1].getLevel("Witch") >= 10;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Witch") >= 20 && getSkillLevel("Magic") >= 100;
    };
    this.finish = function() {
        addSkillExp("Dark", Math.floor(100 * (1 + getBuffLevel("Ritual") / 100)));
        view.adjustGoldCost("Pots", goldCostSmashPots());
        view.adjustGoldCost("WildMana", goldCostWildMana());
    };
}

function DarkRitual() {
    this.varName = "DarkRitual";
    this.name = "Dark Ritual";
    this.expMult = 10;
    this.townNum = 1;
    this.tooltip = _txt("actions>dark_ritual>tooltip");
    this.tooltip2 = _txt("actions>dark_ritual>tooltip2");
    this.label = _txt("actions>dark_ritual>label");
    this.labelDone = _txt("actions>dark_ritual>label_done");

    this.stats = {
        Spd:.1,
        Int:.1,
        Soul:.8
    };
    this.loopStats = ["Spd", "Int", "Soul"];
    this.segments = 3;
    this.manaCost = function() {
        return Math.ceil(50000 * (1 - towns[1].getLevel("Witch") * .005));
    };
    this.allowed = function() {
        return 1;
    };
    this.canStart = function() {
        var tempCost = (towns[1].totalDarkRitual+1) * 50
        var tempCanStart = true;
        for(var i=0; i<9; i++) {
            if (Math.ceil(tempCost/9) > stats[statList[i]].soulstone) tempCanStart = false;
        }
        return reputation <= -5 && towns[1].DarkRitualLoopCounter === 0 && tempCanStart && getBuffLevel("Ritual") < parseInt(document.getElementById("buffRitualCap").value);
    };
    this.loopCost = function(segment) {
        return 1000000 * (segment*2+1);
    };
    this.tickProgress = function(offset) {
        return getSkillLevel("Dark") * (1 + getLevel(this.loopStats[(towns[1].DarkRitualLoopCounter+offset) % this.loopStats.length])/100) / (1 - towns[1].getLevel("Witch") * .005);
    };
    this.loopsFinished = function() {
        addBuffAmt("Ritual", 1)
        var tempSoulstonesSacrificed = 0;
        var tempSoulstonesToSacrifice = Math.ceil((towns[1].totalDarkRitual * 50) / 9);
        for(var i=0; i<9; i++) {
            if (tempSoulstonesSacrificed + tempSoulstonesToSacrifice > towns[1].totalDarkRitual * 50) tempSoulstonesToSacrifice = towns[1].totalDarkRitual * 50 - tempSoulstonesSacrificed
            tempSoulstonesSacrificed += tempSoulstonesToSacrifice
            stats[statList[i]].soulstone -= tempSoulstonesToSacrifice
        }
        view.updateSoulstones();
        view.adjustGoldCost("DarkRitual", goldCostDarkRitual());
    };
    this.getPartName = function() {
        return "Perform Dark Ritual";
    };
    this.getSegmentName = function(segment) {
        let segments = [];
        $(_txtsObj("actions>dark_ritual>segment_names>name")).each(function(x,segmentName) {
          segments.push($(segmentName).text());
        })
        return segments[segment % 3];
    };
    this.visible = function() {
        return towns[1].getLevel("Thicket") >= 50;
    };
    this.unlocked = function() {
        let toUnlock = towns[1].getLevel("Thicket") >= 90 && getSkillLevel("Dark") >= 50;
        if(toUnlock && !isVisible(document.getElementById("buffList"))) {
            document.getElementById("buffList").style.display = "flex";
        }
        return toUnlock;
    };
    this.finish = function() {
        view.updateBuff("Ritual");
    };
}
function goldCostDarkRitual() {
    return 50*(getBuffLevel("Ritual")+1);
}

function ContinueOn() {
    this.varName = "Continue";
    this.name = "Continue On";
    this.expMult = 2;
    this.townNum = 1;
    this.tooltip = _txt("actions>continue_on>tooltip");
    this.label = _txt("actions>continue_on>label");

    this.stats = {
        Con:.4,
        Per:.2,
        Spd:.4
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

function PurchaseMana() {
    this.varName = "Gold2";
    this.name = "Purchase Mana";
    this.expMult = 1;
    this.townNum = 2;
    this.tooltip = _txt("actions>purchase_mana>tooltip");
    this.label = _txt("actions>purchase_mana>label");

    this.stats = {
        Cha:.7,
        Int:.2,
        Luck:.1
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
        addMana(gold * 50);
        addGold(-gold);
    };
}

function SellPotions() {
    this.varName = "SellPotions";
    this.name = "Sell Potions";
    this.expMult = 1;
    this.townNum = 2;
    this.tooltip = _txt("actions>sell_potions>tooltip");
    this.label = _txt("actions>sell_potions>label");

    this.stats = {
        Cha:.7,
        Int:.2,
        Luck:.1
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
        addGold(potions * getSkillLevel("Alchemy"));
        addPotions(-potions);
    };
}

function ReadBooks() {
    this.varName = "ReadBooks";
    this.name = "Read Books";
    this.expMult = 4;
    this.townNum = 2;
    this.tooltip = _txt("actions>read_books>tooltip");
    this.label = _txt("actions>read_books>label");

    this.stats = {
        Int:.8,
        Soul:.2
    };
    this.affectedBy = ["Buy Glasses"];
    this.allowed = function() {
        return trainingLimits;
    };
    this.canStart = function() {
        return glasses;
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
    };
}

function GatherTeam() {
    this.varName = "GatherTeam";
    this.name = "Gather Team";
    this.expMult = 3;
    this.townNum = 2;
    this.tooltip = _txt("actions>gather_team>tooltip");
    this.label = _txt("actions>gather_team>label");

    this.stats = {
        Per:.2,
        Cha:.5,
        Int:.2,
        Luck:.1
    };
    this.affectedBy = ["Adventure Guild"];
    this.allowed = function() {
        return 5;
    };
    this.canStart = function() {
        return guild === "Adventure" && gold >= (teamNum+1)*200;
    };
    this.cost = function() {
        addGold(-(teamNum)*200); //cost comes after finish
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
        addTeamNum(1);
    };
}

function CraftArmor() {
    this.varName = "CraftArmor";
    this.name = "Craft Armor";
    this.expMult = 1;
    this.townNum = 2;
    this.tooltip = _txt("actions>craft_armor>tooltip");
    this.label = _txt("actions>craft_armor>label");

    this.stats = {
        Str:.1,
        Dex:.3,
        Con:.3,
        Int:.3
    };
    // this.affectedBy = ["Crafting Guild"];
    this.canStart = function() {
        return hide >= 2;
    };
    this.cost = function() {
        addHide(-2);
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
        addArmor(1);
    };
}

//Regular Actions
//Regular actions have varName, infoName, infoText

function SmashPots() {
    this.varName = "Pots";
    this.name = "Smash Pots";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt("actions>smash_pots>tooltip");
    this.tooltip2 = _txt("actions>smash_pots>tooltip2");
    this.label = _txt("actions>smash_pots>label");
    this.labelDone = _txt("actions>smash_pots>label_done");
    this.infoText = _txt("actions>smash_pots>info_text1") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>smash_pots>info_text2") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>smash_pots>info_text3") +
      "<br><div class='bold'>" +
      _txt("actions>tooltip>total_found") +
       "</div> <div id='total"+this.varName+"'></div>";

    this.stats = {
        Str:.2,
        Per:.2,
        Spd:.6
    };
    this.manaCost = function() {
        return Math.ceil(50 / (1 + getSkillLevel("Practical")/100));
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return true;
    };
    this.finish = function() {
        towns[0].finishRegular(this.varName, 10, function() {
            addMana(goldCostSmashPots());
            return goldCostSmashPots();
        })
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
    this.tooltip = _txt("actions>locks>tooltip");
    this.tooltip2 = _txt("actions>locks>tooltip2");
    this.label = _txt("actions>locks>label");
    this.labelDone = _txt("actions>locks>label_done");
    this.infoText = _txt("actions>locks>info_text1") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>locks>info_text2") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>locks>info_text3") +
      "<br><div class='bold'>" +
      _txt("actions>tooltip>total_found") +
       "</div> <div id='total"+this.varName+"'></div>";

    this.stats = {
        Dex:.5,
        Per:.3,
        Spd:.1,
        Luck:.1
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
        towns[0].finishRegular(this.varName, 10, function() {
            let goldGain = goldCostLocks();
            addGold(goldGain);
            return goldGain;
        })
    };
}
function goldCostLocks() {
    let practical = getSkillLevel("Practical");
    practical = practical <= 200 ? practical : 200;
    return Math.floor(10 * (1 + practical/100));
}

function ShortQuest() {
    this.varName = "SQuests";
    this.name = "Short Quest";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt("actions>short_quest>tooltip");
    this.tooltip2 = _txt("actions>short_quest>tooltip2");
    this.label = _txt("actions>short_quest>label");
    this.labelDone = _txt("actions>short_quest>label_done");
    this.infoText = _txt("actions>short_quest>info_text1") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>short_quest>info_text2") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>short_quest>info_text3") +
      "<br><div class='bold'>" +
      _txt("actions>tooltip>total_found") +
       "</div> <div id='total"+this.varName+"'></div>";

    this.stats = {
        Str:.2,
        Dex:.1,
        Cha:.3,
        Spd:.2,
        Luck:.1,
        Soul:.1
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
        towns[0].finishRegular(this.varName, 5, function() {
            let goldGain = goldCostSQuests();
            addGold(goldGain);
            return goldGain;
        })
    };
}
function goldCostSQuests() {
    let practical = getSkillLevel("Practical") - 100;
    practical = practical <= 200 ? (practical >= 0 ? practical : 0) : 200;
    return Math.floor(20 * (1 + practical/100));
}

function LongQuest() {
    this.varName = "LQuests";
    this.name = "Long Quest";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt("actions>long_quest>tooltip");
    this.tooltip2 = _txt("actions>long_quest>tooltip2");
    this.label = _txt("actions>long_quest>label");
    this.labelDone = _txt("actions>long_quest>label_done");
    this.infoText = _txt("actions>long_quest>info_text1") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>long_quest>info_text2") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>long_quest>info_text3") +
      "<br><div class='bold'>" +
      _txt("actions>tooltip>total_found") +
       "</div> <div id='total"+this.varName+"'></div>";

    this.stats = {
        Str:.2,
        Int:.2,
        Con:.4,
        Spd:.2
    };
    this.manaCost = function() {
        return 1500;
    };
    this.visible = function() {
        return towns[0].getLevel("Secrets") >= 1;
    };
    this.unlocked = function() {
        let toUnlock = towns[0].getLevel("Secrets") >= 10;
        if(toUnlock && !isVisible(document.getElementById("skillList"))) {
            document.getElementById("skillList").style.display = "inline-block";
        }
        return toUnlock;
    };
    this.finish = function() {
        towns[0].finishRegular(this.varName, 5, function() {
            addReputation(1);
            let goldGain = goldCostLQuests();
            addGold(goldGain);
            return goldGain;
        })
    };
}
function goldCostLQuests() {
    let practical = getSkillLevel("Practical") - 200;
    practical = practical <= 200 ? (practical >= 0 ? practical : 0) : 200;
    return Math.floor(30 * (1 + practical/100));
}

function WildMana() {
    this.varName = "WildMana";
    this.name = "Wild Mana";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt("actions>wild_mana>tooltip");
    this.tooltip2 = _txt("actions>wild_mana>tooltip2");
    this.label = _txt("actions>wild_mana>label");
    this.labelDone = _txt("actions>wild_mana>label_done");
    this.infoText = _txt("actions>wild_mana>info_text1") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>wild_mana>info_text2") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>wild_mana>info_text3") +
      "<br><div class='bold'>" +
      _txt("actions>tooltip>total_found") +
       "</div> <div id='total"+this.varName+"'></div>";

    this.stats = {
        Con:.2,
        Int:.6,
        Soul:.2
    };
    this.manaCost = function() {
        return Math.ceil(150 / (1 + getSkillLevel("Practical")/100));
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Forest") >= 2;
    };
    this.finish = function() {
        towns[1].finishRegular(this.varName, 10, function() {
            addMana(goldCostWildMana());
            return goldCostWildMana();
        })
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
    this.tooltip = _txt("actions>gather_herbs>tooltip");
    this.label = _txt("actions>gather_herbs>label");
    this.labelDone = _txt("actions>gather_herbs>label_done");
    this.infoText = _txt("actions>gather_herbs>info_text1") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>gather_herbs>info_text2") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>gather_herbs>info_text3") +
      "<br><div class='bold'>" +
      _txt("actions>tooltip>total_found") +
       "</div> <div id='total"+this.varName+"'></div>";

    this.stats = {
        Str:.4,
        Dex:.3,
        Int:.3
    };
    this.manaCost = function() {
        return Math.ceil(200 * (1 - towns[1].getLevel("Hermit") * .005))
    };
    this.visible = function() {
        return towns[1].getLevel("Forest") >= 2;
    };
    this.unlocked = function() {
        return towns[1].getLevel("Forest") >= 10;
    };
    this.finish = function() {
        towns[1].finishRegular(this.varName, 10, function() {
            addHerbs(1);
            return 1;
        })
    };
}

function Hunt() {
    this.varName = "Hunt";
    this.name = "Hunt";
    this.expMult = 1;
    this.townNum = 1;
    this.tooltip = _txt("actions>hunt>tooltip");
    this.label = _txt("actions>hunt>label");
    this.labelDone = _txt("actions>hunt>label_done");
    this.infoText = _txt("actions>hunt>info_text1") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>hunt>info_text2") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>hunt>info_text3") +
      "<br><div class='bold'>" +
      _txt("actions>tooltip>total_found") +
       "</div> <div id='total"+this.varName+"'></div>";

    this.stats = {
        Dex:.2,
        Con:.2,
        Per:.2,
        Spd:.4
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
        towns[1].finishRegular(this.varName, 10, function() {
            addHide(1);
            return 1;
        })
    };
}

function Gamble() {
    this.varName = "Gamble";
    this.name = "Gamble";
    this.expMult = 2;
    this.townNum = 2;
    this.tooltip = _txt("actions>gamble>tooltip");
    this.label = _txt("actions>gamble>label");
    this.labelDone = _txt("actions>gamble>label_done");
    this.infoText = _txt("actions>gamble>info_text1") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>gamble>info_text2") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>gamble>info_text3") +
      "<br><div class='bold'>" +
      _txt("actions>tooltip>total_found") +
       "</div> <div id='total"+this.varName+"'></div>";

    this.stats = {
        Cha:.2,
        Luck:.8
    };
    this.canStart = function() {
        return gold >= 20 && reputation >= -5;
    };
    this.cost = function() {
        addGold(-20);
        addReputation(-1);
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
        towns[2].finishRegular(this.varName, 10, function() {
            addGold(60);
            return 60;
        })
    };
}


//Multipart actions
//Multipart actions have multiple distinct parts to get through before repeating
//They also get a bonus depending on how often you complete them

function HealTheSick() {
    this.varName = "Heal";
    this.name = "Heal The Sick";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt("actions>heal_sick>tooltip");
    this.label = _txt("actions>heal_sick>label");
    this.labelDone = _txt("actions>heal_sick>label_done");

    this.stats = {
        Per:.2,
        Int:.2,
        Cha:.2,
        Soul:.4
    };
    this.loopStats = ["Per", "Int", "Cha"];
    this.segments = 3;
    this.manaCost = function() {
        return 2500;
    };
    this.canStart = function() {
        return reputation >= 1;
    };
    this.loopCost = function(segment) {
        return fibonacci(2+Math.floor((towns[0].HealLoopCounter+segment)/this.segments+.0000001)) * 5000;
    };
    this.tickProgress = function(offset) {
        return getSkillLevel("Magic") * (1 + getLevel(this.loopStats[(towns[0].HealLoopCounter+offset) % this.loopStats.length])/100) * Math.sqrt(1 + towns[0].totalHeal/100);
    };
    this.loopsFinished = function() {
        addReputation(3);
    };
    this.getPartName = function() {
        return _txt("actions>heal_sick>label_part") + " " + numberToWords(Math.floor((towns[0].HealLoopCounter+.0001)/this.segments+1));
    };
    this.getSegmentName = function(segment) {
        let segments = [];
        $(_txtsObj("actions>heal_sick>segment_names>name")).each(function(x,segmentName) {
          segments.push($(segmentName).text());
        })
        return segments[segment % 3];
    };
    this.visible = function() {
        return towns[0].getLevel("Secrets") >= 20;
    };
    this.unlocked = function() {
        return getSkillLevel("Magic") >= 12;
    };
    this.finish = function() {
        addSkillExp("Magic", 10);
        view.updateLockedHidden();
    };
}

function FightMonsters() {
    this.varName = "Fight";
    this.name = "Fight Monsters";
    this.expMult = 1;
    this.townNum = 0;
    this.tooltip = _txt("actions>fight_monsters>tooltip");
    this.label = _txt("actions>fight_monsters>label");
    this.labelDone = _txt("actions>fight_monsters>label_done");

    this.stats = {
        Str:.3,
        Spd:.3,
        Con:.3,
        Luck:.1
    };
    this.loopStats = ["Spd", "Spd", "Spd", "Str", "Str", "Str", "Con", "Con", "Con"];
    this.segments = 3;
    this.manaCost = function() {
        return 2000;
    };
    this.canStart = function() {
        return reputation >= 2;
    };
    this.loopCost = function(segment) {
        return fibonacci(Math.floor((towns[0].FightLoopCounter+segment) - towns[0].FightLoopCounter/3+.0000001)) * 10000;
    };
    this.tickProgress = function(offset) {
        return getSelfCombat() * (1 + getLevel(this.loopStats[(towns[0].FightLoopCounter+offset) % this.loopStats.length])/100) * Math.sqrt(1 + towns[0].totalFight/100);
    };
    this.loopsFinished = function() {
    };
    this.segmentFinished = function() {
        addGold(20);
    };
    this.getPartName = function() {
        return monsterNames(towns[0].FightLoopCounter);
    };
    this.getSegmentName = function(segment) {
        let name = monsterNames(towns[0].FightLoopCounter);
        if(segment % 3 === 0) {
            return _txt("actions>fight_monsters>segment_modifier_1")+" "+name;
        } else if(segment % 3 === 1) {
            return _txt("actions>fight_monsters>segment_modifier_2")+" "+name;
        }
        return _txt("actions>fight_monsters>segment_modifier_3")+" "+name;
    };
    this.visible = function() {
        return towns[0].getLevel("Secrets") >= 20;
    };
    this.unlocked = function() {
        return getSkillLevel("Combat") >= 10;
    };
    this.finish = function() {
        addSkillExp("Combat", 10);
        view.updateLockedHidden();
    };
}
function monsterNames(FightLoopCounter) { //spd, defensive, aggressive
    let names = [];
    $(_txtsObj("actions>fight_monsters>segment_names>name")).each(function(x,monsterName) {
      names.push($(monsterName).text());
    });
    let altNames = [];
    $(_txtsObj("actions>fight_monsters>segment_alt_names>name")).each(function(x,monsterName) {
      altNames.push($(monsterName).text());
    });
    let name = names[Math.floor(FightLoopCounter/3+.0000001)];
    if(!name) {
        name = altNames[Math.floor(FightLoopCounter/3+.0000001) % 3]
    }
    return name;
}

function SmallDungeon() {
    this.varName = "SDungeon";
    this.name = "Small Dungeon";
    this.expMult = 1;
    this.townNum = 0;
    this.dungeonNum = 0;
    this.tooltip = _txt("actions>small_dungeon>tooltip");
    this.label = _txt("actions>small_dungeon>label");
    this.labelDone = _txt("actions>small_dungeon>label_done");

    this.stats = {
        Str:.1,
        Dex:.4,
        Con:.3,
        Cha:.1,
        Luck:.1
    };
    this.loopStats = ["Dex", "Con", "Dex", "Cha", "Dex", "Str", "Luck"];
    this.segments = 7;
    let ssDivContainer = "";
    for(let i = 0; i < dungeons[this.dungeonNum].length; i++) {
        ssDivContainer += "Floor " + (i+1) +
            " | <div class='bold'>"+_txt("actions>small_dungeon>chance_label")+" </div> <div id='soulstoneChance"+this.dungeonNum+"_"+i+"'></div>% - " +
            "<div class='bold'>"+_txt("actions>small_dungeon>last_stat_label")+" </div> <div id='soulstonePrevious"+this.dungeonNum+"_"+i+"'>NA</div> - " +
            "<div class='bold'>"+_txt("actions>small_dungeon>label_done")+"</div> <div id='soulstoneCompleted"+this.dungeonNum+"_"+i+"'></div><br>";
    }
    this.completedTooltip = _txt("actions>small_dungeon>completed_tooltip") +
        ssDivContainer;
    this.manaCost = function() {
        return 2000;
    };
    this.canStart = function() {
        let curFloor = Math.floor((towns[this.townNum].SDungeonLoopCounter)/this.segments+.0000001);
        return reputation >= 2 && curFloor < dungeons[this.dungeonNum].length;
    };
    this.loopCost = function(segment) {
        return precision3(Math.pow(2, Math.floor((towns[this.townNum].SDungeonLoopCounter+segment)/this.segments+.0000001)) * 15000);
    };
    this.tickProgress = function(offset) {
        let floor = Math.floor((towns[this.townNum].SDungeonLoopCounter)/this.segments+.0000001);
        return (getSelfCombat()+getSkillLevel("Magic")) * (1 + getLevel(this.loopStats[(towns[this.townNum].SDungeonLoopCounter+offset) % this.loopStats.length])/100) * Math.sqrt(1 + dungeons[this.dungeonNum][floor].completed / 200);
    };
    this.loopsFinished = function() {
        let curFloor = Math.floor((towns[this.townNum].SDungeonLoopCounter)/this.segments+.0000001-1);
        let success = finishDungeon(this.dungeonNum, curFloor);
        if(success === true && storyMax <= 1) {
            unlockStory(1);
        } else if(success === false && storyMax <= 2) {
            unlockStory(2);
        }
    };
    this.getPartName = function() {
        let floor = Math.floor((towns[0].SDungeonLoopCounter+.0001)/this.segments+1);
        return _txt("actions>small_dungeon>label_part") + " " + (floor <= dungeons[this.dungeonNum].length ? numberToWords(floor) : _txt("actions>small_dungeon>label_complete"));
    };
    this.getSegmentName = function(segment) {
        let segments = [];
        $(_txtsObj("actions>small_dungeon>segment_names>name")).each(function(x,segmentName) {
          segments.push($(segmentName).text());
        });
        return segments[segment % segments.length];
    };
    this.visible = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 15;
    };
    this.unlocked = function() {
        return (getSkillLevel("Combat") + getSkillLevel("Magic")) >= 35;
    };
    this.finish = function() {
        addSkillExp("Magic", 5);
        addSkillExp("Combat", 5);
        view.updateLockedHidden();
    };
}
function finishDungeon(dungeonNum, floorNum) {
    let floor = dungeons[dungeonNum][floorNum];
    if(!floor) {
        return;
    }
    floor.completed++;
    let rand = Math.random();
    if(rand <= floor.ssChance) {
        let statToAdd = statList[Math.floor(Math.random() * statList.length)];
        floor.lastStat = statToAdd;
        stats[statToAdd].soulstone = stats[statToAdd].soulstone ? (stats[statToAdd].soulstone+ Math.pow(10, dungeonNum)) : 1;
        floor.ssChance *= .98;
        view.updateSoulstones();
        return true;
    }
    return false;
}

function JoinAdvGuild() {
    this.varName = "AdvGuild";
    this.name = "Adventure Guild";
    this.expMult = 1;
    this.townNum = 2;
    this.tooltip = _txt("actions>adventure_guild>tooltip");
    this.label = _txt("actions>adventure_guild>label");
    this.labelDone = _txt("actions>adventure_guild>label_done");

    this.stats = {
        Str:.4,
        Dex:.3,
        Con:.3
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
        return (getSkillLevel("Magic")/2 + getSelfCombat("Combat")) * (1 + getLevel(this.loopStats[(towns[2].AdvGuildLoopCounter+offset) % this.loopStats.length])/100) * Math.sqrt(1 + towns[2].totalAdvGuild/1000);
    };
    this.loopsFinished = function() {
    };
    this.segmentFinished = function() {
        window.curAdvGuildSegment++;
        addMana(200);
    };
    this.getPartName = function() {
        return "Rank " + getAdvGuildRank().name;
    };
    this.getSegmentName = function(segment) {
        return "Rank " + getAdvGuildRank(segment % 3).name;
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
    let name = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS", "SSSS", "U", "UU", "UUU", "UUUU"][Math.floor(window.curAdvGuildSegment/3+.00001)];

    let segment = (offset === undefined ? 0 : offset - (window.curAdvGuildSegment % 3)) + window.curAdvGuildSegment;
    let bonus = precision3(1 + segment/20 + (segment ** 2)/300);
    if(!name) {
        name = "Godlike";
        bonus = Math.floor(1 + 2.25 + (45 ** 2)/300);
    } else {
        if(offset !== undefined) {
            name += ["-", "", "+"][offset % 3];
        } else {
            name += ["-", "", "+"][window.curAdvGuildSegment % 3];
        }
    }
    name += ", Mult x" + bonus;
    return {name:name,bonus:bonus};
}

function LargeDungeon() {
    this.varName = "LDungeon";
    this.name = "Large Dungeon";
    this.expMult = 2;
    this.townNum = 2;
    this.dungeonNum = 1;
    this.tooltip = _txt("actions>large_dungeon>tooltip");
    this.label = _txt("actions>large_dungeon>label");
    this.labelDone = _txt("actions>large_dungeon>label_done");

    this.stats = {
        Str:.2,
        Dex:.2,
        Con:.2,
        Cha:.3,
        Luck:.1
    };
    this.loopStats = ["Cha", "Spd", "Str", "Cha", "Dex", "Dex", "Str"];
    this.segments = 7;
    let ssDivContainer = "";
    for(let i = 0; i < dungeons[this.dungeonNum].length; i++) {
        ssDivContainer += "Floor " + (i+1) +
            " | <div class='bold'>"+_txt("actions>large_dungeon>chance_label")+" </div> <div id='soulstoneChance"+this.dungeonNum+"_"+i+"'></div>% - " +
        "<div class='bold'>"+_txt("actions>large_dungeon>last_stat_label")+" </div> <div id='soulstonePrevious"+this.dungeonNum+"_"+i+"'>NA</div> - " +
            "<div class='bold'>"+_txt("actions>large_dungeon>label_done")+"</div> <div id='soulstoneCompleted"+this.dungeonNum+"_"+i+"'></div><br>";
    }
    this.completedTooltip = _txt("actions>large_dungeon>completed_tooltip") +
        ssDivContainer;
    this.affectedBy = ["Gather Team"];
    this.manaCost = function() {
        return 6000;
    };
    this.canStart = function() {
        let curFloor = Math.floor((towns[this.townNum].LDungeonLoopCounter)/this.segments+.0000001);
        return teamNum >= 1 && curFloor < dungeons[this.dungeonNum].length;
    };
    this.loopCost = function(segment) {
        return precision3(Math.pow(3, Math.floor((towns[this.townNum].LDungeonLoopCounter+segment)/this.segments+.0000001)) * 5e5);
    };
    this.tickProgress = function(offset) {
        let floor = Math.floor((towns[this.townNum].LDungeonLoopCounter)/this.segments+.0000001);
        return (getTeamCombat()+getSkillLevel("Magic")) * (1 + getLevel(this.loopStats[(towns[this.townNum].LDungeonLoopCounter+offset) % this.loopStats.length])/100) * Math.sqrt(1 + dungeons[this.dungeonNum][floor].completed / 200);
    };
    this.loopsFinished = function() {
        let curFloor = Math.floor((towns[this.townNum].LDungeonLoopCounter)/this.segments+.0000001-1);
        let success = finishDungeon(this.dungeonNum, curFloor);
        if(success && storyMax <= 1) {
            // unlockStory(1);
        } else if(storyMax <= 2) {
            // unlockStory(2);
        }
    };
    this.getPartName = function() {
        let floor = Math.floor((towns[2].LDungeonLoopCounter+.0001)/this.segments+1);
        return _txt("actions>large_dungeon>label_part") + " " + (floor <= dungeons[this.dungeonNum].length ? numberToWords(floor) : _txt("actions>large_dungeon>label_complete"));
    };
    this.getSegmentName = function(segment) {
        let segments = [];
        $(_txtsObj("actions>large_dungeon>segment_names>name")).each(function(x,segmentName) {
            segments.push($(segmentName).text());
        });
        return segments[segment % segments.length];
    };
    this.visible = function() {
        return towns[2].getLevel("Drunk") >= 5;
    };
    this.unlocked = function() {
        return towns[2].getLevel("Drunk") >= 20;
    };
    this.finish = function() {
        addSkillExp("Magic", 15);
        addSkillExp("Combat", 15);
        view.updateLockedHidden();
    };
}

function CraftingGuild() {
    this.name = "Crafting Guild";
    this.expMult = 1;
    this.townNum = 2;

    this.tooltip = _txt("actions>craft_guild>tooltip");
    this.label = _txt("actions>craft_guild>label"); // this is the displayed name of the action. You use the english name in the code, so I was obligated to create a new var for the displayed name in order to localize
    this.labelDone = _txt("actions>craft_guild>label_done");
    // this.label = his.name // this is the easiest (instead of previous line) way to have a correct display if you prefer to not go into the XML while coding/

    this.varName = "CraftGuild";
    this.stats = {
        Dex:.3,
        Per:.3,
        Int:.4
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
        return (getSkillLevel("Magic")/2 + getSkillLevel("Crafting")) * (1 + getLevel(this.loopStats[(towns[2].CraftGuildLoopCounter+offset) % this.loopStats.length])/100) * Math.sqrt(1 + towns[2].totalCraftGuild/1000);
    };
    this.loopsFinished = function() {
    };
    this.segmentFinished = function() {
        window.curCraftGuildSegment++;
        addSkillExp("Crafting", 50);
        addGold(10);
    };
    this.getPartName = function() {
        return "Rank " + getCraftGuildRank().name;
    };
    this.getSegmentName = function(segment) {
        return "Rank " + getCraftGuildRank(segment % 3).name;
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
    let name = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS", "SSSS", "U", "UU", "UUU", "UUUU"][Math.floor(window.curCraftGuildSegment/3+.00001)];

    let segment = (offset === undefined ? 0 : offset - (window.curCraftGuildSegment % 3)) + window.curCraftGuildSegment;
    let bonus = precision3(1 + segment/20 + (segment ** 2)/300);
    if(!name) {
        name = "Godlike";
        bonus = Math.floor(1 + 2.25 + (45 ** 2)/300);
    } else {
        if(offset !== undefined) {
            name += ["-", "", "+"][offset % 3];
        } else {
            name += ["-", "", "+"][window.curCraftGuildSegment % 3];
        }
    }
    name += ", Mult x" + bonus;
    return {name:name,bonus:bonus};
}

function BuyPickaxe() {
    this.name = "Buy Pickaxe";
    this.expMult = 1;
    this.townNum = 2;
    this.tooltip = _txt("actions>buy_pickaxe>tooltip");
    this.label = _txt("actions>buy_pickaxe>label");

    this.varName = "Pickaxe";
    this.stats = {
        Cha:.8,
        Int:.1,
        Spd:.1
    };
    this.allowed = function() {
        return 1;
    };
    this.canStart = function() {
        return gold >= 200;
    };
    this.cost = function() {
        addGold(-200);
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
        addPickaxe(1);
    };
}

function StartTrek() {
    this.varName = "StartTrek";
    this.name = "Start Trek";
    this.expMult = 2;
    this.townNum = 2;
    this.tooltip = _txt("actions>start_trek>tooltip");
    this.label = _txt("actions>start_trek>label");

    this.stats = {
        Con:.7,
        Per:.2,
        Spd:.1
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
    this.tooltip = _txt("actions>climb_mountain>tooltip");
    this.label = _txt("actions>climb_mountain>label");
    this.labelDone = _txt("actions>climb_mountain>label_done");

    this.varName = "Mountain";
    this.stats = {
        Dex:.1,
        Str:.2,
        Con:.4,
        Per:.2,
        Spd:.1
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
        towns[3].finishProgress(this.varName, 100 * (pickaxe ? 2 : 1), function() {
            adjustGeysers();
        });
    };
}

function ManaGeyser() {
    this.varName = "Geysers";
    this.name = "Mana Geyser";
    this.expMult = 1;
    this.townNum = 3;
    this.tooltip = _txt("actions>mana_geyser>tooltip");
    this.label = _txt("actions>mana_geyser>label");
    this.labelDone = _txt("actions>mana_geyser>label_done");
    this.infoText = _txt("actions>mana_geyser>info_text1") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>mana_geyser>info_text2") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>mana_geyser>info_text3") +
      "<br><div class='bold'>" +
      _txt("actions>tooltip>total_found") +
       "</div> <div id='total"+this.varName+"'></div>";

    this.stats = {
        Str:.6,
        Per:.3,
        Int:.1,
    };
    this.affectedBy = ["Buy Pickaxe"];
    this.manaCost = function() {
        return 2000;
    };
    this.canStart = function() {
        return pickaxe;
    };
    this.visible = function() {
        return true;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Mountain") >= 2;
    };
    this.finish = function() {
        towns[3].finishRegular(this.varName, 100, function() {
            addMana(5000);
            return 5000;
        })
    };
}
function adjustGeysers() {
    towns[3].totalGeysers = towns[3].getLevel("Mountain") * 10;
}

function DecipherRunes() {
    this.name = "Decipher Runes";
    this.expMult = 1;
    this.townNum = 3;
    this.tooltip = _txt("actions>decipher_runes>tooltip");
    this.label = _txt("actions>decipher_runes>label");
    this.labelDone = _txt("actions>decipher_runes>label_done");

    this.varName = "Runes";
    this.stats = {
        Per:.3,
        Int:.7
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
        towns[3].finishProgress(this.varName, 100 * (glasses ? 2 : 1), function() {
            view.adjustManaCost("Chronomancy");
            view.adjustManaCost("Pyromancy");
        });
    };
}

function Chronomancy() {
    this.name = "Chronomancy";
    this.expMult = 2;
    this.townNum = 3;
    this.tooltip = _txt("actions>chronomancy>tooltip");
    this.label = _txt("actions>chronomancy>label");

    this.varName = "trChronomancy";
    this.stats = {
        Soul:.1,
        Spd:.3,
        Int:.6
    };
    this.manaCost = function() {
        return Math.ceil(10000 * (1 - towns[3].getLevel("Runes") * .005));
    };
    this.visible = function() {
        return towns[3].getLevel("Runes") >= 8;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Runes") >= 30 && getSkillLevel("Magic") >= 150;
    };
    this.finish = function() {
        addSkillExp("Chronomancy", 100);
    };
}

function LoopingPotion() {
    this.varName = "LoopingPotion";
    this.name = "Looping Potion";
    this.expMult = 2;
    this.townNum = 3;
    this.tooltip = _txt("actions>looping_potion>tooltip");
    this.label = _txt("actions>looping_potion>label");

    this.stats = {
        Dex:.2,
        Int:.7,
        Soul:.1,
    };
    this.canStart = function() {
        return herbs >= 200;
    };
    this.cost = function() {
        addHerbs(-200);
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
        addLoopingPotion(1);
        addSkillExp("Alchemy", 100);
    };
}

function Pyromancy() {
    this.name = "Pyromancy";
    this.expMult = 2;
    this.townNum = 3;
    this.tooltip = _txt("actions>pyromancy>tooltip");
    this.label = _txt("actions>pyromancy>label");

    this.varName = "trPyromancy";
    this.stats = {
        Per:.2,
        Int:.7,
        Soul:.1
    };
    this.manaCost = function() {
        return Math.ceil(14000 * (1 - towns[3].getLevel("Runes") * .005));
    };
    this.visible = function() {
        return towns[3].getLevel("Runes") >= 16;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Runes") >= 60 && getSkillLevel("Magic") >= 200;
    };
    this.finish = function() {
        addSkillExp("Pyromancy", 100);
    };
}

function ExploreCavern() {
    this.name = "Explore Cavern";
    this.expMult = 1;
    this.townNum = 3;
    this.tooltip = _txt("actions>explore_cavern>tooltip");
    this.label = _txt("actions>explore_cavern>label");
    this.labelDone = _txt("actions>explore_cavern>label_done");

    this.varName = "Cavern";
    this.stats = {
        Dex:.1,
        Str:.3,
        Con:.2,
        Per:.3,
        Spd:.1
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
        towns[3].finishProgress(this.varName, 100, function() {
            adjustMineSoulstones();
        });
    };
}

function MineSoulstones() {
    this.varName = "MineSoulstones";
    this.name = "Mine Soulstones";
    this.expMult = 1;
    this.townNum = 3;
    this.tooltip = _txt("actions>mine_soulstones>tooltip");
    this.label = _txt("actions>mine_soulstones>label");
    this.labelDone = _txt("actions>mine_soulstones>label_done");
    this.infoText = _txt("actions>mine_soulstones>info_text1") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>mine_soulstones>info_text2") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>mine_soulstones>info_text3") +
      "<br><div class='bold'>" +
      _txt("actions>tooltip>total_found") +
       "</div> <div id='total"+this.varName+"'></div>";

    this.stats = {
        Str:.6,
        Dex:.1,
        Con:.3,
    };
    this.affectedBy = ["Buy Pickaxe"];
    this.manaCost = function() {
        return 5000;
    };
    this.canStart = function() {
        return pickaxe;
    };
    this.visible = function() {
        return towns[3].getLevel("Cavern") >= 2;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Cavern") >= 20;
    };
    this.finish = function() {
        towns[3].finishRegular(this.varName, 10, function() {
            let statToAdd = statList[Math.floor(Math.random() * statList.length)];
            stats[statToAdd].soulstone += 1;
            view.updateSoulstones();
        })
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
    this.tooltip = _txt("actions>hunt_trolls>tooltip");
    this.label = _txt("actions>hunt_trolls>label");
    this.labelDone = _txt("actions>hunt_trolls>label_done");

    this.stats = {
        Str:.3,
        Dex:.3,
        Con:.2,
        Per:.1,
        Int:.1
    };
    this.loopStats = ["Per", "Con", "Dex", "Str", "Int"];
    this.segments = 5;
    this.manaCost = function() {
        return 8000;
    };
    this.loopCost = function(segment) {
        return precision3(Math.pow(2, Math.floor((towns[this.townNum].HuntTrollsLoopCounter+segment)/this.segments+.0000001)) * 1e6);
    };
    this.tickProgress = function(offset) {
        return (getSelfCombat() * (1 + getLevel(this.loopStats[(towns[3].HuntTrollsLoopCounter+offset) % this.loopStats.length])/100) * Math.sqrt(1 + towns[3].totalHuntTrolls/100));
    };
    this.loopsFinished = function() {
        addSkillExp("Combat", 1000);
        addBlood(1)
    };
    this.segmentFinished = function() {
    };
    this.getPartName = function() {
        return "Hunt Troll";
    };
    this.getSegmentName = function(segment) {
        let segments = [];
        $(_txtsObj("actions>hunt_trolls>segment_names>name")).each(function(x,segmentName) {
          segments.push($(segmentName).text());
        })
        return segments[segment % 5];
    };
    this.visible = function() {
        return towns[3].getLevel("Cavern") >= 5;
    };
    this.unlocked = function() {
        return towns[3].getLevel("Cavern") >= 50;
    };
    this.finish = function() {
    };
}

function CheckWalls() {
    this.name = "Check Walls";
    this.expMult = 1;
    this.townNum = 3;
    this.tooltip = _txt("actions>check_walls>tooltip");
    this.label = _txt("actions>check_walls>label");
    this.labelDone = _txt("actions>check_walls>label_done");

    this.varName = "Illusions";
    this.stats = {
        Spd:.1,
        Dex:.1,
        Per:.4,
        Int:.4
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
        towns[3].finishProgress(this.varName, 100, function() {
            adjustArtifacts();
        });
    };
}

function TakeArtifacts() {
    this.varName = "Artifacts";
    this.name = "Take Artifacts";
    this.expMult = 1;
    this.townNum = 3;
    this.tooltip = _txt("actions>take_artifacts>tooltip");
    this.label = _txt("actions>take_artifacts>label");
    this.labelDone = _txt("actions>take_artifacts>label_done");
    this.infoText = _txt("actions>take_artifacts>info_text1") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>take_artifacts>info_text2") +
      " <i class='fa fa-arrow-left'></i> " +
      _txt("actions>take_artifacts>info_text3") +
      "<br><div class='bold'>" +
      _txt("actions>tooltip>total_found") +
       "</div> <div id='total"+this.varName+"'></div>";

    this.stats = {
        Spd:.2,
        Per:.6,
        Int:.2,
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
        towns[3].finishRegular(this.varName, 25, function() {
            addArtifacts(1)
        })
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
    this.tooltip = _txt("actions>imbue_mind>tooltip");
    this.tooltip2 = _txt("actions>great_feast>tooltip2");
    this.label = _txt("actions>imbue_mind>label");
    this.labelDone = _txt("actions>imbue_mind>label_done");

    this.stats = {
        Spd:.1,
        Per:.1,
        Int:.8
    };
    this.loopStats = ["Spd", "Per", "Int"];
    this.segments = 3;
    this.manaCost = function() {
        return 500000;
    };
    this.allowed = function() {
        return 1;
    };
    this.canStart = function() {
        var tempCost = (towns[3].totalImbueMind+1) * 20
        var tempCanStart = true;
        for(var i=0; i<9; i++) {
            if (Math.ceil(tempCost/9) > stats[statList[i]].soulstone) tempCanStart = false;
        }
        return towns[3].ImbueMindLoopCounter === 0 && tempCanStart && getBuffLevel("Imbuement") < parseInt(document.getElementById("buffImbuementCap").value);
    };
    this.loopCost = function(segment) {
        return 100000000 * (segment*5+1);
    };
    this.tickProgress = function(offset) {
        return getSkillLevel("Magic") * (1 + getLevel(this.loopStats[(towns[3].ImbueMindLoopCounter+offset) % this.loopStats.length])/100);
    };
    this.loopsFinished = function() {
        trainingLimits++;
        addBuffAmt("Imbuement", 1);
        var tempSoulstonesSacrificed = 0;
        var tempSoulstonesToSacrifice = Math.ceil((towns[3].totalImbueMind * 20) / 9);
        for(var i=0; i<9; i++) {
            if (tempSoulstonesSacrificed + tempSoulstonesToSacrifice > towns[3].totalImbueMind * 20) tempSoulstonesToSacrifice = towns[3].totalImbueMind * 20 - tempSoulstonesSacrificed
            tempSoulstonesSacrificed += tempSoulstonesToSacrifice
            stats[statList[i]].soulstone -= tempSoulstonesToSacrifice
        }
        view.updateSoulstones();
        view.adjustGoldCost("ImbueMind", goldCostImbueMind());
    };
    this.getPartName = function() {
        return "Imbue Mind";
    };
    this.getSegmentName = function(segment) {
        let segments = [];
        $(_txtsObj("actions>imbue_mind>segment_names>name")).each(function(x,segmentName) {
          segments.push($(segmentName).text());
        })
        return segments[segment % 3];
    };
    this.visible = function() {
        return towns[3].getLevel("Illusions") >= 50;
    };
    this.unlocked = function() {
        let toUnlock = towns[3].getLevel("Illusions") >= 70 && getSkillLevel("Magic") >= 300;
        if(toUnlock && !isVisible(document.getElementById("buffList"))) {
            document.getElementById("buffList").style.display = "flex";
        }
        return toUnlock;
    };
    this.finish = function() {
        view.updateBuff("Imbuement");
    };
}
function goldCostImbueMind() {
    return 20*(getBuffLevel("Imbuement")+1);
}

function FaceJudgement() {
    this.varName = "FaceJudgement";
    this.name = "Face Judgement";
    this.expMult = 2;
    this.townNum = 3;
    this.tooltip = _txt("actions>face_judgement>tooltip");
    this.label = _txt("actions>face_judgement>label");

    this.stats = {
        Cha:.3,
        Luck:.2,
        Soul:.5,
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
        //if (reputation >= 50) unlockTown(4);
        //else if (reputation <= 50) unlockTown(5);
    };
}

function FallFromGrace() {
    this.varName = "FallFromGrace";
    this.name = "Fall From Grace";
    this.expMult = 2;
    this.townNum = 4;
    this.tooltip = _txt("actions>fall_from_grace>tooltip");
    this.label = _txt("actions>fall_from_grace>label");

    this.stats = {
        Dex:.4,
        Luck:.3,
        Spd:.2,
        Int:.1,
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
        //TODO: remove this when z5/6 are added
        //unlockTown(5);
    };
}

//TODO: make this correct
function GreatFeast() {
    this.varName = "GreatFeast";
    this.name = "Great Feast";
    this.expMult = 5;
    this.townNum = 4;
    this.tooltip = _txt("actions>great_feast>tooltip");
    this.tooltip2 = _txt("actions>great_feast>tooltip2");
    this.label = _txt("actions>great_feast>label");
    this.labelDone = _txt("actions>great_feast>label_done");

    this.stats = {
        Spd:.1,
        Int:.1,
        Soul:.8
    };
    this.loopStats = ["Spd", "Int", "Soul"];
    this.segments = 3;
    this.manaCost = function() {
        return Math.ceil(50000 * (1 - towns[1].getLevel("Witch") * .005));
    };
    this.allowed = function() {
        return 1;
    };
    this.canStart = function() {
        var tempCost = (towns[1].totalDarkRitual+1) * 50
        var tempCanStart = true;
        for(var i=0; i<9; i++) {
            if (Math.ceil(tempCost/9) > stats[statList[i]].soulstone) tempCanStart = false;
        }
        return reputation <= -5 && towns[1].DarkRitualLoopCounter === 0 && tempCanStart && getBuffLevel("Feast") < parseInt(document.getElementById("buffFeastCap").value);
    };
    this.loopCost = function(segment) {
        return 1000000 * (segment*2+1);
    };
    this.tickProgress = function(offset) {
        return getSkillLevel("Dark") * (1 + getLevel(this.loopStats[(towns[1].DarkRitualLoopCounter+offset) % this.loopStats.length])/100) / (1 - towns[1].getLevel("Witch") * .005);
    };
    this.loopsFinished = function() {
        addBuffAmt("Ritual", 1)
        var tempSoulstonesSacrificed = 0;
        var tempSoulstonesToSacrifice = Math.ceil((towns[1].totalDarkRitual * 50) / 9);
        for(var i=0; i<9; i++) {
            if (tempSoulstonesSacrificed + tempSoulstonesToSacrifice > towns[1].totalDarkRitual * 50) tempSoulstonesToSacrifice = towns[1].totalDarkRitual * 50 - tempSoulstonesSacrificed
            tempSoulstonesSacrificed += tempSoulstonesToSacrifice
            stats[statList[i]].soulstone -= tempSoulstonesToSacrifice
        }
        view.updateSoulstones();
        view.adjustGoldCost("GreatFeast", goldCostGreatFeast());
    };
    this.getPartName = function() {
        return "Host Great Feast";
    };
    this.getSegmentName = function(segment) {
        let segments = [];
        $(_txtsObj("actions>great_feast>segment_names>name")).each(function(x,segmentName) {
          segments.push($(segmentName).text());
        })
        return segments[segment % 3];
    };
    this.visible = function() {
        return towns[1].getLevel("Thicket") >= 50;
    };
    this.unlocked = function() {
        let toUnlock = towns[1].getLevel("Thicket") >= 90 && getSkillLevel("Dark") >= 50;
        if(toUnlock && !isVisible(document.getElementById("buffList"))) {
            document.getElementById("buffList").style.display = "flex";
        }
        return toUnlock;
    };
    this.finish = function() {
        view.updateBuff("Feast");
    };
}
function goldCostGreatFeast() {
    return 500*(getBuffLevel("Feast")+1);
}
