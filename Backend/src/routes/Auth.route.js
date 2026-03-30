import express from "express";
import AuthController from "../controllers/Auth.controller.js";
import { validarLogin } from "../middleware/validations/index.js";

const route = express.Router();

route.post("", validarLogin, AuthController.login);

export default route;
