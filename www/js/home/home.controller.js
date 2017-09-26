angular.module('absensiApp')

.controller('HomeCtrl', function($ionicPlatform, $scope, HomeService, $state, $ionicLoading, $ionicPopup, constant, $cordovaBarcodeScanner, $cordovaStatusbar) {

    var ui = $scope;
    $ionicLoading.show();
    HomeService.getLoggedUser()
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

    $ionicPlatform.ready(function() {

        $scope.doScan = function () {
            $cordovaBarcodeScanner.scan()
                .then(function (barcodeData) {
                    // Success! Barcode data is here
                    if (barcodeData.text) {
                        $ionicLoading.show();
                        HomeService.checkin({checkin: barcodeData.text})
                            .then(function (response) {
                                if (response.status == 'OK') {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Success! Barcode data is here'
                                    });
                                }
                                }, function (response) {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Internal server error',
                                        template: response.status
                                    });
                                });
                    }
                }, function (error) {
                    // An error occurred
                    $ionicPopup.alert({
                        title: 'Internal server error',
                        template: error
                    });
                });
        }
    });

})

.controller('RecentCtrl', function($scope, RecentService, $ionicScrollDelegate, $state, $ionicLoading, $ionicPopup, constant) {
    var ui = $scope;

    $ionicLoading.show();
    RecentService.getLoggedUser()
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
    $scope.gotScrolled = function() {
        var scroll = $ionicScrollDelegate.$getByHandle('top-content').getScrollPosition().top;

        if(scroll>150){
            $scope.$apply(function(){
                $scope.actButton="show";
            }); // show button
        }else{
            $scope.$apply(function(){
                $scope.actButton="hide";
            }); // hide button
        }
    };
})
