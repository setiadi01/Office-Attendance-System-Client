angular.module('absensiApp')

.controller('EditProfileCtrl', function($scope, EditProfileService, $state, $ionicLoading, constant, $ionicPopup) {
    var ui = $scope;

    EditProfileService.getLoggedUser()
        .then(function(response){
            $ionicLoading.hide();
            if(response.status == constant.OK) {
            } else {
                $state.go('login');
            }
        }).catch(function(response){
            $ionicLoading.hide();
            if(response==null || response.statusText == constant.UNAUTHORIZED) {
                $state.go('login')
            } else {
                $scope.internalError({hideLoading : false});
            }
        });

})
