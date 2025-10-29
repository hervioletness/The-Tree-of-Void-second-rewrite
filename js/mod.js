let modInfo = {
	name: "The Tree of Void: Rerewritten",
	author: "nobody",
	pointsName: "points",
	modFiles: ["void.js", "ef.js", "ach.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.1.1",
	name: "Balancing",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.0</h3> (12/10/2025)<br>
	<b>The Void Awakens Update</b><br>
		- Added the Void Layer.<br>
		
	<h3>v1.1</h3> (18/10/2025)<br>
	<b>Echoic Expansion Update</b><br>
		- Added the first half of the Echo Fragment Layer.<br>
		- Added achievements.<br>
		- Various balance changes and tweaks.<br>
	<b>v1.1.1</b> (29/10/2025)<br>
	<b>Balancing Update</b><br>
		- Balanced some pretty long timewalls.<br>
		- Adjusted slightly some formulas and upgrades.<br>
`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0)
	gain = gain.add(buyableEffect('v',11))
	gain = gain.mul(buyableEffect('v',13).eff)
	if (hasUpgrade('v',12)) gain = gain.mul(upgradeEffect('v',12))
	if (hasUpgrade('v',15)) gain = gain.mul(upgradeEffect('v',15))
	gain = gain.mul(buyableEffect('ef',11))

	//achievements
	if (hasAchievement('ach',12)) gain = gain.mul(2)
	if (hasAchievement('ach',14)) gain = gain.mul(2.5)
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	extraCores: decimalZero,
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}