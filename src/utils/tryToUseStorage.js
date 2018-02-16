const tryToUseStorage = (storageType, customStoragesMap, storagesMap, storage) => {
    let key = 'test'
    let usedStoragesMap =  customStoragesMap || storagesMap
    usedStoragesMap[storageType].setItem(key, '1', undefined, storage);
    usedStoragesMap[storageType].getItem(key, undefined, storage);
    usedStoragesMap[storageType].removeItem(key, undefined, storage);
}

export default tryToUseStorage
