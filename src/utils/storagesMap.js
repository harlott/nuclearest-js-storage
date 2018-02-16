import parseToStringToSet from './parseToStringToSet'
import parseToObjectToGet from './parseToObjectToGet'

const calcExpireDate = () => {
    let now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
}

const _localOrSessionStorageMap = {
    setItem: (propertyName, value, expireDate, storage) => {
        let parsedValue = parseToStringToSet(value)
        storage.setItem(propertyName, parsedValue)
    },
    getItem: (propertyName, expireDate, storage) => {
        const item = storage.getItem(propertyName)
        return parseToObjectToGet(item)
    },
    removeItem: (propertyName, expireDate, storage) => {
        storage.removeItem(propertyName)
    }
}

/**
 * The storages map that implements the WebStorage
 * @type {Object}
 */


const STORAGES_MAP = {
    localStorage: _localOrSessionStorageMap,
    sessionStorage: _localOrSessionStorageMap,
    cookie: {
        setItem: (propertyName, value, cookieExpiringDate, storage) => {
            let expires = `expires=${cookieExpiringDate || calcExpireDate()}`
            let parsedValue = parseToStringToSet(value)

            storage.cookie = propertyName + "=" + parsedValue + ";" + expires + ";path=/";
        },
        getItem: (propertyName, cookieExpiringDate, storage) => {
            const name = propertyName + "=";
            const cookieValues = storage.cookie.split(';');

            for(var i = 0; i < cookieValues.length; i+=1) {
                var c = cookieValues[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    let item = c.substring(name.length, c.length)
                    return parseToObjectToGet(item)
                }
            }
            return "";
        },
        removeItem: (propertyName, cookieExpiringDate, storage) => {
            let expires = `expires=${cookieExpiringDate || calcExpireDate()}`
            storage.cookie = `${propertyName}=; path=/; ${expires};`
        }
    }
}

export default STORAGES_MAP

