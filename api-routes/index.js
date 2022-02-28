

const API_ROUTE = {
    userAuth: "/api/auth/officer/register",
    adminAuth: "/api/auth/admin_auth/register",
    logIn: "/api/auth/users/logIn",
    approveRegRequest: "/api/users/request/registeration",
    rejectRegRequest: "/api/users/request/registeration/reject",
    addCase: "/api/cases/add",
    getCases: "/api/cases/all",
    editCase: "/api/cases/edit",
    deleteCase: "/api/cases/delete",
    getOfficers: "/api/officers/all",
    getOfficersId: "/api/officers/id",
    editOfficer: "/api/officers/edit",
    deleteOfficer: "/api/officers/delete",
    addPrediction: "/api/prediction/add",
    editPrediction: "/api/prediction/edit",
    deletePrediction: "/api/prediction/delete",
    getSuspects: "/api/suspects/all",
    addSuspects: "/api/suspects/add",
    editSuspects: "/api/suspects/edit",
    deleteSuspects: "/api/suspects/delete",
}

export default API_ROUTE;