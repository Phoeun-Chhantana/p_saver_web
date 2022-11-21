class BaseResponse{
    constructor(status, message){
        this.status = status;
        this.message = message;
    }
}

class UserInfo{
    constructor(res, media){
        this.res = res;
        this.media = media;
    }
}