angular.module('final', [])
    .constant('apiRoot', '/api/v1')
    .controller('UsersController', function($scope, $http, apiRoot) {       
        $scope.newUser = {};
        /*
        $http.get(apiRoot + '/users')
            .then(function(response) {
                $scope.users = response.data;
            });            
        */
        
        $scope.activeStatus = "hidden";
        $scope.emailTaken = "hidden";
        $scope.saveUser = function() {
            if($scope.newUser.password == $scope.newUser.password2) {
                $http.post(apiRoot + '/users', $scope.newUser)
                .then(function(response) {
                    console.log(" res data", response.data);
                    window.location = '/profile';
                    // redirect the user and do all the session storing
                }).catch(function() {
                    $scope.emailTaken = "show";
                });
            } else {
                $scope.activeStatus = "show";
            }
            
                // .catch ?
        };
        
        //$scope.loginUser = 
        
        
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