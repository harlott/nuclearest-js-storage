/**
 * Build a custom storage object
 * @param  {string} type          The type of storage; i.e: tvFileSystem
 * @param  {Function} setItem    The function to set value in the storage
 * @param  {Function} getItem    The function to get value in the storage
 * @param  {Function} removeItem The function to remove value in the storage
 * @return {Object}               The custom storage map
 */
const buildCustomStorage = (type, setItem, getItem, removeItem) => {
    let _storage = {}
    _storage[type] = {
        setItem: setItem,
        getItem: getItem,
        removeItem: removeItem
    }
    return _storage
}

export default buildCustomStorage

