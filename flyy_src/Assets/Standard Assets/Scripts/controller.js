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

//Assign our main camera as the one we will be using
var myCamera : GameObject;
myCamera = GameObject.FindWithTag("MainCamera");

//Find our GameState.js script
var gameState : GameObject;
gameState = GameObject.FindWithTag("GameState");

//Create Vector3 (x,y,z) that takes input from the keyboard (User Input)
//and from the accelerometer (Mobile Input)
var userInput : Vector3 = Vector3.zero;
var mobileInput : Vector3 = Vector3.zero;

//Modifies the sensitivity of the accelerometer 
var acceleromatorModifier : float = 2.5;

//How fast our player is moving from left to right
var constantSpeed : int = 17;
private var tempSpeed = constantSpeed;
//How fast our player can move up and down
var horizontalSpeed : int = 20;
private var tempHorizontalSpeed = horizontalSpeed;

//Where our player spawns on the screen :: Assigned in the Unity Visual Editor
var startingVector : Vector3;

//Called when the player dies- will destroy all existing particles, blocks, etc. and reset the game
static var killAll = false;

//Define the bounds in which the player can move :: Assigned in the Unity Visual Editor
var topBounds : int;
var bottomBounds : int;
var stageLeft : int;

//Define the different obstacles & items in the game :: Assigned in the Unity Visual Editor
var obstacle : Transform;
var ring : Transform;
var ringItem : Transform;

//Interval variables for spawning obstacles
var nextSpawn : float = 0;
var spawnTime : float = 1.0;
private var foreverSpawnTime : float;
var spawnLocation : Vector3;

//Boolean check to see if the player has a ring
var hasRing : boolean = false;

//Current game time
var gameTime : float = 30.0;
var nextGameTime : float = gameTime;

//Last time the player died
var lastDeathTime : float = 0.0;
private var waitTime : float = 0.3;

//Last time the player paused the game
private var lastPause : float = 0.0;

//Decreases the time between obstacle spawns at this interval
var increaseAmount : float = 0.1;

//Determines the likelyhood of a ring spawning over time
var ringUpperBound : int;

//Bool for if the game has started yet
var gameStart : boolean = false;

//disables the ability to pause/unpause for X seconds
var disablePauseFor : float = 2.0;
private var disablePauseTil : float = 0;

//disables player from pausing right away
var requiredPauseDistance : float = 10.0;


function Awake(){
	//sets the player at the starting position
	startingVector = gameObject.transform.position;
	//kills all forward motion
	constantSpeed = 0;
	//don't let anything spawn
	foreverSpawnTime = spawnTime;
}

