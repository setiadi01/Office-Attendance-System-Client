angular.module('absensiApp')

.controller('ReportCtrl', function($scope, ReportService, $state, $ionicPopup, $ionicLoading, constant, $ionicScrollDelegate, ionicDatePicker) {
    var ui = $scope;

    ui.dateFrom = ui.getDisplayDate(new Date());
    ui.dateTo = ui.getDisplayDate(new Date());


    ReportService.getLoggedUser()
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

    var optionDate = {
        titleLabel: 'Select Date From',
        setLabel: 'Set',
        todayLabel: 'Today',
        closeLabel: 'Close',
        dateFormat: 'dd MMMM yyyy',
        from: new Date(2015, 1, 1), //Optional
        to: new Date(2018, 11, 31),
        mondayFirst: true,          //Optional
        closeOnSelect: false,       //Optional
        templateType: 'modal',       //Optional
        showTodayButton: true,
        disableWeekdays: []
    };

    $scope.openDateFrom = function(){

        optionDate.inputDate = new Date(ui.dateFrom);
        optionDate.callback = function (value) {
            ui.dateFrom = ui.getDisplayDate(new Date(value));
        };

        ionicDatePicker.openDatePicker(optionDate);
    };

    $scope.openDateTo = function(){

        optionDate.inputDate = new Date(ui.dateTo);
        optionDate.callback = function (value) {
            ui.dateTo = ui.getDisplayDate(new Date(value));
        };

        ionicDatePicker.openDatePicker(optionDate);
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
