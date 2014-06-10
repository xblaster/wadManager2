'use strict';

angular.module('v9App')
  .controller('EntryEditCtrl', function ($scope, $http, $window, $routeParams) {

  if ($routeParams.entryId) {
    $http.get('/rest/balanceentry/'+$routeParams.entryId).success(function(entry) {
      $scope.entry = entry.payload;
      $scope.entry.date = moment($scope.entry.date).format('YYYY/MM/DD');
      $scope.entry.realDate = moment($scope.entry.realDate).format('YYYY/MM/DD');
      /*$scope.entry.tags =  _.reduce($scope.entry.tags, function(memo, num){ return memo +","+num; }, "")
          .replace(",",""); //Remove the first ","*/
    });
  }

  $scope.isTagPresent = function(tag) {
    return _.contains($scope.entry.tags, tag);
  }

  $scope.toggleTag = function(tag) {
    if (_.contains($scope.entry.tags, tag)) {
      $scope.entry.tags = _.without($scope.entry.tags, tag);
    } else {
      $scope.entry.tags.push(tag);
    }
  }

   $scope.tagsInfo = {}
    //retrieve tags info
   $http.get('/params/get?name=tags').success(function(result) {
      _.each(result, function(elt) {
        $scope.tagsInfo[elt.name] = elt;
      });     
    });

  $scope.save = function(elt) {
  	$scope.saveInProgress = true;

  	elt.amount = (""+elt.amount).replace(",",".");

    //transform tags
    /*if (elt.tags.trim().length==0) {
      elt.tags = []; 
    }else {
      elt.tags = _.map(elt.tags.split(","), function(e) {return e.trim()}) ;  
    }*/

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
