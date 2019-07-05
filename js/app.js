var app = angular.module("appReg", ["ngRoute", 'ngCookies', "ui.select", "ngMask"])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/login', {
                templateUrl:'template/login_form.html',
                controller:'loginFormCtrl'
            }).when('/registerChoice', {
                templateUrl:'template/registerChoice_form.html',
                controller:'registerChoiceFormCtrl'
            }).when('/resetPassword', {
                templateUrl:'template/resetPassword_form.html',
                controller:'resetPasswordFormCtrl'
            }).when('/resetEmailPassword', {
                templateUrl:'template/resetEmailPassword_form.html',
                controller:'resetEmailPasswordFormCtrl'
            })
            //EMAIL
            .when('/emailRegister', {
                templateUrl:'template/emailRegister_form.html',
                controller:'emailRegisterFormCtrl'
            }).when('/fullRegisterEmail', {
                templateUrl:'template/fullRegisterEmail_form.html',
                controller:'fullRegisterEmailFormCtrl'
            })
            //PHONE
            .when('/phoneRegister', {
                templateUrl:'template/phoneRegister_form.html',
                controller:'phoneRegisterFormCtrl'
            }).when('/fullRegisterPhone', {
                templateUrl:'template/fullRegisterPhone_form.html',
                    controller:'fullRegisterPhoneFormCtrl'
            })
            //PRIVATE OFFICE
            .when('/privateOffice', {
                templateUrl:'template/privateOffice.html',
                controller:'privateOfficeCtrl'
            }).when('/statementInfo', {
                templateUrl:'template/statementInfo.html',
                controller:'statementInfoCtrl'
            }).when('/checkData', {
                templateUrl:'template/checkData.html',
                controller:'checkDataCtrl'
            }).when('/admin', {
                templateUrl:'template/admin_form.html',
                controller:'adminCtrl'
            })
            //MAIN FORM
            .when('/registration', {
                templateUrl:'template/registration_form.html',
                controller:'registrationFormCtrl'
            }).when('/aspRegistration', {
                templateUrl:'template/aspRegistration_form.html',
                controller:'aspRegistrationFormCtrl'
            }).when('/ordRegistration', {
                templateUrl:'template/ordRegistration_form.html',
                controller:'ordRegistrationFormCtrl'
            }).when('/kiosk', {
                templateUrl:'template/kiosk_form.html',
                controller:'kioskFormCtrl'
            }).otherwise({
                redirectTo: '/login'
            });
    }]);
