const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Add any API methods here
});