angular.module('absensiApp')

.controller('NotificationsCtrl', function($scope, NotificationsService, $ionicScrollDelegate, $state, $ionicLoading, $ionicPopup, constant) {
    // load logged user, if user not authorized, page will redirect to login
    $scope.valLoggedUser();

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
