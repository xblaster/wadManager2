'use strict';

angular.module('v9App')
  .controller('EntryEditCtrl', function ($scope, $http, $window, $routeParams) {
    /*$http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });*/

  if ($routeParams.entryId) {
    $http.get('/rest/balanceentry/'+$routeParams.entryId).success(function(entry) {
      $scope.entry = entry.payload;
      $scope.entry.date = moment($scope.entry.date).format('YYYY/MM/DD');
      $scope.entry.tags =  _.reduce($scope.entry.tags, function(memo, num){ return memo +","+num; }, "")
          .replace(",",""); //Remove the first ","
    });
  }

  $scope.save = function(elt) {
  	$scope.saveInProgress = true;

  	elt.amount = (""+elt.amount).replace(",",".");

    //transform tags
    if (elt.tags.trim().length==0) {
      elt.tags = []; 
    }else {
      elt.tags = _.map(elt.tags.split(","), function(e) {return e.trim()}) ;  
    }

  	$http.post('/entry/save', elt).success(function() {
      $scope.saveInProgress = false;
      $window.history.back();
    });
  }
  

  $('.datepicker').pickadate({
    monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    today: 'aujourd\'hui',
    clear: 'effacer',
    format: 'yyyy/mm/dd',
    formatSubmit: 'yyyy/mm/dd'
  })

  });