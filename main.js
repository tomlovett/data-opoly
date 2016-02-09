var DataOpoly = angular.module('Data-opoly', [])

DataOpoly.controller('primary', ['$scope', 'process', 'preloads', function($scope, process, preloads) {

	$scope.tiles     = preloads.tiles
	$scope.topRow    = preloads.topRow
	$scope.leftCol   = preloads.leftCol
	$scope.rightCol  = preloads.rightCol
	$scope.bottomRow = preloads.bottomRow

	$scope.mode = 'gameTaps'
	$scope.tapsBtn = 'avg'
	$scope.turn = 0
	$scope.liveTile = 0

	$scope.bottomText = preloads.text[$scope.mode]


	$scope.fire = function(id) {
		console.log('fire: ', id) // issue with Jail/JV on top of each other
		$scope.liveTile = id
		if ($scope.mode == 'preds' || $scope.mode == 'succs') {
			$scope.predSuccs($scope.mode)
		} else {
			hoverData()
		}
	}

	$scope.tapDisplays = function(mode) {
		$scope.mode = mode
		$scope.turnSelector = false
		$scope.updateDisplay($scope.tapsBtn)
	}

	$scope.turnDisplays = function(mode) {
		$scope.mode = mode
		$scope.turnSelector = true
		$scope.updateDisplay($scope.turn)
	}

	$scope.predSuccs = function(mode) {
		$scope.mode = mode
		$scope.turnSelector = false
		$scope.updateDisplay($scope.liveTile)
	}

	$scope.updateDisplay = function(attr) {
		var data = rawData[$scope.mode][attr]
		data = process.dataToColors(data)
		assignColors(data)
	}


	var hoverData = function() {
		return 'data specific to that tile'
	}

	var assignColors = function(colorSet) {
		$scope.tiles[10.5].setColor(colorSet[10.5])
		for (var i = 0; i < 40; i++) {
			$scope.tiles[i].setColor(colorSet[i])
		}
	}
/* pre-loading display because I like it */

}])

DataOpoly.factory('process', function() {

	var dataToColors = function(data) {
		var min = _.min(_.values(data))
		var max = _.max(_.values(data))
		data = normalizeDataSet(data, min, max)
		var colorSet = _.mapObject(data, function(val) {
			return numberToColor(val)
		})
		return colorSet
	}

	var normalizeDataSet = function(dataSet, min, max) {
		var output = _.mapObject(dataSet, function(val) {
			return (val - min)/(max - min)
		})
		return output
	}

	var numberToColor = function(val) {  // this section needs cleaning up
		var floor   = 0
		var ceiling = 0
		var diff    = 0
		if (val <= 0) {
			floor   = 0
			ceiling = 0
		} else if (val >= 1) {
			floor   = 2
			ceiling = 2
		} else {
			val     = val * 2
			floor   = Math.floor(val)
			ceiling = floor + 1
			diff    = val - floor
		}

		var red = getColorValue(floor, ceiling, diff, 'red'  )
		var green = getColorValue(floor, ceiling, diff, 'green')
		return 'rgb(' + red + ', ' + green + ', 0)'
	}

	var colors = [
		{ red:   0, green: 255  }, 	// pure green
		{ red: 255, green: 255  }, 	// pure yellow
		{ red: 255, green:   0  }  	// pure red
	]

	var getColorValue = function (floor, ceiling, diff, color) {
		var lowerVal = colors[floor][color]
		var upperVal = colors[ceiling][color]
		var colorVal = lowerVal + (upperVal - lowerVal) * diff
		colorVal = Math.round(colorVal)
		return colorVal.toString()
	}

	return {
		dataToColors : dataToColors
	}
})

