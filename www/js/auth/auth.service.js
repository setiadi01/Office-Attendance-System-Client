angular.module('absensiApp')
.service('AuthService', AuthService);


function AuthService($http, constant){
	return {
		getProfilePicture : function(username){
			return $http.get(constant.API_URL+'get-profie-picture/'+username)
				.then(function(response){
					return response.data;
				});
		},
		loadImage : function(image){
			return $http.get(constant.API_URL+'images/'+image, {
					responseType: 'arraybuffer'
				})
				.then(function(response){
					return response;
				});
		}
	}
}

