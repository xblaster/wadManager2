'use strict';

angular.module('v9App')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'comptes',
      'link': '/'
    },
    {
      'title': 'parametres',
      'link': '#/settings'
    },
        {
            'title': 'overview',
            'link': '#/overview'
        },
    {
      'title': 'importer EXL',
      'link': '#/upload'
    }
    ];
    
    $scope.isActive = function(route) {
      return route === "#"+$location.path();
    };
  });
