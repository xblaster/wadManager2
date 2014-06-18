'use strict';

angular.module('v9App')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': '/',
      'link': '/'
    }
    ];
    
    $scope.isActive = function(route) {
      return route === "#"+$location.path();
    };
  });
