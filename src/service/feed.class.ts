import { Db } from '../config/db.config';
import { Utill } from '../utill/utill';
import { message } from '../utill/mesage.utill';
import { jWT } from '../utill/jwt.utill';
let ObjectID = require('mongodb').ObjectID

export class Feed {
    private createdBy:String;
    private type:String;
    private createdAt:Date;
    private updatedAt:Date;
    private likeCount: Number;
    private commentCount: Number;
    private description: String;
    private title: String;
    private isDeleted:Boolean;
    private media:Array<object> = [{ fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        destination: String,
        filename: String,
        path: String,
        size: Number }]

    constructor(
        description:String,
        title:String,
        createdBy: string,
        type: string,
        media:Array<object>
    ) {
        this.createdBy =createdBy;
        this.type = type;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.description = description;
        this.title = title;
        this.likeCount =0;
        this.commentCount=0;
        this.media = media;
        this.isDeleted=false;
    }
  
    static async saveFeed(feed: Feed) {
      try {
        const feedColl = await Db.getFeedCollObj();
        const savedFeed = await feedColl.insertOne(feed);
        if (savedFeed.ops.length) {
          return await Feed.__responseBuilder(savedFeed.ops[0]);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }
  
    private static async __responseBuilder(response: any) {
      return {
        createdBy: response.createdBy,
        type: response.type,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        likeCount:response.likeCount,
        commentCount:response.commentCount,
        description:response.description,
        title:response.title,
        media:response.media,
        id:response._id
      };
    }

    static async getFeedByQuery(query: Object) {
      const feedColl = await Db.getFeedCollObj();
      const getFeedRes = await feedColl
        .aggregate([{   
              $match:query
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: 'user_id',
                    as: 'createdBy'
                }
            },
            {
                $unwind:'$createdBy'
            },
            {
              $sort:{createdAt:-1}
            },
            {
                $project:{ _id:1, type: 1 ,createdAt: 1, updatedAt: 1, media:1,
                    createdBy:{
                      user_name:1,
                      user_id:1,
                      user_email:1,
                    } }
            }
        ]).toArray();
      return getFeedRes;
    }
  
    static async getFeedDetails(feedId: string) {
      const feedColl = await Db.getFeedCollObj();
      const getFeedRes = await feedColl
        .find({ _id: ObjectID(feedId) })
        .project({ _id:1, createdBy: 1, type: 1 ,createdAt: 1, updatedAt: 1, media:1 }).toArray();
      return getFeedRes;
    }

    static async incrementLikeCount(feedId: string) {
      const feedColl = await Db.getFeedCollObj();
      const getFeedRes = await feedColl
      .updateOne(
        { _id:ObjectID(feedId) },
        { $inc: { likeCount: 1} },
     )
     return getFeedRes
    }

    static async decrementLikeCount(feedId: string) {
      const feedColl = await Db.getFeedCollObj();
      const getFeedRes = await feedColl
      .updateOne(
        { _id:ObjectID(feedId) },
        { $inc: { likeCount: -1} },
     )
     return getFeedRes
    }

    static async incrementCommentCount(feedId: string) {
      const feedColl = await Db.getFeedCollObj();
      const getFeedRes = await feedColl
      .updateOne(
        { _id:ObjectID(feedId) },
        { $inc: { commentCount: 1} },
     )
     return getFeedRes
    }

    static async decrementCommentCount(feedId: string) {
      const feedColl = await Db.getFeedCollObj();
      const getFeedRes = await feedColl
      .updateOne(
        { _id:ObjectID(feedId) },
        { $inc: { commentCount: -1} },
     )
     return getFeedRes
    }
  }