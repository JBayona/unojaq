'use strict';

describe('Directive: refreshView', function () {

  // load the directive's module
  beforeEach(module('vestaParkingApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<refresh-view></refresh-view>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the refreshView directive');
  }));
});
