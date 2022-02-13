
import { db, util } from "../helpers/global.js";

export default class LogInAuth {
    // logged In users
    usersLoggedIn(res, data) {
        if (res === "" || res === undefined || res === null) {
            return "officerAuth requires a valid {res} object but got none"
        }

        if (data && Object.entries(data).length > 0) {
            if (data.email === undefined || data.password === undefined) {
                return util.sendJson(res, { error: true, message: "data requires a valid fields [email, password] but got undefined" }, 400)
            }
            if (data.email === "") {
                return util.sendJson(res, { error: true, message: "email cant be empty" }, 400)
            }
            if (data.password === "") {
                return util.sendJson(res, { error: true, message: "user password cant be empty" }, 400)
            }
            // validate data
            if (util.validateEmail(data.email) === false) {
                return util.sendJson(res, { error: true, message: "user mail is invalid" })
            }

            // check if user exist
            try {
                const sql = `SELECT * FROM users WHERE mail=$1`
                db.query(sql, [data.email], (err, result) => {
                    if (err) {
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    if (result.rowCount === 0) {
                        return util.sendJson(res, { error: false, message: "officer with that email dont exists" }, 404)
                    }

                    // verify password
                    if (util.compareHash(data.password, result.rows[0].hash) === false) {
                        return util.sendJson(res, { error: false, message: "password given is incorrect" }, 403)
                    }

                    // update data
                    const tokenPayload = {
                        id: result.rows[0].userId,
                        type: result.rows[0].userType,
                        role: result.rows[0].userRole,
                        rank: result.rows[0].userRank,
                        status: result.rows[0].userStatus,
                    }
                    const refreshToken = util.genRefreshToken(tokenPayload)
                    // const accessToken = util.genAccessToken(tokenPayload)
                    const sql2 = `UPDATE users SET "refreshToken"=$1 WHERE mail=$2`
                    db.query(sql2, [refreshToken, data.email], (err) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        tokenPayload["refreshToken"] = refreshToken;

                        return util.sendJson(res, { error: false, message: "user loggedIn succesfully.", data: [tokenPayload] }, 200)
                    })
                })
            } catch (err) {
                console.log(err);
                return util.sendJson(res, { error: false, message: err.message }, 500)
            }
        }
    }
}