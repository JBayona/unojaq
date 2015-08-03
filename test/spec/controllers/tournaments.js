'use strict';

describe('Controller: TournamentsCtrl', function () {

  // load the controller's module
  beforeEach(module('vestaParkingApp'));

  var TournamentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TournamentsCtrl = $controller('TournamentsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
