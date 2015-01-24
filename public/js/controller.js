var app = angular.module('helper', []);

app.controller('mapCtrl', ['$scope', 'Factory', function($scope, Factory) {
  $scope.tiles = [];

  Factory.getMaze(function(data) {
    console.debug(data);
    $scope.tiles = data;
  });

  $scope.sendMsg = function() {
    Factory.sendMsg($scope.message, function() {
      $scope.message = '';
      console.log('ok');
    });
  };

  Factory.getMaze(function(data) {
    console.debug(data);
    $scope.tiles = data;
  });

}]);

function Factory($http) {
  return {
    getMaze: function(callback) {
      $http.get('/maze').success(function(data) {
        callback(data);
      });
    },
    sendMsg: function(msg, callback) {
      $http.post('message', {
        message: msg
      }).success(function(data) {
        callback(data);
      });
    }
  };
}

app.factory('Factory', ['$http', Factory]);
