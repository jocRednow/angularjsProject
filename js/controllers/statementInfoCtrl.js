app.controller("statementInfoCtrl", function statementInfoCtrl($scope, $window, APIService) {
    if (sessionStorage.getItem('formID')) {
        $scope.formId = sessionStorage.getItem('formID');
        APIService.getFilesList($scope.formId).then(function (response) {
            $scope.filesList = response.data;
        }, function (response) {
            if (response.status == 401) {
                $window.location.href = '#!/login';
            }
        });
    }

    $scope.doTheBack = function () {
        $window.history.back();
    };
});