(function(angular) {

    // initialize the module
    var adminApp = angular.module('adminApp', ['ngRoute'])


    // set routes for views
    adminApp.config(function($routeProvider) {
        $routeProvider

        // route for admin home
        .when('/', {
            templateUrl: 'views/adminHome.html',
            controller: 'adminHomeController'
        })
        .when('/categories', {
            templateUrl: 'views/adminCategories.html',
            controller: 'adminCategoriesController'
        })
        .when('/articles', {
            templateUrl: 'views/adminArticles.html',
            controller: 'adminArticlesController'
        })
        .when('/signout', {
            templateUrl: 'views/adminSignOut.html',
            controller: 'adminSignOutController'
        })
    })
    

    var adminHomeController = function($scope, $http) {


    }
    var adminCategoriesController = function($scope, $http) {


    }
    var adminArticlesController = function($scope, $http) {


    }
    var adminSignOutController = function($scope, $http) {


    }

    adminApp.controller('adminHomeController', adminHomeController);
    adminApp.controller('adminCategoriesController', adminCategoriesController);
    adminApp.controller('adminArticlesController', adminArticlesController);
    adminApp.controller('adminSignOutController', adminSignOutController);

})(window.angular);