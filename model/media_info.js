
/**
 * @param { int } resultCount Array size
 * @param { Object } media 
 */

export default class MediaInfo{
    constructor({resultCount = 0, media}){
        this.resultCount = resultCount;
        this.media = media;
    }
}