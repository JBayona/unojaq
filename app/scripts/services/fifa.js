'use strict';

/**
 * @ngdoc service
 * @name vestaParkingApp.fifa
 * @description
 * # fifa
 * Service in the vestaParkingApp.
 */
angular.module('vestaParkingApp')
  .service('Fifa', function (Proxy) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.getSofifaTeam = function(){
    	return Proxy.getExternalCall('http://www.football-data.org/soccerseasons/',{},{'X-Auth-Token':'9f2c369f8b8e491b8bd0494d6c9b45d9'})
    };
  });
