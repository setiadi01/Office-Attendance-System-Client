angular.module('absensiApp')

.controller('ReportCtrl', function($scope, ReportService, $state, $ionicPopup, $ionicLoading, constant, $ionicScrollDelegate, ionicDatePicker) {
    // load logged user, if user not authorized, page will redirect to login
    // $scope.valLoggedUser();

    var ui = $scope;
    ui.setProfile();

    var startDate = new Date();
    startDate.setDate(1);

    ui.dateFrom = ui.getDisplayDate(startDate);
    ui.dateTo = ui.getDisplayDate(new Date());

    getReportAbsenList(new Date(ui.dateFrom), new Date(ui.dateTo));

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
            getReportAbsenList(new Date(ui.dateFrom), new Date(ui.dateTo));
        };

        ionicDatePicker.openDatePicker(optionDate);
    };

    ui.openDateTo = function(){

        optionDate.inputDate = new Date(ui.dateTo);
        optionDate.callback = function (value) {
            ui.dateTo = ui.getDisplayDate(new Date(value));
            getReportAbsenList(new Date(ui.dateFrom), new Date(ui.dateTo));
        };

        ionicDatePicker.openDatePicker(optionDate);
    };

    function getReportAbsenList(dateFrom, dateTo) {
        // load report
        var input = {
            startDate: ui.getFormattedDate(dateFrom),
            endDate: ui.getFormattedDate(dateTo),
            username: ui.currentUser.username,
            limit: 10,
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
                    ui.reportList = response.reportList;
                }
            });
    };

    ui.scrollSmallToTop = function() {
        $ionicScrollDelegate.$getByHandle('top-content-report').scrollTop(true);
    };

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
