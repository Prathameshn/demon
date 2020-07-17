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
    if (this.otpCollObj == null) {
      try {
        const conn = await Db.getConnObj();
        this.otpCollObj = await conn
          .db(process.env.TEST_DB)
          .collection('feed');
      } catch (err) {
        console.log(err);
      }
    }
    return this.otpCollObj;
  }
}
