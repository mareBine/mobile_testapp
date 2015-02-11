/**
 * Created by mare on 2.1.2015.
 *
 * dashboard controller
 * - wifi scanner
 * - network info
 * - device info
 */

angular.module('starter.controllers').controller('DashCtrl', DashCtrl);
function DashCtrl($scope, $log, $ionicPlatform, $ionicLoading, Utility) {

    $scope.wifiscanner = {};
    $scope.networkstatus = null;
    $scope.watchid = null;
    $scope.settings = {
        trackWifi: false
    };

    /**
     *  dobi podatke o napravi
     */
//    $scope.devicedata = {};
//    $scope.devicedata.platform = ionic.Platform.platform();
//    $scope.devicedata.version = ionic.Platform.version();
//    $scope.devicedata.isWebView = ionic.Platform.isWebView();
//    $scope.devicedata.isAndroid = ionic.Platform.isAndroid();
//    $scope.devicedata.isIOS = ionic.Platform.isIOS();


    // dummy podatki, ko testiraš v browserju
    if (ionic.Platform.platform() == 'win32') {
        $scope.wifiscanner = [
            {BSSID: "90:30:42:34:g5:a6", SSID: "hlooom", level: 62},
            {BSSID: "11:30:42:33:12:g6", SSID: "mojstrana", level: 77}
        ];
        $scope.wifitime = Utility.dateFormat(new Date());
    }


    /**
     * za podrobnosti o wifi access pointih
     * dodat plugin: nl.nielsad.cordova.wifiscanner
     *
     * @note: deluje samo na deviceu
     *
     */
    $scope.getWifiAccessPoints = function () {

        $log.info('getWifiAccessPoints->navigator.wifi');

        $ionicLoading.show({
            template: 'Iščem ...',
            showBackdrop: true      // da zafada ozadje ko je napis loading
        });

        $ionicPlatform.ready(function () {

            navigator.wifi.getAccessPoints(function (success) {
                console.log('getAccessPoints->success', success);
                $scope.wifitime = Utility.dateFormat(new Date());
                $scope.wifiscanner = success;
                $ionicLoading.hide();
            }, function (error) {
                console.log('getAccessPoints->error', error);
                $scope.wifitime = Utility.dateFormat(new Date());
                $scope.wifiscanner = new Array();
                $scope.wifiscanner[0] = {
                    BSSID: error.message
                };
                $ionicLoading.hide();
            });
        });
    };

    /**
     * za intervalno skeniranje wifi
     */
    $ionicPlatform.ready(function () {

        $scope.$watch('settings.trackWifi', function () {

            if ($scope.settings.trackWifi == true) {
                console.log('trackWifi->track');

                $ionicLoading.show({
                    template: 'Iščem ...',
                    showBackdrop: true
                });

                $scope.watchid = navigator.wifi.watchAccessPoints(
                    function (success) {
                        console.log('watchAccessPoints->success', success);
                        $scope.wifitime = Utility.dateFormat(new Date());
                        $scope.wifiscanner = success;
                        // TODO: zapisat rezultat skeniranja v bazo

                        $ionicLoading.hide();
                    },
                    function (error) {
                        console.log('watchAccessPoints->error', error);
                        $scope.wifitime = Utility.dateFormat(new Date());
                        $scope.wifiscanner = new Array();
                        $scope.wifiscanner[0] = {
                            BSSID: error.message
                        };
                        //$scope.settings.trackWifi = false;
                        //navigator.wifi.clearWatch($scope.watchid);
                        $ionicLoading.hide();
                    },
                    { frequency: 5000 }
                );

            } else {
                console.log('trackWifi->clearWatch');
                navigator.wifi.clearWatch($scope.watchid);
            }
        });

    });

    /**
     * za dobit stanje omrežja (wifi, 3g, ...)
     * treba dodat plugin: org.apache.cordova.network-information
     *
     * @note: deluje samo na deviceu
     */
    //$ionicPlatform.ready(function () {
    /*
     $scope.getNetworkInfo = function () {
     //$scope.networkstatus = 'iskanje ...';

     if (ionic.Platform.platform() != 'win32') {
     console.log('navigator.connection.type');

     var networkState = navigator.connection.type;

     var states = {};
     states[Connection.UNKNOWN] = 'Unknown connection';
     states[Connection.ETHERNET] = 'Ethernet connection';
     states[Connection.WIFI] = 'WiFi connection';
     states[Connection.CELL_2G] = 'Cell 2G connection';
     states[Connection.CELL_3G] = 'Cell 3G connection';
     states[Connection.CELL_4G] = 'Cell 4G connection';
     states[Connection.CELL] = 'Cell generic connection';
     states[Connection.NONE] = 'No network connection';

     console.log('Connection type: ' + states[networkState]);
     $scope.networkstatus = states[networkState];
     } else {
     $scope.networkstatus = 'only works on mobile';

     }

     };
     */

}