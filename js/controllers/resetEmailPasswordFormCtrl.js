app.controller("resetEmailPasswordFormCtrl", function resetEmailPasswordFormCtrl($scope, $location, $window, APIService) {
    $('[data-toggle="tooltip"]').tooltip();
    $scope.parts = $location.search();
    $scope.user = {};
    $scope.flash = {};
    $scope.dataLoading = false;

    $scope.resetPasswordByEmail = function () {
        $scope.user.verificationCode = $scope.parts.code;
        $scope.user.email = $scope.parts.email;
        $scope.dataLoading = true;
        APIService.sendEmailNewPassword($scope.user).then(function (response) {
            $scope.dataLoading = false;
            if (response.status == 200) {
                $scope.flash = {
                    type: 'success',
                    message: response.data.message
                };
                setTimeout(function () {
                    $window.location.href = '#!/login';
                }, 1500);
            } else {
                $scope.flash = {
                    type: 'error',
                    message: response.data.message
                };
            }
        }, function (response) {
            $scope.dataLoading = false;
            $scope.flash = {
                type: 'error',
                message: response.data.message
            };
        });
    };
});