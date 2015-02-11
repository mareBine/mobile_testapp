// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'ngResource'])

    .run(function ($ionicPlatform, configVars) {

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $logProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })

            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('tab.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                }
            })
            .state('tab.list', {
                url: '/list',
                views: {
                    'tab-list': {
                        templateUrl: 'templates/tab-list.html',
                        controller: 'ListCtrl'
                    }
                }
            })
            .state('tab.list-detail', {
                url: '/list/:listId',
                views: {
                    'tab-list': {
                        templateUrl: 'templates/list-detail.html',
                        controller: 'ListDetailCtrl'
                    }
                }
            });

//            .state('tab.camera', {
//                url: '/camera',
//                views: {
//                    'tab-camera': {
//                        templateUrl: 'templates/tab-camera.html',
//                        controller: 'CameraCtrl'
//                    }
//                }
//            })
//
//            .state('tab.gmaps', {
//                url: '/gmaps',
//                views: {
//                    'tab-gmaps': {
//                        templateUrl: 'templates/tab-gmaps.html',
//                        controller: 'MapPluginCtrl'
//                    }
//                }
//            })
//
//            .state('tab.maps', {
//                url: '/maps',
//                views: {
//                    'tab-maps': {
//                        templateUrl: 'templates/tab-maps.html',
//                        controller: 'MapCtrl'
//                    }
//                }
//            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/dash');

        // za angular $log, enable/disable
        $logProvider.debugEnabled(true);

        // nastavitve za $http service | se niti ne rabi, če je cors na node/express strani
        //$httpProvider.defaults.url = 'http://127.0.0.1:8080/api';
        //$httpProvider.defaults.useXDomain = true;
        //delete $httpProvider.defaults.headers.common['X-Requested-With'];

    })

    /**
     *  definicija konfiguracijskih spremenljivk
     */
    .value('configVars', {
        //'apiUrl': 'http://127.0.0.1:8080'       // url:port kjer se nahajajo apiji
        'apiUrl': 'http://10.0.34.12:1337'       // url:port kjer se nahajajo apiji
    });
