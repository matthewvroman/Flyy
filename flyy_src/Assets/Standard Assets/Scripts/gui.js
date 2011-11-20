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

//Define GUIStyle :: This is configured inside the Unity Visual editor
var flyyStyle : GUIStyle = new GUIStyle();

//Find the player object
var player : GameObject;
player = GameObject.FindWithTag("Player");

//Find the attached 'GameState.js' script
var gameStateObject : GameObject;
gameStateObject = GameObject.FindWithTag("GameState");

//Score variables for local score & kongregate API
var saveScore : int = 0;
var kongregateScore = 0;


function Awake(){
	//Saves the score in playerprefs
	//PlayerPrefs stores the score in a local cache 
	saveScore = PlayerPrefs.GetInt("Player Score");
}

//Draws the GUI
function OnGUI () {
	//Matrix4x4 allows for autoresizing of GUI based on screen size
	//640x360 is our intended resolution 
	GUI.matrix = Matrix4x4.TRS (Vector3.zero, Quaternion.identity, Vector3(Screen.width / 640.0, Screen.height / 360.0, 1));
	
	var controller : controller = player.GetComponent("controller");
	var flyyVector : int = controller.startingVector.x;
	var currentDistance : int = flyyVector;
	
	//The score is simply how far the player has travelled
	var score : int = player.transform.position.x - currentDistance;
	
	//Display the high score and the current score
	var highScore = saveScore.ToString();
	GUI.Label(Rect (40,340,200,200), highScore);
	var currentScore = score.ToString();
	GUI.Label(Rect (600,340,200,200), currentScore);
	
	//Save our current score if it is ever greater than our previous high score
	if(score > saveScore){
		saveScore = score;
		PlayerPrefs.SetInt("Player Score", saveScore);
	}
	
	//Change the 'has ring' message based on our current platform (Web or Android)
	if(controller.hasRing == true){
		var ringMessage;
		if(gameState.gamePlatform == "Android"){
			ringMessage = "Ring Ready! Tap to Activate!";
		}else{
			ringMessage = "Ring Ready! Press Spacebar to Activate!";
			}
		GUI.Label(Rect (215, 340, 245,200), ringMessage);
	}
	//Pull our score from Kongregate if we had one
	if(controller.gameStart == true && score != 0){
		kongregateScore = score;
	}
	
}

//Send our scores to 'kongregate.js' which will send them using the kongregate API
function sendScores(){
	gameStateObject.SendMessage("submitStats", kongregateScore);
}
