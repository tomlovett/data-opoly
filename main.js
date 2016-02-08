var DataOpoly = angular.module('Data-opoly', [])

DataOpoly.controller('primary', ['$scope', 'utility', function($scope, utility) {
	$scope.topRow = [21, 22, 23, 24, 25, 26, 27, 28, 29]
	$scope.leftCol = [19, 18, 17, 16, 15, 14, 13, 12, 11]
	$scope.rightCol = [31, 32, 33, 34, 35, 36, 37, 38, 39]
	$scope.bottomRow = [9, 8, 7, 6, 5, 4, 3, 2, 1]


}])

DataOpoly.factory('utility', function() {

// how to corral individual tiles by id number? $scope.tiles[i]

// controller
	// changing between views
	// applying colors to tiles

	var processRawData = function(rawData) {
		console.log('rawData: ', rawData)
		var min = _.min(_.values(rawData))
		var max = _.max(_.values(rawData))
		var normalizedData = _.mapObject(rawData, function(val) {
			return normalize(val, min, max)
		})
		console.log('normalizedData: ', normalizedData)
		var colorSet = _.mapObject(normalizedData, function(val) {
			return numberToColor(val)
		})
		console.log('colorSet: ', colorSet)
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

		var output = '#'
		output += getHexValue(floor, ceiling, diff, 'red'  )
		output += getHexValue(floor, ceiling, diff, 'green')
		output += getHexValue(floor, ceiling, diff, 'blue' ) 
		return output
	}

	var getHexValue = function (floor, ceiling, diff, color) {
		var lowerVal = colors[floor][color]
		var upperVal = colors[ceiling][color]
		var colorVal = lowerVal + (upperVal - lowerVal) * diff
		colorVal = Math.round(colorVal)
		if (colorVal === 0) { 
			return '00'
		} else {
			return colorVal.toString(16)
		}
	}

	var tappedTen = {"10.5": 0.6904, "0": 0.584, "2": 0.6177, "3": 0.6657, "4": 0.7047, "5": 0.7413, "6": 0.7796, "1": 0.5767, "8": 0.7928, "9": 0.7807, "10": 0.7603, "11": 0.7469, "12": 0.7425, "13": 0.7103, "14": 0.7082, "15": 0.7346, "16": 0.7357, "17": 0.7359, "18": 0.7471, "19": 0.7481, "20": 0.7471, "21": 0.7387, "22": 0.7343, "23": 0.744, "24": 0.7404, "25": 0.7288, "26": 0.7272, "27": 0.7269, "28": 0.7151, "29": 0.7111, "30": 0.6904, "31": 0.7102, "32": 0.6939, "33": 0.6753, "34": 0.6666, "35": 0.6523, "36": 0.6215, "37": 0.6008, "38": 0.5984, "39": 0.5891, "7": 0.8042}

	return {
		processRawData : processRawData,
		tappedTen : tappedTen
	}
})

DataOpoly.factory('preloads', function() {
	var Tile = function(ID, class) {
		this.ID = ID
		this.class = class
		this.color = ''
	}

	var tileList = {
		0: new Tile(0, 'corner')
		1: new Tile(1, 'prop')
		2: new Tile(2, )
		3: new Tile(3, 'prop'
		4: new Tile(4, )
		5: new Tile(5, )
		6: new Tile(6, 'prop')
		7: new Tile(7, )
		8: new Tile(8, 'prop')
		9: new Tile(9, 'prop')
		10: new Tile(10, 'corner')
		10.5: new Tile(10.5, )
		11: new Tile(11, 'prop')
		12: new Tile(12, )
		13: new Tile(13, 'prop')
		14: new Tile(14, 'prop')
		15: new Tile(15, )
		16: new Tile(16, 'prop')
		17: new Tile(17, )
		18: new Tile(18, 'prop')
		19: new Tile(19, 'prop')
		20: new Tile(20, 'corner')
		21: new Tile(21, 'prop')
		22: new Tile(22, )
		23: new Tile(23, 'prop')
		24: new Tile(24, 'prop')
		25: new Tile(25, )
		26: new Tile(26, 'prop')
		27: new Tile(27, 'prop')
		28: new Tile(28, )
		29: new Tile(29, 'prop')
		30: new Tile(30, 'corner')
		31: new Tile(31, 'prop')
		32: new Tile(32, 'prop')
		33: new Tile(33, )
		34: new Tile(34, 'prop')
		35: new Tile(35, )
		36: new Tile(36, )
		37: new Tile(37, 'prop')
		38: new Tile(38, 'prop')
		39: new Tile(39, )
	}

	}

})