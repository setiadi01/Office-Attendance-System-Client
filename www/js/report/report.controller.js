angular.module('absensiApp')

.controller('ReportCtrl', function($scope, ReportService, $state, $ionicPopup, $ionicLoading, constant, $ionicScrollDelegate, ionicDatePicker) {
    // load logged user, if user not authorized, page will redirect to login
    $scope.valLoggedUser();

    var ui = $scope;

    ui.dateFrom = ui.getDisplayDate(new Date());
    ui.dateTo = ui.getDisplayDate(new Date());

    getReportAbsenList(new Date(ui.dateFrom), new Date(ui.dateTo));

    var optionDate = {
        titleLabel: 'Select Date From',
        setLabel: 'Set',
        todayLabel: 'Today',
        closeLabel: 'Close',
        dateFormat: 'dd MMMM yyyy',
        from: new Date(2015, 1, 1),
        to: new Date(2018, 11, 31),
        mondayFirst: true,
        closeOnSelect: false,
        templateType: 'modal',
        showTodayButton: true,
        disableWeekdays: []
    };

    $scope.openDateFrom = function(){

        optionDate.inputDate = new Date(ui.dateFrom);
        optionDate.callback = function (value) {
            ui.dateFrom = ui.getDisplayDate(new Date(value));
            getReportAbsenList(new Date(ui.dateFrom), new Date(ui.dateTo));
        };

        ionicDatePicker.openDatePicker(optionDate);
    };

    $scope.openDateTo = function(){

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
            username: 'oki',
            limit: 5,
            offset: 0
        };
        ReportService.getReportAbsen(input)
            .then(function (response) {
                $ionicLoading.hide();
                if (response.status == constant.OK) {
                    console.log(JSON.stringify(response));
                    ui.checkIn = response.checkIn;
                    ui.notCheckIn = response.notCheckIn;
                    ui.lateToCheckIn = response.lateToCheckIn;
                    ui.workingHours = response.workingHours;
                }
                ui.reportList = response.reportList;
            });
    };

    $scope.scrollSmallToTop = function() {
        $ionicScrollDelegate.$getByHandle('top-content-report').scrollTop(true);
    };

    $scope.actButton="hide";
    $scope.gotScrolled = function() {
        var scroll = $ionicScrollDelegate.$getByHandle('top-content-report').getScrollPosition().top;

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
