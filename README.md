# nuclearest-js-storage v1.0.0-alpha
===================

[![Build Status](https://travis-ci.org/harlott/nuclearest-js-storage.svg?branch=master)](https://travis-ci.org/harlott/nuclearest-js-storage)  [![Coverage Status](https://coveralls.io/repos/github/harlott/nuclearest-js-storage/badge.svg?branch=master)](https://coveralls.io/github/harlott/nuclearest-js-storage?branch=master) [![Greenkeeper badge](https://badges.greenkeeper.io/harlott/nuclearest-js-storage.svg)](https://greenkeeper.io/)


Smart and flexible Web Storage with fallback strategy from [nuclearest-js](https://github.com/harlott/nuclearest-js) 


This is a simple interface for WebStorage. You can create different instances with different localStorage/sessionStorage/cookie and use always the same methods.
You can also create and use your own.

 **Features:**

 - handle storage disabled by Browser settings and Safari private session issue;
 - provide fallback strategy for basic storage settings (you can disable it);
 - simplify your application code refactoring :)    


 **Warnings**
 In fallback mode, remember to use it only for simple settings. Don't use it to store user settings or sensible infos.


 Example:

 - P.S. the default fallback storage is only a global variable: don't use it to store a lot of data.              

 ```
  // use cookies 	
  import Storage, {STORAGE_TYPES} from 'nuclearest-js-storage'

  const cookieStorage = new Storage(STORAGE_TYPES.COOKIE, window.cookie, undefined, {enabled: true, 'grantedProps':['country'], callbackOnDisabled: () => {alert('COOKIE DISABLED')}})
  cookieStorage.setItem('country', 'IT')
  cookieStorage.setItem('accessToken', 'aaaa-bbbb-cccc-dddd')

  // use sessionStorage 	

  const sessionStorage = new Storage(STORAGE_TYPES.SESSION_STORAGE, window.sessionStorage, undefined, {enabled: true, 'grantedProps':['country'], callbackOnDisabled: () => {alert('STORAGE DISABLED')}})
  sessionStorage.setItem('country', 'IT')
  sessionStorage.setItem('accessToken', 'aaaa-bbbb-cccc-dddd')
  
  //create and use custom
  
  import Storage, { canUseStorage, buildCustomStorage, buildCustomStoragesMap, STORAGE_TYPES } from 'nuclearest-js-storage'
  	let __global__ = {}
    const myStorageType = 'myStorage'
    const setItem =  (p, v)=>{
    	__global__[p]=v
    }
    const getItem = (p)=>{
    	return __global__[p]
    }
    const removeItem = (p)=>{
    	__global__[p] = undefined
    }
    
    const myStorage = buildCustomStorage(myStorageType, setItem, getItem, removeItem)
  	const customStoragesMap = buildCustomStoragesMap(myStorageType, myStorage)
    let storage = new Storage(myStorageType, undefined, customStoragesMap)
	storage.setItem('lang', 'EN')

 ```
 
#### Credits
- [harlott](https://github.com/harlott)
- [nuclearest-js](https://github.com/harlott/nuclearest-js)