angular.module('absensiApp', ['ionic', 'satellizer'])

.run(function($ionicPlatform, $rootScope, $window, $location) {
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
    });

    $rootScope.logout = function(){
        $window.localStorage.clear();
        $location.path('/');
    }

})

.config(function($stateProvider, $urlRouterProvider, $authProvider, $httpProvider) {
    
    $authProvider.loginUrl = 'http://localhost:8000/api/login';

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
        controller: 'AuthCtrl'
    })

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html'
    })

    .state('app.home', {
        url: '/home',
        views: {
            'menuContent': {
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            }
        }
    })
    
    .state('app.page', {
        url: '/page',
        views: {
            'menuContent': {
                templateUrl: 'templates/page.html',
                controller: 'PageCtrl'
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
    $urlRouterProvider.otherwise('/login');
});
