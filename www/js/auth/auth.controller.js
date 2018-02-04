angular.module('absensiApp')

.controller('AuthUserCtrl', function($scope, $state) {
    $scope.login = function(username){
		$state.go('login-password', {username: username});
    }
})

.controller('AuthRecentUserCtrl', function(AuthService, $scope, $rootScope, $auth, $ionicPopup, $state, $http, constant, $ionicHistory) {

	// Jika sudah tidak ada lagi list user, maka akan di redirect ke halaman login (username)
    if(!localStorage.user_lists||localStorage.user_lists=='{}') {
        $ionicHistory.nextViewOptions({
            disableBack: true,
            historyRoot: true
        });
        $state.go('login');
	}

	var userJsonList = JSON.parse(localStorage.user_lists);
    generateUserList(userJsonList);

	function generateUserList(lastUserList) {
		var keyList = Object.keys(lastUserList);
		var userArrayList = [];
		for (var i = 0; i < keyList.length; i++) {
			var key = keyList[i];
			var lastUserListObj = lastUserList[key];
			userArrayList.push(lastUserListObj);
		}
		$scope.userLists = userArrayList;
    }
    
    $scope.removeAccount = function (user) {
		delete userJsonList[user];
        localStorage.setItem('user_lists', JSON.stringify(userJsonList));

        userJsonList = JSON.parse(localStorage.user_lists);
        generateUserList(userJsonList);

        if($scope.userLists.length == 0) {

            $ionicHistory.nextViewOptions({
                disableBack: true,
                historyRoot: true
            });

            $state.go('login');
		}


    }

})

.controller('AuthPassCtrl', function($scope, $ionicLoading, $auth, $ionicPopup, $state, $stateParams, $http, $ionicPopup, AuthService, $ionicHistory, constant) {

	var ui = $scope;
	ui.ImageUrl = '';
    ui.showPasswordIsChecked = false;

	var username = $stateParams.username;

	if(!username) {
        $state.go('login');
	}

	AuthService.getProfilePicture(username)
	.then(function(response){
		if (response.data == null) {
			ui.profilePicture = ''
		}else{
			loadImage(response.data)
		}
	}).catch(function(response){
        ui.profilePicture = ''
	});

	function loadImage(image){
		AuthService.loadImage(image)
		.then(function(response){
			var imageBlob = new Blob([response.data], { type: response.headers('Content-Type') });
	        ui.profilePicture = (window.URL || window.webkitURL).createObjectURL(imageBlob);
            localStorage.setItem('current_user_img', ui.profilePicture);
		}).catch(function(response){
            ui.profilePicture = ''
		});
	}

	ui.login = function(password){
        $scope.absenLoading();
		$auth.login({username : username, password : password, versionApp: constant.VERSION_APP})
			.then(function(response) {
				if (response.data.status == constant.OK) {

					// Set data user to local storage
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    localStorage.setItem('statusLogin', true);

                    var currentUser = response.data.user,
						userJson = {};

                    userJson[username] = {"username" : currentUser.username, "fullName" : currentUser.full_name, "pictureName" : currentUser.profile_picture};

                    // add to local storage user_list
                    if(localStorage!=null && localStorage.user_lists !=null) {
                    	var currentList = JSON.parse(localStorage.user_lists);
                        currentList[username] = {"username" : currentUser.username, "fullName" : currentUser.full_name, "pictureName" : currentUser.profile_picture};
                        localStorage.setItem('user_lists', JSON.stringify(currentList));
                    }

					// set to local storage user_list
					else {
                        localStorage.setItem('user_lists', JSON.stringify(userJson));
                    }

                    $ionicHistory.clearCache().then(function () {
                        $ionicLoading.hide();
                        $state.go('app.home');
                    });
				} else{

                    $ionicLoading.hide();
                    $ionicPopup.confirm({
                        title: 'Login failed',
                        template: 'Sory, the username and password you entered do not match. Please try again',
                        buttons: [{
                            text: 'Try again',
                            type: 'with-border-right',
                        }, {
                            text: 'Not '+username,
                            type: 'button-positive',
                            onTap: function (e) {
                                $state.go('login');
                            }
                        }]
                    });
				}
			})
			.catch(function(response) {
                $scope.showInternalError();
			});
	}
})