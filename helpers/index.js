import { uuid, jwt, bcrypt, Time } from "./global.js"
import dotenv from "dotenv"

// configure env
dotenv.config()

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

export class Util {
  Error(msg) {
    return new Error(msg);
  }

  genId() {
    const id = uuid();
    return id;
  }

  genCode() {
    let num = "0123456789".split("")
    let code = ""

    for (let i = 1; i < 7; i++) {
      let rand = Math.floor(Math.random() * num.length)
      code += num[rand]
    }
    return code;

  }

  getRelativeTime(format) {
    let validFormats = ["day", "hour"];
    if (format === undefined) {
      return Time().format();
    }
    if (typeof format === Number) {
      return this.Error("Type Error: invalid date format");
    }
    if (!validFormats.includes(format)) {
      return Time().startOf(validFormats[1]).fromNow();
    }

    return Time().startOf(format).fromNow();
  }

  formatDate(format = "") {
    // format = "MMM Do YYYY | dddd | MMM Do YY | empty "
    if (format === undefined) {
      return Time().format();
    }
    if (typeof format === Number) {
      return this.Error("Type Error: invalid date format");
    }
    if (!format || format === "" || format === null || format === undefined) {
      return Time().format("MMM Do YY");
    }

    return Time().format(format);
  }

  genAccessToken(payload) {
    if (payload === "" || payload === undefined) {
      return this.Error("Access token requires a payload field but got none");
    }

    if (typeof payload === "string") {
      return this.Error("expected payload to be an object but got a string");
    }

    return jwt.sign(payload, accessSecret, { expiresIn: "7min" });
  }

  genRefreshToken(payload) {
    if (payload === "" || payload === undefined) {
      return this.Error("Refresh token requires a payload field but got none");
    }
    if (typeof payload === "string") {
      return this.Error("expected payload to be an object but got a string");
    }
    return jwt.sign(payload, refreshSecret, { expiresIn: "1yr" });
  }

  validateEmail(email) {
    const tester =
      /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!email) return false;

    let emailParts = email.split("@");

    if (emailParts.length !== 2) return false;

    let account = emailParts[0];
    let address = emailParts[1];

    if (account.length > 64) return false;
    else if (address.length > 255) return false;

    let domainParts = address.split(".");
    if (
      domainParts.some(function (part) {
        return part.length > 63;
      })
    )
      return false;

    if (!tester.test(email)) return false;

    return true;
  }

  validatePhonenumber(phoneNumber) {
    if (!phoneNumber) return false;
    const regexp =
      /^\+{0,2}([\-\. ])?(\(?\d{0,3}\))?([\-\. ])?\(?\d{0,3}\)?([\-\. ])?\d{3}([\-\. ])?\d{4}/;
    return regexp.test(phoneNumber);
  }

  randomImages(seeds) {
    return `https://avatars.dicebear.com/api/initials/${seeds}.svg`;
  }

  sendJson(res, payload = { msg: "payload is empty" }, code = 401) {
    if (!res) {
      return this.Error("Rresponse object is required");
    }
    return res.status(code).json(payload);
  }

  genHash(string, salt = 10) {
    if (!string || !salt) {
      return this.Error("Password string or salt is required");
    }
    return bcrypt.hashSync(string, salt);
  }

  compareHash(string, hash) {
    if (!string || !hash || string === "" || hash === "") {
      return false;
    }
    return bcrypt.compareSync(string, hash);
  }
}

class Error {
  constructor(msg) {
    this.msg = msg;
    this.name = "Error";
  }
}
