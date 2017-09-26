angular.module('absensiApp')

.controller('HomeCtrl', function($ionicPlatform, $scope, $rootScope, HomeService, $state, $ionicLoading, $ionicPopup, constant, $cordovaBarcodeScanner, $cordovaStatusbar) {

    $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));
    $scope.loadImg($rootScope.currentUser.profile_picture);

    $ionicLoading.show();
    HomeService.getLoggedUser()
    .then(function(response){
        $ionicLoading.hide();
        if(response.status == constant.OK) {
            // do something here
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
            var barcode = $cordovaBarcodeScanner.scan()
                            .then(function (barcodeData) {
                                // Success! Barcode data is here
                                if (barcodeData.text) {
                                   return barcodeData.text;
                                }

                            });

            if(barcode) {
                $ionicLoading.show();
                HomeService.checkin({"checkin" : barcode})
                    .then(function (response) {
                        $ionicLoading.hide();
                        if(response.status == constant.OK) {
                            $ionicPopup.alert({
                                title: 'Success to login',
                                template: response
                            });
                        }
                    }).catch(function (response) {
                        $ionicLoading.hide();
                        if (response == null || response.statusText == constant.UNAUTHORIZED) {
                            $state.go('login')
                        } else {
                            $ionicPopup.alert({
                                title: 'Internal server error',
                                template: 'We are sorry, it seems there is a problem with our servers. Please try your request again in a moment.'
                            });
                        }
                    });
            } else {
                $ionicPopup.alert({
                    title: 'Error!',
                    template: "Can't read QR Code. Please try again with valid QR Code"
                });
            }
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
