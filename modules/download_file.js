'use strict'
async function downloadFile({url, filename}){
    const blob = new Blob([url], { type: "octet/stream"})
    const href = URL.createObjectURL(blob)
    const a = Object.assign(document.createElement("a"), {
      href,
      download: filename
    })
    a.dispatchEvent(new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    }))
    URL.revokeObjectURL(href)
    a.remove()
    //delete a
}

export default downloadFile;