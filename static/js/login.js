angular.module('final', [])
    .constant('apiRoot', '/api/v1')
    .controller('LoginController', function($scope, $http, apiRoot) {       
        $scope.user = {};
        
        $scope.loginUser = function() {
            $http.post(apiRoot + '/users/login', $scope.user)
                .then(function(response) {
                    window.location = '/profile';
                    // redirect the user and do all the session storing
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