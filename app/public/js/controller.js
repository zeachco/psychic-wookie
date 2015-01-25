var app = angular.module('helper', []);

app.controller('mapCtrl', ['$scope', 'Factory', function($scope, Factory) {
  $scope.tiles = [];
  $scope.events = [];
  $scope.user = '';

  $scope.$watch('selectedTile', function() {
    console.log(arguments);
  });

  $scope.triggerTrap = function(){
    console.log(this, arguments);
  };

  window.selectTile = function(clicked) {
    console.log('angular', this, clicked.id);
    $scope.selectedTile = null;
    $scope.tiles.forEach(function(d) {
      if (d.id == clicked.id) {
        $scope.selectedTile = d;
      }
    });
  };

  Factory.getMaze(function(data) {
    $scope.tiles = data;
    updateMap(data);
  });

  $scope.sendMsg = function() {

    if (!$scope.user) {
      $scope.user = $scope.message;
      $scope.message = ' I just connected';
      $scope.enableChat = false;
    }

    Factory.sendMsg($scope.user, $scope.message, function() {
      $scope.enableChat = true;
      $scope.message = '';
    });

  };

  function fetchEvents(data) {
    $scope.events = data;

    if (data.maze) {
      Factory.getMaze(function(data) {
        $scope.tiles = data;
        updateMap(data);
      });
    }

    setTimeout(function() {
      Factory.getEvents(fetchEvents);
    }, 1);

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
      }).error(function(data) {
        setTimeout(function() {
          callback(data);
        }, 1000);
      });
    },
    sendMsg: function(user, msg, callback) {
      $http.post('message', {
        user: user,
        message: msg
      }).success(function(data) {
        callback(data);
      }).error(function(data) {
        callback(data);
      });
    }
  };
}

app.factory('Factory', ['$http', Factory]);
