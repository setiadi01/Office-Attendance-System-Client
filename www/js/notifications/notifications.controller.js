angular.module('absensiApp')

.controller('NotificationsCtrl', function($scope, NotificationsService, $ionicScrollDelegate, $state, $ionicLoading, $ionicPopup, constant) {
    var ui = $scope;

    $ionicLoading.show();
    NotificationsService.getLoggedUser()
        .then(function(response){
            $ionicLoading.hide();
            if(response.status == constant.OK) {
                ui.name = response.data.full_name;
            } else {
                $state.go('login');
            }
        }).catch(function(response){
            $ionicLoading.hide();
            if(response==null || response.statusText == constant.UNAUTHORIZED) {
                $state.go('login')
            } else {
                $ionicPopup.alert({
                    title: 'Internal server error',
                    template: 'We are sorry, it seems there is a problem with our servers. Please try your request again in a moment.'
                });
            }
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
            });// show button
        }else{
            $scope.$apply(function(){
                $scope.actButton="hide";
            });// hide button
        }
    };
})
