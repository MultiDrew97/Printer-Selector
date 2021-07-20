angular.module('MainCtrl', []).controller('MainController', ($scope, $printers) => {
	$scope.department = 'AGIT';
	$scope.header = 'Printer Installation';
	$scope.subheader = `Welcome to the ${$scope.department} ${$scope.header} Site.`;


})