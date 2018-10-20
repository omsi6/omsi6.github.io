const nameArray = ["catnip:", "wood:", "minerals:", "coal:", "iron:", "titanium:", "gold:", "oil:", "uranium:", "unobtainium:", "catpower:", "science:", "culture:", "faith:", "kittens:", "zebras:", "starchart:", "antimatter:", "furs:", "ivory:", "spice:", "unicorns:", "alicorns:", "necrocorns:", "tears:", "karma:", "paragon:", "burned paragon:", "time crystal:", "relic:", "void:", "present box:", "wrapping paper:", "blackcoin:"];
const classicColorArray = ["black", "black", "black", "black", "black", "black", "black", "black", "rgb(78, 162, 78)", "rgb(160, 0, 0)", "rgb(219, 169, 1)", "rgb(1, 169, 219)", "rgb(223, 1, 215)", "gray", "black", "black", "rgb(154, 46, 254)", "rgb(90, 14, 222)", "coral", "coral", "coral", "orange", "orange", "rgb(224, 0, 0)", "orange", "orange", "rgb(97, 65, 205)", "rgb(73, 48, 153)", "rgb(20, 205, 97)", "rgb(90, 14, 222)", "rgb(90, 14, 222)", "rgb(250, 14, 222)", "rgb(250, 14, 222)", "gold"];
const shadowColorArray = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "coral 1px 0px 10px", "coral 1px 0px 10px", "coral 1px 0px 10px", "coral 1px 0px 10px", "coral 1px 0px 10px", "", "", "", "rgb(154, 46, 254) 1px 0px 10px", "rgb(154, 46, 254) 1px 0px 10px", "rgb(250, 46, 158) 1px 0px 10px", "rgb(250, 46, 158) 1px 0px 10px", ""]

var exportOutput = document.createElement("textarea");
exportOutput.type = "text";
exportOutput.id = "exportOutput";
document.getElementById("body").appendChild(exportOutput)
document.getElementById("exportOutput").style.position = "absolute";
document.getElementById("exportOutput").style.left = "-9999px";

$(".picker").spectrum({
    showInput: true,
    className: "colorpicker",
    showInitial: true,
    showPalette: true,
    showSelectionPalette: true,
    showAlpha: true,
    maxSelectionSize: 10,
    preferredFormat: "rgb",
    localStorageKey: "spectrum.colors",
    move: function (color) {
        
    },
    show: function () {
    
    },
    beforeShow: function () {
    
    },
    hide: function () {
    
    },
    change: function() {
        updateBookmarklet()
    },
    palette: [
        ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
        "rgb(204, 204, 204)", "rgb(217, 217, 217)","rgb(255, 255, 255)"],
        ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"], 
        ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", 
        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", 
        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", 
        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", 
        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", 
        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", 
        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
    ]
});

var theme = 1;
function pickTheme() {
    if (theme === 0) {
        document.body.style.background = "#FFFFFF";
        document.body.style.color = "#000";
        document.getElementById("themebtn").innerHTML = "Color scheme:<br>Classic";
        for (var i=0; i<34; i++) {
            if (document.getElementsByClassName("sp-input")[i].value === "rgb(220, 220, 220)" && document.getElementsByClassName("sp-input")[i+34].value === "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+68].value === "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+102].value === "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+136].value === "rgba(0, 0, 0, 0)") $(".picker").eq(i).spectrum("set", "#000")
        }
    }
    if (theme === 1) {
        document.body.style.background = "#201F1D";
        document.body.style.color = "#eee";
        document.getElementById("themebtn").innerHTML = "Color scheme:<br>Inverted";
        for (var i=0; i<34; i++) {
            if (document.getElementsByClassName("sp-input")[i].value === "rgb(0, 0, 0)" && document.getElementsByClassName("sp-input")[i+34].value === "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+68].value === "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+102].value === "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+136].value === "rgba(0, 0, 0, 0)") $(".picker").eq(i).spectrum("set", "#DCDCDC")
        }
    }
    if (theme === 2) {
        document.body.style.background = "#C6EBA1";
        document.body.style.color = "#000";
        document.getElementById("themebtn").innerHTML = "Color scheme:<br>Grassy";
        for (var i=0; i<34; i++) {
            if (document.getElementsByClassName("sp-input")[i].value === "rgb(220, 220, 220)" && document.getElementsByClassName("sp-input")[i+34].value === "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+68].value === "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+102].value === "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+136].value === "rgba(0, 0, 0, 0)") $(".picker").eq(i).spectrum("set", "#000")
        }
    }
    if (theme === 3) {
        document.body.style.color = "#fff";
        document.body.style.background = "linear-gradient(to right, #0d0d0d 0%, #1c1917 24%, #1c1917 76%, #0d0d0d 100%)";
        document.getElementById("themebtn").innerHTML = "Color scheme:<br>Sleek";
        for (var i=0; i<34; i++) {
            if (document.getElementsByClassName("sp-input")[i].value === "rgb(0, 0, 0)" && document.getElementsByClassName("sp-input")[i+34].value === "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+68].value === "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+102].value === "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+136].value === "rgba(0, 0, 0, 0)") $(".picker").eq(i).spectrum("set", "#DCDCDC")
        }
    }
    theme++;
    if (theme === 4) theme = 0;
}

