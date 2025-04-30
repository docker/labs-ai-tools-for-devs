import { md5 } from "js-md5";

const getCatalogIconPath = async (iconUrl: string) => {
    try {
        var hash = md5.hex(iconUrl);
        const hrefIcon = new URL(import.meta.url + `/../../static-assets/${hash}`).href

        await checkIfImageExists(hrefIcon);
        return hrefIcon
    } catch {
        return iconUrl
    }
}

function checkIfImageExists(url: string) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;

        if (img.complete) {
            resolve(true)
        } else {
            img.onload = () => {
                resolve(true)
            };

            img.onerror = () => {
                reject(false)
            };
        }
    });
}

export default getCatalogIconPath;