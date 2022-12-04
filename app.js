const inputUrl = document.querySelector("#input-url");
const mediaContainer = document.createElement("div");
const imgElement = document.createElement("img");
const vidElement = document.createElement("video");
const section = document.querySelector(".main-section");
const message = document.createElement("p");
const regExp = RegExp("(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.][a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?\w+");
const linkElement = document.createElement("a");
const itemVideoContainer = document.createElement("div");
//const cors = "https://cors-anywhere.herokuapp.com/";
//const cors = "https://api.allorigins.win/get?url=";
//const cors = "https://proxy.cors.sh/";
//const cors = "https://corsproxy.io/?";
const btnView = document.querySelector("#btn-view");
const btnClear = document.querySelector("#btn-clear");
const loaderIndicator = document.querySelector("#loader-indicator");
const iconLink = document.querySelector("#icon-link");
const btnOptionContainer = document.createElement("div");
const btnCopy = document.createElement("button");
const btnDownload = document.createElement("btn-download");

btnCopy.onclick = async () => {
   // Copy the text
  const url = btnCopy.getAttribute("data");
  await navigator.clipboard.writeText(url);
}

btnDownload.onclick = () => {
  const url = btnCopy.getAttribute("data");
  downloadFile(url, `${Date.now()}.mp4`);
}

