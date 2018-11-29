//this code contains a bunch of stolen code from Hevipelle and slabdrill.
//you can find a link to Hevipelle's game Antimatter Dimensions which uses the code here: ivark.github.io

var commas = false;
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
      'use strict';
      if (typeof start !== 'number') {
        start = 0;
      }

      if (start + search.length > this.length) {
        return false;
      } else {
        return this.indexOf(search, start) !== -1;
      }
    };
  }


  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function(searchElement, fromIndex) {

        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If len is 0, return false.
        if (len === 0) {
          return false;
        }

        // 4. Let n be ? ToInteger(fromIndex).
        //    (If fromIndex is undefined, this step produces the value 0.)
        var n = fromIndex | 0;

        // 5. If n ≥ 0, then
        //  a. Let k be n.
        // 6. Else n < 0,
        //  a. Let k be len + n.
        //  b. If k < 0, let k be 0.
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        function sameValueZero(x, y) {
          return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }

        // 7. Repeat, while k < len
        while (k < len) {
          // a. Let elementK be the result of ? Get(O, ! ToString(k)).
          // b. If SameValueZero(searchElement, elementK) is true, return true.
          // c. Increase k by 1.
          if (sameValueZero(o[k], searchElement)) {
            return true;
          }
          k++;
        }

        // 8. Return false
        return false;
      }
    });
  }

  var FormatList = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QtDc', 'SxDc', 'SpDc', 'ODc', 'NDc', 'Vg', 'UVg', 'DVg', 'TVg', 'QaVg', 'QtVg', 'SxVg', 'SpVg', 'OVg', 'NVg', 'Tg', 'UTg', 'DTg', 'TTg', 'QaTg', 'QtTg', 'SxTg', 'SpTg', 'OTg', 'NTg', 'Qd', 'UQd', 'DQd', 'TQd', 'QaQd', 'QtQd', 'SxQd', 'SpQd', 'OQd', 'NQd', 'Qi', 'UQi', 'DQi', 'TQi', 'QaQi', 'QtQi', 'SxQi', 'SpQi', 'OQi', 'NQi', 'Se', 'USe', 'DSe', 'TSe', 'QaSe', 'QtSe', 'SxSe', 'SpSe', 'OSe', 'NSe', 'St', 'USt', 'DSt', 'TSt', 'QaSt', 'QtSt', 'SxSt', 'SpSt', 'OSt', 'NSt', 'Og', 'UOg', 'DOg', 'TOg', 'QaOg', 'QtOg', 'SxOg', 'SpOg', 'OOg', 'NOg', 'Nn', 'UNn', 'DNn', 'TNn', 'QaNn', 'QtNn', 'SxNn', 'SpNn', 'ONn', 'NNn', 'Ce',];

  function fromValue(value) {
	value = value.replace(/,/g, '')
	if (value.toUpperCase().split("E").length > 2) {
		var temp = new Decimal(0)
		temp.mantissa = parseFloat(value.toUpperCase().split("E")[0])
		temp.exponent = parseFloat(value.toUpperCase().split("E")[1]+"e"+value.toUpperCase().split("E")[2])
		value = temp.toString()
	}
	if (value.includes(" ")) {
	  const prefixes = [['', 'U', 'D', 'T', 'Qa', 'Qt', 'Sx', 'Sp', 'O', 'N'],
	  ['', 'Dc', 'Vg', 'Tg', 'Qd', 'Qi', 'Se', 'St', 'Og', 'Nn'],
	  ['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne']]
	  const prefixes2 = ['', 'MI', 'MC', 'NA', 'PC', 'FM', ' ']
	  let e = 0;
	  let m,k,l;
	  if (value.split(" ")[1].length < 5) {
		  for (l=101;l>0;l--) {
			  if (value.includes(FormatList[l])) {
				  e += l*3
				  console.log("caught!"+l)
				  
				  break
			  }
		  }
		  return Decimal.fromMantissaExponent(parseInt(value.split(" ")[0]), e)
	  }
	  for (let i=1;i<5;i++) {
		  if (value.includes(prefixes2[i])) {
			  m = value.split(prefixes2[i])[1]
			  for (k=0;k<3;k++) {
				  for (l=1;l<10;l++) {
					  if (m.includes(prefixes[k][l])) break;
				  }
				  if (l != 10) e += Math.pow(10,k)*l;
			  }
			  break;
		  }
		  return Decimal.fromMantissaExponent(value.split, e*3)
	  }
	  for (let i=1;i<=5;i++) {
		  if (value.includes(prefixes2[i])) {
			  for (let j=1;j+i<6;j++) {
				  if (value.includes(prefixes2[i+j])) {
					  m=value.split(prefixes2[i+j])[1].split(prefixes2[i])[0]
					  if (m == "") e += Math.pow(1000,i);
					  else {
						  for (k=0;k<3;k++) {
							  for (l=1;l<10;l++) {
								  if (m.includes(prefixes[k][l])) break;
							  }
							  if (l != 10) e += Math.pow(10,k+i*3)*l;
						  }
					  }
					  break;
				  }
			  }
		  }
	  }
	  return Decimal.fromMantissaExponent(parseFloat(value), i*3+3)
	  //return parseFloat(value) + "e" + (e*3+3)
	}
	if (!isFinite(parseFloat(value[value.length-1]))) { //needs testing
	  const l = " abcdefghijklmnopqrstuvwxyz"
	  const v = value.replace(parseFloat(value),"")
	  let e = 0;
	  for (let i=0;i<v.length;i++) {
		  for (let j=1;j<27;j++) {
			  if (v[i] == l[j]) e += Math.pow(26,v.length-i-1)*j
		  }
	  }
	  return Decimal.fromMantissaExponent(parseFloat(value), e*3)
	  //return parseFloat(value) + "e" + (e*3)
	}
	value = value.replace(',','')
	if (value.split("e")[0] === "") return Decimal.fromMantissaExponent(Math.pow(10,parseFloat(value.split("e")[1])%1), parseInt(value.split("e")[1]))
	return Decimal.fromString(value)
  }