DataOpoly.factory('preloads', function() {
	var Tile = function(id, styles) {
		this.id = id
		this.styles = styles
		this.color = {}
	}

	Tile.prototype = {
	    setColor : function(color) {
			this.color = { 
				'background-color': color,
			}
		},
		setHover : function(text) {
			'set text'
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
		9:  new Tile(9, 'prop bottom'),
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
		gameTaps : 'GAME TAPS!!',
		firstTaps : 'FIRST TAPS!!',
		locByTurn : 'LOCATION BY TURN!!',
		tapped : 'TAPPED!!',
		preds : 'PREDECESSORS!!',
		succs : 'SUCCESSORS!!'
	}

	var topRow = _.map([20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], function(index) {
		return tiles[index]	})
	var leftCol = _.map([19, 18, 17, 16, 15, 14, 13, 12, 11], function(index) {
		return tiles[index]	})
	var rightCol = _.map([31, 32, 33, 34, 35, 36, 37, 38, 39], function(index) { 
		return tiles[index] })
	var bottomRow = _.map([9, 8, 7, 6, 5, 4, 3, 2, 1, 0], function(index) {
		return tiles[index]	})

	var gameTaps = {
		"0":  { "std_dev": 2.25744, "perc_of_whole": 0.02113 }, 
		"1":  { "std_dev": 2.22234, "perc_of_whole": 0.02104 }, 
		"2":  { "std_dev": 2.27661, "perc_of_whole": 0.02154 }, 
		"3":  { "std_dev": 2.32625, "perc_of_whole": 0.02226 }, 
		"4":  { "std_dev": 2.33094, "perc_of_whole": 0.02282 }, 
		"5":  { "std_dev": 2.36349, "perc_of_whole": 0.02357 }, 
		"6":  { "std_dev": 2.38281, "perc_of_whole": 0.02436 }, 
		"7":  { "std_dev": 2.49067, "perc_of_whole": 0.02545 }, 
		"8":  { "std_dev": 2.43731, "perc_of_whole": 0.02523 }, 
		"9":  { "std_dev": 2.44044, "perc_of_whole": 0.02499 }, 
		"10": { "std_dev": 2.39305, "perc_of_whole": 0.02441 }, 
		"11": { "std_dev": 2.38073, "perc_of_whole": 0.02401 }, 
		"12": { "std_dev": 2.3747,  "perc_of_whole": 0.02361 }, 
		"13": { "std_dev": 2.34013, "perc_of_whole": 0.02297 }, 
		"14": { "std_dev": 2.33069, "perc_of_whole": 0.02301 }, 
		"15": { "std_dev": 2.40994, "perc_of_whole": 0.02391 }, 
		"16": { "std_dev": 2.42469, "perc_of_whole": 0.02419 }, 
		"17": { "std_dev": 2.43205, "perc_of_whole": 0.0248  }, 
		"18": { "std_dev": 2.44366, "perc_of_whole": 0.02527 }, 
		"19": { "std_dev": 2.46918, "perc_of_whole": 0.02595 }, 
		"20": { "std_dev": 2.49061, "perc_of_whole": 0.02607 }, 
		"21": { "std_dev": 2.48428, "perc_of_whole": 0.02612 }, 
		"22": { "std_dev": 2.52613, "perc_of_whole": 0.0264  }, 
		"23": { "std_dev": 2.51357, "perc_of_whole": 0.02693 }, 
		"24": { "std_dev": 2.46224, "perc_of_whole": 0.02664 }, 
		"25": { "std_dev": 2.48082, "perc_of_whole": 0.02657 }, 
		"26": { "std_dev": 2.50427, "perc_of_whole": 0.02672 }, 
		"27": { "std_dev": 2.48153, "perc_of_whole": 0.02631 }, 
		"28": { "std_dev": 2.44913, "perc_of_whole": 0.02571 }, 
		"29": { "std_dev": 2.43291, "perc_of_whole": 0.02547 }, 
		"30": { "std_dev": 2.56629, "perc_of_whole": 0.02604 }, 
		"31": { "std_dev": 2.48659, "perc_of_whole": 0.02631 }, 
		"32": { "std_dev": 2.42057, "perc_of_whole": 0.02546 }, 
		"33": { "std_dev": 2.43944, "perc_of_whole": 0.02485 }, 
		"34": { "std_dev": 2.3693,  "perc_of_whole": 0.02419 }, 
		"35": { "std_dev": 2.34448, "perc_of_whole": 0.02354 }, 
		"36": { "std_dev": 2.36921, "perc_of_whole": 0.02245 }, 
		"37": { "std_dev": 2.25849, "perc_of_whole": 0.02125 }, 
		"38": { "std_dev": 2.27149, "perc_of_whole": 0.02119 }, 
		"39": { "std_dev": 2.24529, "perc_of_whole": 0.02121 },
		"10.5": {"std_dev": 2.56629, "perc_of_whole": 0.02604}
	}

	var totalTaps = 2719648

	return {
		tiles     : tiles,
		topRow    : topRow,
		leftCol   : leftCol,
		rightCol  : rightCol,
		bottomRow : bottomRow,
		gameTaps  : gameTaps,
		text 	  : text
	}
})
