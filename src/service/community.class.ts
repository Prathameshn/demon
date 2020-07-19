import { Db } from '../config/db.config';
let ObjectID = require('mongodb').ObjectID

export class ConditionRequest {
    private user:String;
    private community:Array<object> =[{ user: ObjectID,
        createdAt:Date}];
    private createdAt:Date;
    private updatedAt:Date;

    constructor(
        user:String,
        community:String
    ) {
        this.user =user;
        this.community = this.community
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
  
    static async saveConditionRequest(conditionRequest: ConditionRequest) {
      try {
        const conditionRequestColl = await Db.getConditionRequestCollObj();
        const saveConditionRequest= await conditionRequestColl.insertOne(conditionRequest);
        if (saveConditionRequest.ops.length) {
          return await ConditionRequest.__responseBuilder(saveConditionRequest.ops[0]);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    }
  
    private static async __responseBuilder(response: any) {
      return {
        sender: response.sender,
        receiver: response.receiver,
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