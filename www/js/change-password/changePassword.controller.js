angular.module('absensiApp')

.controller('ChangePasswordCtrl', function($scope, ChangePasswordService, $state, $ionicLoading, constant, $ionicPopup) {
    // load logged user, if user not authorized, page will redirect to login
    $scope.valLoggedUser();

    $scope.savePassword = function (currentPassword, newPassword) {

        console.log("masuk savePassword()");
        var input = {};
        input.currentPassword = currentPassword;
        input.newPassword = newPassword;

        console.log(input);

        ChangePasswordService.changePassword(input)
        .then(function (response) {
            if (response.status == constant.OK) {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Success',
                    cssClass: 'success',
                    template: response.message
                });
            }
            else {
                $ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Failed to change password',
                    template: response.message
                });
            }
        })
        .catch(function (error) {
            $scope.internalError();
        });
    }

})
