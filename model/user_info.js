class BaseResponse{
    constructor(status, message){
        this.status = status;
        this.message = message;
    }
}

class UserInfo{
    constructor(res, imageUrl){
        this.res = res;
        this.imageUrl = imageUrl;
    }
}