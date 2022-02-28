import { db, util } from "../helpers/global.js";


export default class Cases {
    addCase(res, data) {
        if (res === "" || res === undefined || res === null) {
            return "adding of case requires a valid {res} object but got none"
        }

        if (data && Object.entries(data).length > 0) {
            if (data.userId === undefined || data.caseId === undefined || data.caseName === undefined || data.officerId === undefined || data.note === undefined) {
                return util.sendJson(res, { error: true, message: "data requires a valid fields [userid,caseid,casename,officerid,note] but got undefined" }, 400)
            }

            if (data.userId === "") {
                return util.sendJson(res, { error: true, message: "case requires a valid userid but got none" }, 400)
            }
            if (data.caseId === "") {
                return util.sendJson(res, { error: true, message: "case requires a valid caseid but got none" }, 400)
            }
            if (data.caseName === "") {
                return util.sendJson(res, { error: true, message: "case requires a valid casename but got none" }, 400)
            }
            if (data.officerId === "") {
                return util.sendJson(res, { error: true, message: "case requires a valid officerid but got none" }, 400)
            }
            if (data.note === "") {
                return util.sendJson(res, { error: true, message: "case requires a valid note but got none" }, 400)
            }

            try {
                // check if officer id and userid exist in db
                const q1 = `SELECT * FROM users WHERE "userId"=$1 OR "userId"=$2`
                db.query(q1, [data.userId, data.officerId], (err, result) => {
                    if (err) {
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    if (result.rowCount === 0) {
                        return util.sendJson(res, { error: true, message: "fail to add case: user or officer [id] doesnt exist" }, 404)
                    }

                    const { userId, caseId, caseName, officerId, note } = data;

                    // check also if officer has already been assigned to that specific case
                    const q2 = `SELECT * FROM cases WHERE id=$1 AND "officerId"=$2`;
                    db.query(q2, [caseId.trim(), officerId.trim()], (err, data2) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data2.rowCount > 0) {
                            return util.sendJson(res, { error: true, message: "fail to add case: officer exist for that case" }, 403)
                        }

                        const date = util.formatDate()
                        const sql = `INSERT INTO cases(id,"caseName","userId","officerId",note,"created_at") VALUES($1,$2,$3,$4,$5,$6)`;
                        db.query(sql, [caseId.trim(), caseName.trim(), userId.trim(), officerId.trim(), note.trim(), date.trim()], (err) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            return util.sendJson(res, { error: false, message: "case added succesfully" }, 200)
                        })

                    })
                })
            } catch (err) {
                return util.sendJson(res, { error: true, message: err.message }, 500)
            }
        }
    }
}