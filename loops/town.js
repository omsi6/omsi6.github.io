'use strict';
function Town(index) {
    this.index = index;
    this.varNames = [];
    this.progressVars = [];
    this.totalActionList = [];

    this.expFromLevel = function(level) {
        return level * (level + 1) * 50;
    };

    this.getLevel = function(varName) {
        return Math.floor((Math.sqrt(8*this["exp"+varName]/100+1)-1)/2);
    };

    this.restart = function() {
        for(let i = 0; i < this.varNames.length; i++) {
            let varName = this.varNames[i];
            this["goodTemp"+varName] = this["good"+varName];
            this["lootFrom"+varName] = 0;
            view.updateRegular(varName, this.index);
        }
    };

    this.finishProgress = function(varName, expGain, levelUpReward) {
        const prevLevel = this.getLevel(varName);
        if(this["exp"+varName]+expGain > 505000 ) {
            this["exp"+varName] = 505000;
        } else {
            this["exp"+varName] += expGain;
        }
        let level = this.getLevel(varName);

        if(level !== prevLevel) {
            //level up
            levelUpReward();

            for(let i = 0; i < view.totalActionList.length; i++) {
                let action = view.totalActionList[i];
                if(towns[curTown].varNames.indexOf(action.varName) !== -1) {
                    view.updateRegular(action.varName, action.townNum);
                }
            }

            view.updateLockedHidden();
        }
        view.updateSingleProgressAction(towns[curTown], varName);
    };

    this.getPrcToNext = function(varName) {
        let level = this.getLevel(varName);
        let expOfCurLevel = this.expFromLevel(level);
        let curLevelProgress = this["exp"+varName] - expOfCurLevel;
        let nextLevelNeeds = this.expFromLevel(level+1) - expOfCurLevel;
        return Math.floor(curLevelProgress / nextLevelNeeds * 100 * 10) / 10
    };

    // finishes actions that have checkable aspects
    this.finishRegular = function(varName, rewardRatio, rewardFunc) {
        if(this["total"+varName] - this["checked"+varName] < 0) { //error state, negative numbers.
            this["checked"+varName] = this["total"+varName];
            this["good"+varName] = Math.floor(this["total"+varName] / rewardRatio);
            this["goodTemp"+varName] = this["good"+varName];
            console.log("Error state fixed");
        }

        // only checks unchecked items 
        // IF there are unchecked items 
        // AND the user has not disabled checking unchecked items OR there are no checked items left
        if (this["total" + varName] - this["checked" + varName] > 0
            && ((document.getElementById("searchToggler"+varName) && !document.getElementById("searchToggler"+varName).checked) || this["goodTemp" + varName] <= 0)) {

            this["checked"+varName]++;
            if(this["checked"+varName] % rewardRatio === 0) {
                this["lootFrom"+varName] += rewardFunc();
                this["good"+varName]++;
            }
        } else if(this["goodTemp"+varName] > 0) {
            this["goodTemp"+varName]--;
            this["lootFrom"+varName] += rewardFunc();
        }
        view.updateRegular(varName, this.index);
    };

    this.createVars = function(varName) {
        if(this["checked"+varName] === undefined) {
            this["checked"+varName] = 0;
        }
        if(this["goodTemp"+varName] === undefined) {
            this["goodTemp"+varName] = 0;
        }
        if(this["good"+varName] === undefined) {
            this["good"+varName] = 0;
        }
        if(this["lootFrom"+varName] === undefined) {
            this["lootFrom"+varName] = 0;
        }
        if(this["total"+varName] === undefined) {
            this["total"+varName] = 0;
        }
        if(this.varNames.indexOf(varName) === -1) {
            this.varNames.push(varName);
        }
    };

    this.createProgressVars = function(varName) {
        if(this["exp"+varName] === undefined) {
            this["exp"+varName] = 0;
        }
        if(this.progressVars.indexOf(varName) === -1) {
            this.progressVars.push(varName);
        }
    };
    if(this.index === 0) {
        this.createVars("Pots");
        this.createVars("Locks");
        this.createVars("SQuests");
        this.createVars("LQuests");
        this.createProgressVars("Wander");
        this.createProgressVars("Met");
        this.createProgressVars("Secrets");
        this.Heal = 0;
        this.HealLoopCounter = 0;
        this.Fight = 0;
        this.FightLoopCounter = 0;
        this.SDungeon = 0;
        this.SDungeonLoopCounter = 0;
        this.suppliesCost = 300;
    } else if(this.index === 1) {
        this.createVars("WildMana");
        this.createVars("Herbs");
        this.createVars("Hunt");
        this.createProgressVars("Forest");
        this.createProgressVars("Shortcut");
        this.createProgressVars("Hermit");
        this.createProgressVars("Flowers");
        this.createProgressVars("Thicket");
        this.createProgressVars("Witch");
        this.DarkRitual= 0;
        this.DarkRitualLoopCounter = 0;
    } else if(this.index === 2) {
        this.createVars("Gamble");
        this.createProgressVars("City");
        this.createProgressVars("Drunk");
        this.AdvGuild = 0;
        this.AdvGuildLoopCounter = 0;
        this.CraftGuild = 0;
        this.CraftGuildLoopCounter = 0;
        this.LDungeon = 0;
        this.LDungeonLoopCounter = 0;
        this.createProgressVars("Apprentice");
        this.createProgressVars("Mason");
        this.createProgressVars("Architect");
    } else if(this.index === 3) {
        this.createVars("Geysers");
        this.createVars("MineSoulstones");
        this.createVars("Artifacts");
        this.createProgressVars("Mountain");
        this.createProgressVars("Runes");
        this.createProgressVars("Cavern");
        this.createProgressVars("Illusions");
        this.HuntTrolls = 0;
        this.HuntTrollsLoopCounter = 0;
        this.ImbueMind = 0;
        this.ImbueMindLoopCounter = 0;
    }

}