btnView.addEventListener("click", async () => {
  try{
    const checkUrl = inputUrl.value.toLowerCase();
    if(inputUrl.value === "") return;
    if(section.children[2] !== undefined){
      // while(imgContainer.firstChild){
      //   imgContainer.removeChild(imgContainer.lastChild);
      // }
      if(section.children[2].constructor === HTMLParagraphElement){
        section.removeChild(message);
      }
      else section.removeChild(mediaContainer);
    }
    if(checkUrl.includes("facebook")){
      showLoading();
      const data = await new FacebookSource(inputUrl.value).fetchData();
      hideLoading();
      if(data === undefined) return;
      if(data.res.status == 200){
        loadImageView(data.media.media);
      }else{
        message.innerText = data.res.message;
        section.appendChild(message);
      }
    }else if(checkUrl.includes("ngl")){
      showLoading();
      const data = await new NGLSource(inputUrl.value).fetchData();
      hideLoading();
      if(data === undefined) return;
      if(data.res.status != 200){
        message.innerText = data.res.message;
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
      if(source.res.status != 200){
        message.innerText = source.res.message;
        section.appendChild(message);
        return;
      }
      loadMediaView(source.media);
    }
    else{
      message.innerText = "Not support yet :)";
      section.appendChild(message);
    }
  }catch(e){
    console.error(e);
    message.innerText = `${e.message}`;
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
  mediaContainer.className = "media-container";
  imgElement.src = url;
  imgElement.className = "media-item";
  imgElement.alt = "image"
  imgElement.loading = "lazy";
  imgElement.style.gridColumn = "2 / 3";
  mediaContainer.appendChild(imgElement);
  section.appendChild(mediaContainer);
}

async function loadMediaView(mediaData){
  mediaContainer.className = "media-container";
  let temp = [];
    if(mediaData.media.video !== undefined){
      if(typeof mediaData.media.video === "string" && typeof mediaData.media.thumbnail === "string"){
        linkElement.target = "_blank";
        linkElement.href = `${mediaData.media.video}`;
        linkElement.innerText = "View Video";
        linkElement.download = "";
        //downloadFile(mediaData.media.video, "video123.mp4")

        imgElement.className = "media-item";
        imgElement.loading = "lazy";
        imgElement.src = `data:image/jpeg;base64, ${mediaData.media.thumbnail}`;
        //imgElement.src = `${mediaData.media.thumbnail}`;
        itemVideoContainer.className = "item-video-container";
        if(window.innerWidth > 768){
          itemVideoContainer.style.gridColumn = "2 / 3";
        }else{
          itemVideoContainer.style.gridColumn = "0";
        }

        btnCopy.setAttribute("data", linkElement.href);
        btnDownload.setAttribute("data", linkElement.href);
        buildBtnOption();
        
        itemVideoContainer.appendChild(imgElement);
        itemVideoContainer.appendChild(linkElement);
        itemVideoContainer.appendChild(btnOptionContainer);
        mediaContainer.appendChild(itemVideoContainer);
        section.appendChild(mediaContainer);
        delete linkElement;
        delete imgElement;
        return;
      }
      // for(let item of mediaData.media.videos){
      //   const vidItem = document.createElement("video");
      //   const sourceElement = document.createElement("source");
      //   sourceElement.type = "video/mp4";
      //   sourceElement.src = `data:video/mp4;base64, ${item}`;
      //   vidItem.className = "media-item";
      //   vidItem.controls = true;
      //   vidItem.appendChild(sourceElement);
      //   temp.push(vidItem);
      // }
    }
    if(mediaData.media.image_url !== undefined){
      if(typeof mediaData.media.image_url === "string"){
        imgElement.src = `data:image/jpeg;base64, ${mediaData.media.image_url}`;
        //imgElement.src = `${mediaData.media.image_url}`;
        imgElement.className = "media-item";
        imgElement.alt = "image"
        imgElement.loading = "lazy";
        if(window.innerWidth > 768){
          imgElement.style.gridColumn = "2 / 3";
        }else{
          imgElement.style.gridColumn = "0";
        }
        mediaContainer.appendChild(imgElement);
        section.appendChild(mediaContainer);
        delete imgElement
        return;
      }
      // for(let item of mediaData.media.images){
      //   const imgItem = document.createElement("img");
      //   imgItem.src = `data:image/jpeg;base64, ${item}`;
      //   imgItem.className = "media-item";
      //   imgItem.alt = "image"
      //   imgItem.loading = "lazy";
      //   temp.push(imgItem);
      // }
    }

    if(mediaData.media.videos !== undefined){
      for(let item of mediaData.media.videos){
        // const vidItem = document.createElement("video");
        // const sourceElement = document.createElement("source");
        // sourceElement.type = "video/mp4";
        // sourceElement.src = `data:video/mp4;base64, ${item.video}`;
        // vidItem.className = "media-item";
        // vidItem.controls = true;
        // vidItem.appendChild(sourceElement);
        // temp.push(vidItem);
        const itemVideoContainerItem = document.createElement("div");
        const linkItem = document.createElement("a");
        const imgItem = document.createElement("img");
        linkItem.target = "_blank";
        linkItem.href = `${item.video}`;
        linkItem.innerText = "View Video";
        linkItem.download = "Download Video"

        imgItem.className = "media-item";
        imgItem.loading = "lazy";
        imgItem.src = `data:image/jpeg;base64, ${item.thumbnail}`;
        //imgItem.src = `${item.thumbnail}`;
        itemVideoContainerItem.className = "item-video-container";

        btnCopy.setAttribute("data", linkItem.href);
        btnDownload.setAttribute("data", linkItem.href);
        buildBtnOption();
        
        itemVideoContainerItem.appendChild(imgItem);
        itemVideoContainerItem.appendChild(linkItem);
        itemVideoContainerItem.appendChild(btnOptionContainer)
        temp.push(itemVideoContainerItem);
        delete linkItem
        delete imgItem
      }
    }
    if(mediaData.media.images !== undefined){
      for(let item of mediaData.media.images){
        const imgItem = document.createElement("img");
        imgItem.src = `data:image/jpeg;base64, ${item.image_url}`;
        //imgItem.src = `${item.image_url}`;
        imgItem.className = "media-item";
        imgItem.alt = "image"
        imgItem.loading = "lazy";
        temp.push(imgItem);
        delete imgElement
      }
    }
    mediaContainer.replaceChildren(...temp);
    section.appendChild(mediaContainer);
}

function showLoading(){
  btnView.disabled = true;
  loaderIndicator.style.display = "block";
}

function hideLoading(){
  btnView.disabled = false;
  loaderIndicator.style.display = "none";
}

function buildBtnOption(){
  btnCopy.innerHTML = `<i class="fa fa-clipboard" aria-hidden="true"></i>`;
  btnCopy.className = "btn-copy";

  btnDownload.innerHTML = `<i id="icon-download" class="fa fa-arrow-circle-down" aria-hidden="true"></i>`;
  btnDownload.className = "btn-download";

  btnOptionContainer.className = "btn-option-container";
  btnOptionContainer.appendChild(btnCopy);
  btnOptionContainer.appendChild(btnDownload);
  delete btnCopy;
  delete btnDownload;
}

function downloadFile(data, filename){
  const blob = new Blob([data], { type: "octet-stream"})
  const href = URL.createObjectURL(blob)
  const a = Object.assign(document.createElement("a"), {
    href,
    download: filename
  })
  a.click()
  URL.revokeObjectURL(href)
  a.remove()
  delete a
}