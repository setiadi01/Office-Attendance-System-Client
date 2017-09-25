angular.module('absensiApp')

.controller('ReportCtrl', function($scope, ReportService, $state, $ionicPopup, $ionicLoading, constant, $ionicScrollDelegate, ionicDatePicker) {
    var ui = $scope;

    function getDisplayDate(date) {

        var result = '';

        if(date) {
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            var dd = date.getDate();
            var mm = date.getMonth();
            var yyyy = date.getFullYear();

            result = dd + " " + monthNames[mm] + ", " + yyyy;
        }

        return result;
    }

    ui.dateFrom = getDisplayDate(new Date());
    ui.dateTo = getDisplayDate(new Date());


    ReportService.getLoggedUser()
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

    var optionDate = {
        titleLabel: 'Select Date From',
        setLabel: 'Set',
        todayLabel: 'Today',
        closeLabel: 'Close',
        dateFormat: 'dd MMMM yyyy',
        from: new Date(2015, 1, 1), //Optional
        to: new Date(2018, 11, 31),
        inputDate: new Date(),      //Optional
        mondayFirst: true,          //Optional
        closeOnSelect: false,       //Optional
        templateType: 'modal',       //Optional
        showTodayButton: true,
        disableWeekdays: []
    };

    $scope.openDateFrom = function(){

        optionDate.callback = function (value) {
            ui.dateFrom = getDisplayDate(new Date(value));
        };

        ionicDatePicker.openDatePicker(optionDate);
    };

    $scope.openDateTo = function(){

        optionDate.callback = function (value) {
            ui.dateTo = getDisplayDate(new Date(value));
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
