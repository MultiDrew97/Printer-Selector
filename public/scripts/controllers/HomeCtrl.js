angular.module('HomeCtrl', []).controller('HomeController', function($scope, $window, printers, locations) {
	$scope.printers = printers.data;
	$scope.locations = locations.data;

	$scope.findLocation = (id) => {
		for (let i = 0; i < $scope.locations.length; i++) {
			if ($scope.locations[i]._id === id) {
				return $scope.locations[i].site;
			}
		}
	}

	$scope.parseData = () => {
		$scope.parsedData = [];
		for (let l = 0; l < $scope.locations.length; l++) {
			let current = {
				locationName: $scope.locations[l].displayName,
				printers: []
			}

			for (let lp = 0; lp < $scope.locations[l].printers.length; lp++) {
				for (let p = 0; p < $scope.printers.length; p++) {
					if ($scope.locations[l].printers[lp] === $scope.printers[p]._id) {
						// Add the printer name to the list of printers at the location
						current.printers.push($scope.printers[p])
						break;
					}
				}

			}
			$scope.parsedData.push(current)
		}
	}

	$scope.parseData();
})