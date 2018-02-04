angular.module('absensiApp')

.controller('HomeCtrl', function($ionicPlatform, $timeout, $scope, $rootScope, HomeService, $state, $ionicLoading, $ionicPopup, constant, $cordovaBarcodeScanner) {

    $rootScope.valLoggedUser();

    var ui = $scope;
    ui.series = ['Total check in', 'On time', 'Late to checkin', 'Not checkin'];

    ui.setProfile();
    ui.statusabsen = ui.currentUser.checkStatus;

    // load summary
    var loadSummary = function() {
        HomeService.getSummaryChart()
            .then(function (response) {
                if (response.status == constant.OK) {
                    console.log(response);
                    var summaryChartData = response.summaryChartData;
                    var late = [];
                    var onTime = [];
                    var totalCheckin = [];
                    var month = [];
                    var notCheckin = [];

                    for(var i=0; i<summaryChartData.length; i++) {

                        month.push(summaryChartData[i].bulan);
                        late.push(summaryChartData[i].late);
                        onTime.push(summaryChartData[i].on_time);
                        totalCheckin.push(summaryChartData[i].total_check_in);
                        notCheckin.push(summaryChartData[i].not_checkin);

                    }

                    ui.data = [
                        totalCheckin,
                        onTime,
                        late,
                        notCheckin
                    ];

                    ui.labels = month;
                }
            });
    }
    loadSummary();

    var callGetLastInfoCheckin = function() {
        HomeService.getLastInfoCheckin()
        .then(function (response) {
            if (response.status == constant.OK) {

                console.log(response);
                var lastCheckIn = response.lastCheckIn;
                var bestCheckIn = response.bestCheckIn;
                ui.workDay = response.workDay;
                var workHour = response.workHour;
                var workMinute = response.workMinute;
                ui.statusabsen = response.statusAbsen;

                if(ui.statusabsen == 'N') {
                    ui.workDay = 0;
                }

                if(!lastCheckIn || ui.statusabsen == 'N') {
                    ui.lastCheckIn = "--:--";
                } else {
                    ui.lastCheckIn = lastCheckIn.substr(0,2)+':'+lastCheckIn.substr(2,2);
                }

                if(!bestCheckIn) {
                    ui.bestCheckIn = "--:--";
                } else{
                    ui.bestCheckIn = bestCheckIn;
                }

                console.log(ui.statusabsen);

                if(ui.statusabsen == 'N') {
                    ui.workHour = "--";
                } else {
                    ui.workHour = workHour;
                }

                if(ui.statusabsen == 'N') {
                    ui.workMinute = "--";
                } else {
                    ui.workMinute = workMinute;
                }
            }
        });
    };
    callGetLastInfoCheckin();

    setInterval(function () {
        callGetLastInfoCheckin();
    }, 60000);

    var checkin = function (barcodetext) {
        var param = {
            username: ui.currentUser.username,
            checkin: barcodetext
        }
        HomeService.checkin(param)
            .then(function (response) {
                if (response.status == constant.OK) {
                    $ionicLoading.hide();
                    ui.loadRecent();
                    callGetLastInfoCheckin();

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

                    callGetLastInfoCheckin();

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

    $ionicPlatform.ready(function() {

        // Check in
        ui.doScan = function () {

            $cordovaBarcodeScanner.scan()
                .then(function (barcodeData) {
                    // Success! Barcode data is here
                    if (barcodeData.text) {
                        ui.absenLoading();
                        checkin(barcodeData.text);
                    }
                }).catch(function (error) {
                    ui.showInternalError();
                })
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
                        var param = {
                            username: ui.currentUser.username,
                            checkout: barcodeData.text
                        }
                        HomeService.checkout(param)
                            .then(function (response) {
                                if (response.status == constant.OK) {
                                    ui.loadRecent();

                                    // update informasi terbaru user
                                    $rootScope.valLoggedUser();
                                    localStorage.setItem('user', JSON.stringify(ui.currentUser));
                                    ui.statusabsen = $rootScope.statusabsen;

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
