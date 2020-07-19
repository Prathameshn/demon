import { Request, Response ,NextFunction } from 'express';
import { Feed } from '../service/feed.class';
import { validationResult, statusCode } from '../utill/utill';
import { AppResponse } from "../utill/response.utill";
import { message } from '../utill/mesage.utill';
import { FeedLikeController } from '../controller/feed.like.controller'
import { FeedSaveController } from './feed.save.controller';
let ObjectID = require('mongodb').ObjectID

export class FeedController {
  static async saveFeed(req: Request, res: Response) {

    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(statusCode.Error).send(await AppResponse.validationErr(errors.array()));
    }
    let {
      createdBy,
      type,
      description,
      title,
      media,
      mode,
      productName,
      productDescription,
      businessName,
      contactNumber,
      address
    } =  req.body

    const feed = new Feed(description,title,createdBy,type,mode,media,productName,productDescription,businessName,contactNumber,address);

    try {
      const newFeed = await Feed.saveFeed(feed);
      return res.status(statusCode.document_created).send(await AppResponse.sendData(message.feed.create,newFeed));
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async setMedia(req: Request, res: Response,next:NextFunction) {
    try {
        req.body.media = req.files.map((ele: any)=>{
            ele.path = '/Feed/'+ele.filename;
            return ele
        })
        req.body.media = req.files
        next()
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async getMyPost(req: Request, res: Response) {
    const {user_id} = req.body
    try {
      const feedDetails = await Feed.getFeedByQuery({createdBy:user_id,type:'POST'});
      for(let i=0;i>=0;i++){
        if(feedDetails[i]){
          feedDetails[i].isLiked = await FeedLikeController.getLikeStatus(user_id,feedDetails[i]._id)
          feedDetails[i].isSave = await FeedSaveController.getFeedSaveStatus(user_id,feedDetails[i]._id)
        }else{
          return res.send(feedDetails);
        }
      }
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async getMyInnovation(req: Request, res: Response) {
    const {user_id} = req.body
    try {
      const feedDetails = await Feed.getFeedByQuery({createdBy:user_id,type:'INNOVATION'});
      for(let i=0;i>=0;i++){
        if(feedDetails[i]){
          feedDetails[i].isLiked = await FeedLikeController.getLikeStatus(user_id,feedDetails[i]._id)
          feedDetails[i].isSave = await FeedSaveController.getFeedSaveStatus(user_id,feedDetails[i]._id)
        }else{
          return res.send(feedDetails);
        }
      }
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async getAllPost(req: Request, res: Response) {
    const {user_id} = req.body
    try {
      const feedDetails = await Feed.getFeedByQuery({type:'POST'});
      for(let i=0;i>=0;i++){
        if(feedDetails[i]){
          feedDetails[i].isLiked = await FeedLikeController.getLikeStatus(user_id,feedDetails[i]._id)
          feedDetails[i].isSave = await FeedSaveController.getFeedSaveStatus(user_id,feedDetails[i]._id)
        }else{
          return res.send(feedDetails);
        }
      }
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async getAllInnovation(req: Request, res: Response) {
    const { user_id } = req.body
    try {
      let feedDetails = await Feed.getFeedByQuery({type:'INNOVATION'});
      for(let i=0;i>=0;i++){
        if(feedDetails[i]){
          feedDetails[i].isLiked = await FeedLikeController.getLikeStatus(user_id,feedDetails[i]._id)
          feedDetails[i].isSave = await FeedSaveController.getFeedSaveStatus(user_id,feedDetails[i]._id)
        }else{
          return res.send(feedDetails);
        }
      }
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async getFeedDetails(req: Request, res: Response,next:NextFunction) {
    const {id} = req.params
    try {
      const feedDetails = await Feed.getFeedDetails(id);
      if(feedDetails.length==1){
          req.body.feedDetails = feedDetails[0]
          next()
      }else{
        return res.status(statusCode.Error).send(await AppResponse.sendError("Feed not found"));
      }
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async getFeedById(req: Request, res: Response,next:NextFunction) {
    const {id} = req.params
    const { user_id } = req.body
    try {
      const feedDetails = await Feed.getFeedDetails(id);
      if(feedDetails.length==1){
        feedDetails[0].isLiked = await FeedLikeController.getLikeStatus(user_id,id)
        feedDetails[0].isSave = await FeedSaveController.getFeedSaveStatus(user_id,id)
        return res.send(feedDetails[0]);
      }else{
        return res.status(statusCode.Error).send(await AppResponse.sendError("Feed not found"));
      }
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async incrementLikeCount(req: Request, res: Response) {
    let { alreadyLike, alreadyUnLike } = req.body
    const {id} = req.params
    try {
      let _mesage = message.feed.like
      if(!alreadyLike){
        const feedDetails = await Feed.incrementLikeCount(id);
      }
      if(!alreadyUnLike){
        const feedDetails = await Feed.decrementLikeCount(id);
        _mesage = message.feed.unlike
      }
      return res.send(_mesage);
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async incrementCommentCount(req: Request, res: Response) {
    const {id} = req.params
    const { newComment } =req.body
    try {
      const feedDetails = await Feed.incrementCommentCount(id);
      return res.send(newComment);
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

}
