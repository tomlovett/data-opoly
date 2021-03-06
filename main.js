var DataOpoly = angular.module('Data-opoly', [])

DataOpoly.controller('primary', ['$scope', 'process', 'preloads', function($scope, process, preloads) {

	$scope.tiles     = preloads.tiles
	$scope.tileLoads = {
		top    : preloads.top,
		left   : preloads.left,
		right  : preloads.right,
		bottom : preloads.bottom
	}

	$scope.mode     = 'gameTaps'
	$scope.tapsBtn  = 'avg'
	$scope.turn     = 0
	$scope.liveTile = $scope.tiles[0]

	$scope.bottomText = preloads.text[$scope.mode]

	$scope.fire = function(id, event) {
		event.stopPropagation()
		$scope.liveTile.unHighlight()
		$scope.liveTile = $scope.tiles[id]  // issue with J/JV overlap
		$scope.liveTile.highlight()
		if ($scope.mode == 'preds' || $scope.mode == 'succs') {
			$scope.routeDisplay($scope.mode)
		}
	}

	$scope.tapUpdate = function(attr) {
		$scope.tapsBtn = attr
		$scope.routeDisplay($scope.mode)
	}

	$scope.routeDisplay = function(mode) {
		$scope.mode = mode
		var attr = ''
		$scope.bottomText = preloads.text[$scope.mode]
		if (mode == 'gameTaps' || mode == 'firstTaps') {
			attr = $scope.tapsBtn
			tapsTurnsTiles(true, false, false)
		} else if (mode == 'locByTurn' || mode == 'tapped') {
			if ($scope.turn > 20) $scope.turn = 20
			if ($scope.turn < 0 ) $scope.turn = 0
			attr = $scope.turn
			tapsTurnsTiles(false, true, false)
			document.getElementById('turnBox').focus()
		} else {
			attr = $scope.liveTile.id
			tapsTurnsTiles(false, false, true)
		}
		$scope.updateDisplay(attr)
	}

	var tapsTurnsTiles = function(taps, turns, tiles) {
		$scope.tapSelector  = taps
		$scope.turnSelector = turns
		if (!turns) { $scope.turn = 0 }
	}

	$scope.updateDisplay = function(attr) {
		$scope.data = rawData[$scope.mode][attr]
		var data = process.dataToColors($scope.data, $scope.mode)
		assignColors(data)
	}

	var assignColors = function(colorsObj) {
		$scope.tiles[10.5].setColor(colorsObj[10.5])
		for (var i = 0; i < 40; i++) {
			$scope.tiles[i].setColor(colorsObj[i])
		}
		$scope.liveTile.highlight() // workaround for preds/succs
	}

	$scope.turnDownForWhat = function(event) {
		if (event.keyCode == 38) {  	  // up key
			$scope.turn += 1
			$scope.routeDisplay($scope.mode)
		} else if (event.keyCode == 40) { // down key
			$scope.turn -= 1
			$scope.routeDisplay($scope.mode)
		}
	}

	$scope.routeDisplay('gameTaps')

}])

