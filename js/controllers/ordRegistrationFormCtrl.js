app.controller("ordRegistrationFormCtrl", function ordRegistrationFormCtrl($scope, $rootScope, $window, $timeout, $http, APIService) {
    if (localStorage.getItem('userName')) {
        $scope.userName = localStorage.getItem('userName');
    }

    $scope.regexInipa = /^\d{3}-\d{3}-\d{3} \d{2}$/;
    $scope.mobilePhone = /^8 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/;
    $scope.middleScoreFractional = /^[3-5]$|^([3-5]+)?([.,][0-9]*)$/;
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
        APIService.getOrdForm($scope.formId).then(function (response) {
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
        APIService.getEmptyOrdForm().then(function (response) {
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

    $scope.$watchCollection('[formData.educations[0].sameInstName, formData.educations[1].sameInstName, formData.educations[2].sameInstName,' +
        'formData.educations[3].sameInstName, formData.educations[4].sameInstName, ]', function (newVal) {
        if (newVal[0] == true) {
            if ($scope.formData.educations[0].instName) $scope.formData.educations[0].eduCardIssueBy = $scope.formData.educations[0].instName;
            else if ($scope.formData.educations[0].inst) $scope.formData.educations[0].eduCardIssueBy = $scope.formData.educations[0].inst.name;
        } else if (newVal[0] == false) {
            $scope.formData.educations[0].eduCardIssueBy = null;
        }
        if (newVal[1] == true) {
            if ($scope.formData.educations[1].instName) $scope.formData.educations[1].eduCardIssueBy = $scope.formData.educations[1].instName;
            else if ($scope.formData.educations[1].inst) $scope.formData.educations[1].eduCardIssueBy = $scope.formData.educations[1].inst.name;
        } else if (newVal[1] == false) {
            $scope.formData.educations[1].eduCardIssueBy = null;
        }
        if (newVal[2] == true) {
            if ($scope.formData.educations[2].instName) $scope.formData.educations[2].eduCardIssueBy = $scope.formData.educations[2].instName;
            else if ($scope.formData.educations[2].inst) $scope.formData.educations[2].eduCardIssueBy = $scope.formData.educations[2].inst.name;
        } else if (newVal[2] == false) {
            $scope.formData.educations[2].eduCardIssueBy = null;
        }
        if (newVal[3] == true) {
            if ($scope.formData.educations[3].instName) $scope.formData.educations[3].eduCardIssueBy = $scope.formData.educations[3].instName;
            else if ($scope.formData.educations[3].inst) $scope.formData.educations[3].eduCardIssueBy = $scope.formData.educations[3].inst.name;
        } else if (newVal[3] == false) {
            $scope.formData.educations[3].eduCardIssueBy = null;
        }
        if (newVal[4] == true) {
            if ($scope.formData.educations[4].instName) $scope.formData.educations[4].eduCardIssueBy = $scope.formData.educations[4].instName;
            else if ($scope.formData.educations[4].inst) $scope.formData.educations[4].eduCardIssueBy = $scope.formData.educations[4].inst.name;
        } else if (newVal[4] == false) {
            $scope.formData.educations[4].eduCardIssueBy = null;
        }
    });
    $scope.$watchCollection('[formData.educations[0].sameSeriesAndNumber, formData.educations[1].sameSeriesAndNumber, formData.educations[2].sameSeriesAndNumber,' +
        'formData.educations[3].sameSeriesAndNumber, formData.educations[4].sameSeriesAndNumber, ]', function (newVal) {
        if (newVal[0] == true) {
            $scope.formData.educations[0].eduCardApplSeries = $scope.formData.educations[0].eduCardSeries;
            $scope.formData.educations[0].eduCardApplNumber = $scope.formData.educations[0].eduCardNumber;
        } else if (newVal[0] == false) {
            $scope.formData.educations[0].eduCardApplSeries = null;
            $scope.formData.educations[0].eduCardApplNumber = null;
        }
        if (newVal[1] == true) {
            $scope.formData.educations[1].eduCardApplSeries = $scope.formData.educations[1].eduCardSeries;
            $scope.formData.educations[1].eduCardApplNumber = $scope.formData.educations[1].eduCardNumber;
        } else if (newVal[1] == false) {
            $scope.formData.educations[1].eduCardApplSeries = null;
            $scope.formData.educations[1].eduCardApplNumber = null;
        }
        if (newVal[2] == true) {
            $scope.formData.educations[2].eduCardApplSeries = $scope.formData.educations[2].eduCardSeries;
            $scope.formData.educations[2].eduCardApplNumber = $scope.formData.educations[2].eduCardNumber;
        } else if (newVal[2] == false) {
            $scope.formData.educations[2].eduCardApplSeries = null;
            $scope.formData.educations[2].eduCardApplNumber = null;
        }
        if (newVal[3] == true) {
            $scope.formData.educations[3].eduCardApplSeries = $scope.formData.educations[3].eduCardSeries;
            $scope.formData.educations[3].eduCardApplNumber = $scope.formData.educations[3].eduCardNumber;
        } else if (newVal[3] == false) {
            $scope.formData.educations[3].eduCardApplSeries = null;
            $scope.formData.educations[3].eduCardApplNumber = null;
        }
        if (newVal[4] == true) {
            $scope.formData.educations[4].eduCardApplSeries = $scope.formData.educations[4].eduCardSeries;
            $scope.formData.educations[4].eduCardApplNumber = $scope.formData.educations[4].eduCardNumber;
        } else if (newVal[4] == false) {
            $scope.formData.educations[4].eduCardApplSeries = null;
            $scope.formData.educations[4].eduCardApplNumber = null;
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
    APIService.getDocTypes().then(function (response) {
        $scope.docTypesList = response.data;
    });
    // END 1 TAB
    // 2 TAB
    $scope.loadSecond = function () {};
    // END 2 TAB
    // 3 TAB
    $scope.loadThird = function () {
        APIService.getAddressState().then(function (response) {
            $scope.addressStateList = response.data;
        });
        APIService.getHighSchools().then(function (response) {
            $scope.highSchoolsList = response.data;
        });
        APIService.getEduLevels($scope.formData.educationLevel.id).then(function (response) {
            $scope.eduLevels = response.data;
        });
        if ($scope.formData.educations[0].eduLevel) {
            APIService.getEduDocs($scope.formData.educations[0].eduLevel.id, $scope.formData.educationLevel.id).then(function (response) {
                $scope.eduDocList = response.data;
            });
            APIService.getSpecList($scope.formData.educations[0].eduLevel.id).then(function (response) {
                $scope.specialityList = response.data;
            });
        }
        if ($scope.formData.educations[1] && $scope.formData.educations[1].eduLevel) {
            APIService.getEduDocs($scope.formData.educations[1].eduLevel.id, $scope.formData.educationLevel.id).then(function (response) {
                $scope.eduDocList = response.data;
            });
            APIService.getSpecList($scope.formData.educations[1].eduLevel.id).then(function (response) {
                $scope.specialityList = response.data;
            });
        }
        if ($scope.formData.educations[2] && $scope.formData.educations[2].eduLevel) {
            APIService.getEduDocs($scope.formData.educations[2].eduLevel.id, $scope.formData.educationLevel.id).then(function (response) {
                $scope.eduDocList = response.data;
            });
            APIService.getSpecList($scope.formData.educations[2].eduLevel.id).then(function (response) {
                $scope.specialityList = response.data;
            });
        }
        if ($scope.formData.educations[3] && $scope.formData.educations[3].eduLevel) {
            APIService.getEduDocs($scope.formData.educations[3].eduLevel.id, $scope.formData.educationLevel.id).then(function (response) {
                $scope.eduDocList = response.data;
            });
            APIService.getSpecList($scope.formData.educations[3].eduLevel.id).then(function (response) {
                $scope.specialityList = response.data;
            });
        }
        if ($scope.formData.educations[4] && $scope.formData.educations[4].eduLevel) {
            APIService.getEduDocs($scope.formData.educations[4].eduLevel.id, $scope.formData.educationLevel.id).then(function (response) {
                $scope.eduDocList = response.data;
            });
            APIService.getSpecList($scope.formData.educations[4].eduLevel.id).then(function (response) {
                $scope.specialityList = response.data;
            });
        }
        APIService.getLangInfo().then(function (response) {
            $scope.langInfoList = response.data;
        });
        APIService.getLanguages().then(function (response) {
            $scope.languagesList = response.data;
        });
        APIService.getLanguageLevel().then(function (response) {
            $scope.languagesLevelList = response.data;
        })
    };
    // END 3 TAB
    // 4 TAB
    $scope.loadFourth = function () {
        APIService.getOrdPreferenceIndividualAchievements().then(function (response) {
            $scope.individualAchievementsList = response.data;
        });
    };
    // END 4 TAB
    // 5 TAB
    $scope.loadFifth = function () {};
    // END 5 TAB
    // 6 TAB
    $scope.loadSixth = function () {
        APIService.getFamRelationship().then(function (response) {
            $scope.famRelationshipList = response.data;
        });
    };
    // END 6 TAB
    // 7 TAB
    $scope.loadSeventh = function () {
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
    // END 7 TAB
    // 8 TAB
    $scope.loadEighth = function () {
        APIService.getAccredTest().then(function (response) {
            $scope.accredTestList = response.data;
        });
        APIService.getTestOrganizations().then(function (response) {
            $scope.testOrganizationsList = response.data;
        });
    };
    // END 8 TAB
    // 9 TAB
    $scope.loadNinth = function () {
        APIService.getOrdSpecialities().then(function (response) {
            $scope.ordSpecialitiesList = response.data;
            if ($scope.formData.applications[0].ordApplications[0].speciality != null) {
                APIService.getOrdSpecialities().then(function (response) {
                    $scope.ordSpecialitiesList2 = response.data;
                    angular.forEach($scope.ordSpecialitiesList2, function (item) {
                        if (item.specialityId == $scope.formData.applications[0].ordApplications[0].speciality.specialityId) {
                            $scope.ordSpecialitiesList2.splice($scope.ordSpecialitiesList2.indexOf(item), 1);
                        }
                    });
                });
            }
        });

        APIService.getDeliveryType().then(function (response) {
            $scope.deliveryTypeList = response.data;
        });
    };
    // END 9 TAB

    $scope.addNewField = function($event, items, name) {
        if (items.length != 5) {
            if (name == 'edu') {
                items.push({id: null, instNameCheck: false, sertInstNameCheck: false});
            } else {
                items.push({id: null});
            }
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

    // for relatives address
    $scope.setIndex = function () {
        var count = 1;
        angular.forEach($scope.formData.relatives, function (item) {
            item.index = count++;
        });
    };
    $scope.$watch('formData.relatives', function (newVal) {
        if (newVal) {
            var count = 1;
            angular.forEach($scope.formData.relatives, function (item) {
                item.index = count++;
            });
        }
    });

    // ADDRESSES
    $scope.refreshAddressResults =  function ($select) {
        var searchData = {
            level: null,
            name: $select.search,
            refId: null
        }

        if ($select.search) {
            APIService.getAddress(searchData).then(function(response) {
                if (response.status == 200) {
                    $scope.addresses = response.data;
                }
            });
        }
    };
    $scope.refreshInnerAddress = function ($select, item, allAddress) {
        var searchData = {
            level: item.level,
            name: $select.search,
            refId: item.refId,
            dto: allAddress
        }

        if ($select.search) {
            APIService.getInnerAddress(searchData).then(function(response) {
                if (response.status == 200) {
                    if (item && item.level == 0) {
                        $scope.serverCountriesRequest = response.data;
                    } else if (item && item.level == 1) {
                        $scope.serverSubRequest = response.data;
                    } else if (item && item.level == 3) {
                        $scope.serverRegionRequest = response.data;
                    } else if (item && item.level == 4) {
                        $scope.serverCityRequest = response.data;
                    } else if (item && item.level == 5) {
                        $scope.serverInnerTerritoryRequest = response.data;
                    } else if (item && item.level == 6) {
                        $scope.serverTownRequest = response.data;
                    } else if (item && item.level == 7) {
                        $scope.serverStreetRequest = response.data;
                    } else if (item && item.level == 65) {
                        $scope.server65Request = response.data;
                    } else if (item && item.level == 91) {
                        $scope.server91Request = response.data;
                    } else if (item && item.level == 100) {
                        $scope.serverHouseRequest = response.data;
                    }
                }
            });
        }
    };
    $scope.setFlat = function (data, typeObj) {
        angular.forEach($scope.formData.addressesDto, function (item) {
            if (item.addressType.name === typeObj.name) {
                if (data.level == 100) {item.house = data}
                else if (data.level == 'undefined') {item.flat = data}
                APIService.getDataAddressFlat(item).then(function(response) {
                    if (item.addressType.name === typeObj.name) {
                        $scope.addresses = [];
                        $scope.serverCountriesRequest = [];
                        $scope.serverSubRequest = [];
                        $scope.serverRegionRequest = [];
                        $scope.serverCityRequest = [];
                        $scope.serverTownRequest = [];
                        $scope.serverInnerTerritoryRequest = [];
                        $scope.server65Request = [];
                        $scope.server91Request = [];
                        $scope.serverStreetRequest = [];
                        $scope.serverHouseRequest = [];

                        item.addressSearchObj = response.data.addressSearchObj;
                        item.countryRegion = response.data.countryRegion;
                        item.aolevel1 = response.data.aolevel1;
                        item.aolevel3 = response.data.aolevel3;
                        item.aolevel4 = response.data.aolevel4;
                        item.aolevel6 = response.data.aolevel6;
                        item.aolevel5 = response.data.aolevel5;
                        item.aolevel65 = response.data.aolevel65;
                        item.aolevel91 = response.data.aolevel91;
                        item.aolevel7 = response.data.aolevel7;
                        item.house = response.data.house;
                        item.flat = response.data.flat;
                        item.addressSearchText = response.data.addressSearchText;
                        item.addressTxt = response.data.addressTxt;
                        item.addressTxtRandom = response.data.addressTxtRandom;
                    }
                })
            }
        });
    };
    $scope.clearAddress = function ($event, $select, name, index){
        $event.stopPropagation();

        $select.selected = undefined;
        $select.search = undefined;
        $select.activate();
        $scope.addresses = [];
        if (name == 'Адрес регистрации') {
            // $scope.formData.addresses[0].addressSearch = {id : null, value : null};
            $scope.formData.addressesDto[0] = {
                addressId: null,
                addressSearchObj: null,
                addressSearchText: null,
                addressTxt: null,
                addressTxtRandom: null,
                addressType: {id: 0, name: "Адрес регистрации"},
                aolevel1: {level: 1, refId: null, name: null},
                aolevel2: {level: 2, refId: null, name: null},
                aolevel3: {level: 3, refId: null, name: null},
                aolevel4: {level: 4, refId: null, name: null},
                aolevel5: {level: 5, refId: null, name: null},
                aolevel6: {level: 6, refId: null, name: null},
                aolevel7: {level: 7, refId: null, name: null},
                aolevel65: {level: 65, refId: null, name: null},
                aolevel90: {level: 90, refId: null, name: null},
                aolevel91: {level: 91, refId: null, name: null},
                countryRegion: {level: 0, refId: null, name: null},
                flat: null,
                postalCode: null,
                house: {level: 100, refId: null, name: null}
            }
        }
        if (name == 'Адрес фактический') {
            // $scope.formData.addresses[1].addressSearch = {id : null, value : null};
            $scope.formData.addressesDto[0] = {
                addressId: null,
                addressSearchObj: null,
                addressSearchText: null,
                addressTxt: null,
                addressTxtRandom: null,
                addressType: {id: 1, name: "Адрес фактический"},
                aolevel1: {level: 1, refId: null, name: null},
                aolevel2: {level: 2, refId: null, name: null},
                aolevel3: {level: 3, refId: null, name: null},
                aolevel4: {level: 4, refId: null, name: null},
                aolevel5: {level: 5, refId: null, name: null},
                aolevel6: {level: 6, refId: null, name: null},
                aolevel7: {level: 7, refId: null, name: null},
                aolevel65: {level: 65, refId: null, name: null},
                aolevel90: {level: 90, refId: null, name: null},
                aolevel91: {level: 91, refId: null, name: null},
                countryRegion: {level: 0, refId: null, name: null},
                flat: null,
                postalCode: null,
                house: {level: 100, refId: null, name: null}
            }
        }
        if (name == 'Адрес временной регистрации') {
            // $scope.formData.addresses[2].addressSearch = {id : null, value : null};
            $scope.formData.addressesDto[2] = {
                addressId: null,
                addressSearchObj: null,
                addressSearchText: null,
                addressTxt: null,
                addressTxtRandom: null,
                addressType: {id: 2, name: "Адрес временной регистрации"},
                aolevel1: {level: 1, refId: null, name: null},
                aolevel2: {level: 2, refId: null, name: null},
                aolevel3: {level: 3, refId: null, name: null},
                aolevel4: {level: 4, refId: null, name: null},
                aolevel5: {level: 5, refId: null, name: null},
                aolevel6: {level: 6, refId: null, name: null},
                aolevel7: {level: 7, refId: null, name: null},
                aolevel65: {level: 65, refId: null, name: null},
                aolevel90: {level: 90, refId: null, name: null},
                aolevel91: {level: 91, refId: null, name: null},
                countryRegion: {level: 0, refId: null, name: null},
                flat: null,
                postalCode: null,
                house: {level: 100, refId: null, name: null}
            }
        }
        /*if (name == 'person' && index == 1) {
            $scope.formData.relatives[0].address.addressSearch = {id : null, value : null};
        }
        if (name == 'person' && index == 2) {
            $scope.formData.relatives[1].address.addressSearch = {id : null, value : null};
        }
        if (name == 'person' && index == 3) {
            $scope.formData.relatives[2].address.addressSearch = {id : null, value : null};
        }
        if (name == 'person' && index == 4) {
            $scope.formData.relatives[3].address.addressSearch = {id : null, value : null};
        }
        if (name == 'person' && index == 5) {
            $scope.formData.relatives[4].address.addressSearch = {id : null, value : null};
        }*/
    };
    $scope.selectField = function (item, typeObj) {
        APIService.getFillAddress(item).then(function(response) {
            angular.forEach($scope.formData.addressesDto, function (item) {
                if (item.addressType.name === typeObj.name) {
                    $scope.addresses = [];
                    $scope.serverCountriesRequest = [];
                    $scope.serverSubRequest = [];
                    $scope.serverRegionRequest = [];
                    $scope.serverCityRequest = [];
                    $scope.serverTownRequest = [];
                    $scope.serverInnerTerritoryRequest = [];
                    $scope.server65Request = [];
                    $scope.server91Request = [];
                    $scope.serverStreetRequest = [];
                    $scope.serverHouseRequest = [];

                    item.addressSearchObj = response.data.addressSearchObj;
                    item.countryRegion = response.data.countryRegion;
                    item.aolevel1 = response.data.aolevel1;
                    item.aolevel3 = response.data.aolevel3;
                    item.aolevel4 = response.data.aolevel4;
                    item.aolevel6 = response.data.aolevel6;
                    item.aolevel5 = response.data.aolevel5;
                    item.aolevel65 = response.data.aolevel65;
                    item.aolevel91 = response.data.aolevel91;
                    item.aolevel7 = response.data.aolevel7;
                    item.house = response.data.house;
                    item.flat = response.data.flat;
                    item.addressSearchText = response.data.addressSearchText;
                    item.addressTxt = response.data.addressTxt;
                    item.addressTxtRandom = response.data.addressTxtRandom;
                }
            });
        });
    };
    $scope.changeAgain = function ($select, name) {
        /*if ($select.selected) {
            if ($select.selected.name && $select.selected.name.length > 0 && name == 'Адрес регистрации') {
                // $select.search = $select.selected.name;
                var searchData = {level: null, name: $select.selected.name, refId: null}
                APIService.getAddress(searchData).then(function(response) {
                    $scope.addresses = response.data;
                });
            }
            if ($select.selected.value && $select.selected.value.length > 0 && name == 'Адрес фактический') {
                var searchData = {level: null, name: $select.selected.name, refId: null}
                APIService.getAddress(searchData).then(function(response) {
                    $scope.addresses = response.data;
                });
            }
            if ($select.selected.value && $select.selected.value.length > 0 && name == 'Адрес временной регистрации') {
                var searchData = {level: null, name: $select.selected.name, refId: null}
                APIService.getAddress(searchData).then(function(response) {
                    $scope.addresses = response.data;
                });
            }
            /!*if ($select.selected.value && $select.selected.value.length > 0 && name == 'person') {
                var searchData = {level: null, name: $select.selected.name, refId: null}
                APIService.getAddress(searchData).then(function(response) {
                    $scope.addresses = response.data;
                });
            }*!/
        }*/
    };
    $scope.$watchCollection('[formData.addressesDto[0].countryRegion, formData.addressesDto[1].countryRegion]', function (newVal) {
        if (newVal[0] && newVal[0].name && newVal[1] && newVal[1].name) {
            $scope.addressesValid = true;
        } else {
            $scope.addressesValid = false;
        }
    });
    $scope.changeHomeAsReg = function (value) {
        if (value == true) {
            var clone = angular.copy($scope.formData.addressesDto[0]);
            clone.addressType = $scope.formData.addressesDto[1].addressType;
            clone.addressId = $scope.formData.addressesDto[1].addressId;
            $scope.formData.addressesDto[1] = clone;
        }
        else {
            if ($scope.formData.addressesDto) {
                var clone = angular.copy($scope.formData.addressesDto[1]);
                $scope.formData.addressesDto[1] = {
                    addressId: clone.addressId,
                    addressSearchObj: null,
                    addressSearchText: null,
                    addressTxt: null,
                    addressTxtRandom: null,
                    addressType: clone.addressType,
                    aolevel1: {level: 1, refId: null, name: null},
                    aolevel2: {level: 2, refId: null, name: null},
                    aolevel3: {level: 3, refId: null, name: null},
                    aolevel4: {level: 4, refId: null, name: null},
                    aolevel5: {level: 5, refId: null, name: null},
                    aolevel6: {level: 6, refId: null, name: null},
                    aolevel7: {level: 7, refId: null, name: null},
                    aolevel65: {level: 65, refId: null, name: null},
                    aolevel90: {level: 90, refId: null, name: null},
                    aolevel91: {level: 91, refId: null, name: null},
                    countryRegion: {level: 0, refId: null, name: null},
                    flat: null,
                    postalCode: null,
                    house: {level: 100, refId: null, name: null}
                }
            }
        }
    };
    /* END ADDRESSES */

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

    $scope.$watchCollection('[formData.educations[0].instNameCheck, formData.educations[1].instNameCheck, formData.educations[2].instNameCheck,' +
        'formData.educations[3].instNameCheck,formData.educations[4].instNameCheck,]', function (newVal) {
        setTimeout(function () {$('[data-toggle="tooltip"]').tooltip();}, 500);
        // first
        if (newVal[0] == true) $scope.formData.educations[0].inst = null;
        else if (newVal[0] == false) $scope.formData.educations[0].instName = null;
        // second
        if (newVal[1] == true) $scope.formData.educations[1].inst = null;
        else if (newVal[1] == false) $scope.formData.educations[1].instName = null;
        // third
        if (newVal[2] == true) $scope.formData.educations[2].inst = null;
        else if (newVal[2] == false) $scope.formData.educations[2].instName = null;
        // fourth
        if (newVal[3] == true) $scope.formData.educations[3].inst = null;
        else if (newVal[3] == false) $scope.formData.educations[3].instName = null;
        // fifth
        if (newVal[4] == true) $scope.formData.educations[4].inst = null;
        else if (newVal[4] == false) $scope.formData.educations[4].instName = null;
    });

    $scope.$watchCollection('[formData.educations[0].sertInstNameCheck, formData.educations[1].sertInstNameCheck, formData.educations[2].sertInstNameCheck,' +
        'formData.educations[3].sertInstNameCheck,formData.educations[4].sertInstNameCheck,]', function (newVal) {
        setTimeout(function () {$('[data-toggle="tooltip"]').tooltip();}, 500);
        // first
        if (newVal[0] == true) $scope.formData.educations[0].sertInst = null;
        else if (newVal[0] == false) $scope.formData.educations[0].sertInstName = null;
        // second
        if (newVal[1] == true) $scope.formData.educations[1].sertInst = null;
        else if (newVal[1] == false) $scope.formData.educations[1].sertInstName = null;
        // third
        if (newVal[2] == true) $scope.formData.educations[2].sertInst = null;
        else if (newVal[2] == false) $scope.formData.educations[2].sertInstName = null;
        // fourth
        if (newVal[3] == true) $scope.formData.educations[3].sertInst = null;
        else if (newVal[3] == false) $scope.formData.educations[3].sertInstName = null;
        // fifth
        if (newVal[4] == true) $scope.formData.educations[4].sertInst = null;
        else if (newVal[4] == false) $scope.formData.educations[4].sertInstName = null;
    });

    $scope.$watch('formData.applications[0].ordApplications[0].speciality', function (newVal) {
        if (newVal) {
            APIService.getOrdDirectivity(newVal.specialityId, $scope.formData.id).then(function (response) {
                $scope.ordDirectionsSpecList = response.data;
            });
        }
    });
    $scope.$watch('formData.applications[0].ordApplications[1].speciality', function (newVal) {
        if (newVal) {
            APIService.getOrdDirectivity(newVal.specialityId, $scope.formData.id).then(function (response) {
                $scope.ordDirectionsSpecList2 = response.data;
            });
        }
    });

    $scope.$watch('formData.applications[0].ordApplications[0].conditions', function (newVal) {
        if (newVal) {
            $scope.targetDirection1 = false;
            $scope.targetDirectionId1 = null;
            var index = 1;
            angular.forEach(newVal, function (item) {
                if (item.envDescr == "Целевое направление") {
                    $scope.targetDirection1 = true;
                    $scope.targetDirectionId1 = item.portalApplWizardId;
                    APIService.getOrdTargetStateList($scope.targetDirectionId1).then(function (response) {
                        $scope.ordTargetStateList = response.data;
                    });
                }
                item.priority = index;
                index++;
            });
        }
    });
    $scope.$watch('formData.applications[0].ordApplications[1].conditions', function (newVal) {
        if (newVal) {
            $scope.targetDirection2 = false;
            $scope.targetDirectionId2 = null;
            var index = 1;
            angular.forEach(newVal, function (item) {
                if (item.envDescr == "Целевое направление") {
                    $scope.targetDirection2 = true;
                    $scope.targetDirectionId2 = item.portalApplWizardId;
                    APIService.getOrdTargetStateList($scope.targetDirectionId2).then(function (response) {
                        $scope.ordTargetStateList = response.data;
                    });
                }
                item.priority = index;
                index++;
            });
        }
    });

    $scope.$watch('formData.applications[0].ordApplications[0].targState', function (newVal) {
        if (newVal) {
            APIService.getOrdTargetOrgList($scope.targetDirectionId1, newVal).then(function (response) {
                $scope.ordTargOrgList = response.data;
            });
        }
    });
    $scope.$watch('formData.applications[0].ordApplications[1].targState', function (newVal) {
        if (newVal) {
            APIService.getOrdTargetOrgList($scope.targetDirectionId2, newVal).then(function (response) {
                $scope.ordTargOrgList = response.data;
            });
        }
    });

    $scope.$watch('formData.applications[0].docReturnType', function (newVal) {
        if (newVal) {
            setTimeout(function () {$('[data-toggle="tooltip"]').tooltip();}, 500);
        }
    });

    $scope.changeIdentityCard = function () {
        $scope.formData.identityCardSeries = null;
        $scope.formData.identityCardNumber = null;
        $scope.formData.identityCardIssueDep = null;
        $scope.formData.identityCardIssueDate = null;
        $scope.formData.identityCardIssueBy = null;
    };

    $scope.changeEduCountryRegion = function (edu) {
        edu.eduState = null;
    };

    $scope.changeEduLevel = function (eduLev, edu) {
        edu.eduDoc = null;
        edu.speciality = null;
        edu.sertInst = null;
        edu.sertInstName = null;
        edu.sertSpeciality = null;
        edu.sertEduCardSeries = null;
        edu.sertEduCardNumber = null;
        edu.sertEduCardIssueDate = null;
        edu.sertEduCardIssueBy = null;

        APIService.getEduDocs(eduLev.id, $scope.formData.educationLevel.id).then(function (response) {
            $scope.eduDocList = response.data;
        });
        APIService.getSpecList(eduLev.id).then(function (response) {
            $scope.specialityList = response.data;
        });
        setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
    };

    $scope.changeEduDoc = function (edu) {
        edu.eduCardSeries = null;
        edu.eduCardNumber = null;
        edu.eduCardIssueDate = null;
        edu.eduCardIssueBy = null;
        edu.eduCardApplSeries = null;
        edu.eduCardApplNumber = null;
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

    $scope.changeSpec1 = function (newVal) {
        $scope.formData.applications[0].ordApplications[0].conditions = [];
        $scope.formData.applications[0].ordApplications[0].targState = null;
        $scope.formData.applications[0].ordApplications[0].targOrg = null;
        $scope.formData.applications[0].ordApplications[0].contrNum = null;
        $scope.formData.applications[0].ordApplications[0].contrDate = null;

        $scope.formData.applications[0].ordApplications[1].speciality.specName = "";
        $scope.formData.applications[0].ordApplications[1].speciality.specialityId = "";
        $scope.formData.applications[0].ordApplications[1].conditions = [];
        APIService.getOrdSpecialities().then(function (response) {
            $scope.ordSpecialitiesList2 = response.data;
            angular.forEach($scope.ordSpecialitiesList2, function (item) {
                if (item.specialityId == newVal.specialityId) {
                    $scope.ordSpecialitiesList2.splice($scope.ordSpecialitiesList2.indexOf(item), 1);
                }
            });
        });
    };
    $scope.changeSpec2 = function () {
        $scope.formData.applications[0].ordApplications[1].conditions = [];
        $scope.formData.applications[0].ordApplications[1].targState = null;
        $scope.formData.applications[0].ordApplications[1].targOrg = null;
        $scope.formData.applications[0].ordApplications[1].contrNum = null;
        $scope.formData.applications[0].ordApplications[1].contrDate = null;
    };

    $scope.changeAccred = function () {
        setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
        /*$scope.formData.testUniversity = null;*/
        $scope.formData.testOrg = null;
    };

    $scope.changeDocReturn = function () {
        $scope.formData.applications[0].docReturnIndex = null;
        $scope.formData.applications[0].docReturnPostAddress = null;
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
        // 7 TAB
        if (tabNumber == 7 && !$scope.seventhTabLoaded) {
            $scope.loadSeventh();
            $scope.seventhTabLoaded = true;
        }
        // END 7 TAB
        // 8 TAB
        if (tabNumber == 8 && !$scope.eighthTabLoaded) {
            $scope.loadEighth();
            $scope.eighthTabLoaded = true;
        }
        // END 8 TAB
        // 9 TAB
        if (tabNumber == 9 && !$scope.ninthTabLoaded) {
            $scope.loadNinth();
            $scope.ninthTabLoaded = true;
        }
        // END 8 TAB
    };

    $scope.sendDraftFormData = function () {
        APIService.postOrdValidForm($scope.formData).then(function (response) {
            if (response.status == 200) {
                console.log("DRAFT.");
                APIService.getOrdForm($scope.formId).then(function (response) {
                    $scope.formData = response.data;
                });
            }
        });
    };

    $scope.saveFormData = function () {
        APIService.postOrdValidForm($scope.formData).then(function (response) {
            if (response.status == 200) {
                console.log("SAVED.");
            }
        });
    };

    $scope.sendFormDataToPK = function () {
        APIService.postOrdValidForm($scope.formData).then(function (response) {
            if (response.status == 200) {
                APIService.postOrdToPKFormData($scope.formData.id).then(function (response) {
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