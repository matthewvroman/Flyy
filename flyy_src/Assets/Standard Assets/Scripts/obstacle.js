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

//How fast our obstacles are going from right to left - reassigned in Awake()
var constantSpeed = 10;

//Unimplemented - Option to have obstacles of varying types and colors
var type : String;
var assignedColor : Color;

//Destroys the object after 10 seconds (would be offscreen by then)
var lifeSpan : float = 10.0;
private var destructTime : float;

//Pushes objects down as if affected by gravity
var fall : boolean = false;

//The connected explosion that will happen if destroyed by a ring
var explosion : Transform;

//Unimplemented - would spawn the obstacle with different colors
var firstColor : Color = Color.white;
var secondColor : Color = Color.red;
var thirdColor : Color = Color.blue;
var fourthColor : Color = Color.yellow;

var highRange : int = 1;

function Awake(){
	//give the obstacle a random speed 
 	var randSpeed = Random.Range(10,20);
 	constantSpeed = randSpeed;
 	
 	//determine time until death
	destructTime = Time.time + lifeSpan;
	
	//randomize the size of the obstacle
	var randSize : Vector3;
	randSize.x = Random.Range(5,10);
	randSize.y = Random.Range(5,10);
	randSize.z = Random.Range(2,5);
	transform.localScale = randSize;
	
	//if we're on level one - unimplemented
	if(gameState.level == 1){
		var randColor = Random.Range(0,1);
		renderer.material.color = firstColor;
	}
	assignedColor = renderer.material.color;
}

function Update () {
	//move the obstacle across the screen to the left
	transform.Translate(Vector3.left*constantSpeed*Time.deltaTime);
	
	//destroy the object if it's exceeded it's life span
	if(Time.time > destructTime){
		Destroy(this.gameObject);
	}
	
	//apply fake gravity if 'falling'
	if(fall){
		transform.Translate(Vector3.down*constantSpeed*2*Time.deltaTime);
	}
	
	//destroy this if 'killAll' is called
	if(controller.killAll == true){
		Destroy(this.gameObject);
	}
	
}

//switch 'fall' bool on and off
function switchFall(){
	if(fall){
		fall = false;
		}
	else if(!fall){
		fall = true;
		}
}

//when destroyed instantiate the associated explosion
function destroy(){
	if(explosion != null){
		var newExplosion : Transform = explosion;
		Instantiate(newExplosion, transform.position, Quaternion.identity);
	}
	Destroy(this.gameObject);
}
