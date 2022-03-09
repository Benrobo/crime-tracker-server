import { router, util } from "../helpers/global.js"
import RegisterAuth from "../services/registerAuth.js"
import LogInAuth from "../services/loginAuth.js"
import API_ROUTE from "../api-routes/index.js"

const regAuth = new RegisterAuth()
const loginAuth = new LogInAuth()

export const registerUser = router.post(API_ROUTE.userAuth, async (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "authentication required a valid payload but got none" }, 404)
        }
        return regAuth.officerAuth(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
});

export const registerAdmin = router.post(API_ROUTE.adminAuth, async (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "authentication required a valid payload but got none" }, 404)
        }
        return regAuth.adminAuth(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
});

export const logInUsers = router.post(API_ROUTE.logIn, async (req, res) => {
    try {
        let data = req.body;

        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "authentication required a valid payload but got none" }, 404)
        }
        return loginAuth.usersLoggedIn(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
});
