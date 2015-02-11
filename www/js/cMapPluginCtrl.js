/**
 * Created by mare on 5.1.2015.
 *
 * za google maps v2 (cordova plugin) + prikaz trenutne pozicije
 */
angular.module('starter.controllers').controller('MapPluginCtrl', MapPluginCtrl);
function MapPluginCtrl($scope, $ionicLoading, $ionicPlatform, $cordovaGeolocation) {

    $scope.map;

    /**
     * f. za inicializacijo google maps cordova plugin
     */
    $ionicPlatform.ready(function () {
        console.log('MapPluginCtrl->ready');

        var div = document.getElementById("map_plugin");
        $scope.map = plugin.google.maps.Map.getMap(div);
        //map.showDialog();

        $scope.map.on(plugin.google.maps.event.MAP_READY, onMapInit);
    });

    function onMapInit() {
        console.log('google map init');
    }

    $scope.settings = {
        trackPosition: false,
        watcherCalled: 0
    };


    /**
     * dobi trenutno pozicijo
     * $cordovaGeolocation.getCurrentPosition
     * enableHighAccuracy: true     zato da vklopi gps na device
     *
     * @param map   vstopa map, zato da ve kam ga premaknit, ko dobi pozicijo
     */
    $scope.getCurrentPosition = function () {
        console.log('getCurrentPosition');

        $ionicLoading.show({
            template: 'Iščem ...',
            showBackdrop: true
        });

        // pobriše vse morebitne markerje
        $scope.map.clear();
        $scope.map.off();

        $scope.map.getMyLocation(
            // zato da vklopi GPS na napravi;
            { enableHighAccuracy: true },

            // success
            function (location) {

                // dobi trenutno pozicijo
                var currentPosition = new plugin.google.maps.LatLng(location.latLng.lat, location.latLng.lng);

                // postavi marker na tej poziciji z info window
                var msg = [ "latitude:" + location.latLng.lat,
                        "longitude:" + location.latLng.lng,
                        "speed:" + location.speed,
                        "time:" + location.time,
                        "bearing:" + location.bearing].join("\n");

                $scope.map.addMarker({
                    'position': location.latLng,
                    'title': msg
                }, function (marker) {
                    marker.showInfoWindow();
                    $ionicLoading.hide();
                });

                // centrira in zumira na trenutno pozicijo
                $scope.map.moveCamera({
                    'target': currentPosition,
                    'tilt': 0,
                    'zoom': 15,
                    'bearing': 0
                }, function() {
                    console.log("The animation is done");
                });

                //$scope.map.setZoom(15);
                //$scope.map.setCenter(currentPosition);

            },

            // error
            function (error) {
                console.log("error: " + error);
                $ionicLoading.hide();

            })
    };


    /**
     * watcher za spremembo na checkboxu trackPosition
     * navigator.geolocation.watchPosition
     */
    /*
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
     //navigator.geolocation.clearWatch($scope.watchid);
     }

     });
     */


}
