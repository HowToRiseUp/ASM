var app = angular.module('myApp', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'HomeController'
        })
        .when('/signup', {
            templateUrl: 'signup.html',
            controller: 'SignupController'
        })
        .when('/signin', {
            templateUrl: 'signin.html',
            controller: 'SigninController'
        })
        .when('/product/:id', {
            templateUrl: 'product-detail.html',
            controller: 'ProductDetailController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.service('DataService', function ($http) {
    this.getProducts = function () {
        return $http.get('db.json').then(function (response) {
            return response.data.products;
        });
    };
});

app.controller('HomeController', function ($scope, DataService, $location) {
    $scope.message = 'Welcome to the Home Page!';
    $scope.currentPage = 1;
    $scope.itemsPerPage = 4;
    $scope.reverse = false;
    $scope.sortType = 'name';
    $scope.searchKeyword = '';
    $scope.filteredProducts = [];

    DataService.getProducts().then(function (products) {
        $scope.products = products;
        $scope.filteredProducts = products;
        $scope.updatePagination();
    });

    $scope.goToProductDetail = function (productId) {
        $location.path('/product/' + productId);
    };

    $scope.search = function (keyword) {
        console.log("Search function called with keyword:", keyword);
        if (!keyword) {
            $scope.filteredProducts = $scope.products;
        } else {
            $scope.filteredProducts = $scope.products.filter(function (product) {
                return product.name.toLowerCase().includes(keyword.toLowerCase());
            });
        }
        $scope.updatePagination();
    };

    $scope.reverseSort = function () {
        $scope.reverse = !$scope.reverse;
        $scope.updatePagination();
    };

    $scope.updatePagination = function () {
        $scope.totalItems = $scope.filteredProducts.length;
        $scope.paginatedProducts = $scope.filteredProducts.slice(
            ($scope.currentPage - 1) * $scope.itemsPerPage,
            $scope.currentPage * $scope.itemsPerPage
        ).sort((a, b) => {
            if ($scope.reverse) {
                return a[$scope.sortType] < b[$scope.sortType] ? 1 : -1;
            } else {
                return a[$scope.sortType] > b[$scope.sortType] ? 1 : -1;
            }
        });

        var totalPages = Math.ceil($scope.totalItems / $scope.itemsPerPage);
        $scope.pages = [];
        for (var i = 1; i <= totalPages; i++) {
            $scope.pages.push(i);
        }
    };

    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
        $scope.updatePagination();
    };
});

app.controller('SignupController', function ($scope) {
    $scope.message = 'Sign up for an account.';
});

app.controller('SigninController', function ($scope) {
    $scope.message = 'Sign in to your account.';
});

app.controller('ProductDetailController', function ($scope, $routeParams) {
    $scope.productId = $routeParams.id;
    $scope.message = 'Details for product with ID: ' + $routeParams.id;
});
