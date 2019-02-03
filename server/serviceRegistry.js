'use strict';

class ServiceRegistry {
  constructor() {
    this._services = [];
    this._timeout = 120;
  }

  add(intent, address) {
    const key = intent + address;
    if (!this._services[key]) {
      this._services[key] = {};
      this._services[key].timestamp = Math.floor(new Date() / 1000);
      this._services[key].address = address;
      this._services[key].intent = intent;

      console.log(`Added service for ${intent} at ${address}`);
      return;
    }
    this._services[key].timestamp = Math.floor(new Date() / 1000);
    console.log(`Updated service for ${intent} at ${address}`);
    this._cleanup();
  }

  remove(intent, address) {
    const key = intent + address;
    delete this._services[key];
  }

  get(intent) {
    this._cleanup();
    for (let key in this._services) {
      if (this._services[key].intent == intent) return this._services[key];
    }
    return null;
  }

  _cleanup() {
    const now = Math.floor(new Date() / 1000);

    for (let key in this._services) {
      if (this._services[key].timestamp + this._timeout < now) {
        console.log(`Removed service for ${this._services[key].intent}`);

        delete this._services[key];
      }
    }
  }
}

module.exports = ServiceRegistry;