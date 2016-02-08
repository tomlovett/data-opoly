var DataOpoly = angular.module('Data-opoly', [])

DataOpoly.controller('primary', ['$scope', 'utility', 'preloads', function($scope, utility, preloads) {

	$scope.tiles     = preloads.tiles
	$scope.topRow    = preloads.topRow
	$scope.leftCol   = preloads.leftCol
	$scope.rightCol  = preloads.rightCol
	$scope.bottomRow = preloads.bottomRow

	// console.log($scope.tiles)

	$scope.colors = {}

	var gameTaps = utility.gameTaps

	gameTaps = _.map(gameTaps, function(obj) {
		return obj['avg']
	})

	$scope.colors = utility.processRawData(gameTaps)
	console.log($scope.colors)

	$scope.colors = utility.processRawData(utility.tappedTen)
	for (var i =0; i < 40; i++) {
		$scope.tiles[i].setColor($scope.colors[i])
	}
	$scope.tiles[10.5].setColor($scope.colors[10.5])


}])

DataOpoly.factory('utility', function() {

// how to corral individual tiles by id number? $scope.tiles[i]

// controller
	// changing between views
	// applying colors to tiles

	var processRawData = function(rawData) {
		// console.log('rawData: ', rawData)
		var min = _.min(_.values(rawData))
		var max = _.max(_.values(rawData))
		var normalizedData = _.mapObject(rawData, function(val) {
			return normalize(val, min, max)
		})
		// console.log('normalizedData: ', normalizedData)
		var colorSet = _.mapObject(normalizedData, function(val) {
			return numberToColor(val)
		})
		// console.log('colorSet: ', colorSet)
		return colorSet
		// for each in Raw

	}

	var normalize = function(val, min, max) {
		return (val - min)/(max - min)
	}

	var colors = [
		{ red: 0,   green: 0,   blue: 255 }, 	// blue
		{ red: 0,   green: 255, blue: 0   }, 	// green
		{ red: 255, green: 255, blue: 0   }, 	// yellow
		{ red: 255, green: 0,   blue: 0   }  	// red
	]

	var numberToColor = function(val) {
		var floor   = 0
		var ceiling = 0
		var diff    = 0
		if (val <= 0) {
			floor   = 0
			ceiling = 0
		} else if (val >= 1) {
			floor   = 3
			ceiling = 3
		} else {
			val     = val * 3
			floor   = Math.floor(val)
			ceiling = floor + 1
			diff    = val - floor
		}

		var output = 'rgb('		
		output += getColorValue(floor, ceiling, diff, 'red'  ) + ', '
		output += getColorValue(floor, ceiling, diff, 'green') + ', '
		output += getColorValue(floor, ceiling, diff, 'blue' ) + ')'
		return output
	}

	var getColorValue = function (floor, ceiling, diff, color) {
		var lowerVal = colors[floor][color]
		var upperVal = colors[ceiling][color]
		var colorVal = lowerVal + (upperVal - lowerVal) * diff
		colorVal = Math.round(colorVal)
		return colorVal.toString()
	}

	var tappedTen = {"10.5": 0.6904, "0": 0.584, "2": 0.6177, "3": 0.6657, "4": 0.7047, "5": 0.7413, "6": 0.7796, "1": 0.5767, "8": 0.7928, "9": 0.7807, "10": 0.7603, "11": 0.7469, "12": 0.7425, "13": 0.7103, "14": 0.7082, "15": 0.7346, "16": 0.7357, "17": 0.7359, "18": 0.7471, "19": 0.7481, "20": 0.7471, "21": 0.7387, "22": 0.7343, "23": 0.744, "24": 0.7404, "25": 0.7288, "26": 0.7272, "27": 0.7269, "28": 0.7151, "29": 0.7111, "30": 0.6904, "31": 0.7102, "32": 0.6939, "33": 0.6753, "34": 0.6666, "35": 0.6523, "36": 0.6215, "37": 0.6008, "38": 0.5984, "39": 0.5891, "7": 0.8042}

	var gameTaps = {
		"0": {"median": 6.0, "avg": 5.7477, "std_dev": 2.25744, "perc_of_whole": 0.02113}, 
		"1": {"median": 6.0, "avg": 5.7227, "std_dev": 2.22234, "perc_of_whole": 0.02104}, 
		"2": {"median": 6.0, "avg": 5.8581, "std_dev": 2.27661, "perc_of_whole": 0.02154}, 
		"3": {"median": 6.0, "avg": 6.0535, "std_dev": 2.32625, "perc_of_whole": 0.02226}, 
		"4": {"median": 6.0, "avg": 6.2062, "std_dev": 2.33094, "perc_of_whole": 0.02282}, 
		"5": {"median": 6.0, "avg": 6.4099, "std_dev": 2.36349, "perc_of_whole": 0.02357}, 
		"6": {"median": 6.0, "avg": 6.6249, "std_dev": 2.38281, "perc_of_whole": 0.02436}, 
		"7": {"median": 7.0, "avg": 6.9216, "std_dev": 2.49067, "perc_of_whole": 0.02545}, 
		"8": {"median": 7.0, "avg": 6.861, "std_dev": 2.43731, "perc_of_whole": 0.02523}, 
		"9": {"median": 7.0, "avg": 6.7967, "std_dev": 2.44044, "perc_of_whole": 0.02499}, 
		"10": {"median": 7.0, "avg": 6.6389, "std_dev": 2.39305, "perc_of_whole": 0.02441}, 
		"11": {"median": 6.0, "avg": 6.5302, "std_dev": 2.38073, "perc_of_whole": 0.02401}, 
		"12": {"median": 6.0, "avg": 6.4199, "std_dev": 2.3747, "perc_of_whole": 0.02361}, 
		"13": {"median": 6.0, "avg": 6.247, "std_dev": 2.34013, "perc_of_whole": 0.02297}, 
		"14": {"median": 6.0, "avg": 6.2573, "std_dev": 2.33069, "perc_of_whole": 0.02301}, 
		"15": {"median": 6.0, "avg": 6.5016, "std_dev": 2.40994, "perc_of_whole": 0.02391}, 
		"16": {"median": 6.0, "avg": 6.5792, "std_dev": 2.42469, "perc_of_whole": 0.02419}, 
		"17": {"median": 7.0, "avg": 6.7444, "std_dev": 2.43205, "perc_of_whole": 0.0248}, 
		"18": {"median": 7.0, "avg": 6.8719, "std_dev": 2.44366, "perc_of_whole": 0.02527}, 
		"19": {"median": 7.0, "avg": 7.0587, "std_dev": 2.46918, "perc_of_whole": 0.02595}, 
		"20": {"median": 7.0, "avg": 7.091, "std_dev": 2.49061, "perc_of_whole": 0.02607}, 
		"21": {"median": 7.0, "avg": 7.1033, "std_dev": 2.48428, "perc_of_whole": 0.02612}, 
		"22": {"median": 7.0, "avg": 7.1796, "std_dev": 2.52613, "perc_of_whole": 0.0264}, 
		"23": {"median": 7.0, "avg": 7.3229, "std_dev": 2.51357, "perc_of_whole": 0.02693}, 
		"24": {"median": 7.0, "avg": 7.2455, "std_dev": 2.46224, "perc_of_whole": 0.02664}, 
		"25": {"median": 7.0, "avg": 7.2255, "std_dev": 2.48082, "perc_of_whole": 0.02657}, 
		"26": {"median": 7.0, "avg": 7.268, "std_dev": 2.50427, "perc_of_whole": 0.02672}, 
		"27": {"median": 7.0, "avg": 7.1565, "std_dev": 2.48153, "perc_of_whole": 0.02631}, 
		"28": {"median": 7.0, "avg": 6.9933, "std_dev": 2.44913, "perc_of_whole": 0.02571}, 
		"29": {"median": 7.0, "avg": 6.9256, "std_dev": 2.43291, "perc_of_whole": 0.02547}, 
		"30": {"median": 7.0, "avg": 7.0829, "std_dev": 2.56629, "perc_of_whole": 0.02604}, 
		"31": {"median": 7.0, "avg": 7.1555, "std_dev": 2.48659, "perc_of_whole": 0.02631}, 
		"32": {"median": 7.0, "avg": 6.9255, "std_dev": 2.42057, "perc_of_whole": 0.02546}, 
		"33": {"median": 7.0, "avg": 6.7572, "std_dev": 2.43944, "perc_of_whole": 0.02485}, 
		"34": {"median": 6.0, "avg": 6.5776, "std_dev": 2.3693, "perc_of_whole": 0.02419}, 
		"35": {"median": 6.0, "avg": 6.403, "std_dev": 2.34448, "perc_of_whole": 0.02354}, 
		"36": {"median": 6.0, "avg": 6.1065, "std_dev": 2.36921, "perc_of_whole": 0.02245}, 
		"37": {"median": 6.0, "avg": 5.7786, "std_dev": 2.25849, "perc_of_whole": 0.02125}, 
		"38": {"median": 6.0, "avg": 5.7637, "std_dev": 2.27149, "perc_of_whole": 0.02119}, 
		"39": {"median": 6.0, "avg": 5.7688, "std_dev": 2.24529, "perc_of_whole": 0.02121},
		"10.5": {"median": 7.0, "avg": 7.0829, "std_dev": 2.56629, "perc_of_whole": 0.02604}
	}
	var totalTaps = 2719648

	return {
		processRawData : processRawData,
		tappedTen : tappedTen,
		gameTaps : gameTaps
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
				'opacity' : '.5'
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


	var topRow = _.map([20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], function(index) {
		return tiles[index]	})
	var leftCol = _.map([19, 18, 17, 16, 15, 14, 13, 12, 11], function(index) {
		return tiles[index]	})
	var rightCol = _.map([31, 32, 33, 34, 35, 36, 37, 38, 39], function(index) { 
		return tiles[index] })
	var bottomRow = _.map([9, 8, 7, 6, 5, 4, 3, 2, 1, 0], function(index) {
		return tiles[index]	})

	return {
		tiles     : tiles,
		topRow    : topRow,
		leftCol   : leftCol,
		rightCol  : rightCol,
		bottomRow : bottomRow
	}


})