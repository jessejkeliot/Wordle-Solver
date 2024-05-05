var background = chrome.extension.getBackgroundPage();

//send a message to contentjs with text "beenclicked"
function askColours(){
  console.log("button clicked sending message");
  chrome.runtime.sendMessage("beenclicked");
}
//document.getElementById("b1").addEventListener("click", askColours);
document.getElementById("firstWord").addEventListener("mouseover", askColours);
document.getElementById("possibleWordCount").addEventListener("mouseover", askColours);
//document.getElementById("enterButton").addEventListener("mouseover", askColours);
chrome.runtime.onMessage.addListener(changePage);
function changePage(msg, sender, sendResponse){
  //listen for one from background script once it solved it.
    if (typeof(msg)=="object") {
      //what happens goes in here
      //UpdatePage(msg);
      var newestObject = UpdatePage(msg); //newest object format is (enteredword, givenColours), wholePacked
      // var newestWord = newestObject.word;
      // var newestColours = newestObject.givenColours;
      //var updatedWordMinMaxTotal = Solve(newestObject); //will return the best word, the updated list and the updatedminmaxtotal all in an object.
          console.log("got the list");
          for (x of msg){
            console.log(x);
          }
      console.log("starting solver")
      //whole solver every time, just let it run over msg.wholeletters.length % 5, times
      solve(newestObject);
      }
}

function UpdatePage(msg){
  console.log("starting to update")
  var enteredCount = 0;
  for (i of msg){
    if (i.letter!=="" && i.state!=="tbd") {
      enteredCount+= 1;
    }
  }
  console.log(enteredCount);
  var extraLetterCount = enteredCount % 5;
  var startIndex = enteredCount - extraLetterCount - 5;
  //var startIndex = 0;
  var endIndex = enteredCount - extraLetterCount;
  console.log(startIndex);
  console.log(endIndex);
  var word = "";
  var given = "";
  for (var i = 0; i < endIndex; i++) {
    word+= msg[i].letter;
    if (msg[i].state=="absent") {
      given += "3";
    }
    if (msg[i].state=="present") {
      given += "2";
    }
    if (msg[i].state=="correct") {
      given += "1";
    }
  }
  let z = {
    enteredLetters : word,
    givenColours : given,
  }
  lastWord = word.slice(startIndex);
  console.log(lastWord);
  //document.getElementById("firstWord").innerHTML = lastWord;
  return z;
}





//wordle solver here

const r = document.getElementById("words").innerHTML;
var totalWordList = r.split("\n"); //WHY doesn't it wanna load the whole list?
//totalWordList = ["under", "split", "games", "canon", "canus"]; //for debug
console.log(totalWordList.length);
// for (var i = totalWordList.length - 1; i >= 0; i++) {
//  console.log(totalWordList[i]);
// }

console.log(totalWordList[2]);

var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
var letterInfoArray = new Array(26);
for (var i = 0; i < 26; i++) {
  letterInfoArray[i] = {
    letter : alphabet[i],
    min : 0,
    max : 3,
    cantBeArray : [],
    mustBeArray : []
  };
}

var possibleWordsList = totalWordList;

//should this solve it from the start or just the last word
function solve(packed){ //packed is the format enteredletters : facesfruitplays, givenColours : 123331333321233
  //let lastWordleOutput = getLastOutput(packed); //returns format packed.givenColours[0] = "1"
  var alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
  // const r = document.getElementById("words").innerHTML;
  // totalWordList = r.split("\n"); //WHY doesn't it wanna load the whole list?
  // for(word of totalWordList){
  //   console.log(word);
  // }
  console.log(totalWordList.length);
  possibleWordsList = totalWordList;
  var letterInfoArray = new Array(26);
  for (var i = 0; i < 26; i++) {
    letterInfoArray[i] = {
      letter : alphabet[i],
      min : 0,
      max : 3,
      cantBeArray : [],
      mustBeArray : []
    };
  }
  for (var i = 0; i < packed.enteredLetters.length/5; i++) {
    console.log("Round "+ (i+1));
    console.log(packed.enteredLetters.length);
    thisWordleOutput = getThisOutput(i, packed); //enteredWord and enteredWordColours
    letterInfoArray = updateLetterInfoArray(letterInfoArray, thisWordleOutput);
    for (l of letterInfoArray){
      console.log(l.letter + " "+ l.min + " "+l.max);
    }
    possibleWordsList = efficientFilterWordList(possibleWordsList, letterInfoArray);
    console.log(possibleWordsList.length);
  }
  if (possibleWordsList.length == 0) {
    document.getElementById("firstWord").innerHTML = "No words";
  }
  else{
    document.getElementById("firstWord").innerHTML = possibleWordsList[0];
    document.getElementById("possibleWordCount").innerHTML = possibleWordsList.length;
    document.getElementById("firstWord").addEventListener("click", cycleThrough);
    //document.getElementById("enterButton").addEventListener("click", enterWord);
    document.getElementById("firstWord").addEventListener("wheel", enterWord);
  }
}

