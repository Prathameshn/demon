import { Request, Response ,NextFunction } from 'express';
import { Feed } from '../service/feed.class';
import { validationResult, statusCode } from '../utill/utill';
import { AppResponse } from "../utill/response.utill";
import { message } from '../utill/mesage.utill';

export class FeedController {
  static async saveFeed(req: Request, res: Response) {

    const errors = await validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(statusCode.Error).send(await AppResponse.validationErr(errors.array()));
    }
    console.log(req.body)
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

  static async getFeedDetails(req: Request, res: Response) {
    const {id} = req.params
    try {
      const feedDetails = await Feed.getFeedDetails(id);
      return res.send(feedDetails);
    } catch (error) {
      return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
    }
  }
}
