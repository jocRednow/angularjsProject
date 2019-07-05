app.controller("fullRegisterPhoneFormCtrl", function fullRegisterPhoneFormCtrl($scope, $window, APIService) {
    $scope.mobilePhone = /^7[0-9]{10}$/;
    $scope.verificationCode = /^[0-9]{3}$/;
    $('[data-toggle="tooltip"]').tooltip();
    $scope.user = {};
    $scope.flash = {};
    $scope.dataLoading = false;

    $scope.register = function () {
        $scope.dataLoading = true;
        APIService.postFullPhoneReg($scope.user).then(function (response) {
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