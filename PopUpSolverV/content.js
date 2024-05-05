console.log("Craziness 2");
//chrome.runtime.sendMessage("thistab");

chrome.runtime.onMessage.addListener(gotMessage);

var array = new Array(25);
function gotMessage(message, sender, sendResponse){
	console.log("got a message");
	if (message == "beenclicked2") {
		console.log("Got Message!");
		let x = document.getElementsByClassName('Tile-module_tile__UWEHN');
		for (var i = 0; i < 25; i++) {
			console.log(x[i].innerHTML);
			console.log(x[i].getAttribute('data-state'));
			let o = {
				letter : x[i].innerHTML,
				state : x[i].getAttribute('data-state')
			}
			array[i] = o; //we need to send this array to the background then make it a global variable in the pop up
		}
		let message2 = array;
		console.log("Sending array to popup!");
		chrome.runtime.sendMessage(message2);
	}
	if (message.length == 5) {
		typeWord(message);
	}
}

function typeWord(stringToType){
	console.log("typing string");
	query = "[aria-label='backspace']";
	for (var i = 0; i < 5; i++) {
		document.querySelectorAll(query)[0].click();
	}
	for (var i = 0; i < 5; i++) {
		query = '[data-key=' + stringToType[i] +']';
		document.querySelectorAll(query)[0].click();
	}
	query = "[aria-label='enter']";
	document.querySelectorAll(query)[0].click();
}


