const CatalogIconPath = (iconUrl: string) => {
    const iconFilename = [...iconUrl].map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('').toUpperCase() + '0A.png';
    return new URL(`/static-assets/${iconFilename}`, import.meta.url).href;
}

export default CatalogIconPath;