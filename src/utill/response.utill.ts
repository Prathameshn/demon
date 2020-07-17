export class AppResponse {
    static async sendData(msg: String, data: any) {
        return {
            "status": 1,
            "message": "Success",
            "response": {
                message : msg,
                data: data
            }
        }
    }

    static async sendErrorData(data: any) {
        return {
            "status": -1,
            "data": [data]
        }
    }

    static async sendSuccMsg(msg: string) {
        return {
            "status": 1,
            "msg": msg
        }
    }

    static async sendError(err: any) {
        return {
            "status": 1,
            "message": "Fail",
            "response": {
                status : -1,
                error : err
            }
        }
    }

    static async validationErr(err: any) {
        return {
            "status": -1,
            "data": err
        }
    }
}
