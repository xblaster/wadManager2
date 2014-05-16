'use strict';

describe('Service: Matchservice', function () {

  // load the service's module
  beforeEach(module('v9App'));

  // instantiate service
  var Matchservice;
  beforeEach(inject(function (_Matchservice_) {
    Matchservice = _Matchservice_;
  }));

  it('should do something', function () {
    expect(!!Matchservice).toBe(true);
  });

});
