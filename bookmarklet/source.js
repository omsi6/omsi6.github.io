const checkButton = () => {
	const button = document.querySelector('#load_more_button');
	if (button.style.display !== 'none') {
		button.click();
	} else {
		clearInterval(intervalId);
		scanTransactions();
	}
};
const intervalId = setInterval(checkButton, 1000);

checkButton();

function scanTransactions() {
	var total = Array.from(document.querySelectorAll('.wallet_table_row'))
		.filter(element => {
			return element.querySelector('.wht_type').firstElementChild.textContent.includes('Market');
		})
		.filter(element => {
			const payment = element.querySelector('.wht_total').children[1];
			return payment && payment.textContent.includes('Credit');
		})
		.map(element => {
			const content = element.querySelector('.wht_total').firstElementChild.textContent;
			return content.match(/\$([0-9\.]+)/)[1]
		})
		.reduce((accumulator, currentElement) => {
			return accumulator + parseFloat(currentElement);
		}, 0);

	alert('Total market transactions: +$' + total.toFixed(2));
}
