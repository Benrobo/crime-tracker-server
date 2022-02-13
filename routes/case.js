import { router, util } from "../helpers/global.js"
import addCase from "../services/addCase.js"

import API_ROUTE from "../api-routes/index.js"

const AddCase = (API_ROUTE.addCase, (req, res) => {
    try {
        let data = req.body;
        if (!data || data === "" || typeof data === "function" || typeof data === "string" || data === null) {
            return util.sendJson(res, { message: "failed: payload is required" }, 400)
        }
        if (Object.entries(data).length === 0) {
            return util.sendJson(res, { message: "adding a case required a valid payload but got none" }, 404)
        }
        return addCase(res, data)
    } catch (err) {
        return util.sendJson(res, { message: err.message }, 500)
    }
})

export default AddCase