import { router } from '../../server';
import { FeedController } from '../../controller/feed.controller';
import { FeedCommentController } from '../../controller/feed.comment.controller';
import { FeedLikeController } from '../../controller/feed.like.controller'
import { FeedSaveController } from '../../controller/feed.save.controller'
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Feed')
    },
    
    filename: function (req: any, file: any, cb: any) {
        console.log(file)
        let filename = file.originalname.replace(/\s+/g, '').trim()
        cb(null, filename)
    }
});

const fileFilter = (req: any,file: any,cb: any) => {
    if(file.mimetype === "image/jpg"  || 
       file.mimetype ==="image/jpeg"  || 
       file.mimetype ===  "image/png"){
     
    cb(null, true);
   }else{
      cb(new Error("Image uploaded is not of type jpg/jpeg or png"),false);
}
}
const upload = multer({storage: storage, fileFilter : fileFilter});

router
    .route("/")
    .post(upload.array('file'),FeedController.setMedia,FeedController.saveFeed)
    .get(FeedController.getMyPost)

router
    .route("/getMyInnovation")
    .get(FeedController.getMyInnovation)

router
    .route("/getAllPost")
    .get(FeedController.getAllPost)

router
    .route("/getAllInnovation")
    .get(FeedController.getAllInnovation)

router
    .route("/:id")
    .get(FeedController.getFeedById)

router
    .route("/:id/getAllComment")
    .get(FeedCommentController.getAllComments)

router
    .route("/:id/getAllLikes")
    .get(FeedLikeController.getAllfeedLikes)

router
    .route("/:id/likeUnlike")
    .post(FeedController.getFeedDetails,FeedLikeController.createOrUpdateLikeObj,FeedController.incrementLikeCount)

router
    .route("/:id/saveUnSave")
    .post(FeedController.getFeedDetails,FeedSaveController.createOrUpdatSaveObj)
    .get(FeedSaveController.getAllFeedSavesByUserId)

router
    .route("/:id/comment")
    .post(FeedController.getFeedDetails,FeedCommentController.createComment,FeedController.incrementCommentCount)


module.exports = router;
