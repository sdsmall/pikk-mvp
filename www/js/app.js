// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var pikkApp = angular.module('starter', ['ionic','ionic.native','ui.router','ngStorage']);

pikkApp.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
  $stateProvider
    .state('test', {
      url: '/test',
      templateUrl: 'templates/test.html',
      controller: 'TestController'
    })
    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/app.html"
    })
    .state('app.profile', {
      url: "/profile",
      views: {
        'profile-tab': {
          templateUrl: "templates/prof.html",
          controller: 'ProfCtrl'
        }
      }
    })
    .state('app.feed', {
      url: "/feed",
      views: {
        'feed-tab': {
          templateUrl: "templates/feed.html",
          controller: 'FeedCtrl'
        }
      }
    })
    .state('app.create', {
      url: "/create",
      views: {
        'create-tab': {
          templateUrl: "templates/create.html",
          controller: 'CreateCtrl'
        }
      }
    })
    .state('app.message', {
      url: "/message",
      views: {
        'message-tab': {
          templateUrl: "templates/message.html",
          controller: 'MessageCtrl'
        }
      }
    })
    .state('app.search', {
      url: "/search",
      views: {
        'search-tab': {
          templateUrl: "templates/search.html",
          controller: 'SearchCtrl'
        }
      }
    })
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
    //$urlRouterProvider.otherwise('/login');
    $urlRouterProvider.otherwise('/app/profile');
    
    $ionicConfigProvider.tabs.position('bottom');
});

pikkApp.controller("TestController", function($scope, $state, DbUserService) {
    $scope.users = [];
    $scope.usersRetrieved = false;
    
    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.allUsers();
      });
    
    $scope.allUsers = function (){
        console.log('allUsers called');
        DbUserService.getAllUsers()
            .then(function(response){
                console.log(response);
                $scope.users = response.message;
                $scope.usersRetrieved = true;
            }).catch(function(){
                throw 'DbUserService get all users call error';
            });
    };
    
    $scope.skip = function(){
        $state.go('profile');
    };
})

.controller("ProfCtrl", function($scope, DbUserService, LocalUserService) {
    $scope.currentId = LocalUserService.testLogin();
    
    $scope.users = [];
    $scope.usersRetrieved = false;
    
    $scope.friendships = [];
    $scope.friendshipsRetrieved = false;
    
    $scope.incomingRequests = [];
    $scope.incomingRequestsRetrieved = false;
    
    $scope.outgoingRequests = [];
    $scope.outgoingRequestsRetrieved = false;
    
    $scope.active = 'friends';
     
    $scope.setActive = function(type) {
        if(type === 'friends'){
            //if friends is set active - get all friends
            console.log('fetch all friends');
            $scope.getFriendships();
            
        } else if(type === 'outgoing'){
            //if outgoing is set active - get all outgoing requests
            console.log('fetch all outgoing requests');
            $scope.getOutgoingRequests();
            
        } else if(type === 'incoming'){
            //if incoming is set active - get all incoming requests
            console.log('fetch all incoming requests');
            $scope.getIncomingRequests();
        }
        
        $scope.active = type;
    };
    $scope.isActive = function(type) {
        return type === $scope.active;
    };
    
    $scope.$on("$ionicView.beforeEnter", function(event, data){
        console.log('beforeEnter called');
        $scope.getFriendships();
        //$scope.allUsers();
        
//        LocalUserService.testLogin()
//            .then(function(response){
//                console.log('testLogin response: '+response);
//                $scope.currentId = response;
//            }).catch(function(){
//                throw 'LocalUserService test login'
//            });
    });
    
    $scope.allUsers = function (){
        console.log('allUsers called');
        DbUserService.getAllUsers()
            .then(function(response){
                console.log(response);
                $scope.users = response.message;
                $scope.usersRetrieved = true;
            }).catch(function(){
                throw 'DbUserService get all users call error';
            });
    };    
    
    $scope.getFriendships = function(){
        console.log('getFriendships called');
        DbUserService.getFriendships($scope.currentId)
            .then(function(response){
                console.log(response);
                if(response.found){
                    $scope.friendships = response.message;
                }
                else{
                    $scope.friendships = [];
                }
                $scope.friendshipsRetrieved = true;
            }).catch(function(){
                throw 'DbUserService get friendships for user'
            });
    };
    
    $scope.getIncomingRequests = function(){
        console.log('getIncomingRequests called');
        DbUserService.getFriendRequests('incoming', $scope.currentId)
            .then(function(response){
                console.log(response);
                if(response.found){
                    $scope.incomingRequests = response.message;
                }
                else{
                    $scope.incomingRequests = [];
                }
                $scope.incomingRequestsRetrieved = true;
            }).catch(function(){
                throw 'DbUserService get incoming requests for user'
            });
    };
    
    $scope.getOutgoingRequests = function(){
        console.log('getOutgoingRequests called');
        DbUserService.getFriendRequests('outgoing',$scope.currentId)
            .then(function(response){
                console.log(response);
                if(response.found){
                    $scope.outgoingRequests = response.message;
                }
                else{
                    $scope.outgoingRequests = [];
                }
                $scope.outgoingRequestsRetrieved = true;
            }).catch(function(){
                throw 'DbUserService get outgoing requests for user'
        });
    };
    
})

