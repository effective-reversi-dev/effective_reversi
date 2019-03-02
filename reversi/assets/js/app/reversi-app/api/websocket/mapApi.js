import webSocketMap from './map';

const mapApi = {
    // check whether the webSocketMap defined above is properly set
    _sanityChecker: () => {
        for (let wsSetupAction in webSocketMap) {
            if (!typeof wsSetupAction === 'string') {
                return false;
            }
            if (!typeof Array.isArray(webSocketMap[wsSetupAction])) {
                return false;
            } else {
                let sanity = webSocketMap[wsSetupAction].every(
                    elem => {
                        for (let urlPath of elem.urlPaths) {
                            if (typeof urlPath !== 'string' && typeof urlPath !== 'function') {
                                return false;
                            }
                        }
                        return (
                            typeof elem.close === 'string' &&
                            typeof elem.register === 'string' &&
                            typeof elem.send === 'string' &&
                            (typeof elem.prepare === 'string' || elem.prepare === null) &&
                            Array.isArray(elem.urlPaths)
                        );
                    }
                );
                if (!sanity) {
                    return false;
                }
            }
        }
        return true;
    },
    getWebSocketMap: function() {
        if(!this._sanityChecker(webSocketMap)) {
            console.error('WebSocketMap is not set properly.');
            return;
        }
        return webSocketMap;
    }
};

export default mapApi;
