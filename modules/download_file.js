'use strict'
async function downloadFile({url, filename}){
    //const blob = new Blob([url], { type: "octet/stream"})
    const blob = await fetch(url).then(res => res.blob())
    const href = URL.createObjectURL(blob)
    //const a = Object.assign(document.createElement("a"), {
      //href,
      //download: filename
    //})
    //document.body.append(a)
    //a.dispatchEvent(new MouseEvent("click", {
      //bubbles: true,
      //cancelable: true,
      //view: window
    //}))
    const a = document.createElement("a")
    a.href = href
    a.download = filename
    a.click()
    document.body.appendChild(a)
    //const revoke = window.URL || window.URL.createObjectURL || window.webkitURL
    //revoke.revokeObjectURL(href)
    URL.revokeObjectURL(href)
    a.remove()

    // const a = document.createElement("a")
    // a.href = href
    // a.download = filename
    // a.click()
    // URL.revokeObjectURL(href)
    // a.remove()
}

function objectURL(blob){
  if ( window.webkitURL ) {
    return window.webkitURL.createObjectURL(blob);
 } else if ( window.URL && window.URL.createObjectURL ) {
    return window.URL.display(blob);
 } else {
    return null;
 }
}

export default downloadFile;