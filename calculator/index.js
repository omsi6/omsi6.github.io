var test;

function getRates() {

    var result = {};
    var form = document.querySelector("#rates");
    var inputs = form.querySelectorAll("input");
    var rates = {};

    for(var input of inputs)
    {
        rates[input.name] = input.valueAsNumber;
    }

    console.log(rates);

}