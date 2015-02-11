/**
 * factory za Lists
 * - za dobit podatke uporablja angular $resource
 *  - navezava na REST api (nodejs, express)
 * - dobljene podatke piše na factory objekt ListsData, ki je povezan na scope v kontrolerjih
 */
angular.module('starter.services').factory('Lists', Lists);
function Lists($resource, $ionicLoading, $log, configVars, Utility) {

    var ListsData = {};
    //var ListsApi = $resource(configVars.apiUrl + '/api/users/:id');       //sequelize-restful
    //var ListsApi = $resource(configVars.apiUrl + '/rest/users/:id');        //epilogue
    var ListsApi = $resource(configVars.apiUrl + '/user/:id');              // sailsjs

    var factory = {
        ListsData: ListsData,
        getAllData: getAllData,
        getItem: getItem,
        removeItem: removeItem,
        addItem: addItem
    };

    return factory;

    ///////////////

    /**
     * dobi vse podatke iz tabele users
     */
    function getAllData() {
        $ionicLoading.show({
            template: 'Load ...',
            showBackdrop: true      // da zafada ozadje ko je napis loading
        });

        // če je /api (sequelize-restful), potem se uporabi get (pričakuje object, query pričakuje array)
//        ListsApi.get(function (data) {
//            $log.debug('ListsFactory->getAllData', data);
//            ListsData.getAllData = data.data;
//            $ionicLoading.hide();
//        });

        // epilogue
//        ListsApi.query({sort: 'username'}, function (data) {
//            $log.debug('ListsFactory->getAllData', data);
//            ListsData.getAllData = data;
//            $ionicLoading.hide();
//        });

        // sails
        ListsApi.query({sort: 'username'}, onSuccess, onError);
        function onSuccess(data) {
            $log.debug('ListsFactory->getAllData', data);
            ListsData.getAllData = data;
            $ionicLoading.hide();
        }
        function onError(error) {
            $log.debug('ListsFactory->getAllData', error);
            ListsData.getAllData = new Array({ id: 'connection error' });
            $ionicLoading.hide();
        }
    }

    /**
     * dobi en podatek iz tabele users
     * @param listId
     */
    function getItem(listId) {
        $ionicLoading.show({
            template: 'Load ...',
            showBackdrop: true      // da zafada ozadje ko je napis loading
        });

        ListsApi.get({id: listId}, onSuccess, onError);
        function onSuccess(data) {
            $log.debug('ListsFactory -> Lists.get(' + listId + ')', data);
            //ListsData.getItem = data.data;
            ListsData.getItem = data;
            $ionicLoading.hide();
        }
        function onError(error) {
            $log.debug('ListsFactory -> Lists.get(' + listId + '), ERROR: ', error);
            ListsData.getItem = { id: error.data };
            $ionicLoading.hide();
        }
    }

    /**
     * odstrani en podatek iz tabele users
     * @param listId
     */
    function removeItem(listId) {
        ListsApi.delete({id: listId}, onSuccessOrError, onSuccessOrError);
        // skupna f., zato da v vsakem primeru odstrani item
        function onSuccessOrError() {
            Utility.removeJSONitemByPropertyValue(ListsData.getAllData, 'id', listId);
            $log.debug('ListsFactory -> removeItem(' + listId + ')');
        }
    }

    /**
     * doda en podatek v tabelo users
     * @param listId
     */
    function addItem(data) {
        ListsApi.save(data, onSuccess, onError);
        function onSuccess() {
            //ListsData.getAllData.push(data);
            $log.debug('ListsFactory -> addItem()', data);
        }

        function onError() {
        }
    }
}