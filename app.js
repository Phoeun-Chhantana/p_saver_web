const inputUrl = document.querySelector("#input-url");
const imgElement = document.createElement("img");
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
      section.removeChild(imgElement);
    }
    const checkUrl = inputUrl.value.toLowerCase();
    if(inputUrl.value === "") return;
    if(checkUrl.includes("facebook")){
      showLoading();
      const source = await new FacebookSource(inputUrl.value).fetchData();
      hideLoading();
      if(source === undefined) return;
      loadImageView(source);
    }else if(checkUrl.includes("ngl")){
      showLoading();
      const source = await new NGLSource(inputUrl.value).fetchData();
      hideLoading();
      if(source === undefined) return;
      loadImageView(source);
    }else if(checkUrl.includes("instagram")){
      showLoading();
      const source = await new InstagramSource(inputUrl.value).fetchData();
      hideLoading();
      if(source === undefined){
        return;
      }
      if(!source.includes("http")){
        message.textContent = source;
        section.appendChild(message);
        return;
      }
      loadImageView(source);
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
  imgElement.src = url;
  imgElement.alt = "image"
  imgElement.loading = "lazy";
  section.appendChild(imgElement);
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

// function makeHttpObject() {
//   try {return new XMLHttpRequest();}
//   catch (error) {}
//   try {return new ActiveXObject("Msxml2.XMLHTTP");}
//   catch (error) {}
//   try {return new ActiveXObject("Microsoft.XMLHTTP");}
//   catch (error) {}

//   throw new Error("Could not create HTTP request object.");
// }

// var request = makeHttpObject();
// request.withCredentials = false;
// request.open("GET", "https://www.google.com", true);
// request.setRequestHeader("Access-Control-Allow-Origin", "*");
// request.send(null);
// request.onreadystatechange = function() {
//   if (request.readyState == 4)
//     console.log(request);
// };

// const http = new XMLHttpRequest();
// http.onreadystatechange = () => {
//   console.log(http);
// }
// http.open("GET", "https://www.instagram.com/graphql/query/?query_id=17888483320059182&variables={“id”:“8556131572”,“first”:1,“after”:null}", true);
// //http.open("GET", "https://dummyjson.com/products/1", "true");
// http.setRequestHeader("Accept", "application/json");
// http.setRequestHeader("Access-Control-Allow-Origin", "*");
// http.setRequestHeader("Access-Control-Allow-Methods", "GET");
// http.send();