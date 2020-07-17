import { router } from '../../server';
import { FeedController } from '../../controller/feed.controller';
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

router
    .route("/:id")
    .get(FeedController.getFeedDetails)

module.exports = router;
