(function(angular) {

    // initialize the module
    var blockchainApp = angular.module('blockchainApp', ['ngRoute', 'LocalStorageModule', 'textAngular', 'ngMaterial', 'ngMessages'])


    // set routes for views
    blockchainApp.config(function($routeProvider) {
        $routeProvider

        // route for default
            .when('/', {
            templateUrl: 'views/default.html',
            controller: 'DefaultController'
        })

        // route for internal
        .when('/internal', {
            templateUrl: 'views/internal.html',
            controller: 'InternalController'
        })

        // route for external
        .when('/external', {
            templateUrl: 'views/external.html',
            controller: 'ExternalController'
        })

        .when('/newCat', {
            templateUrl: 'views/newCat.html',
            controller: 'NewCatController'
        })

        .when('/deactCat', {
            templateUrl: 'views/deactCat.html',
            controller: 'DeactCatController'
        })

        .when('/resCat', {
            templateUrl: 'views/resCat.html',
            controller: 'ResCatController'
        })

        .when('/delCat', {
            templateUrl: 'views/delCat.html',
            controller: 'DelCatController'
        })

        .when('/editCat', {
            templateUrl: 'views/editCat.html',
            controller: 'EditCatController'
        })

        .when('/signIn', {
            templateUrl: 'views/signIn.html',
            controller: 'SignInController'
        })

        .when('/editArt', {
            templateUrl: 'views/editArt.html',
            controller: 'EditArtController'
        })

        // .when('/addArt', {
        //     templateUrl: 'views/addArt.html',
        //     controller: 'AddArtController'
        // });
    })

    // new pipe for blockchainApp to clean html tags from a string
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return text ? String(text).replace(/<[^>]+>/gm, '').substr(0, 200) : '';
        };
    });;

    var DefaultController = function($scope, $http) {
        $http.get('/services/categories/organized')
            .then(function(d) {
                $scope.title = d.data.name;
            })
    }

    var InternalController = function($scope, $http, $mdDialog) {

        $http.get('/services/articles/get/' + window.category)
            .then(function(d) {
                $scope.articles = d.data
                $scope.title = window.catTitle;
            })

        $scope.showArticle = function(event, key) {
            $http.get('/services/article/get/' + key)
                .then(function(d) {
                    console.log(d.data.content);
                    $mdDialog.show({
                        //controller: InternalController,
                        template: d.data.content,
                        parent: angular.element(document.body),
                        targetEvent: event,
                        clickOutsideToClose: true,
                        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
                    })

                })
        }

    }

    var ExternalController = function($scope, $http) {

        $http.get('/services/rss/' + window.category)
            .then(function(d) {
                $scope.articles = d.data;
                $scope.title = window.catTitle;
            })

    }

    var NavBarController = function($scope, $mdDialog, localStorageService, $window) {
        var roll = localStorageService.get('roll');
        var user = localStorageService.get('user');
        if (roll == null) {
            roll = "Free";
            localStorageService.set('roll', 'Free');
        }
        if (user == null) {
            user = "User";
            localStorageService.set('user', 'User');
        }
        $scope.roll = roll;
        $scope.user = user;

        $scope.setRoll = function(uName) {
            localStorageService.set('roll', uName);
            $scope.roll = uName;
        }

        $scope.showArt = function() {
            if (localStorageService.get('roll') == 'Admin' || localStorageService.get('roll') == 'Editor') {
                return true;
            } else {
                return false;
            }
        }

        $scope.showCat = function() {
            if (localStorageService.get('roll') == 'Admin') {
                return true;
            } else {
                return false;
            }
        }

        $scope.showSignIn = function() {
            if (localStorageService.get('user') == 'User') {
                return true;
            } else {
                return false;
            }
        }


        $scope.showSignOut = function() {
            if (localStorageService.get('user') != 'User') {
                return true;
            } else {
                return false;
            }
        }

        $scope.signOut = function() {
            localStorageService.set('user', 'User');
            $window.location.reload()
        }

        $scope.showAddArticle = function(ev) {
            $mdDialog.show({
                controller: AddArtController,
                templateUrl: 'views/addArt.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        }

        $scope.showEditArticle = function(ev) {
            $mdDialog.show({
                controller: EditArtController,
                templateUrl: 'views/editArt.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        };

        $scope.showDeleteArticle = function(ev) {
            $mdDialog.show({
                controller: DelArtController,
                templateUrl: 'views/delArt.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
        };

    }

    var NewCatController = function($scope, $http, $window) {
        $http.get('/services/categories/sub')
            .then(function(d) {
                $scope.categories = d.data;
            })
        $scope.submitCat = function(cat) {
            $http.post('/services/categories/new', cat);
            (function() {
                $window.location.reload()
            })();
        }
    }

    var DeactCatController = function($scope, $http, $window) {
        $http.get('/services/categories/active')
            .then(function(d) {
                $scope.categories = d.data;
            })
        $scope.submitCat = function(cat) {
            $http.post('/services/categories/deactivate', cat);
            (function() {
                $window.location.reload()
            })();
        }
    }

    var ResCatController = function($scope, $http, $window) {
        $http.get('/services/categories/inactive')
            .then(function(d) {
                $scope.categories = d.data;
            })
        $scope.submitCat = function(cat) {
            $http.post('/services/categories/restore', cat);
            (function() {
                $window.location.reload()
            })();
        }
    }

    var DelCatController = function($scope, $http, $window) {
        $http.get('/services/categories/inactive')
            .then(function(d) {
                $scope.categories = d.data;
            })
        $scope.submitCat = function(cat) {
            $http.post('/services/categories/delete', cat);
            (function() {
                $window.location.reload()
            })();
        }
    }

    var EditCatController = function($scope, $http, $window) {
        $http.get('/services/categories/active')
            .then(function(d) {
                $scope.categories = d.data;
                console.log(d.data);
            })

        $scope.changeCurrentCategory = function() {
            angular.forEach($scope.categories, function(v, k) {
                if (v.key == $scope.current) {
                    $scope.cat = v;
                }
            })
        }


        $scope.submitCat = function(cat) {
            $http.post('/services/categories/edit', cat);
            (function() {
                $window.location.reload()
            })();
        }
    }

    var SignInController = function($scope, $http, $window, localStorageService) {
        $scope.submitUser = function(d) {
            localStorageService.set('user', d.name);
            $window.location.reload();
            /*if (d.isnew == true) {
                $http.post('/services/user/new', d).then(function(res) {
                    localStorageService.set('user', d.name);
                    $window.location.reload();
                }, function(res) {
                    alert('Invalid username, please enter unique username');
                });
            } else {
                $http.post('/services/user/signin', d).then(function(res) {
                    localStorageService.set('user', d.name);
                    $window.location.reload();
                }, function(res) {
                    alert('Incorrect password or not a current user');
                })
            }*/
        }
    }

    var EditArtController = function($scope, $http, $window) {
        $http.get('/services/categories/internal')
            .then(function(d) {
                $scope.categories = d.data;
            })



        $scope.changeCurrentCategory = function() {
            $http.get('/services/articles/get/' + $scope.currentCat)
                .then(function(d) {
                    $scope.articles = d.data;
                })
        }

        $scope.changeCurrentArticle = function() {
            $http.get('/services/article/get/' + $scope.currentArt)
                .then(function(d) {
                    $scope.art = d.data;
                })
        }

        $scope.submitArt = function() {
            $http.post('/services/article/edit', $scope.art);
            (function() {
                $window.location.reload();
            })();
        }
    }

    var AddArtController = function($scope, $http, $window) {

        $http.get('/services/categories/internal')
            .then(function(d) {
                $scope.categories = d.data;
            })

        $scope.submitArt = function() {
            $http.post('/services/article/add', $scope.art);
            console.log($scope.art);
            (function() {
                $window.location.reload();
            })();
        }
    }

    var DelArtController = function($scope, $http, $window) {

        $http.get('/services/articles/inactive')
            .then(function(d) {
                $scope.articles = d.data;
            })

        $scope.submitArt = function() {
            $http.post('/services/article/delete', $scope.art);
            (function() {
                $window.location.reload();
            })();
        }
    }

    blockchainApp.controller('DefaultController', DefaultController);
    blockchainApp.controller('InternalController', InternalController);
    blockchainApp.controller('ExternalController', ExternalController);
    blockchainApp.controller('NavBarController', NavBarController);
    blockchainApp.controller('NewCatController', NewCatController);
    blockchainApp.controller('DeactCatController', DeactCatController);
    blockchainApp.controller('ResCatController', ResCatController);
    blockchainApp.controller('DelCatController', DelCatController);
    blockchainApp.controller('EditCatController', EditCatController);
    blockchainApp.controller('SignInController', SignInController);
    blockchainApp.controller('EditArtController', EditArtController);
    blockchainApp.controller('AddArtController', AddArtController);
    blockchainApp.controller('DelArtController', DelArtController);

})(window.angular);