'use strict';

angular.module('v9App')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': '/',
      'link': '/'
    },
    {
      'title': 'add',
      'link': '/entry/add'
    },
    {
      'title': 'upload',
      'link': '/upload'
    }
    ];
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
