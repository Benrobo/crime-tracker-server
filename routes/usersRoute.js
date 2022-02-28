import { router, util } from "../helpers/global.js"
import Users from "../services/users.js"
import API_ROUTE from "../api-routes/index.js"
import { checkAuth } from "../middlewares/auth.js";

const users = new Users();

export const getOfficers = router.post(API_ROUTE.getOfficers, checkAuth, (req, res) => {
    try {
        return users.getAllUsers(res)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})

export const getOfficersId = router.post(API_ROUTE.getOfficersId, checkAuth, (req, res) => {
    try {
        let data = req.body;
        console.log(data);
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "fetching an officer required a valid payload but got none" }, 404)
        }
        return users.getUsersId(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})

export const editOfficerDetails = router.put(API_ROUTE.editOfficer, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "editing officer details required a valid payload but got none" }, 404)
        }
        return users.editUsers(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})


export const deleteOfficer = router.delete(API_ROUTE.deleteOfficer, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "deleting officer acct required a valid payload but got none" }, 404)
        }
        return users.deleteOfficer(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})