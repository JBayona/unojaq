'use strict';

describe('Service: parking', function () {

  // load the service's module
  beforeEach(module('vestaParkingApp'));

  // instantiate service
  var parking;
  beforeEach(inject(function (_parking_) {
    parking = _parking_;
  }));

  it('should do something', function () {
    expect(!!parking).toBe(true);
  });

});
