angular.module('absensiApp')
.service('HomeService', HomeService)
.service('RecentService', RecentService);

function HomeService($http, constant, $httpParamSerializer){
	return {
        checkin : function(input){
            return $http({
                url: constant.API_URL+'checkin',
                method: "POST",
                params: input
            }).then(function(response){
                    return response.data;
            })

        },
        checkout : function(input){
            return $http({
                url: constant.API_URL+'checkout',
                method: "POST",
                params: input
            }).then(function(response){
                return response.data;
            })

        },
        getLastInfoCheckin: function(){
            return $http.get(constant.API_URL+'get-last-info-checkin')
                .then(function(response){
                    return response.data;
                })

        },
        getSummaryChart : function(){
            return $http.get(constant.API_URL+'get-summary-chart')
                .then(function(response){
                    return response.data;
                })

        }
	}
}

function RecentService($http, constant){
    return {
    }
}