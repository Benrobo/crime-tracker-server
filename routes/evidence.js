import { router, util } from "../helpers/global.js"
import Evidence from "../services/evidence.js"
import API_ROUTE from "../api-routes/index.js"
import { checkAuth } from "../middlewares/auth.js";

const evidence = new Evidence();

export const allEvidence = router.post(API_ROUTE.allEvidence, checkAuth, (req, res) => {
    try {
        return evidence.allEvidence(res)
    } catch (err) {
        return util.sendJson(res, { error: true, message: err.message }, 500)
    }
})

export const getEvidence = router.post(API_ROUTE.getEvidenceId, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { error: true, message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { error: true, message: "fetching of evidence data required a valid payload but got none" }, 404)
        }
        return evidence.getEvidence(res, data)
    } catch (err) {
        return util.sendJson(res, { error: true, message: err.message }, 500)
    }
})

export const addEvidence = router.post(API_ROUTE.addEvidence, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { error: true, message: "adding of evidence required a valid payload but got none" }, 404)
        }
        return evidence.add(res, data)
    } catch (err) {
        return util.sendJson(res, { error: true, message: err.message }, 500)
    }
})


export const editEvidence = router.put(API_ROUTE.editEvidence, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { error: true, message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { error: true, message: "updating of evidence required a valid payload but got none" }, 404)
        }
        return evidence.edit(res, data)
    } catch (err) {
        return util.sendJson(res, { error: true, message: err.message }, 500)
    }
})


export const deleteEvidence = router.delete(API_ROUTE.deleteEvidence, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "deleting of evidence required a valid payload but got none" }, 404)
        }
        return evidence.delete(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})
