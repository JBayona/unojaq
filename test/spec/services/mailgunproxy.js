'use strict';

describe('Service: mailgunProxy', function () {

  // load the service's module
  beforeEach(module('vestaParkingApp'));

  // instantiate service
  var mailgunProxy;
  beforeEach(inject(function (_mailgunProxy_) {
    mailgunProxy = _mailgunProxy_;
  }));

  it('should do something', function () {
    expect(!!mailgunProxy).toBe(true);
  });

});
