import { db, util } from "../helpers/global.js";


export default class Cases {
    allCases(res) {
        if (res === "" || res === undefined || res === null) {
            return "fetching of case requires a valid {res} object but got none"
        }

        try {
            const q1 = `SELECT
                            cases.id,
                            cases."caseName",
                            cases."officerId",
                            cases.note,
                            cases.created_at,
                            users."userName",
                            users."userId"
                        FROM 
                            cases
                        INNER JOIN
                            users
                        ON 
                            users."userId"=cases."userId"
                        `
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

    editCase(res, data) {
        if (res === "" || res === undefined || res === null) {
            return "updating of case requires a valid {res} object but got none"
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
                        return util.sendJson(res, { error: true, message: "fail to update case: user or officer [id] doesnt exist" }, 404)
                    }


                    const { userId, caseId, caseName, officerId, note } = data;

                    // check if officer trying to update case data exist for that specific case

                    const q2 = `SELECT * FROM cases WHERE id=$1 AND "userId"=$2`;
                    db.query(q2, [caseId.trim(), userId.trim()], (err, data2) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data2.rowCount === 0) {
                            return util.sendJson(res, { error: true, message: "fail to update case: cant edit case for which you dont belong to." }, 403)
                        }

                        const date = util.formatDate()
                        const sql = `UPDATE cases SET "caseName"=$1, "officerId"=$2 , "note"=$3 WHERE "id"=$4 AND "userId"=$5`;
                        db.query(sql, [caseName.trim(), officerId.trim(), note.trim(), caseId.trim(), userId.trim()], (err) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            return util.sendJson(res, { error: false, message: "case updated succesfully" }, 200)
                        })

                    })
                })
            } catch (err) {
                return util.sendJson(res, { error: true, message: err.message }, 500)
            }
        }
    }

    deleteCase(res, data) {
        if (res === "" || res === undefined || res === null) {
            return "deleting of case requires a valid {res} object but got none"
        }

        if (data && Object.entries(data).length > 0) {
            if (data.userId === undefined || data.caseId === undefined) {
                return util.sendJson(res, { error: true, message: "data requires a valid fields [userid,caseid,officerId] but got undefined" }, 400)
            }

            if (data.userId === "") {
                return util.sendJson(res, { error: true, message: "case requires a valid userid but got none" }, 400)
            }
            if (data.caseId === "") {
                return util.sendJson(res, { error: true, message: "case requires a valid caseid but got none" }, 400)
            }
            if (data.officerId === "") {
                return util.sendJson(res, { error: true, message: "case requires a valid officerId but got none" }, 400)
            }

            try {
                // check if officer id and userid exist in db
                const q1 = `SELECT * FROM users WHERE "userId"=$1 OR "userId"=$2`
                db.query(q1, [data.userId.trim(), data.officerId.trim()], (err, result) => {
                    if (err) {
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    if (result.rowCount === 0) {
                        return util.sendJson(res, { error: true, message: "fail to delete case: user or officer[id] doesnt exist" }, 404)
                    }

                    const { userId, caseId, officerId } = data;

                    // check if case exist b4 deleting

                    const q2 = `SELECT * FROM cases WHERE id=$1`;
                    db.query(q2, [caseId.trim()], (err, data2) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data2.rowCount === 0) {
                            return util.sendJson(res, { error: true, message: "fail to delete: case doesnt exist." }, 404)
                        }

                        // delete other table which have relationship withn the cases tabele

                        const q3 = `DELETE FROM prediction WHERE "caseId"=$1`
                        const q4 = `DELETE FROM evidence WHERE "caseId"=$1`
                        const q5 = `DELETE FROM suspects WHERE "caseId"=$1`

                        // @STEP 1
                        db.query(q3, [caseId.trim()], (err) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            // @STEP 2
                            db.query(q4, [caseId.trim()], (err) => {
                                if (err) {
                                    return util.sendJson(res, { error: true, message: err.message }, 400)
                                }

                                // @STEP 3
                                db.query(q5, [caseId.trim()], (err) => {
                                    if (err) {
                                        return util.sendJson(res, { error: true, message: err.message }, 400)
                                    }

                                    // @STEP 4 FINAL STEP.
                                    const sql = `DELETE FROM cases WHERE id=$1 AND "userId"=$2 AND "officerId"=$3`;
                                    db.query(sql, [caseId.trim(), userId.trim(), officerId.trim()], (err) => {
                                        if (err) {
                                            return util.sendJson(res, { error: true, message: err.message }, 400)
                                        }

                                        return util.sendJson(res, { error: false, message: "case deleted succesfully" }, 200)
                                    })
                                })
                            })
                        })
                    })
                })
            } catch (err) {
                return util.sendJson(res, { error: true, message: err.message }, 500)
            }
        }
    }
}