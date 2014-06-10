'use strict';

describe('Service: Budget', function () {

  // load the service's module
  beforeEach(module('v9App'));

  // instantiate service
  var Budget;
  beforeEach(inject(function (_Budget_) {
    Budget = _Budget_;
  }));

  it('should do something', function () {
    expect(!!Budget).toBe(true);
  });

});
