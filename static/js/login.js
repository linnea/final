angular.module('final', [])
    .constant('apiRoot', '/api/v1')
    .controller('LoginController', function($scope, $http, apiRoot) {       
        $scope.user = {};
        
        $scope.activeStatus = "hidden";
        $scope.loggedIn = false;
        
        $scope.loginUser = function() {
            $http.post(apiRoot + '/users/login',$scope.user)
                .then(function (res) {
                    $scope.loggedIn = true;
                    
                    // redirect the user and do all the session storing
                    window.location = '/profile';
                }).catch(function() {
                    $scope.activeStatus = "show";
                });
                // .catch login errors here and display them
        };
        
        
        $scope.increaseCurrency = function(user) {
            $http.post(apiRoot + '/users/' + (user.id || user._id) + '/currency', {currency: 1})
                .then(function(results) {
                    //results.data contains a new version of the story
                    //with the correct number of votes
                    angular.copy(results.data, user);
                });
        };
        
        $scope.getCurrency = function(user) {
            return user.votes + (1 == user.votes ? ' rupee' : ' rupees');
        };        
    });