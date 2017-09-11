angular.module('absensiApp')

.controller('AuthUserCtrl', function($scope, $rootScope, $auth, $ionicPopup, $state, $http, constant) {
	var ui = $scope;
    ui.login = function(username){
		//localStorage.setItem('username', input);
		$state.go('login-password');
		
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

	AuthService.getProfilePicture(username)
	.then(function(response){
		$ionicLoading.hide();
		console.log(response.data);
		//ui.pic = response.data;
		if (response.data == null) {
			ui.ImageUrl = '/img/person.png'
		}else{
			loadImage(response.data)
		}
	}).catch(function(response){
		$ionicLoading.hide();
		$ionicPopup.alert({
	     	title: 'Error',
	     	template: 'Maaf, server sedang mangalami gangguan'
	   	});
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
			$ionicPopup.alert({
		     	title: 'Error',
		     	template: 'Maaf, server sedang mangalami gangguan'
		   	});
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
					//$scope.error = true;
					//$scope.message = "Kombinasi username & password salah";
					$ionicPopup.alert({
				     	title: 'Error',
				     	template: 'Kombinasi username & password salah'
				   	});
				}
			})
			.catch(function(response) {
				console.log(response);
				$ionicLoading.hide();
				$scope.error = true;
				$scope.message = "Maaf, server sedang mengalami gangguan";
			});
	}
})