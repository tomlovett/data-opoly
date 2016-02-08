var DataOpoly = angular.module('Data-opoly', [])


DataOpoly.factory('utility', function() {

// how to corral individual tiles by id number? $scope.tiles[i]

// controller
	// changing between views
	// applying colors to tiles

// factory
	

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