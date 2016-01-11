'use strict';

describe('Controller: MaddenCtrl', function () {

  // load the controller's module
  beforeEach(module('vestaParkingApp'));

  var MaddenCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaddenCtrl = $controller('MaddenCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MaddenCtrl.awesomeThings.length).toBe(3);
  });
});
