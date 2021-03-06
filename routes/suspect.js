import { router, util } from "../helpers/global.js"
import Suspects from "../services/suspects.js"
import API_ROUTE from "../api-routes/index.js"
import { checkAuth } from "../middlewares/auth.js";

const suspects = new Suspects();

export const allSuspects = router.post(API_ROUTE.allSuspects, checkAuth, (req, res) => {
    try {
        return suspects.allSuspects(res)
    } catch (err) {
        return util.sendJson(res, { error: true, message: err.message }, 500)
    }
})

export const getSuspects = router.post(API_ROUTE.getSuspects, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { error: true, message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { error: true, message: "fetching of suspects data required a valid payload but got none" }, 404)
        }
        return suspects.getSuspects(res, data)
    } catch (err) {
        return util.sendJson(res, { error: true, message: err.message }, 500)
    }
})

export const addSuspect = router.post(API_ROUTE.addSuspects, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { error: true, message: "adding of suspects required a valid payload but got none" }, 404)
        }
        return suspects.add(res, data)
    } catch (err) {
        return util.sendJson(res, { error: true, message: err.message }, 500)
    }
})


export const editSuspects = router.put(API_ROUTE.editSuspects, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { error: true, message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { error: true, message: "updating of suspect required a valid payload but got none" }, 404)
        }
        return suspects.edit(res, data)
    } catch (err) {
        return util.sendJson(res, { error: true, message: err.message }, 500)
    }
})


export const deleteSuspects = router.delete(API_ROUTE.deleteSuspects, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "deleting of suspect required a valid payload but got none" }, 404)
        }
        return suspects.delete(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})
