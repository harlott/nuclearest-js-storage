import isEmpty from 'lodash/isEmpty'
import STORAGE_TYPES from './storageTypes'

const initStorage = (storageType, storagesMap, context, internalContext, canUseStorage, customFallbackStorage) => {
    let rsStorage
    if (canUseStorage === false){
        if (customFallbackStorage === undefined && storagesMap !== undefined){
            rsStorage = storagesMap[storageType]
        }
    } else {
        if (context !== undefined && !isEmpty(context) && context !== internalContext && context !== null){
            rsStorage = context === STORAGE_TYPES.COOKIE ? Object.assign(context) : Object.assign(context[storageType])
        }
    }
    return rsStorage
}

export default initStorage
