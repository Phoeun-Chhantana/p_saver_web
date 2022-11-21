class MediaInfo{
    constructor(){
        if (this.constructor === MediaInfo) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
}

class SingleMediaInfo extends MediaInfo{
    constructor(media){
        super();
        this.media = media;
    }
}

class MultiMediaInfo extends MediaInfo{
    constructor(media){
        super();
        this.media = media;
    }
}

class MediaType{
    constructor(url){
        if (this.constructor === MediaType) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
}

class ImageMedia extends MediaType{
    constructor(url){
        super(url);
    }
}

class VideoMedia extends MediaType{
    constructor(url){
        super(url);
    }
}