function cycleThrough(){
  console.log("enter button clicked");
  f = possibleWordsList.indexOf(document.getElementById("firstWord").innerHTML);
  if (f+1 ==possibleWordsList.length) {
    f = -1;
  }
  document.getElementById("firstWord").innerHTML = possibleWordsList[f+1];
} 

function enterWord(){
  console.log("div clicked");
  x = {
    msg : "enterit",
    word : document.getElementById("firstWord").innerHTML
  }
  chrome.runtime.sendMessage(x);
  setTimeout(askColours, 520);
}

function efficientFilterWordList(list1, letterInfoArray1){
  final = filterStage1(list1, letterInfoArray1);
  console.log(final.length+"possible words")
  return final;
}

function filterStage1(wordlist2, letterInfoArray2){
  console.log("starting stage 1")
  newWordList = [];
  ruleCount = 0;
  for(word of wordlist2){
    //console.log(word);
    ruleCount = 0;
    wordObj = convertWord(word, letterInfoArray2); //not needed
    for(letterInfo of letterInfoArray2){
      letterCount = 0;
      for(letterObj of wordObj){
        if (letterObj.letter == letterInfo.letter) {
          letterCount++;
        }
      }
      //console.log(letterInfo.letter + " " + letterCount + " min "+ letterInfo.min + " max " + letterInfo.max);
      if (letterCount >= letterInfo.min & letterCount <= letterInfo.max)
      {
        //console.log("is between");
        ruleCount++;
      }

    }
    //console.log(ruleCount);
    //console.log(word);
    if (ruleCount==26) {
      //console.log(word + "passed stage 1");
      newWordList.push(word);
    }

  }
  console.log("Stage 1 took the list down to " + newWordList.length);
  return filterStage2(newWordList, letterInfoArray2);
}

function filterStage2(wordlist3, letterInfoArray3){
  console.log("starting stage 2");
  newWordList = [];
  for(word of wordlist3){
    totalMust = 0;
    countMust = 0;
    for(ltrObj of letterInfoArray3){
      for(must of ltrObj.mustBeArray){
        totalMust++;
        if (word[must] == ltrObj.letter) {countMust++;}

      }
    }
    if (totalMust==countMust) {
      //console.log(word + "passed stage 2");
      newWordList.push(word);
    }
  }
  console.log("Stage 2 took the list down to " + newWordList.length);
  return filterStage3(newWordList, letterInfoArray3);
}

function filterStage3(wordlist4, letterInfoArray4){
  console.log("starting stage 3")
  newWordList = [];
  ruleCount = 0;
  for(word of wordlist4){
    ruleCount = 0;
    wordObj = convertWord(word, letterInfoArray4);
    for (var i = 0; i < 5; i++) {
      cantLetters = 0;
      for(cant of wordObj[i].cantBeArray){
        if (i==cant) {
          cantLetters++;
        }
      }
      if (cantLetters>0) { ruleCount++;}
    }
    if (ruleCount==0) { 
      newWordList.push(word);
      //console.log(word + "passed stage 3");
    }
  }
  console.log("Stage 3 took the list down to " + newWordList.length);
  return newWordList;
}

function updateLetterInfoArray(current, wordleOutput){
  newLetterInfoArray = new Array(26);
  colourCounts = new Array(3);

  for (var f = 0; f < 26; f++) {
    currentInfo = current[f];

    colourCounts[0] = 0; colourCounts[1] = 0; colourCounts[2] = 0;
    let isIn = false;

    for (var i = 0; i < 5; i++) { //loop through current colours
      currentPair = wordleOutput[i]; //must be changed for new wordleOutput format
      //console.log(currentPair.letter); // why is this null
      if (currentInfo.letter == currentPair.letter) {
        isIn= true;
        if (currentPair.colour =="1") {
          currentInfo.mustBeArray.push(i);
          colourCounts[0]++;
        }
        if (currentPair.colour =="2") {
          currentInfo.cantBeArray.push(i);
          colourCounts[1]++;
        }
        if (currentPair.colour =="3") {
          colourCounts[2]++;
        }
      }
    }

    if (isIn) {
      currentInfo.min = colourCounts[0] + colourCounts[1];
      if (colourCounts[0]+colourCounts[1] == 0 && colourCounts[2] > 0) {
        currentInfo.max = 0;
      }
      if (colourCounts[0] + colourCounts[1] >0 && colourCounts[2] >0) {
        temp = colourCounts[0] + colourCounts[1];
        currentInfo.max = temp;
      }
    }
    newLetterInfoArray[f] = currentInfo;
  }
  return newLetterInfoArray;
}

function getThisOutput(round, msg){
  word = msg.enteredLetters.slice(5*round, 5*round + 5);
  colo = msg.givenColours.slice(5*round, 5*round + 5);
  console.log(word);
  let final = [];
  for (var i = 0; i < 5; i++) {
    z = {
      letter : word[i],
      colour : colo[i]
    }
    final.push(z)
  }

  return final;
}

function convertWord(word, infoArray){
  wordArray = [];
  for (var i = 0; i < 5; i++) {
    for(item of infoArray){
      if (item.letter == word[i]) {
        wordArray.push(item);
      }
    }
  }
  return wordArray;
}
