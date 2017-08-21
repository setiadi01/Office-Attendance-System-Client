angular.module('absensiApp')

.controller('AuthCtrl', function($scope, $auth, $ionicPopup, $state) {
    console.log('login');

    var ui = $scope;

    ui.login = function(input){
    	$auth.login(input)
    	.then(function(response) {
		    if (response.data.status == 'OK') {
		    	$state.go('app.home');
		    }else{
		    	$ionicPopup.alert({
			     	title: 'Error',
			     	template: 'Kombinasi username & password salah'
			   	});
		    }
		})
		.catch(function(response) {
			$ionicPopup.alert({
		     	title: 'Error',
		     	template: 'Maaf, server sedang mengalami gangguan'
		   	}); 
  		});
    }
})
