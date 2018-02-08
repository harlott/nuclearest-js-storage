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

import { cloneDeep, get, includes, isEmpty } from 'lodash'
import parseToStringToSet from './utils/parseToStringToSet'
import parseToObjectToGet from './utils/parseToObjectToGet'
import buildCustomStorage from './utils/buildCustomStorage'
import buildCustomStoragesMap from './utils/buildCustomStoragesMap'
import STORAGES_MAP from './utils/storagesMap'

export const STORAGE_TYPES = {
  'LOCAL_STORAGE': 'localStorage',
  'SESSION_STORAGE': 'sessionStorage',
  'COOKIE': 'cookie'
}

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

export const canUseStorage = (storageType, context, customStoragesMap) => {
    let key = 'test'
    let usedStoragesMap =  customStoragesMap || STORAGES_MAP
    let _storage
    try {
        if (context !== undefined || !isEmpty(context)){
            _storage = storageType === STORAGE_TYPES.COOKIE ? context : context[storageType]
        } else {
            _storage = get(customStoragesMap, `${storageType}`)
        }
    } catch (error) {
        if (error instanceof DOMException){
            return false;
        } else {
            throw error
        }
    }
    try {
        usedStoragesMap[storageType].setItem(key, '1', undefined, _storage);
        usedStoragesMap[storageType].getItem(key, undefined, _storage);
        usedStoragesMap[storageType].removeItem(key, undefined, _storage);       
    } catch(err){
       throw err     
    }
    
    return true
}

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

const _getContextByStorageType = (storageType) => {
    try {
        switch (storageType){
            case STORAGE_TYPES.COOKIE:
                return document !== undefined && !isEmpty(document) ? Object.assign(document) : _internalContext
            break
            default:
                let rs = window !== undefined && !isEmpty(window) ? Object.assign(window) : _internalContext
                return rs
            break
        }
    } catch (err){
        if (!(err instanceof ReferenceError)) {
            throw err
        } else {
            return _internalContext
        }
    }
}

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
        this.CONTEXT = _getContextByStorageType(storageType)
        this.STORAGES_MAP = cloneDeep(storagesMap) || cloneDeep(STORAGES_MAP)
        this.CAN_USE_STORAGE = this.CONTEXT !== _internalContext ? canUseStorage(this.STORAGE_TYPE, this.CONTEXT, this.STORAGES_MAP) : false
        this.USE_FALLBACK_STORAGE = false
        
        this.CUSTOM_FALLBACK_STORAGE = cloneDeep(fallbackStorage)
        if (this.CAN_USE_STORAGE === false){
            if (this.CUSTOM_FALLBACK_STORAGE !== undefined){
                let callbackOnDisabled = get(this.CUSTOM_FALLBACK_STORAGE, 'callbackOnDisabled')
                if (callbackOnDisabled !== undefined){
                    callbackOnDisabled()
                }
            } else {
                if (this.STORAGES_MAP !== undefined){
                    this.STORAGE = this.STORAGES_MAP[storageType]
                }
            }
        } else {
            if (this.CONTEXT !== undefined && !isEmpty(this.CONTEXT) && this.CONTEXT !== _internalContext && this.CONTEXT !== null){
                this.STORAGE = this.STORAGE_TYPE === STORAGE_TYPES.COOKIE ? Object.assign(this.CONTEXT) : Object.assign(this.CONTEXT[storageType])
            } 
        }

        if (this.CAN_USE_STORAGE === false && (get(this.CUSTOM_FALLBACK_STORAGE, 'enabled') === true) || this.CONTEXT === _internalContext){
            this.USE_FALLBACK_STORAGE = true
        }
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
        for (let i=0; i <= params.length; i++) {
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
