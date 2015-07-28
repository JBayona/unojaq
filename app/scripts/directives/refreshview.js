'use strict';

/**
 * @ngdoc directive
 * @name vestaParkingApp.directive:refreshView
 * @description
 * # refreshView
 */
angular.module('vestaParkingApp')
  .directive('refreshView',function() {
  var noop = function(){};
  var refreshDpOnNotify = function (dpCtrl) {
    return function() {
      dpCtrl.refreshView();
    };
  };
  return {
    require: 'datepicker',
    link: function(scope,elem,attrs,dpCtrl) {
      var refreshPromise = scope[attrs.refreshView];
      refreshPromise.then(noop,noop,refreshDpOnNotify(dpCtrl));
    }
  };
});
