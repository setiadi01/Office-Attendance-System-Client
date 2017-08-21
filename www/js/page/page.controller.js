angular.module('absensiApp')

.controller('PageCtrl', function($scope, $timeout) {
    console.log('Page');
     $scope.people = [
	    { name: 'Fredy', id: 1 },
	    { name: 'Setiadi', id: 2 },
	    { name: 'Okky', id: 3 },
	    { name: 'Fandy', id: 4 },
	    { name: 'Didit', id: 5 },
	    { name: 'Nadia', id: 6 }
	];
})

.controller('SubPageCtrl', function($scope, $stateParams) {
    console.log($stateParams.name);

    var ui = $scope;

    ui.name = $stateParams.name;
})
