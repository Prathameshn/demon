import { Db } from '../config/db.config';
let ObjectID = require('mongodb').ObjectID

export class FeedLike {
    private feed:String;
    private user:String;
    private status: Boolean;
    private createdAt:Date;
    private updatedAt:Date;

    constructor(
        feed:String,
        user:String,
        status: Boolean
    ) {
        this.feed =ObjectID(feed);
        this.user = user;
        this.status = status;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
  
    static async saveFeedLike(feedLike: FeedLike) {
      try {
        const feedLikeColl = await Db.getFeedLikeCollObj();
        const savedFeedLike = await feedLikeColl.insertOne(feedLike);
        if (savedFeedLike.ops.length) {
          return await FeedLike.__responseBuilder(savedFeedLike.ops[0]);
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

    static async getFeedLikesByQuery(query: object) {
      const feedLikeColl = await Db.getFeedLikeCollObj();
      const getFeedLikeRes = await feedLikeColl
        .find(query)
        .project({ _id:1, feed: 1, user: 1 ,status: 1, updatedAt: 1, media:1 })
        .toArray()
      return getFeedLikeRes;
    }

    static async updateFeedLikeObj(query: object,updatedvalue: object) {
      const feedLikeColl = await Db.getFeedLikeCollObj();
      const getFeedRes = await feedLikeColl
      .updateOne(
        query,
        { $set: updatedvalue },
     )
     return getFeedRes
    }

  
    static async feedLikesByFeedId(feedId: string) {
      const feedLikeColl = await Db.getFeedLikeCollObj();
      const getFeedLikeRes = await feedLikeColl
        .aggregate([{   
            $match:{
                feed:ObjectID(feedId),
                status:true
            }},
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
                $project:{ _id:1, feed: 1 ,createdAt: 1, updatedAt: 1, status:1,
                    user:{
                        user_name:1,
                        user_id:1,
                        user_email:1,
                    }}
            }
        ]).toArray();
      return getFeedLikeRes;
    }
  }