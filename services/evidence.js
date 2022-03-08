import { db, util } from "../helpers/global.js";

export default class Evidence {

    allEvidence(res) {
        if (res === "" || res === undefined || res === null) {
            return "fetching all evidence info requires a valid {res} object but got none"
        }

        try {
            const q = `SELECT * FROM evidence`
            db.query(q, (err, data3) => {
                if (err) {
                    return util.sendJson(res, { error: true, message: err.message }, 400)
                }

                return util.sendJson(res, { error: false, data: data3.rows }, 200)
            })
        }
        catch (err) {
            return util.sendJson(res, { error: true, message: err.message }, 400)
        }
    }

    getEvidence(res, payload) {
        if (res === "" || res === undefined || res === null) {
            return "fetching of evidence info requires a valid {res} object but got none"
        }

        if (payload && Object.entries(payload).length > 0) {
            if (payload.userId === undefined || payload.caseId === undefined) {
                return util.sendJson(res, { error: true, message: "payload requires a valid fields [userid,caseid] but got undefined" }, 400)
            }

            if (payload.userId === "") {
                return util.sendJson(res, { error: true, message: "fetching evidence requires a valid userid but got none" }, 400)
            }
            if (payload.caseId === "") {
                return util.sendJson(res, { error: true, message: "fetching evidence requires a valid caseid but got none" }, 400)
            }
            try {
                // check if officer id and userid exist in db
                const q1 = `SELECT * FROM users WHERE "userId"=$1`
                db.query(q1, [payload.userId.trim()], (err, result) => {
                    if (err) {
                        console.log(err);
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    if (result.rowCount === 0) {
                        return util.sendJson(res, { error: true, message: "fail to fetch evidence: user or officer [id] doesnt exist" }, 404)
                    }

                    const { userId, caseId } = payload;

                    // check also if caseId is valid and exist
                    const q2 = `SELECT * FROM cases WHERE id=$1`;
                    db.query(q2, [caseId.trim()], (err, data2) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data2.rowCount === 0) {
                            return util.sendJson(res, { error: true, message: "failed to fetch evidence: case doesnt exist" }, 404)
                        }

                        // refrence
                        // const q3 = `SELECT suspects.id,users."userName", suspects."caseId", suspects."suspectName", suspects."caseId", suspects.note, suspects.address, suspects.relation, suspects."userId", cases."officerId", cases."caseName",prediction.rank, suspects."suspectImg" FROM suspects INNER JOIN cases ON cases.id=suspects."caseId" INNER JOIN prediction ON suspects."caseId"=cases."id" INNER JOIN users ON users."userId"=cases."userId" WHERE suspects."userId"=$1 AND suspects."caseId"=$2`

                        // check if suspect already exist in suspects table
                        const q3 = `SELECT 
                                        evidence.id,
                                        evidence."userId",
                                        evidence."caseId",
                                        evidence."suspectId",
                                        evidence."suspectName",
                                        evidence.evidence,
                                        evidence."note",
                                        evidence."created_at",
                                        prediction.rank,
                                        prediction."suspectId"
                                    FROM 
                                        evidence 
                                    INNER JOIN 
                                        prediction 
                                    ON 
                                        prediction."caseId"=evidence."caseId"
                                    WHERE 
                                        evidence."caseId"=$1`
                        db.query(q3, [caseId.trim()], (err, data3) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            return util.sendJson(res, { error: false, data: data3.rows }, 200)
                        })

                    })
                })
            } catch (err) {
                return util.sendJson(res, { error: true, message: err.message }, 500)
            }
        }
    }

    getEvidenceById(res, payload) {
        if (res === "" || res === undefined || res === null) {
            return "fetching of evidence info requires a valid {res} object but got none"
        }

        if (payload && Object.entries(payload).length > 0) {
            if (payload.userId === undefined || payload.caseId === undefined || payload.evidenceId === undefined) {
                return util.sendJson(res, { error: true, message: "payload requires a valid fields [userid,caseid,evidenceId] but got undefined" }, 400)
            }

            if (payload.userId === "") {
                return util.sendJson(res, { error: true, message: "fetching evidence requires a valid userid but got none" }, 400)
            }
            if (payload.caseId === "") {
                return util.sendJson(res, { error: true, message: "fetching evidence requires a valid caseid but got none" }, 400)
            }
            if (payload.evidenceId === "") {
                return util.sendJson(res, { error: true, message: "fetching evidence requires a valid evidenceId but got none" }, 400)
            }
            try {
                // check if officer id and userid exist in db
                const q1 = `SELECT * FROM users WHERE "userId"=$1`
                db.query(q1, [payload.userId.trim()], (err, result) => {
                    if (err) {
                        console.log(err);
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    if (result.rowCount === 0) {
                        return util.sendJson(res, { error: true, message: "fail to fetch evidence: user or officer [id] doesnt exist" }, 404)
                    }

                    const { evidenceId, caseId } = payload;

                    // check also if caseId is valid and exist
                    const q2 = `SELECT * FROM cases WHERE id=$1`;
                    db.query(q2, [caseId.trim()], (err, data2) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data2.rowCount === 0) {
                            return util.sendJson(res, { error: true, message: "failed to fetch evidence: case doesnt exist" }, 404)
                        }

                        const q3 = `SELECT 
                                        evidence.id,
                                        evidence."userId",
                                        evidence."caseId",
                                        evidence."suspectId",
                                        evidence."suspectName",
                                        evidence.evidence,
                                        evidence."note",
                                        evidence."created_at",
                                        prediction.rank,
                                        prediction."suspectId"
                                    FROM 
                                        evidence 
                                    INNER JOIN 
                                        prediction 
                                    ON 
                                        prediction."caseId"=evidence."caseId"
                                    WHERE 
                                        evidence."caseId"=$1 AND evidence.id=$2`
                        db.query(q3, [caseId.trim(), evidenceId.trim()], (err, data3) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            return util.sendJson(res, { error: false, data: data3.rows }, 200)
                        })

                    })
                })
            } catch (err) {
                return util.sendJson(res, { error: true, message: err.message }, 500)
            }
        }
    }

    add(res, payload) {
        if (res === "" || res === undefined || res === null) {
            return "adding of evidence requires a valid {res} object but got none"
        }

        if (payload && Object.entries(payload).length > 0) {
            if (payload.userId === undefined || payload.caseId === undefined || payload.suspectName === undefined || payload.evidence === undefined || payload.suspectId === undefined || payload.note === undefined) {
                return util.sendJson(res, { error: true, message: "payload requires a valid fields [userid,caseid,suspectName, evidence, suspectId, note] but got undefined" }, 400)
            }

            if (payload.userId === "") {
                return util.sendJson(res, { error: true, message: "adding evidence requires a valid userid but got none" }, 400)
            }
            if (payload.caseId === "") {
                return util.sendJson(res, { error: true, message: "adding evidence requires a valid caseid but got none" }, 400)
            }
            if (payload.suspectName === "") {
                return util.sendJson(res, { error: true, message: "adding evidence requires a valid suspectName but got none" }, 400)
            }
            if (payload.suspectId === "") {
                return util.sendJson(res, { error: true, message: "adding evidence requires a valid suspectId but got none" }, 400)
            }
            if (payload.evidence === "") {
                return util.sendJson(res, { error: true, message: "adding evidence requires a valid evidence but got none" }, 400)
            }
            if (payload.note === "") {
                return util.sendJson(res, { error: true, message: "adding evidence requires a valid note but got none" }, 400)
            }

            try {
                // check if officer id and userid exist in db
                const q1 = `SELECT * FROM users WHERE "userId"=$1`
                db.query(q1, [payload.userId.trim()], (err, result) => {
                    if (err) {
                        console.log(err);
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    if (result.rowCount === 0) {
                        return util.sendJson(res, { error: true, message: "fail to add evidence: user or officer [id] doesnt exist" }, 404)
                    }

                    const { userId, caseId, suspectName, suspectId, evidence, note } = payload;

                    // check also if caseId is valid and exist
                    const q2 = `SELECT * FROM cases WHERE id=$1`;
                    db.query(q2, [caseId.trim()], (err, data2) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data2.rowCount === 0) {
                            return util.sendJson(res, { error: true, message: "failed to add evidence: case doesnt exist" }, 404)
                        }

                        // check if suspect exist in suspects table

                        const q3 = `SELECT * FROM suspects WHERE "id"=$1 AND "caseId"=$2`
                        db.query(q3, [suspectId.trim(), caseId.trim()], (err, data3) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            if (data3.rowCount === 0) {
                                return util.sendJson(res, { error: true, message: "failed: either suspect doesnt exist or suspect doesnt exist for that case added" }, 404)
                            }

                            // check if evidence exist already
                            const q4 = `SELECT * FROM evidence WHERE "suspectId"=$1 AND "userId"=$2 AND "caseId"=$3`
                            db.query(q4, [suspectId.trim(), userId.trim(), caseId.trim()], (err, data4) => {
                                if (err) {
                                    return util.sendJson(res, { error: true, message: err.message }, 400)
                                }

                                if (data4.rowCount > 0) {
                                    return util.sendJson(res, { error: true, message: "failed: evidence already exist" }, 400)
                                }

                                // insert data in evidence
                                const id = util.genId()
                                const date = util.formatDate()
                                const sql = `INSERT INTO evidence(id, "userId", "caseId", "evidence", "suspectName", "suspectId","note","created_at") VALUES($1,$2,$3,$4,$5,$6,$7,$8)`;
                                db.query(sql, [id, userId.trim(), caseId.trim(), evidence.trim(), suspectName.trim(), suspectId.trim(), note.trim(), date.trim()], (err) => {
                                    if (err) {
                                        return util.sendJson(res, { error: true, message: err.message }, 400)
                                    }

                                    return util.sendJson(res, { error: false, message: "evidence added succesfully" }, 200)
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

    edit(res, payload) {
        if (res === "" || res === undefined || res === null) {
            return "editing of evidence requires a valid {res} object but got none"
        }

        if (payload && Object.entries(payload).length > 0) {
            if (payload.userId === undefined || payload.caseId === undefined || payload.suspectName === undefined || payload.evidence === undefined || payload.suspectId === undefined || payload.note === undefined || payload.evidenceId === undefined) {
                return util.sendJson(res, { error: true, message: "payload requires a valid fields [userid,caseid,evidenceId,suspectName, evidence, suspectId, note] but got undefined" }, 400)
            }

            if (payload.userId === "") {
                return util.sendJson(res, { error: true, message: "updating evidence requires a valid userid but got none" }, 400)
            }
            if (payload.caseId === "") {
                return util.sendJson(res, { error: true, message: "updating evidence requires a valid caseid but got none" }, 400)
            }
            if (payload.evidenceId === "") {
                return util.sendJson(res, { error: true, message: "updating evidence requires a valid evidenceId but got none" }, 400)
            }
            if (payload.suspectName === "") {
                return util.sendJson(res, { error: true, message: "updating evidence requires a valid suspectName but got none" }, 400)
            }
            if (payload.suspectId === "") {
                return util.sendJson(res, { error: true, message: "updating evidence requires a valid suspectId but got none" }, 400)
            }
            if (payload.evidence === "") {
                return util.sendJson(res, { error: true, message: "updating evidence requires a valid evidence but got none" }, 400)
            }
            if (payload.note === "") {
                return util.sendJson(res, { error: true, message: "updating evidence requires a valid note but got none" }, 400)
            }

            try {
                const q1 = `SELECT * FROM users WHERE "userId"=$1`
                db.query(q1, [payload.userId.trim()], (err, result) => {
                    if (err) {
                        console.log(err);
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    if (result.rowCount === 0) {
                        return util.sendJson(res, { error: true, message: "fail to update evidence: user or officer [id] doesnt exist" }, 404)
                    }

                    const { evidenceId, userId, caseId, suspectName, suspectId, evidence, note } = payload;

                    // check also if caseId is valid and exist
                    const q2 = `SELECT * FROM cases WHERE id=$1`;
                    db.query(q2, [caseId.trim()], (err, data2) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data2.rowCount === 0) {
                            return util.sendJson(res, { error: true, message: "failed to update suspect: case doesnt exist" }, 404)
                        }

                        // check if suspect already exist in suspects table
                        const q3 = `SELECT * FROM suspects WHERE id=$1`
                        db.query(q3, [suspectId.trim()], (err, data3) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            if (data3.rowCount === 0) {
                                return util.sendJson(res, { error: true, message: "failed to update: suspect not found" }, 404)
                            }

                            // check if evidence exist already
                            const q4 = `SELECT * FROM evidence WHERE id=$1`
                            db.query(q4, [evidenceId.trim()], (err, data4) => {
                                if (err) {
                                    return util.sendJson(res, { error: true, message: err.message }, 400)
                                }

                                if (data4.rowCount === 0) {
                                    return util.sendJson(res, { error: true, message: "failed: cant update evidence which doesnt exist" }, 404)
                                }

                                const sql = `UPDATE evidence SET "caseId"=$1, "suspectName"=$2, evidence=$3, "suspectId"=$4, note=$5 WHERE "userId"=$6 AND "caseId"=$7`
                                db.query(sql, [caseId.trim(), suspectName.trim(), evidence.trim(), suspectId.trim(), note.trim(), userId.trim(), caseId.trim()], (err) => {
                                    if (err) {
                                        return util.sendJson(res, { error: true, message: err.message }, 400)
                                    }

                                    return util.sendJson(res, { error: false, message: "evidence updated succesfully" }, 200)
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

    delete(res, payload) {
        if (res === "" || res === undefined || res === null) {
            return "deleting of evidence requires a valid {res} object but got none"
        }

        if (payload && Object.entries(payload).length > 0) {
            if (payload.userId === undefined || payload.caseId === undefined || payload.evidenceId === undefined) {
                return util.sendJson(res, { error: true, message: "payload requires a valid fields [userid,caseid,evidenceId] but got undefined" }, 400)
            }

            if (payload.userId === "") {
                return util.sendJson(res, { error: true, message: "deleting evidence requires a valid userid but got none" }, 400)
            }
            if (payload.caseId === "") {
                return util.sendJson(res, { error: true, message: "deleting evidence requires a valid caseid but got none" }, 400)
            }
            if (payload.evidenceId === "") {
                return util.sendJson(res, { error: true, message: "deleting of evidence requires a valid evidence Id but got none" }, 400)
            }

            try {
                // check if officer id and userid exist in db
                const q1 = `SELECT * FROM users WHERE "userId"=$1`
                db.query(q1, [payload.userId.trim()], (err, result) => {
                    if (err) {
                        console.log(err);
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    if (result.rowCount === 0) {
                        return util.sendJson(res, { error: true, message: "fail to delete evidence: user or officer [id] doesnt exist" }, 404)
                    }

                    const { userId, caseId, evidenceId } = payload;

                    // check also if caseId is valid and exist
                    const q2 = `SELECT * FROM cases WHERE id=$1`;
                    db.query(q2, [caseId.trim()], (err, data2) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data2.rowCount === 0) {
                            return util.sendJson(res, { error: true, message: "failed to delete evidence: case doesnt exist" }, 403)
                        }

                        // check if suspect data already exist in db b4 deleting new one

                        let q3 = `SELECT * FROM evidence WHERE id=$1 AND "userId"=$2 AND "caseId"=$3`
                        db.query(q3, [evidenceId.trim(), userId.trim(), caseId.trim()], (err, data3) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            if (data3.rowCount === 0) {
                                return util.sendJson(res, { error: true, message: "failed: cant delete evidence which was'nt added by you." }, 403)
                            }

                            const sql = `DELETE FROM evidence WHERE id=$1 AND "userId"=$2 AND "caseId"=$3`;
                            db.query(sql, [evidenceId.trim(), userId.trim(), caseId.trim()], (err) => {
                                if (err) {
                                    return util.sendJson(res, { error: true, message: err.message }, 400)
                                }

                                return util.sendJson(res, { error: false, message: "evidence deleted succesfully" }, 200)
                            })
                        })
                    })
                })
            } catch (err) {
                return util.sendJson(res, { error: true, message: err.message }, 500)
            }
        }
    }
    deleteAll(res, payload) {
        if (res === "" || res === undefined || res === null) {
            return "deleting of evidence requires a valid {res} object but got none"
        }

        if (payload && Object.entries(payload).length > 0) {
            if (payload.userId === undefined) {
                return util.sendJson(res, { error: true, message: "payload requires a valid fields [userid] but got undefined" }, 400)
            }

            if (payload.userId === "") {
                return util.sendJson(res, { error: true, message: "deleting all evidence requires a valid userid but got none" }, 400)
            }

            try {
                // check if officer id and userid exist in db
                const q1 = `SELECT * FROM users WHERE "userId"=$1`
                db.query(q1, [payload.userId.trim()], (err, result) => {
                    if (err) {
                        console.log(err);
                        return util.sendJson(res, { error: true, message: err.message }, 400)
                    }

                    if (result.rowCount === 0) {
                        return util.sendJson(res, { error: true, message: "fail to delete evidence: user or officer [id] doesnt exist" }, 404)
                    }

                    // check if userRole is admin cause only admin has the right to clear all
                    if (result.rows[0].userRole !== "admin") {
                        return util.sendJson(res, { error: true, message: "Only admin has permission." }, 401)
                    }

                    const sql = `DELETE FROM evidence`;
                    db.query(sql, (err) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        return util.sendJson(res, { error: false, message: "all evidence deleted succesfully" }, 200)
                    })
                })
            } catch (err) {
                return util.sendJson(res, { error: true, message: err.message }, 500)
            }
        }
    }
}



