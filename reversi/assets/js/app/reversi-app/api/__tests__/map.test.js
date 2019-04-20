import webSocketMap from '../websocket/map';

describe('test webSocketMap', () => {
  test('key check', () => {
    Object.keys(webSocketMap).forEach(wsSetupAction => {
      expect(typeof wsSetupAction === 'string').toBeTruthy();
    });
  });
  test('value check', () => {
    Object.values(webSocketMap).forEach(wsValue => {
      expect(typeof Array.isArray(wsValue)).toBeTruthy();
      wsValue.forEach(elem => {
        expect(typeof elem.close === 'string').toBeTruthy();
        expect(typeof elem.register === 'string').toBeTruthy();
        expect(typeof elem.send === 'string').toBeTruthy();
        expect(
          typeof elem.prepare === 'string' || elem.prepare === null
        ).toBeTruthy();
        expect(Array.isArray(elem.urlPaths)).toBeTruthy();
        elem.urlPaths.forEach(urlPath => {
          expect(
            typeof urlPath === 'string' || typeof urlPath === 'function'
          ).toBeTruthy();
        });
      });
    });
  });
});
