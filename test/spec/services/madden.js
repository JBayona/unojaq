'use strict';

describe('Service: madden', function () {

  // load the service's module
  beforeEach(module('vestaParkingApp'));

  // instantiate service
  var madden;
  beforeEach(inject(function (_madden_) {
    madden = _madden_;
  }));

  it('should do something', function () {
    expect(!!madden).toBe(true);
  });

});
