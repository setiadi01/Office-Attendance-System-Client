angular.module('absensiApp')

.controller('AuthUserCtrl', function($scope, $auth, $ionicPopup, $state) {
	var ui = $scope;
    ui.login = function(input){
		localStorage.setItem('username', input);
		$state.go('login-password');
    }
})

.controller('AuthPassCtrl', function($scope, $auth, $ionicPopup, $state) {
	console.log('login');
	$scope.showPasswordIsChecked = false;
	$scope.username = localStorage.getItem('username');
	$scope.close = function () {
		$scope.error = false;
	}

	var ui = $scope;
	ui.login = function(input){
		$auth.login(input)
			.then(function(response) {
				if (response.data.status == 'OK') {
					$state.go('app.home');
				}else{
					$scope.error = true;
					$scope.message = "Kombinasi username & password salah";
				}
			})
			.catch(function(response) {
				$state.go('app.home');
				$scope.error = true;
				$scope.message = "Maaf, server sedang mengalami gangguan";
			});
	}
})