angular.module('absensiApp')

.controller('EditProfileCtrl', function($scope, $rootScope, EditProfileService, $state, $ionicLoading, constant,$ionicPopup) {

    var ui = $scope;
    ui.setProfile();

    ui.fullName = ui.currentUser?ui.currentUser.full_name:'';
    ui.userName = ui.currentUser?ui.currentUser.username:'';
    ui.phoneNumber = ui.currentUser?ui.currentUser.phone_number:'';
    ui.emailAddress = ui.currentUser?ui.currentUser.email:'';

    ui.saveProfile = function (fullName, username) {

        if(ui.fullName == fullName && ui.userName == username) {
            return;
        }

        var input = {
            fullName: fullName,
            newUsername: username,
            currentUsername: ui.userName
        };

        EditProfileService.doEditProfile(input)
            .then(function (response) {
                $ionicLoading.hide();
                if (response.status == constant.OK) {

                    var currentUser = JSON.parse(localStorage.user);
                    currentUser.full_name = fullName;
                    currentUser.username = username;

                    localStorage.setItem('user', JSON.stringify(currentUser));
                    ui.setProfile();
                    ui.loadRecent();

                    // update informasi local user list
                    var userJsonList = JSON.parse(localStorage.user_lists);
                    userJsonList[username] = userJsonList[ui.userName];
                    userJsonList[username].fullName = fullName;
                    userJsonList[username].username = username;
                    if(ui.userName!=username) {
                        delete userJsonList[ui.userName];
                    }
                    localStorage.setItem('user_lists', JSON.stringify(userJsonList));
                    ui.fullName = fullName;
                    ui.userName = username;

                    $ionicPopup.alert({
                        title: 'Success',
                        cssClass: 'success',
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
            ui.showInternalError();
        });
    };
})
