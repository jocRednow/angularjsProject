app.controller("aspRegistrationFormCtrl", function aspRegistrationFormCtrl($scope, $rootScope, $window, $timeout, $http, APIService) {
    if (localStorage.getItem('userName')) {
        $scope.userName = localStorage.getItem('userName');
    }

    $scope.regexInipa = /^\d{3}-\d{3}-\d{3} \d{2}$/;
    $scope.mobilePhone = /^8 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/;
    $scope.homePhone = /^[0-9]{1,10}$/;
    $scope.emplYears = /^[0-9]$|^[0-9][0-9]$|^([0-9]+)?([.,][0-9]*)$|^([0-9][0-9]+)?([.,][0-9]*)$/;
    $scope.scoreLimit = /^([5-9][0-9]|100)$/;
    $scope.scoreLimit2 = /^(7[5-9]|[8-9][0-9]|100)$/;
    $scope.docSeries2 = /^\d{2}$/;
    $scope.docSeries4 = /^\d{4}$/;
    $scope.docNumber6 = /^\d{6}$/;
    $scope.docNumber6withDash = /^\d{3}-\d{3}$/;
    $scope.docNumber7 = /^\d{7}$/;
    $scope.docNumber14 = /^\d{14}$/;

    $scope.logout = function () {
        APIService.getLogout().then(function () {
            $window.location.href = '#!/login';
        }, function () {
            $window.location.href = '#!/login';
        });
    };

    APIService.getIP().then(function (response) {
        $scope.logInIp = response.data.ip;
    });

    $rootScope.interval = setInterval(function () {
        APIService.checkLogin($scope.logInIp).then(function (response) {
            if (response.status == 401) $window.location.href = '#!/login';
        }, function (response) {
            if (response.status == 401) $window.location.href = '#!/login';
        });
    }, 30000);

    $scope.formData = {};

    if (sessionStorage.getItem('formID')) {
        $scope.formId = sessionStorage.getItem('formID');
        APIService.getAspForm($scope.formId).then(function (response) {
            $scope.formData = response.data;
            if ($scope.formData.otherCountryRegion == null || $scope.formData.otherCountryRegion == undefined) {
                $scope.formData.otherCountryRegion = {id: "РФ", name: "Россия"};
            }
            if ($scope.userName.search('@') != -1 && $scope.formData.email == null) {
                $scope.formData.email = $scope.userName;
            } else if ($scope.userName.search('@') == -1 && $scope.formData.cellularPhone == null) {
                $scope.formData.cellularPhone = $scope.userName;
                $scope.formData.cellularPhone = $scope.formData.cellularPhone.replace("7","8");
            }
        }, function (response) {
            if (response.status == 401) {
                $window.location.href = '#!/login';
            }
        });
    } else {
        APIService.getEmptyAspForm().then(function (response) {
            $scope.formId = response.data.id;
            sessionStorage.setItem('formID', JSON.stringify($scope.formId));
            $scope.formData = response.data;
            $scope.formData.otherCountryRegion = {id: "РФ", name: "Россия"};
            if ($scope.userName.search('@') != -1) {
                $scope.formData.email = $scope.userName;
            } else {
                $scope.formData.cellularPhone = $scope.userName;
                $scope.formData.cellularPhone = $scope.formData.cellularPhone.replace("7","8");
            }
        }, function (response) {
            if (response.status == 401) {
                $window.location.href = '#!/login';
            }
        });
    }

    // Help
    $scope.openHelpBlock = function () {
        APIService.getHelpTypes().then(function (response) {
            $scope.themeList = response.data;
        });
        if ($scope.userName.search('@') != -1) {
            $scope.helpData = {};
            $scope.helpData.email = $scope.userName;
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

    $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });

    $scope.$watch('formData.inipa', function (newVal) {
        if (newVal && newVal.length == 14) {
            var checkSum = parseInt(newVal.slice(-2));

            //строка как массив(для старых браузеров)
            newVal = "" + newVal;
            newVal = newVal.split('');

            var sum = (newVal[0]*9 + newVal[1]*8 + newVal[2]*7 + newVal[4]*6 + newVal[5]*5 + newVal[6]*4 + newVal[8]*3 + newVal[9]*2 + newVal[10]*1);

            if(sum < 100 && sum == checkSum){
                console.log("Inipa is good!");
            }else if((sum == 100 || sum == 101) && checkSum == 0){
                console.log("Inipa is good!");
            }else if(sum > 101 && (sum % 101 == checkSum || (sum % 101 == 100 && checkSum == 0))){
                console.log("Inipa is good!");
            }else{
                $scope.formData.inipa = null;
            }
        }
    });

    $scope.$watch('sameInstName', function (newVal) {
        if (newVal == true) {
            if ($scope.formData.instName) $scope.formData.eduCardIssueBy = $scope.formData.instName;
            else if ($scope.formData.highSchool) $scope.formData.eduCardIssueBy = $scope.formData.highSchool.name;
        }
        else $scope.formData.eduCardIssueBy = null;
    });
    $scope.$watch('sameSeriesAndNumber', function (newVal) {
        if (newVal == true) {
            $scope.formData.eduCardApplSeries = $scope.formData.eduCardSeries;
            $scope.formData.eduCardApplNumber = $scope.formData.eduCardNumber;
        }
        else {
            $scope.formData.eduCardApplSeries = null;
            $scope.formData.eduCardApplNumber = null;
        }
    });


    // 1 TAB
    APIService.getGenders().then(function (response) {
        $scope.genderList = response.data;
    });
    APIService.getAddressCountryRegiones().then(function (response) {
        $scope.addressCountryList = response.data;
    });
    APIService.getIdentityCards().then(function (response) {
        $scope.identityCardList = response.data;
    });
    APIService.getAcadamyYears().then(function (response) {
        $scope.acadamyYears = response.data;
    });
    // END 1 TAB
    // 2 TAB
    $scope.loadSecond = function () {};
    // END 2 TAB
    // 3 TAB
    $scope.loadThird = function () {
        APIService.getHighSchools().then(function (response) {
            $scope.highSchoolsList = response.data;
        });
        APIService.getEduLevels($scope.formData.educationLevel.id).then(function (response) {
            $scope.eduLevels = response.data;
        });
        if ($scope.formData.eduLevel) {
            APIService.getEduDocs($scope.formData.eduLevel.id, $scope.formData.educationLevel.id).then(function (response) {
                $scope.eduDocList = response.data;
            });
        }
        APIService.getLangInfo().then(function (response) {
            $scope.langInfoList = response.data;
        });
        APIService.getLanguages().then(function (response) {
            $scope.languagesList = response.data;
        });
    };
    // END 3 TAB
    // 4 TAB
    $scope.loadFourth = function () {
        APIService.getAspPreferenceIndividualAchievements().then(function (response) {
            $scope.individualAchievementsList = response.data;
        });
    };
    // END 4 TAB
    // 5 TAB
    $scope.loadFifth = function () {
        APIService.getSoldiery().then(function (response) {
            $scope.soldieryList = response.data;
        });
        APIService.getSoldieryStatus().then(function (response) {
            $scope.soldieryStatusList = response.data;
        });
        APIService.getMilitaryFormDocs().then(function (response) {
            $scope.militaryFormDocsList = response.data;
        });
    };
    // END 5 TAB
    // 6 TAB
    $scope.loadSixth = function () {
        APIService.getAspDirections().then(function (response) {
            $scope.aspDirectionsList = response.data;
        });
        APIService.getDeliveryType().then(function (response) {
            $scope.deliveryTypeList = response.data;
        });
    };
    // END 6 TAB


    $scope.addNewField = function($event, items) {
        if (items.length != 5) {
            items.push({id: null});
            setTimeout(function () {$('[data-toggle="tooltip"]').tooltip();}, 1000);
        } else {
            return false;
        }
    };
    $scope.removeLastField = function (items) {
        if (items.length > 1) {
            var lastItem = items.length - 1;
            items.splice(lastItem);
        } else {
            return false;
        }
    };
    $scope.removeField = function (item, list) {
        if (list.length > 1) {
            var index = list.indexOf(item);
            list.splice(index, 1);
        } else {
            return false;
        }
    };

    $scope.addNewFieldWithInner = function($event, items) {
        if (items.length != 5) {
            items.push({id: null, documents: [{id: null}]});
            setTimeout(function () {$('[data-toggle="tooltip"]').tooltip();}, 1000);
        } else {
            return false;
        }
    };
    $scope.removeLastFieldHard = function (items, name) {
        if (items.length > 1) {
            var lastItem = items.length - 1;
            var lastBlock = items.slice(-1)[0];
            if (lastBlock.id != null) {
                APIService.deleteField(lastBlock.id).then(function (response) {
                    if (response.status == 200) items.splice(lastItem);
                });
            } else {
                items.splice(lastItem);
            }
        } else if (name == "individualAchievements") {
            var lastItem = items.length - 1;
            var lastBlock = items.slice(-1)[0];
            if (lastBlock.id != null) {
                APIService.deleteField(lastBlock.id).then(function (response) {
                    if (response.status == 200) items.splice(lastItem);
                });
            } else {
                items.splice(lastItem);
            }
        } else {
            return false;
        }
    };
    $scope.removeFieldHard = function (item, list, name) {
        if (list.length > 1) {
            var index = list.indexOf(item);
            if (item.id != null) {
                APIService.deleteField(item.id).then(function (response) {
                    if (response.status == 200) list.splice(index, 1);
                });
            } else {
                list.splice(index, 1);
            }
        } else if (name == "individualAchievements") {
            var index = list.indexOf(item);
            if (item.id != null) {
                APIService.deleteField(item.id).then(function (response) {
                    if (response.status == 200) list.splice(index, 1);
                });
            } else {
                list.splice(index, 1);
            }
        } else {
            return false;
        }
    };

    $scope.$watch('formData.lastName', function (newVal) {
        if ($scope.formData) {
            // Для ФИО
            if (newVal != undefined && $scope.formData.firstName && $scope.formData.middleName) {
                $scope.formData.name = newVal + " " + $scope.formData.firstName + " " + $scope.formData.middleName;
            } else if (newVal != undefined && $scope.formData.firstName) {
                $scope.formData.name = newVal + " " + $scope.formData.firstName;
            }
        }
    });
    $scope.$watch('formData.firstName', function (newVal) {
        if ($scope.formData) {
            // Для ФИО
            if (newVal != undefined && $scope.formData.lastName && $scope.formData.middleName) {
                $scope.formData.name = $scope.formData.lastName + " " + newVal + " " + $scope.formData.middleName;
            } else if (newVal != undefined && $scope.formData.lastName) {
                $scope.formData.name = $scope.formData.lastName + " " + newVal;
            }
        }
    });
    $scope.$watch('formData.middleName', function (newVal) {
        if ($scope.formData) {
            // Для ФИО
            if (newVal != undefined && $scope.formData.lastName && $scope.formData.firstName) {
                $scope.formData.name = $scope.formData.lastName + " " + $scope.formData.firstName + " " + newVal;
            }
        }
    });

    //  Для ФИО в родительном падеже
    /*$scope.addToGenitive = function () {
        if ($scope.formData.contactPersonNameGenitive == null) {
            $scope.formData.contactPersonNameGenitive = $scope.formData.name;
        }
    };*/

    // Addresses
    $scope.refreshAddressResults =  function ($select, name) {
        var search = $select.search,
            list = angular.copy($select.items),
            FLAG = -1;
        //remove last user input
        list = list.filter(function(item) {
            return item.id !== FLAG;
        });

        if (!search) {
            //use the predefined list
            $select.items = list;
        }
        else {
            if (search && name == 'Адрес регистрации') {
                APIService.getAddress(search).then(function(response) {
                    if (response.data != 'Empty') $scope.addresses = response.data;
                });
            }
            if (search && name == 'Адрес фактический') {
                APIService.getAddress(search).then(function(response) {
                    if (response.data != 'Empty') $scope.addresses = response.data;
                });
            }
            if (search && name == 'Адрес временной регистрации') {
                APIService.getAddress(search).then(function(response) {
                    if (response.data != 'Empty') $scope.addresses = response.data;
                });
            }
            //manually add user input and set selection
            var userInputItem = {
                id: FLAG,
                value: search
            };
            $select.items = [userInputItem].concat(list);
            $select.selected = userInputItem;
        }
    };
    $scope.clearAddress = function ($event, $select, name){
        $event.stopPropagation();
        if (name == 'Адрес регистрации') {
            $select.selected = undefined;
            $select.search = undefined;
            $select.activate();
            $scope.addresses = [];
            $scope.formData.addresses[0].addressSearch = {id : null, value : null};
        }
        if (name == 'Адрес фактический') {
            $select.selected = undefined;
            $select.search = undefined;
            $select.activate();
            $scope.addresses = [];
            $scope.formData.addresses[1].addressSearch = {id : null, value : null};
        }
        if (name == 'Адрес временной регистрации') {
            $select.selected = undefined;
            $select.search = undefined;
            $select.activate();
            $scope.addresses = [];
            $scope.formData.addresses[2].addressSearch = {id : null, value : null};
        }
    };
    $scope.changeAgain = function ($select, name) {
        if ($select.selected.value && $select.selected.value.length > 0 && name == 'Адрес регистрации') {
            $select.search = $select.selected.value;
            APIService.getAddress($select.selected.value).then(function(response) {
                $scope.addresses = response.data;
                /*$select.selected.value = $select.items.value;
                $select.search = $scope.addresses[0].value;
                $scope.formData.addresses[0].addressSearch = $select.selected.value;*/
            });
        }
        if ($select.selected.value && $select.selected.value.length > 0 && name == 'Адрес фактический') {
            $select.search = $select.selected.value;
            APIService.getAddress($select.selected.value).then(function(response) {
                $scope.addresses = response.data;
            });
        }
        if ($select.selected.value && $select.selected.value.length > 0 && name == 'Адрес временной регистрации') {
            $select.search = $select.selected.value;
            APIService.getAddress($select.selected.value).then(function(response) {
                $scope.addresses = response.data;
            });
        }
    };
    $scope.$watchCollection('[formData.addresses[0].addressSearch, formData.addresses[1].addressSearch, formData.addresses[2].addressSearch]', function (newVal) {
        if (newVal[0] && newVal[0].value && newVal[1] && newVal[1].value) {
            $scope.addressesValid = true;
        } else {
            $scope.addressesValid = false;
        }
    });
    $scope.$watch('homeAsReg', function (newVal) {
        if (newVal == true) {
            $scope.formData.addresses[1].addressSearch.value = $scope.formData.addresses[0].addressSearch.value;
            $scope.formData.addresses[1].postalCode = $scope.formData.addresses[0].postalCode
        }
        else {
            if ($scope.formData.addresses) {
                $scope.formData.addresses[1].addressSearch = {id : null, value : null};
                $scope.formData.addresses[1].postalCode = null;
            }
        }
    });

    $scope.$watch('formData.identityCard', function (newVal) {
        if (newVal) setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
    });
    $scope.$watch('formData.langInfo', function (newVal) {
        if (newVal && newVal.name == 'Изучал') $('[data-toggle="tooltip"]').tooltip();
    });
    $scope.$watch('formData.eduDoc', function (newVal) {
        if (newVal) setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
    });
    $scope.$watch('formData.soldiery', function (newVal) {
        if (newVal && newVal.id == 'Военнообязанный') setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
    });
    $scope.$watch('formData.soldieryStatus', function (newVal) {
        if (newVal && newVal.id == 1) setTimeout(function () {
            $('[data-toggle="tooltip"]').tooltip();
        }, 500);
    });
    $scope.$watch('formData.militaryFormDoc', function (newVal) {
        if (newVal && newVal.id != 0) setTimeout(function () {
            $('[data-toggle="tooltip"]').tooltip();
        }, 500);
    });

    $scope.$watch('formData.instNameCheck', function (newVal) {
        setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
        if (newVal == true) $scope.formData.highSchool = null;
        else if (newVal == false) $scope.formData.instName = null;
    });

    $scope.$watch('formData.applications[0].aspSpeciality', function (newVal) {
        if (newVal) {
            APIService.getAspDirectivity(newVal.specialityId).then(function (response) {
                $scope.aspDirectionsSpecList = response.data;
            });
        }
    });
    $scope.$watch('formData.applications[0].aspDerectivity', function (newVal) {
        if (newVal) {
            APIService.getAspConditions($scope.formData.applications[0].aspSpeciality.specialityId, newVal.directivityId).then(function (response) {
                $scope.evironmentSpecDirList = response.data;
            });
        }
    });
    $scope.$watch('formData.applications[0].applicationLines', function (newVal) {
        if (newVal) {
            var index = 1;
            angular.forEach(newVal, function (item) {
                item.priority = index;
                index++;
            });
        }
    });

    $scope.changeIdentityCard = function () {
        $scope.formData.identityCardSeries = null;
        $scope.formData.identityCardNumber = null;
        $scope.formData.identityCardIssueDep = null;
        $scope.formData.identityCardIssueDate = null;
        $scope.formData.identityCardIssueBy = null;
    };

    $scope.changeEduCountryRegion = function () {
        $scope.formData.eduState = null;
    };

    $scope.changeEduLevel = function () {
        $scope.formData.eduDoc = null;
        APIService.getEduDocs($scope.formData.eduLevel.id, $scope.formData.educationLevel.id).then(function (response) {
            $scope.eduDocList = response.data;
        });
    };

    $scope.changeEduDoc = function () {
        $scope.formData.eduCardSeries = null;
        $scope.formData.eduCardNumber = null;
        $scope.formData.eduCardIssueDate = null;
        $scope.formData.eduCardIssueBy = null;
        $scope.formData.eduCardApplSeries = null;
        $scope.formData.eduCardApplNumber = null;
    };

    $scope.changeLangInfo = function () {
        setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
        $scope.formData.languages = [{id: null}]
    };

    $scope.changePreference = function (achievement) {
        achievement.documents = [{id: null}];
    };

    $scope.changeDocType = function (doc) {
        setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
        doc.acadamyYear = null;
        doc.altDocName = null;
        doc.articleName = null;
        doc.authors = null;
        doc.description = null;
        doc.docGrantDate = null;
        doc.docIssueBy = null;
        doc.docIssueDate = null;
        doc.docName = null;
        doc.docNumber = null;
        doc.docQuantity = null;
        doc.docSeries = null;
        doc.docType = null;
        doc.documentKind = null;
        doc.speciality = null;
    };

    $scope.changeSpec = function () {
        $scope.formData.applications[0].aspDerectivity = null;
        $scope.formData.applications[0].applicationLines = [];
    };
    $scope.changeDerect = function () {
        $scope.formData.applications[0].applicationLines = [];
    };

    $scope.$watchCollection('[formData.individualAchievements[0].preference, formData.individualAchievements[1].preference, formData.individualAchievements[2].preference, ' +
        'formData.individualAchievements[3].preference, formData.individualAchievements[4].preference]', function (newVal) {
        setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
        if (newVal[0]) {
            APIService.getDocumentsByPrefId(newVal[0].id).then(function (response) {
                $scope.achievementDocList = response.data;
            });
        }
        if (newVal[1]) {
            APIService.getDocumentsByPrefId(newVal[1].id).then(function (response) {
                $scope.achievementDocList = response.data;
            });
        }
        if (newVal[2]) {
            APIService.getDocumentsByPrefId(newVal[2].id).then(function (response) {
                $scope.achievementDocList = response.data;
            });
        }
        if (newVal[3]) {
            APIService.getDocumentsByPrefId(newVal[3].id).then(function (response) {
                $scope.achievementDocList = response.data;
            });
        }
        if (newVal[4]) {
            APIService.getDocumentsByPrefId(newVal[4].id).then(function (response) {
                $scope.achievementDocList = response.data;
            });
        }
    });

    $scope.loadTheService = function (tabNumber) {
        $scope.currentTab = tabNumber;
        // 2 TAB
        if (tabNumber == 2 && !$scope.secondTabLoaded) {
            $scope.loadSecond();
            $scope.secondTabLoaded = true;
        }
        // END 2 TAB
        // 3 TAB
        if (tabNumber == 3 && !$scope.thirdTabLoaded) {
            $scope.loadThird();
            $scope.thirdTabLoaded = true;
        }
        // END 3 TAB
        // 4 TAB
        if (tabNumber == 4 && !$scope.fourthTabLoaded) {
            $scope.loadFourth();
            $scope.fourthTabLoaded = true;
        }
        // END 4 TAB
        // 5 TAB
        if (tabNumber == 5 && !$scope.fifthTabLoaded) {
            $scope.loadFifth();
            $scope.fifthTabLoaded = true;
        }
        // END 5 TAB
        // 6 TAB
        if (tabNumber == 6 && !$scope.sixthTabLoaded) {
            $scope.loadSixth();
            $scope.sixthTabLoaded = true;
        }
        // END 6 TAB
    };

    $scope.sendDraftFormData = function () {
        APIService.postAspValidForm($scope.formData).then(function (response) {
            if (response.status == 200) {
                console.log("DRAFT.");
                APIService.getAspForm($scope.formId).then(function (response) {
                    $scope.formData = response.data;
                });
            }
        });
    };

    $scope.saveFormData = function () {
        APIService.postAspValidForm($scope.formData).then(function (response) {
            if (response.status == 200) {
                console.log("SAVED.");
            }
        });
    };

    $scope.sendFormDataToPK = function () {
        APIService.postAspValidForm($scope.formData).then(function (response) {
            if (response.status == 200) {
                APIService.postAspToPKFormData($scope.formData.id).then(function (response) {
                    if (response.status == 200) {
                        console.log("SEND.");
                        $window.location.href = '#!/privateOffice';
                    }
                });
            }
        });
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

    // Move by tab
    $scope.currentTab = 1;
    $scope.nextTab = function () {
        $scope.currentTab = ++$scope.currentTab;
        $scope.loadTheService($scope.currentTab);
        $timeout(function () {
            if (!$scope.$$phase) {
                $('.menu-toggle.active').next('li').find('a').click();
            }
        }, 300, false);
    };
    $scope.prevTab = function () {
        $scope.currentTab = --$scope.currentTab;
        $scope.loadTheService($scope.currentTab);
        $timeout(function () {
            if (!$scope.$$phase) {
                $('.menu-toggle.active').prev('li').find('a').click();
            }
        }, 300, false);
    };
});