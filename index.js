window.onload = function(){
    document.getElementById("shoutout"+Math.floor(Math.random()*5+1)).style.display = "flex";
};

function disableShoutoutAnim() {
    let text = document.getElementById("shoutouttext")
    text.style.animation = "none"
    text.style.opacity = "0"
}