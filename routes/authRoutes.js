import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  testController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object

const router = express.Router();

//Routings

//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || METHOD POST
router.post("/login", loginController);

//FORGOT PASSWORD || POST
router.post("/forgot-password", forgotPasswordController);

//TEST || GET
router.get("/test", requireSignIn, isAdmin, testController);

//protected route auth user
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected route auth admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

export default router;
