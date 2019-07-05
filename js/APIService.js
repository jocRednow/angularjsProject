app.factory('APIService', function ($http) {
    var getApiHost = function () {
        if (location.host === 'pk:8087') {
            return 'http://10.71.0.110/admission_com_api'
        } else {
            return '/admission_com_api'
        }
    }

    var getApiHostSearch = function () {
        if (location.host === 'pk:8087') {
            return 'http://10.71.0.110/fias-search'
        } else {
            return '/fias-search'
        }
    }

    return {
        // Spec
        getEmptySpecForm: function () {
            return $http.get(getApiHost() + '/Specialist/CreateEmpty', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getSpecForm: function (id) {
            return $http.get(getApiHost() + '/Specialist/' + id, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        postSpecValidForm: function (data) {
            return $http.post(getApiHost() + '/Specialist/', data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        postSpecKioskFormData: function (formId) {
            return $http.post(getApiHost() + '/Specialist/SendToPKFromKiosk?ContactPersonId=' + formId, formId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        postSpecToPKFormData: function (formId) {
            return $http.post(getApiHost() + '/Specialist/SendToPK?ContactPersonId=' + formId, formId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getFilesList: function (fileId) {
            return $http.get(getApiHost() + '/Specialist/' + fileId + '/FileList', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Asp
        getEmptyAspForm: function () {
            return $http.get(getApiHost() + '/Aspirant/CreateEmpty', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getAspForm: function (id) {
            return $http.get(getApiHost() + '/Aspirant/' + id, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        postAspValidForm: function (data) {
            return $http.post(getApiHost() + '/Aspirant/', data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        postAspToPKFormData: function (formId) {
            return $http.post(getApiHost() + '/Aspirant/SendToPK?ContactPersonId=' + formId, formId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Ord
        getEmptyOrdForm: function () {
            return $http.get(getApiHost() + '/Ordinator/CreateEmpty', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getOrdForm: function (id) {
            return $http.get(getApiHost() + '/Ordinator/' + id, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        postOrdValidForm: function (data) {
            return $http.post(getApiHost() + '/Ordinator/', data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        postOrdToPKFormData: function (formId) {
            return $http.post(getApiHost() + '/Ordinator/SendToPK?ContactPersonId=' + formId, formId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },

        // Check Email
        checkEmail: function (email) {
            return $http.get(getApiHost() + '/Auth/EmailAvailable?email=' + email, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Post Email
        postEmail: function (email) {
            return $http.post(getApiHost() + '/Auth/VerifyEmail?email=' + email, email, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Post Full Email
        postFullEmailReg: function (data) {
            return $http.post(getApiHost() + '/Auth/RegisterByEmail', data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Reset password by Email (code)
        sendEmailPasswordResetCode: function (email) {
            return $http.post(getApiHost() + '/Auth/SendPasswordResetCodeToEmail?email=' + email, email, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Reset password by Email (change password)
        sendEmailNewPassword: function (data) {
            return $http.post(getApiHost() + '/Auth/ResetPasswordByEmail', data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Check Phone
        checkPhone: function (phone) {
            return $http.get(getApiHost() + '/Auth/PhoneAvailable?phone=' + phone, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Post Phone
        postPhone: function (phone) {
            return $http.post(getApiHost() + '/Auth/VerifyPhone?phone=' + phone, phone, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Post Full Phone
        postFullPhoneReg: function (data) {
            return $http.post(getApiHost() + '/Auth/RegisterByPhone', data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Reset password by Phone (code)
        sendPasswordResetCode: function (number) {
            return $http.post(getApiHost() + '/Auth/SendPasswordResetCodeToPhone?phone=' + number, number, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Reset password by Phone (change password)
        sendNewPassword: function (data) {
            return $http.post(getApiHost() + '/Auth/ResetPasswordByPhone', data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // LogIn
        postLogin: function (data) {
            return $http.post(getApiHost() + '/Auth/Login?username=' + data.username + '&password=' + data.password, data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // LogIn Check
        checkLogin: function (ip) {
            return $http.get(getApiHost() + '/Dashboard/IsIAmLoggedIn?ip=' + ip, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // LogOut
        getLogout: function () {
            return $http.get(getApiHost() + '/Auth/Logout', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Become User
        getBecomeUser: function () {
            return $http.get(getApiHost() + '/BecomeUser/Logout', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // LogIn IP
        getIP: function () {
            return $http.get('/myIp.php', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Ext IP
        getExtIP: function () {
            return $http.get('/extIp.php', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Admin
        getAdminState: function () {
            return $http.get(getApiHost() + '/Admin/ParmFunctions', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        postAdminState: function (data) {
            return $http.post(getApiHost() + '/Admin/ParmFunctions', data,{
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Private Office (User info)
        getUserInfo: function () {
            return $http.get(getApiHost() + '/Dashboard/Info/', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        copySpecForm: function (formId) {
            return $http.post(getApiHost() + '/Specialist/MakeCopy?id=' + formId, formId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        rejectForm: function (form) {
            return $http.post(getApiHost() + '/ContactPerson/Withdrawal', form, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Spec
        getEarlyEnroll: function (statementId) {
            return $http.get(getApiHost() + '/Appointment/ActualAppointment?CpId=' + statementId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getEnrollWeeks: function () {
            return $http.get(getApiHost() + '/Appointment/Weeks', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getEnrollDates: function (week) {
            return $http.get(getApiHost() + '/Appointment/?Week=' + week, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        postEnrollDate: function (data) {
            return $http.post(getApiHost() + '/Appointment/Appoint?Date=' + data.date + '&Time=' + data.time + '&CpId=' + data.cpId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Odr
        getOrdEarlyEnroll: function (statementId) {
            return $http.get(getApiHost() + '/OrdAppointment/ActualAppointment?CpId=' + statementId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getOrdEnrollWeeks: function () {
            return $http.get(getApiHost() + '/OrdAppointment/Weeks', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getOrdEnrollDates: function (week) {
            return $http.get(getApiHost() + '/OrdAppointment/?Week=' + week, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        postOrdEnrollDate: function (data) {
            return $http.post(getApiHost() + '/OrdAppointment/Appoint?Date=' + data.date + '&Time=' + data.time + '&CpId=' + data.cpId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getApplicationLines: function (statementId) {
            return $http.get(getApiHost() + '/ContactPerson/' + statementId + '/ApplicationLines', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Files
        saveFile: function (newFile) {
            return $http.post(getApiHost() + '/File/Save', newFile, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        deleteFile: function (fileId) {
            return $http.delete(getApiHost() + '/File/Delete/' + fileId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Help
        getHelpTypes: function () {
            return $http.get(getApiHost() + '/Help/Types', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        postHelp: function (data) {
            return $http.post(getApiHost() + '/Help/', data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Statistics
        getUserList: function () {
            return $http.get(getApiHost() + '/Admin/UserList', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        enterAsUser: function (userName) {
            return $http.get(getApiHost() + '/Admin/BecomeUser?username=' + userName, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // Support
        getSupportUserList: function () {
            return $http.get(getApiHost() + '/Support/UserList', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getSupportUserInfo: function (userId) {
            return $http.get(getApiHost() + '/Support/ContactPerson/' + userId + '/Info', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // TAB 1
        getGenders: function () {
            return $http.get(getApiHost() + '/Dictionary/Gender', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getIdentityCards: function () {
            return $http.get(getApiHost() + '/Dictionary/IdentityCardUniversity', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getAddressCountryRegiones: function () {
            return $http.get(getApiHost() + '/Dictionary/AddressCountryRegion', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getDocTypes: function () {
            return $http.get(getApiHost() + '/Dictionary/NameChangeDocTypes', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // TAB 2
        getAddress: function (data) {
            return $http.post(getApiHostSearch() + '/rest/searchAddressAlt', data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getInnerAddress: function (data) {
            return $http.post(getApiHostSearch() + '/rest/getDataForAddresses', data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getFillAddress: function (data) {
            return $http.post(getApiHostSearch() + '/rest/fillAddressAlt', data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getDataAddressFlat: function (data) {
            return $http.post(getApiHostSearch() + '/rest/getDataForAddressHouseOrFlat', data, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // TAB 3
        getAddressState: function () {
            return $http.get(getApiHost() + '/Dictionary/AddressState', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getEduLevels: function (id) {
            return $http.get(getApiHost() + '/Dictionary/EduLevel?actualEduLevel=' + id, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getHighSchools: function () {
            return $http.get(getApiHost() + '/Dictionary/HighSchool', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getAcadamyYears: function () {
            return $http.get(getApiHost() + '/Dictionary/AcadamyYear', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getEduDocs: function (levelId, id) {
            return $http.get(getApiHost() + '/Dictionary/ViewEduDoc?EduLevelId=' + levelId +  '&ActualEducationLevel=' + id, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getSpecList: function (levelId) {
            return $http.get(getApiHost() + '/Dictionary/OrdSpecialities?eduLevelId=' + levelId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getLangInfo: function () {
            return $http.get(getApiHost() + '/Dictionary/LangInfo', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getLanguages: function () {
            return $http.get(getApiHost() + '/Dictionary/Language', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getLanguageLevel: function () {
            return $http.get(getApiHost() + '/Dictionary/LanguageLevel', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // TAB 4
        getOrdPreferenceIndividualAchievements: function () {
            return $http.get(getApiHost() + '/Dictionary/PreferenceOrdIndividualAchievements', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getAspPreferenceIndividualAchievements: function () {
            return $http.get(getApiHost() + '/Dictionary/PreferenceAspIndividualAchievements', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getPreferenceIndividualAchievements: function () {
            return $http.get(getApiHost() + '/Dictionary/PreferenceIndividualAchievements', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getDocumentsByPrefId: function (prefId) {
            return $http.get(getApiHost() + '/Dictionary/DocumentsByPrefId?id=' + encodeURIComponent(prefId), {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        deleteField: function (fieldId) {
            return $http.delete(getApiHost() + '/ContactPerson/EntrantPreference/' + fieldId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // TAB 5
        getPreferenceOlymp: function () {
            return $http.get(getApiHost() + '/Dictionary/PreferenceOlymp', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // TAB 6
        getFamRelationship: function () {
            return $http.get(getApiHost() + '/Dictionary/FamRelationship', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // TAB 7
        getSoldiery: function () {
            return $http.get(getApiHost() + '/Dictionary/Soldiery', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getSoldieryStatus: function () {
            return $http.get(getApiHost() + '/Dictionary/SoldieryStatus', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getMilitaryFormDocs: function () {
            return $http.get(getApiHost() + '/Dictionary/MilitaryFormDoc', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // TAB 8
        getAspDirections: function () {
            return $http.get(getApiHost() + '/Dictionary/AspDirections', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getAspDirectivity: function (aspSpecId) {
            return $http.get(getApiHost() + '/Dictionary/AspDirectivity?spec=' + aspSpecId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getAspConditions: function (aspSpecId, aspDirId) {
            return $http.get(getApiHost() + '/Dictionary/AspConditions?spec=' + encodeURIComponent(aspSpecId) + '&direct=' + encodeURIComponent(aspDirId), {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getDeliveryType: function () {
            return $http.get(getApiHost() + '/Dictionary/DeliveryType', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getCommonPlaces: function () {
            return $http.get(getApiHost() + '/SpecApplWizard/CommonPlaces', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getTarget: function () {
            return $http.get(getApiHost() + '/SpecApplWizard/Target', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getAddressStatsByPortalApplWizardId: function () {
            return $http.get(getApiHost() + '/Dictionary/TargOrgAddressStates', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getApplWizardTargOrg: function (state) {
            return $http.get(getApiHost() + '/Dictionary/TargOrg/find?addressStateId=' + encodeURIComponent(state.addressStateId), {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getSpecialQuota: function () {
            return $http.get(getApiHost() + '/SpecApplWizard/SpecialQuota', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getPreferenceSpecialQuota: function () {
            return $http.get(getApiHost() + '/Dictionary/PreferenceSpecialQuota', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getNoExam: function () {
            return $http.get(getApiHost() + '/SpecApplWizard/NoExam', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getPreferenceNoExam: function () {
            return $http.get(getApiHost() + '/Dictionary/PreferenceNoExam', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getPreferencePreferentialRight: function () {
            return $http.get(getApiHost() + '/Dictionary/PreferencePreferentialRight', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getAccredTest: function () {
            return $http.get(getApiHost() + '/Dictionary/OrdAccredTest', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getTestOrganizations: function () {
            return $http.get(getApiHost() + '/Dictionary/OrdTestOrganizations', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        // TAB 9
        getOrdSpecialities: function () {
            return $http.get(getApiHost() + '/Dictionary/OrdApplSpecialities', {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getOrdDirectivity: function (specId, cpId) {
            return $http.get(getApiHost() + '/Dictionary/OrdApplConditionsByCp?specId=' + specId + '&cpId=' + cpId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getOrdTargetStateList: function (applWizardId) {
            return $http.get(getApiHost() + '/Dictionary/OrdTargRegons?wizardId=' + applWizardId, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        },
        getOrdTargetOrgList: function (applWizardId, targState) {
            return $http.get(getApiHost() + '/Dictionary/OrdTardOrganizations?portalApplWizardId=' + applWizardId + '&addressStateId=' + targState, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            })
        }
    }
});
