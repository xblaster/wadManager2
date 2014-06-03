'use strict';

angular.module('v9App')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'comptes',
      'link': '/'
    },
    {
      'title': 'importer EXL',
      'link': '#/upload'
    }
    ];
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