DataOpoly.factory('process', function() {

// I recommend against reading through this section because it is rather confusing. Essentially it converts raw data from the simulation into color values for each tile.  

	var dataToColors = function(data, mode) {
		var min = _.min(_.values(data))
		var max = _.max(_.values(data))
		if (mode === 'tapped') { // normalize 'tapped' as [0-1]
			min = 0
			max = 1
		}
		if (max > 0) { data = normalizeDataSet(data, min, max) }
		var colorsObj = _.mapObject(data, function(val) {
			return numberToColor(val)
		})
		return colorsObj
	}

	var normalizeDataSet = function(dataSet, min, max) {
		var normalized = _.mapObject(dataSet, function(val) {
			try { 
				return (val - min)/(max - min) 
			} catch (divByZero) { 
				return 0 
			}
		})
		return normalized
	}

/*
 These two functions - numberToColor and calcColorInt convert a normalized float to a rgb(X, X, X) color value ranging from pure green to pure red.

 "numberToColor" first determines whether the float value belongs on the green-yellow spectrum or the yellow-red spectrum. It does this by assigning index1 to either green or yellow, and index2 to yellow or red. (In the case of 0 both are set to green, in the case of 1 both are set to red.)

  "diff" is where the float value belongs inbetween the two pure color values. How red a yellow-red is, or how green a yellow-green is.

   "calcColorInt" does the visually-unappealing computation to return the integer values for each color, ranging 0-255. (Blue levels are not computed because neither green nor yellow nor red contain any blue. The value always returns 0.)

  numberToColor then returns the color written in 'rgb(X, X, X)' notation so it can be directly assigned into a tile.
*/

	var numberToColor = function(val) {
		var index1 = Math.floor(val * 2)
		var index2 = index1 + 1
		var diff   = (val * 2) - index1
		if      (val <= 0) { index2 = 0 } // sets both indices to 0
		else if (val >= 1) { index2 = 2 } // sets both indices to 2

		var red   = calcColorInt(index1, index2, diff, 'red'  )
		var green = calcColorInt(index1, index2, diff, 'green')
		return 'rgb(' + red + ', ' + green + ', 0)'
	}

	var calcColorInt = function (index1, index2, diff, color) {
		var lowerVal = colors[index1][color]
		var upperVal = colors[index2][color]
		var colorVal = lowerVal + ((upperVal - lowerVal) * diff)
		colorVal = Math.round(colorVal)
		return colorVal.toString()
	}

	var colors = [
		{ red:   0, green: 255, blue : 0 },	// pure green
		{ red: 255, green: 255, blue : 0 },	// pure yellow
		{ red: 255, green:   0, blue : 0 } 	// pure red
	]

	return {
		dataToColors : dataToColors
	}
})

