import { router, util } from "../helpers/global.js"
import { checkAuth } from "../middlewares/auth.js";
import API_ROUTE from "../api-routes/index.js"
import GrantRequest from "../services/grantRequest.js";

const grant = new GrantRequest()

export const approveRegRequest = router.post(API_ROUTE.approveRegRequest, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "user registeration approved status required a valid payload but got none" }, 404)
        }
        return grant.officerRegisterationApproved(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})

export const rejectRegRequest = router.post(API_ROUTE.rejectRegRequest, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "user registeration approved status required a valid payload but got none" }, 404)
        }
        return grant.officerRegisterationReject(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})
