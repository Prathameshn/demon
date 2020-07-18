import { Request, Response ,NextFunction } from 'express';
import { FeedLike } from '../service/feed.like.class';
import { validationResult, statusCode } from '../utill/utill';
import { AppResponse } from "../utill/response.utill";
import { message } from '../utill/mesage.utill';
let ObjectID = require('mongodb').ObjectID

export class FeedLikeController {
  static async createOrUpdateLikeObj(req: Request, res: Response,next:NextFunction) {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(statusCode.Error).send(await AppResponse.validationErr(errors.array()));
        }
        const {user_id} = req.body
        const { id } = req.params
        let likeObj =await FeedLike.getFeedLikesByQuery({user:user_id,feed:ObjectID(id)})
        if(likeObj.length==1){
            let query ={
                _id:likeObj[0]._id
            }
            let updatedvalue = {
                status:!likeObj[0].status
            }
            if(!likeObj[0].status){
                req.body.alreadyUnLike = true
                req.body.alreadyLike =false;
            }else{
                req.body.alreadyLike = true
                req.body.alreadyUnLike = false
            }
            let updatedResult = await FeedLike.updateFeedLikeObj(query,updatedvalue)
            return next()
        }else{
            const user = user_id;
            const feed = id;
            const status = true  
            const feedLike = new FeedLike(feed,user,status);
            try {
                const newFeedLike = await FeedLike.saveFeedLike(feedLike);
                req.body.alreadyLike = false
                req.body.alreadyUnLike = true
                return next()
            } catch (error) {
                return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
            }   
        }
    }

    static async getAllfeedLikes(req: Request, res: Response) {
        const { id } = req.params
        try {
          const feedLikes = await FeedLike.feedLikesByFeedId(id);
          return res.send(feedLikes);
        } catch (error) {
          return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
        }
    }

}
