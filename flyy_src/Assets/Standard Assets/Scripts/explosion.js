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

//Determines how fast the particles will follow the player
var constantSpeed : int = 10;

//Determines how long the particles can live for
var lifeSpan : float = 10.0;
private var destructTime : float;

//Finds the player gameobject so it can follow it
var target : GameObject;
target = GameObject.FindWithTag("Player");

//Never implemented - would allow color changes
var assignedColor : Color;


function Awake(){
	//determine time until death
	destructTime = Time.time + lifeSpan;

	//don't let more than 8 particle emitters be in the game at the same time, destroy the oldest one
	gameState.particleArray.push(this.gameObject);
	if(gameState.particleArray.length > 10){
		var firstParticle = gameState.particleArray[0];
		Destroy(firstParticle);
		gameState.particleArray.shift();
	}
}

function Update () {

	//follow the player
	transform.LookAt(target.transform.position);

	transform.Translate(Vector3.forward*constantSpeed*Time.deltaTime);
	
	var controller : controller = target.GetComponent("controller");
	
	//follow at the same speed as the player so the particles don't lag behind
	var flyySpeed : int = controller.constantSpeed;
	constantSpeed = flyySpeed;

	//if killAll or player has lost - destroy immediately
	if(controller.killAll == true){
		Destroy(this.gameObject);
	}
	
	if(controller.gameStart == false){
		Destroy(this.gameObject);
	}
}

function LateUpdate(){
	//if killAll or player has lost - destroy immediately
	var controller : controller = target.GetComponent("controller");
	var flyySpeed : int = controller.constantSpeed;
	
	if(controller.killAll == true){
		Destroy(this.gameObject);
	}
	
	if(controller.gameStart == false){
		Destroy(this.gameObject);
	}
}
//unimplemented - would have allowed for different explosion colors based on obstacle destroyed
function assignColor(obstacleColor){
	assignedColor = obstacleColor;
}