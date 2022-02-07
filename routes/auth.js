import { router, util } from "../helpers/global.js"
import RegisterAuth from "../services/registerAuth.js"
import API_ROUTE from "../api-routes/index.js"

const regAuth = new RegisterAuth()

export const registerUser = router.post(API_ROUTE.userAuth, async (req, res) => {
    let data = req.body;
});

export const registerAdmin = router.post(API_ROUTE.adminAuth, async (req, res) => {
    let data = req.body;
});


