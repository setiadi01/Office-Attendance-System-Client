angular.module('absensiApp')

.controller('ChangePasswordCtrl', function($scope, ChangePasswordService, $state, $ionicLoading, constant, $ionicPopup) {

    $scope.setProfile();

    $scope.input={};

    $scope.savePassword = function () {

        $scope.input.username=$scope.currentUser.username;
        ChangePasswordService.changePassword($scope.input)
        .then(function (response) {
            if (response.status == constant.OK) {
                $scope.loadRecent();
                $ionicLoading.hide();

                $scope.input={};

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
            $scope.showInternalError();
        });
    }

})
