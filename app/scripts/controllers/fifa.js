'use strict';

/**
 * @ngdoc function
 * @name vestaParkingApp.controller:FifaCtrl
 * @description
 * # FifaCtrl
 * Controller of the vestaParkingApp
 */
angular.module('vestaParkingApp')
  .controller('FifaCtrl', function (Fifa) {
    Fifa.getSofifaTeam().then(function(response){
    	console.log(response);
    });
  });
