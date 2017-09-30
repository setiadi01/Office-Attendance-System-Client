angular.module('absensiApp')
.service('ChangePasswordService', ChangePasswordService);

function ChangePasswordService($http, constant){
    return {
        getLoggedUser : function(){
            return $http.get(constant.API_URL+'get-logged-user')
                .then(function(response){
                    return response.data;
                });
        },
        changePassword : function(input){
            return $http({
                url : constant.API_URL+'change-password',
                method: "POST",
                params: input
            })
            .then(function(response){
                return response.data;
            });
        }
    }
}