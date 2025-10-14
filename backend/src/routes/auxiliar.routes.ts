import express from "express";
import { upload } from "../utils/upload";
import * as controller from "../controllers/auxiliar.controller";

const router = express.Router();

router.post("/", upload.single("foto"), controller.criar);
router.get("/", controller.listar);
router.get("/:id", controller.buscar);
router.patch("/:id", upload.single("foto"), controller.atualizar);
router.delete("/:id", controller.eliminar);

export default router;
