import Url from 'browser-url';
import mixinHtml5 from './html5';

export default {
  _changeHistory(method, item, url) {
    history[method + 'State']({ id: item.id }, '', '#!' + url.pathname + url.search + url.hash);
  },

  _go: mixinHtml5._go,
  _onLocationChange: mixinHtml5._onLocationChange,

  // no need to fallback to hashbang URL if history API is available
  _convertLocation() {},

  _getCurrentItemId() {
    return history.state ? history.state.id : null;
  },

  _parseCurrentLocation() {
    let url;
    if (location.hash.indexOf('#!') == 0) {
      url = location.hash.slice(2);
    } else {
      url = '/';
    }

    url = new Url(url).sortQuery();
    return {
      path: url.pathname,
      query: url.query,
      hash: url.hash
    };
  },

  _registerEvent: mixinHtml5._registerEvent,
  _enableEvent: mixinHtml5._enableEvent,
  _disableEvent: mixinHtml5._disableEvent
};