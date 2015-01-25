var app = angular.module('helper', []);

app.controller('mapCtrl', ['$scope', 'REST', function($scope, REST) {
  $scope.tiles = [];
  $scope.events = [];
  $scope.user = '';

  $scope.triggerTrap = function(d) {
    REST.activateTrap($scope.user, d.trapId ,function(){
      alert('you evil!');
    });
  };

  window.selectTile = function(clicked) {
    $scope.selectedTile = null;
    $scope.tiles.forEach(function(d) {
      if (d.id == clicked.id) {
        $scope.selectedTile = d;
      }
    });
  };

  REST.getMaze(function(data) {
    $scope.tiles = data;
    updateMap(data);
  });

  $scope.sendMsg = function() {

    if (!$scope.user) {
      $scope.user = $scope.message;
      $scope.message = ' I just connected';
      $scope.enableChat = false;
    }

    REST.sendMsg($scope.user, $scope.message, function() {
      $scope.enableChat = true;
      $scope.message = '';
    });

  };

  function fetchEvents(data) {
    $scope.events = data;

    if (data.maze) {
      REST.getMaze(function(data) {
        $scope.tiles = data;
        updateMap(data);
      });
    }

    setTimeout(function() {
      REST.getEvents(fetchEvents);
    }, 1);

  }
  REST.getEvents(fetchEvents);

}]);

function REST($http) {
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
    },
    activateTrap: function(user, trap, callback) {
      $http.post('trap', {
        user: user,
        id: trap
      }).success(function(data) {
        callback(data);
      }).error(function(data) {
        callback(data);
      });
    }
  };
}

app.factory('REST', ['$http', REST]);
