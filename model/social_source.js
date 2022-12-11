import { UserInfo, BaseResponse } from "../model/user_info.js";
import MediaInfo from "../model/media_info.js";

export class SocialSource{
    constructor(url) {
      if(url.includes("instagram")){
        const newUrl = url.split("?")[0];
        //this.url = `http://localhost:3000/get/?url=${newUrl}`;
        this.url = `https://p-save-server.onrender.com/get/?url=${newUrl}`;
      }
      else{
        //this.url = `http://localhost:3000/get/?url=${url}`;
        this.url = `https://p-save-server.onrender.com/get/?url=${url}`;
      }
      if (this.constructor === SocialSource) {
        throw new Error("Abstract classes can't be instantiated.");
      }
    }
  
    async fetchData() {
      throw new Error("Method 'fetchData()' must be implemented.");
    }
  }
  
  export class NGLSource extends SocialSource{
    constructor(url){
       super(url);
    }
    async fetchData(){
      const res = await fetch(`${this.url}`);
      const regExp = RegExp("(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.][a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?\w+");
      if(res.status == 200){
        const htmlContent = await res.text();
        for(let item of htmlContent.split("pfp-container")){
          if(item.includes("pfp") && item.includes(".jpg")){
            if(item.match(regExp)){
              if(item.match(regExp)[0].includes("firebasestorage.googleapis")){
                const urlProfilePic = item.match(regExp)[0].split("\">")[0].replaceAll("amp;", "");
                return new UserInfo({
                  res: new BaseResponse({status: res.status, message: res.statusText}),
                  media: new MediaInfo({
                    media: urlProfilePic.substring(0, urlProfilePic.length - 1)
                  })
                });
              }
            }
          }
        }
      }else{
        return new UserInfo({
          res: new BaseResponse({
            status: res.status,
            message: res.statusText
          })
        });
      }
    }
  }
  
export class FacebookSource extends SocialSource{
    constructor(url){
      super(url);
    }
    async fetchData(){
      const res = await fetch(`${this.url}`);
      const htmlContent = await res.text();
      const responseBody = JSON.parse(htmlContent);
      if(res.status == 200){
        for(let item of responseBody.split("meta")){
          if(item.includes("og:image")){
            // if(item.match(regExp)){
            //   const positon = item.search(regExp);
            //   const urlProfilePic = item.substring(positon).split("\"")[0].replaceAll("amp;", "");
            //   return urlProfilePic;
            // }
            const urlProfilePic = item.substring(30).split("\"")[0].replaceAll("amp;", "");
            return new UserInfo({
              res: new BaseResponse({status: res.status, message: res.statusText}),
              media: new MediaInfo({
                media: urlProfilePic
              })
            });
          }
        }
      }else{
        return new UserInfo({
          res: new BaseResponse({
            status: res.status,
            message: res.statusText
          })
        });
      }
    }
  }

export class InstagramSource extends SocialSource{
    constructor(url){
      super(url);
    }
    async fetchData(){
      const res = await fetch(`${this.url}?__a=1&__d=dis`);
      const responseBody = await res.json();
      const jsonObj = JSON.parse(responseBody);
      if(res.status == 200){
        return new UserInfo({
          res: new BaseResponse({status: res.status, message: res.statusText}),
          media: new MediaInfo({
            media: jsonObj["media_data"]
          })
        })

        // return new UserInfo(new BaseResponse(res.status, res.statusText), 
        //     new MediaInfo(jsonObj["results_number"], jsonObj["url_list"]));

        // if(this.url.includes("instagram/p/")){

        // }
        // const user = jsonObj["graphql"]["user"];
        // const profileUrlHD = user["profile_pic_url_hd"];
        // const res1 = await fetch(`http://localhost:3000/imageUrl/imageUrl?${profileUrlHD}`, options);
        // return await res1.text();

        // for(var item of responseBody.split("meta")){
        //   if(item.includes("og:image")){
        //     const urlProfilePic = item.substring(30).split("\"")[0].replaceAll("amp;", "");
        //     return urlProfilePic;
        //   }
        // }
        
        // METHOD 2
        // let mediaOwnerId = "";
        // for(var item of responseBody.split("props")){
        //   if(item.includes("profile_pic_url")){
        //     const jsonObj = JSON.parse(`{${item.split(",")[1]}}`);
        //     return jsonObj["profile_pic_url"];
        //   }
        //   if(item.includes("media_owner_id")){
        //     for(var item1 of item.split(",")){
        //       if(item1.includes("media_owner_id")){
        //         mediaOwnerId = item1.split(":")[1];
        //         break;
        //       }
        //     }
        //     break;
        //   }
        // }
        //https://www.instagram.com/graphql/query/?query_id=17888483320059182&variables={"id":"USER_ID","first":100,"after":null}
        // const queryUrl = `https://www.instagram.com/graphql/query/?query_id=17888483320059182&variables={"id":${mediaOwnerId},"first":1,"after":null}`;
        // const options1 = {
        //   method: 'GET',
        //   mode: 'cors',
        //   headers: {
        //     'Access-Control-Allow-Origin': '*',
        //     'Access-Control-Allow-Methods': 'GET',
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json'
        //   }
        // }
        // const res1 = await fetch(`http://localhost:3000/url?${queryUrl}`, options1);
        // const responseJsonBody = JSON.parse(await res1.json());
        // if(responseJsonBody["status"] == "fail"){
        //   return responseJsonBody["message"];
        // }else{

        // }

        // METHOD 3
         //https://www.instagram.com/web/search/topsearch/?query={username}

         //METHOD 4
         //https://www.instagram.com/p/{shortcode}/?__a=1&__d=dis
      }
      else{
        return new UserInfo({
          res: new BaseResponse({
            status: res.status,
            message: res.statusText
          })
        });
      }
    }
  }