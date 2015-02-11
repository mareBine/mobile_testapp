/**
 * Created by mare on 2.1.2015.
 *
 * za google maps v3 (html) + prikaz trenutne pozicije
 */
angular.module('starter.controllers').controller('MapCtrl', MapCtrl);
function MapCtrl($scope, $ionicLoading, $ionicPlatform, $cordovaGeolocation) {

    // za inicializacijo google maps api (web)
    google.maps.event.addDomListener(document.getElementById("map"), 'load', initialize());
    //google.maps.event.addDomListener(window, 'load', initialize());

    $scope.settings = {
        trackPosition: false,
        watcherCalled: 0
    };

    /**
     * f. za inicializacijo google maps
     */
    function initialize() {
        console.log("initialize->Google.maps.event.addDomListener");
        var myLatlng = new google.maps.LatLng(46.3000, 15.4833);
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            draggable: true
        };

        //console.log(mapOptions);
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        $scope.map = map;
    }

    /**
     * dobi trenutno pozicijo
     * $cordovaGeolocation.getCurrentPosition
     * enableHighAccuracy: true     zato da vklopi gps na device
     *
     * @param map   vstopa map, zato da ve kam ga premaknit, ko dobi pozicijo
     */
    $scope.getCurrentPosition = function (map) {

        //$scope.output = {};
        //$scope.konzola = 'getCurrentPosition';

        $ionicLoading.show({
            template: 'Iščem lokacijo ...',
            showBackdrop: true      // da zafada ozadje ko je napis loading
        });

        var posOptions = {timeout: 10000, enableHighAccuracy: true};

        $ionicPlatform.ready(function () {
            $cordovaGeolocation.getCurrentPosition(posOptions).then(function (pos) {
                //navigator.geolocation.getCurrentPosition(function (pos) {
                console.log('getCurrentPosition->success');

                map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
                var myLocation = new google.maps.Marker({
                    position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                    map: map,
                    title: "My Location"
                });

                $ionicLoading.hide();

            }, function (error) {
                console.log('getCurrentPosition->error', error);
                $ionicLoading.hide();

            }, { enableHighAccuracy: true });
        });

    }

    /**
     * watcher za spremembo na checkboxu trackPosition
     * navigator.geolocation.watchPosition
     */
    $scope.$watch('settings.trackPosition', function () {
        console.log('trackPosition = ' + $scope.settings.trackPosition);

        if ($scope.settings.trackPosition == true) {
            console.log('trackPosition->track');

            $ionicLoading.show({
                template: 'Iščem ...',
                showBackdrop: true
            });

            $scope.watchid = navigator.geolocation.watchPosition(
                function (success) {
                    console.log(success.coords);

                    $scope.map.setCenter(new google.maps.LatLng(success.coords.latitude, success.coords.longitude));
                    var myLocation = new google.maps.Marker({
                        position: new google.maps.LatLng(success.coords.latitude, success.coords.longitude),
                        map: $scope.map,
                        title: "My Location"
                    });
                    $scope.settings.watcherCalled += 1;

                    $ionicLoading.hide();
                },
                function (error) {
                    console.log('watchPosition->error' + error);
                    $ionicLoading.hide();

                },
                { timeout: 10000 }
            );


        } else {
            console.log('trackPosition->clearWatch');
            navigator.geolocation.clearWatch($scope.watchid);
        }

    });


}
