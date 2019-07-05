app.controller("adminCtrl", function adminCtrl($scope, $window, $timeout, APIService) {
    $scope.messageShow = false;

    APIService.getAdminState().then(function (response) {
        if (response.status == 200) {
            $scope.adminSettings = response.data;
        }
    }, function (response) {
        if (response.status == 401) {
            $scope.messageShow = true;
            $scope.flash = {
                type: 'error',
                message: "Доступ отсутствует"
            };
            $timeout(function () {
                $window.location.href = '#!/login';
            }, 2000);
        }
        if (response.status == 403) {
            $window.location.href = '#!/login';
        }
    });

    $scope.changesApply = function () {
        APIService.postAdminState($scope.adminSettings).then(function (response) {
            if (response.status == 200) {
                $scope.messageShow = true;
                $scope.flash = {
                    type: 'success',
                    message: response.data.message
                };
                $timeout(function () {
                    $scope.messageShow = false;
                }, 2000);
            }
        })
    }
});