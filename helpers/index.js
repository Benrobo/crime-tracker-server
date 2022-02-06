import {uuid, jwt, bcrypt, Time, env} from "./global.js"

// configure env
env.config()

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
