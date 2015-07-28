'use strict';

describe('Service: proxy', function () {

  // load the service's module
  beforeEach(module('vestaParkingApp'));

  // instantiate service
  var proxy;
  beforeEach(inject(function (_proxy_) {
    proxy = _proxy_;
  }));

  it('should do something', function () {
    expect(!!proxy).toBe(true);
  });

});
