import { router, util } from "../helpers/global.js"
import Cases from "../services/cases.js"
import API_ROUTE from "../api-routes/index.js"

const cases = new Cases();



export const AddCase = router.post(API_ROUTE.addCase, (req, res) => {
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