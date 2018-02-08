import setStorage from './setStorage'
import tryToUseStorage from './tryToUseStorage'

/**
 * This method check if storage is disabled and catch the exception.
 * Useful for safari private browsing or browser storage disabled.
 * Check custom storage implementation too.
 *
 * @param  {string} storageType             The type of storage; i.e: STORAGE_TYPES.STORAGE or 'tvFileSystem'
 * @param  {object} context                 The context you are using: window or global
 * @param  {STORAGES_MAP} customStoragesMap The custom storages map
 * @return {boolean}                        return true if storage is enabled or custom storage is correctly implemented
 */



const canUseStorage = (storageType, context, customStoragesMap, storageTypes, storagesMap) => {
    let _storage
    try {
        _storage = setStorage(storageType, context, customStoragesMap, storageTypes)
    } catch (error) {
        if (error instanceof DOMException){
            return false;
        } else {
            throw error
        }
    }
    try {
        tryToUseStorage(storageType, customStoragesMap, storagesMap, _storage)
    } catch(err){
        throw err
    }
    return true
}

export default canUseStorage
