import dotenv from "dotenv"
import { app, PATH, FS, __dirname } from "./helpers/global.js"
import bodyParser from "body-parser"
import cors from "cors"
import { registerUser, registerAdmin, logInUsers } from "./routes/auth.js"
import { approveRegRequest, rejectRegRequest } from "./routes/grantRequest.js"
import { AddCase, getCases, deleteCase, editCase } from "./routes/caseRoute.js"
import { getOfficers, getOfficersId, editOfficerDetails, deleteOfficer } from "./routes/usersRoute.js"
import { addPrediction, deletePrediction } from "./routes/prediction.js"
import { addSuspect, editSuspects } from "./routes/suspect.js"


dotenv.config();
// main middlewares
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false }));

// routes middleware

app.get("/", (req, res) => {
  let sendData = [];
  // read the package.json file
  FS.readFile(PATH.join(__dirname, "/package.json"), (err, data) => {
    if (err) {
      return req.status(400).json(err);
    }
    let file = JSON.parse(data);

    sendData.push(file);

    return res.status(200).json(sendData);
  });
});

app.use(registerUser);
app.use(registerAdmin);
app.use(logInUsers);
// cases router
app.use(getCases);
app.use(AddCase);
app.use(editCase);
app.use(deleteCase);

// officers logic
app.use(getOfficers)
app.use(getOfficersId)
app.use(editOfficerDetails)
app.use(deleteOfficer)

// officer approved status
app.use(approveRegRequest);
app.use(rejectRegRequest);

// prediction
app.use(addPrediction)
app.use(deletePrediction)

// suspects
app.use(addSuspect)
app.use(editSuspects)

// listen on a htp port to run and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT);
