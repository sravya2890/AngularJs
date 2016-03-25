(function() {
  var app = angular.module("githubViewer", []);
  var MainController = function($scope, $http, $interval, $log, $anchorScroll, $location) {

    var onUserComplete = function(response) {
      $scope.user = response.data;
      $http.get($scope.user.repos_url)
        .then(onRepos);
        $scope.error = null;
    };

    var onError = function(reason) {
      $scope.error = "could not fetch user info"
    };

    var onRepos = function(response) {
      $scope.repos = response.data;
      $location.hash("userdetails");
      $anchorScroll();
    };

    var decrementCountdown = function(){
      $scope.countdown -= 1;
      if($scope.countdown < 1){
        $scope.search($scope.username);
      }
    };
    
    var countdownInterval = null;
    var startCountdown = function(){
     countdownInterval = $interval(decrementCountdown, 1000, 5);
    };

    $scope.search = function(username) {
      $log.info("searching for " + username);
      $http.get("https://api.github.com/users/" + username)
        .then(onUserComplete, onError);
        if(countdownInterval){
          $interval.cancel(countdownInterval);
          $scope.countdown = null;
        }
    };
    



    $scope.username = "angular";
    $scope.message = "Hi, GitHub Viewer!";
    $scope.countdown = 5;
    startCountdown();
  };

  app.controller("MainController", MainController);

}());