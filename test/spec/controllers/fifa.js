'use strict';

describe('Controller: FifaCtrl', function () {

  // load the controller's module
  beforeEach(module('vestaParkingApp'));

  var FifaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FifaCtrl = $controller('FifaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FifaCtrl.awesomeThings.length).toBe(3);
  });
});
