app.controller("checkDataCtrl", function checkDataCtrl($scope, $window, APIService) {
    var getObject = sessionStorage.getItem('checkDataId');
    $scope.checkedData = JSON.parse(getObject);

    APIService.getSupportUserInfo($scope.checkedData.id).then(function (response) {
        if (response.status == 200) {
            $scope.userInfo = response.data;
        }
    });

    if ($scope.checkedData.eduLevel.name == 'Ординатура') {
        APIService.getOrdForm($scope.checkedData.id).then(function (response) {
            if (response.status == 200) {
                $scope.userData = response.data;
            }
        });
    }

    if ($scope.checkedData.eduLevel.name == 'Аспирантура') {
        APIService.getAspForm($scope.checkedData.id).then(function (response) {
            if (response.status == 200) {
                $scope.userData = response.data;
            }
        });
    }

    if ($scope.checkedData.eduLevel.name == 'Додиплом') {
        APIService.getSpecForm($scope.checkedData.id).then(function (response) {
            if (response.status == 200) {
                $scope.userData = response.data;
            }
        });
    }

    $scope.passToComment = function (data, name) {
        $scope.commentData = {};
        if (name == 'appl') $scope.commentData.message = data.applExportResponse;
        else if (name == 'with') $scope.commentData.message = data.withdrawalExportResponse;
    };

    $scope.getStatementForWatch = function (id) {
        sessionStorage.setItem('formID', JSON.stringify(id));
        $window.location.href = "/index.html#!/statementInfo";
    };
});