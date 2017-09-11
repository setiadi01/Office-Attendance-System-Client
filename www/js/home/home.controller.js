angular.module('absensiApp')

.controller('HomeCtrl', function($scope, HomeService) {

    var ui = $scope;

    HomeService.getLoggedUser()
    .then(function(response){
    	console.log(response);
    	ui.name = response.data.full_name;
    }).catch(function(response){
    	console.log(response);
    });

})

.controller('RecentCtrl', function($scope, RecentService) {
    console.log('Home');

    var ui = $scope;

    RecentService.getLoggedUser()
        .then(function(response){
            console.log(response);
            ui.name = response.data.full_name;
        }).catch(function(response){
            console.log(response);
        });

})
