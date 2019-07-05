app.controller("usersListCtrl", function usersListCtrl($scope, $window, APIService) {
    $scope.dataLoading = true;
    APIService.getSupportUserList().then(function (response) {
        $scope.userList = response.data;
        $scope.online = [];
        $scope.outUserList = false;
        angular.forEach($scope.userList, function (item) {
            if (item.online == true) {
                $scope.online.push(item);
            }
        });
        $scope.dataLoading = false;
    }, function (response) {
        $scope.outUserList = true;
        console.log(response.data.message);
        $scope.dataLoading = false;
    });

    $scope.checkData = function (data) {
        var obj = {'id':data.id, 'eduLevel':data.educationLevel};
        sessionStorage.setItem('checkDataId', JSON.stringify(obj));
        $window.open('/index.html#!/checkData','_blank');
    };
});