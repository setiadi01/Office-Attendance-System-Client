angular.module('absensiApp')
.service('EditProfileService', EditProfileService);

function EditProfileService($http, constant){
    return {
        loadUserForEditProfile : function(input){
            return $http.get(constant.API_URL+'get-info-edit-profile')
                    .then(function(response){
                        return response.data;
                    })

        },
        doEditProfile : function(input){
            return $http({
                        url: constant.API_URL+'edit-profile',
                        method: "POST",
                        params: input
                    }).then(function(response){
                        return response.data;
                    })

        }
    }
}