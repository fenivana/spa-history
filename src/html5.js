import Url from 'browser-url';

export default {
  url(location) {
    let url = this._locationToUrl(location);
    return this._baseNoTrailingSlash + url.pathname + url.search + url.hash;
  },

  _changeHistory(method, url) {
    history[method + 'State']({ id: url.id }, '', this._baseNoTrailingSlash + url.pathname + url.search + url.hash);
    return Promise.resolve();
  },

  _go(n) {
    if (!n) {
      return Promise.resolve();
    }

    let promise = new Promise(resolve => {
      let fn = () => {
        window.removeEventListener('popstate', fn);
        resolve();
      };
      window.addEventListener('popstate', fn);
    });
    history.go(n);
    return promise;
  },

  // convert hashbang URL to HTML5 URL
  _convertLocation() {
    if (location.hash.indexOf('#!') == 0) {
      let url = this._baseNoTrailingSlash + (location.hash.slice(2) || '/');
      url = new Url(url).removeQuery('_sid').href;
      history.replaceState(null, '', url);
    }
  },

  _getCurrentId() {
    return history.state ? history.state.id : null;
  },

  _parseUrl(url) {
    url = new Url(url).sortQuery();
    url.pathname = url.pathname.replace(this._baseNoTrailingSlash, '');
    return url;
  },

  _registerEvent() {
    this._navigateEvent = () => {
      this._onNavigate();
    };
    this._eventDisabled = true;
    this._enableEvent();
  },

  _enableEvent() {
    if (this._eventDisabled) {
      window.addEventListener('popstate', this._navigateEvent);
      this._eventDisabled = false;
    }
  },

  _disableEvent() {
    if (!this._eventDisabled) {
      window.removeEventListener('popstate', this._navigateEvent);
      this._eventDisabled = true;
    }
  }
};
