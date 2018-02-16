import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import STORAGES_MAP from './storagesMap'

/**
 * Build new Storages Map adding custom storages
 * @param  {string} storageType The type of storage; i.e: 'tvFileSystem'
 * @param  {Object} storage     The new storage object
 * @return {Object}             The new storages map
 */
const buildCustomStoragesMap = (storageType, storage) => {
    let _storageMap = cloneDeep(STORAGES_MAP)
    let _storage = cloneDeep(storage)
    merge(_storageMap, _storage)
    return _storageMap
}

export default buildCustomStoragesMap
