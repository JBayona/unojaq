'use strict';

describe('Service: fifa', function () {

  // load the service's module
  beforeEach(module('vestaParkingApp'));

  // instantiate service
  var fifa;
  beforeEach(inject(function (_fifa_) {
    fifa = _fifa_;
  }));

  it('should do something', function () {
    expect(!!fifa).toBe(true);
  });

});
