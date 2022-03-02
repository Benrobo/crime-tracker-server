import { db, util } from "../helpers/global.js";

export default class Suspects {

    add(res, payload) {
        if (res === "" || res === undefined || res === null) {
            return "adding of prediction requires a valid {res} object but got none"
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
                                return util.sendJson(res, { error: false, message: "failed: suspect already exist for this case" }, 403)
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

    delete(res, payload) {
        if (res === "" || res === undefined || res === null) {
            return "deleting of prediction requires a valid {res} object but got none"
        }

        if (payload && Object.entries(payload).length > 0) {
            if (payload.userId === undefined || payload.caseId === undefined || payload.predictionId === undefined) {
                return util.sendJson(res, { error: true, message: "payload requires a valid fields [userid,caseid,predictionId] but got undefined" }, 400)
            }

            if (payload.userId === "") {
                return util.sendJson(res, { error: true, message: "deleting prediction requires a valid userid but got none" }, 400)
            }
            if (payload.caseId === "") {
                return util.sendJson(res, { error: true, message: "deleting prediction requires a valid caseid but got none" }, 400)
            }
            if (payload.predictionId === "") {
                return util.sendJson(res, { error: true, message: "deleting of suspect prediction requires a valid predictionId but got none" }, 400)
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
                        return util.sendJson(res, { error: true, message: "fail to delete prediction: user or officer [id] doesnt exist" }, 404)
                    }

                    const { userId, caseId, predictionId } = payload;

                    // check also if caseId is valid and exist
                    const q2 = `SELECT * FROM cases WHERE id=$1`;
                    db.query(q2, [caseId.trim()], (err, data2) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data2.rowCount === 0) {
                            return util.sendJson(res, { error: true, message: "failed to delete prediction: case doesnt exist" }, 403)
                        }

                        // check if prediction data already exist in db b4 adding new one
                        // the same suspect cant be added twice for same case

                        let q3 = `SELECT * FROM prediction WHERE id=$1 AND "userId"=$2 AND "caseId"=$3`
                        db.query(q3, [predictionId.trim(), userId.trim(), caseId.trim()], (err, data3) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            if (data3.rowCount === 0) {
                                return util.sendJson(res, { error: false, message: "fialed to delete: prediction doesnt exist." }, 403)
                            }

                            const sql = `DELETE FROM prediction WHERE id=$1 AND "userId"=$2 AND "caseId"=$3`;
                            db.query(sql, [predictionId.trim(), userId.trim(), caseId.trim()], (err) => {
                                if (err) {
                                    return util.sendJson(res, { error: true, message: err.message }, 400)
                                }

                                return util.sendJson(res, { error: false, message: "prediction deleted succesfully" }, 200)
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



