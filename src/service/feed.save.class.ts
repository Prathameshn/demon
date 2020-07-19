import { Db } from '../config/db.config';
import { type } from 'os';
let ObjectID = require('mongodb').ObjectID

export class FeedSave {
    private feed:String;
    private user:String;
    private status: Boolean;
    private type:String;
    private createdAt:Date;
    private updatedAt:Date;

    constructor(
        feed:String,
        user:String,
        status: Boolean,
        type:String
    ) {
        this.feed =ObjectID(feed);
        this.user = user;
        this.status = status;
        this.type = type;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
  
    static async saveFeedSave(feedSave: FeedSave) {
      try {
        const feedSaveColl = await Db.getFeedSaveCollObj();
        const savedFeedSave = await feedSaveColl.insertOne(feedSave);
        if (savedFeedSave.ops.length) {
          return await FeedSave.__responseBuilder(savedFeedSave.ops[0]);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }
  
    private static async __responseBuilder(response: any) {
      return {
        feed: response.feed,
        user: response.user,
        status:response.status,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        id:response._id
      };
    }

    static async getFeedSaveByQuery(query: object) {
      const feedSaveColl = await Db.getFeedSaveCollObj();
      const getFeedSaveRes = await feedSaveColl
        .find(query)
        .project({ _id:1, feed: 1, user: 1 ,status: 1, updatedAt: 1, media:1 })
        .toArray()
      return getFeedSaveRes;
    }

    static async updateFeedSaveObj(query: object,updatedvalue: object) {
      const feedSaveColl = await Db.getFeedSaveCollObj();
      const getFeedSaveRes = await feedSaveColl
      .updateOne(
        query,
        { $set: updatedvalue },
     )
     return getFeedSaveRes
    }

  
    static async feedSaveByUserId(userId: string) {
      const feedSaveColl = await Db.getFeedSaveCollObj();
      const getFeedSaveRes = await feedSaveColl
        .aggregate([{   
            $match:{
                user:userId,
                status:true
            }},
            {
                $lookup: {
                    from: 'feeds',
                    localField: 'feed',
                    foreignField: '_id',
                    as: 'feed'
                }
            },
            {
                $unwind:'$feed'
            },
            {
                $project:{ _id:1, feed: 1 ,createdAt: 1, updatedAt: 1, status:1,
                    user:1}
            }
        ]).toArray();
      return getFeedSaveRes;
    }
  }