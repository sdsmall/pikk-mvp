// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var pikkApp = angular.module('starter', ['ionic','ionic.native','ui.router','ngStorage']);

pikkApp.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileController'
    })
    .state('welcome', {
      url: '/welcome',
      templateUrl: 'templates/welcome.html',
      controller: 'WelcomeController'
    });
  $urlRouterProvider.otherwise('/login');
});

pikkApp
.controller("LoginController", function($http, $q, $scope, $ionicPopup, $state, DbUserService, LocalUserService, GooglePlusUserService) {
  $scope.userData;
    
  $scope.login = function () {
    console.log('login button pressed');
    
    GooglePlusUserService.login()
        .then(function(response){
            //logged in -> response = Google+ user id info
            console.log('back in controller, response: '+response);
            //parse results, store in localstorage, grab user
            var user = LocalUserService.login(response);
        
            //put user in db, state.go dependent on new/existing
            DbUserService.login(user)
                .then(function(response){
                    console.log(response);
                    if(response.newUser){
                        $state.go('welcome');
                    } else{
                        $state.go('profile');
                    }
                }).catch(function(){
                    throw 'DbUserService login call error';
                });
        
        }).catch(function(){
            throw 'GooglePlusUserService login call error';
        });
  };
    
    $scope.testClick = function() {
    console.log('test clicked');
  };
})


.controller("ProfileController", function($scope) {
})

.controller("WelcomeController", function($scope){
    
});

pikkApp.factory('DbUserService', function($http, $q){
    return {
        login: function(user){
            var url = "http://localhost:3000/login";
            return $http.put(url,user)
                .then(function(response){
                    console.log(response);
                    return response.data;
                }, function(error){
                    return $q.reject(error);
                });
        }
    };
});

pikkApp.factory('LocalUserService', function($localStorage){
    return {
        login: function(userData){
            
            var user = {
                userID: userData.userId,
                name: userData.displayName,
                email: userData.email
            };
            
            $localStorage.googleUser = JSON.stringify(user);
            
            console.log('from local storage:'+$localStorage.googleUser);
            return $localStorage.googleUser;
        }
    };
});

pikkApp.factory('GooglePlusUserService', function($http, $q, $cordovaGooglePlus){
    return {
        login: function(){
            var deferred = $q.defer();
            $cordovaGooglePlus.login({}).then(function(res) {
                console.log('success');
                console.log(res);
                deferred.resolve(res);
                return deferred.promise;
            }, function(err) {
                console.log('error');
                console.log(err);
                deferred.reject(response);
            });
            return deferred.promise;
        }
    };
});



pikkApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
