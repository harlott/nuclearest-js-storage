# nuclearest-js-storage v1.1.2-alpha


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
  import WebStorage, {STORAGE_TYPES} from 'nuclearest-js-storage'

  const cookieStorage = new WebStorage(STORAGE_TYPES.COOKIE, undefined, {enabled: true, 'grantedProps':['country'], callbackOnDisabled: () => {alert('COOKIE DISABLED')}})
  cookieStorage.setItem('country', 'IT')
  cookieStorage.setItem('accessToken', 'aaaa-bbbb-cccc-dddd')

  // use sessionStorage 	

  const sessionStorage = new WebStorage(STORAGE_TYPES.SESSION_STORAGE, undefined, {enabled: true, 'grantedProps':['country'], callbackOnDisabled: () => {alert('STORAGE DISABLED')}})
  sessionStorage.setItem('country', 'IT')
  sessionStorage.setItem('accessToken', 'aaaa-bbbb-cccc-dddd')
  
  //create and use custom
  
  import webStorage, { canUseStorage, buildCustomStorage, buildCustomStoragesMap, STORAGE_TYPES } from 'nuclearest-js-storage'
  	let __global__ = {}
    const myStorageType = 'myStorage'
    const setItem =  (prop, value)=>{
    	__global__[prop]=value
    }
    const getItem = (prop)=>{
    	return __global__[prop]
    }
    const removeItem = (prop)=>{
    	__global__[prop] = undefined
    }
    
    const myStorage = buildCustomStorage(myStorageType, setItem, getItem, removeItem)
  	const customStoragesMap = buildCustomStoragesMap(myStorageType, myStorage)
    let storage = new WebStorage(myStorageType, undefined, customStoragesMap)
	  storage.setItem('lang', 'EN')

 ```
 
#### Credits
- [harlott](https://github.com/harlott)
- [nuclearest-js](https://github.com/harlott/nuclearest-js)