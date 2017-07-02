document.querySelector(".updateButton").addEventListener("click", onButtonClick);
window.addEventListener("resize", resizeCanvas);

var canvas = document.querySelector(".canvas");
var ctx = canvas.getContext("2d");
var rates = {};
var chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [
            "1 Hour",
            "2 Hours",
            "3 Hours",
            "4 Hours",
            "5 Hours",
            "6 Hours"
        ],
        datasets: [{
            label: "Theoretical Max Chips/Hour",
            data: [],
            backgroundColor: "transparent",
            borderColor: "#512DA8",
            borderWidth: 2
        }, {
            label: "Current Chips/Hour",
            data: [],
            backgroundColor: "transparent",
            borderColor: "#9C27B0",
            borderWidth: 2
        }]
    },
    options: {
        legend: {
            display: true,
            labels: {
                fontColor: "#fff"
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

function onButtonClick(e) {
    e.preventDefault();
    var values = getFormValues();
    rates = calculateRates(values);
    canvas.style.visibility = "visible";

    chart.data.datasets[0].data = rates.theoreticalChipsPerHour;
    chart.data.datasets[1].data = rates.currentChipsPerHour;
    chart.update();
}

function getFormValues() {
    var result = {};
    var form = document.querySelector(".rates");
    var inputs = form.querySelectorAll("input");
    var values = {};

    for (var input of inputs)
    {
        values[input.name] = Number.isFinite(input.valueAsNumber) ? input.valueAsNumber : input.value.toLowerCase();
    }

    if(values.enemyNameColor === "yellow"){
        values.enemyRank = 1;
    } else if(values.enemyNameColor === "white"){
        values.enemyRank = 2;
    } else if(values.enemyNameColor === "red"){
        values.enemyRank = 3;
    } else if(values.enemyNameColor === "purple"){
        values.enemyRank = 4;
    }

    if(values.bestiaryLevel <= 3){
        values.bestiaryMulti = 1;
    } else if(values.bestiaryLevel === 4){
        values.bestiaryMulti = 1.5
    } else if(values.bestiaryLevel === 4){
        values.bestiaryMulti = 2
    } else if(values.bestiaryLevel === 4){
        values.bestiaryMulti = 3
    }

    return values;
}

var IAMastered = 1;
var worstMoon = 1;

function calculateRates(values) {

    //I want to make a function that will determine the optimal ammount of
    //spawn/drop/epic/rate rate

    var enemyRankMulti = (0.25 + 0.25 * values.enemyRank + values.enemyLevel * 2 / 9001)
    var rareRealDropRate = values.dropRate * 10 * enemyRankMulti * values.bestiaryMulti * values.enemyMulti;
    var epicRealDropRate = values.dropRate * 20 * enemyRankMulti * values.bestiaryMulti * values.enemyMulti;

    if(IAMastered == 1 && worstMoon == 1){
        var rareChance = Math.min((5 + 0.95 * values.areaRareRate) * (values.rareRate / 100), 100);
        var epicChance = Math.min((0.5 + 0.995 * values.areaEpicRateWM) * (values.epicRate / 100), 100);
    } else if(IAMastered == 1) {
        var rareChance = Math.min((5 + 0.95 * values.areaRareRate) * (values.rareRate / 100), 100);
        var epicChance = Math.min((0.5 + 0.995 * values.areaEpicRate) * (values.epicRate / 100), 100);
    } else if(worstMoon == 1) {
        var rareChance = Math.min(values.areaRareRate * (values.rareRate / 100), 100);
        var epicChance = Math.min(values.areaEpicRateWM * (values.epicRate / 100), 100);
    } else {
        var rareChance = Math.min(values.areaRareRate * (values.rareRate / 100), 100);
        var epicChance = Math.min(values.areaEpicRate * (values.epicRate / 100), 100);
    }

    return {
        currentChipsPerHour: [20, 4, 56, 25, 4, 34],
        theoreticalChipsPerHour: [12, 19, 3, 5, 2, 3]
    };
}