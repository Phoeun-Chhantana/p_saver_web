
/**
 * @param { number } resultCount Array size
 * @param { object } media 
 */

export default class MediaInfo{
    constructor({resultCount = 0, media}){
        this.resultCount = resultCount;
        this.media = media;
    }
}