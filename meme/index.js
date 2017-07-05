const $ = document.querySelector.bind(document);

$(".ok").addEventListener("mouseover", (e) => {
    e.target.play();
    e.target.currentTime=0;
})

$(".enter").addEventListener("click", (e) => {
    document.body.classList.add("entered");

    var elem = document.body;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }

    e.preventDefault();
})