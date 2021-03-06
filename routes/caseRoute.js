import { router, util } from "../helpers/global.js"
import Cases from "../services/cases.js"
import API_ROUTE from "../api-routes/index.js"
import { checkAuth } from "../middlewares/auth.js";

const cases = new Cases();

export const getCases = router.post(API_ROUTE.getCases, checkAuth, (req, res) => {
    try {
        return cases.allCases(res)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})

export const AddCase = router.post(API_ROUTE.addCase, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "adding a case required a valid payload but got none" }, 404)
        }
        return cases.addCase(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})

export const editCase = router.put(API_ROUTE.editCase, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "editing a case required a valid payload but got none" }, 404)
        }
        return cases.editCase(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})

export const deleteCase = router.delete(API_ROUTE.deleteCase, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "deleting a case required a valid payload but got none" }, 404)
        }
        return cases.deleteCase(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})