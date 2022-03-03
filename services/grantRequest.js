
import { db, util } from "../helpers/global.js";

export default class GrantRequest {
    // logged In users
    officerRegisterationApproved(res, data) {
        if (res === "" || res === undefined || res === null) {
            return "officerAuth requires a valid {res} object but got none"
        }

        if (data && Object.entries(data).length > 0) {
            if (data.userId === undefined || data.officerId === undefined) {
                return util.sendJson(res, { error: true, message: "data requires a valid fields [userId, officerId] but got undefined" }, 400)
            }
            if (data.userId === "") {
                return util.sendJson(res, { error: true, message: "userId cant be empty" }, 400)
            }
            if (data.officerId === "") {
                return util.sendJson(res, { error: true, message: "officerId cant be empty" }, 400)
            }
            // check if user exist
            try {
                const sql = `SELECT * FROM users WHERE "userId"=$1`
                db.query(sql, [data.userId.trim()], (err, result) => {
                    if (err) {
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    if (result.rowCount === 0) {
                        return util.sendJson(res, { error: true, message: "user with that ID dont exists" }, 404)
                    }

                    // check if officer exist
                    const q2 = `SELECT * FROM users WHERE "userId"=$1`
                    db.query(q2, [data.officerId.trim()], (err, data1) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data1.rowCount === 0) {
                            return util.sendJson(res, { error: true, message: "officer with that ID dont exists" }, 404)
                        }

                        //  check who is making the request, only admin are meant to approve other officer request

                        if (result.rows[0].userRole === "user") {
                            return util.sendJson(res, { error: true, message: "failed: only admin are meant to approve." }, 403)
                        }

                        // check if userStatus is pending
                        if (data1.rows[0].userStatus === "pending") {
                            // update data
                            const status = "approved"
                            const sql2 = `UPDATE users SET "userStatus"=$1 WHERE "userId"=$2`
                            return db.query(sql2, [status, data.officerId.trim()], (err) => {
                                if (err) {
                                    return util.sendJson(res, { error: true, message: err.message }, 400)
                                }

                                return util.sendJson(res, { error: false, message: "officer successfully approved." }, 200)
                            })
                        }

                        return util.sendJson(res, { error: false, message: "officer has been approved already." }, 200)

                    })
                })
            } catch (err) {
                console.log(err);
                return util.sendJson(res, { error: true, message: err.message }, 500)
            }
        }
    }

    officerRegisterationReject(res, data) {
        if (res === "" || res === undefined || res === null) {
            return "officerAuth requires a valid {res} object but got none"
        }

        if (data && Object.entries(data).length > 0) {
            if (data.userId === undefined) {
                return util.sendJson(res, { error: true, message: "data requires a valid fields [userId] but got undefined" }, 400)
            }
            if (data.userId === "") {
                return util.sendJson(res, { error: true, message: "userId cant be empty" }, 400)
            }
            // check if user exist
            try {
                const sql = `SELECT * FROM users WHERE "userId"=$1`
                db.query(sql, [data.userId], (err, result) => {
                    if (err) {
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    if (result.rowCount === 0) {
                        return util.sendJson(res, { error: true, message: "officer with that ID dont exists" }, 404)
                    }

                    // if (result.rows[0].userRole === "user") {

                    // }

                    // check if userStatus is pending
                    if (result.rows[0].userStatus === "approved" || result.rows[0].userStatus === "pending") {
                        // update data
                        const status = "pending"
                        const sql2 = `UPDATE users SET "userStatus"=$1 WHERE "userId"=$2`
                        db.query(sql2, [status, data.userId], (err) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            return util.sendJson(res, { error: false, message: "officer status has been set to pending." }, 200)
                        })
                    }

                })
            } catch (err) {
                console.log(err);
                return util.sendJson(res, { error: true, message: err.message }, 500)
            }
        }
    }
}