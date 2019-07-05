app.controller("loginFormCtrl", function loginFormCtrl($scope, $rootScope, $window, APIService) {
    setTimeout(function () {
        $('[data-toggle="tooltip"]').tooltip();
    }, 1000);

    clearInterval($rootScope.interval);
    localStorage.removeItem('wasAdmin');

    $scope.getCurrentYear = function () {
        return new Date().getFullYear()
    };
    $scope.logInForm = {};
    $scope.flash = {};
    $scope.dataLoading = false;

    $scope.login = function () {
        $scope.dataLoading = true;
        APIService.postLogin($scope.logInForm).then(function (response) {
            $scope.dataLoading = false;
            if (response.status == 200) {
                $scope.flash = {
                    type: 'success',
                    message: "Вход успешно выполнен"
                };
                setTimeout(function () {
                    $window.location.href = '#!/privateOffice';
                }, 1500);
            } else {
                $scope.flash = {
                    type: 'error',
                    message: "Доступ отсутствует"
                }
            }
        }, function () {
            $scope.dataLoading = false;
            $scope.flash = {
                type: 'error',
                message: "Неправильный логин или пароль"
            }
        });
    };

    $scope.openHelpBlock = function () {
        $scope.helpData = {};
        APIService.getHelpTypes().then(function (response) {
            $scope.themeList = response.data;
        });
    };
    $scope.sendHelpData = function () {
        APIService.postHelp($scope.helpData).then(function (response) {
            if (response.status == 200) console.log("SEND.");
        });
    };
    $scope.closeHelpBlock = function () {
        $scope.helpData = {};
    };

    $scope.uploadFile = function (that) {
        if (that.files[0]) {
            if (that.files[0].size > 3000000) {
                that.value = "";
                $scope.$digest();
                return false;
            } else {
                var newFile = {};
                newFile.userFileName = that.files[0].name;
                newFile.contactPersonId = $scope.statementId;
                // получение файла в формате base64
                function readerOnLoad(readerEvt) {
                    var binaryString = readerEvt.target.result;
                    newFile.base64Body = btoa(binaryString);
                }
                var reader = new FileReader();
                reader.onload = readerOnLoad;
                reader.readAsBinaryString(that.files[0]);
            }

            setTimeout(function () {
                switch(that.name) {
                    // Помощь
                    case 'helpFiles':
                        delete newFile.contactPersonId;
                        if (!$scope.helpData.helpFiles) {
                            $scope.helpData.helpFiles = [];
                        }
                        $scope.helpData.helpFiles.push(newFile);
                        setTimeout(function () {
                            $scope.$apply();
                        }, 100);
                        break;
                }
            }, 1000);
        } else {
            all.value = "";
            $scope.$digest();
            return false;
        }
    };
    $scope.deleteFile = function (arrayFiles, file, name) {
        Array.prototype.remove = function() {
            var what, a = arguments, l = a.length, ax;
            while (l && this.length) {
                what = a[--l];
                while ((ax = this.indexOf(what)) !== -1) {
                    this.splice(ax, 1);
                }
            }
            return this;
        };

        angular.forEach(arrayFiles, function (i) {
            if (name == 'helpFiles' && i === file) {
                // Помощь
                arrayFiles.splice(i, 1);
                var target = angular.element(document.querySelector("#helpFiles"));
                target.val(null);
            }
        });
    };
});