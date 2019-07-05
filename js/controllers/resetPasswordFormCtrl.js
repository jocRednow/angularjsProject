app.controller("resetPasswordFormCtrl", function resetPasswordFormCtrl($scope, $window, APIService) {
    $scope.mobilePhone = /^7[0-9]{10}$/;
    $scope.dataLoading = false;

    $scope.byPhone = function () {
        $scope.flash = {};
        setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()},500);
        $scope.resetPhone = true;
        $scope.showFullPhoneForm = false;
        $scope.resetEmail = false;
        $scope.resetForm = {};
    };

    $scope.byEmail = function () {
        $scope.flash = {};
        setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()},500);
        $scope.resetEmail = true;
        $scope.resetPhone = false;
        $scope.resetForm = {};
    };

    $scope.resetByPhone = function () {
        $scope.dataLoading = true;
        if ($scope.showFullPhoneForm == false && $scope.resetForm.password == undefined) {
            APIService.sendPasswordResetCode($scope.resetForm.phone).then(function(response) {
                $scope.dataLoading = false;
                $scope.flash = {
                    type: 'success',
                    message: response.data.message
                };
                $scope.showFullPhoneForm = true;
                setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()},500);
            }, function (response) {
                $scope.dataLoading = false;
                $scope.flash = {
                    type: 'error',
                    message: response.data.message
                };
                $scope.showFullPhoneForm = false;
            });
        } else if ($scope.showFullPhoneForm == true && $scope.resetForm.password) {
            APIService.sendNewPassword($scope.resetForm).then(function (response) {
                $scope.dataLoading = false;
                $scope.flash = {
                    type: 'success',
                    message: response.data.message
                };
                setTimeout(function () {
                    $window.location.href = '#!/login';
                }, 1500);
            }, function (response) {
                $scope.dataLoading = false;
                $scope.flash = {
                    type: 'error',
                    message: response.data.message
                };
            });
        }
    };

    $scope.resetByEmail = function () {
        $scope.dataLoading = true;
        APIService.sendEmailPasswordResetCode($scope.resetForm.email).then(function(response) {
            $scope.dataLoading = false;
            $scope.flash = {
                type: 'success',
                message: response.data.message
            };
            setTimeout(function () {
                $window.location.href = '#!/login';
            }, 1500);
        }, function (response) {
            $scope.dataLoading = false;
            $scope.flash = {
                type: 'error',
                message: response.data.message
            };
        });
    };
});