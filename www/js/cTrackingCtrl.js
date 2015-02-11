/**
 * Created by mare on 2.1.2015.
 *
 * controller za tracking pozicije in prikaz na google maps
 */
angular.module('starter.controllers').controller('TrackingCtrl', TrackingCtrl);
function TrackingCtrl($scope, $ionicLoading) {

    google.maps.event.addDomListener(document.getElementById("map_tracking"), 'load', initialize());

    $scope.settings = {
        trackPosition: false
    };

    /**
     * f. za inicializacijo google maps
     */
    function initialize() {
        console.log("TrackingCtrl->initialize->Google.maps.event.addDomListener");

        var myLatlng = new google.maps.LatLng(46.3000, 15.4833);
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            draggable: true
        };

        //console.log(mapOptions);
        var map = new google.maps.Map(document.getElementById("map_tracking"), mapOptions);

        //map.setOptions({draggable: true});

        //getCurrentPosition(map);

        $scope.map = map;
    }

    /**
     * watcher za spremembo na checkboxu trackPosition
     */
    $scope.$watch('settings.trackPosition', function () {
        console.log('trackPosition = ' + $scope.settings.trackPosition);

        if ($scope.settings.trackPosition == true) {
            console.log('trackPosition->track');

            $ionicLoading.show({
                template: 'Iščem lokacijo ...',
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

                    $ionicLoading.hide();

                },
                function (error) {
                    console.log('watchPosition->error' + error);
                    $ionicLoading.hide();

                },
                { timeout: 10000 }
            );

            $scope.settings.watcherCalled += 1;

        } else {
            console.log('trackPosition->clearWatch');
            navigator.geolocation.clearWatch($scope.watchid);
        }

    });

}