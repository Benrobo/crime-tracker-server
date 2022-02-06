import express from "express";
import path from "path"
import fs from "fs"

export const PATH = path;
export const FS = fs;
export const __dirname = path.resolve()
export const app = express()
export const router = express.Router()

