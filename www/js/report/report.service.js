angular.module('absensiApp')
.service('ReportService', ReportService);

function ReportService($http, constant){
    return {
        getReportAbsen : function(input){
            return $http({
                    url: constant.API_URL+'get-report-absen',
                    method: "GET",
                    params: input
                }).then(function(response){
                    return response.data;
                })

        },
        getReasonList : function(){
            return $http({
                url: constant.API_URL+'get-reason-list',
                method: "GET"
            }).then(function(response){
                return response.data;
            })

        },
        changeReason : function(input){
            return $http({
                url: constant.API_URL+'change-reason',
                method: "GET",
                params: input
            }).then(function(response){
                return response.data;
            })

            // return $http.post(constant.API_URL+'change-reason',
            //         {
            //             headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            //             data: input
            //         }).then(function(response){
            //             return response.data;
            //         })

        }
    }
}