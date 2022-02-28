import { db, util } from "../helpers/global.js";


export default class Users {
    getAllUsers(res) {
        if (res === "" || res === undefined || res === null) {
            return "fetching of users requires a valid {res} object but got none"
        }

        try {
            const q1 = `SELECT * FROM users`
            db.query(q1, (err, result) => {
                if (err) {
                    return util.sendJson(res, { error: true, message: err.message }, 400)
                }

                return util.sendJson(res, { error: false, data: result.rows }, 400)
            })
        } catch (err) {
            return util.sendJson(res, { error: true, message: err.message }, 500)
        }

    }

    getUsersId(res, data) {
        if (res === "" || res === undefined || res === null) {
            return "fetching of officer details requires a valid {res} object but got none"
        }

        if (data && Object.entries(data).length > 0) {
            if (data.userId === undefined) {
                return util.sendJson(res, { error: true, message: "data requires a valid fields [userid] but got undefined" }, 400)
            }

            if (data.userId === "") {
                return util.sendJson(res, { error: true, message: "userId requires a valid userid but got none" }, 400)
            }
            try {
                const q1 = `SELECT * FROM users WHERE "userId"=$1`
                db.query(q1, [data.userId.trim()], (err, result) => {
                    if (err) {
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    return util.sendJson(res, { error: true, data: result.rows }, 400)
                })
            } catch (err) {
                return util.sendJson(res, { error: true, message: err.message }, 500)
            }
        }
    }

    editUsers(res, data) {
        if (res === "" || res === undefined || res === null) {
            return "updating users data requires a valid {res} object but got none"
        }

        if (data && Object.entries(data).length > 0) {
            if (data.userId === undefined || data.email === undefined || data.userName === undefined || data.passwordState === undefined || data.rank === undefined || data.phoneNumber === undefined) {
                return util.sendJson(res, { error: true, message: "data requires a valid fields [userId,userName, email, passwordState, userRank, phoneNumber] but got undefined" }, 400)
            }
            if (data.userId === "") {
                return util.sendJson(res, { error: true, message: "userId cant be empty" }, 400)
            }
            if (data.userName === "") {
                return util.sendJson(res, { error: true, message: "userName cant be empty" }, 400)
            }
            if (data.email === "") {
                return util.sendJson(res, { error: true, message: "email cant be empty" }, 400)
            }
            if (data.rank === "") {
                return util.sendJson(res, { error: true, message: "rank cant be empty" }, 400)
            }
            if (data.passwordState === "") {
                return util.sendJson(res, { error: true, message: "passwordState cant be empty" }, 400)
            }

            if (data.passwordState === true && (data.password === "" || data.password === undefined)) {
                return util.sendJson(res, { error: true, message: "password cant be empty" }, 400)
            }
            // validate data
            if (util.validateEmail(data.email) === false) {
                return util.sendJson(res, { error: true, message: "user mail is invalid" })
            }

            if (util.validatePhonenumber(data.phoneNumber) === false) {
                return util.sendJson(res, { error: true, message: "user phone number is invalid" })
            }

            // check if user exist
            try {
                const sql = `SELECT * FROM users WHERE mail=$1 OR "phoneNumber"=$2`
                db.query(sql, [data.email.trim(), data.phoneNumber.trim()], (err, result) => {
                    if (err) {
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    if (result.rowCount === 0) {
                        return util.sendJson(res, { error: true, message: "officer with that email or phone number doesnt exists" }, 404)
                    }

                    // insert data
                    const { userId, userName, email, phoneNumber, passwordState, rank } = data
                    let sql2;
                    let queryParams;
                    // check passwordState to see if user wanna update password 
                    if (passwordState === true) {
                        let hash = util.genHash(data.password.trim())
                        sql2 = `UPDATE users SET "userName"=$1, "mail"=$2, "phoneNumber"=$3, "hash"=$4 WHERE "userId"=$5`
                        queryParams = [userName.trim(), email.trim(), phoneNumber.trim(), hash, userId.trim()];
                    }
                    sql2 = `UPDATE users SET "userName"=$1, "mail"=$2, "phoneNumber"=$3 WHERE "userId"=$4`
                    queryParams = [userName.trim(), email.trim(), phoneNumber.trim(), userId.trim()];

                    db.query(sql2, queryParams, (err) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        return util.sendJson(res, { error: false, message: "user updated succesfully." }, 200)
                    })
                })
            } catch (err) {
                console.log(err);
                return util.sendJson(res, { error: true, message: err.message }, 500)
            }
        }
    }

    deleteOfficer(res, data) {
        if (res === "" || res === undefined || res === null) {
            return "deleting of officer account requires a valid {res} object but got none"
        }

        if (data && Object.entries(data).length > 0) {
            if (data.userId === undefined) {
                return util.sendJson(res, { error: true, message: "data requires a valid fields [userid] but got undefined" }, 400)
            }

            if (data.userId === "") {
                return util.sendJson(res, { error: true, message: "deleting of officer acct requires a valid userid but got none" }, 400)
            }

            try {
                // check if officer id and userid exist in db
                const q1 = `SELECT * FROM users WHERE "userId"=$1`
                db.query(q1, [data.userId.trim()], (err, result) => {
                    if (err) {
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    if (result.rowCount === 0) {
                        return util.sendJson(res, { error: true, message: "fail to delete officer acct: offcer notfound" }, 404)
                    }


                    const { userId } = data;

                    const sql = `DELETE FROM users WHERE "userId"=$2`;
                    db.query(sql, [userId.trim()], (err) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        return util.sendJson(res, { error: false, message: "case deleted succesfully" }, 200)
                    })
                })
            } catch (err) {
                return util.sendJson(res, { error: true, message: err.message }, 500)
            }
        }
    }
}