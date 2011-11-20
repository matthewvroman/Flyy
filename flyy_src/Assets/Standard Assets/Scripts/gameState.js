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

//Setup audio variables for the game
var musicSource : AudioSource = null;
var musicClip : AudioClip;

//Find the player object
var player : GameObject;
player = GameObject.FindWithTag("Player");

static var level : int;

//"Web" or "Android" - determines movement controls & instructions that appear
static var gamePlatform : String = "Android";

static var particleArray : Array = new Array();

//Immediately play the music at the start of the game - keep it looping
function Awake () {
	
	musicSource = gameObject.AddComponent(AudioSource);
	musicSource.volume = 0.75;
	musicSource.loop = true;
	musicSource.playOnAwake = true;
	musicSource.clip = musicClip;
	
	level = 1;
	
}

//Play / Pause of Music
function switchSound(){
	if(musicSource.isPlaying){
		musicSource.Pause();
		return;
	}if(!musicSource.isPlaying){
		musicSource.Play();
		return;
	}
}