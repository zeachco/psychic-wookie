var app = angular.module('helper', []);

app.controller('mapCtrl', ['$scope', 'Factory', function($scope, Factory) {
  $scope.tiles = [];
  $scope.events = [];

  Factory.getMaze(function(data) {
    console.debug(data);
    $scope.tiles = data;
  });

  $scope.sendMsg = function() {
    Factory.sendMsg($scope.message, function() {
      $scope.message = '';
    });
  };

  function fetchEvents(data){
    $scope.events = data;
    if(data.maze) { 
      Factory.getMaze(function(data) {
        console.debug(data);
        $scope.tiles = data;
      });
    }

    setTimeout(function(){
      Factory.getEvents(fetchEvents);
    },1);
  }
  Factory.getEvents(fetchEvents);

}]);

function Factory($http) {
  return {
    getMaze: function(callback) {
      $http.get('/maze').success(function(data) {
        callback(data);
      });
    },
    getEvents: function(callback) {
      $http.get('/events').success(function(data) {
        callback(data);
      }).error(function(data){
        setTimeout(function(){
          callback(data);
        }, 1000);
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
