'use strict'
async function downloadFile({url, filename}){
    //const blob = new Blob([url], { type: "octet/stream"})
    const blob = await fetch(url).then(res => res.blob())
    const href = URL.createObjectURL(blob) || webkitURL.createObjectURL(blob)
    // const a = Object.assign(document.createElement("a"), {
    //   href,
    //   download: filename
    // })
    // a.dispatchEvent(new MouseEvent("click", {
    //   bubbles: true,
    //   cancelable: true,
    //   view: window
    // }))
    const a = document.createElement("a")
    a.href = href
    a.download = filename
    a.click()
    URL.revokeObjectURL(href)
    a.remove()
}

export default downloadFile;