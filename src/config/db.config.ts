export class Db {
  private static mongoClient: any = require('mongodb').MongoClient;
  private static uri: string = "mongodb://localhost:27017";
  // private static uri: string =
  //   'mongodb+srv://' +
  //   process.env.ATLAS_USER_NAME +
  //   ':' +
  //   process.env.ATLAS_PW +
  //   '@cluster0-ysylc.mongodb.net/<dbname>?retryWrites=true&w=majority';
  private static client: any = null;
  private static db: any = null;
  private static connection: any = null;
  private static testCollObj: any = null;
  private static userCollObj: any = null;
  private static utillCollObj: any = null;
  private static otpCollObj: any = null;
  private static feedCollObj: any = null;
  private static feedLikeCollObj: any = null;
  private static feedCommentCollObj: any = null;
  private static feedSaveCollObj: any = null;
  private static connectionRequestCollObj: any = null;
  private static communityCollObj: any =null;
  private static options: object = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  private static async getConnObj() {
    if (this.connection == null) {
      try {
        this.client = await new this.mongoClient(this.uri, this.options);
        this.connection = await this.client.connect();
      } catch (err) {
        console.log(err);
      }
    }
    return this.connection;
  }

  static async getTestCollObj() {
    if (this.testCollObj == null) {
      try {
        const conn = await Db.getConnObj();
        this.testCollObj = await conn
          .db(process.env.TEST_DB)
          .collection(process.env.TEST_COLL);
      } catch (err) {
        console.log(err);
      }
    }
    return this.testCollObj;
  }

  static async getUserCollObj() {
    if (this.userCollObj == null) {
      try {
        const conn = await Db.getConnObj();
        this.userCollObj = await conn
          .db(process.env.TEST_DB)
          .collection('users');
      } catch (err) {
        console.log(err);
      }
    }
    return this.userCollObj;
  }

  //Method for getting Utill collection object
  static async getUtillCollObj() {
    if (this.utillCollObj == null) {
      try {
        const conn = await Db.getConnObj();
        this.utillCollObj = await conn
          .db(process.env.TEST_DB)
          .collection('utill');
      } catch (err) {
        console.log(err);
      }
    }
    return this.utillCollObj;
  }

  //Method for getting OTP collection object
  static async getOtpCollObj() {
    if (this.otpCollObj == null) {
      try {
        const conn = await Db.getConnObj();
        this.otpCollObj = await conn
          .db(process.env.TEST_DB)
          .collection('otp');
      } catch (err) {
        console.log(err);
      }
    }
    return this.otpCollObj;
  }

  //Method for getting Feed collection object
  static async getFeedCollObj() {
    if (this.feedCollObj == null) {
      try {
        const conn = await Db.getConnObj();
        this.feedCollObj = await conn
          .db(process.env.TEST_DB)
          .collection('feeds');
      } catch (err) {
        console.log(err);
      }
    }
    return this.feedCollObj;
  }

  //Method for getting Feed Like collection object
  static async getFeedLikeCollObj() {
    if (this.feedLikeCollObj == null) {
      try {
        const conn = await Db.getConnObj();
        this.feedLikeCollObj = await conn
          .db(process.env.TEST_DB)
          .collection('feedlikes');
      } catch (err) {
        console.log(err);
      }
    }
    return this.feedLikeCollObj;
  }

  //Method for getting Feed Like collection object
  static async getFeedCommentCollObj() {
    if (this.feedCommentCollObj == null) {
      try {
        const conn = await Db.getConnObj();
        this.feedCommentCollObj = await conn
          .db(process.env.TEST_DB)
          .collection('feedcomments');
      } catch (err) {
        console.log(err);
      }
    }
    return this.feedCommentCollObj;
  }

  //Method for getting Feed Like collection object
  static async getFeedSaveCollObj() {
    if (this.feedSaveCollObj == null) {
      try {
        const conn = await Db.getConnObj();
        this.feedSaveCollObj = await conn
          .db(process.env.TEST_DB)
          .collection('feedsaves');
      } catch (err) {
        console.log(err);
      }
    }
    return this.feedSaveCollObj;
  }
  
  //Method for getting connection request collection object
  static async getConditionRequestCollObj() {
    if (this.connectionRequestCollObj == null) {
      try {
        const conn = await Db.getConnObj();
        this.connectionRequestCollObj = await conn
          .db(process.env.TEST_DB)
          .collection('connectionrequests');
      } catch (err) {
        console.log(err);
      }
    }
    return this.connectionRequestCollObj;
  }

  //Method for getting community collection object
  static async getCommunityCollObj() {
    if (this.communityCollObj == null) {
      try {
        const conn = await Db.getConnObj();
        this.communityCollObj = await conn
          .db(process.env.TEST_DB)
          .collection('community');
      } catch (err) {
        console.log(err);
      }
    }
    return this.communityCollObj;
  }
}
