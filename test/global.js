import WebStorage, { buildCustomStorage, buildCustomStoragesMap} from '../src/WebStorage'

before(function() {
  global.window = {}
  global.navigator = {}
  global.context = {
    browser: {
      navigator:{
        userAgent: {
          edge: 'ieEdge'
        }
      }
    },
    node: {
      navigator: {
        userAgent:'node.js'
      }
    }
  }
  global.__global__ = {}
  global.newStorage = buildCustomStorage('fileSystem', (p, v)=>{global.__global__[p]=v}, (p)=>{return global.__global__[p]}, (p)=>{global.__global__[p] = undefined})
  global.customStoragesMap = buildCustomStoragesMap('fileSystem', global.newStorage)
  console.log(`global.customStoragesMap = ${JSON.stringify(global.customStoragesMap)}`)
  global.storage = new WebStorage('fileSystem', global.customStoragesMap, {enabled: true, grantedProps: ['a', 'b']})
});
