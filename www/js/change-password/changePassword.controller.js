angular.module('absensiApp')

.controller('ChangePasswordCtrl', function($scope, ChangePasswordService, $state, $ionicLoading, constant, $ionicPopup) {
    // load logged user, if user not authorized, page will redirect to login
    $scope.valLoggedUser();

})
