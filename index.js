window.onload = function() {
    document.getElementById(`shoutout${Math.floor(Math.random() * 6 + 1)}`).style.display = "flex";
};

function disableShoutoutAnim() {
    const text = document.getElementById("shoutouttext");
    text.style.animation = "none";
    text.style.opacity = "0";
}