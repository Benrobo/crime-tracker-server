import { db, util } from "../helpers/global.js";

export default class Suspects {

    allSuspects(res) {
        if (res === "" || res === undefined || res === null) {
            return "fetching all suspects info requires a valid {res} object but got none"
        }

        try {
            const q = `SELECT * FROM suspects`
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

    getSuspects(res, payload) {
        if (res === "" || res === undefined || res === null) {
            return "fetching of suspects info requires a valid {res} object but got none"
        }

        if (payload && Object.entries(payload).length > 0) {
            if (payload.userId === undefined || payload.caseId === undefined) {
                return util.sendJson(res, { error: true, message: "payload requires a valid fields [userid,caseid] but got undefined" }, 400)
            }

            if (payload.userId === "") {
                return util.sendJson(res, { error: true, message: "adding suspects requires a valid userid but got none" }, 400)
            }
            if (payload.caseId === "") {
                return util.sendJson(res, { error: true, message: "adding suspects requires a valid caseid but got none" }, 400)
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
                        return util.sendJson(res, { error: true, message: "fail to fetch suspect: user or officer [id] doesnt exist" }, 404)
                    }

                    const { userId, caseId } = payload;

                    // check also if caseId is valid and exist
                    const q2 = `SELECT * FROM cases WHERE id=$1`;
                    db.query(q2, [caseId.trim()], (err, data2) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data2.rowCount === 0) {
                            return util.sendJson(res, { error: true, message: "failed to fetch suspect: case doesnt exist" }, 404)
                        }

                        // refrence
                        // const q3 = `SELECT suspects.id,users."userName", suspects."caseId", suspects."suspectName", suspects."caseId", suspects.note, suspects.address, suspects.relation, suspects."userId", cases."officerId", cases."caseName",prediction.rank, suspects."suspectImg" FROM suspects INNER JOIN cases ON cases.id=suspects."caseId" INNER JOIN prediction ON suspects."caseId"=cases."id" INNER JOIN users ON users."userId"=cases."userId" WHERE suspects."userId"=$1 AND suspects."caseId"=$2`

                        // check if suspect already exist in suspects table
                        const q3 = `SELECT 
                                        suspects.id,
                                        users."userName", 
                                        suspects."caseId", 
                                        suspects."suspectName", 
                                        suspects."caseId", 
                                        suspects.note, 
                                        suspects.address, 
                                        suspects."phoneNumber",
                                        suspects.relation, 
                                        suspects."userId", 
                                        cases."officerId", 
                                        cases."caseName",
                                        prediction.rank, 
                                        suspects."suspectImg" 
                                    FROM 
                                        suspects 
                                    INNER JOIN 
                                        cases 
                                    ON 
                                        cases.id=suspects."caseId" 
                                    INNER JOIN 
                                        prediction 
                                    ON 
                                        suspects."caseId"=prediction."caseId" 
                                    INNER JOIN 
                                        users 
                                    ON 
                                        users."userId"=suspects."userId" 
                                    WHERE 
                                        suspects."caseId"=$1`
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

    add(res, payload) {
        if (res === "" || res === undefined || res === null) {
            return "adding of suspects requires a valid {res} object but got none"
        }

        if (payload && Object.entries(payload).length > 0) {
            if (payload.userId === undefined || payload.caseId === undefined || payload.suspectName === undefined || payload.phoneNumber === undefined || payload.address === undefined || payload.relation === undefined || payload.note === undefined || payload.suspectImg === undefined) {
                return util.sendJson(res, { error: true, message: "payload requires a valid fields [userid,caseid,suspectName, address, relation, note, suspectImg] but got undefined" }, 400)
            }

            if (payload.userId === "") {
                return util.sendJson(res, { error: true, message: "adding suspects requires a valid userid but got none" }, 400)
            }
            if (payload.caseId === "") {
                return util.sendJson(res, { error: true, message: "adding suspects requires a valid caseid but got none" }, 400)
            }
            if (payload.suspectName === "") {
                return util.sendJson(res, { error: true, message: "adding suspects requires a valid suspectName but got none" }, 400)
            }
            if (payload.phoneNumber === "") {
                return util.sendJson(res, { error: true, message: "adding suspects requires a valid phoneNumber but got none" }, 400)
            }
            if (payload.relation === "") {
                return util.sendJson(res, { error: true, message: "adding suspects requires a valid relation but got none" }, 400)
            }
            if (payload.address === "") {
                return util.sendJson(res, { error: true, message: "adding suspects requires a valid address but got none" }, 400)
            }
            if (payload.note === "") {
                return util.sendJson(res, { error: true, message: "adding suspects requires a valid note but got none" }, 400)
            }
            if (payload.suspectImg === "") {
                return util.sendJson(res, { error: true, message: "adding suspects requires a valid suspectImg but got none" }, 400)
            }

            // validate phonenumber
            if (!util.validatePhonenumber(payload.phoneNumber.trim())) {
                return util.sendJson(res, { error: true, message: "phone number is invalid" }, 400)
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
                        return util.sendJson(res, { error: true, message: "fail to add suspect: user or officer [id] doesnt exist" }, 404)
                    }

                    const { userId, caseId, suspectName, suspectImg, phoneNumber, relation, note, address } = payload;

                    // check also if caseId is valid and exist
                    const q2 = `SELECT * FROM cases WHERE id=$1`;
                    db.query(q2, [caseId.trim()], (err, data2) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data2.rowCount === 0) {
                            return util.sendJson(res, { error: true, message: "failed to add suspect: case doesnt exist" }, 404)
                        }

                        // check if suspect already exist in suspects table
                        const q3 = `SELECT * FROM suspects WHERE "phoneNumber"=$1 AND "caseId"=$2`
                        db.query(q3, [phoneNumber.trim(), caseId.trim()], (err, data3) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            if (data3.rowCount > 0) {
                                return util.sendJson(res, { error: true, message: "failed: suspect already exist for this case" }, 403)
                            }

                            const id = util.genId()
                            const date = util.formatDate()
                            const sql = `INSERT INTO suspects(id, "userId", "caseId", "suspectName", "phoneNumber", "address","relation", "suspectImg", note, "created_at") VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`;
                            db.query(sql, [id, userId.trim(), caseId.trim(), suspectName.trim(), phoneNumber.trim(), address.trim(), relation.trim(), suspectImg.trim(), note.trim(), date.trim()], (err) => {
                                if (err) {
                                    return util.sendJson(res, { error: true, message: err.message }, 400)
                                }

                                return util.sendJson(res, { error: false, message: "suspect added succesfully" }, 200)
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
            return "editing of suspect requires a valid {res} object but got none"
        }

        if (payload && Object.entries(payload).length > 0) {
            if (payload.userId === undefined || payload.caseId === undefined || payload.suspectName === undefined || payload.phoneNumber === undefined || payload.address === undefined || payload.relation === undefined || payload.note === undefined || payload.suspectImg === undefined) {
                return util.sendJson(res, { error: true, message: "payload requires a valid fields [userid,caseid,suspectName, address, relation, note, suspectImg] but got undefined" }, 400)
            }

            if (payload.userId === "") {
                return util.sendJson(res, { error: true, message: "updating suspects info requires a valid userid but got none" }, 400)
            }
            if (payload.caseId === "") {
                return util.sendJson(res, { error: true, message: "updating suspects info requires a valid caseid but got none" }, 400)
            }
            if (payload.suspectName === "") {
                return util.sendJson(res, { error: true, message: "updating suspects info requires a valid suspectName but got none" }, 400)
            }
            if (payload.phoneNumber === "") {
                return util.sendJson(res, { error: true, message: "updating suspects info requires a valid phoneNumber but got none" }, 400)
            }
            if (payload.relation === "") {
                return util.sendJson(res, { error: true, message: "updating suspects info requires a valid relation but got none" }, 400)
            }
            if (payload.address === "") {
                return util.sendJson(res, { error: true, message: "updating suspects info requires a valid address but got none" }, 400)
            }
            if (payload.note === "") {
                return util.sendJson(res, { error: true, message: "updating suspects info requires a valid note but got none" }, 400)
            }
            if (payload.suspectImg === "") {
                return util.sendJson(res, { error: true, message: "updating suspects info requires a valid suspectImg but got none" }, 400)
            }

            // validate phonenumber
            if (!util.validatePhonenumber(payload.phoneNumber.trim())) {
                return util.sendJson(res, { error: true, message: "phone number is invalid" }, 400)
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
                        return util.sendJson(res, { error: true, message: "fail to update suspect: user or officer [id] doesnt exist" }, 404)
                    }

                    const { userId, caseId, suspectName, suspectImg, phoneNumber, relation, note, address } = payload;

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
                        const q3 = `SELECT * FROM suspects WHERE "phoneNumber"=$1 AND "caseId"=$2`
                        db.query(q3, [phoneNumber.trim(), caseId.trim()], (err, data3) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            if (data3.rowCount === 0) {
                                return util.sendJson(res, { error: false, message: "failed to update: suspect not found" }, 404)
                            }

                            const sql = `UPDATE suspects SET "caseId"=$1, "suspectName"=$2, "phoneNumber"=$3, address=$4, relation=$5, "suspectImg"=$6 , note=$7 WHERE "userId"=$8 AND "caseId"=$9`
                            db.query(sql, [caseId.trim(), suspectName.trim(), phoneNumber.trim(), address.trim(), relation.trim(), suspectImg.trim(), note.trim(), userId.trim(), caseId.trim()], (err) => {
                                if (err) {
                                    return util.sendJson(res, { error: true, message: err.message }, 400)
                                }

                                return util.sendJson(res, { error: false, message: "suspect updated succesfully" }, 200)
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
            return "deleting of suspect requires a valid {res} object but got none"
        }

        if (payload && Object.entries(payload).length > 0) {
            if (payload.userId === undefined || payload.caseId === undefined || payload.suspectId === undefined) {
                return util.sendJson(res, { error: true, message: "payload requires a valid fields [userid,caseid,suspectId] but got undefined" }, 400)
            }

            if (payload.userId === "") {
                return util.sendJson(res, { error: true, message: "deleting suspect requires a valid userid but got none" }, 400)
            }
            if (payload.caseId === "") {
                return util.sendJson(res, { error: true, message: "deleting suspect requires a valid caseid but got none" }, 400)
            }
            if (payload.suspectId === "") {
                return util.sendJson(res, { error: true, message: "deleting of suspect suspect requires a valid suspectId but got none" }, 400)
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
                        return util.sendJson(res, { error: true, message: "fail to delete suspect: user or officer [id] doesnt exist" }, 404)
                    }

                    const { userId, caseId, suspectId } = payload;

                    // check also if caseId is valid and exist
                    const q2 = `SELECT * FROM cases WHERE id=$1`;
                    db.query(q2, [caseId.trim()], (err, data2) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data2.rowCount === 0) {
                            return util.sendJson(res, { error: true, message: "failed to delete suspect: case doesnt exist" }, 403)
                        }

                        // check if suspect data already exist in db b4 deleting new one

                        let q3 = `SELECT * FROM suspects WHERE id=$1 AND "userId"=$2 AND "caseId"=$3`
                        db.query(q3, [suspectId.trim(), userId.trim(), caseId.trim()], (err, data3) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            if (data3.rowCount === 0) {
                                return util.sendJson(res, { error: true, message: "fialed: cant delete suspect data which was'nt added by you." }, 403)
                            }

                            const sql = `DELETE FROM suspects WHERE id=$1 AND "userId"=$2 AND "caseId"=$3`;
                            db.query(sql, [suspectId.trim(), userId.trim(), caseId.trim()], (err) => {
                                if (err) {
                                    return util.sendJson(res, { error: true, message: err.message }, 400)
                                }

                                return util.sendJson(res, { error: false, message: "suspect deleted succesfully" }, 200)
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



