angular.module('absensiApp', ['ionic', 'satellizer', 'ionic-sidemenu-overlaying', 'ngCordova', 'ionic-datepicker'])
.run(function($ionicPlatform, $rootScope, $window, $state, $location, $http, constant, $ionicLoading, $ionicPopup, $cordovaStatusbar, $ionicHistory) {

    // splash screen
    $rootScope.$on('$ionicView.afterEnter', function(){
        setTimeout(function(){
            document.getElementById("custom-overlay").style.display = "none";
        }, 2000);
    });

    // handle back button
    $ionicPlatform.registerBackButtonAction(function (event) {
        if($state.current.name=="app.home" || $state.current.name=="login-recent" || ($state.current.name=="login" && (!localStorage.user_lists || localStorage.user_lists=='{}'))){
            navigator.app.exitApp();
        }
        else {
            navigator.app.backHistory();
        }
    }, 100);

    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }

        // change color statusbar
        $cordovaStatusbar.overlaysWebView(false);
        $cordovaStatusbar.style(1);
        $cordovaStatusbar.styleHex('#2c3b51');

    });

    /**
     * Prepare rootscope variable bellow
     */
    $rootScope.tab = false;

    /**
     * End prepare rootscope variable
     */

    /**
     * Prepare all global function bellow
     */

    // get display date
    $rootScope.getDisplayDate = function(date) {

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
    };

    // get formatted date
    $rootScope.getFormattedDate = function(date) {

        var result = '';

        if(date) {

            var dd = ("0" + date.getDate()).slice(-2);
            var mm = ("0" + (date.getMonth() + 1)).slice(-2);
            var yyyy = date.getFullYear();

            result = yyyy+""+mm+""+dd;
        }

        return result;
    };

    // Logout
    $rootScope.logout = function(){
        $ionicPopup.confirm({
            title: 'Log Out of ABSEN ?',
            template: '',
            buttons: [{
                text: 'Cancel',
                type: 'with-border-right',
            }, {
                text: 'Log Out',
                type: 'button-positive',
                onTap: function (e) {
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $ionicHistory.nextViewOptions({
                        disableBack: true,
                        historyRoot: true
                    });

                    delete $window.localStorage.satellizer_token; // delete token
                    delete $window.localStorage.user; // delete user information

                    $location.path('/login-recent');
                }
            }]
        });
    }

    // show popup error internal
    $rootScope.internalError = function (param) {

        if(!param || (param && param.hideLoading)) {
            $ionicLoading.hide();
        }
        $ionicPopup.alert({
            title: 'Internal server error',
            template: 'We are sorry, it seems there is a problem with our servers. Please try your request again in a moment.'
        });
    };

    // force enter to login username
    $rootScope.addNewAccount = function(){
        $rootScope.forceToLogin = true;
        $location.path('/login');
    }

    // Load image
    $rootScope.loadImg = function(image) {
        if (image) {
            $http.get(constant.API_URL + 'images/' + image, {
                responseType: 'arraybuffer'
            })
            .then(function (response) {
                var imageBlob = new Blob([response.data], {type: response.headers('Content-Type')});
                $rootScope.profilePicture = (window.URL || window.webkitURL).createObjectURL(imageBlob);
            }).catch(function (response) {
                $ionicPopup.alert({
                    title: 'Internal server error',
                    template: 'We are sorry, it seems there is a problem with our servers. Please try your request again in a moment.'
                });
            });
        } else {
            $rootScope.profilePicture = '';
        }
    };

    // get logged user
    $rootScope.loadCurrentUser = function () {
        $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));

        // set image user, if data is exists
        if($rootScope.currentUser) {
            $rootScope.loadImg($rootScope.currentUser.profile_picture);
        }
    };

    // val logged user
    $rootScope.valLoggedUser = function () {
        $rootScope.absenLoading();
        $http.get(constant.API_URL+'get-logged-user')
            .then(function(response){
                $ionicLoading.hide();
                if(response.data.status == constant.OK) {
                    // Set data user to local storage
                    localStorage.setItem('user', JSON.stringify(response.data.data));

                    // set check status
                    localStorage.setItem('checkStatus', response.data.checkStatus);
                    $rootScope.statusabsen = localStorage.checkStatus;

                    // load current status
                    $rootScope.loadCurrentUser();
                } else {

                    if(localStorage && localStorage.user_lists) {
                        $location.path('login-recent');
                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                            historyRoot: true
                        });
                    } else {
                        $location.path('login');
                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                            historyRoot: true
                        });
                    }
                }
            }).catch(function(response){
            $ionicLoading.hide();
            if(response==null || response.statusText == constant.UNAUTHORIZED) {
                if(localStorage && localStorage.user_lists) {
                    $location.path('login-recent');
                    $ionicHistory.nextViewOptions({
                        disableBack: true,
                        historyRoot: true
                    });
                } else {
                    $location.path('login');
                    $ionicHistory.nextViewOptions({
                        disableBack: true,
                        historyRoot: true
                    });
                }
            } else {
                $rootScope.internalError({hideLoading : false});
            }
        });
    };

    $rootScope.absenLoading = function () {
        $ionicLoading.show(
            {
                templateUrl : 'loading.html'
            }
        );
    }

    /**
     * End prepare all global function
     */

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {

            if(toState.tab) {
                $rootScope.tab = toState.tab;
            } else {
                $rootScope.tab = false;
            }

            if(toState.url) {
                $rootScope.page = toState.url.substr(1,toState.url.lenght);
            } else {
                $rootScope.page = '';
            }

            var updateClock = function () {
                $rootScope.clock = new Date();
            };

            setInterval(function () {
                $rootScope.$apply(updateClock);
            }, 1000);

    });

})
.constant('constant', {
    API_URL : 'http://192.168.0.168:8000/api/',
    OK : 'OK',
    UNAUTHORIZED : 'Unauthorized',
    CHECK_IN : 'I',
    CHECK_OUT : 'O'
})
.config(function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider, $ionicConfigProvider, constant) {

    $authProvider.loginUrl = constant.API_URL+'login';

    $ionicConfigProvider.tabs.position('bottom');

    $httpProvider.interceptors.push(function($q) {
        return {
            'request': function(config) {
                 return config;
            },
         
            'response': function(response) {
                return response;
            }
        };
    });

    $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'AuthUserCtrl'
    })

    .state('login-recent', {
        url: '/login-recent',
        templateUrl: 'templates/login-recent-account.html',
        controller: 'AuthRecentUserCtrl'
    })

    .state('login-password', {
        url: '/login-password/:username',
        templateUrl: 'templates/login-password.html',
        controller: 'AuthPassCtrl'
    })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html'
    })

    .state('app.home', {
        url: '/home',
        tab: true,
        views: {
            'home-tab': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })

    .state('app.recent', {
        url: '/recent',
        tab: true,
        views: {
            'recent-tab': {
                templateUrl: 'templates/recent.html',
                controller: 'RecentCtrl'
            }
        }
    })
    
    .state('app.notifications', {
        url: '/notifications',
        views: {
            'page': {
                templateUrl: 'templates/notifications.html',
                controller: 'NotificationsCtrl'
            }
        }
    })

    .state('app.change-password', {
        url: '/change-password',
        views: {
            'page': {
                templateUrl: 'templates/change-password.html',
                controller: 'ChangePasswordCtrl'
            }
        }
    })

    .state('app.edit-profile', {
        url: '/edit-profile',
        views: {
            'page': {
                templateUrl: 'templates/edit-profile.html',
                controller: 'EditProfileCtrl'
            }
        }
    })

    .state('app.report', {
        url: '/report',
        views: {
            'page': {
                templateUrl: 'templates/report.html',
                controller: 'ReportCtrl'
            }
        }
    })

    .state('app.sub-page', {
        url: '/sub-page/:name',
        views: {
            'menuContent': {
                templateUrl: 'templates/sub-page.html',
                controller: 'SubPageCtrl'
            }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('app/home');
});
