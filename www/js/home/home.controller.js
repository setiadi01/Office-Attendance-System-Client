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
            console.log(response);
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

    $scope.getStatusAbsen = function () {
        HomeService.getStatusAbsen()
            .then(function (response) {
                $ionicLoading.hide();
                if (response.status == constant.OK) {
                    console.log(response);
                    localStorage.setItem('status', response.data);
                }
            }).catch(function (response) {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: 'Internal server error',
                template: 'We are sorry, it seems there is a problem with our servers. Please try your request again in a moment.'
            });
        });
        $rootScope.statusabsen = localStorage.getItem('status');
    }
    $scope.getStatusAbsen();


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
                                    $scope.getStatusAbsen();
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Success!',
                                        template: 'Barcode data is here'
                                    });
                                }
                                else {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Checkout Failed',
                                        template: 'Try Again'
                                    });
                                }
                            }, function (response) {
                                $ionicLoading.hide();
                                $ionicPopup.alert({
                                    title: 'Internal server error'
                                });
                            });
                    }
                }, function (error) {
                    // An error occurred
                    $ionicPopup.alert({
                        title: 'Internal server error'
                    });
                })
        }
        $scope.doScanCheckout = function () {
            if(localStorage.getItem('status') == 'O'){
                $ionicPopup.alert({
                    title: 'You Have Checked Out'
                });
            }
            else {
                $cordovaBarcodeScanner.scan()
                    .then(function (barcodeData) {
                        // Success! Barcode data is here
                        if (barcodeData.text) {
                            $ionicLoading.show();
                            HomeService.checkout({checkout: barcodeData.text})
                                .then(function (response) {
                                    if (response.status == 'OK') {
                                        $scope.getStatusAbsen();
                                        $ionicLoading.hide();
                                        $ionicPopup.alert({
                                            title: 'Success! Barcode data is here'
                                        });
                                    }
                                    else {
                                        $ionicLoading.hide();
                                        $ionicPopup.alert({
                                            title: 'Checkout Failed',
                                            template: response.status
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
                    })
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
