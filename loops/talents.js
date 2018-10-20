var canvas = document.getElementById("talentTreeCanvas");
var ctx = canvas.getContext("2d");

function drawTreeBranch(num1, num2) {
    if (document.getElementById("talentTreeCanvas").style.display === "none") return
    var start = document.getElementById(num1).getBoundingClientRect();
    var end = document.getElementById(num2).getBoundingClientRect();
    var x1 = start.left + (start.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    var y1 = start.top + (start.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    var x2 = end.left + (end.width / 2) + (document.documentElement.scrollLeft || document.body.scrollLeft);
    var y2 = end.top + (end.height / 2) + (document.documentElement.scrollTop || document.body.scrollTop);
    ctx.lineWidth = 15;
    ctx.strokeStyle = "#000000";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawTalentTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //drawTreeBranch("talent11", "talent21");
}