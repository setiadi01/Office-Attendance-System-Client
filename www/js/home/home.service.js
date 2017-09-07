angular.module('absensiApp')
.service('HomeService', HomeService)
.service('RecentService', RecentService);

function HomeService($http){
	return {
		getLoggedUser : function(){
			return $http.get('http://localhost:8000/api/get-logged-user')
				.then(function(response){
					return response.data;
				});
		}
	}
}

function RecentService($http){
    return {
        getLoggedUser : function(){
            return $http.get('http://localhost:8000/api/get-logged-user')
                .then(function(response){
                    return response.data;
                });
        }
    }
}