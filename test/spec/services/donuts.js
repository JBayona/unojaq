'use strict';

describe('Service: donuts', function () {

  // load the service's module
  beforeEach(module('vestaParkingApp'));

  // instantiate service
  var donuts;
  beforeEach(inject(function (_donuts_) {
    donuts = _donuts_;
  }));

  it('should do something', function () {
    expect(!!donuts).toBe(true);
  });

});
