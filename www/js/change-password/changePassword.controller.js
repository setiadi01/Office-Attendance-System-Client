angular.module('absensiApp')

.controller('ChangePasswordCtrl', function($scope, ChangePasswordService, $state) {
    var ui = $scope;

    ChangePasswordService.getLoggedUser()
        .then(function(response){
            console.log(response);
            ui.name = response.data.full_name;
        }).catch(function(response){
            console.log(response);
        });

})
