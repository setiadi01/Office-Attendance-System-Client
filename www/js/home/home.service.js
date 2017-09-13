angular.module('absensiApp')
.service('HomeService', HomeService)
.service('RecentService', RecentService);

function HomeService($http){
	return {
		getLoggedUser : function(){
			return $http.get('http://192.168.0.168:8125/api/get-logged-user')
				.then(function(response){
					return response.data;
				});
		}
	}
}

function RecentService($http){
    return {
        getLoggedUser : function(){
            return $http.get('http://192.168.0.168:8125/api/get-logged-user')
                .then(function(response){
                    return response.data;
                });
        }
    }
}