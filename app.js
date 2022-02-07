import dotenv from "dotenv"
import { app, PATH, FS, __dirname } from "./helpers/global.js"
import bodyParser from "body-parser"
import cors from "cors"
import { registerUser, registerAdmin } from "./routes/auth.js"


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

// listen on a htp port to run and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT);
