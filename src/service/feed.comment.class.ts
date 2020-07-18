import { Db } from '../config/db.config';
let ObjectID = require('mongodb').ObjectID

export class FeedComment {
    private feed:String;
    private user:String;
    private isDeleted:Boolean;
    private comment:String;
    private createdAt:Date;
    private updatedAt:Date;

    constructor(
        feed:String,
        user:String,
        comment:string
    ) {
        this.feed =ObjectID(feed);
        this.user = user;
        this.comment = comment;
        this.isDeleted= false;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
  
    static async saveFeedComment(feedComment: FeedComment) {
      try {
        const feedCommentColl = await Db.getFeedCommentCollObj();
        const savedFeedComment = await feedCommentColl.insertOne(feedComment);
        if (savedFeedComment.ops.length) {
          return await FeedComment.__responseBuilder(savedFeedComment.ops[0]);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }
  
    private static async __responseBuilder(response: any) {
      return {
        feed: response.feed,
        user: response.user,
        comment: response.comment,
        isDeleted:response.isDeleted,
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
        id:response._id
      };
    }
  
    static async getAllCommentsByFeedId(feed:string) {
      const feedCommentColl = await Db.getFeedCommentCollObj();
      const getFeedCommentRes = await feedCommentColl
        .aggregate([
            {   
              $match:{
                feed:ObjectID(feed),
                isDeleted:false
              }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: 'user_id',
                    as: 'user'
                }
            },
            {
                $unwind:'$user'
            },
            {
                $project:{ _id:1, feed: 1 ,createdAt: 1, updatedAt: 1, comment:1,
                    user:{
                        user_name:1,
                        user_id:1,
                        user_email:1,
                    }}
            }
        ]).toArray();
      return getFeedCommentRes;
    }
  }