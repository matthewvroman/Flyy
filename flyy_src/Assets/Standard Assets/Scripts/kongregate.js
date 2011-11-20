/*Copyright (C) 2011 by MATTHEW VROMAN

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
IMPORTANT INFO ABOUT KONGREGATE API
To use the API you must also set up stats for your game on Kongregate.
For example I have a leaderboard set up for 'Score' and an aggreggate leaderboard for 'Total Distance'
This will not work out of the box unless you do the same
*/

// Begin the API loading process if it is available
Application.ExternalEval(
  "if(typeof(kongregateUnitySupport) != 'undefined'){" +
  " kongregateUnitySupport.initAPI('MyUnityObject', 'OnKongregateAPILoaded');" +
  "};"
);

var target : GameObject;
target = GameObject.FindWithTag("Player");

//Create temp variables - these will be reassigned if the API can be loaded
var isKongregate = false;
var userId = 0;
var username = "Guest";
var gameAuthToken = "";
 
 //reassign kongregate variables if we can log in
function OnKongregateAPILoaded(userInfoString){
  // We now know we're on Kongregate
  isKongregate = true;
 
  // Split the user info up into tokens
  var params = userInfoString.Split("|"[0]);
  userId = parseInt(params[0]);
  username = params[1];
  gameAuthToken = params[2];
}

//send our scores to Kongregate
//Leaderboards have been set up for score and total distance
function submitStats(submittedScore){
	var score = submittedScore;
	// Begin the API loading process if it is available
	Application.ExternalCall("kongregate.stats.submit","Score",score);
	Application.ExternalCall("kongregate.stats.submit","TotalDistance",score);
}