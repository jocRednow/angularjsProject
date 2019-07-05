app.controller("registrationFormCtrl", function registrationFormCtrl($scope, $rootScope, $window, $timeout, $http, APIService) {
    if (localStorage.getItem('userName')) {
        $scope.userName = localStorage.getItem('userName');
    }

    $scope.regexInipa = /^\d{3}-\d{3}-\d{3} \d{2}$/;
    $scope.mobilePhone = /^8 \([0-9]{3}\) [0-9]{3}-[0-9]{2}-[0-9]{2}$/;
    $scope.homePhone = /^[0-9]{1,10}$/;
    $scope.middleScoreFractional = /^[3-5]$|^([3-5]+)?([.,][0-9]*)$/;
    $scope.middleScore = /^[3-5]$/;
    $scope.emplYears = /^[0-9]$|^[0-9][0-9]$|^([0-9]+)?([.,][0-9]*)$|^([0-9][0-9]+)?([.,][0-9]*)$/;
    $scope.scoreLimit = /^([5-9][0-9]|100)$/;
    $scope.scoreLimit2 = /^(7[5-9]|[8-9][0-9]|100)$/;
    $scope.docSeries2 = /^\d{2}$|^[a-zA-Zа-яёА-ЯЁ]{2}$/;
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
    $scope.newData = {};
    $scope.olympicData = {};
    $scope.quotaData = {};
    $scope.examData = {};

    if (sessionStorage.getItem('formID')) {
        $scope.formId = sessionStorage.getItem('formID');
        APIService.getSpecForm($scope.formId).then(function (response) {
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
        APIService.getEmptySpecForm().then(function (response) {
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

    $scope.EGEList = [
        {id: 0, name: 'ЕГЭ'},
        {id: 10, name: 'Вступительные испытания'}    /* Скрыто 11.07.2018 (частичное закрытие анкеты) ОТКРЫТЬ ПРИ СТАРТЕ ПРИЁМНОЙ КАМПАНИИ  */
    ];

    $scope.yearsList = ['2019','2018','2017','2016','2015','2014','2013','2012'];

    $scope.typeDiplomaList = [
        {id: 1, name: 'Призер'},
        {id: 2, name: 'Победитель'}
    ];

    $scope.conditionList = [
        {id: 1, name: 'Только общие места'},
        {id: 2, name: 'Целевое направление'},
        {id: 3, name: 'Особая квота'},
        {id: 4, name: 'Без вступительных испытаний'}   /* Скрыто 26.07.2018 (частичное закрытие анкеты) ОТКРЫТЬ ПРИ СТАРТЕ ПРИЁМНОЙ КАМПАНИИ */
    ];

    $scope.profSubjectList = ['ХИМ','БИОЛ'];

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
        if (newVal == true) $scope.formData.eduCardIssueBy = $scope.formData.instName;
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
    // END 1 TAB
    // 2 TAB
    $scope.loadSecond = function () {};
    // END 2 TAB
    // 3 TAB
    $scope.loadThird = function () {
        APIService.getAddressState().then(function (response) {
            $scope.addressStateList = response.data;
        });
        APIService.getEduLevels($scope.formData.educationLevel.id).then(function (response) {
            $scope.eduLevels = response.data;
        });
        APIService.getAcadamyYears().then(function (response) {
            $scope.acadamyYears = response.data;
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
        APIService.getPreferenceIndividualAchievements().then(function (response) {
            $scope.individualAchievementsList = response.data;
        });
    };
    // END 4 TAB
    // 5 TAB
    $scope.loadFifth = function () {
        APIService.getPreferenceOlymp().then(function (response) {
            $scope.preferenceOlympList = response.data;
        });
    };
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
        APIService.getCommonPlaces().then(function (response) {
            $scope.commonPlacesList = response.data;
        });
        APIService.getTarget().then(function (response) {
            $scope.targetList = response.data;
        });
        APIService.getSpecialQuota().then(function (response) {
            $scope.specialQuotaList = response.data;
        });
        APIService.getPreferenceSpecialQuota().then(function (response) {
            $scope.quotaList = response.data;
        });
        APIService.getNoExam().then(function (response) {
            $scope.noExamList = response.data;
        });
        APIService.getPreferenceNoExam().then(function (response) {
            $scope.preferenceNoExamList = response.data;
        });
        APIService.getPreferencePreferentialRight().then(function (response) {
            $scope.preferentialRightsList = response.data;
        });
        APIService.getDeliveryType().then(function (response) {
            $scope.deliveryTypeList = response.data;
        });
    };
    // END 8 TAB


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

    $scope.$watch('formData.condition', function (newVal) {
        if (newVal) setTimeout(function () {
            $('[data-toggle="tooltip"]').tooltip();
        }, 500);
    });


    // for Tab 1
    $scope.$watch('formData.identityCardFiles', function (newVal) {
        if (newVal && newVal.length > 0)  $scope.identityCardFilesValid = true;
        else $scope.identityCardFilesValid = false;
    });

    // for Tab 3
    $scope.$watch('formData.eduDocFiles', function (newVal) {
        if (newVal && newVal.length > 0)  $scope.eduDocFilesValid = true;
        else $scope.eduDocFilesValid = false;
    });

    // for Tab 4
    $scope.$watchCollection('[formData.individualAchievements[0].files, formData.individualAchievements[1].files, ' +
        'formData.individualAchievements[2].files, formData.individualAchievements[3].files, formData.individualAchievements[4].files]', function (newVal) {
        if (newVal[0] && newVal[0].length > 0 && $scope.formData.individualAchievements.length == 1) $scope.achieveFilesValid = true;
        else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && $scope.formData.individualAchievements.length == 2) $scope.achieveFilesValid = true;
        else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
            $scope.formData.individualAchievements.length == 3) $scope.achieveFilesValid = true;
        else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
            $scope.formData.individualAchievements.length == 4 && newVal[3] && newVal[3].length > 0) $scope.achieveFilesValid = true;
        else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
            $scope.formData.individualAchievements.length == 5 && newVal[3] && newVal[3].length > 0 && newVal[4] && newVal[4].length > 0) $scope.achieveFilesValid = true;
        else if (newVal[0] == undefined && newVal[1] == undefined && newVal[2] == undefined && newVal[3] == undefined && newVal[4] == undefined) $scope.achieveFilesValid = true;
        else $scope.achieveFilesValid = false;
    });

    // for Tab 7
    $scope.$watch('formData.soldiery', function (newVal) {
        if (newVal && newVal.id == 'Невоеннообязанный') {
            $scope.formData.militaryRank = null;
            $scope.formData.soldieryStatus = null;
            $scope.formData.soldieryBegDate = null;
            $scope.formData.soldieryEndDate = null;
            $scope.formData.militaryFormDoc = null;
            $scope.formData.militarySeries = null;
            $scope.formData.militaryNumber = null;
            $scope.formData.militaryIssueDate = null;
            $scope.formData.militaryIssueBy = null;
            $scope.formData.militaryDocFiles = [];
        }
    });
    $scope.$watch('formData.militaryFormDoc', function (newVal) {
        if (newVal && newVal.name == 'Не определено') {
            $scope.formData.militarySeries = null;
            $scope.formData.militaryNumber = null;
            $scope.formData.militaryIssueDate = null;
            $scope.formData.militaryIssueBy = null;
            $scope.formData.militaryDocFiles = [];
        }
    });
    /*$scope.$watch('formData.militaryDocFiles', function (newVal) {
        if (newVal && newVal.length > 0)  $scope.militaryDocFilesValid = true;
        else if ($scope.formData.soldiery && $scope.formData.soldiery.id == 'Невоеннообязанный') $scope.militaryDocFilesValid = true;
        else if ($scope.formData.militaryFormDoc && $scope.formData.militaryFormDoc.name == 'Не определено') $scope.militaryDocFilesValid = true;
        else $scope.militaryDocFilesValid = false;
    });*/

    // for Tab 8
    $scope.$watch('formData.applications[0].contractFiles', function (newVal) {
        if (newVal && newVal.length > 0)  $scope.contractFilesValid = true;
        else if ($scope.formData.applications && $scope.formData.applications[0].applCondition &&
            $scope.formData.applications[0].applCondition.name != 'Целевое направление') $scope.contractFilesValid = true;
        else $scope.contractFilesValid = false;
    });
    $scope.$watch('quotaData.quotaFiles', function (newVal) {
        if (newVal && newVal.length > 0)  $scope.quotaDocFilesValid = true;
        else $scope.quotaDocFilesValid = false;
    });
    $scope.$watch('examData.noExamFiles', function (newVal) {
        if (newVal && newVal.length > 0) $scope.noExamFilesValid = true;
        else $scope.noExamFilesValid = false;
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

    $scope.$watch('formData.subjectScores[0].examForm', function (newVal) {
        if (newVal && newVal.id == 0) setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
        else if (newVal && newVal.id == 10) {
            $scope.formData.subjectScores[0].docCheck = null;
            $scope.formData.subjectScores[0].yearDeliveryEGE = null;
            $scope.formData.subjectScores[0].docFirstName = null;
            $scope.formData.subjectScores[0].docLastName = null;
            $scope.formData.subjectScores[0].docMiddleName = null;
            $scope.formData.subjectScores[0].otherCountryRegion = null;
            $scope.formData.subjectScores[0].identityCard = null;
            $scope.formData.subjectScores[0].identityCardSeries = null;
            $scope.formData.subjectScores[0].identityCardNumber = null;
            $scope.formData.subjectScores[0].identityCardIssueBy = null;
            $scope.formData.subjectScores[0].identityCardIssueDate = null;
            $scope.formData.subjectScores[0].olympicCheck = false;
            $scope.formData.subjectScores[0].entrantPreference = null;
            $scope.formData.subjectScores[0].score = null;
        }
    });
    $scope.$watch('formData.subjectScores[1].examForm', function (newVal) {
        if (newVal && newVal.id == 0) setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
        else if (newVal && newVal.id == 10) {
            $scope.formData.subjectScores[1].docCheck = null;
            $scope.formData.subjectScores[1].yearDeliveryEGE = null;
            $scope.formData.subjectScores[1].docFirstName = null;
            $scope.formData.subjectScores[1].docLastName = null;
            $scope.formData.subjectScores[1].docMiddleName = null;
            $scope.formData.subjectScores[1].otherCountryRegion = null;
            $scope.formData.subjectScores[1].identityCard = null;
            $scope.formData.subjectScores[1].identityCardSeries = null;
            $scope.formData.subjectScores[1].identityCardNumber = null;
            $scope.formData.subjectScores[1].identityCardIssueBy = null;
            $scope.formData.subjectScores[1].identityCardIssueDate = null;
            $scope.formData.subjectScores[1].olympicCheck = false;
            $scope.formData.subjectScores[1].entrantPreference = null;
            $scope.formData.subjectScores[1].score = null;
        }
    });
    $scope.$watch('formData.subjectScores[2].examForm', function (newVal) {
        if (newVal && newVal.id == 0) setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
        else if (newVal && newVal.id == 10) {
            $scope.formData.subjectScores[2].docCheck = null;
            $scope.formData.subjectScores[2].yearDeliveryEGE = null;
            $scope.formData.subjectScores[2].docFirstName = null;
            $scope.formData.subjectScores[2].docLastName = null;
            $scope.formData.subjectScores[2].docMiddleName = null;
            $scope.formData.subjectScores[2].otherCountryRegion = null;
            $scope.formData.subjectScores[2].identityCard = null;
            $scope.formData.subjectScores[2].identityCardSeries = null;
            $scope.formData.subjectScores[2].identityCardNumber = null;
            $scope.formData.subjectScores[2].identityCardIssueBy = null;
            $scope.formData.subjectScores[2].identityCardIssueDate = null;
            $scope.formData.subjectScores[2].olympicCheck = false;
            $scope.formData.subjectScores[2].entrantPreference = null;
            $scope.formData.subjectScores[2].score = null;
        }
    });

    $scope.$watch('formData.subjectScores[0].olympicCheck', function (newVal) {
        if (newVal) setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
    });
    $scope.$watch('formData.subjectScores[1].olympicCheck', function (newVal) {
        if (newVal) setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
    });
    $scope.$watch('formData.subjectScores[2].olympicCheck', function (newVal) {
        if (newVal) setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
    });

    $scope.$watch('formData.applications[0].applicationLines[0].targOrgAddressState', function (newVal) {
        if (newVal && $scope.formData.applications[0].mainApplication) {
            APIService.getApplWizardTargOrg(newVal).then(function (response) {
                $scope.targOrgList = response.data;
            });
        }
    });
    $scope.$watch('formData.applications[0].applicationLines[0].targOrg', function (newVal) {
        if (newVal && $scope.formData.applications[0].mainApplication) {
            $scope.formData.applications[0].applicationLines[0].portalApplWizardTargOrgId = null;
        }
    });
    $scope.$watch('formData.applications[0].contrNum', function (newVal) {
        if (newVal && $scope.formData.applications[0].mainApplication) {
            $scope.formData.applications[0].applicationLines[0].contrNum = newVal;
        }
    });
    $scope.$watch('formData.applications[0].contrDate', function (newVal) {
        if (newVal && $scope.formData.applications[0].mainApplication) {
            $scope.formData.applications[0].applicationLines[0].contrDate = newVal;
        }
    });

    $scope.addSpec = function () {
        $scope.specList = [];
        angular.forEach($scope.formData.applications[0].applicationLines, function (item) {
            if ($scope.specList.indexOf(item.specialityId) == -1) {
                $scope.specList.push(item.specialityId);
            }
        });
        if ($scope.specList.length == 4) {
            $scope.formData.applications[0].applicationLines = $scope.formData.applications[0].applicationLines.slice(0, -1);
            $scope.specList.pop();
        }
    };

    // Особая квота
    $scope.changeSpetialQuotas = function (newSpec) {
        setTimeout(function(){
            $scope.formData.applications[0].applicationLines[0].entrantPreference = {};
            $scope.formData.applications[0].applicationLines[0].entrantPreference.documents = [{id: null}];
            $scope.quotaData = $scope.formData.applications[0];
            $('#addQuotaBlock').modal('show');
        }, 1000);
        setTimeout(function () {
            $('[data-toggle="tooltip"]').tooltip();
        }, 2000)
        angular.forEach($scope.commonPlacesList, function (item) {
            if (item.environmentId == "Бюджет" && newSpec.specialityId == item.specialityId) {
                $scope.formData.applications[0].applicationLines = [];
                $scope.formData.applications[0].applicationLines.push(item);
            }
        });
    };
    $scope.$watch('quotaData.applicationLines[0].entrantPreference.preference', function (newVal) {
        if (newVal) {
            APIService.getDocumentsByPrefId(newVal.id).then(function (response) {
                $scope.quotaTypeList = response.data;
            });
        }
    });
    $scope.addQuotaData = function (quotaData) {
        $scope.formData.applications[0] = quotaData;
    };
    $scope.removeQuotaData = function () {
        $scope.quotaData = {};
        $scope.formData.applications[0].mainApplication = null;
        $scope.formData.applications[0].applicationLines = [];
    };

    // БЕЗ ВИ
    $scope.changeExamList = function (newSpec) {
        setTimeout(function(){
            $scope.formData.applications[0].applicationLines[0].entrantPreference = {};
            $scope.formData.applications[0].applicationLines[0].entrantPreference.documents = [{id: null}];
            $scope.examData = $scope.formData.applications[0];
            $('#addExamBlock').modal('show');
        }, 1000);
        setTimeout(function () {
            $('[data-toggle="tooltip"]').tooltip();
        }, 2000);
        angular.forEach($scope.noExamList, function (item) {
            if (newSpec.specialityId == item.specialityId) {
                $scope.formData.applications[0].applicationLines = [];
                $scope.formData.applications[0].applicationLines.push(item);
            }
        });
    };
    $scope.$watch('examData.applicationLines[0].entrantPreference.preference', function (newVal) {
        if (newVal) {
            APIService.getDocumentsByPrefId(newVal.id).then(function (response) {
                $scope.examTypeList = response.data;
            });
        }
    });
    $scope.addExamData = function (examData) {
        $scope.formData.applications[0] = examData;
    };
    $scope.removeExamData = function () {
        $scope.examData = {};
        $scope.formData.applications[0].mainApplication = null;
        $scope.formData.applications[0].applicationLines = [];
    };

    $scope.$watch('formData.statementFile', function (newVal) {
        if (newVal && newVal.length > 0)  $scope.statementValid = true;
        else $scope.statementValid = false;
    });
    $scope.$watch('formData.complianceFile', function (newVal) {
        if (newVal && newVal.length > 0)  $scope.complianceValid = true;
        else $scope.complianceValid = false;
    });

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
                if ($scope.formData.id == null) {
                    $scope.sendDraftFormData();
                }
                var newFile = {};
                newFile.userFileName = that.files[0].name;
                newFile.contactPersonId = $scope.formData.id;
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
                    // СНИЛС
                    case 'snilsFiles':
                        newFile.fileType = "Снилс";
                        newFile.refId = $scope.formData.id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.formData.snilsFiles) {
                                $scope.formData.snilsFiles = [];
                            }
                            $scope.formData.snilsFiles.push(newFile);
                            $scope.dataLoading = false;
                        });
                        break;
                    // Тип документа
                    case 'identityCardFiles':
                        newFile.fileType = "Док. Удост. Личность";
                        newFile.refId = $scope.formData.id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.formData.identityCardFiles) {
                                $scope.formData.identityCardFiles = [];
                            }
                            // ====== исключаем повторные файлы
                            /*for (var i = 0; i < $scope.formData.identityCardFiles.length; i++) {
                                if ($scope.formData.identityCardFiles[i].userFileName == newFile.userFileName) {
                                    $scope.formData.identityCardFiles.splice(i, 1);
                                }
                            }*/
                            // ==========================
                            $scope.formData.identityCardFiles.push(newFile);
                            $scope.dataLoading = false;
                            // that.value = "";
                            // $scope.$apply();
                            $scope.$watch('formData.identityCardFiles', function (newVal) {
                                if (newVal && newVal.length > 0)  $scope.identityCardFilesValid = true;
                                else $scope.identityCardFilesValid = false;
                            });
                        });
                        break;
                    // Документ об образовании
                    case 'eduDocFiles':
                        newFile.fileType = "Док. Образование";
                        newFile.refId = $scope.formData.id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.formData.eduDocFiles) {
                                $scope.formData.eduDocFiles = [];
                            }
                            $scope.formData.eduDocFiles.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watch('formData.eduDocFiles', function (newVal) {
                                if (newVal && newVal.length > 0)  $scope.eduDocFilesValid = true;
                                else $scope.eduDocFilesValid = false;
                            });
                        });
                        break;
                    // Индивидуальные достижения 1
                    case 'individualAchievement1Files':
                        newFile.fileType = "Док. Инд. Достижение";
                        newFile.refId = $scope.formData.individualAchievements[0].id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.formData.individualAchievements[0].files) {
                                $scope.formData.individualAchievements[0].files = [];
                            }
                            $scope.formData.individualAchievements[0].files.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watchCollection('[formData.individualAchievements[0].files, formData.individualAchievements[1].files, ' +
                                'formData.individualAchievements[2].files, formData.individualAchievements[3].files, formData.individualAchievements[4].files]', function (newVal) {
                                if (newVal[0] && newVal[0].length > 0 && $scope.formData.individualAchievements.length == 1) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && $scope.formData.individualAchievements.length == 2) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 3) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 4 && newVal[3] && newVal[3].length > 0) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 5 && newVal[3] && newVal[3].length > 0 && newVal[4] && newVal[4].length > 0) $scope.achieveFilesValid = true;
                                else $scope.achieveFilesValid = false;
                            });
                        });
                        break;
                    // Индивидуальные достижения 2
                    case 'individualAchievement2Files':
                        newFile.fileType = "Док. Инд. Достижение";
                        newFile.refId = $scope.formData.individualAchievements[1].id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.formData.individualAchievements[1].files) {
                                $scope.formData.individualAchievements[1].files = [];
                            }
                            $scope.formData.individualAchievements[1].files.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watchCollection('[formData.individualAchievements[0].files, formData.individualAchievements[1].files, ' +
                                'formData.individualAchievements[2].files, formData.individualAchievements[3].files, formData.individualAchievements[4].files]', function (newVal) {
                                if (newVal[0] && newVal[0].length > 0 && $scope.formData.individualAchievements.length == 1) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && $scope.formData.individualAchievements.length == 2) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 3) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 4 && newVal[3] && newVal[3].length > 0) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 5 && newVal[3] && newVal[3].length > 0 && newVal[4] && newVal[4].length > 0) $scope.achieveFilesValid = true;
                                else $scope.achieveFilesValid = false;
                            });
                        });
                        break;
                    // Индивидуальные достижения 3
                    case 'individualAchievement3Files':
                        newFile.fileType = "Док. Инд. Достижение";
                        newFile.refId = $scope.formData.individualAchievements[2].id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.formData.individualAchievements[2].files) {
                                $scope.formData.individualAchievements[2].files = [];
                            }
                            $scope.formData.individualAchievements[2].files.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watchCollection('[formData.individualAchievements[0].files, formData.individualAchievements[1].files, ' +
                                'formData.individualAchievements[2].files, formData.individualAchievements[3].files, formData.individualAchievements[4].files]', function (newVal) {
                                if (newVal[0] && newVal[0].length > 0 && $scope.formData.individualAchievements.length == 1) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && $scope.formData.individualAchievements.length == 2) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 3) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 4 && newVal[3] && newVal[3].length > 0) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 5 && newVal[3] && newVal[3].length > 0 && newVal[4] && newVal[4].length > 0) $scope.achieveFilesValid = true;
                                else $scope.achieveFilesValid = false;
                            });
                        });
                        break;
                    // Индивидуальные достижения 4
                    case 'individualAchievement4Files':
                        newFile.fileType = "Док. Инд. Достижение";
                        newFile.refId = $scope.formData.individualAchievements[3].id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.formData.individualAchievements[3].files) {
                                $scope.formData.individualAchievements[3].files = [];
                            }
                            $scope.formData.individualAchievements[3].files.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watchCollection('[formData.individualAchievements[0].files, formData.individualAchievements[1].files, ' +
                                'formData.individualAchievements[2].files, formData.individualAchievements[3].files, formData.individualAchievements[4].files]', function (newVal) {
                                if (newVal[0] && newVal[0].length > 0 && $scope.formData.individualAchievements.length == 1) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && $scope.formData.individualAchievements.length == 2) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 3) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 4 && newVal[3] && newVal[3].length > 0) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 5 && newVal[3] && newVal[3].length > 0 && newVal[4] && newVal[4].length > 0) $scope.achieveFilesValid = true;
                                else $scope.achieveFilesValid = false;
                            });
                        });
                        break;
                    // Индивидуальные достижения 5
                    case 'individualAchievement5Files':
                        newFile.fileType = "Док. Инд. Достижение";
                        newFile.refId = $scope.formData.individualAchievements[5].id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.formData.individualAchievements[5].files) {
                                $scope.formData.individualAchievements[5].files = [];
                            }
                            $scope.formData.individualAchievements[5].files.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watchCollection('[formData.individualAchievements[0].files, formData.individualAchievements[1].files, ' +
                                'formData.individualAchievements[2].files, formData.individualAchievements[3].files, formData.individualAchievements[4].files]', function (newVal) {
                                if (newVal[0] && newVal[0].length > 0 && $scope.formData.individualAchievements.length == 1) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && $scope.formData.individualAchievements.length == 2) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 3) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 4 && newVal[3] && newVal[3].length > 0) $scope.achieveFilesValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.formData.individualAchievements.length == 5 && newVal[3] && newVal[3].length > 0 && newVal[4] && newVal[4].length > 0) $scope.achieveFilesValid = true;
                                else $scope.achieveFilesValid = false;
                            });
                        });
                        break;
                    // Документ олимпиады
                    case 'olympicIdentityCardFiles':
                        var subId = that.attributes['data-sub'].value;
                        var entraName = that.attributes['data-entra'].value;
                        if (entraName == "Биол") {
                            newFile.fileType = "Док. Олимпиада. Биол";
                        } else if (entraName == "Хим") {
                            newFile.fileType = "Док. Олимпиада. Хим";
                        } else if (entraName == "РусскЯз") {
                            newFile.fileType = "Док. Олимпиада. РусЯз";
                        }
                        newFile.refId = subId;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            $scope.olympicData.entrantPreference.files.push(newFile);
                            $scope.dataLoading = false;
                            $scope.olympicIdentityCardValid = true;
                        });
                        break;
                    // Документ о военной службе
                    case 'militaryDocFiles':
                        newFile.fileType = "Док. Военная служба";
                        newFile.refId = $scope.formData.id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.formData.militaryDocFiles) {
                                $scope.formData.militaryDocFiles = [];
                            }
                            $scope.formData.militaryDocFiles.push(newFile);
                            $scope.dataLoading = false;
                            /*$scope.$watch('formData.militaryDocFiles', function (newVal) {
                                if (newVal && newVal.length > 0)  $scope.militaryDocFilesValid = true;
                                else $scope.militaryDocFilesValid = false;
                            });*/
                        });
                        break;
                    // Мед. справка по ф.086-У
                    case 'medicalInformFiles':
                        newFile.fileType = "Мед справка";
                        newFile.refId = $scope.formData.id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.formData.medicalInformFiles) {
                                $scope.formData.medicalInformFiles = [];
                            }
                            $scope.formData.medicalInformFiles.push(newFile);
                            $scope.dataLoading = false;
                        });
                        break;
                    // Целевое направление
                    case 'contractFiles':
                        newFile.fileType = "Док. Цел. Напр";
                        newFile.refId = $scope.formData.applications[0].id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.formData.applications[0].contractFiles) {
                                $scope.formData.applications[0].contractFiles = [];
                            }
                            $scope.formData.applications[0].contractFiles.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watch('formData.applications[0].contractFiles', function (newVal) {
                                if (newVal && newVal.length > 0)  $scope.contractFilesValid = true;
                                else $scope.contractFilesValid = false;
                            });
                        });
                        break;
                    // Особая квота
                    case 'quotaDocFiles':
                        newFile.fileType = "Док. Особое право";
                        newFile.refId = $scope.formData.applications[0].id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.quotaData.quotaFiles) {
                                $scope.quotaData.quotaFiles = [];
                            }
                            $scope.quotaData.quotaFiles.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watch('quotaData.quotaFiles', function (newVal) {
                                if (newVal && newVal.length > 0)  $scope.quotaDocFilesValid = true;
                                else $scope.quotaDocFilesValid = false;
                            });
                        });
                        break;
                    // Без ВИ
                    case 'noExamFiles':
                        newFile.fileType = "Док. Без ВИ";
                        newFile.refId = $scope.formData.applications[0].id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.examData.noExamFiles) {
                                $scope.examData.noExamFiles = [];
                            }
                            $scope.examData.noExamFiles.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watch('examData.noExamFiles', function (newVal) {
                                if (newVal && newVal.length > 0) $scope.noExamFilesValid = true;
                                else $scope.noExamFilesValid = false;
                            });
                        });
                        break;
                    // Преимущественное право 1
                    case 'privilegeDoc1Files':
                        newFile.fileType = "Док. Преим. Право";
                        newFile.refId = $scope.formData.privileges[0].id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.privilegeData[0].files) {
                                $scope.privilegeData[0].files = [];
                            }
                            $scope.privilegeData[0].files.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watchCollection('[privilegeData[0].files, privilegeData[1].files, privilegeData[2].files, privilegeData[3].files, ' +
                                'privilegeData[4].files]', function (newVal) {
                                if (newVal[0] && newVal[0].length > 0 && $scope.privilegeData.length == 1) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && $scope.privilegeData.length == 2) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 3) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 4 && newVal[3] && newVal[3].length > 0) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 5 && newVal[3] && newVal[3].length > 0 && newVal[4] && newVal[4].length > 0) $scope.privilegeDocValid = true;
                                else $scope.privilegeDocValid = false;
                            });
                        });
                        break;
                    // Преимущественное право 2
                    case 'privilegeDoc2Files':
                        newFile.fileType = "Док. Преим. Право";
                        newFile.refId = $scope.formData.privileges[1].id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.privilegeData[1].files) {
                                $scope.privilegeData[1].files = [];
                            }
                            $scope.privilegeData[1].files.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watchCollection('[privilegeData[0].files, privilegeData[1].files, privilegeData[2].files, privilegeData[3].files, ' +
                                'privilegeData[4].files]', function (newVal) {
                                if (newVal[0] && newVal[0].length > 0 && $scope.privilegeData.length == 1) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && $scope.privilegeData.length == 2) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 3) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 4 && newVal[3] && newVal[3].length > 0) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 5 && newVal[3] && newVal[3].length > 0 && newVal[4] && newVal[4].length > 0) $scope.privilegeDocValid = true;
                                else $scope.privilegeDocValid = false;
                            });
                        });
                        break;
                    // Преимущественное право 3
                    case 'privilegeDoc3Files':
                        newFile.fileType = "Док. Преим. Право";
                        newFile.refId = $scope.formData.privileges[2].id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.privilegeData[2].files) {
                                $scope.privilegeData[2].files = [];
                            }
                            $scope.privilegeData[2].files.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watchCollection('[privilegeData[0].files, privilegeData[1].files, privilegeData[2].files, privilegeData[3].files, ' +
                                'privilegeData[4].files]', function (newVal) {
                                if (newVal[0] && newVal[0].length > 0 && $scope.privilegeData.length == 1) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && $scope.privilegeData.length == 2) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 3) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 4 && newVal[3] && newVal[3].length > 0) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 5 && newVal[3] && newVal[3].length > 0 && newVal[4] && newVal[4].length > 0) $scope.privilegeDocValid = true;
                                else $scope.privilegeDocValid = false;
                            });
                        });
                        break;
                    // Преимущественное право 4
                    case 'privilegeDoc4Files':
                        newFile.fileType = "Док. Преим. Право";
                        newFile.refId = $scope.formData.privileges[3].id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.privilegeData[3].files) {
                                $scope.privilegeData[3].files = [];
                            }
                            $scope.privilegeData[3].files.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watchCollection('[privilegeData[0].files, privilegeData[1].files, privilegeData[2].files, privilegeData[3].files, ' +
                                'privilegeData[4].files]', function (newVal) {
                                if (newVal[0] && newVal[0].length > 0 && $scope.privilegeData.length == 1) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && $scope.privilegeData.length == 2) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 3) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 4 && newVal[3] && newVal[3].length > 0) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 5 && newVal[3] && newVal[3].length > 0 && newVal[4] && newVal[4].length > 0) $scope.privilegeDocValid = true;
                                else $scope.privilegeDocValid = false;
                            });
                        });
                        break;
                    // Преимущественное право 5
                    case 'privilegeDoc5Files':
                        newFile.fileType = "Док. Преим. Право";
                        newFile.refId = $scope.formData.privileges[4].id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.privilegeData[4].files) {
                                $scope.privilegeData[4].files = [];
                            }
                            $scope.privilegeData[4].files.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watchCollection('[privilegeData[0].files, privilegeData[1].files, privilegeData[2].files, privilegeData[3].files, ' +
                                'privilegeData[4].files]', function (newVal) {
                                if (newVal[0] && newVal[0].length > 0 && $scope.privilegeData.length == 1) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && $scope.privilegeData.length == 2) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 3) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 4 && newVal[3] && newVal[3].length > 0) $scope.privilegeDocValid = true;
                                else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                    $scope.privilegeData.length == 5 && newVal[3] && newVal[3].length > 0 && newVal[4] && newVal[4].length > 0) $scope.privilegeDocValid = true;
                                else $scope.privilegeDocValid = false;
                            });
                        });
                        break;
                    // Заявление
                    case 'statementFile':
                        newFile.fileType = "Заявление";
                        newFile.refId = $scope.formData.id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.formData.statementFile) {
                                $scope.formData.statementFile = [];
                            }
                            $scope.formData.statementFile.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watch('formData.statementFile', function (newVal) {
                                if (newVal && newVal.length > 0)  $scope.statementValid = true;
                                else $scope.statementValid = false;
                            });
                        });
                        break;
                    // Согласие на обр перс данных
                    case 'complianceFile':
                        newFile.fileType = "Согл. На Обр.";
                        newFile.refId = $scope.formData.id;
                        $scope.dataLoading = true;
                        APIService.saveFile(newFile).then(function (response) {
                            console.log(response.data.message);
                            newFile.id = response.data.fileId;
                            if (!$scope.formData.complianceFile) {
                                $scope.formData.complianceFile = [];
                            }
                            $scope.formData.complianceFile.push(newFile);
                            $scope.dataLoading = false;
                            $scope.$watch('formData.complianceFile', function (newVal) {
                                if (newVal && newVal.length > 0)  $scope.complianceValid = true;
                                else $scope.complianceValid = false;
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
                    // СНИЛС
                    if (arrayFiles.length == 0  && name == 'snilsFiles') {
                        var target = angular.element(document.querySelector("#snilsFilesFiles"));
                        target.val(null);
                    }
                    // Тип документа
                    if (arrayFiles.length == 0  && name == 'identityCardFiles') {
                        $scope.identityCardFilesValid = false;
                        var target = angular.element(document.querySelector("#identityCardFiles"));
                        target.val(null);
                        $("#identityCardFiles").addClass('error-necessarily-block');
                    }
                    // Документ об образовании
                    if (arrayFiles.length == 0  && name == 'eduDocFiles') {
                        $scope.eduDocFilesValid = false;
                        var target = angular.element(document.querySelector("#eduDocFiles"));
                        target.val(null);
                        $("#eduDocFiles").addClass('error-necessarily-block');
                    }
                    // Индивидуальные достижения
                    if (arrayFiles.length == 0  && file.fileType == 'Док. Инд. Достижение') {
                        $scope.sendDraftFormData();
                    }
                    // Документ олимпиады по биологии
                    if (arrayFiles.length == 0  && name == 'olympicIdentityCardFiles') {
                        $scope.olympicIdentityCardValid = false;
                        var target = angular.element(document.querySelector("#olympicIdentityCardFiles"));
                        target.val(null);
                        $("#olympicIdentityCardFiles").addClass('error-necessarily-block');
                    } else {
                        $scope.olympicIdentityCardValid = true;
                    }
                    // Документ о военной службе
                    if (arrayFiles.length == 0  && name == 'militaryDocFiles') {
                        /*$scope.militaryDocFilesValid = false;*/
                        var target = angular.element(document.querySelector("#militaryDocFiles"));
                        target.val(null);
                        /*$("#militaryDocFiles").addClass('error-necessarily-block');*/
                    }
                    // Мед. справка по ф.086-У
                    if (arrayFiles.length == 0  && name == 'medicalInformFiles') {
                        var target = angular.element(document.querySelector("#medicalInformFiles"));
                        target.val(null);
                    }
                    // Целевое направление
                    if (arrayFiles.length == 0  && name == 'contractFiles') {
                        $scope.contractFilesValid = false;
                        var target = angular.element(document.querySelector("#contractFiles"));
                        target.val(null);
                        $("#contractFiles").addClass('error-necessarily-block');
                    }
                    // Особая квота
                    if (arrayFiles.length == 0  && name == 'quotaDocFiles') {
                        $scope.quotaDocFilesValid = false;
                        var target = angular.element(document.querySelector("#quotaDocFiles"));
                        target.val(null);
                        $("#quotaDocFiles").addClass('error-necessarily-block');
                    }
                    // ВИ
                    if (arrayFiles.length == 0  && name == 'noExamFiles') {
                        $scope.noExamFilesValid = false;
                        var target = angular.element(document.querySelector("#noExamFiles"));
                        target.val(null);
                        $("#noExamFiles").addClass('error-necessarily-block');
                    }
                    // Преимущественное право
                    if (arrayFiles.length == 0  && file.fileType == 'Док. Преим. Право') {
                        $scope.$watchCollection('[privilegeData[0].files, privilegeData[1].files, privilegeData[2].files, privilegeData[3].files, ' +
                            'privilegeData[4].files]', function (newVal) {
                            if (newVal[0] && newVal[0].length > 0 && $scope.privilegeData.length == 1) $scope.privilegeDocValid = true;
                            else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && $scope.privilegeData.length == 2) $scope.privilegeDocValid = true;
                            else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                $scope.privilegeData.length == 3) $scope.privilegeDocValid = true;
                            else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                $scope.privilegeData.length == 4 && newVal[3] && newVal[3].length > 0) $scope.privilegeDocValid = true;
                            else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
                                $scope.privilegeData.length == 5 && newVal[3] && newVal[3].length > 0 && newVal[4] && newVal[4].length > 0) $scope.privilegeDocValid = true;
                            else $scope.privilegeDocValid = false;
                        });
                    }
                    // Заявление
                    if (arrayFiles.length == 0  && name == 'statementFile') {
                        $scope.statementValid = false;
                        var target = angular.element(document.querySelector("#statementFile"));
                        target.val(null);
                        $("#statementFile").addClass('error-necessarily-block');
                    }
                    // Согласие на обр перс данных
                    if (arrayFiles.length == 0  && name == 'complianceFile') {
                        $scope.complianceValid = false;
                        var target = angular.element(document.querySelector("#complianceFile"));
                        target.val(null);
                        $("#complianceFile").addClass('error-necessarily-block');
                    }
                });
            }
        });
    };

    $scope.sendDraftFormData = function () {
        APIService.postSpecValidForm($scope.formData).then(function (response) {
            if (response.status == 200) {
                console.log("DRAFT.");
                APIService.getSpecForm($scope.formId).then(function (response) {
                    $scope.formData = response.data;
                });
            }
        }, function (response) {
            if (response.status == 400) {
                $scope.mistake = response.data.message;
                $('#mistakeBlock').modal('show');
            }
        });
    };
    $scope.saveFormData = function () {
        APIService.postSpecValidForm($scope.formData).then(function (response) {
            if (response.status == 200) {
                console.log("SAVED.");
            }
        }, function (response) {
            if (response.status == 400) {
                $scope.mistake = response.data.message;
                $('#mistakeBlock').modal('show');
            }
        });
    };

    $scope.sendFormData = function () {
        APIService.postSpecValidForm($scope.formData).then(function (response) {
            if (response.status == 200) {
                APIService.postSpecToPKFormData($scope.formData.id).then(function (response) {
                    if (response.status == 200) {
                        console.log("SEND.");
                        $window.location.href = '#!/privateOffice';
                    }
                });
            }
        }, function (response) {
            if (response.status == 400) {
                $scope.mistake = response.data.message;
                $('#mistakeBlock').modal('show');
            }
        });
    };

    // Add New Data (Modal)
    $scope.passData = function (sub) {
        $scope.newData = sub;
    };
    $scope.$watch('newData.identityCard', function (newVal) {
        if (newVal) setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
    });
    $scope.addNewData = function (newData) {};
    $scope.removeData = function (sub) {
        $scope.newData = {};
        angular.forEach($scope.formData.subjectScores, function (item) {
            if (item.subject.id == sub.subject.id) {
                item.docCheck = null;
                item.docFirstName = null;
                item.docLastName = null;
                item.docMiddleName = null;
                item.otherCountryRegion = null;
                item.identityCard = null;
                item.identityCardSeries = null;
                item.identityCardNumber = null;
                item.identityCardIssueBy = null;
                item.identityCardIssueDate = null;
            }
        });
    };

    // Add New Olympic Data (Modal)
    $scope.passOlympicData = function (sub) {
        $scope.olympicData = sub;
        if ($scope.olympicData.entrantPreference == null) {
            $scope.olympicData.entrantPreference = {};
            $scope.olympicData.entrantPreference.documents = [{id: null}];
            $scope.olympicData.entrantPreference.files = [];
        }
    };
    $scope.$watch('olympicData.entrantPreference.preference', function (newVal) {
        if (newVal) {
            APIService.getDocumentsByPrefId(newVal.id).then(function (response) {
                $scope.olympTypeList = response.data;
            });
        }
    });
    $scope.addOlympicData = function (olympicData) {};
    $scope.removeOlympicData = function (olympicData) {
        $scope.olympicData = {};
        angular.forEach($scope.formData.subjectScores, function (item) {
            if (item.subject.id == olympicData.subject.id) {
                item.olympicCheck = false;
                item.entrantPreference = null;
            }
        });
    };

    // Add Privilege Modal (Modal)
    $scope.passPrivilegeData = function (privilege) {
        if (privilege.length == 0) {
            $scope.privilegeData = [{id: null, documents: [{id: null}]}];
        } else {
            $scope.privilegeData = privilege;
        }
    };
    $scope.changeModalPreference = function (privilegeData, privilege) {
        privilege.documents = [{id: null}];
        if ($scope.formData.privileges.length != 0) {
            if (privilegeData[0].id == null) privilegeData[0].id = $scope.formData.privileges[0].id;
            if (privilegeData[1] && privilegeData[1].id == null && $scope.formData.privileges[1].id != undefined) {
                privilegeData[1].id = $scope.formData.privileges[1].id;
            }
            if (privilegeData[2] && privilegeData[2].id == null && $scope.formData.privileges[2].id != undefined) {
                privilegeData[2].id = $scope.formData.privileges[2].id;
            }
            if (privilegeData[3] && privilegeData[3].id == null && $scope.formData.privileges[3].id != undefined) {
                privilegeData[3].id = $scope.formData.privileges[3].id;
            }
            if (privilegeData[4] && privilegeData[4].id == null && $scope.formData.privileges[4].id != undefined) {
                privilegeData[4].id = $scope.formData.privileges[4].id;
            }
        } else {
            $scope.formData.privileges = privilegeData;
        }
        $scope.sendDraftFormData();
    };
    $scope.$watchCollection('[privilegeData[0].preference, privilegeData[1].preference, privilegeData[2].preference, ' +
        'privilegeData[3].preference, privilegeData[4].preference]', function (newVal) {
        setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
        if (newVal[0]) {
            APIService.getDocumentsByPrefId(newVal[0].id).then(function (response) {
                $scope.privilegeDocTypeList = response.data;
            });
        }
        if (newVal[1]) {
            APIService.getDocumentsByPrefId(newVal[1].id).then(function (response) {
                $scope.privilegeDocTypeList = response.data;
            });
        }
        if (newVal[2]) {
            APIService.getDocumentsByPrefId(newVal[2].id).then(function (response) {
                $scope.privilegeDocTypeList = response.data;
            });
        }
        if (newVal[3]) {
            APIService.getDocumentsByPrefId(newVal[3].id).then(function (response) {
                $scope.privilegeDocTypeList = response.data;
            });
        }
        if (newVal[4]) {
            APIService.getDocumentsByPrefId(newVal[4].id).then(function (response) {
                $scope.privilegeDocTypeList = response.data;
            });
        }
    });
    $scope.$watchCollection('[privilegeData[0].files, privilegeData[1].files, privilegeData[2].files, privilegeData[3].files, ' +
        'privilegeData[4].files]', function (newVal) {
        if (newVal[0] && newVal[0].length > 0 && $scope.privilegeData.length == 1) $scope.privilegeDocValid = true;
        else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && $scope.privilegeData.length == 2) $scope.privilegeDocValid = true;
        else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
            $scope.privilegeData.length == 3) $scope.privilegeDocValid = true;
        else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
            $scope.privilegeData.length == 4 && newVal[3] && newVal[3].length > 0) $scope.privilegeDocValid = true;
        else if (newVal[0] && newVal[0].length > 0 && newVal[1] && newVal[1].length > 0 && newVal[2] && newVal[2].length > 0 &&
            $scope.privilegeData.length == 5 && newVal[3] && newVal[3].length > 0 && newVal[4] && newVal[4].length > 0) $scope.privilegeDocValid = true;
        else $scope.privilegeDocValid = false;
    });
    $scope.addPrivilegeData = function (privilegeData) {
        $scope.formData.privilegeCheck = true;
        $scope.formData.privileges = [];
        $scope.formData.privileges = privilegeData
    };
    $scope.removePrivilegeData = function () {
        $scope.formData.privilegeCheck = false;
        $scope.privilegeData = [];
        angular.forEach($scope.formData.privileges, function (item) {
            if (item != null) APIService.deleteField(item.id);
        });
        $scope.formData.privileges = [];
    };

    $scope.changeApplCondition = function () {
        $scope.formData.applications[0].applicationLines = [];
        $scope.formData.applications[0].mainApplication = null;
        if ($scope.formData.applications[0].applicationLines[0]) {
            $scope.formData.applications[0].applicationLines[0].targOrgAddressState = null;
            $scope.formData.applications[0].applicationLines[0].targOrg = null;
        }
        $scope.formData.applications[0].contrNum = null;
        $scope.formData.applications[0].contrDate = null;
        $scope.formData.applications[0].contractFiles = [];
        $scope.formData.applications[0].quotaFiles = [];
        $scope.formData.applications[0].noExamFiles = [];

        setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);
    };
    $scope.changeMainApplication = function (newSpec) {
        if ($scope.formData.applications[0].applicationLines[0]) {
            $scope.formData.applications[0].applicationLines[0].targOrgAddressState = null;
            $scope.formData.applications[0].applicationLines[0].targOrg = null;
        }
        $scope.formData.applications[0].contrNum = null;
        $scope.formData.applications[0].contrDate = null;
        $scope.formData.applications[0].contractFiles = [];

        setTimeout(function () {$('[data-toggle="tooltip"]').tooltip()}, 500);

        APIService.getAddressStatsByPortalApplWizardId().then(function (response) {
            $scope.targetStateList = response.data;
        });
        angular.forEach($scope.commonPlacesList, function (item) {
            if (item.environmentId == "Бюджет" && newSpec.specialityId == item.specialityId) {
                item.out = false;
                var newOption = newSpec;
                $scope.formData.applications[0].applicationLines = [];
                $scope.formData.applications[0].applicationLines.push(newOption);
            } else {
                item.out = true;
            }
        });
    };

    $scope.checkData = function (item, name) {
        if (item.length < 10) {
            if (name === 'birthDate') $scope.formData.birthDate = null;
            if (name === 'inipaDate') $scope.formData.inipaDate = null;
            if (name === 'identityCardIssueDate') $scope.formData.identityCardIssueDate = null;
            if (name === 'eduCardIssueDate') $scope.formData.eduCardIssueDate = null;
            if (name === 'soldieryBegDate') $scope.formData.soldieryBegDate = null;
            if (name === 'soldieryEndDate') $scope.formData.soldieryEndDate = null;
            if (name === 'militaryIssueDate') $scope.formData.militaryIssueDate = null;
        }
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