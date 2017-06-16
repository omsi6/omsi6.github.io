const $ = document.querySelector.bind(document);

fetch("https://omsi6.github.io/bookmarklet/source.js")
	.then(res => res.text())
	.then(src => {
		const safeSrc = src
			.replace(/\n/g, ";")
			.replace(/"/g, "'")

		$("#loading").remove();
		$("#bookmarklet-button").href = "javascript:" + safeSrc;
	});