DataOpoly.factory('preloads', function() {
	var Tile = function(id, ngClass) {
		this.id = id
		this.ngClass = ngClass
		this.ngStyle = {}
	}

	Tile.prototype = {
	    setColor : function(color) {
			this.ngStyle = { 
				'background-color': color,
			}
		},
		highlight : function() {
			this.ngStyle['border'] = '1.5px solid white'

		},
		unHighlight : function() {
			var color = this.ngStyle['background-color']
			this.setColor(color)
		}
	}

	var tiles = {
		0:  new Tile(0, 'corner bottom'),
		1:  new Tile(1, 'prop bottom'),
		2:  new Tile(2, 'bottom'),
		3:  new Tile(3, 'prop bottom'),
		4:  new Tile(4, 'bottom'),
		5:  new Tile(5, 'bottom'),
		6:  new Tile(6, 'prop bottom'),
		7:  new Tile(7, 'bottom'),
		8:  new Tile(8, 'prop bottom'),
		9:  new Tile(9, 'prop bottom conn-ave'),
		10: new Tile(10, 'corner bottom'),
		10.5: new Tile(10.5),
		11: new Tile(11, 'prop'),
		12: new Tile(12),
		13: new Tile(13, 'prop'),
		14: new Tile(14, 'prop'),
		15: new Tile(15),
		16: new Tile(16, 'prop'),
		17: new Tile(17),
		18: new Tile(18, 'prop'),
		19: new Tile(19, 'prop'),
		20: new Tile(20, 'corner top'),
		21: new Tile(21, 'prop top'),
		22: new Tile(22, 'top'),
		23: new Tile(23, 'prop top'),
		24: new Tile(24, 'prop top'),
		25: new Tile(25, 'top'),
		26: new Tile(26, 'prop top'),
		27: new Tile(27, 'prop top'),
		28: new Tile(28, 'top'),
		29: new Tile(29, 'prop top'),
		30: new Tile(30, 'corner top'),
		31: new Tile(31, 'prop right'),
		32: new Tile(32, 'prop right'),
		33: new Tile(33, 'right'),
		34: new Tile(34, 'prop right'),
		35: new Tile(35, 'right'),
		36: new Tile(36, 'right'),
		37: new Tile(37, 'prop right'),
		38: new Tile(38, 'right'),
		39: new Tile(39, 'prop right')
	}


	var text = {
		gameTaps : '  How many times a player lands on each tile. (A \"tap\" is recorded every time a player lands on a tile, even if they do not finish their turn there.)\n\n  This is the most salient data from the simulation. Some notable points:\n\n - The Reds see the most traffic of any monopoly. The Oranges and Yellows also see a lot of traffic, but the third Orange sees the most of its set while the third Yellow sees the least of its set. This is very important for strategy as the last property in any set has the highest rent and the greatest impact. The Greens are also weakened by their third property being the least-busy.\n\n - "Go To Jail" acts a significant filter. It is on the busiest tiles on the board. This filter clearly reduces the amount of traffic for Boardwalk & Park Place, the two strongest tiles on the board. Park Place is particularly affected because it comes seven tiles after "Go To Jail." - The Dark Purples (Baltic & Mediterranean) see less traffic than the Light Purples, but are a good investment given their low costs relative to rent. (Houses cost $50 each but Baltic Ave with a hotel charges $450, recouping nearly all of the investment on the first hit.)',
		firstTaps : '  The average turn that a tile is landed on for the first time.\n\n  I expected to find that certain tiles tended to go sooner than others. In fact, the most salient data from this metric is just how much it varied from game to game. Besides a rough correlation between a tile\'s tap frequency there is little predictability/consistency in the order that properties are first sold.',
		locByTurn : '  Player\'s locations by turn.\n\n  I expected to see players moving in groups, being near the same locations around the same turns for a large portion of the game. In fact, players move more or less in a group for the first ten turns, then spread rather evenly across the board for the remainder of the game. Data from the twentieth turn on more or less resembles the \"Game Taps\" display. We also find that the first \"lap\" of the board takes about five turns.\n\n Caveats: To simulate real-game conditions, AI players sought to escape Jail early in the game (to pick up more properties) and to stay in Jail later in the game (to avoid landing on costly properties). Turn twenty was the point at which players stopped paying to leave Jail early and remained until they rolled doubles or had been in Jail for three turns.\n\n As one can see, this small shift in strategy greatly affects the distribution of player locations. Rather than being evenly distributed across the board, players are concentrated in Jail. Data from turns after twenty closely resemble the data from turn twenty so it was left out.',
		tapped : '  The likelihood that a tile has been landed on by a specific turn, normalized from 0-100%.\n\n  Here we find a slightly less dramatic pattern similar to \"Location by Turn.\" We see the players making a lap of the board in the first five turns, picking up some tiles along the way. From turns five through ten the players again make their way around the board, picking up yet more tiles. By the time we get to turn twenty most of the properties have been landed on and sold among the players.\n\n  On average, it took thirty-one turns for four players to land on all of the available properties, with a standard deviation of ten turns. So while it is more than likely that any specific tile has been sold by turn six, it can take another twenty-five turns before the last properties have been landed on.',
		preds : '  Clicking on a tile shows where players began their turn prior to finishing it on that tile. (Clicking on Boardwalk will show you where players who landed on Boardwalk began their turn.)\n\n  This metric is designed to show the   \n\n  Caveats: Monopoly is played with two six-sided dice. The most likely outcome of rolling two six-sided dice is 7. So it is not surprising that most of the traffic for any given tile comes from the tile seven spaces prior. Except for when the tile seven spaces prior is "Go To Jail" or Chance, which often moves a player around the board.\n\n Normalizing the data places more emphasis on the tile seven spaces prior. Without that normalization we can see other "hot" tiles across the board that lead to a given tile. For instance, the railroads see a greater-than-average amount of traffic from Chance tiles, as there is a Chance card that sends players to the nearest railroad.\n\n Interesting tiles: Bottom Row, Left Row',
		succs : '  \"Successors\" is the inverse of \"Predecessors.\" Clicking on a tile shows where players are likely to end their turn after starting on a particular tile.\n\n  Interesting tiles: Virginia Ave, Oranges, Free Parking'
	}

	var top    = _.map([20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], function(index) {
		return tiles[index]	})
	var left   = _.map([19, 18, 17, 16, 15, 14, 13, 12, 11], function(index) {
		return tiles[index]	})
	var right  = _.map([31, 32, 33, 34, 35, 36, 37, 38, 39], function(index) { 
		return tiles[index] })
	var bottom = _.map([9, 8, 7, 6, 5, 4, 3, 2, 1, 0], function(index) {
		return tiles[index]	})

	var totalTaps = 2719648

	return {
		tiles  : tiles,
		top    : top,
		left   : left,
		right  : right,
		bottom : bottom,
		text   : text
	}
})
