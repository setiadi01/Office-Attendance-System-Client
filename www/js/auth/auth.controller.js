angular.module('absensiApp')

.controller('AuthUserCtrl', function($scope, $rootScope, $auth, $ionicPopup, $state, $http, constant) {
	var ui = $scope;
    ui.login = function(username){
		$state.go('login-password', {username: username});
		
    }
})

.controller('AuthPassCtrl', function($scope, $ionicLoading, $auth, $ionicPopup, $state, $stateParams, $http, $ionicPopup, AuthService) {
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
		console.log(response.data);
		//ui.pic = response.data;
		if (response.data == null) {
			ui.ImageUrl = ''
		}else{
			loadImage(response.data)
		}
	}).catch(function(response){
		$ionicLoading.hide();
        ui.ImageUrl = ''
	});

	function loadImage(image){
		$ionicLoading.show();
		AuthService.loadImage(image)
		.then(function(response){
			$ionicLoading.hide();
			console.log(response);
			var imageBlob = new Blob([response.data], { type: response.headers('Content-Type') });
	        ui.ImageUrl = (window.URL || window.webkitURL).createObjectURL(imageBlob);

		}).catch(function(response){
			$ionicLoading.hide();
            ui.ImageUrl = ''
		});
	}

	ui.login = function(password){
		$ionicLoading.show();
		$auth.login({username : username, password : password})
			.then(function(response) {
				console.log(response.data.user);
				$ionicLoading.hide();
				if (response.data.status == 'OK') {
					localStorage.setItem('user', JSON.stringify(response.data.user));
					$state.go('app.home');
				}else{
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
				console.log(response);
				$ionicLoading.hide();
                $ionicPopup.alert({
                    title: 'Internal server error',
                    template: 'We are sorry, it seems there is a problem with our servers. Please try your request again in a moment.'
                });
			});
	}
})