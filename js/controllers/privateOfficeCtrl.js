app.controller("privateOfficeCtrl", function privateOfficeCtrl($scope, $http, $rootScope, $window, $timeout, APIService) {
    setTimeout(function () {
        $('[data-toggle="tooltip"]').tooltip();
    }, 1000);

    clearInterval($rootScope.interval);

    if (localStorage.getItem("wasAdmin") == 121) {
        $scope.wasEarlier = true;
    } else {
        $scope.wasEarlier = false;
    }
    $scope.backToStats = function () {
        APIService.getBecomeUser().then(function (response) {
            if (response.status == 200) {
                localStorage.removeItem('wasAdmin');
                $window.location.href = 'statistics.html';
            }
        })
    };

    $scope.toAdminPage = function () {
        $window.location.href = "/index.html#!/admin";
    };

    $scope.getUser = function () {
        APIService.getUserInfo().then(function (response) {
            if (response.status == 200) {
                localStorage.setItem('userName', response.data.userName);
                $scope.privateOfficeData = response.data;
            }
        }, function (response) {
            if (response.status == 401) {
                $scope.flash = {
                    type: 'error',
                    message: "Доступ отсутствует"
                };
                setTimeout(function () {
                    $window.location.href = '#!/login';
                }, 2000);
            }
        });
    };
    $scope.getUser();

    $scope.passToComment = function (data, name) {
        $scope.commentData = {};
        if (name == 'appl') $scope.commentData.message = data.applExportResponse;
        else if (name == 'with') $scope.commentData.message = data.withdrawalExportResponse;
    };

    $scope.passToReject = function (data) {
        $scope.rejectData = {};
        $scope.statementId = data.id;
        $scope.rejectApplExportResponse = data.applExportResponse;
    };
    $scope.rejectStatement = function () {
        $scope.rejectData.contactPersonId = $scope.statementId;
        APIService.rejectForm($scope.rejectData).then(function (response) {
            if (response.status == 200) {
                $scope.withdrawalOk = true;
                console.log(response.data.message);
                $timeout(function () {
                    delete $scope.withdrawalOk;
                }, 5000)
            }
        });
    };

    $scope.passToEnroll = function (data) {
        $scope.currentDate = data;
        $scope.statementId = data.id;
        $scope.timeSelected = false;
        $scope.enrollForm.week = null;
        $scope.enrollData = {};

        if (data.educationLevelName == "Специалитет") {
            APIService.getEarlyEnroll($scope.statementId).then(function (response) {
                if (response.status == 200) {
                    $scope.actualityDate = response.data
                }
            }, function (response) {
                console.log(response.data.message);
            });
            APIService.getEnrollWeeks().then(function (response) {
                $scope.weekList = response.data
            });
        }

        if (data.educationLevelName == "Ординатура") {
            APIService.getOrdEarlyEnroll($scope.statementId).then(function (response) {
                if (response.status == 200) {
                    $scope.actualityDate = response.data
                }
            }, function (response) {
                console.log(response.data.message);
            });
            APIService.getOrdEnrollWeeks().then(function (response) {
                $scope.weekList = response.data
            });
        }
    };
    $scope.changeWeek = function (week) {
        if ($scope.currentDate.educationLevelName == "Специалитет") {
            APIService.getEnrollDates(week).then(function (response) {
                $scope.enrollData = response.data;
            });
        }

        if ($scope.currentDate.educationLevelName == "Ординатура") {
            APIService.getOrdEnrollDates(week).then(function (response) {
                $scope.enrollData = response.data;
            });
        }
    };
    $scope.selectTime = function (inner, data, event) {
        if (inner.isExist == false) {
            return false;
        } else {
            if ($(event.target).hasClass('selectTime')) {
                $(event.target).removeClass('selectTime');
                $scope.timeSelected = false;
            } else {
                $(event.target).parent().siblings().children().removeClass('selectTime');
                $(event.target).addClass('selectTime').siblings().removeClass('selectTime');
                $scope.currentData = {
                    date: inner.date,
                    time: data.time,
                    cpId: $scope.statementId
                };
                $scope.timeSelected = true;
            }
        }
    };
    $scope.enrollStatement = function () {
        if ($scope.currentDate.educationLevelName == "Специалитет") {
            APIService.postEnrollDate($scope.currentData).then(function (response) {
                if (response.status == 200) {
                    console.log(response.data.message);
                    $scope.enrollOk = true;
                    $window.open('/admission_com_api/report/Appointment?contactPersonId=' + $scope.currentData.cpId, '_blank');
                    $timeout(function () {
                        delete $scope.enrollOk;
                        $window.location.reload();
                    }, 5000)
                }
            });
        }

        if ($scope.currentDate.educationLevelName == "Ординатура") {
            APIService.postOrdEnrollDate($scope.currentData).then(function (response) {
                if (response.status == 200) {
                    console.log(response.data.message);
                    $scope.enrollOk = true;
                    $window.open('/admission_com_api/report/Appointment?contactPersonId=' + $scope.currentData.cpId, '_blank');
                    $timeout(function () {
                        delete $scope.enrollOk;
                        $window.location.reload();
                    }, 5000)
                }
            });
        }
    };

    $scope.getApplList = function (data) {
        APIService.getApplicationLines(data.id).then(function (response) {
            if (response.status == 200) {
                $scope.applicationLines = response.data
            }
        });
    };

    $scope.uploadFile = function (that) {
        if (that.files[0]) {
            if (that.files[0].type != 'application/pdf' && that.name != 'helpFiles') {
                that.value = "";
                $scope.$digest();
                return false;
            }
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
                    // Отзыв
                    case 'rejectFiles':
                        newFile.fileType = "Отзыв";
                        newFile.refId = $scope.statementId;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.rejectData.rejectFiles) {
                                $scope.rejectData.rejectFiles = [];
                            }
                            $scope.rejectData.rejectFiles.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watch('rejectData.rejectFiles', function (newVal) {
                                if (newVal && newVal.length > 0)  $scope.rejectValid = true;
                                else $scope.rejectValid = false;
                            });
                        });
                        break;
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
            if (name != 'helpFiles' && i === file) {
                $scope.dataLoading = true;
                APIService.deleteFile(file.id).then(function (response) {
                    console.log(response.data.message);
                    $scope.dataLoading = false;
                    arrayFiles.remove(i);
                    // Отзыв
                    if (arrayFiles.length == 0  && name == 'rejectFiles') {
                        $scope.rejectValid = false;
                        var target = angular.element(document.querySelector("#rejectFiles"));
                        target.val(null);
                        $("#rejectFiles").addClass('error-necessarily-block');
                    }
                });
            }
        });
    };

    $scope.openHelpBlock = function () {
        APIService.getHelpTypes().then(function (response) {
            $scope.themeList = response.data;
        });
        if ($scope.privateOfficeData.userName.search('@') != -1) {
            $scope.helpData = {};
            $scope.helpData.email = $scope.privateOfficeData.userName;
        } else {
            $scope.helpData = {};
        }
    };
    $scope.sendHelpData = function () {
        APIService.postHelp($scope.helpData).then(function (response) {
            if (response.status == 200) console.log("SEND.");
        });
    };
    $scope.closeHelpBlock = function () {
        $scope.helpData = {};
    };

    /* GET IP */
    APIService.getIP().then(function (response) {
        switch(response.data.ip) {
            case '10.130.60.34':
            case '10.130.60.35':
            case '10.130.60.36':
            case '10.130.60.37':
            case '10.130.60.38':
            case '10.130.60.39':
                $scope.showGreenBtn = false
                break;
            default:
                $scope.showGreenBtn = true
                break;
        }
    });

    if (localStorage.getItem("inKiosk")) {
        $scope.formView = "Перейти в режим электронной подачи";
    } else {
        $scope.formView = "Перейти в режим предзаполнения для личной явки в приемную комиссию";
    }
    $scope.changeView = function () {
        if (localStorage.getItem("inKiosk")) {
            $scope.formView = "Перейти в режим предзаполнения для личной явки в приемную комиссию";
            localStorage.removeItem("inKiosk");
        } else {
            $scope.formView = "Перейти в режим электронной подачи";
            localStorage.setItem("inKiosk", true);
        }
    };

    $scope.openCountryBlock = function (type) {
        $scope.nationality = {type: type}
    };
    $scope.goToForm = function (nationality) {
        sessionStorage.removeItem('formID');
        if (nationality.type == "spec") {
            if (localStorage.getItem('inKiosk')) {
                $window.location.href = "/index.html#!/kiosk";
            } else {
                $window.location.href = "/index.html#!/registration";
            }
        }
        if (nationality.type == "ord") $window.location.href = "/index.html#!/ordRegistration";
        if (nationality.type == "asp") $window.location.href = "/index.html#!/aspRegistration";
    };
    $scope.goToInfo = function (nationality) {
        console.log(nationality.type);
        $window.location = "https://edu.szgmu.ru/ОСОБЕННОСТИ%20ПРИЕМА%20ИНОСТРАННЫХ%20ГРАЖДАН.pdf"
    };

    $scope.getStatementFormForEdit = function (form) {
        sessionStorage.setItem('formID', JSON.stringify(form.id));
        if (form.educationLevelName == "Специалитет") {
            if (localStorage.getItem('inKiosk')) {
                $window.location.href = "/index.html#!/kiosk";
            } else {
                $window.location.href = "/index.html#!/registration";
            }
        }
        if (form.educationLevelName == "Ординатура") $window.location.href = "/index.html#!/ordRegistration";
        if (form.educationLevelName == "Аспирантура") $window.location.href = "/index.html#!/aspRegistration";
    };

    $scope.getStatementForWatch = function (form) {
        sessionStorage.setItem('formID', JSON.stringify(form.id));
        $window.location.href = "/index.html#!/statementInfo";
    };

    $scope.getStatementCopy = function (form) {
        APIService.copySpecForm(form.id).then(function (response) {
            if (response.status == 200) {
                $scope.getUser();
                $scope.copyOk = true;
                $timeout(function () {
                    delete $scope.copyOk;
                }, 5000)
            }
        });
    };

    $scope.logout = function () {
        APIService.getLogout().then(function () {
            $window.location.href = '#!/login';
        }, function () {
            $window.location.href = '#!/login';
        });
    };
});