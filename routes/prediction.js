import { router, util } from "../helpers/global.js"
import Prediction from "../services/prediction.js"
import API_ROUTE from "../api-routes/index.js"
import { checkAuth } from "../middlewares/auth.js";

const prediction = new Prediction();


export const addPrediction = router.post(API_ROUTE.addPrediction, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "adding of prediction required a valid payload but got none" }, 404)
        }
        return prediction.add(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})


export const deletePrediction = router.delete(API_ROUTE.deletePrediction, checkAuth, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "deleting of prediction required a valid payload but got none" }, 404)
        }
        return prediction.delete(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})
