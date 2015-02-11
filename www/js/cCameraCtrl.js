/**
 * Created by mare on 2.1.2015.
 */
angular.module('starter.controllers').controller('CameraCtrl', CameraCtrl);
function CameraCtrl($scope, $cordovaCamera) {

    /**
     * za slikat s kamero
     * dodat plugin: org.apache.cordova.camera
     *
     * @note: deluje samo na deviceu
     */
    $scope.takePictureCamera = function () {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };

        $cordovaCamera.getPicture(options).then(function (imageData) {
            console.log('getPicture->success');
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;
        }, function (err) {
            console.log('getPicture->error');
        });
    };

}