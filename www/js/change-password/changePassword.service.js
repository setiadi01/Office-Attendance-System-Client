angular.module('absensiApp')
.service('ChangePasswordService', ChangePasswordService);

function ChangePasswordService($http, constant){
    return {
        getLoggedUser : function(){
            return $http.get(constant.API_URL+'get-logged-user')
                .then(function(response){
                    return response.data;
                });
        }
    }
}