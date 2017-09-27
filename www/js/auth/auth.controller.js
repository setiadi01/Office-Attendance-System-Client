angular.module('absensiApp')

.controller('AuthUserCtrl', function($scope, $rootScope, $auth, $ionicPopup, $state, $http, constant, $window, $ionicHistory, $ionicPlatform) {
	if($window.localStorage !=null && $window.localStorage.user_lists !=null && $window.localStorage.user_lists != '{}' && !$rootScope.forceToLogin) {

        $state.go('login-recent');

	}

	if($rootScope.forceToLogin){
        $ionicPlatform.onHardwareBackButton(function() {
            $state.go('login-recent');
        });
	}

	var ui = $scope;
    ui.login = function(username){
		$state.go('login-password', {username: username});
		
    }
})

.controller('AuthRecentUserCtrl', function(AuthService, $scope, $rootScope, $auth, $ionicPopup, $state, $http, constant, $window, $ionicHistory) {

	var userJsonList = JSON.parse($window.localStorage.user_lists);
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
        $window.localStorage.setItem('user_lists', JSON.stringify(userJsonList));

        userJsonList = JSON.parse($window.localStorage.user_lists);
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
	$scope.showPasswordIsChecked = false;
	$scope.username = localStorage.getItem('username');
	$scope.close = function () {
		$scope.error = false;
	}

	$ionicLoading.show();

	var ui = $scope;
	ui.ImageUrl = '';
	var username = $stateParams.username;

	if(!username) {
        $state.go('login');
	}

	AuthService.getProfilePicture(username)
	.then(function(response){
		$ionicLoading.hide();
		//ui.pic = response.data;
		if (response.data == null) {
			ui.profilePicture = ''
		}else{
			loadImage(response.data)
		}
	}).catch(function(response){
		$ionicLoading.hide();
        ui.profilePicture = ''
	});

	function loadImage(image){
		$ionicLoading.show();
		AuthService.loadImage(image)
		.then(function(response){
			$ionicLoading.hide();
			var imageBlob = new Blob([response.data], { type: response.headers('Content-Type') });
	        ui.profilePicture = (window.URL || window.webkitURL).createObjectURL(imageBlob);
		}).catch(function(response){
			$ionicLoading.hide();
            ui.profilePicture = ''
		});
	}

	ui.login = function(password){
		$ionicLoading.show();
		$auth.login({username : username, password : password})
			.then(function(response) {
				if (response.data.status == constant.OK) {

                    localStorage.setItem('user', JSON.stringify(response.data.user));

                    var currentUser = response.data.user;
					var userJson = {};
                    userJson[username] = {"username" : currentUser.username, "fullname" : currentUser.full_name, "profilePicture" : $scope.profilePicture, "pictureName" : currentUser.profilePicture};

                    if(localStorage!=null && localStorage.user_lists !=null) {

                    	var currentList = JSON.parse(localStorage.user_lists);
                        currentList[username] = {"username" : currentUser.username, "fullname" : currentUser.full_name, "profilePicture" : $scope.profilePicture, "pictureName" : currentUser.profilePicture};

                        localStorage.setItem('user_lists', JSON.stringify(currentList));

                    }

					else {
                        localStorage.setItem('user_lists', JSON.stringify(userJson));
                    }

                    $ionicHistory.clearCache().then(function () {
                        $ionicLoading.hide();
                        $state.go('app.home');
                    });
				}else{

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
                                $scope.username = '';
                                $state.go('login');
                            }
                        }]
                    });
				}
			})
			.catch(function(response) {
                $scope.internalError();
			});
	}
})