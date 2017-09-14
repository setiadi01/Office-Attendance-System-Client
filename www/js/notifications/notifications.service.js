angular.module('absensiApp')
.service('NotificationsService', NotificationsService);

function NotificationsService($http){
    return {
        getLoggedUser : function(){
            return $http.get('http://192.168.0.168:8125/api/get-logged-user')
                .then(function(response){
                    return response.data;
                });
        }
    }
}