function Update () {
	//only accept values from the accelerometer if the game has been started
	if(gameStart == false){
		acceleromatorModifier = 0;
	}else{
		acceleromatorModifier = 2.5;
	}
	//Mobile Input
	for (var i = 0; i < Input.touchCount; ++i) {
		//if screen is tapped and the game hasn't began yet..
		if (Input.GetTouch(i).phase == TouchPhase.Ended && Time.time > (lastDeathTime + waitTime) && constantSpeed == 0) {
			gameStart = true;
			killAll = false;
			horizontalSpeed = tempHorizontalSpeed;
			constantSpeed = tempSpeed;
			return;
		}
		//if the game has started, turn the tap into a pause feature
		else if (Input.GetTouch(i).phase == TouchPhase.Ended && Time.time > (lastPause + waitTime) && constantSpeed > 0 && hasRing == false && this.transform.position.x > requiredPauseDistance){
			Time.timeScale = 0;
			lastPause = Time.time;
			gameState.SendMessage("switchSound");
			return;
		//if the game is paused, turn the tap into an unpause feature
		}else if(Input.GetTouch(i).phase == TouchPhase.Ended && Time.timeScale == 0 && Time.time == lastPause){
			Time.timeScale = 1;
			gameState.SendMessage("switchSound");
			return;
		}
		//mobile version for using the ring
		if (Input.GetTouch(i).phase == TouchPhase.Ended && hasRing == true){
			Instantiate(ring, transform.position, Quaternion.identity);
			hasRing = false;
			return;
		}
	}
	
	//manages pausing/unpausing
	if(Input.GetButtonDown("Pause") && Time.time > (lastPause + waitTime)){
		Time.timeScale = 0;
		lastPause = Time.time;
		gameState.SendMessage("switchSound");
		return;
	}else if((Time.timeScale == 0) && Input.GetButtonDown("Pause") && Time.time == lastPause){
		Time.timeScale = 1;
		gameState.SendMessage("switchSound");
		return;
	}
	//manage spawn time of obstacles, decreasing the interval between spawns over time
	if(Time.time > nextGameTime && spawnTime-increaseAmount > 0.1){
		if(gameStart == true){
			spawnTime -= increaseAmount;
			constantSpeed += increaseAmount*10;
			horizontalSpeed += increaseAmount*5;
			}
		nextGameTime = Time.time + gameTime;
	}
	//web version for using the ring
	if(Input.GetButton("Action") && hasRing == true){
		Instantiate(ring, transform.position, Quaternion.identity);
		hasRing = false;
	}
	
	//spawn obstacles and ring
	if(nextSpawn < Time.time && obstacle != null && constantSpeed != 0){
		var randNum = Random.Range(bottomBounds, topBounds);
		var obstaclePos : Vector3 = Vector3(gameObject.transform.position.x + stageLeft, randNum, gameObject.transform.position.z);
		Instantiate(obstacle, obstaclePos, Quaternion.identity);
		nextSpawn = Time.time + spawnTime;
		
		var determineRing = Random.Range(0,ringUpperBound);

		if(determineRing == 1 && ringItem != null){
			var ringRandNum = Random.Range(bottomBounds, topBounds);
			var ringPos : Vector3 = Vector3(gameObject.transform.position.x + stageLeft, ringRandNum, gameObject.transform.position.z);
			Instantiate(ringItem, ringPos, Quaternion.identity);
		}
		
	}
	
	//keep the sphere in one place until the first keypress
	if(constantSpeed == 0 && Input.anyKey && Time.time > (lastDeathTime + waitTime)){
		gameStart = true;
		killAll = false;
		horizontalSpeed = tempHorizontalSpeed;
		constantSpeed = tempSpeed;
	}
	//constant movement going right 
	transform.Translate(Vector3.right*constantSpeed*Time.deltaTime);
	
	//get w,s keys && u,d arrow keys
	userInput = Vector3(0, Input.GetAxis("Vertical"), 0);
	mobileInput.y = Input.acceleration.y;

	//only move if the sphere is within the screen
	if(gameObject.transform.position.y <= topBounds && gameObject.transform.position.y >= bottomBounds){
		transform.Translate(userInput * horizontalSpeed * Time.deltaTime);
		transform.Translate(mobileInput * horizontalSpeed * Time.deltaTime * acceleromatorModifier);
	}
	
	//keep within the screen bounds
	if(gameObject.transform.position.y > topBounds){
		gameObject.transform.position.y = topBounds;
	}if(gameObject.transform.position.y < bottomBounds){
		gameObject.transform.position.y = bottomBounds;
	}
}

function OnTriggerEnter(other : Collider){
	//if we hit an obstacle
	if(other.transform.root.tag != "Ring"){
		other.SendMessage("destroy");
		//destroy existing obstacles
		killAll = true;
		//claim game is waiting
		gameStart = false;
		//update kongregate api for scores
		myCamera.SendMessage("sendScores");
		//reset spawnTime
		spawnTime = foreverSpawnTime;
		constantSpeed = 0;
		horizontalSpeed = 0;
		//reset ring status
		hasRing = false;
		//record death time
		lastDeathTime = Time.time;
		//reset position
		this.transform.position = startingVector;
		}
	//if we hit a ring
	if(other.transform.root.tag == "Ring"){
		other.SendMessage("destroy");
		hasRing = true;
	}
}

//keep track of our score
var localScore : int;

function currentStatistics(score){
	localScore = score;
}