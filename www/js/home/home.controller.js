angular.module('absensiApp')

.controller('HomeCtrl', function($ionicPlatform, $timeout, $scope, $rootScope, HomeService, $state, $ionicLoading, $ionicPopup, constant, $cordovaBarcodeScanner) {

    var ui = $scope;
    ui.series = ['Total check in', 'On time', 'Late to checkin'];

    ui.setProfile();
    ui.statusabsen = ui.currentUser.checkStatus;

    // load summary
    HomeService.getSummaryChart()
    .then(function (response) {
        if (response.status == constant.OK) {
            var summaryChartData = response.summaryChartData;
            var listData = [];
            var late = [];
            var onTime = [];
            var totalCheckin = [];
            var month = [];

            for(var i=0; i<summaryChartData.length; i++) {


                var date = new Date();
                date.setMonth(date.getMonth()-(summaryChartData.length-(i)));

                month.push(ui.getMonthDisplay(date.getMonth()));
                late.push(summaryChartData[i].late);
                onTime.push(summaryChartData[i].on_time);
                totalCheckin.push(summaryChartData[i].total_check_in);

            }

            ui.data = [
                totalCheckin,
                onTime,
                late
            ];

            ui.labels = month;

        }
    });

    HomeService.getSummaryWeekly()
    .then(function (response) {
        if (response.status == constant.OK) {
            ui.workingHours = response.workingHours;
            ui.lateToCheckIn = response.lateToCheckIn;
            ui.bestCheckIn = response.bestCheckIn;

        }
    });

    $ionicPlatform.ready(function() {

        // Check in
        ui.doScan = function () {

            if(ui.currentUser.checkStatus == constant.YES) {

                $ionicPopup.alert({
                    title: 'Failed to check in',
                    template: 'You have checked out for today, please do check in again for tomorrow'
                });

            } else {

                $cordovaBarcodeScanner.scan()
                    .then(function (barcodeData) {
                        // Success! Barcode data is here
                        if (barcodeData.text) {
                            ui.absenLoading();
                            HomeService.checkin({checkin: barcodeData.text})
                                .then(function (response) {
                                    if (response.status == constant.OK) {
                                        $ionicLoading.hide();
                                        ui.loadRecent();

                                        // set check status
                                        ui.currentUser.checkStatus=constant.CHECK_IN;
                                        localStorage.setItem('user', JSON.stringify(ui.currentUser));
                                        ui.statusabsen = ui.currentUser.checkStatus;

                                        var clock = new Date(),
                                            username = ui.currentUser.username,
                                            message = 'Good morning '+username;
                                        if(clock.getHours() >= 11) {
                                            message = 'Hello '+username;
                                        }

                                        $ionicPopup.alert({
                                            title: 'Success to check in',
                                            cssClass: 'success',
                                            template: message+'. Keep spirit for today :)'
                                        });
                                    }
                                    else {
                                        $ionicLoading.hide();
                                        $ionicPopup.alert({
                                            title: 'Failed to check in',
                                            template: response.error
                                        });
                                    }
                                }).catch(function (error) {
                                ui.showInternalError();
                                })
                        }
                    }).catch(function (error) {
                    ui.showInternalError();
                    })
            }
        }

        // Check out
        ui.doScanCheckout = function () {
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

        // Checkout function
        function doCheckout () {
            $cordovaBarcodeScanner.scan()
                .then(function (barcodeData) {
                    if (barcodeData.text) {
                        ui.absenLoading();
                        HomeService.checkout({checkout: barcodeData.text})
                            .then(function (response) {
                                if (response.status == constant.OK) {
                                    ui.loadRecent();

                                    // set check status
                                    ui.currentUser.checkStatus=constant.CHECK_OUT;
                                    localStorage.setItem('user', JSON.stringify(ui.currentUser));
                                    ui.statusabsen = ui.currentUser.checkStatus;

                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Success to check out',
                                        cssClass: 'success',
                                        template: "You have successfully checked out today. See you tomorrow."
                                    });
                                }
                                else {
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title: 'Failed to check out',
                                        template: response.error
                                    });
                                }

                            }).catch(function (error) {
                            ui.showInternalError();
                        });
                    }
                }).catch(function (error) {
                ui.showInternalError();
            })
        }
    });

})

.controller('RecentCtrl', function($scope, RecentService, $ionicScrollDelegate, $ionicLoading, constant) {
    // load logged user, if user not authorized, page will redirect to login
    // $scope.valLoggedUser();
    $scope.setProfile();
    $scope.loadRecent();

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
