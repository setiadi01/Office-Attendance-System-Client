angular.module('absensiApp')
.service('HomeService', HomeService)
.service('RecentService', RecentService);

function HomeService($http, constant){
	return {
		getLoggedUser : function(){
			return $http.get(constant.API_URL+'get-logged-user')
				.then(function(response){
					return response.data;
				})

		}
	}
}

function RecentService($http, constant){
    return {
        getLoggedUser : function(){
            return $http.get(constant.API_URL+'get-logged-user')
                .then(function(response){
                    return response.data;
                })
        }
    }
}