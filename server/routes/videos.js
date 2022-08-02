import express from "express"
import {
    addVideo,
    addView,
    deleteVideo,
    getByTag,
    getVideo,
    random, search,
    sub,
    trend,
    updateVideo
} from "../controllers/video.js";
import {verifyToken} from "../verifyToken.js";

const router = express.Router()

// create a video
router.post('/', verifyToken, addVideo)

// update a video
router.put('/:id', verifyToken, updateVideo)

// delete a video
router.delete('/:id', verifyToken, deleteVideo)

// get a video
router.get('/find/:id', getVideo)

// add views
router.put('/view/:id', addView)

// get trend video
router.get('/trend', trend)

// get random video
router.get('/random', random)

// get subscribed channel
router.get('/sub', verifyToken, sub)

// get video by tag
router.get('/tags', getByTag)

// get video by title
router.get('/search', search)

export default router