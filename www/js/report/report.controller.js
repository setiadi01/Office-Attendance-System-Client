angular.module('absensiApp')

.controller('ReportCtrl', function($ionicModal, $scope, ReportService, $state, $ionicPopup, $ionicLoading, constant, $ionicScrollDelegate, ionicDatePicker) {
    // load logged user, if user not authorized, page will redirect to login
    // $scope.valLoggedUser();

    var ui = $scope;
    ui.setProfile();

    var startDate = new Date();
    if(startDate.getDate()<21) { 
        startDate.setDate(1);
        startDate.setMonth(startDate.getMonth()-1);
    }
    startDate.setDate(21);

    var endDate = new Date();
    if(endDate.getDate()>20) { 
        endDate.setDate(1);
        endDate.setMonth(endDate.getMonth()+1);
    }
    endDate.setDate(20);

    ui.dateFrom = ui.getDisplayDate(startDate);
    ui.dateTo = ui.getDisplayDate(endDate);

    getReportAbsenList(new Date(ui.dateFrom), new Date(ui.dateTo), '');

    var optionDate = {
        titleLabel: 'Select Date From',
        setLabel: 'Set',
        todayLabel: 'Today',
        closeLabel: 'Close',
        dateFormat: 'dd MMMM yyyy',
        from: new Date().setFullYear(new Date().getFullYear() - 5),
        to: new Date(),
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'modal',
        showTodayButton: true,
        disableWeekdays: []
    };

    ui.openDateFrom = function(){

        optionDate.inputDate = new Date(ui.dateFrom);
        optionDate.callback = function (value) {
            ui.dateFrom = ui.getDisplayDate(new Date(value));
            getReportAbsenList(new Date(ui.dateFrom), new Date(ui.dateTo), '');
        };

        ionicDatePicker.openDatePicker(optionDate);
    };

    ui.openDateTo = function(){

        optionDate.inputDate = new Date(ui.dateTo);
        optionDate.callback = function (value) {
            ui.dateTo = ui.getDisplayDate(new Date(value));
            getReportAbsenList(new Date(ui.dateFrom), new Date(ui.dateTo), '');
        };

        ionicDatePicker.openDatePicker(optionDate);
    };

    function getReportAbsenList(dateFrom, dateTo, type) {
        // load report
        var input = {
            startDate: ui.getFormattedDate(dateFrom),
            endDate: ui.getFormattedDate(dateTo),
            username: ui.currentUser.username,
            type: type?type:'',
            limit: 31,
            offset: 0
        };

        ReportService.getReportAbsen(input)
            .then(function (response) {
                $ionicLoading.hide();
                if (response.status == constant.OK) {
                    ui.checkIn = response.checkIn;
                    ui.onTime = response.onTime;
                    ui.lateToCheckIn = response.lateToCheckIn;
                    ui.workingHours = response.workingHours;
                    ui.notCheckIn = response.notCheckIn;
                    ui.reportList = response.reportList;
                }
            });
    };

    ui.doSearchNotCheckinReportAbsensi = function() {
        getReportAbsenList(new Date(ui.dateFrom), new Date(ui.dateTo), 'NOTCHECKIN');
    }

    ui.doSearchOnTimeReportAbsensi = function() {
        getReportAbsenList(new Date(ui.dateFrom), new Date(ui.dateTo), 'ONTIME');
    }

    ui.doSearchLateReportAbsensi = function() {
        getReportAbsenList(new Date(ui.dateFrom), new Date(ui.dateTo), 'LATE');
    }

    ui.doSearchReportAbsensi = function() {
        getReportAbsenList(new Date(ui.dateFrom), new Date(ui.dateTo), '');
    }

    ReportService.getReasonList()
        .then(function (response) {
            if (response.status == constant.OK) {
                ui.reasonList = response.reasonList;
            }
        });

    ui.scrollSmallToTop = function() {
        $ionicScrollDelegate.$getByHandle('top-content-report').scrollTop(true);
    };



    $ionicModal.fromTemplateUrl('templates/manage-report.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {

        $scope.showModal = function (param) {
            if(param.check_status == constant.NO && param.reason_code == '') {
                $scope.modal = modal;
                ui.input ={};
                $scope.modal.show();

                $scope.currentSelectReportItem = param;
            }
        }
    });

    ui.input ={};
    ui.saveReason = function () {
        console.log(ui.currentSelectReportItem);
        console.log(ui.input);

        if(ui.input.reason) {

            var inputChangeReason = {
                reasonCode : ui.input.reason,
                checkinDate : ui.currentSelectReportItem.string_date
            }

            console.log(inputChangeReason);

            ReportService.changeReason(inputChangeReason)
                .then(function (response) {
                    if (response.status == constant.OK) {
                        $scope.modal.hide();
                        ui.doSearchNotCheckinReportAbsensi();
                        ui.loadRecent();
                        ui.input ={};
                    }
                    else {
                        $ionicLoading.hide();
                        $ionicPopup.alert({
                            title: 'Failed to change reason',
                            template: response.result
                        });
                    }
                })
                .catch(function (error) {
                    $scope.showInternalError();
                });

        }
    }

    ui.actButton="hide";
    ui.gotScrolled = function() {
        var scroll = $ionicScrollDelegate.$getByHandle('top-content-report').getScrollPosition().top;

        if(scroll>150){
            ui.$apply(function(){
                ui.actButton="show";
            });// show button
        }else{
            ui.$apply(function(){
                ui.actButton="hide";
            });// hide button
        }
    };

})
