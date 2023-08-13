import express  from "express";
import{
    getUser,
    getUserFriends,
    addRemoveFriend,
    deleteUser,
    updateProfile
} from "../controllers/users.js"
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/*Read*/
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends",verifyToken,getUserFriends);

/*UPDATE*/
router.patch("/:id/:friendId",verifyToken,addRemoveFriend);
router.patch("/:id",verifyToken,updateProfile);

/*Delete*/
router.delete("/:id", verifyToken, deleteUser)

export default router;