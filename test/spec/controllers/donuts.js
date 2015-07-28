'use strict';

describe('Controller: DonutsCtrl', function () {

  // load the controller's module
  beforeEach(module('vestaParkingApp'));

  var DonutsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DonutsCtrl = $controller('DonutsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