function letter(power,str) {
    const len = str.length;
    function lN(n) {
        let result = 1;
        for (var j = 0; j < n; ++j) result = len*result+1;
        return result;
    }
    if (power <= 5) return str[0];
    power = Math.floor(power / 3);
    let i=0;
    while (power >= lN(++i));
    if (i==1) return str[power-1];
    power -= lN(i-1);
    let ret = '';
    while (i>0) ret += str[Math.floor(power/Math.pow(len,--i))%len]
    return ret;
}

function getAbbreviation(e) {
    const prefixes = [
    ['', 'U', 'D', 'T', 'Qd', 'Qt', 'Sx', 'Sp', 'O', 'N'],
    ['', 'Dc', 'Vg', 'Tg', 'Qa', 'Qi', 'Se', 'St', 'Og', 'Nn'],
    ['', 'Ce', 'Dn', 'Tc', 'Qe', 'Qu', 'Sc', 'Si', 'Oe', 'Ne']]
    const prefixes2 = ['', 'MI-', 'MC-', 'NA-', 'PC-', 'FM-']
    e = Math.floor(e/3)-1;
    let index2 = 0;
    let prefix = [prefixes[0][e%10]];
    while (e >= 10) {
        e = Math.floor(e/10);
        prefix.push(prefixes[(++index2)%3][e%10])
    }
    index2 = Math.floor(index2/3)
    while (prefix.length%3 != 0) prefix.push("");
    let ret = "";
    while (index2 >= 0) ret += prefix[index2*3] + prefix[index2*3+1] + prefix[index2*3+2] + prefixes2[index2--];
    if (ret.endsWith("-")) ret = ret.slice(0,ret.length-1)
    return ret.replace("UM","M").replace("UNA","NA").replace("UPC","PC").replace("UFM","FM")
}

