var app = angular.module("app", []);

app.controller('name', ['$scope', '$http', function($scope, $http){
	$http.get('/data')
	.success((data)=>{
		$scope.array = data
	})
	.error((err)=>{
		console.log(err);
	})
}])