.controller("FeedCtrl", function($scope) {
    
})

.controller("CreateCtrl", function($scope) {})

.controller("MessageCtrl", function($scope) {})

.controller("SearchCtrl", function($scope) {})

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
                        console.log('trying transitionto');
                        //$state.go('welcome');
                        $state.transitionTo(
                            'welcome', 
                            {}, 
                            {reload: true, inherit: false, notify: true});
                    } else{
                        console.log('made it to profile case');
                        $state.go('app.home');
                    }
                }).catch(function(){
                    throw 'DbUserService login call error';
                });
        
        }).catch(function(){
            throw 'GooglePlusUserService login call error';
        });
  };

})


.controller("ProfileController", function($scope, DbUserService) {
    $scope.active = 'friends';
     
    $scope.setActive = function(type) {
        $scope.active = type;
    };
    $scope.isActive = function(type) {
        return type === $scope.active;
    };
    
//    $scope.users = [];
//    $scope.usersRetrieved = false;
//    
//    $scope.$on('$ionicView.beforeEnter', function(){
//        $scope.allUsers();
//      });
    
//    $scope.usersRetrieved = false;
//    $scope.users = [];
//    
//    $scope.$on("$ionicView.beforeEnter", function(event, data){
//        console.log('beforeEnter called');
//        $scope.allUsers();
//    });
//    
////    $scope.$on('$ionicView.beforeEnter', function(){
////        console.log('beforeEnter called');
////        $scope.allUsers();
////    });
//    
//    $scope.allUsers = function (){
//        console.log('allUsers called');
//        DbUserService.getAllUsers()
//            .then(function(response){
//                console.log(response);
//                $scope.users = response.message;
//                $scope.usersRetrieved = true;
//            }).catch(function(){
//                throw 'DbUserService get all users call error';
//            });
//    };
})

.controller("WelcomeController", function($scope, $stateParams){
    $scope.users = [];
    $scope.usersRetrieved = false;
    
    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.allUsers();
      });
    
//    $scope.usersRetrieved = false;
//    $scope.users = [];
//    
//    $scope.$on("$ionicView.beforeEnter", function(event, data){
//        console.log('beforeEnter called');
//        $scope.allUsers();
//    });
//    
////    $scope.$on('$ionicView.beforeEnter', function(){
////        console.log('beforeEnter called');
////        $scope.allUsers();
////    });
//    
    $scope.allUsers = function (){
        console.log('allUsers called');
        DbUserService.getAllUsers()
            .then(function(response){
                console.log(response);
                $scope.users = response.message;
                $scope.usersRetrieved = true;
            }).catch(function(){
                throw 'DbUserService get all users call error';
            });
    };
});

pikkApp.factory('DbUserService', function($http, $q, LocalUserService){
    return {
        login: function(user){
            console.log('trying login');
            var url = "http://localhost:3000/login";
            return $http.put(url,user)
                .then(function(response){
                    console.log(response);
                    return response.data;
                }, function(error){
                    return $q.reject(error);
                });
        },
        
        getAllUsers: function(){
            console.log('get all users called');
            var url = "http://localhost:3000/users";
            return $http.get(url)
                .then(function(response){
                    console.log(response);
                    return response.data;
                }, function(error){
                    console.log(error);
                    return $q.reject(error);
                });
        },
        
        getFriendships: function(userObjectId){
            console.log('get friendships for '+userObjectId);
            var url = "http://localhost:3000/friendship/"+userObjectId;
            return $http.get(url)
                .then(function(response){
                    console.log(response);
                    return response.data;
                }, function(error){
                    console.log(error);
                    return $q.reject(error);
                });
        },
        
        getFriendRequests: function(direction, userObjectId){
            console.log('get friend requests '+direction+' for '+userObjectId);
            var url = "http://localhost:3000/friendrequest/"+direction+"/"+userObjectId;
            return $http.get(url)
                .then(function(response){
                    console.log(response);
                    return response.data;
                }, function(error){
                    console.log(error);
                    return $q.reject(error);
                });
        }
    };
});

pikkApp.factory('LocalUserService', function($localStorage){
    return {
        login: function(userData){
            
            var user = {
                objectId: userData._id,
                userID: userData.userId,
                name: userData.displayName,
                email: userData.email
            };
            
            $localStorage.googleUser = JSON.stringify(user);
            
            console.log('from local storage:'+$localStorage.googleUser);
            return $localStorage.googleUser;
        },

        testLogin: function(){
            var user = {
                objectId: "58614e4bafbbfc0b5fb45215",
                userID: "108072550424082171848",
                name: "Samantha Small",
                email: "sdsmall92@yahoo.com"
            };
            
            $localStorage.googleUser = JSON.stringify(user);
            return "58614e4bafbbfc0b5fb45215";
        },
        
        getCurrentUserObjectId: function(){
            return $localStorage.googleUser.objectId;
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
