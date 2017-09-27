angular.module('absensiApp')

.controller('HomeCtrl', function($ionicPlatform, $scope, $rootScope, HomeService, $state, $ionicLoading, $ionicPopup, constant, $cordovaBarcodeScanner, $cordovaStatusbar) {

    $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));
    $scope.loadImg($rootScope.currentUser.profile_picture);

    $ionicLoading.show();
    HomeService.getLoggedUser()
    .then(function(response){
        $ionicLoading.hide();
        if(response.status == constant.OK) {
            // set check status
            localStorage.setItem('checkStatus', response.data.checkStatus);
            $scope.statusabsen = localStorage.checkStatus;
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

    $ionicPlatform.ready(function() {

        $scope.doScan = function () {

            if($scope.statusabsen == constant.CHECK_OUT) {

                $ionicPopup.alert({
                    title: 'Failed to check in',
                    template: 'You have checked out for today, please do check in again for tomorrow'
                });

            } else {

                $cordovaBarcodeScanner.scan()
                    .then(function (barcodeData) {
                        // Success! Barcode data is here
                        if (barcodeData.text) {
                            $ionicLoading.show();
                            HomeService.checkin({checkin: barcodeData.text})
                                .then(function (response) {
                                    if (response.status == constant.OK) {
                                        $ionicLoading.hide();

                                        // set check status
                                        localStorage.setItem('checkStatus', constant.CHECK_IN);
                                        $scope.statusabsen = localStorage.checkStatus;

                                        var clock = new Date(),
                                            username = $scope.currentUser.username,
                                            message = 'Good morning '+username;
                                        if(clock.getHours() >= 11) {
                                            message = 'Hello '+username;
                                        }

                                        $ionicPopup.alert({
                                            title: 'Success to check in',
                                            template: message+'. Keep spirit for today :)'
                                        });
                                    }
                                    else {
                                        $ionicLoading.hide();
                                        $ionicPopup.alert({
                                            title: 'Failed to check in',
                                            template: 'Sorry, your check in request failed. Please try again in a moment'
                                        });
                                    }
                                }).catch(function (error) {
                                    $scope.internalError();
                                })
                        }
                    }).catch(function (error) {
                        $scope.internalError();
                    })
            }
        }
        $scope.doScanCheckout = function () {
            $ionicPopup.confirm({
                title: 'Check Out now ?',
                template: 'Check out will end your working hours today',
                buttons: [{
                    text: 'Cancel',
                    type: 'with-border-right',
                }, {
                    text: 'Check Out',
                    type: 'button-positive',
                    onTap: function (e) {
                        doCheckout ();
                    }
                }]
            });

        }
        
        function doCheckout () {
            $cordovaBarcodeScanner.scan()
                .then(function (barcodeData) {
                    if (barcodeData.text) {
                        $ionicLoading.show();
                        HomeService.checkout({checkout: barcodeData.text})
                            .then(function (response) {
                                if (response.status == constant.OK) {

                                    // set check status
                                    localStorage.setItem('checkStatus', constant.CHECK_OUT);
                                    $scope.statusabsen = localStorage.checkStatus;

                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Success to check out',
                                        template: "You have successfully checked out today. See you tomorrow."
                                    });
                                }
                                else {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Failed to check out',
                                        template: "Sorry, your check out request failed. Please try again in a moment"
                                    });
                                }

                            }).catch(function (error) {
                            $scope.internalError();
                        });
                    }
                }).catch(function (error) {
                $scope.internalError();
            })
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
