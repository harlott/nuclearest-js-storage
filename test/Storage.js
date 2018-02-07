import WebStorage, { canUseStorage, buildCustomStorage, buildCustomStoragesMap, STORAGE_TYPES } from '../src'

const expect = require('chai').expect
const assert = require('chai').assert
let __global__ = {}

describe('WebStorage', function() {
  let newStorage = buildCustomStorage('fileSystem', (p, v)=>{__global__[p]=v}, (p)=>{return __global__[p]}, (p)=>{__global__[p] = undefined})
  let customStoragesMap = buildCustomStoragesMap('fileSystem', newStorage)

  describe('#buildCustomStorage()', function() {
    it('expect build the custom storage', function() {
        expect(newStorage).to.have.property('fileSystem')
        expect(newStorage.fileSystem).to.have.property('setItem')
        expect(newStorage.fileSystem.setItem).to.be.a('function')
        expect(newStorage.fileSystem).to.have.property('getItem')
        expect(newStorage.fileSystem.getItem).to.be.a('function')
        expect(newStorage.fileSystem).to.have.property('removeItem')
        expect(newStorage.fileSystem.setItem).to.be.a('function')
    });
  });

  describe('#buildCustomStoragesMap()', function() {
    it('expect build the custom storage map', function() {
        expect(customStoragesMap).to.have.property('fileSystem')
        expect(customStoragesMap).to.have.property('cookie')
        expect(customStoragesMap.fileSystem.setItem).to.be.a('function')
    });
  });



  describe('#StorageInstance', function(){
    //let storage = new WebStorage('fileSystem', customStoragesMap)
    it('expect not check custom storage', function(){
      let _testStorage = buildCustomStorage('disabledStorage', (p, v)=>{throw new Error('can not set')}, (p)=>{throw new Error('can not get')}, (p)=>{throw new Error('can not remove')})
      let _testCustomStoragesMap = buildCustomStoragesMap('disabledStorage', _testStorage)
      try {
          let canUse =  canUseStorage('disabledStorage', undefined, _testCustomStoragesMap)
          assert.ok(false)
      } catch (err) {
        assert.ok(true)
      }



    })

    it('expect check custom storage', function(){
      expect(canUseStorage('fileSystem', undefined, customStoragesMap)).to.be.equal(true)
    })

    it('expect not check standard local storage disabled', function(){
      let _mockedLocalStorage = {
        setItem: () => {throw new Error('disabled')},
        getItem: () => {throw new Error('disabled')},
        removeItem: () => {throw new Error('disabled')}
      }
      try {
          let canUse = canUseStorage('fileSystem', undefined, _mockedLocalStorage)
          assert.ok(false)
      } catch(err){
        assert.ok(true)
      }

    })

    it('expect not use fallback with standard local storage disabled,no fallbackStorage options and no callbackOnDisabled', function(){
      let _mockedLocalStorage = {
        setItem: () => {throw new Error('disabled')},
        getItem: () => {throw new Error('disabled')},
        removeItem: () => {throw new Error('disabled')}
      }

      let _storageDisabled = new WebStorage('STORAGE', _mockedLocalStorage)
      try {
          _storageDisabled.setItem('a', 1)
      } catch(err){
        assert.ok(true);
      }
    })

    it('expect use callbackOnDisabled configured on standard local storage disabled', function(){
      let _mockedLocalStorage = {
        setItem: () => {throw new Error('disabled')},
        getItem: () => {throw new Error('disabled')},
        removeItem: () => {throw new Error('disabled')}
      }
      let _storageDisabled = new WebStorage(STORAGE_TYPES.LOCAL_STORAGE, _mockedLocalStorage, {'callbackOnDisabled': () => {__global__['callbackOnDisabled'] = true}})
      try {
          _storageDisabled.setItem('a', 1)
      } catch(err){
        expect(__global__['callbackOnDisabled']).to.be.equal(true)
        delete __global__['callbackOnDisabled']
      }
    })

    it('expect use fallback with standard local storage disabled and fallbackStorage option grantedProps', function(){
      let _mockedLocalStorage = {
        setItem: () => {throw new Error('disabled')},
        getItem: () => {throw new Error('disabled')},
        removeItem: () => {throw new Error('disabled')}
      }
      let _storageDisabled = new WebStorage(STORAGE_TYPES.LOCAL_STORAGE, _mockedLocalStorage, {'grantedProps': ['a']})
      _storageDisabled.setItem('a', 1)
      expect(_storageDisabled.getItem('a')).to.be.a('number')
    })

    it('expect get the types map', function(){
      expect(WebStorage.getTypesMap()).to.have.all.keys('LOCAL_STORAGE', 'SESSION_STORAGE', 'COOKIE')
    })

    it('expect add custom storage to Storage instance', function(){
      expect(storage.STORAGES_MAP).to.have.property('fileSystem')
    })

    it('expect set and get a value', function(){
      storage.setItem('a', 1)
      expect(storage.getItem('a')).to.be.a('number')
      storage.setItem('b', 'may be the good one')
      expect(storage.getItem('b')).to.be.equal('may be the good one')
    })

    it('expect set and get a value for localStorage', function(){
      storage.setItem('a', 1)
      expect(storage.getItem('a')).to.be.a('number')
    })

    it('expect remove a value', function(){
      storage.setItem('a', 1)
      expect(storage.getItem('a')).to.be.a('number')
      storage.removeItem('b')
      expect(storage.getItem('b')).to.be.equal(undefined)
    })

    it('expect get the type', function(){
      expect(storage.getType()).to.be.equal('fileSystem')
    })

    it('expect storage to be undefined when in fallback mode', function(){
      expect(storage.getMethod()).to.be.equal(undefined)
    })

    it('expect work with cookie', function(){
      global.document = {
        cookie: ''
      }
      let cookieStorage = new WebStorage(STORAGE_TYPES.COOKIE, undefined, {enabled: true})
      cookieStorage.setItem('test', true)
      expect(cookieStorage.getItem('test')).to.be.equal(true)
    })
    it('expect work with localStorage in right context', function() {
      global.window = {
        localStorage: {
          setItem: () => {},
          getItem: () => {},
          removeItem: () => {}
        }
      }
      let windowLocalStorage = new WebStorage(STORAGE_TYPES.LOCAL_STORAGE, undefined, {enabled: true})
      expect(windowLocalStorage.CAN_USE_STORAGE).to.be.equal(true)
    })

  })
});
