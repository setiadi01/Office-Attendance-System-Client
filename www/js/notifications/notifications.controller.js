angular.module('absensiApp')

.controller('NotificationsCtrl', function($scope, NotificationsService, $ionicScrollDelegate, $state) {
    var ui = $scope;

    NotificationsService.getLoggedUser()
        .then(function(response){
            console.log(response);
            ui.name = response.data.full_name;
        }).catch(function(response){
            console.log(response);
        });

    $scope.scrollSmallToTop = function() {
        $ionicScrollDelegate.$getByHandle('top-content').scrollTop(true);
    };

    $scope.actButton="hide";
    $scope.gotScrolled = function(asas) {
        var scroll = $ionicScrollDelegate.$getByHandle('top-content').getScrollPosition().top;

        if(scroll>150){
            $scope.$apply(function(){
                $scope.actButton="show";
            });//apply
        }else{
            $scope.$apply(function(){
                $scope.actButton="hide";
            });//apply
        }
    };
})
