app.controller("statisticsCtrl", function statisticsCtrl($scope, $window, APIService) {
    $scope.dataLoading = true;
    APIService.getUserList().then(function (response) {
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

    $scope.enterAsUser = function (user) {
        APIService.enterAsUser(user.username).then(function (response) {
            if (response.status == 200) {
                localStorage.setItem('wasAdmin', 121);
                $window.location.href = 'index.html#!/privateOffice';
            }
        });
    };

    $scope.checkData = function (data) {
        var obj = {'id':data.id, 'eduLevel':data.educationLevel};
        sessionStorage.setItem('checkDataId', JSON.stringify(obj));
        $window.open('/index.html#!/checkData','_blank');
    };
});