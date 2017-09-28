angular.module('absensiApp')

.controller('EditProfileCtrl', function($window, $scope, $rootScope, EditProfileService, $state, $ionicLoading, constant,$ionicPopup) {
    // load logged user, if user not authorized, page will redirect to login
    $scope.valLoggedUser();

    var ui = $scope;

    $ionicLoading.show();
    EditProfileService.loadUserForEditProfile()
    .then(function (response) {
        console.log(response);
        $ionicLoading.hide();
        if (response.status == constant.OK) {
            ui.fullName = response.data.full_name;
            ui.userName = response.data.username;
            ui.phoneNumber = response.data.phone_number;
            ui.emailAddress = response.data.email;
        }
        else {
            $scope.internalError({hideLoading:false});
        }
    }).catch(function (error) {
        $scope.internalError();
    });
    
    $scope.saveProfile = function (fullName, username) {

        // $ionicLoading.show();

        var input = {};
        input.fullName = fullName;
        input.username = username;

        console.log(input);

        EditProfileService.doEditProfile(input)
            .then(function (response) {
                console.log(response);
                $ionicLoading.hide();
                if (response.status == constant.OK) {

                    $scope.valLoggedUser();

                    // update informasi local user list
                    var userJsonList = JSON.parse($window.localStorage.user_lists);
                    userJsonList[username] = userJsonList[ui.userName];
                    userJsonList[username].fullName = fullName;
                    userJsonList[username].username = username;
                    if(ui.userName!=username) {
                        delete userJsonList[ui.userName];
                    }
                    $window.localStorage.setItem('user_lists', JSON.stringify(userJsonList));

                    ui.fullName = fullName;
                    ui.userName = username;

                    $ionicPopup.alert({
                        title: 'Success',
                        template: 'Your profile has been successfully updated'
                    });
                }
                else {
                    $ionicPopup.alert({
                        title: 'Failed to edit profile',
                        template:response.error
                    });
                }
            }).catch(function (error) {
            $scope.internalError();
        });
    };
})
// .directive('usernameAvailable', function($timeout, $q, $http, constant) {
//     return {
//         restrict: 'AE',
//         require: 'ngModel',
//         link: function(scope, elm, attr, model) {
//             model.$asyncValidators.usernameExists = function() {
//
//                 var param = model.$viewValue,
//                     input = {
//                     username : param
//                 };
//
//                 var defer = $q.defer();
//                 if(param.length >= 4 ) {
//                     $http({
//                         url: constant.API_URL + 'check-username',
//                         method: "GET",
//                         params: input
//                     })
//                     .then(function (response) {
//                         defer.resolve;
//                         if (response.data.status == constant.OK) {
//                             if (response.data.data <= 0){
//                                 model.$setValidity('usernameExists', false);
//                             } else {
//                                 model.$setValidity('usernameExists', true);
//                             }
//                         } else {
//                             model.$setValidity('usernameExists', true);
//                         }
//                     })
//                 }
//
//                 return defer.promise;
//
//             };
//         }
//     }
// });
