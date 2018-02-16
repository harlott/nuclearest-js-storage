import isEmpty from 'lodash/isEmpty'

const getContextByStorageType = (storageType, storagesType, internalContext) => {
    let _context
    try {
        switch (storageType){
            case storagesType.COOKIE:
                _context = document !== undefined && !isEmpty(document) ? Object.assign(document) : internalContext
                break
            default:
                _context = window !== undefined && !isEmpty(window) ? Object.assign(window) : internalContext
                break
        }
    } catch (err){
        if (!(err instanceof ReferenceError)) {
            throw err
        } else {
            return internalContext
        }
    }
    return _context
}

export default getContextByStorageType
