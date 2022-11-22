const inputUrl = document.querySelector("#input-url");
const mediaContainer = document.createElement("div");
const imgElement = document.createElement("img");
const vidElement = document.createElement("video");
const section = document.querySelector(".main-section");
const message = document.createElement("p");
const regExp = RegExp("(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.][a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?\w+");
//const cors = "https://cors-anywhere.herokuapp.com/";
//const cors = "https://api.allorigins.win/get?url=";
//const cors = "https://proxy.cors.sh/";
//const cors = "https://corsproxy.io/?";
const btnView = document.querySelector("#btn-view");
const btnClear = document.querySelector("#btn-clear");
const loading = document.querySelector("#loading");
const iconLink = document.querySelector("#icon-link");

btnView.addEventListener("click", async () => {
  try{
    if(section.children[2] !== undefined){
      // while(imgContainer.firstChild){
      //   imgContainer.removeChild(imgContainer.lastChild);
      // }
      section.removeChild(mediaContainer);
    }
    const checkUrl = inputUrl.value.toLowerCase();
    if(inputUrl.value === "") return;
    if(checkUrl.includes("facebook")){
      showLoading();
      const data = await new FacebookSource(inputUrl.value).fetchData();
      hideLoading();
      if(data === undefined) return;
      if(data.res.status == 200){
        loadImageView(data.media.media);
      }else{
        message.textContent = data.res.message;
        section.appendChild(message);
      }
    }else if(checkUrl.includes("ngl")){
      showLoading();
      const data = await new NGLSource(inputUrl.value).fetchData();
      hideLoading();
      if(data === undefined) return;
      if(data.res.status != 200){
        message.textContent = data.res.message;
        section.appendChild(message);
      }
      else loadImageView(data.media.media);
    }else if(checkUrl.includes("instagram")){
      showLoading();
      const source = await new InstagramSource(inputUrl.value).fetchData();
      hideLoading();
      if(source === undefined){
        return;
      }
      // if(!source.includes("http")){
      //   message.textContent = source;
      //   section.appendChild(message);
      //   return;
      // }
      
      if(source.res.status != 200){
        message.textContent = source.res.message;
        section.appendChild(message);
        return;
      }
      loadMediaViewByBase64(source.media);
    }
    else if(checkUrl.includes("tiktok")){
      showLoading();
      const source = await new TiktokSource(inputUrl.value).fetchData();
      hideLoading();
    }
    else{
      message.textContent = "Not support yet :)";
      section.appendChild(message);
    }
  }catch(e){
    console.error(e);
    message.textContent = `${e.message}`;
    section.appendChild(message);
    hideLoading();
  }
})

btnClear.addEventListener("click", () => {
  inputUrl.value = "";
  btnClear.style.visibility = "hidden";
  if(iconLink.className === "fa fa-link") return;
  iconLink.className = "fa fa-link";
})

inputUrl.oninput = function(e){
  if(this.value == ""){
    btnClear.style.visibility = "hidden";
    iconLink.className = "fa fa-link";
    return;
  }
  btnClear.style.visibility = "visible";
  //
  const checkUrl = inputUrl.value.toLowerCase();
  if(checkUrl.includes("facebook")){
    iconLink.className = "fa fa-facebook";
  }else if(checkUrl.includes("instagram")){
    iconLink.className = "fa fa-instagram";
  }else{
    if(iconLink.className === "fa fa-link"){
      return;
    }
    iconLink.className = "fa fa-link";
  }
}

inputUrl.onfocusout = function(e){
  if(this.value == ""){
    btnClear.style.visibility = "hidden";
  }
}

inputUrl.onfocus = function(e){
  if(this.value != ""){
    btnClear.style.visibility = "visible";
  }
}

function loadImageView(url){
  mediaContainer.className = "image-container";
  imgElement.src = url;
  imgElement.className = "image-view";
  imgElement.alt = "image"
  imgElement.loading = "lazy";
  mediaContainer.appendChild(imgElement);
  section.appendChild(mediaContainer);
}

function loadMediaViewByBase64(mediaData){
  mediaContainer.className = "media-container";
  let temp = [];
    if(mediaData.media.videos !== undefined){
      if(typeof mediaData.media.videos === "string"){
        console.log(mediaData.media.videos);
        const sourceElement = document.createElement("source");
        sourceElement.type = "video/mp4";
        sourceElement.src = `data:video/mp4;base64, ${mediaData.media.videos}`;
        vidElement.className = "media-item";
        vidElement.controls = true;
        vidElement.appendChild(sourceElement);
        mediaContainer.appendChild(vidElement);
        section.appendChild(mediaContainer);
        return;
      }
      for(let item of mediaData.media.videos){
        const vidItem = document.createElement("video");
        const sourceElement = document.createElement("source");
        sourceElement.type = "video/mp4";
        sourceElement.src = `data:video/mp4;base64, ${item}`;
        vidItem.className = "media-item";
        vidItem.controls = true;
        vidItem.appendChild(sourceElement);
        temp.push(vidItem);
      }
    }
    if(mediaData.media.images !== undefined){
      if(typeof mediaData.media.images === "string"){
        imgElement.src = `data:image/jpeg;base64, ${mediaData.media.images}`;
        imgElement.className = "media-item";
        imgElement.alt = "image"
        imgElement.loading = "lazy";
        mediaContainer.appendChild(imgElement);
        section.appendChild(mediaContainer);
        return;
      }
      for(let item of mediaData.media.images){
        const imgItem = document.createElement("img");
        imgItem.src = `data:image/jpeg;base64, ${item}`;
        imgItem.className = "media-item";
        imgItem.alt = "image"
        imgItem.loading = "lazy";
        temp.push(imgItem);
      }
    }
    mediaContainer.replaceChildren(...temp);
    section.appendChild(mediaContainer);
}

function showLoading(){
  btnView.disabled = true;
  btnView.style.filter = "grayscale()";
  //section.insertAdjacentElement("afterend", loading);
  loading.style.display = "block";
}

function hideLoading(){
  btnView.disabled = false;
  btnView.style.filter = "none";
  loading.style.display = "none";
  //section.removeChild(loading);
}