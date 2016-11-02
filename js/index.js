var app = angular.module('app', ['ngMaterial','angularGrid']);

app.controller('MainCtrl', function($scope, $http, $q) {
  var vm = this;
  var limit = 15;
  $scope.card = {};
  vm.startPage = 1;
  vm.shots = [];
  vm.loadingMore = false;

  vm.loadMoreShots = function() {

    if(vm.loadingMore || !vm.startPage) return;
	
    vm.loadingMore = true;
    var promise = $http.get('https://ej82jnn016.execute-api.us-east-1.amazonaws.com/dev/get-DDB-data' + "/" + limit + "/" + vm.startPage);
    promise.then(function(data) {
      var payload = data.data
	  var itemData = payload.hasOwnProperty('Item')  ? payload.Item :  payload.hasOwnProperty('Items') ? payload.Items : payload; 
	  
      var shotsTmp = angular.copy(vm.shots);
      shotsTmp = shotsTmp.concat(itemData);
      vm.shots = shotsTmp;
	  vm.loadingMore = false;
	  
	  if (payload.hasOwnProperty('LastEvaluatedKey')) {
      	vm.startPage = payload.LastEvaluatedKey.id;
	  } else {
	  	vm.startPage = false;
	  }

    }, function() {
      vm.loadingMore = false;
    });
    return promise;
  };

  vm.loadMoreShots();

});
app.filter('unsafe', function($sce) { return $sce.trustAsHtml; });
