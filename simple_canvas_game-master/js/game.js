// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

// Log keyboard events
var keyLogger = new Array();
var keyLoggerCopy = new Array();

//var debugKeyLog = document.createElement("select");
//debugKeyLog.size = 20;
//debugKeyLog.multiple = true;
//document.body.appendChild(document.createElement("BR"));
//document.body.appendChild(debugKeyLog);


function logKey(e)
{
    keyLogger.push(e);
    //debugKeyLog.add(new Option(e.timeStamp + ":" + e.type + ": Code: " + e.keyCode, 1));
    //debugKeyLog.selectedIndex = debugKeyLog.length-1;
}

var dispatchNextKey = function()
{
    var e = keyLoggerCopy.pop();
    
    window.dispatchEvent(e);
    
    var l = keyLoggerCopy.length;
    if(l > 0)
     {
        var nextE = keyLoggerCopy[l-1];
        var ms = nextE.timeStamp - e.timeStamp;
        setTimeout(dispatchNextKey, ms);
     }
};

var playKeys = function () {
    Math.seedrandom("skillz");
    monstersCaught = 0;
    reset();
    keyLoggerCopy = keyLogger.splice(0);
    keyLoggerCopy.reverse();
    dispatchNextKey();
};

var playKeyLog = document.createElement("button");
playKeyLog.innerHTML = "Play Key Log";
playKeyLog.onclick = playKeys;
document.body.appendChild(playKeyLog);


addEventListener("keydown", function (e) {
        logKey(e);
        keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
        logKey(e);
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};


// Set random seed
Math.seedrandom("skillz");

// Let's play this game!
reset();

var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
