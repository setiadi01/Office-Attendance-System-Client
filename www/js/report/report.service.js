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

        }
    }
}