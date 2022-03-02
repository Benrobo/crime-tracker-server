import { db, util } from "../helpers/global.js";



export default class Prediction {

    add(res, payload) {
        if (res === "" || res === undefined || res === null) {
            return "adding of prediction requires a valid {res} object but got none"
        }

        if (payload && Object.entries(payload).length > 0) {
            if (payload.userId === undefined || payload.caseId === undefined || payload.caseName === undefined || payload.suspectId === undefined || payload.rank === undefined) {
                return util.sendJson(res, { error: true, message: "payload requires a valid fields [userid,caseid,casename, suspectId, rank] but got undefined" }, 400)
            }

            if (payload.userId === "") {
                return util.sendJson(res, { error: true, message: "prediction requires a valid userid but got none" }, 400)
            }
            if (payload.caseId === "") {
                return util.sendJson(res, { error: true, message: "prediction requires a valid caseid but got none" }, 400)
            }
            if (payload.caseName === "") {
                return util.sendJson(res, { error: true, message: "prediction requires a valid casename but got none" }, 400)
            }
            if (payload.suspectId === "") {
                return util.sendJson(res, { error: true, message: "prediction requires a valid suspectId but got none" }, 400)
            }
            if (payload.rank === "") {
                return util.sendJson(res, { error: true, message: "prediction requires a valid rank but got none" }, 400)
            }

            // validate rank
            const MAX = 10;
            const MIN = 1;

            if (typeof parseInt(payload.rank) !== "number") {
                return util.sendJson(res, { error: true, message: "prediction requires a valid rank" }, 400)
            }
            if (parseInt(payload.rank) > MAX || parseInt(payload.rank) < MIN) {
                return util.sendJson(res, { error: true, message: "prediction rank must be between 1 and 10" }, 400)
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
                        return util.sendJson(res, { error: true, message: "fail to add prediction: user or officer [id] doesnt exist" }, 404)
                    }

                    const { userId, caseId, caseName, suspectId, rank } = payload;

                    // check also if caseId is valid and exist
                    const q2 = `SELECT * FROM cases WHERE id=$1`;
                    db.query(q2, [caseId.trim()], (err, data2) => {
                        if (err) {
                            return util.sendJson(res, { error: true, message: err.message }, 400)
                        }

                        if (data2.rowCount === 0) {
                            return util.sendJson(res, { error: true, message: "failed to add prediction: case doesnt exist" }, 403)
                        }

                        // check if suspect already exist in suspects table
                        const q3 = `SELECT * FROM suspects WHERE id=$1`
                        db.query(q3, [suspectId.trim()], (err, data3) => {
                            if (err) {
                                return util.sendJson(res, { error: true, message: err.message }, 400)
                            }

                            if (data3.rowCount === 0) {
                                return util.sendJson(res, { error: false, message: "fialed: suspect doesnt exist, please add one" }, 404)
                            }

                            // check if prediction data already exist in db b4 adding new one
                            // the same suspect cant be added twice for same case

                            let q4 = `SELECT * FROM prediction WHERE "caseId"=$1 AND "userId"=$2 AND "suspectId"=$3`
                            db.query(q4, [caseId.trim(), userId.trim(), suspectId.trim()], (err, data4) => {
                                if (err) {
                                    return util.sendJson(res, { error: true, message: err.message }, 400)
                                }

                                if (data4.rowCount > 0) {
                                    return util.sendJson(res, { error: false, message: "fialed: suspect already exist for that case." }, 403)
                                }


                                const id = util.genId()
                                const date = util.formatDate()
                                const sql = `INSERT INTO prediction(id, "userId", "caseName", "caseId", "suspectId", rank, "created_at") VALUES($1,$2,$3,$4,$5,$6,$7)`;
                                db.query(sql, [id, userId.trim(), caseName.trim(), caseId.trim(), suspectId.trim(), typeof rank === "string" ? rank.trim() : rank, date.trim()], (err) => {
                                    if (err) {
                                        return util.sendJson(res, { error: true, message: err.message }, 400)
                                    }

                                    return util.sendJson(res, { error: false, message: "prediction added succesfully" }, 200)
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



