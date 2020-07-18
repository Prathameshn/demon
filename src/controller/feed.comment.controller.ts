import { Request, Response ,NextFunction } from 'express';
import { FeedComment } from '../service/feed.comment.class';
import { validationResult, statusCode } from '../utill/utill';
import { AppResponse } from "../utill/response.utill";

export class FeedCommentController {
  static async createComment(req: Request, res: Response,next:NextFunction) {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(statusCode.Error).send(await AppResponse.validationErr(errors.array()));
        }
        const {user_id , comment } = req.body
        const { id } = req.params
        const user = user_id;
        const feed = id;
        const feedComment = new FeedComment(feed,user,comment);
        try {
            const newFeedComment = await FeedComment.saveFeedComment(feedComment);
            req.body.newComment = newFeedComment
            return next()
        } catch (error) {
            return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
        }   
    }

    static async getAllComments(req: Request, res: Response) {
        const { id } = req.params
        try {
          const feedComments = await FeedComment.getAllCommentsByFeedId(id);
          return res.send(feedComments);
        } catch (error) {
          return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
        }
    }
}


