angular.module('absensiApp')

.controller('NotificationsCtrl', function($scope, NotificationsService, $ionicScrollDelegate, $state, $ionicLoading, $ionicPopup, constant) {
    var ui = $scope;

    $ionicLoading.show();
    NotificationsService.getLoggedUser()
        .then(function(response){
            $ionicLoading.hide();
            if(response.status == constant.OK) {
            } else {
                $state.go('login');
            }
        }).catch(function(response){
            $ionicLoading.hide();
            if(response==null || response.statusText == constant.UNAUTHORIZED) {
                $state.go('login')
            } else {
                $scope.internalError({hideLoading : false});
            }
        });

    $scope.scrollSmallToTop = function() {
        $ionicScrollDelegate.$getByHandle('top-content-notification').scrollTop(true);
    };

    $scope.actButton="hide";
    $scope.gotScrolled = function() {
        var scroll = $ionicScrollDelegate.$getByHandle('top-content-notification').getScrollPosition().top;

        if(scroll>150){
            $scope.$apply(function(){
                $scope.actButton="show";
            });// show button
        }else{
            $scope.$apply(function(){
                $scope.actButton="hide";
            });// hide button
        }
    };
})