function formatValue(notation, value, places, placesUnder1000) {
	if (value instanceof Decimal) {
		var power = value.e
		var matissa = value.mantissa
	} else {
		var matissa = value / Math.pow(10, Math.floor(Math.log10(value)));
		var power = Math.floor(Math.log10(value));
	}
	if ((notation === "Mixed scientific" && power >= 33) || notation === "Scientific") {
		matissa = matissa.toFixed(places)
		if (matissa >= 10) {
			matissa /= 10;
			power++;
		}
		if (power > 100000  && !commas) return (matissa + "e" + formatValue(notation, power, 3, 3))
		if (power > 100000  && commas) return (matissa + "e" + power.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
		return (matissa + "e" + power);
	}
	if (notation === "Infinity") {
		if ((power + matissa / 10) / 308 < 1000) var infPlaces = 4
		else var infPlaces = 3
		if (commas) return ((power + matissa / 10) / 308.25471555991675).toFixed(Math.max(infPlaces, places)).toString().split(".")[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")+"."+((power + matissa / 10) / 308.25471555991675).toFixed(Math.max(infPlaces, places)).toString().split(".")[1]+"∞"
		else return ((power + matissa / 10) / 308.25471555991675).toFixed(Math.max(infPlaces, places))+"∞"
  }
	if (notation.includes("engineering") || notation.includes("Engineering")) pow = power - (power % 3)
	else pow = power
	if (power > 100000  && !commas) pow = formatValue(notation, pow, 3, 3)
	if (power > 100000  && commas) pow = pow.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	if (notation === "Logarithm") {
		if (power > 100000  && !commas) return "ee"+Math.log10(Decimal.log10(value)).toFixed(3)
		if (power > 100000  && commas) return "e"+Decimal.log10(value).toFixed(places).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		else return "e"+Decimal.log10(value).toFixed(places)
	}

	if (notation === "Brackets") {
		var table = [")", "[", "{", "]", "(", "}"];
		var log6 = Math.LN10 / Math.log(6) * Decimal.log10(value);
		var wholePartOfLog = Math.floor(log6);
		var decimalPartOfLog = log6 - wholePartOfLog;
		//Easier to convert a number between 0-35 to base 6 than messing with fractions and shit
		var decimalPartTimes36 = Math.floor(decimalPartOfLog * 36);
		var string = "";
		while (wholePartOfLog >= 6) {
			var remainder = wholePartOfLog % 6;
			wholePartOfLog -= remainder;
			wholePartOfLog /= 6;
			string = table[remainder] + string;
		}
		string = "e" + table[wholePartOfLog] + string + ".";
		string += table[Math.floor(decimalPartTimes36 / 6)];
		string += table[decimalPartTimes36 % 6];
		return string;
	}

	matissa = (matissa * Decimal.pow(10, power % 3)).toFixed(places)
	if (matissa >= 1000) {
		matissa /= 1000;
		power++;
	}

	if (notation === "Standard" || notation === "Mixed scientific") {
		if (power <= 303) return matissa + " " + FormatList[(power - (power % 3)) / 3];
		else return matissa + " " + getAbbreviation(power);
	} else if (notation === "Mixed engineering") {
		if (power <= 33) return matissa + " " + FormatList[(power - (power % 3)) / 3];
		else return (matissa + "ᴇ" + pow);
	} else if (notation === "Engineering") {
		return (matissa + "ᴇ" + pow);
	} else if (notation === "Letters") {
		return matissa + letter(power,'abcdefghijklmnopqrstuvwxyz');
	} else if (notation === "Emojis") {
		return matissa + letter(power,['😠', '🎂', '🎄', '💀', '🍆', '👪', '🌈', '💯', '🍦', '🎃', '💋', '😂', '🌙', '⛔', '🐙', '💩', '❓', '☢', '🙈', '👍', '☂', '✌', '⚠', '❌', '😋', '⚡'])
	} else {
		if (power > 100000 && commas) power = power.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
		return "1337 H4CK3R"
	}
}

function updateValues() {
	var valueToFormat = fromValue(document.getElementById("valuetoformat").value)
	if (document.getElementById("commas").checked) commas = true;
	else commas = false;
	document.getElementById("standard").innerHTML = "Standard: " + "<b>" + formatValue("Standard", valueToFormat, 2, 0) + "</b>"
	document.getElementById("cancer").innerHTML = "Cancer: " + "<b>" + formatValue("Emojis", valueToFormat, 2, 0) + "</b>"
	document.getElementById("mixed scientific").innerHTML = "Mixed scientific: " + "<b>" + formatValue("Mixed scientific", valueToFormat, 2, 0) + "</b>"
	document.getElementById("mixed engineering").innerHTML = "Mixed engineering: " + "<b>" + formatValue("Mixed engineering", valueToFormat, 2, 0) + "</b>"
	document.getElementById("logarithm").innerHTML = "Logarithm: " + "<b>" + formatValue("Logarithm", valueToFormat, 2, 0) + "</b>"
	document.getElementById("scientific").innerHTML = "Scientific: " + "<b>" + formatValue("Scientific", valueToFormat, 2, 0) + "</b>"
	document.getElementById("engineering").innerHTML = "Engineering: " + "<b>" + formatValue("Engineering", valueToFormat, 2, 0) + "</b>"
	document.getElementById("letters").innerHTML = "Letters: " + "<b>" +formatValue("Letters", valueToFormat, 2, 0) + "</b>"
	document.getElementById("infinity").innerHTML = "Infinity: " + "<b>" + formatValue("Infinity", valueToFormat, 2, 0) + "</b>"
	document.getElementById("brackets").innerHTML = "Brackets: " + "<b>" +formatValue("Brackets", valueToFormat, 2, 0) + "</b>"
}
