const $ = document.querySelector.bind(document);

fetch("https://omsi6.github.io/bookmarklet/source.js")
	.then(res => res.text())
	.then(src => {
		document.body.classList.add("loaded");
		$("#bookmarklet-button").href = "javascript:" + src;
	})
	.catch(err => {
		$("#loading").textContent = "An error occured. Please try again later!";
	});