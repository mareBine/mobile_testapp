angular.module('starter.controllers', [])

    .controller('AppCtrl', function ($scope, $log, $ionicSideMenuDelegate, $ionicPlatform) {

        // za odpret side menu
        $scope.toggleLeftSideMenu = function () {
            console.log('AppCtrl->toggleLeftSideMenu');
            $ionicSideMenuDelegate.toggleLeft();
        };

        $ionicPlatform.ready(function () {
            $log.debug('AppCtrl -> $ionicPlatform.ready -> socket init');

            // socket #1: nastaviš, da se prijavi na socket
            io.socket.get('/user');

        });

        $scope.exit = function () {
            console.log('exitApp');
            ionic.Platform.exitApp();
        };
    })

/**
 * chats ctrl (ostalo od templatea)
 */
    .controller('ChatsCtrl', function ($scope, Chats) {
        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        }
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    });