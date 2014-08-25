var app = angular.module('setGame',[]).
  config(function($locationProvider) {
    $locationProvider.html5Mode(true);
  });

app.config(['$routeProvider', function($routeProvider){
  $routeProvider.
  when('/set', {
    templateUrl:'../templates/game.html',
    controller:'SetController'
  })
}])