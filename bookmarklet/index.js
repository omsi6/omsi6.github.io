const $ = document.querySelector.bind(document);

fetch("https://omsi.me/bookmarklet/source.js")
	.then(res => res.text())
	.then(src => {
		document.body.classList.add("loaded");
		$("#bookmarklet-button").href = "javascript:" + src;
	})
	.catch(err => {
		$("#loading").textContent = "An error occured. Please try again later!";
	});