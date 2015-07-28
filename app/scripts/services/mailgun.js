'use strict';

/**
 * @ngdoc service
 * @name vestaParkingApp.mailgun
 * @description
 * # mailgun
 * Service in the vestaParkingApp.
 */
angular.module('vestaParkingApp')
  .service('Mailgun',['Proxy', function (Proxy) {
    var sendEmail = function(data){
    	return Proxy.postCall(data,'https://api.parse.com/1/functions/sendEmail');
    };

    return {
    	sendEmail:sendEmail
    }
  }]);
