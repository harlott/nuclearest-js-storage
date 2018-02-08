import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

const setStorage = (storageType, context, customStoragesMap, storagesType) => {
    let _storage
    try {
        if (context !== undefined || !isEmpty(context)){
            _storage = storageType === storagesType.COOKIE ? context : context[storageType]
        } else {
            _storage = get(customStoragesMap, `${storageType}`)
        }
    } catch (error) {
        throw error
    }
    return _storage
}

export default setStorage