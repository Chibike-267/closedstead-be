import express, { Request, Response } from "express";
import authenticateMiddleware from "../../library/middlewares/auth";
import { upload } from "../../library/helpers/uploadImage";
import {
  createUnits,
  filterUnits,
  getAllAvailableUnits,
  getAllUnavailableUnits,
  getSingleUnit,
  searchUnits,
  unitsBeloningToUser,
  updateUnits,
} from "./unitsController";

const router = express.Router();

router.get("/users", (req: Request, res: Response) => {
  res.status(200).json({ message: "success" });
});
router.post(
  "/create-unit",
  authenticateMiddleware,
  upload.array("pictures", 4),
  createUnits
);
router.put("/update-unit/:id", authenticateMiddleware, updateUnits);
router.get("/my-units", authenticateMiddleware, unitsBeloningToUser);
router.get("/filter-units", filterUnits);
router.get("/search-units", searchUnits);
router.get("/unit/:id", authenticateMiddleware, getSingleUnit);
router.get("/available-units", authenticateMiddleware, getAllAvailableUnits);
router.get(
  "/unavailable-units",
  authenticateMiddleware,
  getAllUnavailableUnits
);

export default router;
