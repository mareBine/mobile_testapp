/**
 * Created by mare on 2.1.2015.
 *
 * factory za razne utility funkcije
 */
angular.module('starter.services').factory('Utility', Utility);
function Utility() {

    var factory = {
        dateFormat: dateFormat,
        removeJSONitemByPropertyValue: removeJSONitemByPropertyValue
    };

    return factory;

    /////////////////////////

    /**
     * formatira datum na dd.MM.YYYY HH:mm:ss
     *
     * @param date  {Date}
     * @returns {string}
     */
    function dateFormat(date) {

        //Grab each of your components
        var yyyy = date.getFullYear().toString();
        var MM = (date.getMonth() + 1).toString();
        var dd = date.getDate().toString();
        var hh = date.getHours().toString();
        var mm = date.getMinutes().toString();
        var ss = date.getSeconds().toString();

        //Returns your formatted result
        return (dd[1] ? dd : "0" + dd[0]) + '.' + (MM[1] ? MM : "0" + MM[0]) + '.' + yyyy + ' '
            + (hh[1] ? hh : "0" + hh[0]) + ':' + (mm[1] ? mm : "0" + mm[0]) + ':' + (ss[1] ? ss : "0" + ss[0]);

    }

    /**
     * funkcija, ki iz JSON pobriše določen element, glede na vrednost elementa; glej primer:
     *
     * @param json          [ { id: 1, ime: 'test'} , {id: 2, ime: 'lepo'} ]
     * @param property      'id'
     * @param value         2
     *
     * @returns {*}        pobriše objekt {id: 2, ime: 'lepo'}
     */
    function removeJSONitemByPropertyValue(json, property, value) {
        var c, found=false;
        for(c in json) {
            if(json[c][property] == value) {
                found=true;
                break;
            }
        }
        if(found){
            //console.log('removeJSONitemByPropertyValue: ', json[c])
            json.splice(c, 1);
        }
    }
}