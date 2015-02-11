/**
 * ListCtrl
 */
angular.module('starter.controllers').controller('ListCtrl', ListCtrl);
function ListCtrl($scope, $ionicPlatform, $log, Lists, Utility) {

    $scope.listData = Lists.ListsData;      // navezava na factory
    $scope.removeItem = removeItem;
    $scope.addItem = addItem;

    activate();

    function activate() {
        $log.debug('ListCtrl -> activate');

        $ionicPlatform.ready(function () {

            // socket #2: nastaviš kaj naredi ko dobi odgovor preko socketa
            io.socket.on('user', function (obj) {
                $log.debug('io.socket.on user: ', obj);
                if (obj.verb === 'created') {
                    $scope.listData.getAllData.push(obj.data);
                    $scope.$digest();
                } else if (obj.verb === 'destroyed') {
                    Utility.removeJSONitemByPropertyValue($scope.listData.getAllData, 'id', obj.id);
                    $scope.$digest();
                }
            });
        });

        Lists.getAllData();
    }

    /**
     * f. za testiranje socketa preko sails
     */
    function addItem() {
        $log.info('ListCtrl->socketData');

        Lists.addItem({username: 'api', password: 'api'});

        // post preko socketa; se ne rabi preko socketa klicat, ker sails sam poskrbi zato
        // io.socket.post('/user/?username=socket&password=socket');
    }

    // remove - pobriše item iz baze
    function removeItem(listId) {

        Lists.removeItem(listId);

        // delete preko socketa; se ne rabi preko socketa klicat, ker sails sam poskrbi zato
        // io.socket.delete('/user/' + listId);
    }
}

/**
 * ListDetailCtrl
 */
angular.module('starter.controllers').controller('ListDetailCtrl', ListDetailCtrl);
function ListDetailCtrl($scope, $stateParams, $log, Lists) {

    $scope.listDetail = Lists.ListsData;        // navezava na factory

    activate();

    function activate() {
        $log.debug('ListDetailCtrl -> activate');
        Lists.getItem($stateParams.listId);
    }
}