function updateColors() {
    for (var i=0; i<34; i++) {
        if (document.getElementsByClassName("sp-input")[i+34].value !== "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+68].value !== "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+102].value !== "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+136].value !== "rgba(0, 0, 0, 0)") {
            document.getElementById("resource"+(i+1)).style.background = "-webkit-linear-gradient(360deg, "+document.getElementsByClassName("sp-input")[i].value+" 0%, "+document.getElementsByClassName("sp-input")[i+34].value+" 25%, "+document.getElementsByClassName("sp-input")[i+68].value+" 50%, "+document.getElementsByClassName("sp-input")[i+102].value+" 75%, "+document.getElementsByClassName("sp-input")[i+136].value+" 100%)"
            document.getElementById("resource"+(i+1)).style.webkitBackgroundClip = "text"
            document.getElementById("resource"+(i+1)).style.webkitTextFillColor = "transparent"
        } else if (document.getElementsByClassName("sp-input")[i+34].value !== "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+68].value !== "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+102].value !== "rgba(0, 0, 0, 0)") {
            document.getElementById("resource"+(i+1)).style.background = "-webkit-linear-gradient(360deg, "+document.getElementsByClassName("sp-input")[i].value+" 0%, "+document.getElementsByClassName("sp-input")[i+34].value+" 33%, "+document.getElementsByClassName("sp-input")[i+68].value+" 66%, "+document.getElementsByClassName("sp-input")[i+102].value+" 100%)"
            document.getElementById("resource"+(i+1)).style.webkitBackgroundClip = "text"
            document.getElementById("resource"+(i+1)).style.webkitTextFillColor = "transparent"
        } else if (document.getElementsByClassName("sp-input")[i+34].value !== "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+68].value !== "rgba(0, 0, 0, 0)") {
            document.getElementById("resource"+(i+1)).style.background = "-webkit-linear-gradient(360deg, "+document.getElementsByClassName("sp-input")[i].value+" 0%, "+document.getElementsByClassName("sp-input")[i+34].value+" 50%, "+document.getElementsByClassName("sp-input")[i+68].value+" 100%)"
            document.getElementById("resource"+(i+1)).style.webkitBackgroundClip = "text"
            document.getElementById("resource"+(i+1)).style.webkitTextFillColor = "transparent"
        } else if (document.getElementsByClassName("sp-input")[i+34].value !== "rgba(0, 0, 0, 0)") {
            document.getElementById("resource"+(i+1)).style.background = "-webkit-linear-gradient(360deg, "+document.getElementsByClassName("sp-input")[i].value+" 0%, "+document.getElementsByClassName("sp-input")[i+34].value+" 100%)"
            document.getElementById("resource"+(i+1)).style.webkitBackgroundClip = "text"
            document.getElementById("resource"+(i+1)).style.webkitTextFillColor = "transparent"
        } else {
            document.getElementById("resource"+(i+1)).style.color = document.getElementsByClassName("sp-input")[i].value
        }
        document.getElementById("resource"+(i+1)).style.textShadow = "1px 0px 10px "+document.getElementsByClassName("sp-input")[i+170].value
    }
}

function importTemplate() {
    var input = prompt("Paste your command here/drag your bookmarklet here:")
    var colors = JSON.parse(input.split("//")[1])
    for (var i=0; i<34; i++) {
        $(".picker").eq(i).spectrum("set", colors.textColors1[i])
        $(".picker").eq(i+34).spectrum("set", colors.textColors2[i])
        $(".picker").eq(i+68).spectrum("set", colors.textColors3[i])
        $(".picker").eq(i+102).spectrum("set", colors.textColors4[i])
        $(".picker").eq(i+136).spectrum("set", colors.textColors5[i])
        $(".picker").eq(i+170).spectrum("set", colors.shadowColors[i])
    }
}

