'use strict';

/**
 * @ngdoc service
 * @name vestaParkingApp.material
 * @description
 * # material
 * Service in the vestaParkingApp.
 */
angular.module('vestaParkingApp') //We use the material design, this is an angular feature
  .service('material', function () {
    return $.material;
  });
