import { Request, Response ,NextFunction } from 'express';
import { FeedSave } from '../service/feed.save.class';
import { validationResult, statusCode } from '../utill/utill';
import { AppResponse } from "../utill/response.utill";
import { message } from '../utill/mesage.utill';
let ObjectID = require('mongodb').ObjectID

export class FeedSaveController {
  static async createOrUpdatSaveObj(req: Request, res: Response,next:NextFunction) {
        const errors = await validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(statusCode.Error).send(await AppResponse.validationErr(errors.array()));
        }
        const {user_id ,feedDetails} = req.body
        const { type } = feedDetails;
        const { id } = req.params
        let saveObj =await FeedSave.getFeedSaveByQuery({user:user_id,feed:ObjectID(id)})
        if(saveObj.length==1){
            let query ={
                _id:saveObj[0]._id
            }
            let updatedvalue = {
                status:!saveObj[0].status
            }
            saveObj[0].status = !saveObj[0].status
            let updatedResult = await FeedSave.updateFeedSaveObj(query,updatedvalue)
            if(saveObj[0].status){
                return res.status(statusCode.document_created).send(await AppResponse.sendData(message.feed.saved,saveObj));
            }else{
                return res.status(statusCode.document_created).send(await AppResponse.sendData(message.feed.remove_from_save,saveObj));
            }
        }else{
            const user = user_id;
            const feed = id;
            const status = true  
            const feedSave = new FeedSave(feed,user,status,type);
            try {
                const newFeedSave = await FeedSave.saveFeedSave(feedSave);
                return res.status(statusCode.document_created).send(await AppResponse.sendData(message.feed.saved,newFeedSave));
            } catch (error) {
                return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
            }   
        }
    }

    static async getAllFeedSavesByUserId(req: Request, res: Response) {
        const { id } = req.params
        try {
          const feedSaves = await FeedSave.feedSaveByUserId(id);
          return res.send(feedSaves);
        } catch (error) {
          return res.status(statusCode.Error).send(await AppResponse.sendError(error.message));
        }
    }

    static async getFeedSaveStatus(user_id:string,id:string) {
        try {
            let likeObj =await FeedSave.getFeedSaveByQuery({user:user_id,feed:ObjectID(id),status:true})
            if(likeObj.length==1){
                return true
            }else{
                return false
            }
        } catch (error) {
            throw error
        }
    }

}
