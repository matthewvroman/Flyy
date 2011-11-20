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

//how fast the ring grows 
var growthRate : float = 1;

//how long the ring lives for
var lifeSpan : float = 7.0;
private var destructTime : float;

//parent object the ring will follow
var player : GameObject;
player = GameObject.FindWithTag("Player");

function Start(){
	//parent the ring to the player so it follows it
	this.transform.parent = player.transform;
}

function Awake(){
	//determine time until death
	destructTime = Time.time + lifeSpan;
}

function Update () {
	//scale the ring based on the growth rate
	transform.localScale += Vector3(growthRate*Time.deltaTime,growthRate*Time.deltaTime,growthRate*Time.deltaTime);
	
	//destroy the object if we've surpassed the life spawn
	if(Time.time > destructTime){
		Destroy(this.gameObject);
	}
}

//destroys any obstacles it collides with
function OnTriggerEnter(other : Collider){
	if(other.transform.root.tag == "obstacle"){
		other.SendMessageUpwards("destroy");
	}
}