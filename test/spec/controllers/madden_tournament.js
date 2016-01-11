'use strict';

describe('Controller: MaddenTournamentCtrl', function () {

  // load the controller's module
  beforeEach(module('vestaParkingApp'));

  var MaddenTournamentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaddenTournamentCtrl = $controller('MaddenTournamentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(MaddenTournamentCtrl.awesomeThings.length).toBe(3);
  });
});
