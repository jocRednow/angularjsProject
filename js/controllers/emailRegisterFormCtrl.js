app.controller("emailRegisterFormCtrl", function emailRegisterFormCtrl($scope, $window, APIService) {
    $('[data-toggle="tooltip"]').tooltip();
    $scope.logInForm = {};
    $scope.checkAgree = false;
    $scope.flash = {};
    $scope.dataLoading = false;

    $scope.$watch('logInForm.email', function (newVal) {
        if (newVal) {
            APIService.checkEmail(newVal).then(function (response) {
                if (response.data.message == true) {
                    $scope.flash = {
                        type: 'success',
                        message: "Электронный адрес корректен"
                    };
                    $scope.error = false;
                } else if (response.data.message == false) {
                    $scope.flash = {
                        type: 'error',
                        message: "Электронный адрес уже был зарегистрирован"
                    };
                    $scope.error = true;
                }
            });
        } else if (newVal == undefined) {
            $scope.flash = {};
        }
    });

    $scope.login = function () {
        $scope.dataLoading = true;
        APIService.postEmail($scope.logInForm.email).then(function (response) {
            $scope.dataLoading = false;
            if (response.status == 200) {
                $scope.flash = {
                    type: 'success',
                    message: response.data.message
                };
                setTimeout(function () {
                    $window.location.href = '#!/login';
                }, 2000);
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
            setTimeout(function () {
                $window.location.href = '#!/login';
            }, 6000);
        });
    };
});