/**
 *
 *
 * WebStorage

 This is a simple interface for WebStorage. You can create different instances with different storage/cookie and use always the same methods. You can also create and use your own.

 Features:

 handle storage disabled by Browser settings and Safari private session issue;
 provide fallback strategy for basic storage settings (you can disable it);
 simplify your application code refactoring :)
 Warnings In fallback mode, remember to use it only for simple settings, like 'country' or 'lang'. Don't use it to store user settings or sensible infos.

 Example:

 Use standard browser cookie for authentication data.
 Please look at the fallbackStorage configuration.

 - With grantedProps, you can set the 'white list' for storage items.
 - If the Browser has cookies disabled, your web application doesn't broke.
 - Use callbackOnDisabled() to show a popup, an alert, or do what you think is better for your application
 - In this case, the 'country' item will be setted in the default fallback storage.
 - P.S. the default fallback storage is only a global variable: don't use it to store a lot of data.

 @example
 import Storage, {STORAGE_TYPES} from 'nuclearest-js/WebStorage'

 const cookieStorage = new WebStorage(STORAGE_TYPES.COOKIE, undefined, {enabled: true, 'grantedProps':['country'], callbackOnDisabled: () => {alert('COOKIE DISABLED')}})
 cookieStorage.setItem('country', 'IT')
 cookieStorage.setItem('accessToken', 'aaaa-bbbb-cccc-dddd')

 *
 */

import { cloneDeep, get, includes, isFunction } from 'lodash'
import parseToStringToSet from './utils/parseToStringToSet'
import parseToObjectToGet from './utils/parseToObjectToGet'
import buildCustomStorage from './utils/buildCustomStorage'
import buildCustomStoragesMap from './utils/buildCustomStoragesMap'
import getContextByStorageType from './utils/getContextByStorageType'
import canUseStorage from './utils/canUseStorage'
import initStorage from './utils/initStorage'
import STORAGES_MAP from './utils/storagesMap'
import STORAGE_TYPES from './utils/storageTypes'

let __storage__fallback__ = {}
const _internalContext = 'NODE_CONTEXT'
const _fallbackStorageType = 'fallbackStorage'

const _defaultSetItem = (p, v) => {
    __storage__fallback__[p] = parseToStringToSet(v)
}

const _defaultGetItem = (p) => {
    const value = __storage__fallback__[p]
    return parseToObjectToGet(value)
}

const _defaultRemoveItem = (p) => {
    Reflect.deleteProperty(__storage__fallback__, p);
}

const _defaultFallbackStorage = buildCustomStorage(_fallbackStorageType, _defaultSetItem, _defaultGetItem, _defaultRemoveItem)
const _defaultFallbackStoragesMap = buildCustomStoragesMap(_fallbackStorageType, _defaultFallbackStorage)


/**
 * This is a simple interface for WebStorages.
 * If the selected storage is disabled, WebStorage provides a fallback.
 * @type {Storage}
 */

class WebStorage {
    /**
     * Create a Storage instance
     * @param  {string} storageType           The type of storage; i.e: 'tvFileSystem'
     * @param  {Object} storagesMap           The custom storage map to use
     * @param  {Object} fallbackStorage       The fallback configuration options: i.e {'enabled': true, 'grantedProps':["selectedLanguage"], 'callbackOnDisabled': () => {alert('STORAGE DISABLED')}}.
     *                                        Warning: if 'grantedProps' is undefined, you can't use fallback storage. Don't use authentication or other user props.
     *                                        Fallback storage is intended only for static configurations like 'country', 'lang', 'hasAcceptedCookie'...
     */
    constructor(storageType, storagesMap, fallbackStorage) {
        this.STORAGE_TYPE = storageType
        this.CONTEXT = getContextByStorageType(storageType, STORAGE_TYPES, _internalContext)
        this.STORAGES_MAP = cloneDeep(storagesMap) || cloneDeep(STORAGES_MAP)
        this.CAN_USE_STORAGE = this.CONTEXT !== _internalContext ? canUseStorage(this.STORAGE_TYPE, this.CONTEXT, this.STORAGES_MAP, STORAGE_TYPES, STORAGES_MAP) : false
        this.USE_FALLBACK_STORAGE = false
        this.CUSTOM_FALLBACK_STORAGE = cloneDeep(fallbackStorage)
        this.STORAGE = initStorage(storageType, this.STORAGES_MAP, this.CONTEXT, _internalContext, this.CAN_USE_STORAGE, this.CUSTOM_FALLBACK_STORAGE)
        this.USE_FALLBACK_STORAGE = (this.CAN_USE_STORAGE === false && (get(this.CUSTOM_FALLBACK_STORAGE, 'enabled') === true)) || this.CONTEXT === _internalContext
        let callbackOnDisabled = this.CAN_USE_STORAGE === false && isFunction(get(this.CUSTOM_FALLBACK_STORAGE, 'callbackOnDisabled')) ? get(this.CUSTOM_FALLBACK_STORAGE, 'callbackOnDisabled') : () => {return}
        callbackOnDisabled()
    }
    /**
     * This method return the storagesType to use on instanciating Storage
     * @return {Map} the storagesType map
     */
    static getTypesMap(){
      return STORAGE_TYPES
    }
    /**
     * This method return the default cookieExpiringDate
     * @return {date} default cookieExpiringDate
     */
    getCookieExp() {
        var now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
    }
    /**
    * This method return the storageType selected
    * @return {string} the storageType selected
     */
    getType() {
        return this.STORAGE_TYPE
    }
    /**
     * This method return the storage method selected; i.e: window.cookie
     * @return {Object} the storage method selected
     */
    getMethod() {
        return this.STORAGE
    }

    use(methodName, params){
        let newParams = []
        for (let i=0; i <= params.length; i+=1) {
            newParams.push(params[i])
        }
        if (this.USE_FALLBACK_STORAGE === false){
            newParams.push(Object.assign(this.STORAGE))
            return this.STORAGES_MAP[this.STORAGE_TYPE][methodName].apply(null, newParams)
        } else {
            if (includes(get(this.CUSTOM_FALLBACK_STORAGE, 'grantedProps'), params[0])){
                newParams.push(_defaultFallbackStoragesMap[_fallbackStorageType])
                return _defaultFallbackStoragesMap[_fallbackStorageType][methodName].apply(null, newParams)
            }
        }
    }

    /**
     * This method set the storage item
     * @param {string} propertyName   the item name to set
     * @param {*} propertyValue       the item value
     * @param {date} [cookieExpDate]  the cookie expiring date if you want to use cookie
     */
    setItem(propertyName, propertyValue, cookieExpDate) {
        arguments[2] = cookieExpDate || this.getCookieExp()
        this.use('setItem', arguments)
    }
    /**
     * This method return the item value for item name
     * @param  {string} propertyName  the item name
     * @param  {date} [cookieExpDate] the cookie expiring date if you want to use cookie
     * @return {*}                    the item value
     */

    getItem(propertyName, cookieExpDate) {
      arguments[1] = cookieExpDate || this.getCookieExp()
      return this.use('getItem', arguments)
    }

    /**
     * This method delete the item for item name
     * @param  {string} propertyName  the item name
     * @param  {date} [cookieExpDate] the cookie expiring date if you want to use cookie
     */
    removeItem(propertyName, cookieExpDate) {
      arguments[1] = cookieExpDate || this.getCookieExp()
      this.use('removeItem', arguments)
    }
}

export default WebStorage
