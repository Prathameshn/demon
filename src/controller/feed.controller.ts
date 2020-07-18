import { Request, Response ,NextFunction } from 'express';
import { Feed } from '../service/feed.class';
import { validationResult, statusCode } from '../utill/utill';
import { AppResponse } from "../utill/response.utill";
import { message } from '../utill/mesage.utill';
let ObjectID = require('mongodb').ObjectID

export class FeedController {
  static async saveFeed(req: Request, res: Response) {

    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(statusCode.Error).send(await AppResponse.validationErr(errors.array()));
    }
    const createdBy = req.body.createdBy;
    const type = req.body.type;
    const description = req.body.description;
    const title = req.body.title;
    const media = req.body.media

    const feed = new Feed(description,title,createdBy, type,media);

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
      return res.send(feedDetails);
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async getMyInnovation(req: Request, res: Response) {
    const {user_id} = req.body
    try {
      const feedDetails = await Feed.getFeedByQuery({createdBy:user_id,type:'INNOVATION'});
      return res.send(feedDetails);
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async getAllPost(req: Request, res: Response) {
    const {user_id} = req.body
    try {
      const feedDetails = await Feed.getFeedByQuery({type:'POST'});
      return res.send(feedDetails);
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async getAllInnovation(req: Request, res: Response) {
    const {user_id} = req.body
    try {
      const feedDetails = await Feed.getFeedByQuery({type:'INNOVATION'});
      return res.send(feedDetails);
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }

  static async getFeedDetails(req: Request, res: Response,next:NextFunction) {
    const {id} = req.params
    try {
      const feedDetails = await Feed.getFeedDetails(id);
      if(feedDetails.length==1){
          next()
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
