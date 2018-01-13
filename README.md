# nuclearest-js-storage v1.0.0-alpha

[![Greenkeeper badge](https://badges.greenkeeper.io/harlott/nuclearest-js-storage.svg)](https://greenkeeper.io/)
Smart and flexible Web Storage with fallback strategy 


This is a simple interface for WebStorage. You can create different instances with different localStorage/sessionStorage/cookie and use always the same methods.
You can also create and use your own.

 **Features:**

 - handle storage disabled by Browser settings and Safari private session issue;
 - provide fallback strategy for basic storage settings (you can disable it);
 - simplify your application code refactoring :)    


 **Warnings**
 In fallback mode, remember to use it only for simple settings, like 'country' or 'lang'. Don't use it to store user settings or sensible infos.


 Example:

 - Use standard browser cookie for authentication data.
 - Please look at the fallbackStorage configuration.
 - With grantedProps, you can set the 'white list' for storage items.
 - If the Browser has cookies disabled, your web application doesn't broke.
 - If Storage try to set not permitted property, will execute callbackOnDisabled().
 - Use callbackOnDisabled() to show a popup, an alert, or do what you think is better for your application
 - In this case, the 'country' item will be setted in the default fallback storage.
 - The 'accessToken' property is not granted, so will be not setted and the application will show an alert.
 - P.S. the default fallback storage is only a global variable: don't use it to store a lot of data.              

 ```
  import Storage, {STORAGE_TYPES} from 'nuclearest-js/Storage'

  const cookieStorage = new Storage(STORAGE_TYPES.COOKIE, window.cookie, undefined, {enabled: true, 'grantedProps':['country'], callbackOnDisabled: () => {alert('COOKIE DISABLED')}})
  cookieStorage.setItem('country', 'IT')
  cookieStorage.setItem('accessToken', 'aaaa-bbbb-cccc-dddd')

 ```
