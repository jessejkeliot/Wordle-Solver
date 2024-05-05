//chrome.browserAction.onClicked.addListener(buttonClicked);

//put the totalwordlist variable here! then make it global and send it back once we get needpossible words list

chrome.runtime.onMessage.addListener(receiveColours);

// var r = document.getElementById("words").innerHTML;
// const totalWordList = r.split("\n")
// for (var i = totalWordList.length - 1; i >= 0; i++) {
// 	totalWordList[i] = r[i].innerHTML;
// }
//console.log(totalWordList[2]);

function receiveColours(request, sender, sendResponse){
	if (request=="beenclicked") {
		console.log("the thing got clicked, sending message");

		chrome.tabs.query({active: true, lastFocusedWindow: true}, gotTabs);

		function gotTabs(tabs){
			console.log("sent!");
			chrome.tabs.sendMessage(tabs[0].id, "beenclicked2");
		}
	}
	if (typeof(request) =="object") {
		if (request.msg == "enterit") {
			console.log("enter it");
			chrome.tabs.query({active: true, lastFocusedWindow: true}, gotTabs2);
			function gotTabs2(tabs){
				chrome.tabs.sendMessage(tabs[0].id, request.word);
			}
		}
		console.log("starting solver");
		//solve(request); //packed is the array of wordle outputs
	}

}


//wordle solver in background instead? Quicker load speed

//set up letterinfoarray
const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
var letterInfoArray = new Array(26);
for (var i = 0; i < 26; i++) {
	letterInfoArray[i] = {
		letter : alphabet[i],
		min : 0,
		max : 3,
		cantBeArray : [],
		mustBeArray : []
	}
}

// var possibleWordsList = totalWordList;


// //should this solve it from the start or just the last word
// function solve(packed){ //packed is the format [["a", "absent"], ["f", "present"] ...]
// 	let lastWordleOutput = getLastOutput(packed); //returns format lastWordleOutput.givenColours[0] = "3"
// 	 //returns format lastWordleOutput.enteredWord[0] = "a"
// 	letterInfoArray = updateLetterInfoArray(letterInfoArray, lastWordleOutput);
// 	for (l of letterInfoArray){
// 		console.log(l.letter + " "+ l.min + " "+l.max);
// 	}
// 	possibleWordsList = efficientFilterWordList(possibleWordsList, letterInfoArray);
// }

// function efficientFilterWordList(list1, letterInfoArray){
// 	final = FilterStage1(list1, letterInfoArray);
// 	return null;
// }

// function updateLetterInfoArray(current, wordleOutput){
// 	newLetterInfoArray = new Array(26);
// 	colourCounts = new Array(3);

// 	for (var f = 0; f < 26; f++) {
// 		currentInfo = current[f];

// 		colourcounts[0] = 0; colourcounts[1] = 0; colourcounts[2] = 0;
// 		let isIn = false;

// 		for (var i = 0; i < 5; i++) { //loop through current colours
// 			currentPair = wordleOutput[i];
// 			if (currentInfo.letter == currentPair.letter) {
// 				isIn= true;
// 				if (currentPair.colour =="1") {
// 					currentInfo.mustBeArray.push(i);
// 					colourcounts[0]++;
// 				}
// 				if (currentPair.colour =="2") {
// 					currentInfocantBeArray.push(i);
// 					colourcounts[1]++;
// 				}
// 				if (currentPair.colour =="3") {
// 					colourcounts[2]++;
// 				}
// 			}
// 		}

// 		if (isIn) {
// 			currentInfo.min = colourcounts[0] + colourcounts[1];
// 			if (colourcounts[0]+colourcounts[1] == 0 && colourcounts[2] > 0) {
// 				currentInfo.max = 0;
// 			}
// 			if (colourscounts[0] + colourcounts[1] >0 && colourcounts[2] >0) {
// 				currentInfo.max = temp;
// 			}
// 		}
// 		newLetterInfoArray[f] = currentInfo;
// 	}
// 	return newLetterInfoArray;
// }

// function getLastOutput(msg){
// 	var enteredCount = 0;
// 	for (i of msg){
// 	  if (i[0]!=="" && i[1]!=="tbd") {
// 	    enteredCount+= 1;
// 	  }
// 	}
// 	var extraLetterCount = enteredCount % 5;
// 	var startIndex = (enteredCount - extraLetterCount) - 5;
// 	var endIndex = startIndex + 5;
// 	var word = [];
// 	var given = [];
// 	for (var i = startIndex; i < endIndex; i++) {
// 	  word.push(msg[i].letter) ;
// 	  if (msg[i].state=="absent") {
// 	    given.push("3") ;
// 	  }
// 	  if (msg[i].state=="present") {
// 	    given.push("2") ;
// 	  }
// 	  if (msg[i].state=="correct") {
// 	    given.push("1") ;
// 	  }
// 	}
// 	let z = {
// 	  enteredWord : word,
// 	  givenColours : given
// 	}
// 	return z
// }







// function buttonClicked(tab){
// 	let msg = {
// 		txt : "beenclicked"
// 	}
// 	console.log("clicked");
// 	chrome.tabs.sendMessage(tab.id, msg);
// }
