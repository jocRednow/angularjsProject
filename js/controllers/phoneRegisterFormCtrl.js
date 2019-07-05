app.controller("phoneRegisterFormCtrl", function phoneRegisterFormCtrl($scope, $window, APIService) {
    $scope.mobilePhone = /^7[0-9]{10}$/;
    $('[data-toggle="tooltip"]').tooltip();
    $scope.logInForm = {};
    $scope.checkAgree = false;
    $scope.flash = {};
    $scope.dataLoading = false;

    $scope.$watch('logInForm.phone', function (newVal) {
        if (newVal && newVal.charAt(0) == "7" && newVal.length == 11) {
            APIService.checkPhone(newVal).then(function (response) {
                if (response.data.message == true) {
                    $scope.flash = {
                        type: 'success',
                        message: "Телефон корректен"
                    };
                    $scope.error = false;
                } else if (response.data.message == false) {
                    $scope.flash = {
                        type: 'error',
                        message: "Телефон уже был зарегистрирован"
                    };
                    $scope.error = true;
                }
            });
        } else {
            $scope.flash = {};
        }
    });

    $scope.login = function () {
        $scope.dataLoading = true;
        APIService.postPhone($scope.logInForm.phone).then(function (response) {
            $scope.dataLoading = false;
            if (response.status == 200) {
                $scope.flash = {
                    type: 'success',
                    message: response.data.message
                };
                setTimeout(function () {
                    $window.location.href = '#!/fullRegisterPhone';
                }, 1500);
            } else {
                $scope.flash = {
                    type: 'error',
                    message: response.data.message
                };
            }
        });
    };
});