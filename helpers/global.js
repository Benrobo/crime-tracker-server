import express from "express";
import path from "path"
import fs from "fs"
import moment from "moment";
import { randomUUID } from "crypto";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import { conn } from "../model/db.js";
import { Util } from "./index.js";


export const db = conn;
export const util = new Util()
export const PATH = path;
export const FS = fs;
export const app = express()
export const Time = moment;
export const uuid = randomUUID
export const bcrypt = bcryptjs;
export const jwt = jsonwebtoken
export const __dirname = path.resolve()
export const router = express.Router()