function getJavascript() {
    var textColors1 = [];
    var textColors2 = [];
    var textColors3 = [];
    var textColors4 = [];
    var textColors5 = [];
    var shadowColors = [];
    var str = 'function color() { var res = $(".resTable"); '
    for (var i=0; i<34; i++) {
        textColors1[i] = document.getElementsByClassName("sp-input")[i].value;
        textColors2[i] = document.getElementsByClassName("sp-input")[i+34].value;
        textColors3[i] = document.getElementsByClassName("sp-input")[i+68].value;
        textColors4[i] = document.getElementsByClassName("sp-input")[i+102].value;
        textColors5[i] = document.getElementsByClassName("sp-input")[i+136].value;
        shadowColors[i] = document.getElementsByClassName("sp-input")[i+170].value;
        //TODO for gradients
        if (document.getElementsByClassName("sp-input")[i+34].value !== "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+68].value !== "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+102].value !== "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+136].value !== "rgba(0, 0, 0, 0)") {
            str+='res.find(":nth-child('+(i+1)+') .resource-name").css("background", "-webkit-linear-gradient(360deg, '+document.getElementsByClassName("sp-input")[i].value+' 0%, '+document.getElementsByClassName("sp-input")[i+34].value+' 25%, '+document.getElementsByClassName("sp-input")[i+68].value+' 50%, '+document.getElementsByClassName("sp-input")[i+102].value+' 75%, '+document.getElementsByClassName("sp-input")[i+136].value+' 100%)"); '
            str+='res.find(":nth-child('+(i+1)+') .resource-name").css("-webkit-background-clip", "text");'
            str+='res.find(":nth-child('+(i+1)+') .resource-name").css("-webkit-text-fill-color", "transparent");'
        } else if (document.getElementsByClassName("sp-input")[i+34].value !== "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+68].value !== "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+102].value !== "rgba(0, 0, 0, 0)") {
            str+='res.find(":nth-child('+(i+1)+') .resource-name").css("background", "-webkit-linear-gradient(360deg, '+document.getElementsByClassName("sp-input")[i].value+' 0%, '+document.getElementsByClassName("sp-input")[i+34].value+' 33%, '+document.getElementsByClassName("sp-input")[i+68].value+' 66%, '+document.getElementsByClassName("sp-input")[i+102].value+' 100%)"); '
            str+='res.find(":nth-child('+(i+1)+') .resource-name").css("-webkit-background-clip", "text");'
            str+='res.find(":nth-child('+(i+1)+') .resource-name").css("-webkit-text-fill-color", "transparent");'
        } else if (document.getElementsByClassName("sp-input")[i+34].value !== "rgba(0, 0, 0, 0)" && document.getElementsByClassName("sp-input")[i+68].value !== "rgba(0, 0, 0, 0)") {
            str+='res.find(":nth-child('+(i+1)+') .resource-name").css("background", "-webkit-linear-gradient(360deg, '+document.getElementsByClassName("sp-input")[i].value+' 0%, '+document.getElementsByClassName("sp-input")[i+34].value+' 50%, '+document.getElementsByClassName("sp-input")[i+68].value+' 100%)"); '
            str+='res.find(":nth-child('+(i+1)+') .resource-name").css("-webkit-background-clip", "text");'
            str+='res.find(":nth-child('+(i+1)+') .resource-name").css("-webkit-text-fill-color", "transparent");'
        } else if (document.getElementsByClassName("sp-input")[i+34].value !== "rgba(0, 0, 0, 0)") {
            str+='res.find(":nth-child('+(i+1)+') .resource-name").css("background", "-webkit-linear-gradient(360deg, '+document.getElementsByClassName("sp-input")[i].value+' 0%, '+document.getElementsByClassName("sp-input")[i+34].value+' 100%)"); '
            str+='res.find(":nth-child('+(i+1)+') .resource-name").css("-webkit-background-clip", "text");'
            str+='res.find(":nth-child('+(i+1)+') .resource-name").css("-webkit-text-fill-color", "transparent");'
        } else {
            str+='res.find(":nth-child('+(i+1)+') .resource-name").css("color", "'+document.getElementsByClassName("sp-input")[i].value+'"); '
        }
        str+='res.find(":nth-child('+(i+1)+') .resource-name").css("text-shadow", "'+document.getElementsByClassName("sp-input")[i+170].value+' 1px 0px 10px"); '
    }
    str += '}game.ui.render=function(){var game=this.game; var midColumn=dojo.byId("midColumn"); var scrollPosition=midColumn.scrollTop; var container=dojo.byId(this.containerId); dojo.empty(container); var tabNavigationDiv=dojo.create("div",{className:"tabsContainer"},container); this.toolbar.render(dojo.byId("headerToolbar")); game.resTable.render(); game.craftTable.render(); game.calendar.render(); var visibleTabs=[]; for(var i=0; i<game.tabs.length; i++){var tab=game.tabs[i]; tab.domNode=null; if(tab.visible){visibleTabs.push(tab)}}for(var i=0; i<visibleTabs.length; i++){var tab=visibleTabs[i]; tab.updateTab(); var tabLink=dojo.create("a",{href:"#",innerHTML:tab.tabName,className:"tab",style:{whiteSpace:"nowrap"}},tabNavigationDiv); tab.domNode=tabLink; if(this.activeTabId==tab.tabId){dojo.addClass(tabLink,"activeTab")}dojo.connect(tabLink,"onclick",this,dojo.partial(function(tab){this.activeTabId=tab.tabId; this.render()},tab)); if(i<visibleTabs.length-1){dojo.create("span",{innerHTML:" | "},tabNavigationDiv)}}for(var i=0; i<game.tabs.length; i++){var tab=game.tabs[i]; if(this.activeTabId==tab.tabId){var divContainer=dojo.create("div",{className:"tabInner"},container); tab.render(divContainer); break}}if(!this.calenderDivTooltip){var calendarDiv=dojo.byId("calendarDiv"); this.calenderDivTooltip=UIUtils.attachTooltip(game,calendarDiv,0,320,dojo.hitch(game.calendar,function(){var tooltip=""; if(this.year>100000){tooltip=$I("calendar.year")+" "+this.year.toLocaleString()}if(game.science.get("paradoxalKnowledge").researched){var trueYear=Math.trunc(this.year-game.time.flux); if(trueYear>100000){trueYear=trueYear.toLocaleString()}tooltip+="<br>"+$I("calendar.trueYear")+" "+trueYear}return tooltip}))}if(!this.calendarSignSpanTooltip){var calendarSignSpan=dojo.byId("calendarSign"); this.calendarSignSpanTooltip=UIUtils.attachTooltip(game,calendarSignSpan,0,320,dojo.hitch(game.calendar,function(){var cycle=this.cycles[this.cycle]; if(!cycle){return""}var tooltip=dojo.create("div",{className:"button_tooltip"},null); var cycleSpan=dojo.create("div",{innerHTML:cycle.title+" ("+$I("calendar.year")+" "+this.cycleYear+")",style:{textAlign:"center",clear:"both"}},tooltip); if(game.prestige.getPerk("numerology").researched){dojo.setStyle(cycleSpan,"borderBottom","1px solid gray"); dojo.setStyle(cycleSpan,"paddingBottom","4px"); var cycleSpan=dojo.create("div",{innerHTML:"Cycle Effects:",style:{textAlign:"center",paddingTop:"4px"}},tooltip); var effects=cycle.effects; for(var effect in effects){var effectItemNode=dojo.create("div",null,tooltip); var effectMeta=game.getEffectMeta(effect); var effectTitle=effectMeta.title+":"; var nameSpan=dojo.create("span",{innerHTML:effectTitle,style:{float:"left",fontSize:"16px"}},effectItemNode); var effectMod=effects[effect]>1?"+":""; effectMod+=((effects[effect]-1)*100).toFixed(0)+"%"; var effectSpan=dojo.create("span",{innerHTML:effectMod,style:{float:"right",fontSize:"16px",paddingLeft:"6px"}},effectItemNode); dojo.create("span",{innerHTML:"&nbsp; ",style:{clear:"both"}},effectItemNode)}}if(game.prestige.getPerk("numeromancy").researched&&this.festivalDays){var cycleSpan=dojo.create("div",{innerHTML:"Cycle Festival Effects:",style:{textAlign:"center"}},tooltip); var effects=cycle.festivalEffects; for(var effect in effects){var effectItemNode=dojo.create("div",null,tooltip); var effectMeta=game.getEffectMeta(effect); var effectTitle=effectMeta.title+":"; var nameSpan=dojo.create("span",{innerHTML:effectTitle,style:{float:"left",fontSize:"16px"}},effectItemNode); var effectMod=effects[effect]>1?"+":""; effectMod+=((effects[effect]-1)*100).toFixed(0)+"%"; var effectSpan=dojo.create("span",{innerHTML:effectMod,style:{float:"right",fontSize:"16px",paddingLeft:"6px"}},effectItemNode); dojo.create("span",{innerHTML:"&nbsp; ",style:{clear:"both"}},effectItemNode)}}return tooltip.outerHTML}))}midColumn.scrollTop=scrollPosition; this.update(); $(".console-intro").html($I("console.intro")); color();}; color();'
    str += '//{"textColors1":' + JSON.stringify(textColors1) + ',"textColors2":' + JSON.stringify(textColors2)+ ',"textColors3":' + JSON.stringify(textColors3)+ ',"textColors4":' + JSON.stringify(textColors4)+ ',"textColors5":' + JSON.stringify(textColors5)+ ',"shadowColors":' + JSON.stringify(shadowColors) + '}';
    return str
}

function exportCommand() {
    document.getElementById("exportOutput").textContent = getJavascript();
    document.getElementById("exportOutput").focus();
    document.getElementById("exportOutput").select();
    document.execCommand('copy');
    document.getElementById("exportOutput").textContent = "";
}

function updateBookmarklet() {
    document.getElementById("exportbtn2").href = "javascript:"+getJavascript()
}

updateBookmarklet();
setInterval(updateColors, 50)