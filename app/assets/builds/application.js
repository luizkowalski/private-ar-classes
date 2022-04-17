(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // node_modules/@rails/actioncable/src/adapters.js
  var adapters_default;
  var init_adapters = __esm({
    "node_modules/@rails/actioncable/src/adapters.js"() {
      adapters_default = {
        logger: self.console,
        WebSocket: self.WebSocket
      };
    }
  });

  // node_modules/@rails/actioncable/src/logger.js
  var logger_default;
  var init_logger = __esm({
    "node_modules/@rails/actioncable/src/logger.js"() {
      init_adapters();
      logger_default = {
        log(...messages) {
          if (this.enabled) {
            messages.push(Date.now());
            adapters_default.logger.log("[ActionCable]", ...messages);
          }
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection_monitor.js
  var now, secondsSince, ConnectionMonitor, connection_monitor_default;
  var init_connection_monitor = __esm({
    "node_modules/@rails/actioncable/src/connection_monitor.js"() {
      init_logger();
      now = () => new Date().getTime();
      secondsSince = (time) => (now() - time) / 1e3;
      ConnectionMonitor = class {
        constructor(connection) {
          this.visibilityDidChange = this.visibilityDidChange.bind(this);
          this.connection = connection;
          this.reconnectAttempts = 0;
        }
        start() {
          if (!this.isRunning()) {
            this.startedAt = now();
            delete this.stoppedAt;
            this.startPolling();
            addEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log(`ConnectionMonitor started. stale threshold = ${this.constructor.staleThreshold} s`);
          }
        }
        stop() {
          if (this.isRunning()) {
            this.stoppedAt = now();
            this.stopPolling();
            removeEventListener("visibilitychange", this.visibilityDidChange);
            logger_default.log("ConnectionMonitor stopped");
          }
        }
        isRunning() {
          return this.startedAt && !this.stoppedAt;
        }
        recordPing() {
          this.pingedAt = now();
        }
        recordConnect() {
          this.reconnectAttempts = 0;
          this.recordPing();
          delete this.disconnectedAt;
          logger_default.log("ConnectionMonitor recorded connect");
        }
        recordDisconnect() {
          this.disconnectedAt = now();
          logger_default.log("ConnectionMonitor recorded disconnect");
        }
        startPolling() {
          this.stopPolling();
          this.poll();
        }
        stopPolling() {
          clearTimeout(this.pollTimeout);
        }
        poll() {
          this.pollTimeout = setTimeout(() => {
            this.reconnectIfStale();
            this.poll();
          }, this.getPollInterval());
        }
        getPollInterval() {
          const { staleThreshold, reconnectionBackoffRate } = this.constructor;
          const backoff = Math.pow(1 + reconnectionBackoffRate, Math.min(this.reconnectAttempts, 10));
          const jitterMax = this.reconnectAttempts === 0 ? 1 : reconnectionBackoffRate;
          const jitter = jitterMax * Math.random();
          return staleThreshold * 1e3 * backoff * (1 + jitter);
        }
        reconnectIfStale() {
          if (this.connectionIsStale()) {
            logger_default.log(`ConnectionMonitor detected stale connection. reconnectAttempts = ${this.reconnectAttempts}, time stale = ${secondsSince(this.refreshedAt)} s, stale threshold = ${this.constructor.staleThreshold} s`);
            this.reconnectAttempts++;
            if (this.disconnectedRecently()) {
              logger_default.log(`ConnectionMonitor skipping reopening recent disconnect. time disconnected = ${secondsSince(this.disconnectedAt)} s`);
            } else {
              logger_default.log("ConnectionMonitor reopening");
              this.connection.reopen();
            }
          }
        }
        get refreshedAt() {
          return this.pingedAt ? this.pingedAt : this.startedAt;
        }
        connectionIsStale() {
          return secondsSince(this.refreshedAt) > this.constructor.staleThreshold;
        }
        disconnectedRecently() {
          return this.disconnectedAt && secondsSince(this.disconnectedAt) < this.constructor.staleThreshold;
        }
        visibilityDidChange() {
          if (document.visibilityState === "visible") {
            setTimeout(() => {
              if (this.connectionIsStale() || !this.connection.isOpen()) {
                logger_default.log(`ConnectionMonitor reopening stale connection on visibilitychange. visibilityState = ${document.visibilityState}`);
                this.connection.reopen();
              }
            }, 200);
          }
        }
      };
      ConnectionMonitor.staleThreshold = 6;
      ConnectionMonitor.reconnectionBackoffRate = 0.15;
      connection_monitor_default = ConnectionMonitor;
    }
  });

  // node_modules/@rails/actioncable/src/internal.js
  var internal_default;
  var init_internal = __esm({
    "node_modules/@rails/actioncable/src/internal.js"() {
      internal_default = {
        "message_types": {
          "welcome": "welcome",
          "disconnect": "disconnect",
          "ping": "ping",
          "confirmation": "confirm_subscription",
          "rejection": "reject_subscription"
        },
        "disconnect_reasons": {
          "unauthorized": "unauthorized",
          "invalid_request": "invalid_request",
          "server_restart": "server_restart"
        },
        "default_mount_path": "/cable",
        "protocols": [
          "actioncable-v1-json",
          "actioncable-unsupported"
        ]
      };
    }
  });

  // node_modules/@rails/actioncable/src/connection.js
  var message_types, protocols, supportedProtocols, indexOf, Connection, connection_default;
  var init_connection = __esm({
    "node_modules/@rails/actioncable/src/connection.js"() {
      init_adapters();
      init_connection_monitor();
      init_internal();
      init_logger();
      ({ message_types, protocols } = internal_default);
      supportedProtocols = protocols.slice(0, protocols.length - 1);
      indexOf = [].indexOf;
      Connection = class {
        constructor(consumer2) {
          this.open = this.open.bind(this);
          this.consumer = consumer2;
          this.subscriptions = this.consumer.subscriptions;
          this.monitor = new connection_monitor_default(this);
          this.disconnected = true;
        }
        send(data) {
          if (this.isOpen()) {
            this.webSocket.send(JSON.stringify(data));
            return true;
          } else {
            return false;
          }
        }
        open() {
          if (this.isActive()) {
            logger_default.log(`Attempted to open WebSocket, but existing socket is ${this.getState()}`);
            return false;
          } else {
            logger_default.log(`Opening WebSocket, current state is ${this.getState()}, subprotocols: ${protocols}`);
            if (this.webSocket) {
              this.uninstallEventHandlers();
            }
            this.webSocket = new adapters_default.WebSocket(this.consumer.url, protocols);
            this.installEventHandlers();
            this.monitor.start();
            return true;
          }
        }
        close({ allowReconnect } = { allowReconnect: true }) {
          if (!allowReconnect) {
            this.monitor.stop();
          }
          if (this.isActive()) {
            return this.webSocket.close();
          }
        }
        reopen() {
          logger_default.log(`Reopening WebSocket, current state is ${this.getState()}`);
          if (this.isActive()) {
            try {
              return this.close();
            } catch (error2) {
              logger_default.log("Failed to reopen WebSocket", error2);
            } finally {
              logger_default.log(`Reopening WebSocket in ${this.constructor.reopenDelay}ms`);
              setTimeout(this.open, this.constructor.reopenDelay);
            }
          } else {
            return this.open();
          }
        }
        getProtocol() {
          if (this.webSocket) {
            return this.webSocket.protocol;
          }
        }
        isOpen() {
          return this.isState("open");
        }
        isActive() {
          return this.isState("open", "connecting");
        }
        isProtocolSupported() {
          return indexOf.call(supportedProtocols, this.getProtocol()) >= 0;
        }
        isState(...states) {
          return indexOf.call(states, this.getState()) >= 0;
        }
        getState() {
          if (this.webSocket) {
            for (let state in adapters_default.WebSocket) {
              if (adapters_default.WebSocket[state] === this.webSocket.readyState) {
                return state.toLowerCase();
              }
            }
          }
          return null;
        }
        installEventHandlers() {
          for (let eventName in this.events) {
            const handler = this.events[eventName].bind(this);
            this.webSocket[`on${eventName}`] = handler;
          }
        }
        uninstallEventHandlers() {
          for (let eventName in this.events) {
            this.webSocket[`on${eventName}`] = function() {
            };
          }
        }
      };
      Connection.reopenDelay = 500;
      Connection.prototype.events = {
        message(event) {
          if (!this.isProtocolSupported()) {
            return;
          }
          const { identifier, message, reason, reconnect, type } = JSON.parse(event.data);
          switch (type) {
            case message_types.welcome:
              this.monitor.recordConnect();
              return this.subscriptions.reload();
            case message_types.disconnect:
              logger_default.log(`Disconnecting. Reason: ${reason}`);
              return this.close({ allowReconnect: reconnect });
            case message_types.ping:
              return this.monitor.recordPing();
            case message_types.confirmation:
              this.subscriptions.confirmSubscription(identifier);
              return this.subscriptions.notify(identifier, "connected");
            case message_types.rejection:
              return this.subscriptions.reject(identifier);
            default:
              return this.subscriptions.notify(identifier, "received", message);
          }
        },
        open() {
          logger_default.log(`WebSocket onopen event, using '${this.getProtocol()}' subprotocol`);
          this.disconnected = false;
          if (!this.isProtocolSupported()) {
            logger_default.log("Protocol is unsupported. Stopping monitor and disconnecting.");
            return this.close({ allowReconnect: false });
          }
        },
        close(event) {
          logger_default.log("WebSocket onclose event");
          if (this.disconnected) {
            return;
          }
          this.disconnected = true;
          this.monitor.recordDisconnect();
          return this.subscriptions.notifyAll("disconnected", { willAttemptReconnect: this.monitor.isRunning() });
        },
        error() {
          logger_default.log("WebSocket onerror event");
        }
      };
      connection_default = Connection;
    }
  });

  // node_modules/@rails/actioncable/src/subscription.js
  var extend2, Subscription;
  var init_subscription = __esm({
    "node_modules/@rails/actioncable/src/subscription.js"() {
      extend2 = function(object2, properties) {
        if (properties != null) {
          for (let key in properties) {
            const value = properties[key];
            object2[key] = value;
          }
        }
        return object2;
      };
      Subscription = class {
        constructor(consumer2, params = {}, mixin) {
          this.consumer = consumer2;
          this.identifier = JSON.stringify(params);
          extend2(this, mixin);
        }
        perform(action, data = {}) {
          data.action = action;
          return this.send(data);
        }
        send(data) {
          return this.consumer.send({ command: "message", identifier: this.identifier, data: JSON.stringify(data) });
        }
        unsubscribe() {
          return this.consumer.subscriptions.remove(this);
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/subscription_guarantor.js
  var SubscriptionGuarantor, subscription_guarantor_default;
  var init_subscription_guarantor = __esm({
    "node_modules/@rails/actioncable/src/subscription_guarantor.js"() {
      init_logger();
      SubscriptionGuarantor = class {
        constructor(subscriptions) {
          this.subscriptions = subscriptions;
          this.pendingSubscriptions = [];
        }
        guarantee(subscription) {
          if (this.pendingSubscriptions.indexOf(subscription) == -1) {
            logger_default.log(`SubscriptionGuarantor guaranteeing ${subscription.identifier}`);
            this.pendingSubscriptions.push(subscription);
          } else {
            logger_default.log(`SubscriptionGuarantor already guaranteeing ${subscription.identifier}`);
          }
          this.startGuaranteeing();
        }
        forget(subscription) {
          logger_default.log(`SubscriptionGuarantor forgetting ${subscription.identifier}`);
          this.pendingSubscriptions = this.pendingSubscriptions.filter((s) => s !== subscription);
        }
        startGuaranteeing() {
          this.stopGuaranteeing();
          this.retrySubscribing();
        }
        stopGuaranteeing() {
          clearTimeout(this.retryTimeout);
        }
        retrySubscribing() {
          this.retryTimeout = setTimeout(() => {
            if (this.subscriptions && typeof this.subscriptions.subscribe === "function") {
              this.pendingSubscriptions.map((subscription) => {
                logger_default.log(`SubscriptionGuarantor resubscribing ${subscription.identifier}`);
                this.subscriptions.subscribe(subscription);
              });
            }
          }, 500);
        }
      };
      subscription_guarantor_default = SubscriptionGuarantor;
    }
  });

  // node_modules/@rails/actioncable/src/subscriptions.js
  var Subscriptions;
  var init_subscriptions = __esm({
    "node_modules/@rails/actioncable/src/subscriptions.js"() {
      init_subscription();
      init_subscription_guarantor();
      init_logger();
      Subscriptions = class {
        constructor(consumer2) {
          this.consumer = consumer2;
          this.guarantor = new subscription_guarantor_default(this);
          this.subscriptions = [];
        }
        create(channelName, mixin) {
          const channel = channelName;
          const params = typeof channel === "object" ? channel : { channel };
          const subscription = new Subscription(this.consumer, params, mixin);
          return this.add(subscription);
        }
        add(subscription) {
          this.subscriptions.push(subscription);
          this.consumer.ensureActiveConnection();
          this.notify(subscription, "initialized");
          this.subscribe(subscription);
          return subscription;
        }
        remove(subscription) {
          this.forget(subscription);
          if (!this.findAll(subscription.identifier).length) {
            this.sendCommand(subscription, "unsubscribe");
          }
          return subscription;
        }
        reject(identifier) {
          return this.findAll(identifier).map((subscription) => {
            this.forget(subscription);
            this.notify(subscription, "rejected");
            return subscription;
          });
        }
        forget(subscription) {
          this.guarantor.forget(subscription);
          this.subscriptions = this.subscriptions.filter((s) => s !== subscription);
          return subscription;
        }
        findAll(identifier) {
          return this.subscriptions.filter((s) => s.identifier === identifier);
        }
        reload() {
          return this.subscriptions.map((subscription) => this.subscribe(subscription));
        }
        notifyAll(callbackName, ...args) {
          return this.subscriptions.map((subscription) => this.notify(subscription, callbackName, ...args));
        }
        notify(subscription, callbackName, ...args) {
          let subscriptions;
          if (typeof subscription === "string") {
            subscriptions = this.findAll(subscription);
          } else {
            subscriptions = [subscription];
          }
          return subscriptions.map((subscription2) => typeof subscription2[callbackName] === "function" ? subscription2[callbackName](...args) : void 0);
        }
        subscribe(subscription) {
          if (this.sendCommand(subscription, "subscribe")) {
            this.guarantor.guarantee(subscription);
          }
        }
        confirmSubscription(identifier) {
          logger_default.log(`Subscription confirmed ${identifier}`);
          this.findAll(identifier).map((subscription) => this.guarantor.forget(subscription));
        }
        sendCommand(subscription, command) {
          const { identifier } = subscription;
          return this.consumer.send({ command, identifier });
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/consumer.js
  function createWebSocketURL(url) {
    if (typeof url === "function") {
      url = url();
    }
    if (url && !/^wss?:/i.test(url)) {
      const a = document.createElement("a");
      a.href = url;
      a.href = a.href;
      a.protocol = a.protocol.replace("http", "ws");
      return a.href;
    } else {
      return url;
    }
  }
  var Consumer;
  var init_consumer = __esm({
    "node_modules/@rails/actioncable/src/consumer.js"() {
      init_connection();
      init_subscriptions();
      Consumer = class {
        constructor(url) {
          this._url = url;
          this.subscriptions = new Subscriptions(this);
          this.connection = new connection_default(this);
        }
        get url() {
          return createWebSocketURL(this._url);
        }
        send(data) {
          return this.connection.send(data);
        }
        connect() {
          return this.connection.open();
        }
        disconnect() {
          return this.connection.close({ allowReconnect: false });
        }
        ensureActiveConnection() {
          if (!this.connection.isActive()) {
            return this.connection.open();
          }
        }
      };
    }
  });

  // node_modules/@rails/actioncable/src/index.js
  var src_exports = {};
  __export(src_exports, {
    Connection: () => connection_default,
    ConnectionMonitor: () => connection_monitor_default,
    Consumer: () => Consumer,
    INTERNAL: () => internal_default,
    Subscription: () => Subscription,
    SubscriptionGuarantor: () => subscription_guarantor_default,
    Subscriptions: () => Subscriptions,
    adapters: () => adapters_default,
    createConsumer: () => createConsumer,
    createWebSocketURL: () => createWebSocketURL,
    getConfig: () => getConfig,
    logger: () => logger_default
  });
  function createConsumer(url = getConfig("url") || internal_default.default_mount_path) {
    return new Consumer(url);
  }
  function getConfig(name) {
    const element = document.head.querySelector(`meta[name='action-cable-${name}']`);
    if (element) {
      return element.getAttribute("content");
    }
  }
  var init_src = __esm({
    "node_modules/@rails/actioncable/src/index.js"() {
      init_connection();
      init_connection_monitor();
      init_consumer();
      init_internal();
      init_subscription();
      init_subscriptions();
      init_subscription_guarantor();
      init_adapters();
      init_logger();
    }
  });

  // node_modules/@rails/activestorage/app/assets/javascripts/activestorage.js
  var require_activestorage = __commonJS({
    "node_modules/@rails/activestorage/app/assets/javascripts/activestorage.js"(exports, module) {
      (function(global, factory) {
        typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : factory(global.ActiveStorage = {});
      })(exports, function(exports2) {
        "use strict";
        function createCommonjsModule(fn, module2) {
          return module2 = {
            exports: {}
          }, fn(module2, module2.exports), module2.exports;
        }
        var sparkMd5 = createCommonjsModule(function(module2, exports3) {
          (function(factory) {
            {
              module2.exports = factory();
            }
          })(function(undefined2) {
            var hex_chr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            function md5cycle(x, k) {
              var a = x[0], b = x[1], c = x[2], d = x[3];
              a += (b & c | ~b & d) + k[0] - 680876936 | 0;
              a = (a << 7 | a >>> 25) + b | 0;
              d += (a & b | ~a & c) + k[1] - 389564586 | 0;
              d = (d << 12 | d >>> 20) + a | 0;
              c += (d & a | ~d & b) + k[2] + 606105819 | 0;
              c = (c << 17 | c >>> 15) + d | 0;
              b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
              b = (b << 22 | b >>> 10) + c | 0;
              a += (b & c | ~b & d) + k[4] - 176418897 | 0;
              a = (a << 7 | a >>> 25) + b | 0;
              d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
              d = (d << 12 | d >>> 20) + a | 0;
              c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
              c = (c << 17 | c >>> 15) + d | 0;
              b += (c & d | ~c & a) + k[7] - 45705983 | 0;
              b = (b << 22 | b >>> 10) + c | 0;
              a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
              a = (a << 7 | a >>> 25) + b | 0;
              d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
              d = (d << 12 | d >>> 20) + a | 0;
              c += (d & a | ~d & b) + k[10] - 42063 | 0;
              c = (c << 17 | c >>> 15) + d | 0;
              b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
              b = (b << 22 | b >>> 10) + c | 0;
              a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
              a = (a << 7 | a >>> 25) + b | 0;
              d += (a & b | ~a & c) + k[13] - 40341101 | 0;
              d = (d << 12 | d >>> 20) + a | 0;
              c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
              c = (c << 17 | c >>> 15) + d | 0;
              b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
              b = (b << 22 | b >>> 10) + c | 0;
              a += (b & d | c & ~d) + k[1] - 165796510 | 0;
              a = (a << 5 | a >>> 27) + b | 0;
              d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
              d = (d << 9 | d >>> 23) + a | 0;
              c += (d & b | a & ~b) + k[11] + 643717713 | 0;
              c = (c << 14 | c >>> 18) + d | 0;
              b += (c & a | d & ~a) + k[0] - 373897302 | 0;
              b = (b << 20 | b >>> 12) + c | 0;
              a += (b & d | c & ~d) + k[5] - 701558691 | 0;
              a = (a << 5 | a >>> 27) + b | 0;
              d += (a & c | b & ~c) + k[10] + 38016083 | 0;
              d = (d << 9 | d >>> 23) + a | 0;
              c += (d & b | a & ~b) + k[15] - 660478335 | 0;
              c = (c << 14 | c >>> 18) + d | 0;
              b += (c & a | d & ~a) + k[4] - 405537848 | 0;
              b = (b << 20 | b >>> 12) + c | 0;
              a += (b & d | c & ~d) + k[9] + 568446438 | 0;
              a = (a << 5 | a >>> 27) + b | 0;
              d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
              d = (d << 9 | d >>> 23) + a | 0;
              c += (d & b | a & ~b) + k[3] - 187363961 | 0;
              c = (c << 14 | c >>> 18) + d | 0;
              b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
              b = (b << 20 | b >>> 12) + c | 0;
              a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
              a = (a << 5 | a >>> 27) + b | 0;
              d += (a & c | b & ~c) + k[2] - 51403784 | 0;
              d = (d << 9 | d >>> 23) + a | 0;
              c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
              c = (c << 14 | c >>> 18) + d | 0;
              b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
              b = (b << 20 | b >>> 12) + c | 0;
              a += (b ^ c ^ d) + k[5] - 378558 | 0;
              a = (a << 4 | a >>> 28) + b | 0;
              d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
              d = (d << 11 | d >>> 21) + a | 0;
              c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
              c = (c << 16 | c >>> 16) + d | 0;
              b += (c ^ d ^ a) + k[14] - 35309556 | 0;
              b = (b << 23 | b >>> 9) + c | 0;
              a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
              a = (a << 4 | a >>> 28) + b | 0;
              d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
              d = (d << 11 | d >>> 21) + a | 0;
              c += (d ^ a ^ b) + k[7] - 155497632 | 0;
              c = (c << 16 | c >>> 16) + d | 0;
              b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
              b = (b << 23 | b >>> 9) + c | 0;
              a += (b ^ c ^ d) + k[13] + 681279174 | 0;
              a = (a << 4 | a >>> 28) + b | 0;
              d += (a ^ b ^ c) + k[0] - 358537222 | 0;
              d = (d << 11 | d >>> 21) + a | 0;
              c += (d ^ a ^ b) + k[3] - 722521979 | 0;
              c = (c << 16 | c >>> 16) + d | 0;
              b += (c ^ d ^ a) + k[6] + 76029189 | 0;
              b = (b << 23 | b >>> 9) + c | 0;
              a += (b ^ c ^ d) + k[9] - 640364487 | 0;
              a = (a << 4 | a >>> 28) + b | 0;
              d += (a ^ b ^ c) + k[12] - 421815835 | 0;
              d = (d << 11 | d >>> 21) + a | 0;
              c += (d ^ a ^ b) + k[15] + 530742520 | 0;
              c = (c << 16 | c >>> 16) + d | 0;
              b += (c ^ d ^ a) + k[2] - 995338651 | 0;
              b = (b << 23 | b >>> 9) + c | 0;
              a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
              a = (a << 6 | a >>> 26) + b | 0;
              d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
              d = (d << 10 | d >>> 22) + a | 0;
              c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
              c = (c << 15 | c >>> 17) + d | 0;
              b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
              b = (b << 21 | b >>> 11) + c | 0;
              a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
              a = (a << 6 | a >>> 26) + b | 0;
              d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
              d = (d << 10 | d >>> 22) + a | 0;
              c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
              c = (c << 15 | c >>> 17) + d | 0;
              b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
              b = (b << 21 | b >>> 11) + c | 0;
              a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
              a = (a << 6 | a >>> 26) + b | 0;
              d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
              d = (d << 10 | d >>> 22) + a | 0;
              c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
              c = (c << 15 | c >>> 17) + d | 0;
              b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
              b = (b << 21 | b >>> 11) + c | 0;
              a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
              a = (a << 6 | a >>> 26) + b | 0;
              d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
              d = (d << 10 | d >>> 22) + a | 0;
              c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
              c = (c << 15 | c >>> 17) + d | 0;
              b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
              b = (b << 21 | b >>> 11) + c | 0;
              x[0] = a + x[0] | 0;
              x[1] = b + x[1] | 0;
              x[2] = c + x[2] | 0;
              x[3] = d + x[3] | 0;
            }
            function md5blk(s) {
              var md5blks = [], i;
              for (i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
              }
              return md5blks;
            }
            function md5blk_array(a) {
              var md5blks = [], i;
              for (i = 0; i < 64; i += 4) {
                md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
              }
              return md5blks;
            }
            function md51(s) {
              var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i, length, tail, tmp, lo, hi;
              for (i = 64; i <= n; i += 64) {
                md5cycle(state, md5blk(s.substring(i - 64, i)));
              }
              s = s.substring(i - 64);
              length = s.length;
              tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (i = 0; i < length; i += 1) {
                tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
              }
              tail[i >> 2] |= 128 << (i % 4 << 3);
              if (i > 55) {
                md5cycle(state, tail);
                for (i = 0; i < 16; i += 1) {
                  tail[i] = 0;
                }
              }
              tmp = n * 8;
              tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
              lo = parseInt(tmp[2], 16);
              hi = parseInt(tmp[1], 16) || 0;
              tail[14] = lo;
              tail[15] = hi;
              md5cycle(state, tail);
              return state;
            }
            function md51_array(a) {
              var n = a.length, state = [1732584193, -271733879, -1732584194, 271733878], i, length, tail, tmp, lo, hi;
              for (i = 64; i <= n; i += 64) {
                md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
              }
              a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
              length = a.length;
              tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (i = 0; i < length; i += 1) {
                tail[i >> 2] |= a[i] << (i % 4 << 3);
              }
              tail[i >> 2] |= 128 << (i % 4 << 3);
              if (i > 55) {
                md5cycle(state, tail);
                for (i = 0; i < 16; i += 1) {
                  tail[i] = 0;
                }
              }
              tmp = n * 8;
              tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
              lo = parseInt(tmp[2], 16);
              hi = parseInt(tmp[1], 16) || 0;
              tail[14] = lo;
              tail[15] = hi;
              md5cycle(state, tail);
              return state;
            }
            function rhex(n) {
              var s = "", j;
              for (j = 0; j < 4; j += 1) {
                s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
              }
              return s;
            }
            function hex(x) {
              var i;
              for (i = 0; i < x.length; i += 1) {
                x[i] = rhex(x[i]);
              }
              return x.join("");
            }
            if (hex(md51("hello")) !== "5d41402abc4b2a76b9719d911017c592")
              ;
            if (typeof ArrayBuffer !== "undefined" && !ArrayBuffer.prototype.slice) {
              (function() {
                function clamp(val, length) {
                  val = val | 0 || 0;
                  if (val < 0) {
                    return Math.max(val + length, 0);
                  }
                  return Math.min(val, length);
                }
                ArrayBuffer.prototype.slice = function(from, to) {
                  var length = this.byteLength, begin = clamp(from, length), end = length, num, target, targetArray, sourceArray;
                  if (to !== undefined2) {
                    end = clamp(to, length);
                  }
                  if (begin > end) {
                    return new ArrayBuffer(0);
                  }
                  num = end - begin;
                  target = new ArrayBuffer(num);
                  targetArray = new Uint8Array(target);
                  sourceArray = new Uint8Array(this, begin, num);
                  targetArray.set(sourceArray);
                  return target;
                };
              })();
            }
            function toUtf8(str) {
              if (/[\u0080-\uFFFF]/.test(str)) {
                str = unescape(encodeURIComponent(str));
              }
              return str;
            }
            function utf8Str2ArrayBuffer(str, returnUInt8Array) {
              var length = str.length, buff = new ArrayBuffer(length), arr = new Uint8Array(buff), i;
              for (i = 0; i < length; i += 1) {
                arr[i] = str.charCodeAt(i);
              }
              return returnUInt8Array ? arr : buff;
            }
            function arrayBuffer2Utf8Str(buff) {
              return String.fromCharCode.apply(null, new Uint8Array(buff));
            }
            function concatenateArrayBuffers(first, second, returnUInt8Array) {
              var result = new Uint8Array(first.byteLength + second.byteLength);
              result.set(new Uint8Array(first));
              result.set(new Uint8Array(second), first.byteLength);
              return returnUInt8Array ? result : result.buffer;
            }
            function hexToBinaryString(hex2) {
              var bytes = [], length = hex2.length, x;
              for (x = 0; x < length - 1; x += 2) {
                bytes.push(parseInt(hex2.substr(x, 2), 16));
              }
              return String.fromCharCode.apply(String, bytes);
            }
            function SparkMD5() {
              this.reset();
            }
            SparkMD5.prototype.append = function(str) {
              this.appendBinary(toUtf8(str));
              return this;
            };
            SparkMD5.prototype.appendBinary = function(contents) {
              this._buff += contents;
              this._length += contents.length;
              var length = this._buff.length, i;
              for (i = 64; i <= length; i += 64) {
                md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
              }
              this._buff = this._buff.substring(i - 64);
              return this;
            };
            SparkMD5.prototype.end = function(raw) {
              var buff = this._buff, length = buff.length, i, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], ret;
              for (i = 0; i < length; i += 1) {
                tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
              }
              this._finish(tail, length);
              ret = hex(this._hash);
              if (raw) {
                ret = hexToBinaryString(ret);
              }
              this.reset();
              return ret;
            };
            SparkMD5.prototype.reset = function() {
              this._buff = "";
              this._length = 0;
              this._hash = [1732584193, -271733879, -1732584194, 271733878];
              return this;
            };
            SparkMD5.prototype.getState = function() {
              return {
                buff: this._buff,
                length: this._length,
                hash: this._hash
              };
            };
            SparkMD5.prototype.setState = function(state) {
              this._buff = state.buff;
              this._length = state.length;
              this._hash = state.hash;
              return this;
            };
            SparkMD5.prototype.destroy = function() {
              delete this._hash;
              delete this._buff;
              delete this._length;
            };
            SparkMD5.prototype._finish = function(tail, length) {
              var i = length, tmp, lo, hi;
              tail[i >> 2] |= 128 << (i % 4 << 3);
              if (i > 55) {
                md5cycle(this._hash, tail);
                for (i = 0; i < 16; i += 1) {
                  tail[i] = 0;
                }
              }
              tmp = this._length * 8;
              tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
              lo = parseInt(tmp[2], 16);
              hi = parseInt(tmp[1], 16) || 0;
              tail[14] = lo;
              tail[15] = hi;
              md5cycle(this._hash, tail);
            };
            SparkMD5.hash = function(str, raw) {
              return SparkMD5.hashBinary(toUtf8(str), raw);
            };
            SparkMD5.hashBinary = function(content, raw) {
              var hash = md51(content), ret = hex(hash);
              return raw ? hexToBinaryString(ret) : ret;
            };
            SparkMD5.ArrayBuffer = function() {
              this.reset();
            };
            SparkMD5.ArrayBuffer.prototype.append = function(arr) {
              var buff = concatenateArrayBuffers(this._buff.buffer, arr, true), length = buff.length, i;
              this._length += arr.byteLength;
              for (i = 64; i <= length; i += 64) {
                md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
              }
              this._buff = i - 64 < length ? new Uint8Array(buff.buffer.slice(i - 64)) : new Uint8Array(0);
              return this;
            };
            SparkMD5.ArrayBuffer.prototype.end = function(raw) {
              var buff = this._buff, length = buff.length, tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], i, ret;
              for (i = 0; i < length; i += 1) {
                tail[i >> 2] |= buff[i] << (i % 4 << 3);
              }
              this._finish(tail, length);
              ret = hex(this._hash);
              if (raw) {
                ret = hexToBinaryString(ret);
              }
              this.reset();
              return ret;
            };
            SparkMD5.ArrayBuffer.prototype.reset = function() {
              this._buff = new Uint8Array(0);
              this._length = 0;
              this._hash = [1732584193, -271733879, -1732584194, 271733878];
              return this;
            };
            SparkMD5.ArrayBuffer.prototype.getState = function() {
              var state = SparkMD5.prototype.getState.call(this);
              state.buff = arrayBuffer2Utf8Str(state.buff);
              return state;
            };
            SparkMD5.ArrayBuffer.prototype.setState = function(state) {
              state.buff = utf8Str2ArrayBuffer(state.buff, true);
              return SparkMD5.prototype.setState.call(this, state);
            };
            SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
            SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
            SparkMD5.ArrayBuffer.hash = function(arr, raw) {
              var hash = md51_array(new Uint8Array(arr)), ret = hex(hash);
              return raw ? hexToBinaryString(ret) : ret;
            };
            return SparkMD5;
          });
        });
        var classCallCheck = function(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };
        var createClass = function() {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor)
                descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function(Constructor, protoProps, staticProps) {
            if (protoProps)
              defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
              defineProperties(Constructor, staticProps);
            return Constructor;
          };
        }();
        var fileSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        var FileChecksum = function() {
          createClass(FileChecksum2, null, [{
            key: "create",
            value: function create(file, callback) {
              var instance = new FileChecksum2(file);
              instance.create(callback);
            }
          }]);
          function FileChecksum2(file) {
            classCallCheck(this, FileChecksum2);
            this.file = file;
            this.chunkSize = 2097152;
            this.chunkCount = Math.ceil(this.file.size / this.chunkSize);
            this.chunkIndex = 0;
          }
          createClass(FileChecksum2, [{
            key: "create",
            value: function create(callback) {
              var _this = this;
              this.callback = callback;
              this.md5Buffer = new sparkMd5.ArrayBuffer();
              this.fileReader = new FileReader();
              this.fileReader.addEventListener("load", function(event) {
                return _this.fileReaderDidLoad(event);
              });
              this.fileReader.addEventListener("error", function(event) {
                return _this.fileReaderDidError(event);
              });
              this.readNextChunk();
            }
          }, {
            key: "fileReaderDidLoad",
            value: function fileReaderDidLoad(event) {
              this.md5Buffer.append(event.target.result);
              if (!this.readNextChunk()) {
                var binaryDigest = this.md5Buffer.end(true);
                var base64digest = btoa(binaryDigest);
                this.callback(null, base64digest);
              }
            }
          }, {
            key: "fileReaderDidError",
            value: function fileReaderDidError(event) {
              this.callback("Error reading " + this.file.name);
            }
          }, {
            key: "readNextChunk",
            value: function readNextChunk() {
              if (this.chunkIndex < this.chunkCount || this.chunkIndex == 0 && this.chunkCount == 0) {
                var start3 = this.chunkIndex * this.chunkSize;
                var end = Math.min(start3 + this.chunkSize, this.file.size);
                var bytes = fileSlice.call(this.file, start3, end);
                this.fileReader.readAsArrayBuffer(bytes);
                this.chunkIndex++;
                return true;
              } else {
                return false;
              }
            }
          }]);
          return FileChecksum2;
        }();
        function getMetaValue(name) {
          var element = findElement(document.head, 'meta[name="' + name + '"]');
          if (element) {
            return element.getAttribute("content");
          }
        }
        function findElements(root, selector) {
          if (typeof root == "string") {
            selector = root;
            root = document;
          }
          var elements = root.querySelectorAll(selector);
          return toArray$1(elements);
        }
        function findElement(root, selector) {
          if (typeof root == "string") {
            selector = root;
            root = document;
          }
          return root.querySelector(selector);
        }
        function dispatchEvent2(element, type) {
          var eventInit = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          var disabled = element.disabled;
          var bubbles = eventInit.bubbles, cancelable = eventInit.cancelable, detail = eventInit.detail;
          var event = document.createEvent("Event");
          event.initEvent(type, bubbles || true, cancelable || true);
          event.detail = detail || {};
          try {
            element.disabled = false;
            element.dispatchEvent(event);
          } finally {
            element.disabled = disabled;
          }
          return event;
        }
        function toArray$1(value) {
          if (Array.isArray(value)) {
            return value;
          } else if (Array.from) {
            return Array.from(value);
          } else {
            return [].slice.call(value);
          }
        }
        var BlobRecord = function() {
          function BlobRecord2(file, checksum, url) {
            var _this = this;
            classCallCheck(this, BlobRecord2);
            this.file = file;
            this.attributes = {
              filename: file.name,
              content_type: file.type || "application/octet-stream",
              byte_size: file.size,
              checksum
            };
            this.xhr = new XMLHttpRequest();
            this.xhr.open("POST", url, true);
            this.xhr.responseType = "json";
            this.xhr.setRequestHeader("Content-Type", "application/json");
            this.xhr.setRequestHeader("Accept", "application/json");
            this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            var csrfToken = getMetaValue("csrf-token");
            if (csrfToken != void 0) {
              this.xhr.setRequestHeader("X-CSRF-Token", csrfToken);
            }
            this.xhr.addEventListener("load", function(event) {
              return _this.requestDidLoad(event);
            });
            this.xhr.addEventListener("error", function(event) {
              return _this.requestDidError(event);
            });
          }
          createClass(BlobRecord2, [{
            key: "create",
            value: function create(callback) {
              this.callback = callback;
              this.xhr.send(JSON.stringify({
                blob: this.attributes
              }));
            }
          }, {
            key: "requestDidLoad",
            value: function requestDidLoad(event) {
              if (this.status >= 200 && this.status < 300) {
                var response = this.response;
                var direct_upload = response.direct_upload;
                delete response.direct_upload;
                this.attributes = response;
                this.directUploadData = direct_upload;
                this.callback(null, this.toJSON());
              } else {
                this.requestDidError(event);
              }
            }
          }, {
            key: "requestDidError",
            value: function requestDidError(event) {
              this.callback('Error creating Blob for "' + this.file.name + '". Status: ' + this.status);
            }
          }, {
            key: "toJSON",
            value: function toJSON() {
              var result = {};
              for (var key in this.attributes) {
                result[key] = this.attributes[key];
              }
              return result;
            }
          }, {
            key: "status",
            get: function get$$1() {
              return this.xhr.status;
            }
          }, {
            key: "response",
            get: function get$$1() {
              var _xhr = this.xhr, responseType = _xhr.responseType, response = _xhr.response;
              if (responseType == "json") {
                return response;
              } else {
                return JSON.parse(response);
              }
            }
          }]);
          return BlobRecord2;
        }();
        var BlobUpload = function() {
          function BlobUpload2(blob) {
            var _this = this;
            classCallCheck(this, BlobUpload2);
            this.blob = blob;
            this.file = blob.file;
            var _blob$directUploadDat = blob.directUploadData, url = _blob$directUploadDat.url, headers = _blob$directUploadDat.headers;
            this.xhr = new XMLHttpRequest();
            this.xhr.open("PUT", url, true);
            this.xhr.responseType = "text";
            for (var key in headers) {
              this.xhr.setRequestHeader(key, headers[key]);
            }
            this.xhr.addEventListener("load", function(event) {
              return _this.requestDidLoad(event);
            });
            this.xhr.addEventListener("error", function(event) {
              return _this.requestDidError(event);
            });
          }
          createClass(BlobUpload2, [{
            key: "create",
            value: function create(callback) {
              this.callback = callback;
              this.xhr.send(this.file.slice());
            }
          }, {
            key: "requestDidLoad",
            value: function requestDidLoad(event) {
              var _xhr = this.xhr, status = _xhr.status, response = _xhr.response;
              if (status >= 200 && status < 300) {
                this.callback(null, response);
              } else {
                this.requestDidError(event);
              }
            }
          }, {
            key: "requestDidError",
            value: function requestDidError(event) {
              this.callback('Error storing "' + this.file.name + '". Status: ' + this.xhr.status);
            }
          }]);
          return BlobUpload2;
        }();
        var id2 = 0;
        var DirectUpload2 = function() {
          function DirectUpload3(file, url, delegate) {
            classCallCheck(this, DirectUpload3);
            this.id = ++id2;
            this.file = file;
            this.url = url;
            this.delegate = delegate;
          }
          createClass(DirectUpload3, [{
            key: "create",
            value: function create(callback) {
              var _this = this;
              FileChecksum.create(this.file, function(error2, checksum) {
                if (error2) {
                  callback(error2);
                  return;
                }
                var blob = new BlobRecord(_this.file, checksum, _this.url);
                notify(_this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr);
                blob.create(function(error3) {
                  if (error3) {
                    callback(error3);
                  } else {
                    var upload = new BlobUpload(blob);
                    notify(_this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr);
                    upload.create(function(error4) {
                      if (error4) {
                        callback(error4);
                      } else {
                        callback(null, blob.toJSON());
                      }
                    });
                  }
                });
              });
            }
          }]);
          return DirectUpload3;
        }();
        function notify(object2, methodName) {
          if (object2 && typeof object2[methodName] == "function") {
            for (var _len = arguments.length, messages = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
              messages[_key - 2] = arguments[_key];
            }
            return object2[methodName].apply(object2, messages);
          }
        }
        var DirectUploadController = function() {
          function DirectUploadController2(input2, file) {
            classCallCheck(this, DirectUploadController2);
            this.input = input2;
            this.file = file;
            this.directUpload = new DirectUpload2(this.file, this.url, this);
            this.dispatch("initialize");
          }
          createClass(DirectUploadController2, [{
            key: "start",
            value: function start3(callback) {
              var _this = this;
              var hiddenInput = document.createElement("input");
              hiddenInput.type = "hidden";
              hiddenInput.name = this.input.name;
              this.input.insertAdjacentElement("beforebegin", hiddenInput);
              this.dispatch("start");
              this.directUpload.create(function(error2, attributes2) {
                if (error2) {
                  hiddenInput.parentNode.removeChild(hiddenInput);
                  _this.dispatchError(error2);
                } else {
                  hiddenInput.value = attributes2.signed_id;
                }
                _this.dispatch("end");
                callback(error2);
              });
            }
          }, {
            key: "uploadRequestDidProgress",
            value: function uploadRequestDidProgress(event) {
              var progress = event.loaded / event.total * 100;
              if (progress) {
                this.dispatch("progress", {
                  progress
                });
              }
            }
          }, {
            key: "dispatch",
            value: function dispatch2(name) {
              var detail = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              detail.file = this.file;
              detail.id = this.directUpload.id;
              return dispatchEvent2(this.input, "direct-upload:" + name, {
                detail
              });
            }
          }, {
            key: "dispatchError",
            value: function dispatchError(error2) {
              var event = this.dispatch("error", {
                error: error2
              });
              if (!event.defaultPrevented) {
                alert(error2);
              }
            }
          }, {
            key: "directUploadWillCreateBlobWithXHR",
            value: function directUploadWillCreateBlobWithXHR(xhr) {
              this.dispatch("before-blob-request", {
                xhr
              });
            }
          }, {
            key: "directUploadWillStoreFileWithXHR",
            value: function directUploadWillStoreFileWithXHR(xhr) {
              var _this2 = this;
              this.dispatch("before-storage-request", {
                xhr
              });
              xhr.upload.addEventListener("progress", function(event) {
                return _this2.uploadRequestDidProgress(event);
              });
            }
          }, {
            key: "url",
            get: function get$$1() {
              return this.input.getAttribute("data-direct-upload-url");
            }
          }]);
          return DirectUploadController2;
        }();
        var inputSelector = "input[type=file][data-direct-upload-url]:not([disabled])";
        var DirectUploadsController = function() {
          function DirectUploadsController2(form) {
            classCallCheck(this, DirectUploadsController2);
            this.form = form;
            this.inputs = findElements(form, inputSelector).filter(function(input2) {
              return input2.files.length;
            });
          }
          createClass(DirectUploadsController2, [{
            key: "start",
            value: function start3(callback) {
              var _this = this;
              var controllers = this.createDirectUploadControllers();
              var startNextController = function startNextController2() {
                var controller = controllers.shift();
                if (controller) {
                  controller.start(function(error2) {
                    if (error2) {
                      callback(error2);
                      _this.dispatch("end");
                    } else {
                      startNextController2();
                    }
                  });
                } else {
                  callback();
                  _this.dispatch("end");
                }
              };
              this.dispatch("start");
              startNextController();
            }
          }, {
            key: "createDirectUploadControllers",
            value: function createDirectUploadControllers() {
              var controllers = [];
              this.inputs.forEach(function(input2) {
                toArray$1(input2.files).forEach(function(file) {
                  var controller = new DirectUploadController(input2, file);
                  controllers.push(controller);
                });
              });
              return controllers;
            }
          }, {
            key: "dispatch",
            value: function dispatch2(name) {
              var detail = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
              return dispatchEvent2(this.form, "direct-uploads:" + name, {
                detail
              });
            }
          }]);
          return DirectUploadsController2;
        }();
        var processingAttribute = "data-direct-uploads-processing";
        var submitButtonsByForm = /* @__PURE__ */ new WeakMap();
        var started = false;
        function start2() {
          if (!started) {
            started = true;
            document.addEventListener("click", didClick, true);
            document.addEventListener("submit", didSubmitForm);
            document.addEventListener("ajax:before", didSubmitRemoteElement);
          }
        }
        function didClick(event) {
          var target = event.target;
          if ((target.tagName == "INPUT" || target.tagName == "BUTTON") && target.type == "submit" && target.form) {
            submitButtonsByForm.set(target.form, target);
          }
        }
        function didSubmitForm(event) {
          handleFormSubmissionEvent(event);
        }
        function didSubmitRemoteElement(event) {
          if (event.target.tagName == "FORM") {
            handleFormSubmissionEvent(event);
          }
        }
        function handleFormSubmissionEvent(event) {
          var form = event.target;
          if (form.hasAttribute(processingAttribute)) {
            event.preventDefault();
            return;
          }
          var controller = new DirectUploadsController(form);
          var inputs = controller.inputs;
          if (inputs.length) {
            event.preventDefault();
            form.setAttribute(processingAttribute, "");
            inputs.forEach(disable);
            controller.start(function(error2) {
              form.removeAttribute(processingAttribute);
              if (error2) {
                inputs.forEach(enable);
              } else {
                submitForm(form);
              }
            });
          }
        }
        function submitForm(form) {
          var button = submitButtonsByForm.get(form) || findElement(form, "input[type=submit], button[type=submit]");
          if (button) {
            var _button = button, disabled = _button.disabled;
            button.disabled = false;
            button.focus();
            button.click();
            button.disabled = disabled;
          } else {
            button = document.createElement("input");
            button.type = "submit";
            button.style.display = "none";
            form.appendChild(button);
            button.click();
            form.removeChild(button);
          }
          submitButtonsByForm.delete(form);
        }
        function disable(input2) {
          input2.disabled = true;
        }
        function enable(input2) {
          input2.disabled = false;
        }
        function autostart() {
          if (window.ActiveStorage) {
            start2();
          }
        }
        setTimeout(autostart, 1);
        exports2.start = start2;
        exports2.DirectUpload = DirectUpload2;
        Object.defineProperty(exports2, "__esModule", {
          value: true
        });
      });
    }
  });

  // node_modules/@hotwired/stimulus/dist/stimulus.js
  var EventListener = class {
    constructor(eventTarget, eventName, eventOptions) {
      this.eventTarget = eventTarget;
      this.eventName = eventName;
      this.eventOptions = eventOptions;
      this.unorderedBindings = /* @__PURE__ */ new Set();
    }
    connect() {
      this.eventTarget.addEventListener(this.eventName, this, this.eventOptions);
    }
    disconnect() {
      this.eventTarget.removeEventListener(this.eventName, this, this.eventOptions);
    }
    bindingConnected(binding) {
      this.unorderedBindings.add(binding);
    }
    bindingDisconnected(binding) {
      this.unorderedBindings.delete(binding);
    }
    handleEvent(event) {
      const extendedEvent = extendEvent(event);
      for (const binding of this.bindings) {
        if (extendedEvent.immediatePropagationStopped) {
          break;
        } else {
          binding.handleEvent(extendedEvent);
        }
      }
    }
    get bindings() {
      return Array.from(this.unorderedBindings).sort((left, right) => {
        const leftIndex = left.index, rightIndex = right.index;
        return leftIndex < rightIndex ? -1 : leftIndex > rightIndex ? 1 : 0;
      });
    }
  };
  function extendEvent(event) {
    if ("immediatePropagationStopped" in event) {
      return event;
    } else {
      const { stopImmediatePropagation } = event;
      return Object.assign(event, {
        immediatePropagationStopped: false,
        stopImmediatePropagation() {
          this.immediatePropagationStopped = true;
          stopImmediatePropagation.call(this);
        }
      });
    }
  }
  var Dispatcher = class {
    constructor(application2) {
      this.application = application2;
      this.eventListenerMaps = /* @__PURE__ */ new Map();
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.eventListeners.forEach((eventListener) => eventListener.connect());
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.eventListeners.forEach((eventListener) => eventListener.disconnect());
      }
    }
    get eventListeners() {
      return Array.from(this.eventListenerMaps.values()).reduce((listeners, map) => listeners.concat(Array.from(map.values())), []);
    }
    bindingConnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingConnected(binding);
    }
    bindingDisconnected(binding) {
      this.fetchEventListenerForBinding(binding).bindingDisconnected(binding);
    }
    handleError(error2, message, detail = {}) {
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    fetchEventListenerForBinding(binding) {
      const { eventTarget, eventName, eventOptions } = binding;
      return this.fetchEventListener(eventTarget, eventName, eventOptions);
    }
    fetchEventListener(eventTarget, eventName, eventOptions) {
      const eventListenerMap = this.fetchEventListenerMapForEventTarget(eventTarget);
      const cacheKey = this.cacheKey(eventName, eventOptions);
      let eventListener = eventListenerMap.get(cacheKey);
      if (!eventListener) {
        eventListener = this.createEventListener(eventTarget, eventName, eventOptions);
        eventListenerMap.set(cacheKey, eventListener);
      }
      return eventListener;
    }
    createEventListener(eventTarget, eventName, eventOptions) {
      const eventListener = new EventListener(eventTarget, eventName, eventOptions);
      if (this.started) {
        eventListener.connect();
      }
      return eventListener;
    }
    fetchEventListenerMapForEventTarget(eventTarget) {
      let eventListenerMap = this.eventListenerMaps.get(eventTarget);
      if (!eventListenerMap) {
        eventListenerMap = /* @__PURE__ */ new Map();
        this.eventListenerMaps.set(eventTarget, eventListenerMap);
      }
      return eventListenerMap;
    }
    cacheKey(eventName, eventOptions) {
      const parts = [eventName];
      Object.keys(eventOptions).sort().forEach((key) => {
        parts.push(`${eventOptions[key] ? "" : "!"}${key}`);
      });
      return parts.join(":");
    }
  };
  var descriptorPattern = /^((.+?)(@(window|document))?->)?(.+?)(#([^:]+?))(:(.+))?$/;
  function parseActionDescriptorString(descriptorString) {
    const source = descriptorString.trim();
    const matches = source.match(descriptorPattern) || [];
    return {
      eventTarget: parseEventTarget(matches[4]),
      eventName: matches[2],
      eventOptions: matches[9] ? parseEventOptions(matches[9]) : {},
      identifier: matches[5],
      methodName: matches[7]
    };
  }
  function parseEventTarget(eventTargetName) {
    if (eventTargetName == "window") {
      return window;
    } else if (eventTargetName == "document") {
      return document;
    }
  }
  function parseEventOptions(eventOptions) {
    return eventOptions.split(":").reduce((options2, token) => Object.assign(options2, { [token.replace(/^!/, "")]: !/^!/.test(token) }), {});
  }
  function stringifyEventTarget(eventTarget) {
    if (eventTarget == window) {
      return "window";
    } else if (eventTarget == document) {
      return "document";
    }
  }
  function camelize(value) {
    return value.replace(/(?:[_-])([a-z0-9])/g, (_2, char) => char.toUpperCase());
  }
  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  function dasherize(value) {
    return value.replace(/([A-Z])/g, (_2, char) => `-${char.toLowerCase()}`);
  }
  function tokenize(value) {
    return value.match(/[^\s]+/g) || [];
  }
  var Action = class {
    constructor(element, index, descriptor) {
      this.element = element;
      this.index = index;
      this.eventTarget = descriptor.eventTarget || element;
      this.eventName = descriptor.eventName || getDefaultEventNameForElement(element) || error("missing event name");
      this.eventOptions = descriptor.eventOptions || {};
      this.identifier = descriptor.identifier || error("missing identifier");
      this.methodName = descriptor.methodName || error("missing method name");
    }
    static forToken(token) {
      return new this(token.element, token.index, parseActionDescriptorString(token.content));
    }
    toString() {
      const eventNameSuffix = this.eventTargetName ? `@${this.eventTargetName}` : "";
      return `${this.eventName}${eventNameSuffix}->${this.identifier}#${this.methodName}`;
    }
    get params() {
      if (this.eventTarget instanceof Element) {
        return this.getParamsFromEventTargetAttributes(this.eventTarget);
      } else {
        return {};
      }
    }
    getParamsFromEventTargetAttributes(eventTarget) {
      const params = {};
      const pattern = new RegExp(`^data-${this.identifier}-(.+)-param$`);
      const attributes2 = Array.from(eventTarget.attributes);
      attributes2.forEach(({ name, value }) => {
        const match2 = name.match(pattern);
        const key = match2 && match2[1];
        if (key) {
          Object.assign(params, { [camelize(key)]: typecast(value) });
        }
      });
      return params;
    }
    get eventTargetName() {
      return stringifyEventTarget(this.eventTarget);
    }
  };
  var defaultEventNames = {
    "a": (e) => "click",
    "button": (e) => "click",
    "form": (e) => "submit",
    "details": (e) => "toggle",
    "input": (e) => e.getAttribute("type") == "submit" ? "click" : "input",
    "select": (e) => "change",
    "textarea": (e) => "input"
  };
  function getDefaultEventNameForElement(element) {
    const tagName2 = element.tagName.toLowerCase();
    if (tagName2 in defaultEventNames) {
      return defaultEventNames[tagName2](element);
    }
  }
  function error(message) {
    throw new Error(message);
  }
  function typecast(value) {
    try {
      return JSON.parse(value);
    } catch (o_O) {
      return value;
    }
  }
  var Binding = class {
    constructor(context, action) {
      this.context = context;
      this.action = action;
    }
    get index() {
      return this.action.index;
    }
    get eventTarget() {
      return this.action.eventTarget;
    }
    get eventOptions() {
      return this.action.eventOptions;
    }
    get identifier() {
      return this.context.identifier;
    }
    handleEvent(event) {
      if (this.willBeInvokedByEvent(event)) {
        this.invokeWithEvent(event);
      }
    }
    get eventName() {
      return this.action.eventName;
    }
    get method() {
      const method = this.controller[this.methodName];
      if (typeof method == "function") {
        return method;
      }
      throw new Error(`Action "${this.action}" references undefined method "${this.methodName}"`);
    }
    invokeWithEvent(event) {
      const { target, currentTarget } = event;
      try {
        const { params } = this.action;
        const actionEvent = Object.assign(event, { params });
        this.method.call(this.controller, actionEvent);
        this.context.logDebugActivity(this.methodName, { event, target, currentTarget, action: this.methodName });
      } catch (error2) {
        const { identifier, controller, element, index } = this;
        const detail = { identifier, controller, element, index, event };
        this.context.handleError(error2, `invoking action "${this.action}"`, detail);
      }
    }
    willBeInvokedByEvent(event) {
      const eventTarget = event.target;
      if (this.element === eventTarget) {
        return true;
      } else if (eventTarget instanceof Element && this.element.contains(eventTarget)) {
        return this.scope.containsElement(eventTarget);
      } else {
        return this.scope.containsElement(this.action.element);
      }
    }
    get controller() {
      return this.context.controller;
    }
    get methodName() {
      return this.action.methodName;
    }
    get element() {
      return this.scope.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var ElementObserver = class {
    constructor(element, delegate) {
      this.mutationObserverInit = { attributes: true, childList: true, subtree: true };
      this.element = element;
      this.started = false;
      this.delegate = delegate;
      this.elements = /* @__PURE__ */ new Set();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.refresh();
      }
    }
    pause(callback) {
      if (this.started) {
        this.mutationObserver.disconnect();
        this.started = false;
      }
      callback();
      if (!this.started) {
        this.mutationObserver.observe(this.element, this.mutationObserverInit);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        const matches = new Set(this.matchElementsInTree());
        for (const element of Array.from(this.elements)) {
          if (!matches.has(element)) {
            this.removeElement(element);
          }
        }
        for (const element of Array.from(matches)) {
          this.addElement(element);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      if (mutation.type == "attributes") {
        this.processAttributeChange(mutation.target, mutation.attributeName);
      } else if (mutation.type == "childList") {
        this.processRemovedNodes(mutation.removedNodes);
        this.processAddedNodes(mutation.addedNodes);
      }
    }
    processAttributeChange(node, attributeName) {
      const element = node;
      if (this.elements.has(element)) {
        if (this.delegate.elementAttributeChanged && this.matchElement(element)) {
          this.delegate.elementAttributeChanged(element, attributeName);
        } else {
          this.removeElement(element);
        }
      } else if (this.matchElement(element)) {
        this.addElement(element);
      }
    }
    processRemovedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element) {
          this.processTree(element, this.removeElement);
        }
      }
    }
    processAddedNodes(nodes) {
      for (const node of Array.from(nodes)) {
        const element = this.elementFromNode(node);
        if (element && this.elementIsActive(element)) {
          this.processTree(element, this.addElement);
        }
      }
    }
    matchElement(element) {
      return this.delegate.matchElement(element);
    }
    matchElementsInTree(tree = this.element) {
      return this.delegate.matchElementsInTree(tree);
    }
    processTree(tree, processor) {
      for (const element of this.matchElementsInTree(tree)) {
        processor.call(this, element);
      }
    }
    elementFromNode(node) {
      if (node.nodeType == Node.ELEMENT_NODE) {
        return node;
      }
    }
    elementIsActive(element) {
      if (element.isConnected != this.element.isConnected) {
        return false;
      } else {
        return this.element.contains(element);
      }
    }
    addElement(element) {
      if (!this.elements.has(element)) {
        if (this.elementIsActive(element)) {
          this.elements.add(element);
          if (this.delegate.elementMatched) {
            this.delegate.elementMatched(element);
          }
        }
      }
    }
    removeElement(element) {
      if (this.elements.has(element)) {
        this.elements.delete(element);
        if (this.delegate.elementUnmatched) {
          this.delegate.elementUnmatched(element);
        }
      }
    }
  };
  var AttributeObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeName = attributeName;
      this.delegate = delegate;
      this.elementObserver = new ElementObserver(element, this);
    }
    get element() {
      return this.elementObserver.element;
    }
    get selector() {
      return `[${this.attributeName}]`;
    }
    start() {
      this.elementObserver.start();
    }
    pause(callback) {
      this.elementObserver.pause(callback);
    }
    stop() {
      this.elementObserver.stop();
    }
    refresh() {
      this.elementObserver.refresh();
    }
    get started() {
      return this.elementObserver.started;
    }
    matchElement(element) {
      return element.hasAttribute(this.attributeName);
    }
    matchElementsInTree(tree) {
      const match2 = this.matchElement(tree) ? [tree] : [];
      const matches = Array.from(tree.querySelectorAll(this.selector));
      return match2.concat(matches);
    }
    elementMatched(element) {
      if (this.delegate.elementMatchedAttribute) {
        this.delegate.elementMatchedAttribute(element, this.attributeName);
      }
    }
    elementUnmatched(element) {
      if (this.delegate.elementUnmatchedAttribute) {
        this.delegate.elementUnmatchedAttribute(element, this.attributeName);
      }
    }
    elementAttributeChanged(element, attributeName) {
      if (this.delegate.elementAttributeValueChanged && this.attributeName == attributeName) {
        this.delegate.elementAttributeValueChanged(element, attributeName);
      }
    }
  };
  var StringMapObserver = class {
    constructor(element, delegate) {
      this.element = element;
      this.delegate = delegate;
      this.started = false;
      this.stringMap = /* @__PURE__ */ new Map();
      this.mutationObserver = new MutationObserver((mutations) => this.processMutations(mutations));
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.mutationObserver.observe(this.element, { attributes: true, attributeOldValue: true });
        this.refresh();
      }
    }
    stop() {
      if (this.started) {
        this.mutationObserver.takeRecords();
        this.mutationObserver.disconnect();
        this.started = false;
      }
    }
    refresh() {
      if (this.started) {
        for (const attributeName of this.knownAttributeNames) {
          this.refreshAttribute(attributeName, null);
        }
      }
    }
    processMutations(mutations) {
      if (this.started) {
        for (const mutation of mutations) {
          this.processMutation(mutation);
        }
      }
    }
    processMutation(mutation) {
      const attributeName = mutation.attributeName;
      if (attributeName) {
        this.refreshAttribute(attributeName, mutation.oldValue);
      }
    }
    refreshAttribute(attributeName, oldValue) {
      const key = this.delegate.getStringMapKeyForAttribute(attributeName);
      if (key != null) {
        if (!this.stringMap.has(attributeName)) {
          this.stringMapKeyAdded(key, attributeName);
        }
        const value = this.element.getAttribute(attributeName);
        if (this.stringMap.get(attributeName) != value) {
          this.stringMapValueChanged(value, key, oldValue);
        }
        if (value == null) {
          const oldValue2 = this.stringMap.get(attributeName);
          this.stringMap.delete(attributeName);
          if (oldValue2)
            this.stringMapKeyRemoved(key, attributeName, oldValue2);
        } else {
          this.stringMap.set(attributeName, value);
        }
      }
    }
    stringMapKeyAdded(key, attributeName) {
      if (this.delegate.stringMapKeyAdded) {
        this.delegate.stringMapKeyAdded(key, attributeName);
      }
    }
    stringMapValueChanged(value, key, oldValue) {
      if (this.delegate.stringMapValueChanged) {
        this.delegate.stringMapValueChanged(value, key, oldValue);
      }
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      if (this.delegate.stringMapKeyRemoved) {
        this.delegate.stringMapKeyRemoved(key, attributeName, oldValue);
      }
    }
    get knownAttributeNames() {
      return Array.from(new Set(this.currentAttributeNames.concat(this.recordedAttributeNames)));
    }
    get currentAttributeNames() {
      return Array.from(this.element.attributes).map((attribute) => attribute.name);
    }
    get recordedAttributeNames() {
      return Array.from(this.stringMap.keys());
    }
  };
  function add(map, key, value) {
    fetch2(map, key).add(value);
  }
  function del(map, key, value) {
    fetch2(map, key).delete(value);
    prune(map, key);
  }
  function fetch2(map, key) {
    let values = map.get(key);
    if (!values) {
      values = /* @__PURE__ */ new Set();
      map.set(key, values);
    }
    return values;
  }
  function prune(map, key) {
    const values = map.get(key);
    if (values != null && values.size == 0) {
      map.delete(key);
    }
  }
  var Multimap = class {
    constructor() {
      this.valuesByKey = /* @__PURE__ */ new Map();
    }
    get keys() {
      return Array.from(this.valuesByKey.keys());
    }
    get values() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((values, set) => values.concat(Array.from(set)), []);
    }
    get size() {
      const sets = Array.from(this.valuesByKey.values());
      return sets.reduce((size, set) => size + set.size, 0);
    }
    add(key, value) {
      add(this.valuesByKey, key, value);
    }
    delete(key, value) {
      del(this.valuesByKey, key, value);
    }
    has(key, value) {
      const values = this.valuesByKey.get(key);
      return values != null && values.has(value);
    }
    hasKey(key) {
      return this.valuesByKey.has(key);
    }
    hasValue(value) {
      const sets = Array.from(this.valuesByKey.values());
      return sets.some((set) => set.has(value));
    }
    getValuesForKey(key) {
      const values = this.valuesByKey.get(key);
      return values ? Array.from(values) : [];
    }
    getKeysForValue(value) {
      return Array.from(this.valuesByKey).filter(([key, values]) => values.has(value)).map(([key, values]) => key);
    }
  };
  var TokenListObserver = class {
    constructor(element, attributeName, delegate) {
      this.attributeObserver = new AttributeObserver(element, attributeName, this);
      this.delegate = delegate;
      this.tokensByElement = new Multimap();
    }
    get started() {
      return this.attributeObserver.started;
    }
    start() {
      this.attributeObserver.start();
    }
    pause(callback) {
      this.attributeObserver.pause(callback);
    }
    stop() {
      this.attributeObserver.stop();
    }
    refresh() {
      this.attributeObserver.refresh();
    }
    get element() {
      return this.attributeObserver.element;
    }
    get attributeName() {
      return this.attributeObserver.attributeName;
    }
    elementMatchedAttribute(element) {
      this.tokensMatched(this.readTokensForElement(element));
    }
    elementAttributeValueChanged(element) {
      const [unmatchedTokens, matchedTokens] = this.refreshTokensForElement(element);
      this.tokensUnmatched(unmatchedTokens);
      this.tokensMatched(matchedTokens);
    }
    elementUnmatchedAttribute(element) {
      this.tokensUnmatched(this.tokensByElement.getValuesForKey(element));
    }
    tokensMatched(tokens) {
      tokens.forEach((token) => this.tokenMatched(token));
    }
    tokensUnmatched(tokens) {
      tokens.forEach((token) => this.tokenUnmatched(token));
    }
    tokenMatched(token) {
      this.delegate.tokenMatched(token);
      this.tokensByElement.add(token.element, token);
    }
    tokenUnmatched(token) {
      this.delegate.tokenUnmatched(token);
      this.tokensByElement.delete(token.element, token);
    }
    refreshTokensForElement(element) {
      const previousTokens = this.tokensByElement.getValuesForKey(element);
      const currentTokens = this.readTokensForElement(element);
      const firstDifferingIndex = zip(previousTokens, currentTokens).findIndex(([previousToken, currentToken]) => !tokensAreEqual(previousToken, currentToken));
      if (firstDifferingIndex == -1) {
        return [[], []];
      } else {
        return [previousTokens.slice(firstDifferingIndex), currentTokens.slice(firstDifferingIndex)];
      }
    }
    readTokensForElement(element) {
      const attributeName = this.attributeName;
      const tokenString = element.getAttribute(attributeName) || "";
      return parseTokenString(tokenString, element, attributeName);
    }
  };
  function parseTokenString(tokenString, element, attributeName) {
    return tokenString.trim().split(/\s+/).filter((content) => content.length).map((content, index) => ({ element, attributeName, content, index }));
  }
  function zip(left, right) {
    const length = Math.max(left.length, right.length);
    return Array.from({ length }, (_2, index) => [left[index], right[index]]);
  }
  function tokensAreEqual(left, right) {
    return left && right && left.index == right.index && left.content == right.content;
  }
  var ValueListObserver = class {
    constructor(element, attributeName, delegate) {
      this.tokenListObserver = new TokenListObserver(element, attributeName, this);
      this.delegate = delegate;
      this.parseResultsByToken = /* @__PURE__ */ new WeakMap();
      this.valuesByTokenByElement = /* @__PURE__ */ new WeakMap();
    }
    get started() {
      return this.tokenListObserver.started;
    }
    start() {
      this.tokenListObserver.start();
    }
    stop() {
      this.tokenListObserver.stop();
    }
    refresh() {
      this.tokenListObserver.refresh();
    }
    get element() {
      return this.tokenListObserver.element;
    }
    get attributeName() {
      return this.tokenListObserver.attributeName;
    }
    tokenMatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).set(token, value);
        this.delegate.elementMatchedValue(element, value);
      }
    }
    tokenUnmatched(token) {
      const { element } = token;
      const { value } = this.fetchParseResultForToken(token);
      if (value) {
        this.fetchValuesByTokenForElement(element).delete(token);
        this.delegate.elementUnmatchedValue(element, value);
      }
    }
    fetchParseResultForToken(token) {
      let parseResult = this.parseResultsByToken.get(token);
      if (!parseResult) {
        parseResult = this.parseToken(token);
        this.parseResultsByToken.set(token, parseResult);
      }
      return parseResult;
    }
    fetchValuesByTokenForElement(element) {
      let valuesByToken = this.valuesByTokenByElement.get(element);
      if (!valuesByToken) {
        valuesByToken = /* @__PURE__ */ new Map();
        this.valuesByTokenByElement.set(element, valuesByToken);
      }
      return valuesByToken;
    }
    parseToken(token) {
      try {
        const value = this.delegate.parseValueForToken(token);
        return { value };
      } catch (error2) {
        return { error: error2 };
      }
    }
  };
  var BindingObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.bindingsByAction = /* @__PURE__ */ new Map();
    }
    start() {
      if (!this.valueListObserver) {
        this.valueListObserver = new ValueListObserver(this.element, this.actionAttribute, this);
        this.valueListObserver.start();
      }
    }
    stop() {
      if (this.valueListObserver) {
        this.valueListObserver.stop();
        delete this.valueListObserver;
        this.disconnectAllActions();
      }
    }
    get element() {
      return this.context.element;
    }
    get identifier() {
      return this.context.identifier;
    }
    get actionAttribute() {
      return this.schema.actionAttribute;
    }
    get schema() {
      return this.context.schema;
    }
    get bindings() {
      return Array.from(this.bindingsByAction.values());
    }
    connectAction(action) {
      const binding = new Binding(this.context, action);
      this.bindingsByAction.set(action, binding);
      this.delegate.bindingConnected(binding);
    }
    disconnectAction(action) {
      const binding = this.bindingsByAction.get(action);
      if (binding) {
        this.bindingsByAction.delete(action);
        this.delegate.bindingDisconnected(binding);
      }
    }
    disconnectAllActions() {
      this.bindings.forEach((binding) => this.delegate.bindingDisconnected(binding));
      this.bindingsByAction.clear();
    }
    parseValueForToken(token) {
      const action = Action.forToken(token);
      if (action.identifier == this.identifier) {
        return action;
      }
    }
    elementMatchedValue(element, action) {
      this.connectAction(action);
    }
    elementUnmatchedValue(element, action) {
      this.disconnectAction(action);
    }
  };
  var ValueObserver = class {
    constructor(context, receiver) {
      this.context = context;
      this.receiver = receiver;
      this.stringMapObserver = new StringMapObserver(this.element, this);
      this.valueDescriptorMap = this.controller.valueDescriptorMap;
      this.invokeChangedCallbacksForDefaultValues();
    }
    start() {
      this.stringMapObserver.start();
    }
    stop() {
      this.stringMapObserver.stop();
    }
    get element() {
      return this.context.element;
    }
    get controller() {
      return this.context.controller;
    }
    getStringMapKeyForAttribute(attributeName) {
      if (attributeName in this.valueDescriptorMap) {
        return this.valueDescriptorMap[attributeName].name;
      }
    }
    stringMapKeyAdded(key, attributeName) {
      const descriptor = this.valueDescriptorMap[attributeName];
      if (!this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), descriptor.writer(descriptor.defaultValue));
      }
    }
    stringMapValueChanged(value, name, oldValue) {
      const descriptor = this.valueDescriptorNameMap[name];
      if (value === null)
        return;
      if (oldValue === null) {
        oldValue = descriptor.writer(descriptor.defaultValue);
      }
      this.invokeChangedCallback(name, value, oldValue);
    }
    stringMapKeyRemoved(key, attributeName, oldValue) {
      const descriptor = this.valueDescriptorNameMap[key];
      if (this.hasValue(key)) {
        this.invokeChangedCallback(key, descriptor.writer(this.receiver[key]), oldValue);
      } else {
        this.invokeChangedCallback(key, descriptor.writer(descriptor.defaultValue), oldValue);
      }
    }
    invokeChangedCallbacksForDefaultValues() {
      for (const { key, name, defaultValue, writer } of this.valueDescriptors) {
        if (defaultValue != void 0 && !this.controller.data.has(key)) {
          this.invokeChangedCallback(name, writer(defaultValue), void 0);
        }
      }
    }
    invokeChangedCallback(name, rawValue, rawOldValue) {
      const changedMethodName = `${name}Changed`;
      const changedMethod = this.receiver[changedMethodName];
      if (typeof changedMethod == "function") {
        const descriptor = this.valueDescriptorNameMap[name];
        const value = descriptor.reader(rawValue);
        let oldValue = rawOldValue;
        if (rawOldValue) {
          oldValue = descriptor.reader(rawOldValue);
        }
        changedMethod.call(this.receiver, value, oldValue);
      }
    }
    get valueDescriptors() {
      const { valueDescriptorMap } = this;
      return Object.keys(valueDescriptorMap).map((key) => valueDescriptorMap[key]);
    }
    get valueDescriptorNameMap() {
      const descriptors = {};
      Object.keys(this.valueDescriptorMap).forEach((key) => {
        const descriptor = this.valueDescriptorMap[key];
        descriptors[descriptor.name] = descriptor;
      });
      return descriptors;
    }
    hasValue(attributeName) {
      const descriptor = this.valueDescriptorNameMap[attributeName];
      const hasMethodName = `has${capitalize(descriptor.name)}`;
      return this.receiver[hasMethodName];
    }
  };
  var TargetObserver = class {
    constructor(context, delegate) {
      this.context = context;
      this.delegate = delegate;
      this.targetsByName = new Multimap();
    }
    start() {
      if (!this.tokenListObserver) {
        this.tokenListObserver = new TokenListObserver(this.element, this.attributeName, this);
        this.tokenListObserver.start();
      }
    }
    stop() {
      if (this.tokenListObserver) {
        this.disconnectAllTargets();
        this.tokenListObserver.stop();
        delete this.tokenListObserver;
      }
    }
    tokenMatched({ element, content: name }) {
      if (this.scope.containsElement(element)) {
        this.connectTarget(element, name);
      }
    }
    tokenUnmatched({ element, content: name }) {
      this.disconnectTarget(element, name);
    }
    connectTarget(element, name) {
      var _a;
      if (!this.targetsByName.has(name, element)) {
        this.targetsByName.add(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetConnected(element, name));
      }
    }
    disconnectTarget(element, name) {
      var _a;
      if (this.targetsByName.has(name, element)) {
        this.targetsByName.delete(name, element);
        (_a = this.tokenListObserver) === null || _a === void 0 ? void 0 : _a.pause(() => this.delegate.targetDisconnected(element, name));
      }
    }
    disconnectAllTargets() {
      for (const name of this.targetsByName.keys) {
        for (const element of this.targetsByName.getValuesForKey(name)) {
          this.disconnectTarget(element, name);
        }
      }
    }
    get attributeName() {
      return `data-${this.context.identifier}-target`;
    }
    get element() {
      return this.context.element;
    }
    get scope() {
      return this.context.scope;
    }
  };
  var Context = class {
    constructor(module, scope) {
      this.logDebugActivity = (functionName, detail = {}) => {
        const { identifier, controller, element } = this;
        detail = Object.assign({ identifier, controller, element }, detail);
        this.application.logDebugActivity(this.identifier, functionName, detail);
      };
      this.module = module;
      this.scope = scope;
      this.controller = new module.controllerConstructor(this);
      this.bindingObserver = new BindingObserver(this, this.dispatcher);
      this.valueObserver = new ValueObserver(this, this.controller);
      this.targetObserver = new TargetObserver(this, this);
      try {
        this.controller.initialize();
        this.logDebugActivity("initialize");
      } catch (error2) {
        this.handleError(error2, "initializing controller");
      }
    }
    connect() {
      this.bindingObserver.start();
      this.valueObserver.start();
      this.targetObserver.start();
      try {
        this.controller.connect();
        this.logDebugActivity("connect");
      } catch (error2) {
        this.handleError(error2, "connecting controller");
      }
    }
    disconnect() {
      try {
        this.controller.disconnect();
        this.logDebugActivity("disconnect");
      } catch (error2) {
        this.handleError(error2, "disconnecting controller");
      }
      this.targetObserver.stop();
      this.valueObserver.stop();
      this.bindingObserver.stop();
    }
    get application() {
      return this.module.application;
    }
    get identifier() {
      return this.module.identifier;
    }
    get schema() {
      return this.application.schema;
    }
    get dispatcher() {
      return this.application.dispatcher;
    }
    get element() {
      return this.scope.element;
    }
    get parentElement() {
      return this.element.parentElement;
    }
    handleError(error2, message, detail = {}) {
      const { identifier, controller, element } = this;
      detail = Object.assign({ identifier, controller, element }, detail);
      this.application.handleError(error2, `Error ${message}`, detail);
    }
    targetConnected(element, name) {
      this.invokeControllerMethod(`${name}TargetConnected`, element);
    }
    targetDisconnected(element, name) {
      this.invokeControllerMethod(`${name}TargetDisconnected`, element);
    }
    invokeControllerMethod(methodName, ...args) {
      const controller = this.controller;
      if (typeof controller[methodName] == "function") {
        controller[methodName](...args);
      }
    }
  };
  function readInheritableStaticArrayValues(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return Array.from(ancestors.reduce((values, constructor2) => {
      getOwnStaticArrayValues(constructor2, propertyName).forEach((name) => values.add(name));
      return values;
    }, /* @__PURE__ */ new Set()));
  }
  function readInheritableStaticObjectPairs(constructor, propertyName) {
    const ancestors = getAncestorsForConstructor(constructor);
    return ancestors.reduce((pairs, constructor2) => {
      pairs.push(...getOwnStaticObjectPairs(constructor2, propertyName));
      return pairs;
    }, []);
  }
  function getAncestorsForConstructor(constructor) {
    const ancestors = [];
    while (constructor) {
      ancestors.push(constructor);
      constructor = Object.getPrototypeOf(constructor);
    }
    return ancestors.reverse();
  }
  function getOwnStaticArrayValues(constructor, propertyName) {
    const definition = constructor[propertyName];
    return Array.isArray(definition) ? definition : [];
  }
  function getOwnStaticObjectPairs(constructor, propertyName) {
    const definition = constructor[propertyName];
    return definition ? Object.keys(definition).map((key) => [key, definition[key]]) : [];
  }
  function bless(constructor) {
    return shadow(constructor, getBlessedProperties(constructor));
  }
  function shadow(constructor, properties) {
    const shadowConstructor = extend(constructor);
    const shadowProperties = getShadowProperties(constructor.prototype, properties);
    Object.defineProperties(shadowConstructor.prototype, shadowProperties);
    return shadowConstructor;
  }
  function getBlessedProperties(constructor) {
    const blessings = readInheritableStaticArrayValues(constructor, "blessings");
    return blessings.reduce((blessedProperties, blessing) => {
      const properties = blessing(constructor);
      for (const key in properties) {
        const descriptor = blessedProperties[key] || {};
        blessedProperties[key] = Object.assign(descriptor, properties[key]);
      }
      return blessedProperties;
    }, {});
  }
  function getShadowProperties(prototype, properties) {
    return getOwnKeys(properties).reduce((shadowProperties, key) => {
      const descriptor = getShadowedDescriptor(prototype, properties, key);
      if (descriptor) {
        Object.assign(shadowProperties, { [key]: descriptor });
      }
      return shadowProperties;
    }, {});
  }
  function getShadowedDescriptor(prototype, properties, key) {
    const shadowingDescriptor = Object.getOwnPropertyDescriptor(prototype, key);
    const shadowedByValue = shadowingDescriptor && "value" in shadowingDescriptor;
    if (!shadowedByValue) {
      const descriptor = Object.getOwnPropertyDescriptor(properties, key).value;
      if (shadowingDescriptor) {
        descriptor.get = shadowingDescriptor.get || descriptor.get;
        descriptor.set = shadowingDescriptor.set || descriptor.set;
      }
      return descriptor;
    }
  }
  var getOwnKeys = (() => {
    if (typeof Object.getOwnPropertySymbols == "function") {
      return (object2) => [
        ...Object.getOwnPropertyNames(object2),
        ...Object.getOwnPropertySymbols(object2)
      ];
    } else {
      return Object.getOwnPropertyNames;
    }
  })();
  var extend = (() => {
    function extendWithReflect(constructor) {
      function extended() {
        return Reflect.construct(constructor, arguments, new.target);
      }
      extended.prototype = Object.create(constructor.prototype, {
        constructor: { value: extended }
      });
      Reflect.setPrototypeOf(extended, constructor);
      return extended;
    }
    function testReflectExtension() {
      const a = function() {
        this.a.call(this);
      };
      const b = extendWithReflect(a);
      b.prototype.a = function() {
      };
      return new b();
    }
    try {
      testReflectExtension();
      return extendWithReflect;
    } catch (error2) {
      return (constructor) => class extended extends constructor {
      };
    }
  })();
  function blessDefinition(definition) {
    return {
      identifier: definition.identifier,
      controllerConstructor: bless(definition.controllerConstructor)
    };
  }
  var Module = class {
    constructor(application2, definition) {
      this.application = application2;
      this.definition = blessDefinition(definition);
      this.contextsByScope = /* @__PURE__ */ new WeakMap();
      this.connectedContexts = /* @__PURE__ */ new Set();
    }
    get identifier() {
      return this.definition.identifier;
    }
    get controllerConstructor() {
      return this.definition.controllerConstructor;
    }
    get contexts() {
      return Array.from(this.connectedContexts);
    }
    connectContextForScope(scope) {
      const context = this.fetchContextForScope(scope);
      this.connectedContexts.add(context);
      context.connect();
    }
    disconnectContextForScope(scope) {
      const context = this.contextsByScope.get(scope);
      if (context) {
        this.connectedContexts.delete(context);
        context.disconnect();
      }
    }
    fetchContextForScope(scope) {
      let context = this.contextsByScope.get(scope);
      if (!context) {
        context = new Context(this, scope);
        this.contextsByScope.set(scope, context);
      }
      return context;
    }
  };
  var ClassMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    has(name) {
      return this.data.has(this.getDataKey(name));
    }
    get(name) {
      return this.getAll(name)[0];
    }
    getAll(name) {
      const tokenString = this.data.get(this.getDataKey(name)) || "";
      return tokenize(tokenString);
    }
    getAttributeName(name) {
      return this.data.getAttributeNameForKey(this.getDataKey(name));
    }
    getDataKey(name) {
      return `${name}-class`;
    }
    get data() {
      return this.scope.data;
    }
  };
  var DataMap = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.getAttribute(name);
    }
    set(key, value) {
      const name = this.getAttributeNameForKey(key);
      this.element.setAttribute(name, value);
      return this.get(key);
    }
    has(key) {
      const name = this.getAttributeNameForKey(key);
      return this.element.hasAttribute(name);
    }
    delete(key) {
      if (this.has(key)) {
        const name = this.getAttributeNameForKey(key);
        this.element.removeAttribute(name);
        return true;
      } else {
        return false;
      }
    }
    getAttributeNameForKey(key) {
      return `data-${this.identifier}-${dasherize(key)}`;
    }
  };
  var Guide = class {
    constructor(logger) {
      this.warnedKeysByObject = /* @__PURE__ */ new WeakMap();
      this.logger = logger;
    }
    warn(object2, key, message) {
      let warnedKeys = this.warnedKeysByObject.get(object2);
      if (!warnedKeys) {
        warnedKeys = /* @__PURE__ */ new Set();
        this.warnedKeysByObject.set(object2, warnedKeys);
      }
      if (!warnedKeys.has(key)) {
        warnedKeys.add(key);
        this.logger.warn(message, object2);
      }
    }
  };
  function attributeValueContainsToken(attributeName, token) {
    return `[${attributeName}~="${token}"]`;
  }
  var TargetSet = class {
    constructor(scope) {
      this.scope = scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get schema() {
      return this.scope.schema;
    }
    has(targetName) {
      return this.find(targetName) != null;
    }
    find(...targetNames) {
      return targetNames.reduce((target, targetName) => target || this.findTarget(targetName) || this.findLegacyTarget(targetName), void 0);
    }
    findAll(...targetNames) {
      return targetNames.reduce((targets, targetName) => [
        ...targets,
        ...this.findAllTargets(targetName),
        ...this.findAllLegacyTargets(targetName)
      ], []);
    }
    findTarget(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findElement(selector);
    }
    findAllTargets(targetName) {
      const selector = this.getSelectorForTargetName(targetName);
      return this.scope.findAllElements(selector);
    }
    getSelectorForTargetName(targetName) {
      const attributeName = this.schema.targetAttributeForScope(this.identifier);
      return attributeValueContainsToken(attributeName, targetName);
    }
    findLegacyTarget(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.deprecate(this.scope.findElement(selector), targetName);
    }
    findAllLegacyTargets(targetName) {
      const selector = this.getLegacySelectorForTargetName(targetName);
      return this.scope.findAllElements(selector).map((element) => this.deprecate(element, targetName));
    }
    getLegacySelectorForTargetName(targetName) {
      const targetDescriptor = `${this.identifier}.${targetName}`;
      return attributeValueContainsToken(this.schema.targetAttribute, targetDescriptor);
    }
    deprecate(element, targetName) {
      if (element) {
        const { identifier } = this;
        const attributeName = this.schema.targetAttribute;
        const revisedAttributeName = this.schema.targetAttributeForScope(identifier);
        this.guide.warn(element, `target:${targetName}`, `Please replace ${attributeName}="${identifier}.${targetName}" with ${revisedAttributeName}="${targetName}". The ${attributeName} attribute is deprecated and will be removed in a future version of Stimulus.`);
      }
      return element;
    }
    get guide() {
      return this.scope.guide;
    }
  };
  var Scope = class {
    constructor(schema, element, identifier, logger) {
      this.targets = new TargetSet(this);
      this.classes = new ClassMap(this);
      this.data = new DataMap(this);
      this.containsElement = (element2) => {
        return element2.closest(this.controllerSelector) === this.element;
      };
      this.schema = schema;
      this.element = element;
      this.identifier = identifier;
      this.guide = new Guide(logger);
    }
    findElement(selector) {
      return this.element.matches(selector) ? this.element : this.queryElements(selector).find(this.containsElement);
    }
    findAllElements(selector) {
      return [
        ...this.element.matches(selector) ? [this.element] : [],
        ...this.queryElements(selector).filter(this.containsElement)
      ];
    }
    queryElements(selector) {
      return Array.from(this.element.querySelectorAll(selector));
    }
    get controllerSelector() {
      return attributeValueContainsToken(this.schema.controllerAttribute, this.identifier);
    }
  };
  var ScopeObserver = class {
    constructor(element, schema, delegate) {
      this.element = element;
      this.schema = schema;
      this.delegate = delegate;
      this.valueListObserver = new ValueListObserver(this.element, this.controllerAttribute, this);
      this.scopesByIdentifierByElement = /* @__PURE__ */ new WeakMap();
      this.scopeReferenceCounts = /* @__PURE__ */ new WeakMap();
    }
    start() {
      this.valueListObserver.start();
    }
    stop() {
      this.valueListObserver.stop();
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    parseValueForToken(token) {
      const { element, content: identifier } = token;
      const scopesByIdentifier = this.fetchScopesByIdentifierForElement(element);
      let scope = scopesByIdentifier.get(identifier);
      if (!scope) {
        scope = this.delegate.createScopeForElementAndIdentifier(element, identifier);
        scopesByIdentifier.set(identifier, scope);
      }
      return scope;
    }
    elementMatchedValue(element, value) {
      const referenceCount = (this.scopeReferenceCounts.get(value) || 0) + 1;
      this.scopeReferenceCounts.set(value, referenceCount);
      if (referenceCount == 1) {
        this.delegate.scopeConnected(value);
      }
    }
    elementUnmatchedValue(element, value) {
      const referenceCount = this.scopeReferenceCounts.get(value);
      if (referenceCount) {
        this.scopeReferenceCounts.set(value, referenceCount - 1);
        if (referenceCount == 1) {
          this.delegate.scopeDisconnected(value);
        }
      }
    }
    fetchScopesByIdentifierForElement(element) {
      let scopesByIdentifier = this.scopesByIdentifierByElement.get(element);
      if (!scopesByIdentifier) {
        scopesByIdentifier = /* @__PURE__ */ new Map();
        this.scopesByIdentifierByElement.set(element, scopesByIdentifier);
      }
      return scopesByIdentifier;
    }
  };
  var Router = class {
    constructor(application2) {
      this.application = application2;
      this.scopeObserver = new ScopeObserver(this.element, this.schema, this);
      this.scopesByIdentifier = new Multimap();
      this.modulesByIdentifier = /* @__PURE__ */ new Map();
    }
    get element() {
      return this.application.element;
    }
    get schema() {
      return this.application.schema;
    }
    get logger() {
      return this.application.logger;
    }
    get controllerAttribute() {
      return this.schema.controllerAttribute;
    }
    get modules() {
      return Array.from(this.modulesByIdentifier.values());
    }
    get contexts() {
      return this.modules.reduce((contexts, module) => contexts.concat(module.contexts), []);
    }
    start() {
      this.scopeObserver.start();
    }
    stop() {
      this.scopeObserver.stop();
    }
    loadDefinition(definition) {
      this.unloadIdentifier(definition.identifier);
      const module = new Module(this.application, definition);
      this.connectModule(module);
    }
    unloadIdentifier(identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        this.disconnectModule(module);
      }
    }
    getContextForElementAndIdentifier(element, identifier) {
      const module = this.modulesByIdentifier.get(identifier);
      if (module) {
        return module.contexts.find((context) => context.element == element);
      }
    }
    handleError(error2, message, detail) {
      this.application.handleError(error2, message, detail);
    }
    createScopeForElementAndIdentifier(element, identifier) {
      return new Scope(this.schema, element, identifier, this.logger);
    }
    scopeConnected(scope) {
      this.scopesByIdentifier.add(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.connectContextForScope(scope);
      }
    }
    scopeDisconnected(scope) {
      this.scopesByIdentifier.delete(scope.identifier, scope);
      const module = this.modulesByIdentifier.get(scope.identifier);
      if (module) {
        module.disconnectContextForScope(scope);
      }
    }
    connectModule(module) {
      this.modulesByIdentifier.set(module.identifier, module);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.connectContextForScope(scope));
    }
    disconnectModule(module) {
      this.modulesByIdentifier.delete(module.identifier);
      const scopes = this.scopesByIdentifier.getValuesForKey(module.identifier);
      scopes.forEach((scope) => module.disconnectContextForScope(scope));
    }
  };
  var defaultSchema = {
    controllerAttribute: "data-controller",
    actionAttribute: "data-action",
    targetAttribute: "data-target",
    targetAttributeForScope: (identifier) => `data-${identifier}-target`
  };
  var Application = class {
    constructor(element = document.documentElement, schema = defaultSchema) {
      this.logger = console;
      this.debug = false;
      this.logDebugActivity = (identifier, functionName, detail = {}) => {
        if (this.debug) {
          this.logFormattedMessage(identifier, functionName, detail);
        }
      };
      this.element = element;
      this.schema = schema;
      this.dispatcher = new Dispatcher(this);
      this.router = new Router(this);
    }
    static start(element, schema) {
      const application2 = new Application(element, schema);
      application2.start();
      return application2;
    }
    async start() {
      await domReady();
      this.logDebugActivity("application", "starting");
      this.dispatcher.start();
      this.router.start();
      this.logDebugActivity("application", "start");
    }
    stop() {
      this.logDebugActivity("application", "stopping");
      this.dispatcher.stop();
      this.router.stop();
      this.logDebugActivity("application", "stop");
    }
    register(identifier, controllerConstructor) {
      if (controllerConstructor.shouldLoad) {
        this.load({ identifier, controllerConstructor });
      }
    }
    load(head, ...rest) {
      const definitions = Array.isArray(head) ? head : [head, ...rest];
      definitions.forEach((definition) => this.router.loadDefinition(definition));
    }
    unload(head, ...rest) {
      const identifiers = Array.isArray(head) ? head : [head, ...rest];
      identifiers.forEach((identifier) => this.router.unloadIdentifier(identifier));
    }
    get controllers() {
      return this.router.contexts.map((context) => context.controller);
    }
    getControllerForElementAndIdentifier(element, identifier) {
      const context = this.router.getContextForElementAndIdentifier(element, identifier);
      return context ? context.controller : null;
    }
    handleError(error2, message, detail) {
      var _a;
      this.logger.error(`%s

%o

%o`, message, error2, detail);
      (_a = window.onerror) === null || _a === void 0 ? void 0 : _a.call(window, message, "", 0, 0, error2);
    }
    logFormattedMessage(identifier, functionName, detail = {}) {
      detail = Object.assign({ application: this }, detail);
      this.logger.groupCollapsed(`${identifier} #${functionName}`);
      this.logger.log("details:", Object.assign({}, detail));
      this.logger.groupEnd();
    }
  };
  function domReady() {
    return new Promise((resolve) => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", () => resolve());
      } else {
        resolve();
      }
    });
  }
  function ClassPropertiesBlessing(constructor) {
    const classes = readInheritableStaticArrayValues(constructor, "classes");
    return classes.reduce((properties, classDefinition) => {
      return Object.assign(properties, propertiesForClassDefinition(classDefinition));
    }, {});
  }
  function propertiesForClassDefinition(key) {
    return {
      [`${key}Class`]: {
        get() {
          const { classes } = this;
          if (classes.has(key)) {
            return classes.get(key);
          } else {
            const attribute = classes.getAttributeName(key);
            throw new Error(`Missing attribute "${attribute}"`);
          }
        }
      },
      [`${key}Classes`]: {
        get() {
          return this.classes.getAll(key);
        }
      },
      [`has${capitalize(key)}Class`]: {
        get() {
          return this.classes.has(key);
        }
      }
    };
  }
  function TargetPropertiesBlessing(constructor) {
    const targets = readInheritableStaticArrayValues(constructor, "targets");
    return targets.reduce((properties, targetDefinition) => {
      return Object.assign(properties, propertiesForTargetDefinition(targetDefinition));
    }, {});
  }
  function propertiesForTargetDefinition(name) {
    return {
      [`${name}Target`]: {
        get() {
          const target = this.targets.find(name);
          if (target) {
            return target;
          } else {
            throw new Error(`Missing target element "${name}" for "${this.identifier}" controller`);
          }
        }
      },
      [`${name}Targets`]: {
        get() {
          return this.targets.findAll(name);
        }
      },
      [`has${capitalize(name)}Target`]: {
        get() {
          return this.targets.has(name);
        }
      }
    };
  }
  function ValuePropertiesBlessing(constructor) {
    const valueDefinitionPairs = readInheritableStaticObjectPairs(constructor, "values");
    const propertyDescriptorMap = {
      valueDescriptorMap: {
        get() {
          return valueDefinitionPairs.reduce((result, valueDefinitionPair) => {
            const valueDescriptor = parseValueDefinitionPair(valueDefinitionPair);
            const attributeName = this.data.getAttributeNameForKey(valueDescriptor.key);
            return Object.assign(result, { [attributeName]: valueDescriptor });
          }, {});
        }
      }
    };
    return valueDefinitionPairs.reduce((properties, valueDefinitionPair) => {
      return Object.assign(properties, propertiesForValueDefinitionPair(valueDefinitionPair));
    }, propertyDescriptorMap);
  }
  function propertiesForValueDefinitionPair(valueDefinitionPair) {
    const definition = parseValueDefinitionPair(valueDefinitionPair);
    const { key, name, reader: read, writer: write } = definition;
    return {
      [name]: {
        get() {
          const value = this.data.get(key);
          if (value !== null) {
            return read(value);
          } else {
            return definition.defaultValue;
          }
        },
        set(value) {
          if (value === void 0) {
            this.data.delete(key);
          } else {
            this.data.set(key, write(value));
          }
        }
      },
      [`has${capitalize(name)}`]: {
        get() {
          return this.data.has(key) || definition.hasCustomDefaultValue;
        }
      }
    };
  }
  function parseValueDefinitionPair([token, typeDefinition]) {
    return valueDescriptorForTokenAndTypeDefinition(token, typeDefinition);
  }
  function parseValueTypeConstant(constant) {
    switch (constant) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function parseValueTypeDefault(defaultValue) {
    switch (typeof defaultValue) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(defaultValue))
      return "array";
    if (Object.prototype.toString.call(defaultValue) === "[object Object]")
      return "object";
  }
  function parseValueTypeObject(typeObject) {
    const typeFromObject = parseValueTypeConstant(typeObject.type);
    if (typeFromObject) {
      const defaultValueType = parseValueTypeDefault(typeObject.default);
      if (typeFromObject !== defaultValueType) {
        throw new Error(`Type "${typeFromObject}" must match the type of the default value. Given default value: "${typeObject.default}" as "${defaultValueType}"`);
      }
      return typeFromObject;
    }
  }
  function parseValueTypeDefinition(typeDefinition) {
    const typeFromObject = parseValueTypeObject(typeDefinition);
    const typeFromDefaultValue = parseValueTypeDefault(typeDefinition);
    const typeFromConstant = parseValueTypeConstant(typeDefinition);
    const type = typeFromObject || typeFromDefaultValue || typeFromConstant;
    if (type)
      return type;
    throw new Error(`Unknown value type "${typeDefinition}"`);
  }
  function defaultValueForDefinition(typeDefinition) {
    const constant = parseValueTypeConstant(typeDefinition);
    if (constant)
      return defaultValuesByType[constant];
    const defaultValue = typeDefinition.default;
    if (defaultValue !== void 0)
      return defaultValue;
    return typeDefinition;
  }
  function valueDescriptorForTokenAndTypeDefinition(token, typeDefinition) {
    const key = `${dasherize(token)}-value`;
    const type = parseValueTypeDefinition(typeDefinition);
    return {
      type,
      key,
      name: camelize(key),
      get defaultValue() {
        return defaultValueForDefinition(typeDefinition);
      },
      get hasCustomDefaultValue() {
        return parseValueTypeDefault(typeDefinition) !== void 0;
      },
      reader: readers[type],
      writer: writers[type] || writers.default
    };
  }
  var defaultValuesByType = {
    get array() {
      return [];
    },
    boolean: false,
    number: 0,
    get object() {
      return {};
    },
    string: ""
  };
  var readers = {
    array(value) {
      const array = JSON.parse(value);
      if (!Array.isArray(array)) {
        throw new TypeError("Expected array");
      }
      return array;
    },
    boolean(value) {
      return !(value == "0" || value == "false");
    },
    number(value) {
      return Number(value);
    },
    object(value) {
      const object2 = JSON.parse(value);
      if (object2 === null || typeof object2 != "object" || Array.isArray(object2)) {
        throw new TypeError("Expected object");
      }
      return object2;
    },
    string(value) {
      return value;
    }
  };
  var writers = {
    default: writeString,
    array: writeJSON,
    object: writeJSON
  };
  function writeJSON(value) {
    return JSON.stringify(value);
  }
  function writeString(value) {
    return `${value}`;
  }
  var Controller = class {
    constructor(context) {
      this.context = context;
    }
    static get shouldLoad() {
      return true;
    }
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {
    }
    connect() {
    }
    disconnect() {
    }
    dispatch(eventName, { target = this.element, detail = {}, prefix = this.identifier, bubbles = true, cancelable = true } = {}) {
      const type = prefix ? `${prefix}:${eventName}` : eventName;
      const event = new CustomEvent(type, { detail, bubbles, cancelable });
      target.dispatchEvent(event);
      return event;
    }
  };
  Controller.blessings = [ClassPropertiesBlessing, TargetPropertiesBlessing, ValuePropertiesBlessing];
  Controller.targets = [];
  Controller.values = {};

  // app/javascript/controllers/application.js
  var application = Application.start();
  application.debug = false;
  window.Stimulus = application;

  // node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js
  var turbo_es2017_esm_exports = {};
  __export(turbo_es2017_esm_exports, {
    PageRenderer: () => PageRenderer,
    PageSnapshot: () => PageSnapshot,
    clearCache: () => clearCache,
    connectStreamSource: () => connectStreamSource,
    disconnectStreamSource: () => disconnectStreamSource,
    navigator: () => navigator$1,
    registerAdapter: () => registerAdapter,
    renderStreamMessage: () => renderStreamMessage,
    session: () => session,
    setConfirmMethod: () => setConfirmMethod,
    setProgressBarDelay: () => setProgressBarDelay,
    start: () => start,
    visit: () => visit
  });
  (function() {
    if (window.Reflect === void 0 || window.customElements === void 0 || window.customElements.polyfillWrapFlushCallback) {
      return;
    }
    const BuiltInHTMLElement = HTMLElement;
    const wrapperForTheName = {
      "HTMLElement": function HTMLElement2() {
        return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
      }
    };
    window.HTMLElement = wrapperForTheName["HTMLElement"];
    HTMLElement.prototype = BuiltInHTMLElement.prototype;
    HTMLElement.prototype.constructor = HTMLElement;
    Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
  })();
  (function(prototype) {
    if (typeof prototype.requestSubmit == "function")
      return;
    prototype.requestSubmit = function(submitter) {
      if (submitter) {
        validateSubmitter(submitter, this);
        submitter.click();
      } else {
        submitter = document.createElement("input");
        submitter.type = "submit";
        submitter.hidden = true;
        this.appendChild(submitter);
        submitter.click();
        this.removeChild(submitter);
      }
    };
    function validateSubmitter(submitter, form) {
      submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
      submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button");
      submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
    }
    function raise(errorConstructor, message, name) {
      throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name);
    }
  })(HTMLFormElement.prototype);
  var submittersByForm = /* @__PURE__ */ new WeakMap();
  function findSubmitterFromClickTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const candidate = element ? element.closest("input, button") : null;
    return (candidate === null || candidate === void 0 ? void 0 : candidate.type) == "submit" ? candidate : null;
  }
  function clickCaptured(event) {
    const submitter = findSubmitterFromClickTarget(event.target);
    if (submitter && submitter.form) {
      submittersByForm.set(submitter.form, submitter);
    }
  }
  (function() {
    if ("submitter" in Event.prototype)
      return;
    let prototype;
    if ("SubmitEvent" in window && /Apple Computer/.test(navigator.vendor)) {
      prototype = window.SubmitEvent.prototype;
    } else if ("SubmitEvent" in window) {
      return;
    } else {
      prototype = window.Event.prototype;
    }
    addEventListener("click", clickCaptured, true);
    Object.defineProperty(prototype, "submitter", {
      get() {
        if (this.type == "submit" && this.target instanceof HTMLFormElement) {
          return submittersByForm.get(this.target);
        }
      }
    });
  })();
  var FrameLoadingStyle;
  (function(FrameLoadingStyle2) {
    FrameLoadingStyle2["eager"] = "eager";
    FrameLoadingStyle2["lazy"] = "lazy";
  })(FrameLoadingStyle || (FrameLoadingStyle = {}));
  var FrameElement = class extends HTMLElement {
    constructor() {
      super();
      this.loaded = Promise.resolve();
      this.delegate = new FrameElement.delegateConstructor(this);
    }
    static get observedAttributes() {
      return ["disabled", "loading", "src"];
    }
    connectedCallback() {
      this.delegate.connect();
    }
    disconnectedCallback() {
      this.delegate.disconnect();
    }
    reload() {
      const { src } = this;
      this.src = null;
      this.src = src;
    }
    attributeChangedCallback(name) {
      if (name == "loading") {
        this.delegate.loadingStyleChanged();
      } else if (name == "src") {
        this.delegate.sourceURLChanged();
      } else {
        this.delegate.disabledChanged();
      }
    }
    get src() {
      return this.getAttribute("src");
    }
    set src(value) {
      if (value) {
        this.setAttribute("src", value);
      } else {
        this.removeAttribute("src");
      }
    }
    get loading() {
      return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    set loading(value) {
      if (value) {
        this.setAttribute("loading", value);
      } else {
        this.removeAttribute("loading");
      }
    }
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(value) {
      if (value) {
        this.setAttribute("disabled", "");
      } else {
        this.removeAttribute("disabled");
      }
    }
    get autoscroll() {
      return this.hasAttribute("autoscroll");
    }
    set autoscroll(value) {
      if (value) {
        this.setAttribute("autoscroll", "");
      } else {
        this.removeAttribute("autoscroll");
      }
    }
    get complete() {
      return !this.delegate.isLoading;
    }
    get isActive() {
      return this.ownerDocument === document && !this.isPreview;
    }
    get isPreview() {
      var _a, _b;
      return (_b = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.documentElement) === null || _b === void 0 ? void 0 : _b.hasAttribute("data-turbo-preview");
    }
  };
  function frameLoadingStyleFromString(style) {
    switch (style.toLowerCase()) {
      case "lazy":
        return FrameLoadingStyle.lazy;
      default:
        return FrameLoadingStyle.eager;
    }
  }
  function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
  }
  function getAnchor(url) {
    let anchorMatch;
    if (url.hash) {
      return url.hash.slice(1);
    } else if (anchorMatch = url.href.match(/#(.*)$/)) {
      return anchorMatch[1];
    }
  }
  function getAction(form, submitter) {
    const action = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formaction")) || form.getAttribute("action") || form.action;
    return expandURL(action);
  }
  function getExtension(url) {
    return (getLastPathComponent(url).match(/\.[^.]*$/) || [])[0] || "";
  }
  function isHTML(url) {
    return !!getExtension(url).match(/^(?:|\.(?:htm|html|xhtml))$/);
  }
  function isPrefixedBy(baseURL, url) {
    const prefix = getPrefix(url);
    return baseURL.href === expandURL(prefix).href || baseURL.href.startsWith(prefix);
  }
  function locationIsVisitable(location2, rootLocation) {
    return isPrefixedBy(location2, rootLocation) && isHTML(location2);
  }
  function getRequestURL(url) {
    const anchor = getAnchor(url);
    return anchor != null ? url.href.slice(0, -(anchor.length + 1)) : url.href;
  }
  function toCacheKey(url) {
    return getRequestURL(url);
  }
  function urlsAreEqual(left, right) {
    return expandURL(left).href == expandURL(right).href;
  }
  function getPathComponents(url) {
    return url.pathname.split("/").slice(1);
  }
  function getLastPathComponent(url) {
    return getPathComponents(url).slice(-1)[0];
  }
  function getPrefix(url) {
    return addTrailingSlash(url.origin + url.pathname);
  }
  function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
  }
  var FetchResponse = class {
    constructor(response) {
      this.response = response;
    }
    get succeeded() {
      return this.response.ok;
    }
    get failed() {
      return !this.succeeded;
    }
    get clientError() {
      return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
      return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
      return this.response.redirected;
    }
    get location() {
      return expandURL(this.response.url);
    }
    get isHTML() {
      return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
      return this.response.status;
    }
    get contentType() {
      return this.header("Content-Type");
    }
    get responseText() {
      return this.response.clone().text();
    }
    get responseHTML() {
      if (this.isHTML) {
        return this.response.clone().text();
      } else {
        return Promise.resolve(void 0);
      }
    }
    header(name) {
      return this.response.headers.get(name);
    }
  };
  function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, { cancelable, bubbles: true, detail });
    if (target && target.isConnected) {
      target.dispatchEvent(event);
    } else {
      document.documentElement.dispatchEvent(event);
    }
    return event;
  }
  function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
  }
  function nextEventLoopTick() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
  }
  function nextMicrotask() {
    return Promise.resolve();
  }
  function parseHTMLDocument(html2 = "") {
    return new DOMParser().parseFromString(html2, "text/html");
  }
  function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match2 = lines[0].match(/^\s+/);
    const indent = match2 ? match2[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
  }
  function interpolate(strings, values) {
    return strings.reduce((result, string, i) => {
      const value = values[i] == void 0 ? "" : values[i];
      return result + string + value;
    }, "");
  }
  function uuid() {
    return Array.apply(null, { length: 36 }).map((_2, i) => {
      if (i == 8 || i == 13 || i == 18 || i == 23) {
        return "-";
      } else if (i == 14) {
        return "4";
      } else if (i == 19) {
        return (Math.floor(Math.random() * 4) + 8).toString(16);
      } else {
        return Math.floor(Math.random() * 15).toString(16);
      }
    }).join("");
  }
  function getAttribute(attributeName, ...elements) {
    for (const value of elements.map((element) => element === null || element === void 0 ? void 0 : element.getAttribute(attributeName))) {
      if (typeof value == "string")
        return value;
    }
    return null;
  }
  function markAsBusy(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.setAttribute("busy", "");
      }
      element.setAttribute("aria-busy", "true");
    }
  }
  function clearBusyState(...elements) {
    for (const element of elements) {
      if (element.localName == "turbo-frame") {
        element.removeAttribute("busy");
      }
      element.removeAttribute("aria-busy");
    }
  }
  var FetchMethod;
  (function(FetchMethod2) {
    FetchMethod2[FetchMethod2["get"] = 0] = "get";
    FetchMethod2[FetchMethod2["post"] = 1] = "post";
    FetchMethod2[FetchMethod2["put"] = 2] = "put";
    FetchMethod2[FetchMethod2["patch"] = 3] = "patch";
    FetchMethod2[FetchMethod2["delete"] = 4] = "delete";
  })(FetchMethod || (FetchMethod = {}));
  function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
      case "get":
        return FetchMethod.get;
      case "post":
        return FetchMethod.post;
      case "put":
        return FetchMethod.put;
      case "patch":
        return FetchMethod.patch;
      case "delete":
        return FetchMethod.delete;
    }
  }
  var FetchRequest = class {
    constructor(delegate, method, location2, body = new URLSearchParams(), target = null) {
      this.abortController = new AbortController();
      this.resolveRequestPromise = (value) => {
      };
      this.delegate = delegate;
      this.method = method;
      this.headers = this.defaultHeaders;
      this.body = body;
      this.url = location2;
      this.target = target;
    }
    get location() {
      return this.url;
    }
    get params() {
      return this.url.searchParams;
    }
    get entries() {
      return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
      this.abortController.abort();
    }
    async perform() {
      var _a, _b;
      const { fetchOptions } = this;
      (_b = (_a = this.delegate).prepareHeadersForRequest) === null || _b === void 0 ? void 0 : _b.call(_a, this.headers, this);
      await this.allowRequestToBeIntercepted(fetchOptions);
      try {
        this.delegate.requestStarted(this);
        const response = await fetch(this.url.href, fetchOptions);
        return await this.receive(response);
      } catch (error2) {
        if (error2.name !== "AbortError") {
          this.delegate.requestErrored(this, error2);
          throw error2;
        }
      } finally {
        this.delegate.requestFinished(this);
      }
    }
    async receive(response) {
      const fetchResponse = new FetchResponse(response);
      const event = dispatch("turbo:before-fetch-response", { cancelable: true, detail: { fetchResponse }, target: this.target });
      if (event.defaultPrevented) {
        this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
      } else if (fetchResponse.succeeded) {
        this.delegate.requestSucceededWithResponse(this, fetchResponse);
      } else {
        this.delegate.requestFailedWithResponse(this, fetchResponse);
      }
      return fetchResponse;
    }
    get fetchOptions() {
      var _a;
      return {
        method: FetchMethod[this.method].toUpperCase(),
        credentials: "same-origin",
        headers: this.headers,
        redirect: "follow",
        body: this.isIdempotent ? null : this.body,
        signal: this.abortSignal,
        referrer: (_a = this.delegate.referrer) === null || _a === void 0 ? void 0 : _a.href
      };
    }
    get defaultHeaders() {
      return {
        "Accept": "text/html, application/xhtml+xml"
      };
    }
    get isIdempotent() {
      return this.method == FetchMethod.get;
    }
    get abortSignal() {
      return this.abortController.signal;
    }
    async allowRequestToBeIntercepted(fetchOptions) {
      const requestInterception = new Promise((resolve) => this.resolveRequestPromise = resolve);
      const event = dispatch("turbo:before-fetch-request", {
        cancelable: true,
        detail: {
          fetchOptions,
          url: this.url,
          resume: this.resolveRequestPromise
        },
        target: this.target
      });
      if (event.defaultPrevented)
        await requestInterception;
    }
  };
  var AppearanceObserver = class {
    constructor(delegate, element) {
      this.started = false;
      this.intersect = (entries) => {
        const lastEntry = entries.slice(-1)[0];
        if (lastEntry === null || lastEntry === void 0 ? void 0 : lastEntry.isIntersecting) {
          this.delegate.elementAppearedInViewport(this.element);
        }
      };
      this.delegate = delegate;
      this.element = element;
      this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
      if (!this.started) {
        this.started = true;
        this.intersectionObserver.observe(this.element);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        this.intersectionObserver.unobserve(this.element);
      }
    }
  };
  var StreamMessage = class {
    constructor(html2) {
      this.templateElement = document.createElement("template");
      this.templateElement.innerHTML = html2;
    }
    static wrap(message) {
      if (typeof message == "string") {
        return new this(message);
      } else {
        return message;
      }
    }
    get fragment() {
      const fragment = document.createDocumentFragment();
      for (const element of this.foreignElements) {
        fragment.appendChild(document.importNode(element, true));
      }
      return fragment;
    }
    get foreignElements() {
      return this.templateChildren.reduce((streamElements, child) => {
        if (child.tagName.toLowerCase() == "turbo-stream") {
          return [...streamElements, child];
        } else {
          return streamElements;
        }
      }, []);
    }
    get templateChildren() {
      return Array.from(this.templateElement.content.children);
    }
  };
  StreamMessage.contentType = "text/vnd.turbo-stream.html";
  var FormSubmissionState;
  (function(FormSubmissionState2) {
    FormSubmissionState2[FormSubmissionState2["initialized"] = 0] = "initialized";
    FormSubmissionState2[FormSubmissionState2["requesting"] = 1] = "requesting";
    FormSubmissionState2[FormSubmissionState2["waiting"] = 2] = "waiting";
    FormSubmissionState2[FormSubmissionState2["receiving"] = 3] = "receiving";
    FormSubmissionState2[FormSubmissionState2["stopping"] = 4] = "stopping";
    FormSubmissionState2[FormSubmissionState2["stopped"] = 5] = "stopped";
  })(FormSubmissionState || (FormSubmissionState = {}));
  var FormEnctype;
  (function(FormEnctype2) {
    FormEnctype2["urlEncoded"] = "application/x-www-form-urlencoded";
    FormEnctype2["multipart"] = "multipart/form-data";
    FormEnctype2["plain"] = "text/plain";
  })(FormEnctype || (FormEnctype = {}));
  function formEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
      case FormEnctype.multipart:
        return FormEnctype.multipart;
      case FormEnctype.plain:
        return FormEnctype.plain;
      default:
        return FormEnctype.urlEncoded;
    }
  }
  var FormSubmission = class {
    constructor(delegate, formElement, submitter, mustRedirect = false) {
      this.state = FormSubmissionState.initialized;
      this.delegate = delegate;
      this.formElement = formElement;
      this.submitter = submitter;
      this.formData = buildFormData(formElement, submitter);
      this.location = expandURL(this.action);
      if (this.method == FetchMethod.get) {
        mergeFormDataEntries(this.location, [...this.body.entries()]);
      }
      this.fetchRequest = new FetchRequest(this, this.method, this.location, this.body, this.formElement);
      this.mustRedirect = mustRedirect;
    }
    static confirmMethod(message, element) {
      return confirm(message);
    }
    get method() {
      var _a;
      const method = ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formmethod")) || this.formElement.getAttribute("method") || "";
      return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
    }
    get action() {
      var _a;
      const formElementAction = typeof this.formElement.action === "string" ? this.formElement.action : null;
      return ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formaction")) || this.formElement.getAttribute("action") || formElementAction || "";
    }
    get body() {
      if (this.enctype == FormEnctype.urlEncoded || this.method == FetchMethod.get) {
        return new URLSearchParams(this.stringFormData);
      } else {
        return this.formData;
      }
    }
    get enctype() {
      var _a;
      return formEnctypeFromString(((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formenctype")) || this.formElement.enctype);
    }
    get isIdempotent() {
      return this.fetchRequest.isIdempotent;
    }
    get stringFormData() {
      return [...this.formData].reduce((entries, [name, value]) => {
        return entries.concat(typeof value == "string" ? [[name, value]] : []);
      }, []);
    }
    get confirmationMessage() {
      return this.formElement.getAttribute("data-turbo-confirm");
    }
    get needsConfirmation() {
      return this.confirmationMessage !== null;
    }
    async start() {
      const { initialized, requesting } = FormSubmissionState;
      if (this.needsConfirmation) {
        const answer = FormSubmission.confirmMethod(this.confirmationMessage, this.formElement);
        if (!answer) {
          return;
        }
      }
      if (this.state == initialized) {
        this.state = requesting;
        return this.fetchRequest.perform();
      }
    }
    stop() {
      const { stopping, stopped } = FormSubmissionState;
      if (this.state != stopping && this.state != stopped) {
        this.state = stopping;
        this.fetchRequest.cancel();
        return true;
      }
    }
    prepareHeadersForRequest(headers, request) {
      if (!request.isIdempotent) {
        const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
        if (token) {
          headers["X-CSRF-Token"] = token;
        }
        headers["Accept"] = [StreamMessage.contentType, headers["Accept"]].join(", ");
      }
    }
    requestStarted(request) {
      var _a;
      this.state = FormSubmissionState.waiting;
      (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.setAttribute("disabled", "");
      dispatch("turbo:submit-start", { target: this.formElement, detail: { formSubmission: this } });
      this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request, response) {
      this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request, response) {
      if (response.clientError || response.serverError) {
        this.delegate.formSubmissionFailedWithResponse(this, response);
      } else if (this.requestMustRedirect(request) && responseSucceededWithoutRedirect(response)) {
        const error2 = new Error("Form responses must redirect to another location");
        this.delegate.formSubmissionErrored(this, error2);
      } else {
        this.state = FormSubmissionState.receiving;
        this.result = { success: true, fetchResponse: response };
        this.delegate.formSubmissionSucceededWithResponse(this, response);
      }
    }
    requestFailedWithResponse(request, response) {
      this.result = { success: false, fetchResponse: response };
      this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request, error2) {
      this.result = { success: false, error: error2 };
      this.delegate.formSubmissionErrored(this, error2);
    }
    requestFinished(request) {
      var _a;
      this.state = FormSubmissionState.stopped;
      (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.removeAttribute("disabled");
      dispatch("turbo:submit-end", { target: this.formElement, detail: Object.assign({ formSubmission: this }, this.result) });
      this.delegate.formSubmissionFinished(this);
    }
    requestMustRedirect(request) {
      return !request.isIdempotent && this.mustRedirect;
    }
  };
  function buildFormData(formElement, submitter) {
    const formData = new FormData(formElement);
    const name = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("name");
    const value = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("value");
    if (name && value != null && formData.get(name) != value) {
      formData.append(name, value);
    }
    return formData;
  }
  function getCookieValue(cookieName) {
    if (cookieName != null) {
      const cookies = document.cookie ? document.cookie.split("; ") : [];
      const cookie = cookies.find((cookie2) => cookie2.startsWith(cookieName));
      if (cookie) {
        const value = cookie.split("=").slice(1).join("=");
        return value ? decodeURIComponent(value) : void 0;
      }
    }
  }
  function getMetaContent(name) {
    const element = document.querySelector(`meta[name="${name}"]`);
    return element && element.content;
  }
  function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
  }
  function mergeFormDataEntries(url, entries) {
    const searchParams = new URLSearchParams();
    for (const [name, value] of entries) {
      if (value instanceof File)
        continue;
      searchParams.append(name, value);
    }
    url.search = searchParams.toString();
    return url;
  }
  var Snapshot = class {
    constructor(element) {
      this.element = element;
    }
    get children() {
      return [...this.element.children];
    }
    hasAnchor(anchor) {
      return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
      return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
      return this.element.isConnected;
    }
    get firstAutofocusableElement() {
      return this.element.querySelector("[autofocus]");
    }
    get permanentElements() {
      return [...this.element.querySelectorAll("[id][data-turbo-permanent]")];
    }
    getPermanentElementById(id2) {
      return this.element.querySelector(`#${id2}[data-turbo-permanent]`);
    }
    getPermanentElementMapForSnapshot(snapshot) {
      const permanentElementMap = {};
      for (const currentPermanentElement of this.permanentElements) {
        const { id: id2 } = currentPermanentElement;
        const newPermanentElement = snapshot.getPermanentElementById(id2);
        if (newPermanentElement) {
          permanentElementMap[id2] = [currentPermanentElement, newPermanentElement];
        }
      }
      return permanentElementMap;
    }
  };
  var FormInterceptor = class {
    constructor(delegate, element) {
      this.submitBubbled = (event) => {
        const form = event.target;
        if (!event.defaultPrevented && form instanceof HTMLFormElement && form.closest("turbo-frame, html") == this.element) {
          const submitter = event.submitter || void 0;
          const method = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formmethod")) || form.method;
          if (method != "dialog" && this.delegate.shouldInterceptFormSubmission(form, submitter)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.delegate.formSubmissionIntercepted(form, submitter);
          }
        }
      };
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("submit", this.submitBubbled);
    }
    stop() {
      this.element.removeEventListener("submit", this.submitBubbled);
    }
  };
  var View = class {
    constructor(delegate, element) {
      this.resolveRenderPromise = (value) => {
      };
      this.resolveInterceptionPromise = (value) => {
      };
      this.delegate = delegate;
      this.element = element;
    }
    scrollToAnchor(anchor) {
      const element = this.snapshot.getElementForAnchor(anchor);
      if (element) {
        this.scrollToElement(element);
        this.focusElement(element);
      } else {
        this.scrollToPosition({ x: 0, y: 0 });
      }
    }
    scrollToAnchorFromLocation(location2) {
      this.scrollToAnchor(getAnchor(location2));
    }
    scrollToElement(element) {
      element.scrollIntoView();
    }
    focusElement(element) {
      if (element instanceof HTMLElement) {
        if (element.hasAttribute("tabindex")) {
          element.focus();
        } else {
          element.setAttribute("tabindex", "-1");
          element.focus();
          element.removeAttribute("tabindex");
        }
      }
    }
    scrollToPosition({ x, y }) {
      this.scrollRoot.scrollTo(x, y);
    }
    scrollToTop() {
      this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
      return window;
    }
    async render(renderer) {
      const { isPreview, shouldRender, newSnapshot: snapshot } = renderer;
      if (shouldRender) {
        try {
          this.renderPromise = new Promise((resolve) => this.resolveRenderPromise = resolve);
          this.renderer = renderer;
          this.prepareToRenderSnapshot(renderer);
          const renderInterception = new Promise((resolve) => this.resolveInterceptionPromise = resolve);
          const immediateRender = this.delegate.allowsImmediateRender(snapshot, this.resolveInterceptionPromise);
          if (!immediateRender)
            await renderInterception;
          await this.renderSnapshot(renderer);
          this.delegate.viewRenderedSnapshot(snapshot, isPreview);
          this.finishRenderingSnapshot(renderer);
        } finally {
          delete this.renderer;
          this.resolveRenderPromise(void 0);
          delete this.renderPromise;
        }
      } else {
        this.invalidate();
      }
    }
    invalidate() {
      this.delegate.viewInvalidated();
    }
    prepareToRenderSnapshot(renderer) {
      this.markAsPreview(renderer.isPreview);
      renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
      if (isPreview) {
        this.element.setAttribute("data-turbo-preview", "");
      } else {
        this.element.removeAttribute("data-turbo-preview");
      }
    }
    async renderSnapshot(renderer) {
      await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
      renderer.finishRendering();
    }
  };
  var FrameView = class extends View {
    invalidate() {
      this.element.innerHTML = "";
    }
    get snapshot() {
      return new Snapshot(this.element);
    }
  };
  var LinkInterceptor = class {
    constructor(delegate, element) {
      this.clickBubbled = (event) => {
        if (this.respondsToEventTarget(event.target)) {
          this.clickEvent = event;
        } else {
          delete this.clickEvent;
        }
      };
      this.linkClicked = (event) => {
        if (this.clickEvent && this.respondsToEventTarget(event.target) && event.target instanceof Element) {
          if (this.delegate.shouldInterceptLinkClick(event.target, event.detail.url)) {
            this.clickEvent.preventDefault();
            event.preventDefault();
            this.delegate.linkClickIntercepted(event.target, event.detail.url);
          }
        }
        delete this.clickEvent;
      };
      this.willVisit = () => {
        delete this.clickEvent;
      };
      this.delegate = delegate;
      this.element = element;
    }
    start() {
      this.element.addEventListener("click", this.clickBubbled);
      document.addEventListener("turbo:click", this.linkClicked);
      document.addEventListener("turbo:before-visit", this.willVisit);
    }
    stop() {
      this.element.removeEventListener("click", this.clickBubbled);
      document.removeEventListener("turbo:click", this.linkClicked);
      document.removeEventListener("turbo:before-visit", this.willVisit);
    }
    respondsToEventTarget(target) {
      const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
      return element && element.closest("turbo-frame, html") == this.element;
    }
  };
  var Bardo = class {
    constructor(permanentElementMap) {
      this.permanentElementMap = permanentElementMap;
    }
    static preservingPermanentElements(permanentElementMap, callback) {
      const bardo = new this(permanentElementMap);
      bardo.enter();
      callback();
      bardo.leave();
    }
    enter() {
      for (const id2 in this.permanentElementMap) {
        const [, newPermanentElement] = this.permanentElementMap[id2];
        this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
      }
    }
    leave() {
      for (const id2 in this.permanentElementMap) {
        const [currentPermanentElement] = this.permanentElementMap[id2];
        this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
        this.replacePlaceholderWithPermanentElement(currentPermanentElement);
      }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
      const placeholder = createPlaceholderForPermanentElement(permanentElement);
      permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
      const clone = permanentElement.cloneNode(true);
      permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
      const placeholder = this.getPlaceholderById(permanentElement.id);
      placeholder === null || placeholder === void 0 ? void 0 : placeholder.replaceWith(permanentElement);
    }
    getPlaceholderById(id2) {
      return this.placeholders.find((element) => element.content == id2);
    }
    get placeholders() {
      return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
  };
  function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
  }
  var Renderer = class {
    constructor(currentSnapshot, newSnapshot, isPreview, willRender = true) {
      this.currentSnapshot = currentSnapshot;
      this.newSnapshot = newSnapshot;
      this.isPreview = isPreview;
      this.willRender = willRender;
      this.promise = new Promise((resolve, reject) => this.resolvingFunctions = { resolve, reject });
    }
    get shouldRender() {
      return true;
    }
    prepareToRender() {
      return;
    }
    finishRendering() {
      if (this.resolvingFunctions) {
        this.resolvingFunctions.resolve();
        delete this.resolvingFunctions;
      }
    }
    createScriptElement(element) {
      if (element.getAttribute("data-turbo-eval") == "false") {
        return element;
      } else {
        const createdScriptElement = document.createElement("script");
        if (this.cspNonce) {
          createdScriptElement.nonce = this.cspNonce;
        }
        createdScriptElement.textContent = element.textContent;
        createdScriptElement.async = false;
        copyElementAttributes(createdScriptElement, element);
        return createdScriptElement;
      }
    }
    preservingPermanentElements(callback) {
      Bardo.preservingPermanentElements(this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
      const element = this.connectedSnapshot.firstAutofocusableElement;
      if (elementIsFocusable(element)) {
        element.focus();
      }
    }
    get connectedSnapshot() {
      return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
      return this.currentSnapshot.element;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    get permanentElementMap() {
      return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
    get cspNonce() {
      var _a;
      return (_a = document.head.querySelector('meta[name="csp-nonce"]')) === null || _a === void 0 ? void 0 : _a.getAttribute("content");
    }
  };
  function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of [...sourceElement.attributes]) {
      destinationElement.setAttribute(name, value);
    }
  }
  function elementIsFocusable(element) {
    return element && typeof element.focus == "function";
  }
  var FrameRenderer = class extends Renderer {
    get shouldRender() {
      return true;
    }
    async render() {
      await nextAnimationFrame();
      this.preservingPermanentElements(() => {
        this.loadFrameElement();
      });
      this.scrollFrameIntoView();
      await nextAnimationFrame();
      this.focusFirstAutofocusableElement();
      await nextAnimationFrame();
      this.activateScriptElements();
    }
    loadFrameElement() {
      var _a;
      const destinationRange = document.createRange();
      destinationRange.selectNodeContents(this.currentElement);
      destinationRange.deleteContents();
      const frameElement = this.newElement;
      const sourceRange = (_a = frameElement.ownerDocument) === null || _a === void 0 ? void 0 : _a.createRange();
      if (sourceRange) {
        sourceRange.selectNodeContents(frameElement);
        this.currentElement.appendChild(sourceRange.extractContents());
      }
    }
    scrollFrameIntoView() {
      if (this.currentElement.autoscroll || this.newElement.autoscroll) {
        const element = this.currentElement.firstElementChild;
        const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
        if (element) {
          element.scrollIntoView({ block });
          return true;
        }
      }
      return false;
    }
    activateScriptElements() {
      for (const inertScriptElement of this.newScriptElements) {
        const activatedScriptElement = this.createScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    get newScriptElements() {
      return this.currentElement.querySelectorAll("script");
    }
  };
  function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
      return value;
    } else {
      return defaultValue;
    }
  }
  var ProgressBar = class {
    constructor() {
      this.hiding = false;
      this.value = 0;
      this.visible = false;
      this.trickle = () => {
        this.setValue(this.value + Math.random() / 100);
      };
      this.stylesheetElement = this.createStylesheetElement();
      this.progressElement = this.createProgressElement();
      this.installStylesheetElement();
      this.setValue(0);
    }
    static get defaultCSS() {
      return unindent`
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 9999;
        transition:
          width ${ProgressBar.animationDuration}ms ease-out,
          opacity ${ProgressBar.animationDuration / 2}ms ${ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    show() {
      if (!this.visible) {
        this.visible = true;
        this.installProgressElement();
        this.startTrickling();
      }
    }
    hide() {
      if (this.visible && !this.hiding) {
        this.hiding = true;
        this.fadeProgressElement(() => {
          this.uninstallProgressElement();
          this.stopTrickling();
          this.visible = false;
          this.hiding = false;
        });
      }
    }
    setValue(value) {
      this.value = value;
      this.refresh();
    }
    installStylesheetElement() {
      document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
      this.progressElement.style.width = "0";
      this.progressElement.style.opacity = "1";
      document.documentElement.insertBefore(this.progressElement, document.body);
      this.refresh();
    }
    fadeProgressElement(callback) {
      this.progressElement.style.opacity = "0";
      setTimeout(callback, ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
      if (this.progressElement.parentNode) {
        document.documentElement.removeChild(this.progressElement);
      }
    }
    startTrickling() {
      if (!this.trickleInterval) {
        this.trickleInterval = window.setInterval(this.trickle, ProgressBar.animationDuration);
      }
    }
    stopTrickling() {
      window.clearInterval(this.trickleInterval);
      delete this.trickleInterval;
    }
    refresh() {
      requestAnimationFrame(() => {
        this.progressElement.style.width = `${10 + this.value * 90}%`;
      });
    }
    createStylesheetElement() {
      const element = document.createElement("style");
      element.type = "text/css";
      element.textContent = ProgressBar.defaultCSS;
      return element;
    }
    createProgressElement() {
      const element = document.createElement("div");
      element.className = "turbo-progress-bar";
      return element;
    }
  };
  ProgressBar.animationDuration = 300;
  var HeadSnapshot = class extends Snapshot {
    constructor() {
      super(...arguments);
      this.detailsByOuterHTML = this.children.filter((element) => !elementIsNoscript(element)).map((element) => elementWithoutNonce(element)).reduce((result, element) => {
        const { outerHTML } = element;
        const details = outerHTML in result ? result[outerHTML] : {
          type: elementType(element),
          tracked: elementIsTracked(element),
          elements: []
        };
        return Object.assign(Object.assign({}, result), { [outerHTML]: Object.assign(Object.assign({}, details), { elements: [...details.elements, element] }) });
      }, {});
    }
    get trackedElementSignature() {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked).join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
      return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
      return Object.keys(this.detailsByOuterHTML).filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML)).map((outerHTML) => this.detailsByOuterHTML[outerHTML]).filter(({ type }) => type == matchedType).map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
        if (type == null && !tracked) {
          return [...result, ...elements];
        } else if (elements.length > 1) {
          return [...result, ...elements.slice(1)];
        } else {
          return result;
        }
      }, []);
    }
    getMetaValue(name) {
      const element = this.findMetaElementByName(name);
      return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
      return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
        const { elements: [element] } = this.detailsByOuterHTML[outerHTML];
        return elementIsMetaElementWithName(element, name) ? element : result;
      }, void 0);
    }
  };
  function elementType(element) {
    if (elementIsScript(element)) {
      return "script";
    } else if (elementIsStylesheet(element)) {
      return "stylesheet";
    }
  }
  function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
  }
  function elementIsScript(element) {
    const tagName2 = element.tagName.toLowerCase();
    return tagName2 == "script";
  }
  function elementIsNoscript(element) {
    const tagName2 = element.tagName.toLowerCase();
    return tagName2 == "noscript";
  }
  function elementIsStylesheet(element) {
    const tagName2 = element.tagName.toLowerCase();
    return tagName2 == "style" || tagName2 == "link" && element.getAttribute("rel") == "stylesheet";
  }
  function elementIsMetaElementWithName(element, name) {
    const tagName2 = element.tagName.toLowerCase();
    return tagName2 == "meta" && element.getAttribute("name") == name;
  }
  function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
      element.setAttribute("nonce", "");
    }
    return element;
  }
  var PageSnapshot = class extends Snapshot {
    constructor(element, headSnapshot) {
      super(element);
      this.headSnapshot = headSnapshot;
    }
    static fromHTMLString(html2 = "") {
      return this.fromDocument(parseHTMLDocument(html2));
    }
    static fromElement(element) {
      return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ head, body }) {
      return new this(body, new HeadSnapshot(head));
    }
    clone() {
      return new PageSnapshot(this.element.cloneNode(true), this.headSnapshot);
    }
    get headElement() {
      return this.headSnapshot.element;
    }
    get rootLocation() {
      var _a;
      const root = (_a = this.getSetting("root")) !== null && _a !== void 0 ? _a : "/";
      return expandURL(root);
    }
    get cacheControlValue() {
      return this.getSetting("cache-control");
    }
    get isPreviewable() {
      return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
      return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
      return this.getSetting("visit-control") != "reload";
    }
    getSetting(name) {
      return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
  };
  var TimingMetric;
  (function(TimingMetric2) {
    TimingMetric2["visitStart"] = "visitStart";
    TimingMetric2["requestStart"] = "requestStart";
    TimingMetric2["requestEnd"] = "requestEnd";
    TimingMetric2["visitEnd"] = "visitEnd";
  })(TimingMetric || (TimingMetric = {}));
  var VisitState;
  (function(VisitState2) {
    VisitState2["initialized"] = "initialized";
    VisitState2["started"] = "started";
    VisitState2["canceled"] = "canceled";
    VisitState2["failed"] = "failed";
    VisitState2["completed"] = "completed";
  })(VisitState || (VisitState = {}));
  var defaultOptions = {
    action: "advance",
    historyChanged: false,
    visitCachedSnapshot: () => {
    },
    willRender: true
  };
  var SystemStatusCode;
  (function(SystemStatusCode2) {
    SystemStatusCode2[SystemStatusCode2["networkFailure"] = 0] = "networkFailure";
    SystemStatusCode2[SystemStatusCode2["timeoutFailure"] = -1] = "timeoutFailure";
    SystemStatusCode2[SystemStatusCode2["contentTypeMismatch"] = -2] = "contentTypeMismatch";
  })(SystemStatusCode || (SystemStatusCode = {}));
  var Visit = class {
    constructor(delegate, location2, restorationIdentifier, options2 = {}) {
      this.identifier = uuid();
      this.timingMetrics = {};
      this.followedRedirect = false;
      this.historyChanged = false;
      this.scrolled = false;
      this.snapshotCached = false;
      this.state = VisitState.initialized;
      this.delegate = delegate;
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier || uuid();
      const { action, historyChanged, referrer, snapshotHTML, response, visitCachedSnapshot, willRender } = Object.assign(Object.assign({}, defaultOptions), options2);
      this.action = action;
      this.historyChanged = historyChanged;
      this.referrer = referrer;
      this.snapshotHTML = snapshotHTML;
      this.response = response;
      this.isSamePage = this.delegate.locationWithActionIsSamePage(this.location, this.action);
      this.visitCachedSnapshot = visitCachedSnapshot;
      this.willRender = willRender;
      this.scrolled = !willRender;
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    get restorationData() {
      return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    get silent() {
      return this.isSamePage;
    }
    start() {
      if (this.state == VisitState.initialized) {
        this.recordTimingMetric(TimingMetric.visitStart);
        this.state = VisitState.started;
        this.adapter.visitStarted(this);
        this.delegate.visitStarted(this);
      }
    }
    cancel() {
      if (this.state == VisitState.started) {
        if (this.request) {
          this.request.cancel();
        }
        this.cancelRender();
        this.state = VisitState.canceled;
      }
    }
    complete() {
      if (this.state == VisitState.started) {
        this.recordTimingMetric(TimingMetric.visitEnd);
        this.state = VisitState.completed;
        this.adapter.visitCompleted(this);
        this.delegate.visitCompleted(this);
        this.followRedirect();
      }
    }
    fail() {
      if (this.state == VisitState.started) {
        this.state = VisitState.failed;
        this.adapter.visitFailed(this);
      }
    }
    changeHistory() {
      var _a;
      if (!this.historyChanged) {
        const actionForHistory = this.location.href === ((_a = this.referrer) === null || _a === void 0 ? void 0 : _a.href) ? "replace" : this.action;
        const method = this.getHistoryMethodForAction(actionForHistory);
        this.history.update(method, this.location, this.restorationIdentifier);
        this.historyChanged = true;
      }
    }
    issueRequest() {
      if (this.hasPreloadedResponse()) {
        this.simulateRequest();
      } else if (this.shouldIssueRequest() && !this.request) {
        this.request = new FetchRequest(this, FetchMethod.get, this.location);
        this.request.perform();
      }
    }
    simulateRequest() {
      if (this.response) {
        this.startRequest();
        this.recordResponse();
        this.finishRequest();
      }
    }
    startRequest() {
      this.recordTimingMetric(TimingMetric.requestStart);
      this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
      this.response = response;
      if (response) {
        const { statusCode } = response;
        if (isSuccessful(statusCode)) {
          this.adapter.visitRequestCompleted(this);
        } else {
          this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
        }
      }
    }
    finishRequest() {
      this.recordTimingMetric(TimingMetric.requestEnd);
      this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
      if (this.response) {
        const { statusCode, responseHTML } = this.response;
        this.render(async () => {
          this.cacheSnapshot();
          if (this.view.renderPromise)
            await this.view.renderPromise;
          if (isSuccessful(statusCode) && responseHTML != null) {
            await this.view.renderPage(PageSnapshot.fromHTMLString(responseHTML), false, this.willRender);
            this.adapter.visitRendered(this);
            this.complete();
          } else {
            await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML));
            this.adapter.visitRendered(this);
            this.fail();
          }
        });
      }
    }
    getCachedSnapshot() {
      const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
      if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
        if (this.action == "restore" || snapshot.isPreviewable) {
          return snapshot;
        }
      }
    }
    getPreloadedSnapshot() {
      if (this.snapshotHTML) {
        return PageSnapshot.fromHTMLString(this.snapshotHTML);
      }
    }
    hasCachedSnapshot() {
      return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
      const snapshot = this.getCachedSnapshot();
      if (snapshot) {
        const isPreview = this.shouldIssueRequest();
        this.render(async () => {
          this.cacheSnapshot();
          if (this.isSamePage) {
            this.adapter.visitRendered(this);
          } else {
            if (this.view.renderPromise)
              await this.view.renderPromise;
            await this.view.renderPage(snapshot, isPreview, this.willRender);
            this.adapter.visitRendered(this);
            if (!isPreview) {
              this.complete();
            }
          }
        });
      }
    }
    followRedirect() {
      var _a;
      if (this.redirectedToLocation && !this.followedRedirect && ((_a = this.response) === null || _a === void 0 ? void 0 : _a.redirected)) {
        this.adapter.visitProposedToLocation(this.redirectedToLocation, {
          action: "replace",
          response: this.response
        });
        this.followedRedirect = true;
      }
    }
    goToSamePageAnchor() {
      if (this.isSamePage) {
        this.render(async () => {
          this.cacheSnapshot();
          this.adapter.visitRendered(this);
        });
      }
    }
    requestStarted() {
      this.startRequest();
    }
    requestPreventedHandlingResponse(request, response) {
    }
    async requestSucceededWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({ statusCode: SystemStatusCode.contentTypeMismatch, redirected });
      } else {
        this.redirectedToLocation = response.redirected ? response.location : void 0;
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    async requestFailedWithResponse(request, response) {
      const responseHTML = await response.responseHTML;
      const { redirected, statusCode } = response;
      if (responseHTML == void 0) {
        this.recordResponse({ statusCode: SystemStatusCode.contentTypeMismatch, redirected });
      } else {
        this.recordResponse({ statusCode, responseHTML, redirected });
      }
    }
    requestErrored(request, error2) {
      this.recordResponse({ statusCode: SystemStatusCode.networkFailure, redirected: false });
    }
    requestFinished() {
      this.finishRequest();
    }
    performScroll() {
      if (!this.scrolled) {
        if (this.action == "restore") {
          this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
        } else {
          this.scrollToAnchor() || this.view.scrollToTop();
        }
        if (this.isSamePage) {
          this.delegate.visitScrolledToSamePageLocation(this.view.lastRenderedLocation, this.location);
        }
        this.scrolled = true;
      }
    }
    scrollToRestoredPosition() {
      const { scrollPosition } = this.restorationData;
      if (scrollPosition) {
        this.view.scrollToPosition(scrollPosition);
        return true;
      }
    }
    scrollToAnchor() {
      const anchor = getAnchor(this.location);
      if (anchor != null) {
        this.view.scrollToAnchor(anchor);
        return true;
      }
    }
    recordTimingMetric(metric) {
      this.timingMetrics[metric] = new Date().getTime();
    }
    getTimingMetrics() {
      return Object.assign({}, this.timingMetrics);
    }
    getHistoryMethodForAction(action) {
      switch (action) {
        case "replace":
          return history.replaceState;
        case "advance":
        case "restore":
          return history.pushState;
      }
    }
    hasPreloadedResponse() {
      return typeof this.response == "object";
    }
    shouldIssueRequest() {
      if (this.isSamePage) {
        return false;
      } else if (this.action == "restore") {
        return !this.hasCachedSnapshot();
      } else {
        return this.willRender;
      }
    }
    cacheSnapshot() {
      if (!this.snapshotCached) {
        this.view.cacheSnapshot().then((snapshot) => snapshot && this.visitCachedSnapshot(snapshot));
        this.snapshotCached = true;
      }
    }
    async render(callback) {
      this.cancelRender();
      await new Promise((resolve) => {
        this.frame = requestAnimationFrame(() => resolve());
      });
      await callback();
      delete this.frame;
      this.performScroll();
    }
    cancelRender() {
      if (this.frame) {
        cancelAnimationFrame(this.frame);
        delete this.frame;
      }
    }
  };
  function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }
  var BrowserAdapter = class {
    constructor(session2) {
      this.progressBar = new ProgressBar();
      this.showProgressBar = () => {
        this.progressBar.show();
      };
      this.session = session2;
    }
    visitProposedToLocation(location2, options2) {
      this.navigator.startVisit(location2, uuid(), options2);
    }
    visitStarted(visit2) {
      visit2.loadCachedSnapshot();
      visit2.issueRequest();
      visit2.changeHistory();
      visit2.goToSamePageAnchor();
    }
    visitRequestStarted(visit2) {
      this.progressBar.setValue(0);
      if (visit2.hasCachedSnapshot() || visit2.action != "restore") {
        this.showVisitProgressBarAfterDelay();
      } else {
        this.showProgressBar();
      }
    }
    visitRequestCompleted(visit2) {
      visit2.loadResponse();
    }
    visitRequestFailedWithStatusCode(visit2, statusCode) {
      switch (statusCode) {
        case SystemStatusCode.networkFailure:
        case SystemStatusCode.timeoutFailure:
        case SystemStatusCode.contentTypeMismatch:
          return this.reload();
        default:
          return visit2.loadResponse();
      }
    }
    visitRequestFinished(visit2) {
      this.progressBar.setValue(1);
      this.hideVisitProgressBar();
    }
    visitCompleted(visit2) {
    }
    pageInvalidated() {
      this.reload();
    }
    visitFailed(visit2) {
    }
    visitRendered(visit2) {
    }
    formSubmissionStarted(formSubmission) {
      this.progressBar.setValue(0);
      this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(formSubmission) {
      this.progressBar.setValue(1);
      this.hideFormProgressBar();
    }
    showVisitProgressBarAfterDelay() {
      this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
      this.progressBar.hide();
      if (this.visitProgressBarTimeout != null) {
        window.clearTimeout(this.visitProgressBarTimeout);
        delete this.visitProgressBarTimeout;
      }
    }
    showFormProgressBarAfterDelay() {
      if (this.formProgressBarTimeout == null) {
        this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
      }
    }
    hideFormProgressBar() {
      this.progressBar.hide();
      if (this.formProgressBarTimeout != null) {
        window.clearTimeout(this.formProgressBarTimeout);
        delete this.formProgressBarTimeout;
      }
    }
    reload() {
      window.location.reload();
    }
    get navigator() {
      return this.session.navigator;
    }
  };
  var CacheObserver = class {
    constructor() {
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-cache", this.removeStaleElements, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-cache", this.removeStaleElements, false);
      }
    }
    removeStaleElements() {
      const staleElements = [...document.querySelectorAll('[data-turbo-cache="false"]')];
      for (const element of staleElements) {
        element.remove();
      }
    }
  };
  var FormSubmitObserver = class {
    constructor(delegate) {
      this.started = false;
      this.submitCaptured = () => {
        removeEventListener("submit", this.submitBubbled, false);
        addEventListener("submit", this.submitBubbled, false);
      };
      this.submitBubbled = (event) => {
        if (!event.defaultPrevented) {
          const form = event.target instanceof HTMLFormElement ? event.target : void 0;
          const submitter = event.submitter || void 0;
          if (form) {
            const method = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formmethod")) || form.getAttribute("method");
            if (method != "dialog" && this.delegate.willSubmitForm(form, submitter)) {
              event.preventDefault();
              this.delegate.formSubmitted(form, submitter);
            }
          }
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("submit", this.submitCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("submit", this.submitCaptured, true);
        this.started = false;
      }
    }
  };
  var FrameRedirector = class {
    constructor(element) {
      this.element = element;
      this.linkInterceptor = new LinkInterceptor(this, element);
      this.formInterceptor = new FormInterceptor(this, element);
    }
    start() {
      this.linkInterceptor.start();
      this.formInterceptor.start();
    }
    stop() {
      this.linkInterceptor.stop();
      this.formInterceptor.stop();
    }
    shouldInterceptLinkClick(element, url) {
      return this.shouldRedirect(element);
    }
    linkClickIntercepted(element, url) {
      const frame = this.findFrameElement(element);
      if (frame) {
        frame.delegate.linkClickIntercepted(element, url);
      }
    }
    shouldInterceptFormSubmission(element, submitter) {
      return this.shouldSubmit(element, submitter);
    }
    formSubmissionIntercepted(element, submitter) {
      const frame = this.findFrameElement(element, submitter);
      if (frame) {
        frame.removeAttribute("reloadable");
        frame.delegate.formSubmissionIntercepted(element, submitter);
      }
    }
    shouldSubmit(form, submitter) {
      var _a;
      const action = getAction(form, submitter);
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const rootLocation = expandURL((_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/");
      return this.shouldRedirect(form, submitter) && locationIsVisitable(action, rootLocation);
    }
    shouldRedirect(element, submitter) {
      const frame = this.findFrameElement(element, submitter);
      return frame ? frame != element.closest("turbo-frame") : false;
    }
    findFrameElement(element, submitter) {
      const id2 = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("data-turbo-frame")) || element.getAttribute("data-turbo-frame");
      if (id2 && id2 != "_top") {
        const frame = this.element.querySelector(`#${id2}:not([disabled])`);
        if (frame instanceof FrameElement) {
          return frame;
        }
      }
    }
  };
  var History = class {
    constructor(delegate) {
      this.restorationIdentifier = uuid();
      this.restorationData = {};
      this.started = false;
      this.pageLoaded = false;
      this.onPopState = (event) => {
        if (this.shouldHandlePopState()) {
          const { turbo } = event.state || {};
          if (turbo) {
            this.location = new URL(window.location.href);
            const { restorationIdentifier } = turbo;
            this.restorationIdentifier = restorationIdentifier;
            this.delegate.historyPoppedToLocationWithRestorationIdentifier(this.location, restorationIdentifier);
          }
        }
      };
      this.onPageLoad = async (event) => {
        await nextMicrotask();
        this.pageLoaded = true;
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("popstate", this.onPopState, false);
        addEventListener("load", this.onPageLoad, false);
        this.started = true;
        this.replace(new URL(window.location.href));
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("popstate", this.onPopState, false);
        removeEventListener("load", this.onPageLoad, false);
        this.started = false;
      }
    }
    push(location2, restorationIdentifier) {
      this.update(history.pushState, location2, restorationIdentifier);
    }
    replace(location2, restorationIdentifier) {
      this.update(history.replaceState, location2, restorationIdentifier);
    }
    update(method, location2, restorationIdentifier = uuid()) {
      const state = { turbo: { restorationIdentifier } };
      method.call(history, state, "", location2.href);
      this.location = location2;
      this.restorationIdentifier = restorationIdentifier;
    }
    getRestorationDataForIdentifier(restorationIdentifier) {
      return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
      const { restorationIdentifier } = this;
      const restorationData = this.restorationData[restorationIdentifier];
      this.restorationData[restorationIdentifier] = Object.assign(Object.assign({}, restorationData), additionalData);
    }
    assumeControlOfScrollRestoration() {
      var _a;
      if (!this.previousScrollRestoration) {
        this.previousScrollRestoration = (_a = history.scrollRestoration) !== null && _a !== void 0 ? _a : "auto";
        history.scrollRestoration = "manual";
      }
    }
    relinquishControlOfScrollRestoration() {
      if (this.previousScrollRestoration) {
        history.scrollRestoration = this.previousScrollRestoration;
        delete this.previousScrollRestoration;
      }
    }
    shouldHandlePopState() {
      return this.pageIsLoaded();
    }
    pageIsLoaded() {
      return this.pageLoaded || document.readyState == "complete";
    }
  };
  var LinkClickObserver = class {
    constructor(delegate) {
      this.started = false;
      this.clickCaptured = () => {
        removeEventListener("click", this.clickBubbled, false);
        addEventListener("click", this.clickBubbled, false);
      };
      this.clickBubbled = (event) => {
        if (this.clickEventIsSignificant(event)) {
          const target = event.composedPath && event.composedPath()[0] || event.target;
          const link = this.findLinkFromClickTarget(target);
          if (link) {
            const location2 = this.getLocationForLink(link);
            if (this.delegate.willFollowLinkToLocation(link, location2)) {
              event.preventDefault();
              this.delegate.followedLinkToLocation(link, location2);
            }
          }
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("click", this.clickCaptured, true);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("click", this.clickCaptured, true);
        this.started = false;
      }
    }
    clickEventIsSignificant(event) {
      return !(event.target && event.target.isContentEditable || event.defaultPrevented || event.which > 1 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    }
    findLinkFromClickTarget(target) {
      if (target instanceof Element) {
        return target.closest("a[href]:not([target^=_]):not([download])");
      }
    }
    getLocationForLink(link) {
      return expandURL(link.getAttribute("href") || "");
    }
  };
  function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
  }
  var Navigator = class {
    constructor(delegate) {
      this.delegate = delegate;
    }
    proposeVisit(location2, options2 = {}) {
      if (this.delegate.allowsVisitingLocationWithAction(location2, options2.action)) {
        if (locationIsVisitable(location2, this.view.snapshot.rootLocation)) {
          this.delegate.visitProposedToLocation(location2, options2);
        } else {
          window.location.href = location2.toString();
        }
      }
    }
    startVisit(locatable, restorationIdentifier, options2 = {}) {
      this.stop();
      this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, Object.assign({ referrer: this.location }, options2));
      this.currentVisit.start();
    }
    submitForm(form, submitter) {
      this.stop();
      this.formSubmission = new FormSubmission(this, form, submitter, true);
      this.formSubmission.start();
    }
    stop() {
      if (this.formSubmission) {
        this.formSubmission.stop();
        delete this.formSubmission;
      }
      if (this.currentVisit) {
        this.currentVisit.cancel();
        delete this.currentVisit;
      }
    }
    get adapter() {
      return this.delegate.adapter;
    }
    get view() {
      return this.delegate.view;
    }
    get history() {
      return this.delegate.history;
    }
    formSubmissionStarted(formSubmission) {
      if (typeof this.adapter.formSubmissionStarted === "function") {
        this.adapter.formSubmissionStarted(formSubmission);
      }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
      if (formSubmission == this.formSubmission) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
          if (formSubmission.method != FetchMethod.get) {
            this.view.clearSnapshotCache();
          }
          const { statusCode, redirected } = fetchResponse;
          const action = this.getActionForFormSubmission(formSubmission);
          const visitOptions = { action, response: { statusCode, responseHTML, redirected } };
          this.proposeVisit(fetchResponse.location, visitOptions);
        }
      }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      const responseHTML = await fetchResponse.responseHTML;
      if (responseHTML) {
        const snapshot = PageSnapshot.fromHTMLString(responseHTML);
        if (fetchResponse.serverError) {
          await this.view.renderError(snapshot);
        } else {
          await this.view.renderPage(snapshot);
        }
        this.view.scrollToTop();
        this.view.clearSnapshotCache();
      }
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished(formSubmission) {
      if (typeof this.adapter.formSubmissionFinished === "function") {
        this.adapter.formSubmissionFinished(formSubmission);
      }
    }
    visitStarted(visit2) {
      this.delegate.visitStarted(visit2);
    }
    visitCompleted(visit2) {
      this.delegate.visitCompleted(visit2);
    }
    locationWithActionIsSamePage(location2, action) {
      const anchor = getAnchor(location2);
      const currentAnchor = getAnchor(this.view.lastRenderedLocation);
      const isRestorationToTop = action === "restore" && typeof anchor === "undefined";
      return action !== "replace" && getRequestURL(location2) === getRequestURL(this.view.lastRenderedLocation) && (isRestorationToTop || anchor != null && anchor !== currentAnchor);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.delegate.visitScrolledToSamePageLocation(oldURL, newURL);
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    getActionForFormSubmission(formSubmission) {
      const { formElement, submitter } = formSubmission;
      const action = getAttribute("data-turbo-action", submitter, formElement);
      return isAction(action) ? action : "advance";
    }
  };
  var PageStage;
  (function(PageStage2) {
    PageStage2[PageStage2["initial"] = 0] = "initial";
    PageStage2[PageStage2["loading"] = 1] = "loading";
    PageStage2[PageStage2["interactive"] = 2] = "interactive";
    PageStage2[PageStage2["complete"] = 3] = "complete";
  })(PageStage || (PageStage = {}));
  var PageObserver = class {
    constructor(delegate) {
      this.stage = PageStage.initial;
      this.started = false;
      this.interpretReadyState = () => {
        const { readyState } = this;
        if (readyState == "interactive") {
          this.pageIsInteractive();
        } else if (readyState == "complete") {
          this.pageIsComplete();
        }
      };
      this.pageWillUnload = () => {
        this.delegate.pageWillUnload();
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        if (this.stage == PageStage.initial) {
          this.stage = PageStage.loading;
        }
        document.addEventListener("readystatechange", this.interpretReadyState, false);
        addEventListener("pagehide", this.pageWillUnload, false);
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        document.removeEventListener("readystatechange", this.interpretReadyState, false);
        removeEventListener("pagehide", this.pageWillUnload, false);
        this.started = false;
      }
    }
    pageIsInteractive() {
      if (this.stage == PageStage.loading) {
        this.stage = PageStage.interactive;
        this.delegate.pageBecameInteractive();
      }
    }
    pageIsComplete() {
      this.pageIsInteractive();
      if (this.stage == PageStage.interactive) {
        this.stage = PageStage.complete;
        this.delegate.pageLoaded();
      }
    }
    get readyState() {
      return document.readyState;
    }
  };
  var ScrollObserver = class {
    constructor(delegate) {
      this.started = false;
      this.onScroll = () => {
        this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        addEventListener("scroll", this.onScroll, false);
        this.onScroll();
        this.started = true;
      }
    }
    stop() {
      if (this.started) {
        removeEventListener("scroll", this.onScroll, false);
        this.started = false;
      }
    }
    updatePosition(position) {
      this.delegate.scrollPositionChanged(position);
    }
  };
  var StreamObserver = class {
    constructor(delegate) {
      this.sources = /* @__PURE__ */ new Set();
      this.started = false;
      this.inspectFetchResponse = (event) => {
        const response = fetchResponseFromEvent(event);
        if (response && fetchResponseIsStream(response)) {
          event.preventDefault();
          this.receiveMessageResponse(response);
        }
      };
      this.receiveMessageEvent = (event) => {
        if (this.started && typeof event.data == "string") {
          this.receiveMessageHTML(event.data);
        }
      };
      this.delegate = delegate;
    }
    start() {
      if (!this.started) {
        this.started = true;
        addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
      }
    }
    connectStreamSource(source) {
      if (!this.streamSourceIsConnected(source)) {
        this.sources.add(source);
        source.addEventListener("message", this.receiveMessageEvent, false);
      }
    }
    disconnectStreamSource(source) {
      if (this.streamSourceIsConnected(source)) {
        this.sources.delete(source);
        source.removeEventListener("message", this.receiveMessageEvent, false);
      }
    }
    streamSourceIsConnected(source) {
      return this.sources.has(source);
    }
    async receiveMessageResponse(response) {
      const html2 = await response.responseHTML;
      if (html2) {
        this.receiveMessageHTML(html2);
      }
    }
    receiveMessageHTML(html2) {
      this.delegate.receivedMessageFromStream(new StreamMessage(html2));
    }
  };
  function fetchResponseFromEvent(event) {
    var _a;
    const fetchResponse = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
      return fetchResponse;
    }
  }
  function fetchResponseIsStream(response) {
    var _a;
    const contentType = (_a = response.contentType) !== null && _a !== void 0 ? _a : "";
    return contentType.startsWith(StreamMessage.contentType);
  }
  var ErrorRenderer = class extends Renderer {
    async render() {
      this.replaceHeadAndBody();
      this.activateScriptElements();
    }
    replaceHeadAndBody() {
      const { documentElement, head, body } = document;
      documentElement.replaceChild(this.newHead, head);
      documentElement.replaceChild(this.newElement, body);
    }
    activateScriptElements() {
      for (const replaceableElement of this.scriptElements) {
        const parentNode = replaceableElement.parentNode;
        if (parentNode) {
          const element = this.createScriptElement(replaceableElement);
          parentNode.replaceChild(element, replaceableElement);
        }
      }
    }
    get newHead() {
      return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
      return [...document.documentElement.querySelectorAll("script")];
    }
  };
  var PageRenderer = class extends Renderer {
    get shouldRender() {
      return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    prepareToRender() {
      this.mergeHead();
    }
    async render() {
      if (this.willRender) {
        this.replaceBody();
      }
    }
    finishRendering() {
      super.finishRendering();
      if (!this.isPreview) {
        this.focusFirstAutofocusableElement();
      }
    }
    get currentHeadSnapshot() {
      return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
      return this.newSnapshot.headSnapshot;
    }
    get newElement() {
      return this.newSnapshot.element;
    }
    mergeHead() {
      this.copyNewHeadStylesheetElements();
      this.copyNewHeadScriptElements();
      this.removeCurrentHeadProvisionalElements();
      this.copyNewHeadProvisionalElements();
    }
    replaceBody() {
      this.preservingPermanentElements(() => {
        this.activateNewBody();
        this.assignNewBody();
      });
    }
    get trackedElementsAreIdentical() {
      return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    copyNewHeadStylesheetElements() {
      for (const element of this.newHeadStylesheetElements) {
        document.head.appendChild(element);
      }
    }
    copyNewHeadScriptElements() {
      for (const element of this.newHeadScriptElements) {
        document.head.appendChild(this.createScriptElement(element));
      }
    }
    removeCurrentHeadProvisionalElements() {
      for (const element of this.currentHeadProvisionalElements) {
        document.head.removeChild(element);
      }
    }
    copyNewHeadProvisionalElements() {
      for (const element of this.newHeadProvisionalElements) {
        document.head.appendChild(element);
      }
    }
    activateNewBody() {
      document.adoptNode(this.newElement);
      this.activateNewBodyScriptElements();
    }
    activateNewBodyScriptElements() {
      for (const inertScriptElement of this.newBodyScriptElements) {
        const activatedScriptElement = this.createScriptElement(inertScriptElement);
        inertScriptElement.replaceWith(activatedScriptElement);
      }
    }
    assignNewBody() {
      if (document.body && this.newElement instanceof HTMLBodyElement) {
        document.body.replaceWith(this.newElement);
      } else {
        document.documentElement.appendChild(this.newElement);
      }
    }
    get newHeadStylesheetElements() {
      return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
      return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
      return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
      return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
      return this.newElement.querySelectorAll("script");
    }
  };
  var SnapshotCache = class {
    constructor(size) {
      this.keys = [];
      this.snapshots = {};
      this.size = size;
    }
    has(location2) {
      return toCacheKey(location2) in this.snapshots;
    }
    get(location2) {
      if (this.has(location2)) {
        const snapshot = this.read(location2);
        this.touch(location2);
        return snapshot;
      }
    }
    put(location2, snapshot) {
      this.write(location2, snapshot);
      this.touch(location2);
      return snapshot;
    }
    clear() {
      this.snapshots = {};
    }
    read(location2) {
      return this.snapshots[toCacheKey(location2)];
    }
    write(location2, snapshot) {
      this.snapshots[toCacheKey(location2)] = snapshot;
    }
    touch(location2) {
      const key = toCacheKey(location2);
      const index = this.keys.indexOf(key);
      if (index > -1)
        this.keys.splice(index, 1);
      this.keys.unshift(key);
      this.trim();
    }
    trim() {
      for (const key of this.keys.splice(this.size)) {
        delete this.snapshots[key];
      }
    }
  };
  var PageView = class extends View {
    constructor() {
      super(...arguments);
      this.snapshotCache = new SnapshotCache(10);
      this.lastRenderedLocation = new URL(location.href);
    }
    renderPage(snapshot, isPreview = false, willRender = true) {
      const renderer = new PageRenderer(this.snapshot, snapshot, isPreview, willRender);
      return this.render(renderer);
    }
    renderError(snapshot) {
      const renderer = new ErrorRenderer(this.snapshot, snapshot, false);
      return this.render(renderer);
    }
    clearSnapshotCache() {
      this.snapshotCache.clear();
    }
    async cacheSnapshot() {
      if (this.shouldCacheSnapshot) {
        this.delegate.viewWillCacheSnapshot();
        const { snapshot, lastRenderedLocation: location2 } = this;
        await nextEventLoopTick();
        const cachedSnapshot = snapshot.clone();
        this.snapshotCache.put(location2, cachedSnapshot);
        return cachedSnapshot;
      }
    }
    getCachedSnapshotForLocation(location2) {
      return this.snapshotCache.get(location2);
    }
    get snapshot() {
      return PageSnapshot.fromElement(this.element);
    }
    get shouldCacheSnapshot() {
      return this.snapshot.isCacheable;
    }
  };
  var Session = class {
    constructor() {
      this.navigator = new Navigator(this);
      this.history = new History(this);
      this.view = new PageView(this, document.documentElement);
      this.adapter = new BrowserAdapter(this);
      this.pageObserver = new PageObserver(this);
      this.cacheObserver = new CacheObserver();
      this.linkClickObserver = new LinkClickObserver(this);
      this.formSubmitObserver = new FormSubmitObserver(this);
      this.scrollObserver = new ScrollObserver(this);
      this.streamObserver = new StreamObserver(this);
      this.frameRedirector = new FrameRedirector(document.documentElement);
      this.drive = true;
      this.enabled = true;
      this.progressBarDelay = 500;
      this.started = false;
    }
    start() {
      if (!this.started) {
        this.pageObserver.start();
        this.cacheObserver.start();
        this.linkClickObserver.start();
        this.formSubmitObserver.start();
        this.scrollObserver.start();
        this.streamObserver.start();
        this.frameRedirector.start();
        this.history.start();
        this.started = true;
        this.enabled = true;
      }
    }
    disable() {
      this.enabled = false;
    }
    stop() {
      if (this.started) {
        this.pageObserver.stop();
        this.cacheObserver.stop();
        this.linkClickObserver.stop();
        this.formSubmitObserver.stop();
        this.scrollObserver.stop();
        this.streamObserver.stop();
        this.frameRedirector.stop();
        this.history.stop();
        this.started = false;
      }
    }
    registerAdapter(adapter) {
      this.adapter = adapter;
    }
    visit(location2, options2 = {}) {
      this.navigator.proposeVisit(expandURL(location2), options2);
    }
    connectStreamSource(source) {
      this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
      this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
      document.documentElement.appendChild(StreamMessage.wrap(message).fragment);
    }
    clearCache() {
      this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
      this.progressBarDelay = delay;
    }
    get location() {
      return this.history.location;
    }
    get restorationIdentifier() {
      return this.history.restorationIdentifier;
    }
    historyPoppedToLocationWithRestorationIdentifier(location2, restorationIdentifier) {
      if (this.enabled) {
        this.navigator.startVisit(location2, restorationIdentifier, { action: "restore", historyChanged: true });
      } else {
        this.adapter.pageInvalidated();
      }
    }
    scrollPositionChanged(position) {
      this.history.updateRestorationData({ scrollPosition: position });
    }
    willFollowLinkToLocation(link, location2) {
      return this.elementDriveEnabled(link) && locationIsVisitable(location2, this.snapshot.rootLocation) && this.applicationAllowsFollowingLinkToLocation(link, location2);
    }
    followedLinkToLocation(link, location2) {
      const action = this.getActionForLink(link);
      this.convertLinkWithMethodClickToFormSubmission(link) || this.visit(location2.href, { action });
    }
    convertLinkWithMethodClickToFormSubmission(link) {
      const linkMethod = link.getAttribute("data-turbo-method");
      if (linkMethod) {
        const form = document.createElement("form");
        form.method = linkMethod;
        form.action = link.getAttribute("href") || "undefined";
        form.hidden = true;
        if (link.hasAttribute("data-turbo-confirm")) {
          form.setAttribute("data-turbo-confirm", link.getAttribute("data-turbo-confirm"));
        }
        const frame = this.getTargetFrameForLink(link);
        if (frame) {
          form.setAttribute("data-turbo-frame", frame);
          form.addEventListener("turbo:submit-start", () => form.remove());
        } else {
          form.addEventListener("submit", () => form.remove());
        }
        document.body.appendChild(form);
        return dispatch("submit", { cancelable: true, target: form });
      } else {
        return false;
      }
    }
    allowsVisitingLocationWithAction(location2, action) {
      return this.locationWithActionIsSamePage(location2, action) || this.applicationAllowsVisitingLocation(location2);
    }
    visitProposedToLocation(location2, options2) {
      extendURLWithDeprecatedProperties(location2);
      this.adapter.visitProposedToLocation(location2, options2);
    }
    visitStarted(visit2) {
      extendURLWithDeprecatedProperties(visit2.location);
      if (!visit2.silent) {
        this.notifyApplicationAfterVisitingLocation(visit2.location, visit2.action);
      }
    }
    visitCompleted(visit2) {
      this.notifyApplicationAfterPageLoad(visit2.getTimingMetrics());
    }
    locationWithActionIsSamePage(location2, action) {
      return this.navigator.locationWithActionIsSamePage(location2, action);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
      this.notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL);
    }
    willSubmitForm(form, submitter) {
      const action = getAction(form, submitter);
      return this.elementDriveEnabled(form) && (!submitter || this.elementDriveEnabled(submitter)) && locationIsVisitable(expandURL(action), this.snapshot.rootLocation);
    }
    formSubmitted(form, submitter) {
      this.navigator.submitForm(form, submitter);
    }
    pageBecameInteractive() {
      this.view.lastRenderedLocation = this.location;
      this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
      this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
      this.history.relinquishControlOfScrollRestoration();
    }
    receivedMessageFromStream(message) {
      this.renderStreamMessage(message);
    }
    viewWillCacheSnapshot() {
      var _a;
      if (!((_a = this.navigator.currentVisit) === null || _a === void 0 ? void 0 : _a.silent)) {
        this.notifyApplicationBeforeCachingSnapshot();
      }
    }
    allowsImmediateRender({ element }, resume) {
      const event = this.notifyApplicationBeforeRender(element, resume);
      return !event.defaultPrevented;
    }
    viewRenderedSnapshot(snapshot, isPreview) {
      this.view.lastRenderedLocation = this.history.location;
      this.notifyApplicationAfterRender();
    }
    viewInvalidated() {
      this.adapter.pageInvalidated();
    }
    frameLoaded(frame) {
      this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
      this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    applicationAllowsFollowingLinkToLocation(link, location2) {
      const event = this.notifyApplicationAfterClickingLinkToLocation(link, location2);
      return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location2) {
      const event = this.notifyApplicationBeforeVisitingLocation(location2);
      return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location2) {
      return dispatch("turbo:click", { target: link, detail: { url: location2.href }, cancelable: true });
    }
    notifyApplicationBeforeVisitingLocation(location2) {
      return dispatch("turbo:before-visit", { detail: { url: location2.href }, cancelable: true });
    }
    notifyApplicationAfterVisitingLocation(location2, action) {
      markAsBusy(document.documentElement);
      return dispatch("turbo:visit", { detail: { url: location2.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
      return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, resume) {
      return dispatch("turbo:before-render", { detail: { newBody, resume }, cancelable: true });
    }
    notifyApplicationAfterRender() {
      return dispatch("turbo:render");
    }
    notifyApplicationAfterPageLoad(timing = {}) {
      clearBusyState(document.documentElement);
      return dispatch("turbo:load", { detail: { url: this.location.href, timing } });
    }
    notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL) {
      dispatchEvent(new HashChangeEvent("hashchange", { oldURL: oldURL.toString(), newURL: newURL.toString() }));
    }
    notifyApplicationAfterFrameLoad(frame) {
      return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
      return dispatch("turbo:frame-render", { detail: { fetchResponse }, target: frame, cancelable: true });
    }
    elementDriveEnabled(element) {
      const container = element === null || element === void 0 ? void 0 : element.closest("[data-turbo]");
      if (this.drive) {
        if (container) {
          return container.getAttribute("data-turbo") != "false";
        } else {
          return true;
        }
      } else {
        if (container) {
          return container.getAttribute("data-turbo") == "true";
        } else {
          return false;
        }
      }
    }
    getActionForLink(link) {
      const action = link.getAttribute("data-turbo-action");
      return isAction(action) ? action : "advance";
    }
    getTargetFrameForLink(link) {
      const frame = link.getAttribute("data-turbo-frame");
      if (frame) {
        return frame;
      } else {
        const container = link.closest("turbo-frame");
        if (container) {
          return container.id;
        }
      }
    }
    get snapshot() {
      return this.view.snapshot;
    }
  };
  function extendURLWithDeprecatedProperties(url) {
    Object.defineProperties(url, deprecatedLocationPropertyDescriptors);
  }
  var deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
      get() {
        return this.toString();
      }
    }
  };
  var session = new Session();
  var { navigator: navigator$1 } = session;
  function start() {
    session.start();
  }
  function registerAdapter(adapter) {
    session.registerAdapter(adapter);
  }
  function visit(location2, options2) {
    session.visit(location2, options2);
  }
  function connectStreamSource(source) {
    session.connectStreamSource(source);
  }
  function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
  }
  function renderStreamMessage(message) {
    session.renderStreamMessage(message);
  }
  function clearCache() {
    session.clearCache();
  }
  function setProgressBarDelay(delay) {
    session.setProgressBarDelay(delay);
  }
  function setConfirmMethod(confirmMethod) {
    FormSubmission.confirmMethod = confirmMethod;
  }
  var Turbo = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    navigator: navigator$1,
    session,
    PageRenderer,
    PageSnapshot,
    start,
    registerAdapter,
    visit,
    connectStreamSource,
    disconnectStreamSource,
    renderStreamMessage,
    clearCache,
    setProgressBarDelay,
    setConfirmMethod
  });
  var FrameController = class {
    constructor(element) {
      this.fetchResponseLoaded = (fetchResponse) => {
      };
      this.currentFetchRequest = null;
      this.resolveVisitPromise = () => {
      };
      this.connected = false;
      this.hasBeenLoaded = false;
      this.settingSourceURL = false;
      this.element = element;
      this.view = new FrameView(this, this.element);
      this.appearanceObserver = new AppearanceObserver(this, this.element);
      this.linkInterceptor = new LinkInterceptor(this, this.element);
      this.formInterceptor = new FormInterceptor(this, this.element);
    }
    connect() {
      if (!this.connected) {
        this.connected = true;
        this.reloadable = false;
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
          this.appearanceObserver.start();
        }
        this.linkInterceptor.start();
        this.formInterceptor.start();
        this.sourceURLChanged();
      }
    }
    disconnect() {
      if (this.connected) {
        this.connected = false;
        this.appearanceObserver.stop();
        this.linkInterceptor.stop();
        this.formInterceptor.stop();
      }
    }
    disabledChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager) {
        this.loadSourceURL();
      }
    }
    sourceURLChanged() {
      if (this.loadingStyle == FrameLoadingStyle.eager || this.hasBeenLoaded) {
        this.loadSourceURL();
      }
    }
    loadingStyleChanged() {
      if (this.loadingStyle == FrameLoadingStyle.lazy) {
        this.appearanceObserver.start();
      } else {
        this.appearanceObserver.stop();
        this.loadSourceURL();
      }
    }
    async loadSourceURL() {
      if (!this.settingSourceURL && this.enabled && this.isActive && (this.reloadable || this.sourceURL != this.currentURL)) {
        const previousURL = this.currentURL;
        this.currentURL = this.sourceURL;
        if (this.sourceURL) {
          try {
            this.element.loaded = this.visit(expandURL(this.sourceURL));
            this.appearanceObserver.stop();
            await this.element.loaded;
            this.hasBeenLoaded = true;
          } catch (error2) {
            this.currentURL = previousURL;
            throw error2;
          }
        }
      }
    }
    async loadResponse(fetchResponse) {
      if (fetchResponse.redirected || fetchResponse.succeeded && fetchResponse.isHTML) {
        this.sourceURL = fetchResponse.response.url;
      }
      try {
        const html2 = await fetchResponse.responseHTML;
        if (html2) {
          const { body } = parseHTMLDocument(html2);
          const snapshot = new Snapshot(await this.extractForeignFrameElement(body));
          const renderer = new FrameRenderer(this.view.snapshot, snapshot, false, false);
          if (this.view.renderPromise)
            await this.view.renderPromise;
          await this.view.render(renderer);
          session.frameRendered(fetchResponse, this.element);
          session.frameLoaded(this.element);
          this.fetchResponseLoaded(fetchResponse);
        }
      } catch (error2) {
        console.error(error2);
        this.view.invalidate();
      } finally {
        this.fetchResponseLoaded = () => {
        };
      }
    }
    elementAppearedInViewport(element) {
      this.loadSourceURL();
    }
    shouldInterceptLinkClick(element, url) {
      if (element.hasAttribute("data-turbo-method")) {
        return false;
      } else {
        return this.shouldInterceptNavigation(element);
      }
    }
    linkClickIntercepted(element, url) {
      this.reloadable = true;
      this.navigateFrame(element, url);
    }
    shouldInterceptFormSubmission(element, submitter) {
      return this.shouldInterceptNavigation(element, submitter);
    }
    formSubmissionIntercepted(element, submitter) {
      if (this.formSubmission) {
        this.formSubmission.stop();
      }
      this.reloadable = false;
      this.formSubmission = new FormSubmission(this, element, submitter);
      const { fetchRequest } = this.formSubmission;
      this.prepareHeadersForRequest(fetchRequest.headers, fetchRequest);
      this.formSubmission.start();
    }
    prepareHeadersForRequest(headers, request) {
      headers["Turbo-Frame"] = this.id;
    }
    requestStarted(request) {
      markAsBusy(this.element);
    }
    requestPreventedHandlingResponse(request, response) {
      this.resolveVisitPromise();
    }
    async requestSucceededWithResponse(request, response) {
      await this.loadResponse(response);
      this.resolveVisitPromise();
    }
    requestFailedWithResponse(request, response) {
      console.error(response);
      this.resolveVisitPromise();
    }
    requestErrored(request, error2) {
      console.error(error2);
      this.resolveVisitPromise();
    }
    requestFinished(request) {
      clearBusyState(this.element);
    }
    formSubmissionStarted({ formElement }) {
      markAsBusy(formElement, this.findFrameElement(formElement));
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
      const frame = this.findFrameElement(formSubmission.formElement, formSubmission.submitter);
      this.proposeVisitIfNavigatedWithAction(frame, formSubmission.formElement, formSubmission.submitter);
      frame.delegate.loadResponse(response);
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
      this.element.delegate.loadResponse(fetchResponse);
    }
    formSubmissionErrored(formSubmission, error2) {
      console.error(error2);
    }
    formSubmissionFinished({ formElement }) {
      clearBusyState(formElement, this.findFrameElement(formElement));
    }
    allowsImmediateRender(snapshot, resume) {
      return true;
    }
    viewRenderedSnapshot(snapshot, isPreview) {
    }
    viewInvalidated() {
    }
    async visit(url) {
      var _a;
      const request = new FetchRequest(this, FetchMethod.get, url, new URLSearchParams(), this.element);
      (_a = this.currentFetchRequest) === null || _a === void 0 ? void 0 : _a.cancel();
      this.currentFetchRequest = request;
      return new Promise((resolve) => {
        this.resolveVisitPromise = () => {
          this.resolveVisitPromise = () => {
          };
          this.currentFetchRequest = null;
          resolve();
        };
        request.perform();
      });
    }
    navigateFrame(element, url, submitter) {
      const frame = this.findFrameElement(element, submitter);
      this.proposeVisitIfNavigatedWithAction(frame, element, submitter);
      frame.setAttribute("reloadable", "");
      frame.src = url;
    }
    proposeVisitIfNavigatedWithAction(frame, element, submitter) {
      const action = getAttribute("data-turbo-action", submitter, element, frame);
      if (isAction(action)) {
        const { visitCachedSnapshot } = new SnapshotSubstitution(frame);
        frame.delegate.fetchResponseLoaded = (fetchResponse) => {
          if (frame.src) {
            const { statusCode, redirected } = fetchResponse;
            const responseHTML = frame.ownerDocument.documentElement.outerHTML;
            const response = { statusCode, redirected, responseHTML };
            session.visit(frame.src, { action, response, visitCachedSnapshot, willRender: false });
          }
        };
      }
    }
    findFrameElement(element, submitter) {
      var _a;
      const id2 = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      return (_a = getFrameElementById(id2)) !== null && _a !== void 0 ? _a : this.element;
    }
    async extractForeignFrameElement(container) {
      let element;
      const id2 = CSS.escape(this.id);
      try {
        if (element = activateElement(container.querySelector(`turbo-frame#${id2}`), this.currentURL)) {
          return element;
        }
        if (element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id2}]`), this.currentURL)) {
          await element.loaded;
          return await this.extractForeignFrameElement(element);
        }
        console.error(`Response has no matching <turbo-frame id="${id2}"> element`);
      } catch (error2) {
        console.error(error2);
      }
      return new FrameElement();
    }
    formActionIsVisitable(form, submitter) {
      const action = getAction(form, submitter);
      return locationIsVisitable(expandURL(action), this.rootLocation);
    }
    shouldInterceptNavigation(element, submitter) {
      const id2 = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
      if (element instanceof HTMLFormElement && !this.formActionIsVisitable(element, submitter)) {
        return false;
      }
      if (!this.enabled || id2 == "_top") {
        return false;
      }
      if (id2) {
        const frameElement = getFrameElementById(id2);
        if (frameElement) {
          return !frameElement.disabled;
        }
      }
      if (!session.elementDriveEnabled(element)) {
        return false;
      }
      if (submitter && !session.elementDriveEnabled(submitter)) {
        return false;
      }
      return true;
    }
    get id() {
      return this.element.id;
    }
    get enabled() {
      return !this.element.disabled;
    }
    get sourceURL() {
      if (this.element.src) {
        return this.element.src;
      }
    }
    get reloadable() {
      const frame = this.findFrameElement(this.element);
      return frame.hasAttribute("reloadable");
    }
    set reloadable(value) {
      const frame = this.findFrameElement(this.element);
      if (value) {
        frame.setAttribute("reloadable", "");
      } else {
        frame.removeAttribute("reloadable");
      }
    }
    set sourceURL(sourceURL) {
      this.settingSourceURL = true;
      this.element.src = sourceURL !== null && sourceURL !== void 0 ? sourceURL : null;
      this.currentURL = this.element.src;
      this.settingSourceURL = false;
    }
    get loadingStyle() {
      return this.element.loading;
    }
    get isLoading() {
      return this.formSubmission !== void 0 || this.resolveVisitPromise() !== void 0;
    }
    get isActive() {
      return this.element.isActive && this.connected;
    }
    get rootLocation() {
      var _a;
      const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
      const root = (_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/";
      return expandURL(root);
    }
  };
  var SnapshotSubstitution = class {
    constructor(element) {
      this.visitCachedSnapshot = ({ element: element2 }) => {
        var _a;
        const { id: id2, clone } = this;
        (_a = element2.querySelector("#" + id2)) === null || _a === void 0 ? void 0 : _a.replaceWith(clone);
      };
      this.clone = element.cloneNode(true);
      this.id = element.id;
    }
  };
  function getFrameElementById(id2) {
    if (id2 != null) {
      const element = document.getElementById(id2);
      if (element instanceof FrameElement) {
        return element;
      }
    }
  }
  function activateElement(element, currentURL) {
    if (element) {
      const src = element.getAttribute("src");
      if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
        throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
      }
      if (element.ownerDocument !== document) {
        element = document.importNode(element, true);
      }
      if (element instanceof FrameElement) {
        element.connectedCallback();
        element.disconnectedCallback();
        return element;
      }
    }
  }
  var StreamActions = {
    after() {
      this.targetElements.forEach((e) => {
        var _a;
        return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e.nextSibling);
      });
    },
    append() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.append(this.templateContent));
    },
    before() {
      this.targetElements.forEach((e) => {
        var _a;
        return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e);
      });
    },
    prepend() {
      this.removeDuplicateTargetChildren();
      this.targetElements.forEach((e) => e.prepend(this.templateContent));
    },
    remove() {
      this.targetElements.forEach((e) => e.remove());
    },
    replace() {
      this.targetElements.forEach((e) => e.replaceWith(this.templateContent));
    },
    update() {
      this.targetElements.forEach((e) => {
        e.innerHTML = "";
        e.append(this.templateContent);
      });
    }
  };
  var StreamElement = class extends HTMLElement {
    async connectedCallback() {
      try {
        await this.render();
      } catch (error2) {
        console.error(error2);
      } finally {
        this.disconnect();
      }
    }
    async render() {
      var _a;
      return (_a = this.renderPromise) !== null && _a !== void 0 ? _a : this.renderPromise = (async () => {
        if (this.dispatchEvent(this.beforeRenderEvent)) {
          await nextAnimationFrame();
          this.performAction();
        }
      })();
    }
    disconnect() {
      try {
        this.remove();
      } catch (_a) {
      }
    }
    removeDuplicateTargetChildren() {
      this.duplicateChildren.forEach((c) => c.remove());
    }
    get duplicateChildren() {
      var _a;
      const existingChildren = this.targetElements.flatMap((e) => [...e.children]).filter((c) => !!c.id);
      const newChildrenIds = [...(_a = this.templateContent) === null || _a === void 0 ? void 0 : _a.children].filter((c) => !!c.id).map((c) => c.id);
      return existingChildren.filter((c) => newChildrenIds.includes(c.id));
    }
    get performAction() {
      if (this.action) {
        const actionFunction = StreamActions[this.action];
        if (actionFunction) {
          return actionFunction;
        }
        this.raise("unknown action");
      }
      this.raise("action attribute is missing");
    }
    get targetElements() {
      if (this.target) {
        return this.targetElementsById;
      } else if (this.targets) {
        return this.targetElementsByQuery;
      } else {
        this.raise("target or targets attribute is missing");
      }
    }
    get templateContent() {
      return this.templateElement.content.cloneNode(true);
    }
    get templateElement() {
      if (this.firstElementChild instanceof HTMLTemplateElement) {
        return this.firstElementChild;
      }
      this.raise("first child element must be a <template> element");
    }
    get action() {
      return this.getAttribute("action");
    }
    get target() {
      return this.getAttribute("target");
    }
    get targets() {
      return this.getAttribute("targets");
    }
    raise(message) {
      throw new Error(`${this.description}: ${message}`);
    }
    get description() {
      var _a, _b;
      return (_b = ((_a = this.outerHTML.match(/<[^>]+>/)) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : "<turbo-stream>";
    }
    get beforeRenderEvent() {
      return new CustomEvent("turbo:before-stream-render", { bubbles: true, cancelable: true });
    }
    get targetElementsById() {
      var _a;
      const element = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.getElementById(this.target);
      if (element !== null) {
        return [element];
      } else {
        return [];
      }
    }
    get targetElementsByQuery() {
      var _a;
      const elements = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.querySelectorAll(this.targets);
      if (elements.length !== 0) {
        return Array.prototype.slice.call(elements);
      } else {
        return [];
      }
    }
  };
  FrameElement.delegateConstructor = FrameController;
  customElements.define("turbo-frame", FrameElement);
  customElements.define("turbo-stream", StreamElement);
  (() => {
    let element = document.currentScript;
    if (!element)
      return;
    if (element.hasAttribute("data-turbo-suppress-warning"))
      return;
    while (element = element.parentElement) {
      if (element == document.body) {
        return console.warn(unindent`
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `, element.outerHTML);
      }
    }
  })();
  window.Turbo = Turbo;
  start();

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable.js
  var consumer;
  async function getConsumer() {
    return consumer || setConsumer(createConsumer2().then(setConsumer));
  }
  function setConsumer(newConsumer) {
    return consumer = newConsumer;
  }
  async function createConsumer2() {
    const { createConsumer: createConsumer3 } = await Promise.resolve().then(() => (init_src(), src_exports));
    return createConsumer3();
  }
  async function subscribeTo(channel, mixin) {
    const { subscriptions } = await getConsumer();
    return subscriptions.create(channel, mixin);
  }

  // node_modules/@hotwired/turbo-rails/app/javascript/turbo/cable_stream_source_element.js
  var TurboCableStreamSourceElement = class extends HTMLElement {
    async connectedCallback() {
      connectStreamSource(this);
      this.subscription = await subscribeTo(this.channel, { received: this.dispatchMessageEvent.bind(this) });
    }
    disconnectedCallback() {
      disconnectStreamSource(this);
      if (this.subscription)
        this.subscription.unsubscribe();
    }
    dispatchMessageEvent(data) {
      const event = new MessageEvent("message", { data });
      return this.dispatchEvent(event);
    }
    get channel() {
      const channel = this.getAttribute("channel");
      const signed_stream_name = this.getAttribute("signed-stream-name");
      return { channel, signed_stream_name };
    }
  };
  customElements.define("turbo-cable-stream-source", TurboCableStreamSourceElement);

  // app/javascript/controllers/comment_controller.js
  var comment_controller_default = class extends Controller {
    connect() {
    }
    post(event) {
      event.preventDefault();
      if (event.ctrlKey && event.keyCode == 13) {
        turbo_es2017_esm_exports.navigator.submitForm(this.formTarget);
        this.inputTextTarget.value = "";
      }
    }
  };
  __publicField(comment_controller_default, "targets", ["form", "inputText"]);

  // app/javascript/controllers/post_controller.js
  var post_controller_default = class extends Controller {
    connect() {
      document.addEventListener("trix-file-accept", (event) => {
        event.preventDefault();
      });
    }
  };

  // app/javascript/controllers/index.js
  application.register("comment", comment_controller_default);
  application.register("post", post_controller_default);

  // node_modules/trix/dist/trix.js
  var version = "2.0.0-alpha.1";
  var attachmentSelector = "[data-trix-attachment]";
  var attachments = {
    preview: {
      presentation: "gallery",
      caption: {
        name: true,
        size: true
      }
    },
    file: {
      caption: {
        size: true
      }
    }
  };
  var attributes = {
    default: {
      tagName: "div",
      parse: false
    },
    quote: {
      tagName: "blockquote",
      nestable: true
    },
    heading1: {
      tagName: "h1",
      terminal: true,
      breakOnReturn: true,
      group: false
    },
    code: {
      tagName: "pre",
      terminal: true,
      text: {
        plaintext: true
      }
    },
    bulletList: {
      tagName: "ul",
      parse: false
    },
    bullet: {
      tagName: "li",
      listAttribute: "bulletList",
      group: false,
      nestable: true,
      test(element) {
        return tagName$1(element.parentNode) === attributes[this.listAttribute].tagName;
      }
    },
    numberList: {
      tagName: "ol",
      parse: false
    },
    number: {
      tagName: "li",
      listAttribute: "numberList",
      group: false,
      nestable: true,
      test(element) {
        return tagName$1(element.parentNode) === attributes[this.listAttribute].tagName;
      }
    },
    attachmentGallery: {
      tagName: "div",
      exclusive: true,
      terminal: true,
      parse: false,
      group: false
    }
  };
  var tagName$1 = (element) => {
    var _element$tagName;
    return element === null || element === void 0 ? void 0 : (_element$tagName = element.tagName) === null || _element$tagName === void 0 ? void 0 : _element$tagName.toLowerCase();
  };
  var browser$1 = {
    composesExistingText: /Android.*Chrome/.test(navigator.userAgent),
    forcesObjectResizing: /Trident.*rv:11/.test(navigator.userAgent),
    supportsInputEvents: function() {
      if (typeof InputEvent === "undefined") {
        return false;
      }
      for (const property of ["data", "getTargetRanges", "inputType"]) {
        if (!(property in InputEvent.prototype)) {
          return false;
        }
      }
      return true;
    }()
  };
  var css$3 = {
    attachment: "attachment",
    attachmentCaption: "attachment__caption",
    attachmentCaptionEditor: "attachment__caption-editor",
    attachmentMetadata: "attachment__metadata",
    attachmentMetadataContainer: "attachment__metadata-container",
    attachmentName: "attachment__name",
    attachmentProgress: "attachment__progress",
    attachmentSize: "attachment__size",
    attachmentToolbar: "attachment__toolbar",
    attachmentGallery: "attachment-gallery"
  };
  var lang$1 = {
    attachFiles: "Attach Files",
    bold: "Bold",
    bullets: "Bullets",
    byte: "Byte",
    bytes: "Bytes",
    captionPlaceholder: "Add a caption\u2026",
    code: "Code",
    heading1: "Heading",
    indent: "Increase Level",
    italic: "Italic",
    link: "Link",
    numbers: "Numbers",
    outdent: "Decrease Level",
    quote: "Quote",
    redo: "Redo",
    remove: "Remove",
    strike: "Strikethrough",
    undo: "Undo",
    unlink: "Unlink",
    url: "URL",
    urlPlaceholder: "Enter a URL\u2026",
    GB: "GB",
    KB: "KB",
    MB: "MB",
    PB: "PB",
    TB: "TB"
  };
  var sizes = [lang$1.bytes, lang$1.KB, lang$1.MB, lang$1.GB, lang$1.TB, lang$1.PB];
  var fileSize = {
    prefix: "IEC",
    precision: 2,
    formatter(number) {
      switch (number) {
        case 0:
          return "0 ".concat(lang$1.bytes);
        case 1:
          return "1 ".concat(lang$1.byte);
        default:
          let base;
          if (this.prefix === "SI") {
            base = 1e3;
          } else if (this.prefix === "IEC") {
            base = 1024;
          }
          const exp = Math.floor(Math.log(number) / Math.log(base));
          const humanSize = number / Math.pow(base, exp);
          const string = humanSize.toFixed(this.precision);
          const withoutInsignificantZeros = string.replace(/0*$/, "").replace(/\.$/, "");
          return "".concat(withoutInsignificantZeros, " ").concat(sizes[exp]);
      }
    }
  };
  var ZERO_WIDTH_SPACE = "\uFEFF";
  var NON_BREAKING_SPACE = "\xA0";
  var OBJECT_REPLACEMENT_CHARACTER = "\uFFFC";
  var extend3 = function(properties) {
    for (const key in properties) {
      const value = properties[key];
      this[key] = value;
    }
    return this;
  };
  var html = document.documentElement;
  var match = html.matches;
  var handleEvent = function(eventName) {
    let {
      onElement,
      matchingSelector,
      withCallback,
      inPhase,
      preventDefault,
      times
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const element = onElement ? onElement : html;
    const selector = matchingSelector;
    const useCapture = inPhase === "capturing";
    const handler = function(event) {
      if (times != null && --times === 0) {
        handler.destroy();
      }
      const target = findClosestElementFromNode(event.target, {
        matchingSelector: selector
      });
      if (target != null) {
        withCallback === null || withCallback === void 0 ? void 0 : withCallback.call(target, event, target);
        if (preventDefault) {
          event.preventDefault();
        }
      }
    };
    handler.destroy = () => element.removeEventListener(eventName, handler, useCapture);
    element.addEventListener(eventName, handler, useCapture);
    return handler;
  };
  var handleEventOnce = function(eventName) {
    let options2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    options2.times = 1;
    return handleEvent(eventName, options2);
  };
  var triggerEvent = function(eventName) {
    let {
      onElement,
      bubbles,
      cancelable,
      attributes: attributes2
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const element = onElement != null ? onElement : html;
    bubbles = bubbles !== false;
    cancelable = cancelable !== false;
    const event = document.createEvent("Events");
    event.initEvent(eventName, bubbles, cancelable);
    if (attributes2 != null) {
      extend3.call(event, attributes2);
    }
    return element.dispatchEvent(event);
  };
  var elementMatchesSelector = function(element, selector) {
    if ((element === null || element === void 0 ? void 0 : element.nodeType) === 1) {
      return match.call(element, selector);
    }
  };
  var findClosestElementFromNode = function(node) {
    let {
      matchingSelector,
      untilNode
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    while (node && node.nodeType !== Node.ELEMENT_NODE) {
      node = node.parentNode;
    }
    if (node == null) {
      return;
    }
    if (matchingSelector != null) {
      if (node.closest && untilNode == null) {
        return node.closest(matchingSelector);
      } else {
        while (node && node !== untilNode) {
          if (elementMatchesSelector(node, matchingSelector)) {
            return node;
          }
          node = node.parentNode;
        }
      }
    } else {
      return node;
    }
  };
  var findInnerElement = function(element) {
    while ((_element = element) !== null && _element !== void 0 && _element.firstElementChild) {
      var _element;
      element = element.firstElementChild;
    }
    return element;
  };
  var innerElementIsActive = (element) => document.activeElement !== element && elementContainsNode(element, document.activeElement);
  var elementContainsNode = function(element, node) {
    if (!element || !node) {
      return;
    }
    while (node) {
      if (node === element) {
        return true;
      }
      node = node.parentNode;
    }
  };
  var findChildIndexOfNode = function(node) {
    var _node;
    if (!((_node = node) !== null && _node !== void 0 && _node.parentNode)) {
      return;
    }
    let childIndex = 0;
    node = node.previousSibling;
    while (node) {
      childIndex++;
      node = node.previousSibling;
    }
    return childIndex;
  };
  var removeNode = (node) => {
    var _node$parentNode;
    return node === null || node === void 0 ? void 0 : (_node$parentNode = node.parentNode) === null || _node$parentNode === void 0 ? void 0 : _node$parentNode.removeChild(node);
  };
  var walkTree = function(tree) {
    let {
      onlyNodesOfType,
      usingFilter,
      expandEntityReferences
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const whatToShow = (() => {
      switch (onlyNodesOfType) {
        case "element":
          return NodeFilter.SHOW_ELEMENT;
        case "text":
          return NodeFilter.SHOW_TEXT;
        case "comment":
          return NodeFilter.SHOW_COMMENT;
        default:
          return NodeFilter.SHOW_ALL;
      }
    })();
    return document.createTreeWalker(tree, whatToShow, usingFilter != null ? usingFilter : null, expandEntityReferences === true);
  };
  var tagName = (element) => {
    var _element$tagName;
    return element === null || element === void 0 ? void 0 : (_element$tagName = element.tagName) === null || _element$tagName === void 0 ? void 0 : _element$tagName.toLowerCase();
  };
  var makeElement = function(tag) {
    let options2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let key, value;
    if (typeof tag === "object") {
      options2 = tag;
      tag = options2.tagName;
    } else {
      options2 = {
        attributes: options2
      };
    }
    const element = document.createElement(tag);
    if (options2.editable != null) {
      if (options2.attributes == null) {
        options2.attributes = {};
      }
      options2.attributes.contenteditable = options2.editable;
    }
    if (options2.attributes) {
      for (key in options2.attributes) {
        value = options2.attributes[key];
        element.setAttribute(key, value);
      }
    }
    if (options2.style) {
      for (key in options2.style) {
        value = options2.style[key];
        element.style[key] = value;
      }
    }
    if (options2.data) {
      for (key in options2.data) {
        value = options2.data[key];
        element.dataset[key] = value;
      }
    }
    if (options2.className) {
      options2.className.split(" ").forEach((className) => {
        element.classList.add(className);
      });
    }
    if (options2.textContent) {
      element.textContent = options2.textContent;
    }
    if (options2.childNodes) {
      [].concat(options2.childNodes).forEach((childNode) => {
        element.appendChild(childNode);
      });
    }
    return element;
  };
  var blockTagNames = void 0;
  var getBlockTagNames = function() {
    if (blockTagNames != null) {
      return blockTagNames;
    }
    blockTagNames = [];
    for (const key in attributes) {
      const attributes$1 = attributes[key];
      if (attributes$1.tagName) {
        blockTagNames.push(attributes$1.tagName);
      }
    }
    return blockTagNames;
  };
  var nodeIsBlockContainer = (node) => nodeIsBlockStartComment(node === null || node === void 0 ? void 0 : node.firstChild);
  var nodeProbablyIsBlockContainer = function(node) {
    return getBlockTagNames().includes(tagName(node)) && !getBlockTagNames().includes(tagName(node.firstChild));
  };
  var nodeIsBlockStart = function(node) {
    let {
      strict
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
      strict: true
    };
    if (strict) {
      return nodeIsBlockStartComment(node);
    } else {
      return nodeIsBlockStartComment(node) || !nodeIsBlockStartComment(node.firstChild) && nodeProbablyIsBlockContainer(node);
    }
  };
  var nodeIsBlockStartComment = (node) => nodeIsCommentNode(node) && (node === null || node === void 0 ? void 0 : node.data) === "block";
  var nodeIsCommentNode = (node) => (node === null || node === void 0 ? void 0 : node.nodeType) === Node.COMMENT_NODE;
  var nodeIsCursorTarget = function(node) {
    let {
      name
    } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!node) {
      return;
    }
    if (nodeIsTextNode(node)) {
      if (node.data === ZERO_WIDTH_SPACE) {
        if (name) {
          return node.parentNode.dataset.trixCursorTarget === name;
        } else {
          return true;
        }
      }
    } else {
      return nodeIsCursorTarget(node.firstChild);
    }
  };
  var nodeIsAttachmentElement = (node) => elementMatchesSelector(node, attachmentSelector);
  var nodeIsEmptyTextNode = (node) => nodeIsTextNode(node) && (node === null || node === void 0 ? void 0 : node.data) === "";
  var nodeIsTextNode = (node) => (node === null || node === void 0 ? void 0 : node.nodeType) === Node.TEXT_NODE;
  var input = {
    level2Enabled: true,
    getLevel() {
      if (this.level2Enabled && browser$1.supportsInputEvents) {
        return 2;
      } else {
        return 0;
      }
    },
    pickFiles(callback) {
      const input2 = makeElement("input", {
        type: "file",
        multiple: true,
        hidden: true,
        id: this.fileInputId
      });
      input2.addEventListener("change", () => {
        callback(input2.files);
        removeNode(input2);
      });
      removeNode(document.getElementById(this.fileInputId));
      document.body.appendChild(input2);
      input2.click();
    }
  };
  var keyNames$2 = {
    8: "backspace",
    9: "tab",
    13: "return",
    27: "escape",
    37: "left",
    39: "right",
    46: "delete",
    68: "d",
    72: "h",
    79: "o"
  };
  var textAttributes = {
    bold: {
      tagName: "strong",
      inheritable: true,
      parser(element) {
        const style = window.getComputedStyle(element);
        return style.fontWeight === "bold" || style.fontWeight >= 600;
      }
    },
    italic: {
      tagName: "em",
      inheritable: true,
      parser(element) {
        const style = window.getComputedStyle(element);
        return style.fontStyle === "italic";
      }
    },
    href: {
      groupTagName: "a",
      parser(element) {
        const matchingSelector = "a:not(".concat(attachmentSelector, ")");
        const link = element.closest(matchingSelector);
        if (link) {
          return link.getAttribute("href");
        }
      }
    },
    strike: {
      tagName: "del",
      inheritable: true
    },
    frozen: {
      style: {
        backgroundColor: "highlight"
      }
    }
  };
  var toolbar = {
    getDefaultHTML() {
      return '<div class="trix-button-row">\n      <span class="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="'.concat(lang$1.bold, '" tabindex="-1">').concat(lang$1.bold, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="').concat(lang$1.italic, '" tabindex="-1">').concat(lang$1.italic, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" title="').concat(lang$1.strike, '" tabindex="-1">').concat(lang$1.strike, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="').concat(lang$1.link, '" tabindex="-1">').concat(lang$1.link, '</button>\n      </span>\n\n      <span class="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-heading-1" data-trix-attribute="heading1" title="').concat(lang$1.heading1, '" tabindex="-1">').concat(lang$1.heading1, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-quote" data-trix-attribute="quote" title="').concat(lang$1.quote, '" tabindex="-1">').concat(lang$1.quote, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-code" data-trix-attribute="code" title="').concat(lang$1.code, '" tabindex="-1">').concat(lang$1.code, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="').concat(lang$1.bullets, '" tabindex="-1">').concat(lang$1.bullets, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="').concat(lang$1.numbers, '" tabindex="-1">').concat(lang$1.numbers, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="').concat(lang$1.outdent, '" tabindex="-1">').concat(lang$1.outdent, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="').concat(lang$1.indent, '" tabindex="-1">').concat(lang$1.indent, '</button>\n      </span>\n\n      <span class="trix-button-group trix-button-group--file-tools" data-trix-button-group="file-tools">\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-attach" data-trix-action="attachFiles" title="').concat(lang$1.attachFiles, '" tabindex="-1">').concat(lang$1.attachFiles, '</button>\n      </span>\n\n      <span class="trix-button-group-spacer"></span>\n\n      <span class="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="').concat(lang$1.undo, '" tabindex="-1">').concat(lang$1.undo, '</button>\n        <button type="button" class="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="').concat(lang$1.redo, '" tabindex="-1">').concat(lang$1.redo, '</button>\n      </span>\n    </div>\n\n    <div class="trix-dialogs" data-trix-dialogs>\n      <div class="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">\n        <div class="trix-dialog__link-fields">\n          <input type="url" name="href" class="trix-input trix-input--dialog" placeholder="').concat(lang$1.urlPlaceholder, '" aria-label="').concat(lang$1.url, '" required data-trix-input>\n          <div class="trix-button-group">\n            <input type="button" class="trix-button trix-button--dialog" value="').concat(lang$1.link, '" data-trix-method="setAttribute">\n            <input type="button" class="trix-button trix-button--dialog" value="').concat(lang$1.unlink, '" data-trix-method="removeAttribute">\n          </div>\n        </div>\n      </div>\n    </div>');
    }
  };
  var undoInterval = 5e3;
  var config = {
    attachments,
    blockAttributes: attributes,
    browser: browser$1,
    css: css$3,
    fileSize,
    input,
    keyNames: keyNames$2,
    lang: lang$1,
    textAttributes,
    toolbar,
    undoInterval
  };
  function _AwaitValue(value) {
    this.wrapped = value;
  }
  function _AsyncGenerator(gen) {
    var front, back;
    function send(key, arg) {
      return new Promise(function(resolve, reject) {
        var request = {
          key,
          arg,
          resolve,
          reject,
          next: null
        };
        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }
    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;
        var wrappedAwait = value instanceof _AwaitValue;
        Promise.resolve(wrappedAwait ? value.wrapped : value).then(function(arg2) {
          if (wrappedAwait) {
            resume(key === "return" ? "return" : "next", arg2);
            return;
          }
          settle(result.done ? "return" : "normal", arg2);
        }, function(err) {
          resume("throw", err);
        });
      } catch (err) {
        settle("throw", err);
      }
    }
    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value,
            done: true
          });
          break;
        case "throw":
          front.reject(value);
          break;
        default:
          front.resolve({
            value,
            done: false
          });
          break;
      }
      front = front.next;
      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }
    this._invoke = send;
    if (typeof gen.return !== "function") {
      this.return = void 0;
    }
  }
  _AsyncGenerator.prototype[typeof Symbol === "function" && Symbol.asyncIterator || "@@asyncIterator"] = function() {
    return this;
  };
  _AsyncGenerator.prototype.next = function(arg) {
    return this._invoke("next", arg);
  };
  _AsyncGenerator.prototype.throw = function(arg) {
    return this._invoke("throw", arg);
  };
  _AsyncGenerator.prototype.return = function(arg) {
    return this._invoke("return", arg);
  };
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var BasicObject = class {
    static proxyMethod(expression) {
      const {
        name,
        toMethod,
        toProperty,
        optional
      } = parseProxyMethodExpression(expression);
      this.prototype[name] = function() {
        let subject;
        let object2;
        if (toMethod) {
          if (optional) {
            var _this$toMethod;
            object2 = (_this$toMethod = this[toMethod]) === null || _this$toMethod === void 0 ? void 0 : _this$toMethod.call(this);
          } else {
            object2 = this[toMethod]();
          }
        } else if (toProperty) {
          object2 = this[toProperty];
        }
        if (optional) {
          var _object;
          subject = (_object = object2) === null || _object === void 0 ? void 0 : _object[name];
          if (subject) {
            return apply.call(subject, object2, arguments);
          }
        } else {
          subject = object2[name];
          return apply.call(subject, object2, arguments);
        }
      };
    }
  };
  var parseProxyMethodExpression = function(expression) {
    const match2 = expression.match(proxyMethodExpressionPattern);
    if (!match2) {
      throw new Error("can't parse @proxyMethod expression: ".concat(expression));
    }
    const args = {
      name: match2[4]
    };
    if (match2[2] != null) {
      args.toMethod = match2[1];
    } else {
      args.toProperty = match2[1];
    }
    if (match2[3] != null) {
      args.optional = true;
    }
    return args;
  };
  var {
    apply
  } = Function.prototype;
  var proxyMethodExpressionPattern = new RegExp("^(.+?)(\\(\\))?(\\?)?\\.(.+?)$");
  var _Array$from;
  var _$codePointAt$1;
  var _$1;
  var _String$fromCodePoint;
  var UTF16String = class extends BasicObject {
    static box() {
      let value = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      if (value instanceof this) {
        return value;
      } else {
        return this.fromUCS2String(value === null || value === void 0 ? void 0 : value.toString());
      }
    }
    static fromUCS2String(ucs2String) {
      return new this(ucs2String, ucs2decode(ucs2String));
    }
    static fromCodepoints(codepoints) {
      return new this(ucs2encode(codepoints), codepoints);
    }
    constructor(ucs2String, codepoints) {
      super(...arguments);
      this.ucs2String = ucs2String;
      this.codepoints = codepoints;
      this.length = this.codepoints.length;
      this.ucs2Length = this.ucs2String.length;
    }
    offsetToUCS2Offset(offset) {
      return ucs2encode(this.codepoints.slice(0, Math.max(0, offset))).length;
    }
    offsetFromUCS2Offset(ucs2Offset) {
      return ucs2decode(this.ucs2String.slice(0, Math.max(0, ucs2Offset))).length;
    }
    slice() {
      return this.constructor.fromCodepoints(this.codepoints.slice(...arguments));
    }
    charAt(offset) {
      return this.slice(offset, offset + 1);
    }
    isEqualTo(value) {
      return this.constructor.box(value).ucs2String === this.ucs2String;
    }
    toJSON() {
      return this.ucs2String;
    }
    getCacheKey() {
      return this.ucs2String;
    }
    toString() {
      return this.ucs2String;
    }
  };
  var hasArrayFrom = ((_Array$from = Array.from) === null || _Array$from === void 0 ? void 0 : _Array$from.call(Array, "\u{1F47C}").length) === 1;
  var hasStringCodePointAt$1 = ((_$codePointAt$1 = (_$1 = " ").codePointAt) === null || _$codePointAt$1 === void 0 ? void 0 : _$codePointAt$1.call(_$1, 0)) != null;
  var hasStringFromCodePoint = ((_String$fromCodePoint = String.fromCodePoint) === null || _String$fromCodePoint === void 0 ? void 0 : _String$fromCodePoint.call(String, 32, 128124)) === " \u{1F47C}";
  var ucs2decode;
  var ucs2encode;
  if (hasArrayFrom && hasStringCodePointAt$1) {
    ucs2decode = (string) => Array.from(string).map((char) => char.codePointAt(0));
  } else {
    ucs2decode = function(string) {
      const output = [];
      let counter = 0;
      const {
        length
      } = string;
      while (counter < length) {
        let value = string.charCodeAt(counter++);
        if (55296 <= value && value <= 56319 && counter < length) {
          const extra = string.charCodeAt(counter++);
          if ((extra & 64512) === 56320) {
            value = ((value & 1023) << 10) + (extra & 1023) + 65536;
          } else {
            counter--;
          }
        }
        output.push(value);
      }
      return output;
    };
  }
  if (hasStringFromCodePoint) {
    ucs2encode = (array) => String.fromCodePoint(...Array.from(array || []));
  } else {
    ucs2encode = function(array) {
      const characters = (() => {
        const result = [];
        Array.from(array).forEach((value) => {
          let output = "";
          if (value > 65535) {
            value -= 65536;
            output += String.fromCharCode(value >>> 10 & 1023 | 55296);
            value = 56320 | value & 1023;
          }
          result.push(output + String.fromCharCode(value));
        });
        return result;
      })();
      return characters.join("");
    };
  }
  var id$1 = 0;
  var TrixObject = class extends BasicObject {
    static fromJSONString(jsonString) {
      return this.fromJSON(JSON.parse(jsonString));
    }
    constructor() {
      super(...arguments);
      this.id = ++id$1;
    }
    hasSameConstructorAs(object2) {
      return this.constructor === (object2 === null || object2 === void 0 ? void 0 : object2.constructor);
    }
    isEqualTo(object2) {
      return this === object2;
    }
    inspect() {
      const parts = [];
      const contents = this.contentsForInspection() || {};
      for (const key in contents) {
        const value = contents[key];
        parts.push("".concat(key, "=").concat(value));
      }
      return "#<".concat(this.constructor.name, ":").concat(this.id).concat(parts.length ? " ".concat(parts.join(", ")) : "", ">");
    }
    contentsForInspection() {
    }
    toJSONString() {
      return JSON.stringify(this);
    }
    toUTF16String() {
      return UTF16String.box(this);
    }
    getCacheKey() {
      return this.id.toString();
    }
  };
  var arraysAreEqual = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    let b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    if (a.length !== b.length) {
      return false;
    }
    for (let index = 0; index < a.length; index++) {
      const value = a[index];
      if (value !== b[index]) {
        return false;
      }
    }
    return true;
  };
  var arrayStartsWith = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    let b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    return arraysAreEqual(a.slice(0, b.length), b);
  };
  var spliceArray = function(array) {
    const result = array.slice(0);
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    result.splice(...args);
    return result;
  };
  var summarizeArrayChange = function() {
    let oldArray = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    let newArray = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    const added = [];
    const removed = [];
    const existingValues = /* @__PURE__ */ new Set();
    oldArray.forEach((value) => {
      existingValues.add(value);
    });
    const currentValues = /* @__PURE__ */ new Set();
    newArray.forEach((value) => {
      currentValues.add(value);
      if (!existingValues.has(value)) {
        added.push(value);
      }
    });
    oldArray.forEach((value) => {
      if (!currentValues.has(value)) {
        removed.push(value);
      }
    });
    return {
      added,
      removed
    };
  };
  var RTL_PATTERN = /[\u05BE\u05C0\u05C3\u05D0-\u05EA\u05F0-\u05F4\u061B\u061F\u0621-\u063A\u0640-\u064A\u066D\u0671-\u06B7\u06BA-\u06BE\u06C0-\u06CE\u06D0-\u06D5\u06E5\u06E6\u200F\u202B\u202E\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE72\uFE74\uFE76-\uFEFC]/;
  var getDirection = function() {
    const input2 = makeElement("input", {
      dir: "auto",
      name: "x",
      dirName: "x.dir"
    });
    const form = makeElement("form");
    form.appendChild(input2);
    const supportsDirName = function() {
      try {
        return new FormData(form).has(input2.dirName);
      } catch (error2) {
        return false;
      }
    }();
    const supportsDirSelector = function() {
      try {
        return input2.matches(":dir(ltr),:dir(rtl)");
      } catch (error2) {
        return false;
      }
    }();
    if (supportsDirName) {
      return function(string) {
        input2.value = string;
        return new FormData(form).get(input2.dirName);
      };
    } else if (supportsDirSelector) {
      return function(string) {
        input2.value = string;
        if (input2.matches(":dir(rtl)")) {
          return "rtl";
        } else {
          return "ltr";
        }
      };
    } else {
      return function(string) {
        const char = string.trim().charAt(0);
        if (RTL_PATTERN.test(char)) {
          return "rtl";
        } else {
          return "ltr";
        }
      };
    }
  }();
  var allAttributeNames = null;
  var blockAttributeNames = null;
  var textAttributeNames = null;
  var listAttributeNames = null;
  var getAllAttributeNames = () => {
    if (!allAttributeNames) {
      allAttributeNames = getTextAttributeNames().concat(getBlockAttributeNames());
    }
    return allAttributeNames;
  };
  var getBlockConfig = (attributeName) => config.blockAttributes[attributeName];
  var getBlockAttributeNames = () => {
    if (!blockAttributeNames) {
      blockAttributeNames = Object.keys(config.blockAttributes);
    }
    return blockAttributeNames;
  };
  var getTextConfig = (attributeName) => config.textAttributes[attributeName];
  var getTextAttributeNames = () => {
    if (!textAttributeNames) {
      textAttributeNames = Object.keys(config.textAttributes);
    }
    return textAttributeNames;
  };
  var getListAttributeNames = () => {
    if (!listAttributeNames) {
      listAttributeNames = [];
      for (const key in config.blockAttributes) {
        const {
          listAttribute
        } = config.blockAttributes[key];
        if (listAttribute != null) {
          listAttributeNames.push(listAttribute);
        }
      }
    }
    return listAttributeNames;
  };
  var installDefaultCSSForTagName = function(tagName2, defaultCSS) {
    const styleElement = insertStyleElementForTagName(tagName2);
    styleElement.textContent = defaultCSS.replace(/%t/g, tagName2);
  };
  var insertStyleElementForTagName = function(tagName2) {
    const element = document.createElement("style");
    element.setAttribute("type", "text/css");
    element.setAttribute("data-tag-name", tagName2.toLowerCase());
    const nonce = getCSPNonce();
    if (nonce) {
      element.setAttribute("nonce", nonce);
    }
    document.head.insertBefore(element, document.head.firstChild);
    return element;
  };
  var getCSPNonce = function() {
    const element = getMetaElement("trix-csp-nonce") || getMetaElement("csp-nonce");
    if (element) {
      return element.getAttribute("content");
    }
  };
  var getMetaElement = (name) => document.head.querySelector("meta[name=".concat(name, "]"));
  var testTransferData = {
    "application/x-trix-feature-detection": "test"
  };
  var dataTransferIsPlainText = function(dataTransfer) {
    const text = dataTransfer.getData("text/plain");
    const html2 = dataTransfer.getData("text/html");
    if (text && html2) {
      const {
        body
      } = new DOMParser().parseFromString(html2, "text/html");
      if (body.textContent === text) {
        return !body.querySelector("*");
      }
    } else {
      return text === null || text === void 0 ? void 0 : text.length;
    }
  };
  var dataTransferIsWritable = function(dataTransfer) {
    if (!(dataTransfer !== null && dataTransfer !== void 0 && dataTransfer.setData))
      return false;
    for (const key in testTransferData) {
      const value = testTransferData[key];
      try {
        dataTransfer.setData(key, value);
        if (!dataTransfer.getData(key) === value)
          return false;
      } catch (error2) {
        return false;
      }
    }
    return true;
  };
  var keyEventIsKeyboardCommand = function() {
    if (/Mac|^iP/.test(navigator.platform)) {
      return (event) => event.metaKey;
    } else {
      return (event) => event.ctrlKey;
    }
  }();
  var defer = (fn) => setTimeout(fn, 1);
  var copyObject = function() {
    let object2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const result = {};
    for (const key in object2) {
      const value = object2[key];
      result[key] = value;
    }
    return result;
  };
  var objectsAreEqual = function() {
    let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    let b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (Object.keys(a).length !== Object.keys(b).length) {
      return false;
    }
    for (const key in a) {
      const value = a[key];
      if (value !== b[key]) {
        return false;
      }
    }
    return true;
  };
  var normalizeRange = function(range) {
    if (range == null)
      return;
    if (!Array.isArray(range)) {
      range = [range, range];
    }
    return [copyValue(range[0]), copyValue(range[1] != null ? range[1] : range[0])];
  };
  var rangeIsCollapsed = function(range) {
    if (range == null)
      return;
    const [start2, end] = normalizeRange(range);
    return rangeValuesAreEqual(start2, end);
  };
  var rangesAreEqual = function(leftRange, rightRange) {
    if (leftRange == null || rightRange == null)
      return;
    const [leftStart, leftEnd] = normalizeRange(leftRange);
    const [rightStart, rightEnd] = normalizeRange(rightRange);
    return rangeValuesAreEqual(leftStart, rightStart) && rangeValuesAreEqual(leftEnd, rightEnd);
  };
  var copyValue = function(value) {
    if (typeof value === "number") {
      return value;
    } else {
      return copyObject(value);
    }
  };
  var rangeValuesAreEqual = function(left, right) {
    if (typeof left === "number") {
      return left === right;
    } else {
      return objectsAreEqual(left, right);
    }
  };
  var SelectionChangeObserver = class extends BasicObject {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
      this.run = this.run.bind(this);
      this.selectionManagers = [];
    }
    start() {
      if (!this.started) {
        this.started = true;
        if ("onselectionchange" in document) {
          return document.addEventListener("selectionchange", this.update, true);
        } else {
          return this.run();
        }
      }
    }
    stop() {
      if (this.started) {
        this.started = false;
        return document.removeEventListener("selectionchange", this.update, true);
      }
    }
    registerSelectionManager(selectionManager) {
      if (!this.selectionManagers.includes(selectionManager)) {
        this.selectionManagers.push(selectionManager);
        return this.start();
      }
    }
    unregisterSelectionManager(selectionManager) {
      this.selectionManagers = this.selectionManagers.filter((s) => s !== selectionManager);
      if (this.selectionManagers.length === 0) {
        return this.stop();
      }
    }
    notifySelectionManagersOfSelectionChange() {
      return this.selectionManagers.map((selectionManager) => selectionManager.selectionDidChange());
    }
    update() {
      const domRange = getDOMRange();
      if (!domRangesAreEqual(domRange, this.domRange)) {
        this.domRange = domRange;
        return this.notifySelectionManagersOfSelectionChange();
      }
    }
    reset() {
      this.domRange = null;
      return this.update();
    }
    run() {
      if (this.started) {
        this.update();
        return requestAnimationFrame(this.run);
      }
    }
  };
  var domRangesAreEqual = (left, right) => (left === null || left === void 0 ? void 0 : left.startContainer) === (right === null || right === void 0 ? void 0 : right.startContainer) && (left === null || left === void 0 ? void 0 : left.startOffset) === (right === null || right === void 0 ? void 0 : right.startOffset) && (left === null || left === void 0 ? void 0 : left.endContainer) === (right === null || right === void 0 ? void 0 : right.endContainer) && (left === null || left === void 0 ? void 0 : left.endOffset) === (right === null || right === void 0 ? void 0 : right.endOffset);
  var selectionChangeObserver = new SelectionChangeObserver();
  var getDOMSelection = function() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      return selection;
    }
  };
  var getDOMRange = function() {
    var _getDOMSelection;
    const domRange = (_getDOMSelection = getDOMSelection()) === null || _getDOMSelection === void 0 ? void 0 : _getDOMSelection.getRangeAt(0);
    if (domRange) {
      if (!domRangeIsPrivate(domRange)) {
        return domRange;
      }
    }
  };
  var setDOMRange = function(domRange) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(domRange);
    return selectionChangeObserver.update();
  };
  var domRangeIsPrivate = (domRange) => nodeIsPrivate(domRange.startContainer) || nodeIsPrivate(domRange.endContainer);
  var nodeIsPrivate = (node) => !Object.getPrototypeOf(node);
  var normalizeSpaces = (string) => string.replace(new RegExp("".concat(ZERO_WIDTH_SPACE), "g"), "").replace(new RegExp("".concat(NON_BREAKING_SPACE), "g"), " ");
  var normalizeNewlines = (string) => string.replace(/\r\n/g, "\n");
  var breakableWhitespacePattern = new RegExp("[^\\S".concat(NON_BREAKING_SPACE, "]"));
  var squishBreakableWhitespace = (string) => string.replace(new RegExp("".concat(breakableWhitespacePattern.source), "g"), " ").replace(/\ {2,}/g, " ");
  var summarizeStringChange = function(oldString, newString) {
    let added, removed;
    oldString = UTF16String.box(oldString);
    newString = UTF16String.box(newString);
    if (newString.length < oldString.length) {
      [removed, added] = utf16StringDifferences(oldString, newString);
    } else {
      [added, removed] = utf16StringDifferences(newString, oldString);
    }
    return {
      added,
      removed
    };
  };
  var utf16StringDifferences = function(a, b) {
    if (a.isEqualTo(b)) {
      return ["", ""];
    }
    const diffA = utf16StringDifference(a, b);
    const {
      length
    } = diffA.utf16String;
    let diffB;
    if (length) {
      const {
        offset
      } = diffA;
      const codepoints = a.codepoints.slice(0, offset).concat(a.codepoints.slice(offset + length));
      diffB = utf16StringDifference(b, UTF16String.fromCodepoints(codepoints));
    } else {
      diffB = utf16StringDifference(b, a);
    }
    return [diffA.utf16String.toString(), diffB.utf16String.toString()];
  };
  var utf16StringDifference = function(a, b) {
    let leftIndex = 0;
    let rightIndexA = a.length;
    let rightIndexB = b.length;
    while (leftIndex < rightIndexA && a.charAt(leftIndex).isEqualTo(b.charAt(leftIndex))) {
      leftIndex++;
    }
    while (rightIndexA > leftIndex + 1 && a.charAt(rightIndexA - 1).isEqualTo(b.charAt(rightIndexB - 1))) {
      rightIndexA--;
      rightIndexB--;
    }
    return {
      utf16String: a.slice(leftIndex, rightIndexA),
      offset: leftIndex
    };
  };
  var Hash = class extends TrixObject {
    static fromCommonAttributesOfObjects() {
      let objects = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      if (!objects.length) {
        return new this();
      }
      let hash = box(objects[0]);
      let keys = hash.getKeys();
      objects.slice(1).forEach((object2) => {
        keys = hash.getKeysCommonToHash(box(object2));
        hash = hash.slice(keys);
      });
      return hash;
    }
    static box(values) {
      return box(values);
    }
    constructor() {
      let values = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      super(...arguments);
      this.values = copy(values);
    }
    add(key, value) {
      return this.merge(object(key, value));
    }
    remove(key) {
      return new Hash(copy(this.values, key));
    }
    get(key) {
      return this.values[key];
    }
    has(key) {
      return key in this.values;
    }
    merge(values) {
      return new Hash(merge(this.values, unbox(values)));
    }
    slice(keys) {
      const values = {};
      keys.forEach((key) => {
        if (this.has(key)) {
          values[key] = this.values[key];
        }
      });
      return new Hash(values);
    }
    getKeys() {
      return Object.keys(this.values);
    }
    getKeysCommonToHash(hash) {
      hash = box(hash);
      return this.getKeys().filter((key) => this.values[key] === hash.values[key]);
    }
    isEqualTo(values) {
      return arraysAreEqual(this.toArray(), box(values).toArray());
    }
    isEmpty() {
      return this.getKeys().length === 0;
    }
    toArray() {
      if (!this.array) {
        const result = [];
        for (const key in this.values) {
          const value = this.values[key];
          result.push(result.push(key, value));
        }
        this.array = result.slice(0);
      }
      return this.array;
    }
    toObject() {
      return copy(this.values);
    }
    toJSON() {
      return this.toObject();
    }
    contentsForInspection() {
      return {
        values: JSON.stringify(this.values)
      };
    }
  };
  var object = function(key, value) {
    const result = {};
    result[key] = value;
    return result;
  };
  var merge = function(object2, values) {
    const result = copy(object2);
    for (const key in values) {
      const value = values[key];
      result[key] = value;
    }
    return result;
  };
  var copy = function(object2, keyToRemove) {
    const result = {};
    const sortedKeys = Object.keys(object2).sort();
    sortedKeys.forEach((key) => {
      if (key !== keyToRemove) {
        result[key] = object2[key];
      }
    });
    return result;
  };
  var box = function(object2) {
    if (object2 instanceof Hash) {
      return object2;
    } else {
      return new Hash(object2);
    }
  };
  var unbox = function(object2) {
    if (object2 instanceof Hash) {
      return object2.values;
    } else {
      return object2;
    }
  };
  var Operation = class extends BasicObject {
    isPerforming() {
      return this.performing === true;
    }
    hasPerformed() {
      return this.performed === true;
    }
    hasSucceeded() {
      return this.performed && this.succeeded;
    }
    hasFailed() {
      return this.performed && !this.succeeded;
    }
    getPromise() {
      if (!this.promise) {
        this.promise = new Promise((resolve, reject) => {
          this.performing = true;
          return this.perform((succeeded, result) => {
            this.succeeded = succeeded;
            this.performing = false;
            this.performed = true;
            if (this.succeeded) {
              resolve(result);
            } else {
              reject(result);
            }
          });
        });
      }
      return this.promise;
    }
    perform(callback) {
      return callback(false);
    }
    release() {
      var _this$promise, _this$promise$cancel;
      (_this$promise = this.promise) === null || _this$promise === void 0 ? void 0 : (_this$promise$cancel = _this$promise.cancel) === null || _this$promise$cancel === void 0 ? void 0 : _this$promise$cancel.call(_this$promise);
      this.promise = null;
      this.performing = null;
      this.performed = null;
      this.succeeded = null;
    }
  };
  Operation.proxyMethod("getPromise().then");
  Operation.proxyMethod("getPromise().catch");
  var ImagePreloadOperation = class extends Operation {
    constructor(url) {
      super(...arguments);
      this.url = url;
    }
    perform(callback) {
      const image = new Image();
      image.onload = () => {
        image.width = this.width = image.naturalWidth;
        image.height = this.height = image.naturalHeight;
        return callback(true, image);
      };
      image.onerror = () => callback(false);
      image.src = this.url;
    }
  };
  var Attachment = class extends TrixObject {
    static attachmentForFile(file) {
      const attributes2 = this.attributesForFile(file);
      const attachment = new this(attributes2);
      attachment.setFile(file);
      return attachment;
    }
    static attributesForFile(file) {
      return new Hash({
        filename: file.name,
        filesize: file.size,
        contentType: file.type
      });
    }
    static fromJSON(attachmentJSON) {
      return new this(attachmentJSON);
    }
    constructor() {
      let attributes2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      super(attributes2);
      this.releaseFile = this.releaseFile.bind(this);
      this.attributes = Hash.box(attributes2);
      this.didChangeAttributes();
    }
    getAttribute(attribute) {
      return this.attributes.get(attribute);
    }
    hasAttribute(attribute) {
      return this.attributes.has(attribute);
    }
    getAttributes() {
      return this.attributes.toObject();
    }
    setAttributes() {
      let attributes2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      const newAttributes = this.attributes.merge(attributes2);
      if (!this.attributes.isEqualTo(newAttributes)) {
        var _this$previewDelegate, _this$previewDelegate2, _this$delegate, _this$delegate$attach;
        this.attributes = newAttributes;
        this.didChangeAttributes();
        (_this$previewDelegate = this.previewDelegate) === null || _this$previewDelegate === void 0 ? void 0 : (_this$previewDelegate2 = _this$previewDelegate.attachmentDidChangeAttributes) === null || _this$previewDelegate2 === void 0 ? void 0 : _this$previewDelegate2.call(_this$previewDelegate, this);
        return (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$attach = _this$delegate.attachmentDidChangeAttributes) === null || _this$delegate$attach === void 0 ? void 0 : _this$delegate$attach.call(_this$delegate, this);
      }
    }
    didChangeAttributes() {
      if (this.isPreviewable()) {
        return this.preloadURL();
      }
    }
    isPending() {
      return this.file != null && !(this.getURL() || this.getHref());
    }
    isPreviewable() {
      if (this.attributes.has("previewable")) {
        return this.attributes.get("previewable");
      } else {
        return Attachment.previewablePattern.test(this.getContentType());
      }
    }
    getType() {
      if (this.hasContent()) {
        return "content";
      } else if (this.isPreviewable()) {
        return "preview";
      } else {
        return "file";
      }
    }
    getURL() {
      return this.attributes.get("url");
    }
    getHref() {
      return this.attributes.get("href");
    }
    getFilename() {
      return this.attributes.get("filename") || "";
    }
    getFilesize() {
      return this.attributes.get("filesize");
    }
    getFormattedFilesize() {
      const filesize = this.attributes.get("filesize");
      if (typeof filesize === "number") {
        return config.fileSize.formatter(filesize);
      } else {
        return "";
      }
    }
    getExtension() {
      var _this$getFilename$mat;
      return (_this$getFilename$mat = this.getFilename().match(/\.(\w+)$/)) === null || _this$getFilename$mat === void 0 ? void 0 : _this$getFilename$mat[1].toLowerCase();
    }
    getContentType() {
      return this.attributes.get("contentType");
    }
    hasContent() {
      return this.attributes.has("content");
    }
    getContent() {
      return this.attributes.get("content");
    }
    getWidth() {
      return this.attributes.get("width");
    }
    getHeight() {
      return this.attributes.get("height");
    }
    getFile() {
      return this.file;
    }
    setFile(file) {
      this.file = file;
      if (this.isPreviewable()) {
        return this.preloadFile();
      }
    }
    releaseFile() {
      this.releasePreloadedFile();
      this.file = null;
    }
    getUploadProgress() {
      return this.uploadProgress != null ? this.uploadProgress : 0;
    }
    setUploadProgress(value) {
      if (this.uploadProgress !== value) {
        var _this$uploadProgressD, _this$uploadProgressD2;
        this.uploadProgress = value;
        return (_this$uploadProgressD = this.uploadProgressDelegate) === null || _this$uploadProgressD === void 0 ? void 0 : (_this$uploadProgressD2 = _this$uploadProgressD.attachmentDidChangeUploadProgress) === null || _this$uploadProgressD2 === void 0 ? void 0 : _this$uploadProgressD2.call(_this$uploadProgressD, this);
      }
    }
    toJSON() {
      return this.getAttributes();
    }
    getCacheKey() {
      return [super.getCacheKey(...arguments), this.attributes.getCacheKey(), this.getPreviewURL()].join("/");
    }
    getPreviewURL() {
      return this.previewURL || this.preloadingURL;
    }
    setPreviewURL(url) {
      if (url !== this.getPreviewURL()) {
        var _this$previewDelegate3, _this$previewDelegate4, _this$delegate2, _this$delegate2$attac;
        this.previewURL = url;
        (_this$previewDelegate3 = this.previewDelegate) === null || _this$previewDelegate3 === void 0 ? void 0 : (_this$previewDelegate4 = _this$previewDelegate3.attachmentDidChangeAttributes) === null || _this$previewDelegate4 === void 0 ? void 0 : _this$previewDelegate4.call(_this$previewDelegate3, this);
        return (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : (_this$delegate2$attac = _this$delegate2.attachmentDidChangePreviewURL) === null || _this$delegate2$attac === void 0 ? void 0 : _this$delegate2$attac.call(_this$delegate2, this);
      }
    }
    preloadURL() {
      return this.preload(this.getURL(), this.releaseFile);
    }
    preloadFile() {
      if (this.file) {
        this.fileObjectURL = URL.createObjectURL(this.file);
        return this.preload(this.fileObjectURL);
      }
    }
    releasePreloadedFile() {
      if (this.fileObjectURL) {
        URL.revokeObjectURL(this.fileObjectURL);
        this.fileObjectURL = null;
      }
    }
    preload(url, callback) {
      if (url && url !== this.getPreviewURL()) {
        this.preloadingURL = url;
        const operation = new ImagePreloadOperation(url);
        return operation.then((_ref) => {
          let {
            width,
            height
          } = _ref;
          if (!this.getWidth() || !this.getHeight()) {
            this.setAttributes({
              width,
              height
            });
          }
          this.preloadingURL = null;
          this.setPreviewURL(url);
          return callback === null || callback === void 0 ? void 0 : callback();
        }).catch(() => {
          this.preloadingURL = null;
          return callback === null || callback === void 0 ? void 0 : callback();
        });
      }
    }
  };
  _defineProperty(Attachment, "previewablePattern", /^image(\/(gif|png|jpe?g)|$)/);
  var ManagedAttachment = class extends BasicObject {
    constructor(attachmentManager, attachment) {
      super(...arguments);
      this.attachmentManager = attachmentManager;
      this.attachment = attachment;
      this.id = this.attachment.id;
      this.file = this.attachment.file;
    }
    remove() {
      return this.attachmentManager.requestRemovalOfAttachment(this.attachment);
    }
  };
  ManagedAttachment.proxyMethod("attachment.getAttribute");
  ManagedAttachment.proxyMethod("attachment.hasAttribute");
  ManagedAttachment.proxyMethod("attachment.setAttribute");
  ManagedAttachment.proxyMethod("attachment.getAttributes");
  ManagedAttachment.proxyMethod("attachment.setAttributes");
  ManagedAttachment.proxyMethod("attachment.isPending");
  ManagedAttachment.proxyMethod("attachment.isPreviewable");
  ManagedAttachment.proxyMethod("attachment.getURL");
  ManagedAttachment.proxyMethod("attachment.getHref");
  ManagedAttachment.proxyMethod("attachment.getFilename");
  ManagedAttachment.proxyMethod("attachment.getFilesize");
  ManagedAttachment.proxyMethod("attachment.getFormattedFilesize");
  ManagedAttachment.proxyMethod("attachment.getExtension");
  ManagedAttachment.proxyMethod("attachment.getContentType");
  ManagedAttachment.proxyMethod("attachment.getFile");
  ManagedAttachment.proxyMethod("attachment.setFile");
  ManagedAttachment.proxyMethod("attachment.releaseFile");
  ManagedAttachment.proxyMethod("attachment.getUploadProgress");
  ManagedAttachment.proxyMethod("attachment.setUploadProgress");
  var AttachmentManager = class extends BasicObject {
    constructor() {
      let attachments2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      super(...arguments);
      this.managedAttachments = {};
      Array.from(attachments2).forEach((attachment) => {
        this.manageAttachment(attachment);
      });
    }
    getAttachments() {
      const result = [];
      for (const id2 in this.managedAttachments) {
        const attachment = this.managedAttachments[id2];
        result.push(attachment);
      }
      return result;
    }
    manageAttachment(attachment) {
      if (!this.managedAttachments[attachment.id]) {
        this.managedAttachments[attachment.id] = new ManagedAttachment(this, attachment);
      }
      return this.managedAttachments[attachment.id];
    }
    attachmentIsManaged(attachment) {
      return attachment.id in this.managedAttachments;
    }
    requestRemovalOfAttachment(attachment) {
      if (this.attachmentIsManaged(attachment)) {
        var _this$delegate, _this$delegate$attach;
        return (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$attach = _this$delegate.attachmentManagerDidRequestRemovalOfAttachment) === null || _this$delegate$attach === void 0 ? void 0 : _this$delegate$attach.call(_this$delegate, attachment);
      }
    }
    unmanageAttachment(attachment) {
      const managedAttachment = this.managedAttachments[attachment.id];
      delete this.managedAttachments[attachment.id];
      return managedAttachment;
    }
  };
  var Piece = class extends TrixObject {
    static registerType(type, constructor) {
      constructor.type = type;
      this.types[type] = constructor;
    }
    static fromJSON(pieceJSON) {
      const constructor = this.types[pieceJSON.type];
      if (constructor) {
        return constructor.fromJSON(pieceJSON);
      }
    }
    constructor(value) {
      let attributes2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      super(...arguments);
      this.attributes = Hash.box(attributes2);
    }
    copyWithAttributes(attributes2) {
      return new this.constructor(this.getValue(), attributes2);
    }
    copyWithAdditionalAttributes(attributes2) {
      return this.copyWithAttributes(this.attributes.merge(attributes2));
    }
    copyWithoutAttribute(attribute) {
      return this.copyWithAttributes(this.attributes.remove(attribute));
    }
    copy() {
      return this.copyWithAttributes(this.attributes);
    }
    getAttribute(attribute) {
      return this.attributes.get(attribute);
    }
    getAttributesHash() {
      return this.attributes;
    }
    getAttributes() {
      return this.attributes.toObject();
    }
    hasAttribute(attribute) {
      return this.attributes.has(attribute);
    }
    hasSameStringValueAsPiece(piece) {
      return piece && this.toString() === piece.toString();
    }
    hasSameAttributesAsPiece(piece) {
      return piece && (this.attributes === piece.attributes || this.attributes.isEqualTo(piece.attributes));
    }
    isBlockBreak() {
      return false;
    }
    isEqualTo(piece) {
      return super.isEqualTo(...arguments) || this.hasSameConstructorAs(piece) && this.hasSameStringValueAsPiece(piece) && this.hasSameAttributesAsPiece(piece);
    }
    isEmpty() {
      return this.length === 0;
    }
    isSerializable() {
      return true;
    }
    toJSON() {
      return {
        type: this.constructor.type,
        attributes: this.getAttributes()
      };
    }
    contentsForInspection() {
      return {
        type: this.constructor.type,
        attributes: this.attributes.inspect()
      };
    }
    canBeGrouped() {
      return this.hasAttribute("href");
    }
    canBeGroupedWith(piece) {
      return this.getAttribute("href") === piece.getAttribute("href");
    }
    getLength() {
      return this.length;
    }
    canBeConsolidatedWith(piece) {
      return false;
    }
  };
  _defineProperty(Piece, "types", {});
  var AttachmentPiece = class extends Piece {
    static fromJSON(pieceJSON) {
      return new this(Attachment.fromJSON(pieceJSON.attachment), pieceJSON.attributes);
    }
    constructor(attachment) {
      super(...arguments);
      this.attachment = attachment;
      this.length = 1;
      this.ensureAttachmentExclusivelyHasAttribute("href");
      if (!this.attachment.hasContent()) {
        this.removeProhibitedAttributes();
      }
    }
    ensureAttachmentExclusivelyHasAttribute(attribute) {
      if (this.hasAttribute(attribute)) {
        if (!this.attachment.hasAttribute(attribute)) {
          this.attachment.setAttributes(this.attributes.slice(attribute));
        }
        this.attributes = this.attributes.remove(attribute);
      }
    }
    removeProhibitedAttributes() {
      const attributes2 = this.attributes.slice(AttachmentPiece.permittedAttributes);
      if (!attributes2.isEqualTo(this.attributes)) {
        this.attributes = attributes2;
      }
    }
    getValue() {
      return this.attachment;
    }
    isSerializable() {
      return !this.attachment.isPending();
    }
    getCaption() {
      return this.attributes.get("caption") || "";
    }
    isEqualTo(piece) {
      var _piece$attachment;
      return super.isEqualTo(piece) && this.attachment.id === (piece === null || piece === void 0 ? void 0 : (_piece$attachment = piece.attachment) === null || _piece$attachment === void 0 ? void 0 : _piece$attachment.id);
    }
    toString() {
      return OBJECT_REPLACEMENT_CHARACTER;
    }
    toJSON() {
      const json = super.toJSON(...arguments);
      json.attachment = this.attachment;
      return json;
    }
    getCacheKey() {
      return [super.getCacheKey(...arguments), this.attachment.getCacheKey()].join("/");
    }
    toConsole() {
      return JSON.stringify(this.toString());
    }
  };
  _defineProperty(AttachmentPiece, "permittedAttributes", ["caption", "presentation"]);
  Piece.registerType("attachment", AttachmentPiece);
  var StringPiece = class extends Piece {
    static fromJSON(pieceJSON) {
      return new this(pieceJSON.string, pieceJSON.attributes);
    }
    constructor(string) {
      super(...arguments);
      this.string = normalizeNewlines(string);
      this.length = this.string.length;
    }
    getValue() {
      return this.string;
    }
    toString() {
      return this.string.toString();
    }
    isBlockBreak() {
      return this.toString() === "\n" && this.getAttribute("blockBreak") === true;
    }
    toJSON() {
      const result = super.toJSON(...arguments);
      result.string = this.string;
      return result;
    }
    canBeConsolidatedWith(piece) {
      return piece && this.hasSameConstructorAs(piece) && this.hasSameAttributesAsPiece(piece);
    }
    consolidateWith(piece) {
      return new this.constructor(this.toString() + piece.toString(), this.attributes);
    }
    splitAtOffset(offset) {
      let left, right;
      if (offset === 0) {
        left = null;
        right = this;
      } else if (offset === this.length) {
        left = this;
        right = null;
      } else {
        left = new this.constructor(this.string.slice(0, offset), this.attributes);
        right = new this.constructor(this.string.slice(offset), this.attributes);
      }
      return [left, right];
    }
    toConsole() {
      let {
        string
      } = this;
      if (string.length > 15) {
        string = string.slice(0, 14) + "\u2026";
      }
      return JSON.stringify(string.toString());
    }
  };
  Piece.registerType("string", StringPiece);
  var SplittableList = class extends TrixObject {
    static box(objects) {
      if (objects instanceof this) {
        return objects;
      } else {
        return new this(objects);
      }
    }
    constructor() {
      let objects = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      super(...arguments);
      this.objects = objects.slice(0);
      this.length = this.objects.length;
    }
    indexOf(object2) {
      return this.objects.indexOf(object2);
    }
    splice() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return new this.constructor(spliceArray(this.objects, ...args));
    }
    eachObject(callback) {
      return this.objects.map((object2, index) => callback(object2, index));
    }
    insertObjectAtIndex(object2, index) {
      return this.splice(index, 0, object2);
    }
    insertSplittableListAtIndex(splittableList, index) {
      return this.splice(index, 0, ...splittableList.objects);
    }
    insertSplittableListAtPosition(splittableList, position) {
      const [objects, index] = this.splitObjectAtPosition(position);
      return new this.constructor(objects).insertSplittableListAtIndex(splittableList, index);
    }
    editObjectAtIndex(index, callback) {
      return this.replaceObjectAtIndex(callback(this.objects[index]), index);
    }
    replaceObjectAtIndex(object2, index) {
      return this.splice(index, 1, object2);
    }
    removeObjectAtIndex(index) {
      return this.splice(index, 1);
    }
    getObjectAtIndex(index) {
      return this.objects[index];
    }
    getSplittableListInRange(range) {
      const [objects, leftIndex, rightIndex] = this.splitObjectsAtRange(range);
      return new this.constructor(objects.slice(leftIndex, rightIndex + 1));
    }
    selectSplittableList(test) {
      const objects = this.objects.filter((object2) => test(object2));
      return new this.constructor(objects);
    }
    removeObjectsInRange(range) {
      const [objects, leftIndex, rightIndex] = this.splitObjectsAtRange(range);
      return new this.constructor(objects).splice(leftIndex, rightIndex - leftIndex + 1);
    }
    transformObjectsInRange(range, transform) {
      const [objects, leftIndex, rightIndex] = this.splitObjectsAtRange(range);
      const transformedObjects = objects.map((object2, index) => leftIndex <= index && index <= rightIndex ? transform(object2) : object2);
      return new this.constructor(transformedObjects);
    }
    splitObjectsAtRange(range) {
      let rightOuterIndex;
      let [objects, leftInnerIndex, offset] = this.splitObjectAtPosition(startOfRange(range));
      [objects, rightOuterIndex] = new this.constructor(objects).splitObjectAtPosition(endOfRange(range) + offset);
      return [objects, leftInnerIndex, rightOuterIndex - 1];
    }
    getObjectAtPosition(position) {
      const {
        index
      } = this.findIndexAndOffsetAtPosition(position);
      return this.objects[index];
    }
    splitObjectAtPosition(position) {
      let splitIndex, splitOffset;
      const {
        index,
        offset
      } = this.findIndexAndOffsetAtPosition(position);
      const objects = this.objects.slice(0);
      if (index != null) {
        if (offset === 0) {
          splitIndex = index;
          splitOffset = 0;
        } else {
          const object2 = this.getObjectAtIndex(index);
          const [leftObject, rightObject] = object2.splitAtOffset(offset);
          objects.splice(index, 1, leftObject, rightObject);
          splitIndex = index + 1;
          splitOffset = leftObject.getLength() - offset;
        }
      } else {
        splitIndex = objects.length;
        splitOffset = 0;
      }
      return [objects, splitIndex, splitOffset];
    }
    consolidate() {
      const objects = [];
      let pendingObject = this.objects[0];
      this.objects.slice(1).forEach((object2) => {
        var _pendingObject$canBeC, _pendingObject;
        if ((_pendingObject$canBeC = (_pendingObject = pendingObject).canBeConsolidatedWith) !== null && _pendingObject$canBeC !== void 0 && _pendingObject$canBeC.call(_pendingObject, object2)) {
          pendingObject = pendingObject.consolidateWith(object2);
        } else {
          objects.push(pendingObject);
          pendingObject = object2;
        }
      });
      if (pendingObject) {
        objects.push(pendingObject);
      }
      return new this.constructor(objects);
    }
    consolidateFromIndexToIndex(startIndex, endIndex) {
      const objects = this.objects.slice(0);
      const objectsInRange = objects.slice(startIndex, endIndex + 1);
      const consolidatedInRange = new this.constructor(objectsInRange).consolidate().toArray();
      return this.splice(startIndex, objectsInRange.length, ...consolidatedInRange);
    }
    findIndexAndOffsetAtPosition(position) {
      let index;
      let currentPosition = 0;
      for (index = 0; index < this.objects.length; index++) {
        const object2 = this.objects[index];
        const nextPosition = currentPosition + object2.getLength();
        if (currentPosition <= position && position < nextPosition) {
          return {
            index,
            offset: position - currentPosition
          };
        }
        currentPosition = nextPosition;
      }
      return {
        index: null,
        offset: null
      };
    }
    findPositionAtIndexAndOffset(index, offset) {
      let position = 0;
      for (let currentIndex = 0; currentIndex < this.objects.length; currentIndex++) {
        const object2 = this.objects[currentIndex];
        if (currentIndex < index) {
          position += object2.getLength();
        } else if (currentIndex === index) {
          position += offset;
          break;
        }
      }
      return position;
    }
    getEndPosition() {
      if (this.endPosition == null) {
        this.endPosition = 0;
        this.objects.forEach((object2) => this.endPosition += object2.getLength());
      }
      return this.endPosition;
    }
    toString() {
      return this.objects.join("");
    }
    toArray() {
      return this.objects.slice(0);
    }
    toJSON() {
      return this.toArray();
    }
    isEqualTo(splittableList) {
      return super.isEqualTo(...arguments) || objectArraysAreEqual(this.objects, splittableList === null || splittableList === void 0 ? void 0 : splittableList.objects);
    }
    contentsForInspection() {
      return {
        objects: "[".concat(this.objects.map((object2) => object2.inspect()).join(", "), "]")
      };
    }
  };
  var objectArraysAreEqual = function(left) {
    let right = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    if (left.length !== right.length) {
      return false;
    }
    let result = true;
    for (let index = 0; index < left.length; index++) {
      const object2 = left[index];
      if (result && !object2.isEqualTo(right[index])) {
        result = false;
      }
    }
    return result;
  };
  var startOfRange = (range) => range[0];
  var endOfRange = (range) => range[1];
  var Text = class extends TrixObject {
    static textForAttachmentWithAttributes(attachment, attributes2) {
      const piece = new AttachmentPiece(attachment, attributes2);
      return new this([piece]);
    }
    static textForStringWithAttributes(string, attributes2) {
      const piece = new StringPiece(string, attributes2);
      return new this([piece]);
    }
    static fromJSON(textJSON) {
      const pieces = Array.from(textJSON).map((pieceJSON) => Piece.fromJSON(pieceJSON));
      return new this(pieces);
    }
    constructor() {
      let pieces = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      super(...arguments);
      const notEmpty = pieces.filter((piece) => !piece.isEmpty());
      this.pieceList = new SplittableList(notEmpty);
    }
    copy() {
      return this.copyWithPieceList(this.pieceList);
    }
    copyWithPieceList(pieceList) {
      return new this.constructor(pieceList.consolidate().toArray());
    }
    copyUsingObjectMap(objectMap) {
      const pieces = this.getPieces().map((piece) => objectMap.find(piece) || piece);
      return new this.constructor(pieces);
    }
    appendText(text) {
      return this.insertTextAtPosition(text, this.getLength());
    }
    insertTextAtPosition(text, position) {
      return this.copyWithPieceList(this.pieceList.insertSplittableListAtPosition(text.pieceList, position));
    }
    removeTextAtRange(range) {
      return this.copyWithPieceList(this.pieceList.removeObjectsInRange(range));
    }
    replaceTextAtRange(text, range) {
      return this.removeTextAtRange(range).insertTextAtPosition(text, range[0]);
    }
    moveTextFromRangeToPosition(range, position) {
      if (range[0] <= position && position <= range[1])
        return;
      const text = this.getTextAtRange(range);
      const length = text.getLength();
      if (range[0] < position) {
        position -= length;
      }
      return this.removeTextAtRange(range).insertTextAtPosition(text, position);
    }
    addAttributeAtRange(attribute, value, range) {
      const attributes2 = {};
      attributes2[attribute] = value;
      return this.addAttributesAtRange(attributes2, range);
    }
    addAttributesAtRange(attributes2, range) {
      return this.copyWithPieceList(this.pieceList.transformObjectsInRange(range, (piece) => piece.copyWithAdditionalAttributes(attributes2)));
    }
    removeAttributeAtRange(attribute, range) {
      return this.copyWithPieceList(this.pieceList.transformObjectsInRange(range, (piece) => piece.copyWithoutAttribute(attribute)));
    }
    setAttributesAtRange(attributes2, range) {
      return this.copyWithPieceList(this.pieceList.transformObjectsInRange(range, (piece) => piece.copyWithAttributes(attributes2)));
    }
    getAttributesAtPosition(position) {
      var _this$pieceList$getOb;
      return ((_this$pieceList$getOb = this.pieceList.getObjectAtPosition(position)) === null || _this$pieceList$getOb === void 0 ? void 0 : _this$pieceList$getOb.getAttributes()) || {};
    }
    getCommonAttributes() {
      const objects = Array.from(this.pieceList.toArray()).map((piece) => piece.getAttributes());
      return Hash.fromCommonAttributesOfObjects(objects).toObject();
    }
    getCommonAttributesAtRange(range) {
      return this.getTextAtRange(range).getCommonAttributes() || {};
    }
    getExpandedRangeForAttributeAtOffset(attributeName, offset) {
      let right;
      let left = right = offset;
      const length = this.getLength();
      while (left > 0 && this.getCommonAttributesAtRange([left - 1, right])[attributeName]) {
        left--;
      }
      while (right < length && this.getCommonAttributesAtRange([offset, right + 1])[attributeName]) {
        right++;
      }
      return [left, right];
    }
    getTextAtRange(range) {
      return this.copyWithPieceList(this.pieceList.getSplittableListInRange(range));
    }
    getStringAtRange(range) {
      return this.pieceList.getSplittableListInRange(range).toString();
    }
    getStringAtPosition(position) {
      return this.getStringAtRange([position, position + 1]);
    }
    startsWithString(string) {
      return this.getStringAtRange([0, string.length]) === string;
    }
    endsWithString(string) {
      const length = this.getLength();
      return this.getStringAtRange([length - string.length, length]) === string;
    }
    getAttachmentPieces() {
      return this.pieceList.toArray().filter((piece) => !!piece.attachment);
    }
    getAttachments() {
      return this.getAttachmentPieces().map((piece) => piece.attachment);
    }
    getAttachmentAndPositionById(attachmentId) {
      let position = 0;
      for (const piece of this.pieceList.toArray()) {
        var _piece$attachment;
        if (((_piece$attachment = piece.attachment) === null || _piece$attachment === void 0 ? void 0 : _piece$attachment.id) === attachmentId) {
          return {
            attachment: piece.attachment,
            position
          };
        }
        position += piece.length;
      }
      return {
        attachment: null,
        position: null
      };
    }
    getAttachmentById(attachmentId) {
      const {
        attachment
      } = this.getAttachmentAndPositionById(attachmentId);
      return attachment;
    }
    getRangeOfAttachment(attachment) {
      const attachmentAndPosition = this.getAttachmentAndPositionById(attachment.id);
      const position = attachmentAndPosition.position;
      attachment = attachmentAndPosition.attachment;
      if (attachment) {
        return [position, position + 1];
      }
    }
    updateAttributesForAttachment(attributes2, attachment) {
      const range = this.getRangeOfAttachment(attachment);
      if (range) {
        return this.addAttributesAtRange(attributes2, range);
      } else {
        return this;
      }
    }
    getLength() {
      return this.pieceList.getEndPosition();
    }
    isEmpty() {
      return this.getLength() === 0;
    }
    isEqualTo(text) {
      var _text$pieceList;
      return super.isEqualTo(text) || (text === null || text === void 0 ? void 0 : (_text$pieceList = text.pieceList) === null || _text$pieceList === void 0 ? void 0 : _text$pieceList.isEqualTo(this.pieceList));
    }
    isBlockBreak() {
      return this.getLength() === 1 && this.pieceList.getObjectAtIndex(0).isBlockBreak();
    }
    eachPiece(callback) {
      return this.pieceList.eachObject(callback);
    }
    getPieces() {
      return this.pieceList.toArray();
    }
    getPieceAtPosition(position) {
      return this.pieceList.getObjectAtPosition(position);
    }
    contentsForInspection() {
      return {
        pieceList: this.pieceList.inspect()
      };
    }
    toSerializableText() {
      const pieceList = this.pieceList.selectSplittableList((piece) => piece.isSerializable());
      return this.copyWithPieceList(pieceList);
    }
    toString() {
      return this.pieceList.toString();
    }
    toJSON() {
      return this.pieceList.toJSON();
    }
    toConsole() {
      return JSON.stringify(this.pieceList.toArray().map((piece) => JSON.parse(piece.toConsole())));
    }
    getDirection() {
      return getDirection(this.toString());
    }
    isRTL() {
      return this.getDirection() === "rtl";
    }
  };
  var Block = class extends TrixObject {
    static fromJSON(blockJSON) {
      const text = Text.fromJSON(blockJSON.text);
      return new this(text, blockJSON.attributes);
    }
    constructor(text, attributes2) {
      super(...arguments);
      this.text = applyBlockBreakToText(text || new Text());
      this.attributes = attributes2 || [];
    }
    isEmpty() {
      return this.text.isBlockBreak();
    }
    isEqualTo(block) {
      if (super.isEqualTo(block))
        return true;
      return this.text.isEqualTo(block === null || block === void 0 ? void 0 : block.text) && arraysAreEqual(this.attributes, block === null || block === void 0 ? void 0 : block.attributes);
    }
    copyWithText(text) {
      return new Block(text, this.attributes);
    }
    copyWithoutText() {
      return this.copyWithText(null);
    }
    copyWithAttributes(attributes2) {
      return new Block(this.text, attributes2);
    }
    copyWithoutAttributes() {
      return this.copyWithAttributes(null);
    }
    copyUsingObjectMap(objectMap) {
      const mappedText = objectMap.find(this.text);
      if (mappedText) {
        return this.copyWithText(mappedText);
      } else {
        return this.copyWithText(this.text.copyUsingObjectMap(objectMap));
      }
    }
    addAttribute(attribute) {
      const attributes2 = this.attributes.concat(expandAttribute(attribute));
      return this.copyWithAttributes(attributes2);
    }
    removeAttribute(attribute) {
      const {
        listAttribute
      } = getBlockConfig(attribute);
      const attributes2 = removeLastValue(removeLastValue(this.attributes, attribute), listAttribute);
      return this.copyWithAttributes(attributes2);
    }
    removeLastAttribute() {
      return this.removeAttribute(this.getLastAttribute());
    }
    getLastAttribute() {
      return getLastElement(this.attributes);
    }
    getAttributes() {
      return this.attributes.slice(0);
    }
    getAttributeLevel() {
      return this.attributes.length;
    }
    getAttributeAtLevel(level) {
      return this.attributes[level - 1];
    }
    hasAttribute(attributeName) {
      return this.attributes.includes(attributeName);
    }
    hasAttributes() {
      return this.getAttributeLevel() > 0;
    }
    getLastNestableAttribute() {
      return getLastElement(this.getNestableAttributes());
    }
    getNestableAttributes() {
      return this.attributes.filter((attribute) => getBlockConfig(attribute).nestable);
    }
    getNestingLevel() {
      return this.getNestableAttributes().length;
    }
    decreaseNestingLevel() {
      const attribute = this.getLastNestableAttribute();
      if (attribute) {
        return this.removeAttribute(attribute);
      } else {
        return this;
      }
    }
    increaseNestingLevel() {
      const attribute = this.getLastNestableAttribute();
      if (attribute) {
        const index = this.attributes.lastIndexOf(attribute);
        const attributes2 = spliceArray(this.attributes, index + 1, 0, ...expandAttribute(attribute));
        return this.copyWithAttributes(attributes2);
      } else {
        return this;
      }
    }
    getListItemAttributes() {
      return this.attributes.filter((attribute) => getBlockConfig(attribute).listAttribute);
    }
    isListItem() {
      var _getBlockConfig;
      return (_getBlockConfig = getBlockConfig(this.getLastAttribute())) === null || _getBlockConfig === void 0 ? void 0 : _getBlockConfig.listAttribute;
    }
    isTerminalBlock() {
      var _getBlockConfig2;
      return (_getBlockConfig2 = getBlockConfig(this.getLastAttribute())) === null || _getBlockConfig2 === void 0 ? void 0 : _getBlockConfig2.terminal;
    }
    breaksOnReturn() {
      var _getBlockConfig3;
      return (_getBlockConfig3 = getBlockConfig(this.getLastAttribute())) === null || _getBlockConfig3 === void 0 ? void 0 : _getBlockConfig3.breakOnReturn;
    }
    findLineBreakInDirectionFromPosition(direction, position) {
      const string = this.toString();
      let result;
      switch (direction) {
        case "forward":
          result = string.indexOf("\n", position);
          break;
        case "backward":
          result = string.slice(0, position).lastIndexOf("\n");
      }
      if (result !== -1) {
        return result;
      }
    }
    contentsForInspection() {
      return {
        text: this.text.inspect(),
        attributes: this.attributes
      };
    }
    toString() {
      return this.text.toString();
    }
    toJSON() {
      return {
        text: this.text,
        attributes: this.attributes
      };
    }
    getDirection() {
      return this.text.getDirection();
    }
    isRTL() {
      return this.text.isRTL();
    }
    getLength() {
      return this.text.getLength();
    }
    canBeConsolidatedWith(block) {
      return !this.hasAttributes() && !block.hasAttributes() && this.getDirection() === block.getDirection();
    }
    consolidateWith(block) {
      const newlineText = Text.textForStringWithAttributes("\n");
      const text = this.getTextWithoutBlockBreak().appendText(newlineText);
      return this.copyWithText(text.appendText(block.text));
    }
    splitAtOffset(offset) {
      let left, right;
      if (offset === 0) {
        left = null;
        right = this;
      } else if (offset === this.getLength()) {
        left = this;
        right = null;
      } else {
        left = this.copyWithText(this.text.getTextAtRange([0, offset]));
        right = this.copyWithText(this.text.getTextAtRange([offset, this.getLength()]));
      }
      return [left, right];
    }
    getBlockBreakPosition() {
      return this.text.getLength() - 1;
    }
    getTextWithoutBlockBreak() {
      if (textEndsInBlockBreak(this.text)) {
        return this.text.getTextAtRange([0, this.getBlockBreakPosition()]);
      } else {
        return this.text.copy();
      }
    }
    canBeGrouped(depth) {
      return this.attributes[depth];
    }
    canBeGroupedWith(otherBlock, depth) {
      const otherAttributes = otherBlock.getAttributes();
      const otherAttribute = otherAttributes[depth];
      const attribute = this.attributes[depth];
      return attribute === otherAttribute && !(getBlockConfig(attribute).group === false && !getListAttributeNames().includes(otherAttributes[depth + 1])) && (this.getDirection() === otherBlock.getDirection() || otherBlock.isEmpty());
    }
  };
  var applyBlockBreakToText = function(text) {
    text = unmarkExistingInnerBlockBreaksInText(text);
    text = addBlockBreakToText(text);
    return text;
  };
  var unmarkExistingInnerBlockBreaksInText = function(text) {
    let modified = false;
    const pieces = text.getPieces();
    let innerPieces = pieces.slice(0, pieces.length - 1);
    const lastPiece = pieces[pieces.length - 1];
    if (!lastPiece)
      return text;
    innerPieces = innerPieces.map((piece) => {
      if (piece.isBlockBreak()) {
        modified = true;
        return unmarkBlockBreakPiece(piece);
      } else {
        return piece;
      }
    });
    if (modified) {
      return new Text([...innerPieces, lastPiece]);
    } else {
      return text;
    }
  };
  var blockBreakText = Text.textForStringWithAttributes("\n", {
    blockBreak: true
  });
  var addBlockBreakToText = function(text) {
    if (textEndsInBlockBreak(text)) {
      return text;
    } else {
      return text.appendText(blockBreakText);
    }
  };
  var textEndsInBlockBreak = function(text) {
    const length = text.getLength();
    if (length === 0) {
      return false;
    }
    const endText = text.getTextAtRange([length - 1, length]);
    return endText.isBlockBreak();
  };
  var unmarkBlockBreakPiece = (piece) => piece.copyWithoutAttribute("blockBreak");
  var expandAttribute = function(attribute) {
    const {
      listAttribute
    } = getBlockConfig(attribute);
    if (listAttribute) {
      return [listAttribute, attribute];
    } else {
      return [attribute];
    }
  };
  var getLastElement = (array) => array.slice(-1)[0];
  var removeLastValue = function(array, value) {
    const index = array.lastIndexOf(value);
    if (index === -1) {
      return array;
    } else {
      return spliceArray(array, index, 1);
    }
  };
  var ObjectMap = class extends BasicObject {
    constructor() {
      let objects = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      super(...arguments);
      this.objects = {};
      Array.from(objects).forEach((object2) => {
        const hash = JSON.stringify(object2);
        if (this.objects[hash] == null) {
          this.objects[hash] = object2;
        }
      });
    }
    find(object2) {
      const hash = JSON.stringify(object2);
      return this.objects[hash];
    }
  };
  var Document = class extends TrixObject {
    static fromJSON(documentJSON) {
      const blocks = Array.from(documentJSON).map((blockJSON) => Block.fromJSON(blockJSON));
      return new this(blocks);
    }
    static fromString(string, textAttributes2) {
      const text = Text.textForStringWithAttributes(string, textAttributes2);
      return new this([new Block(text)]);
    }
    constructor() {
      let blocks = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      super(...arguments);
      if (blocks.length === 0) {
        blocks = [new Block()];
      }
      this.blockList = SplittableList.box(blocks);
    }
    isEmpty() {
      const block = this.getBlockAtIndex(0);
      return this.blockList.length === 1 && block.isEmpty() && !block.hasAttributes();
    }
    copy() {
      let options2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      const blocks = options2.consolidateBlocks ? this.blockList.consolidate().toArray() : this.blockList.toArray();
      return new this.constructor(blocks);
    }
    copyUsingObjectsFromDocument(sourceDocument) {
      const objectMap = new ObjectMap(sourceDocument.getObjects());
      return this.copyUsingObjectMap(objectMap);
    }
    copyUsingObjectMap(objectMap) {
      const blocks = this.getBlocks().map((block) => {
        const mappedBlock = objectMap.find(block);
        return mappedBlock || block.copyUsingObjectMap(objectMap);
      });
      return new this.constructor(blocks);
    }
    copyWithBaseBlockAttributes() {
      let blockAttributes = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      const blocks = this.getBlocks().map((block) => {
        const attributes2 = blockAttributes.concat(block.getAttributes());
        return block.copyWithAttributes(attributes2);
      });
      return new this.constructor(blocks);
    }
    replaceBlock(oldBlock, newBlock) {
      const index = this.blockList.indexOf(oldBlock);
      if (index === -1) {
        return this;
      }
      return new this.constructor(this.blockList.replaceObjectAtIndex(newBlock, index));
    }
    insertDocumentAtRange(document2, range) {
      const {
        blockList
      } = document2;
      range = normalizeRange(range);
      let [position] = range;
      const {
        index,
        offset
      } = this.locationFromPosition(position);
      let result = this;
      const block = this.getBlockAtPosition(position);
      if (rangeIsCollapsed(range) && block.isEmpty() && !block.hasAttributes()) {
        result = new this.constructor(result.blockList.removeObjectAtIndex(index));
      } else if (block.getBlockBreakPosition() === offset) {
        position++;
      }
      result = result.removeTextAtRange(range);
      return new this.constructor(result.blockList.insertSplittableListAtPosition(blockList, position));
    }
    mergeDocumentAtRange(document2, range) {
      let formattedDocument, result;
      range = normalizeRange(range);
      const [startPosition] = range;
      const startLocation = this.locationFromPosition(startPosition);
      const blockAttributes = this.getBlockAtIndex(startLocation.index).getAttributes();
      const baseBlockAttributes = document2.getBaseBlockAttributes();
      const trailingBlockAttributes = blockAttributes.slice(-baseBlockAttributes.length);
      if (arraysAreEqual(baseBlockAttributes, trailingBlockAttributes)) {
        const leadingBlockAttributes = blockAttributes.slice(0, -baseBlockAttributes.length);
        formattedDocument = document2.copyWithBaseBlockAttributes(leadingBlockAttributes);
      } else {
        formattedDocument = document2.copy({
          consolidateBlocks: true
        }).copyWithBaseBlockAttributes(blockAttributes);
      }
      const blockCount = formattedDocument.getBlockCount();
      const firstBlock = formattedDocument.getBlockAtIndex(0);
      if (arraysAreEqual(blockAttributes, firstBlock.getAttributes())) {
        const firstText = firstBlock.getTextWithoutBlockBreak();
        result = this.insertTextAtRange(firstText, range);
        if (blockCount > 1) {
          formattedDocument = new this.constructor(formattedDocument.getBlocks().slice(1));
          const position = startPosition + firstText.getLength();
          result = result.insertDocumentAtRange(formattedDocument, position);
        }
      } else {
        result = this.insertDocumentAtRange(formattedDocument, range);
      }
      return result;
    }
    insertTextAtRange(text, range) {
      range = normalizeRange(range);
      const [startPosition] = range;
      const {
        index,
        offset
      } = this.locationFromPosition(startPosition);
      const document2 = this.removeTextAtRange(range);
      return new this.constructor(document2.blockList.editObjectAtIndex(index, (block) => block.copyWithText(block.text.insertTextAtPosition(text, offset))));
    }
    removeTextAtRange(range) {
      let blocks;
      range = normalizeRange(range);
      const [leftPosition, rightPosition] = range;
      if (rangeIsCollapsed(range)) {
        return this;
      }
      const [leftLocation, rightLocation] = Array.from(this.locationRangeFromRange(range));
      const leftIndex = leftLocation.index;
      const leftOffset = leftLocation.offset;
      const leftBlock = this.getBlockAtIndex(leftIndex);
      const rightIndex = rightLocation.index;
      const rightOffset = rightLocation.offset;
      const rightBlock = this.getBlockAtIndex(rightIndex);
      const removeRightNewline = rightPosition - leftPosition === 1 && leftBlock.getBlockBreakPosition() === leftOffset && rightBlock.getBlockBreakPosition() !== rightOffset && rightBlock.text.getStringAtPosition(rightOffset) === "\n";
      if (removeRightNewline) {
        blocks = this.blockList.editObjectAtIndex(rightIndex, (block) => block.copyWithText(block.text.removeTextAtRange([rightOffset, rightOffset + 1])));
      } else {
        let block;
        const leftText = leftBlock.text.getTextAtRange([0, leftOffset]);
        const rightText = rightBlock.text.getTextAtRange([rightOffset, rightBlock.getLength()]);
        const text = leftText.appendText(rightText);
        const removingLeftBlock = leftIndex !== rightIndex && leftOffset === 0;
        const useRightBlock = removingLeftBlock && leftBlock.getAttributeLevel() >= rightBlock.getAttributeLevel();
        if (useRightBlock) {
          block = rightBlock.copyWithText(text);
        } else {
          block = leftBlock.copyWithText(text);
        }
        const affectedBlockCount = rightIndex + 1 - leftIndex;
        blocks = this.blockList.splice(leftIndex, affectedBlockCount, block);
      }
      return new this.constructor(blocks);
    }
    moveTextFromRangeToPosition(range, position) {
      let text;
      range = normalizeRange(range);
      const [startPosition, endPosition] = range;
      if (startPosition <= position && position <= endPosition) {
        return this;
      }
      let document2 = this.getDocumentAtRange(range);
      let result = this.removeTextAtRange(range);
      const movingRightward = startPosition < position;
      if (movingRightward) {
        position -= document2.getLength();
      }
      const [firstBlock, ...blocks] = document2.getBlocks();
      if (blocks.length === 0) {
        text = firstBlock.getTextWithoutBlockBreak();
        if (movingRightward) {
          position += 1;
        }
      } else {
        text = firstBlock.text;
      }
      result = result.insertTextAtRange(text, position);
      if (blocks.length === 0) {
        return result;
      }
      document2 = new this.constructor(blocks);
      position += text.getLength();
      return result.insertDocumentAtRange(document2, position);
    }
    addAttributeAtRange(attribute, value, range) {
      let {
        blockList
      } = this;
      this.eachBlockAtRange(range, (block, textRange, index) => blockList = blockList.editObjectAtIndex(index, function() {
        if (getBlockConfig(attribute)) {
          return block.addAttribute(attribute, value);
        } else {
          if (textRange[0] === textRange[1]) {
            return block;
          } else {
            return block.copyWithText(block.text.addAttributeAtRange(attribute, value, textRange));
          }
        }
      }));
      return new this.constructor(blockList);
    }
    addAttribute(attribute, value) {
      let {
        blockList
      } = this;
      this.eachBlock((block, index) => blockList = blockList.editObjectAtIndex(index, () => block.addAttribute(attribute, value)));
      return new this.constructor(blockList);
    }
    removeAttributeAtRange(attribute, range) {
      let {
        blockList
      } = this;
      this.eachBlockAtRange(range, function(block, textRange, index) {
        if (getBlockConfig(attribute)) {
          blockList = blockList.editObjectAtIndex(index, () => block.removeAttribute(attribute));
        } else if (textRange[0] !== textRange[1]) {
          blockList = blockList.editObjectAtIndex(index, () => block.copyWithText(block.text.removeAttributeAtRange(attribute, textRange)));
        }
      });
      return new this.constructor(blockList);
    }
    updateAttributesForAttachment(attributes2, attachment) {
      const range = this.getRangeOfAttachment(attachment);
      const [startPosition] = Array.from(range);
      const {
        index
      } = this.locationFromPosition(startPosition);
      const text = this.getTextAtIndex(index);
      return new this.constructor(this.blockList.editObjectAtIndex(index, (block) => block.copyWithText(text.updateAttributesForAttachment(attributes2, attachment))));
    }
    removeAttributeForAttachment(attribute, attachment) {
      const range = this.getRangeOfAttachment(attachment);
      return this.removeAttributeAtRange(attribute, range);
    }
    insertBlockBreakAtRange(range) {
      let blocks;
      range = normalizeRange(range);
      const [startPosition] = range;
      const {
        offset
      } = this.locationFromPosition(startPosition);
      const document2 = this.removeTextAtRange(range);
      if (offset === 0) {
        blocks = [new Block()];
      }
      return new this.constructor(document2.blockList.insertSplittableListAtPosition(new SplittableList(blocks), startPosition));
    }
    applyBlockAttributeAtRange(attributeName, value, range) {
      const expanded = this.expandRangeToLineBreaksAndSplitBlocks(range);
      let document2 = expanded.document;
      range = expanded.range;
      const blockConfig = getBlockConfig(attributeName);
      if (blockConfig.listAttribute) {
        document2 = document2.removeLastListAttributeAtRange(range, {
          exceptAttributeName: attributeName
        });
        const converted = document2.convertLineBreaksToBlockBreaksInRange(range);
        document2 = converted.document;
        range = converted.range;
      } else if (blockConfig.exclusive) {
        document2 = document2.removeBlockAttributesAtRange(range);
      } else if (blockConfig.terminal) {
        document2 = document2.removeLastTerminalAttributeAtRange(range);
      } else {
        document2 = document2.consolidateBlocksAtRange(range);
      }
      return document2.addAttributeAtRange(attributeName, value, range);
    }
    removeLastListAttributeAtRange(range) {
      let options2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let {
        blockList
      } = this;
      this.eachBlockAtRange(range, function(block, textRange, index) {
        const lastAttributeName = block.getLastAttribute();
        if (!lastAttributeName) {
          return;
        }
        if (!getBlockConfig(lastAttributeName).listAttribute) {
          return;
        }
        if (lastAttributeName === options2.exceptAttributeName) {
          return;
        }
        blockList = blockList.editObjectAtIndex(index, () => block.removeAttribute(lastAttributeName));
      });
      return new this.constructor(blockList);
    }
    removeLastTerminalAttributeAtRange(range) {
      let {
        blockList
      } = this;
      this.eachBlockAtRange(range, function(block, textRange, index) {
        const lastAttributeName = block.getLastAttribute();
        if (!lastAttributeName) {
          return;
        }
        if (!getBlockConfig(lastAttributeName).terminal) {
          return;
        }
        blockList = blockList.editObjectAtIndex(index, () => block.removeAttribute(lastAttributeName));
      });
      return new this.constructor(blockList);
    }
    removeBlockAttributesAtRange(range) {
      let {
        blockList
      } = this;
      this.eachBlockAtRange(range, function(block, textRange, index) {
        if (block.hasAttributes()) {
          blockList = blockList.editObjectAtIndex(index, () => block.copyWithoutAttributes());
        }
      });
      return new this.constructor(blockList);
    }
    expandRangeToLineBreaksAndSplitBlocks(range) {
      let position;
      range = normalizeRange(range);
      let [startPosition, endPosition] = range;
      const startLocation = this.locationFromPosition(startPosition);
      const endLocation = this.locationFromPosition(endPosition);
      let document2 = this;
      const startBlock = document2.getBlockAtIndex(startLocation.index);
      startLocation.offset = startBlock.findLineBreakInDirectionFromPosition("backward", startLocation.offset);
      if (startLocation.offset != null) {
        position = document2.positionFromLocation(startLocation);
        document2 = document2.insertBlockBreakAtRange([position, position + 1]);
        endLocation.index += 1;
        endLocation.offset -= document2.getBlockAtIndex(startLocation.index).getLength();
        startLocation.index += 1;
      }
      startLocation.offset = 0;
      if (endLocation.offset === 0 && endLocation.index > startLocation.index) {
        endLocation.index -= 1;
        endLocation.offset = document2.getBlockAtIndex(endLocation.index).getBlockBreakPosition();
      } else {
        const endBlock = document2.getBlockAtIndex(endLocation.index);
        if (endBlock.text.getStringAtRange([endLocation.offset - 1, endLocation.offset]) === "\n") {
          endLocation.offset -= 1;
        } else {
          endLocation.offset = endBlock.findLineBreakInDirectionFromPosition("forward", endLocation.offset);
        }
        if (endLocation.offset !== endBlock.getBlockBreakPosition()) {
          position = document2.positionFromLocation(endLocation);
          document2 = document2.insertBlockBreakAtRange([position, position + 1]);
        }
      }
      startPosition = document2.positionFromLocation(startLocation);
      endPosition = document2.positionFromLocation(endLocation);
      range = normalizeRange([startPosition, endPosition]);
      return {
        document: document2,
        range
      };
    }
    convertLineBreaksToBlockBreaksInRange(range) {
      range = normalizeRange(range);
      let [position] = range;
      const string = this.getStringAtRange(range).slice(0, -1);
      let document2 = this;
      string.replace(/.*?\n/g, function(match2) {
        position += match2.length;
        document2 = document2.insertBlockBreakAtRange([position - 1, position]);
      });
      return {
        document: document2,
        range
      };
    }
    consolidateBlocksAtRange(range) {
      range = normalizeRange(range);
      const [startPosition, endPosition] = range;
      const startIndex = this.locationFromPosition(startPosition).index;
      const endIndex = this.locationFromPosition(endPosition).index;
      return new this.constructor(this.blockList.consolidateFromIndexToIndex(startIndex, endIndex));
    }
    getDocumentAtRange(range) {
      range = normalizeRange(range);
      const blocks = this.blockList.getSplittableListInRange(range).toArray();
      return new this.constructor(blocks);
    }
    getStringAtRange(range) {
      let endIndex;
      const array = range = normalizeRange(range), endPosition = array[array.length - 1];
      if (endPosition !== this.getLength()) {
        endIndex = -1;
      }
      return this.getDocumentAtRange(range).toString().slice(0, endIndex);
    }
    getBlockAtIndex(index) {
      return this.blockList.getObjectAtIndex(index);
    }
    getBlockAtPosition(position) {
      const {
        index
      } = this.locationFromPosition(position);
      return this.getBlockAtIndex(index);
    }
    getTextAtIndex(index) {
      var _this$getBlockAtIndex;
      return (_this$getBlockAtIndex = this.getBlockAtIndex(index)) === null || _this$getBlockAtIndex === void 0 ? void 0 : _this$getBlockAtIndex.text;
    }
    getTextAtPosition(position) {
      const {
        index
      } = this.locationFromPosition(position);
      return this.getTextAtIndex(index);
    }
    getPieceAtPosition(position) {
      const {
        index,
        offset
      } = this.locationFromPosition(position);
      return this.getTextAtIndex(index).getPieceAtPosition(offset);
    }
    getCharacterAtPosition(position) {
      const {
        index,
        offset
      } = this.locationFromPosition(position);
      return this.getTextAtIndex(index).getStringAtRange([offset, offset + 1]);
    }
    getLength() {
      return this.blockList.getEndPosition();
    }
    getBlocks() {
      return this.blockList.toArray();
    }
    getBlockCount() {
      return this.blockList.length;
    }
    getEditCount() {
      return this.editCount;
    }
    eachBlock(callback) {
      return this.blockList.eachObject(callback);
    }
    eachBlockAtRange(range, callback) {
      let block, textRange;
      range = normalizeRange(range);
      const [startPosition, endPosition] = range;
      const startLocation = this.locationFromPosition(startPosition);
      const endLocation = this.locationFromPosition(endPosition);
      if (startLocation.index === endLocation.index) {
        block = this.getBlockAtIndex(startLocation.index);
        textRange = [startLocation.offset, endLocation.offset];
        return callback(block, textRange, startLocation.index);
      } else {
        for (let index = startLocation.index; index <= endLocation.index; index++) {
          block = this.getBlockAtIndex(index);
          if (block) {
            switch (index) {
              case startLocation.index:
                textRange = [startLocation.offset, block.text.getLength()];
                break;
              case endLocation.index:
                textRange = [0, endLocation.offset];
                break;
              default:
                textRange = [0, block.text.getLength()];
            }
            callback(block, textRange, index);
          }
        }
      }
    }
    getCommonAttributesAtRange(range) {
      range = normalizeRange(range);
      const [startPosition] = range;
      if (rangeIsCollapsed(range)) {
        return this.getCommonAttributesAtPosition(startPosition);
      } else {
        const textAttributes2 = [];
        const blockAttributes = [];
        this.eachBlockAtRange(range, function(block, textRange) {
          if (textRange[0] !== textRange[1]) {
            textAttributes2.push(block.text.getCommonAttributesAtRange(textRange));
            return blockAttributes.push(attributesForBlock(block));
          }
        });
        return Hash.fromCommonAttributesOfObjects(textAttributes2).merge(Hash.fromCommonAttributesOfObjects(blockAttributes)).toObject();
      }
    }
    getCommonAttributesAtPosition(position) {
      let key, value;
      const {
        index,
        offset
      } = this.locationFromPosition(position);
      const block = this.getBlockAtIndex(index);
      if (!block) {
        return {};
      }
      const commonAttributes = attributesForBlock(block);
      const attributes2 = block.text.getAttributesAtPosition(offset);
      const attributesLeft = block.text.getAttributesAtPosition(offset - 1);
      const inheritableAttributes = Object.keys(config.textAttributes).filter((key2) => {
        return config.textAttributes[key2].inheritable;
      });
      for (key in attributesLeft) {
        value = attributesLeft[key];
        if (value === attributes2[key] || inheritableAttributes.includes(key)) {
          commonAttributes[key] = value;
        }
      }
      return commonAttributes;
    }
    getRangeOfCommonAttributeAtPosition(attributeName, position) {
      const {
        index,
        offset
      } = this.locationFromPosition(position);
      const text = this.getTextAtIndex(index);
      const [startOffset, endOffset] = Array.from(text.getExpandedRangeForAttributeAtOffset(attributeName, offset));
      const start2 = this.positionFromLocation({
        index,
        offset: startOffset
      });
      const end = this.positionFromLocation({
        index,
        offset: endOffset
      });
      return normalizeRange([start2, end]);
    }
    getBaseBlockAttributes() {
      let baseBlockAttributes = this.getBlockAtIndex(0).getAttributes();
      for (let blockIndex = 1; blockIndex < this.getBlockCount(); blockIndex++) {
        const blockAttributes = this.getBlockAtIndex(blockIndex).getAttributes();
        const lastAttributeIndex = Math.min(baseBlockAttributes.length, blockAttributes.length);
        baseBlockAttributes = (() => {
          const result = [];
          for (let index = 0; index < lastAttributeIndex; index++) {
            if (blockAttributes[index] !== baseBlockAttributes[index]) {
              break;
            }
            result.push(blockAttributes[index]);
          }
          return result;
        })();
      }
      return baseBlockAttributes;
    }
    getAttachmentById(attachmentId) {
      for (const attachment of this.getAttachments()) {
        if (attachment.id === attachmentId) {
          return attachment;
        }
      }
    }
    getAttachmentPieces() {
      let attachmentPieces = [];
      this.blockList.eachObject((_ref) => {
        let {
          text
        } = _ref;
        return attachmentPieces = attachmentPieces.concat(text.getAttachmentPieces());
      });
      return attachmentPieces;
    }
    getAttachments() {
      return this.getAttachmentPieces().map((piece) => piece.attachment);
    }
    getRangeOfAttachment(attachment) {
      let position = 0;
      const iterable = this.blockList.toArray();
      for (let index = 0; index < iterable.length; index++) {
        const {
          text
        } = iterable[index];
        const textRange = text.getRangeOfAttachment(attachment);
        if (textRange) {
          return normalizeRange([position + textRange[0], position + textRange[1]]);
        }
        position += text.getLength();
      }
    }
    getLocationRangeOfAttachment(attachment) {
      const range = this.getRangeOfAttachment(attachment);
      return this.locationRangeFromRange(range);
    }
    getAttachmentPieceForAttachment(attachment) {
      for (const piece of this.getAttachmentPieces()) {
        if (piece.attachment === attachment) {
          return piece;
        }
      }
    }
    findRangesForBlockAttribute(attributeName) {
      let position = 0;
      const ranges = [];
      this.getBlocks().forEach((block) => {
        const length = block.getLength();
        if (block.hasAttribute(attributeName)) {
          ranges.push([position, position + length]);
        }
        position += length;
      });
      return ranges;
    }
    findRangesForTextAttribute(attributeName) {
      let {
        withValue
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let position = 0;
      let range = [];
      const ranges = [];
      const match2 = function(piece) {
        if (withValue) {
          return piece.getAttribute(attributeName) === withValue;
        } else {
          return piece.hasAttribute(attributeName);
        }
      };
      this.getPieces().forEach((piece) => {
        const length = piece.getLength();
        if (match2(piece)) {
          if (range[1] === position) {
            range[1] = position + length;
          } else {
            ranges.push(range = [position, position + length]);
          }
        }
        position += length;
      });
      return ranges;
    }
    locationFromPosition(position) {
      const location2 = this.blockList.findIndexAndOffsetAtPosition(Math.max(0, position));
      if (location2.index != null) {
        return location2;
      } else {
        const blocks = this.getBlocks();
        return {
          index: blocks.length - 1,
          offset: blocks[blocks.length - 1].getLength()
        };
      }
    }
    positionFromLocation(location2) {
      return this.blockList.findPositionAtIndexAndOffset(location2.index, location2.offset);
    }
    locationRangeFromPosition(position) {
      return normalizeRange(this.locationFromPosition(position));
    }
    locationRangeFromRange(range) {
      range = normalizeRange(range);
      if (!range)
        return;
      const [startPosition, endPosition] = Array.from(range);
      const startLocation = this.locationFromPosition(startPosition);
      const endLocation = this.locationFromPosition(endPosition);
      return normalizeRange([startLocation, endLocation]);
    }
    rangeFromLocationRange(locationRange) {
      let rightPosition;
      locationRange = normalizeRange(locationRange);
      const leftPosition = this.positionFromLocation(locationRange[0]);
      if (!rangeIsCollapsed(locationRange)) {
        rightPosition = this.positionFromLocation(locationRange[1]);
      }
      return normalizeRange([leftPosition, rightPosition]);
    }
    isEqualTo(document2) {
      return this.blockList.isEqualTo(document2 === null || document2 === void 0 ? void 0 : document2.blockList);
    }
    getTexts() {
      return this.getBlocks().map((block) => block.text);
    }
    getPieces() {
      const pieces = [];
      Array.from(this.getTexts()).forEach((text) => {
        pieces.push(...Array.from(text.getPieces() || []));
      });
      return pieces;
    }
    getObjects() {
      return this.getBlocks().concat(this.getTexts()).concat(this.getPieces());
    }
    toSerializableDocument() {
      const blocks = [];
      this.blockList.eachObject((block) => blocks.push(block.copyWithText(block.text.toSerializableText())));
      return new this.constructor(blocks);
    }
    toString() {
      return this.blockList.toString();
    }
    toJSON() {
      return this.blockList.toJSON();
    }
    toConsole() {
      return JSON.stringify(this.blockList.toArray()).map((block) => JSON.parse(block.text.toConsole()));
    }
  };
  var attributesForBlock = function(block) {
    const attributes2 = {};
    const attributeName = block.getLastAttribute();
    if (attributeName) {
      attributes2[attributeName] = true;
    }
    return attributes2;
  };
  var DEFAULT_ALLOWED_ATTRIBUTES = "style href src width height class".split(" ");
  var DEFAULT_FORBIDDEN_PROTOCOLS = "javascript:".split(" ");
  var DEFAULT_FORBIDDEN_ELEMENTS = "script iframe".split(" ");
  var HTMLSanitizer = class extends BasicObject {
    static sanitize(html2, options2) {
      const sanitizer = new this(html2, options2);
      sanitizer.sanitize();
      return sanitizer;
    }
    constructor(html2) {
      let {
        allowedAttributes,
        forbiddenProtocols,
        forbiddenElements
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      super(...arguments);
      this.allowedAttributes = allowedAttributes || DEFAULT_ALLOWED_ATTRIBUTES;
      this.forbiddenProtocols = forbiddenProtocols || DEFAULT_FORBIDDEN_PROTOCOLS;
      this.forbiddenElements = forbiddenElements || DEFAULT_FORBIDDEN_ELEMENTS;
      this.body = createBodyElementForHTML(html2);
    }
    sanitize() {
      this.sanitizeElements();
      return this.normalizeListElementNesting();
    }
    getHTML() {
      return this.body.innerHTML;
    }
    getBody() {
      return this.body;
    }
    sanitizeElements() {
      const walker = walkTree(this.body);
      const nodesToRemove = [];
      while (walker.nextNode()) {
        const node = walker.currentNode;
        switch (node.nodeType) {
          case Node.ELEMENT_NODE:
            if (this.elementIsRemovable(node)) {
              nodesToRemove.push(node);
            } else {
              this.sanitizeElement(node);
            }
            break;
          case Node.COMMENT_NODE:
            nodesToRemove.push(node);
            break;
        }
      }
      nodesToRemove.forEach((node) => removeNode(node));
      return this.body;
    }
    sanitizeElement(element) {
      if (element.hasAttribute("href")) {
        if (this.forbiddenProtocols.includes(element.protocol)) {
          element.removeAttribute("href");
        }
      }
      Array.from(element.attributes).forEach((_ref) => {
        let {
          name
        } = _ref;
        if (!this.allowedAttributes.includes(name) && name.indexOf("data-trix") !== 0) {
          element.removeAttribute(name);
        }
      });
      return element;
    }
    normalizeListElementNesting() {
      Array.from(this.body.querySelectorAll("ul,ol")).forEach((listElement) => {
        const previousElement = listElement.previousElementSibling;
        if (previousElement) {
          if (tagName(previousElement) === "li") {
            previousElement.appendChild(listElement);
          }
        }
      });
      return this.body;
    }
    elementIsRemovable(element) {
      if ((element === null || element === void 0 ? void 0 : element.nodeType) !== Node.ELEMENT_NODE)
        return;
      return this.elementIsForbidden(element) || this.elementIsntSerializable(element);
    }
    elementIsForbidden(element) {
      return this.forbiddenElements.includes(tagName(element));
    }
    elementIsntSerializable(element) {
      return element.getAttribute("data-trix-serialize") === "false" && !nodeIsAttachmentElement(element);
    }
  };
  var createBodyElementForHTML = function() {
    let html2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
    html2 = html2.replace(/<\/html[^>]*>[^]*$/i, "</html>");
    const doc = document.implementation.createHTMLDocument("");
    doc.documentElement.innerHTML = html2;
    Array.from(doc.head.querySelectorAll("style")).forEach((element) => {
      doc.body.appendChild(element);
    });
    return doc.body;
  };
  var pieceForString = function(string) {
    let attributes2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const type = "string";
    string = normalizeSpaces(string);
    return {
      string,
      attributes: attributes2,
      type
    };
  };
  var pieceForAttachment = function(attachment) {
    let attributes2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const type = "attachment";
    return {
      attachment,
      attributes: attributes2,
      type
    };
  };
  var blockForAttributes = function() {
    let attributes2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    const text = [];
    return {
      text,
      attributes: attributes2
    };
  };
  var parseTrixDataAttribute = (element, name) => {
    try {
      return JSON.parse(element.getAttribute("data-trix-".concat(name)));
    } catch (error2) {
      return {};
    }
  };
  var getImageDimensions = (element) => {
    const width = element.getAttribute("width");
    const height = element.getAttribute("height");
    const dimensions = {};
    if (width) {
      dimensions.width = parseInt(width, 10);
    }
    if (height) {
      dimensions.height = parseInt(height, 10);
    }
    return dimensions;
  };
  var HTMLParser = class extends BasicObject {
    static parse(html2, options2) {
      const parser = new this(html2, options2);
      parser.parse();
      return parser;
    }
    constructor(html2) {
      let {
        referenceElement
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      super(...arguments);
      this.html = html2;
      this.referenceElement = referenceElement;
      this.blocks = [];
      this.blockElements = [];
      this.processedElements = [];
    }
    getDocument() {
      return Document.fromJSON(this.blocks);
    }
    parse() {
      try {
        this.createHiddenContainer();
        const html2 = HTMLSanitizer.sanitize(this.html).getHTML();
        this.containerElement.innerHTML = html2;
        const walker = walkTree(this.containerElement, {
          usingFilter: nodeFilter
        });
        while (walker.nextNode()) {
          this.processNode(walker.currentNode);
        }
        return this.translateBlockElementMarginsToNewlines();
      } finally {
        this.removeHiddenContainer();
      }
    }
    createHiddenContainer() {
      if (this.referenceElement) {
        this.containerElement = this.referenceElement.cloneNode(false);
        this.containerElement.removeAttribute("id");
        this.containerElement.setAttribute("data-trix-internal", "");
        this.containerElement.style.display = "none";
        return this.referenceElement.parentNode.insertBefore(this.containerElement, this.referenceElement.nextSibling);
      } else {
        this.containerElement = makeElement({
          tagName: "div",
          style: {
            display: "none"
          }
        });
        return document.body.appendChild(this.containerElement);
      }
    }
    removeHiddenContainer() {
      return removeNode(this.containerElement);
    }
    processNode(node) {
      switch (node.nodeType) {
        case Node.TEXT_NODE:
          if (!this.isInsignificantTextNode(node)) {
            this.appendBlockForTextNode(node);
            return this.processTextNode(node);
          }
          break;
        case Node.ELEMENT_NODE:
          this.appendBlockForElement(node);
          return this.processElement(node);
      }
    }
    appendBlockForTextNode(node) {
      const element = node.parentNode;
      if (element === this.currentBlockElement && this.isBlockElement(node.previousSibling)) {
        return this.appendStringWithAttributes("\n");
      } else if (element === this.containerElement || this.isBlockElement(element)) {
        var _this$currentBlock;
        const attributes2 = this.getBlockAttributes(element);
        if (!arraysAreEqual(attributes2, (_this$currentBlock = this.currentBlock) === null || _this$currentBlock === void 0 ? void 0 : _this$currentBlock.attributes)) {
          this.currentBlock = this.appendBlockForAttributesWithElement(attributes2, element);
          this.currentBlockElement = element;
        }
      }
    }
    appendBlockForElement(element) {
      const elementIsBlockElement = this.isBlockElement(element);
      const currentBlockContainsElement = elementContainsNode(this.currentBlockElement, element);
      if (elementIsBlockElement && !this.isBlockElement(element.firstChild)) {
        if (!this.isInsignificantTextNode(element.firstChild) || !this.isBlockElement(element.firstElementChild)) {
          const attributes2 = this.getBlockAttributes(element);
          if (element.firstChild) {
            if (!(currentBlockContainsElement && arraysAreEqual(attributes2, this.currentBlock.attributes))) {
              this.currentBlock = this.appendBlockForAttributesWithElement(attributes2, element);
              this.currentBlockElement = element;
            } else {
              return this.appendStringWithAttributes("\n");
            }
          }
        }
      } else if (this.currentBlockElement && !currentBlockContainsElement && !elementIsBlockElement) {
        const parentBlockElement = this.findParentBlockElement(element);
        if (parentBlockElement) {
          return this.appendBlockForElement(parentBlockElement);
        } else {
          this.currentBlock = this.appendEmptyBlock();
          this.currentBlockElement = null;
        }
      }
    }
    findParentBlockElement(element) {
      let {
        parentElement
      } = element;
      while (parentElement && parentElement !== this.containerElement) {
        if (this.isBlockElement(parentElement) && this.blockElements.includes(parentElement)) {
          return parentElement;
        } else {
          parentElement = parentElement.parentElement;
        }
      }
      return null;
    }
    processTextNode(node) {
      let string = node.data;
      if (!elementCanDisplayPreformattedText(node.parentNode)) {
        var _node$previousSibling;
        string = squishBreakableWhitespace(string);
        if (stringEndsWithWhitespace((_node$previousSibling = node.previousSibling) === null || _node$previousSibling === void 0 ? void 0 : _node$previousSibling.textContent)) {
          string = leftTrimBreakableWhitespace(string);
        }
      }
      return this.appendStringWithAttributes(string, this.getTextAttributes(node.parentNode));
    }
    processElement(element) {
      let attributes2;
      if (nodeIsAttachmentElement(element)) {
        attributes2 = parseTrixDataAttribute(element, "attachment");
        if (Object.keys(attributes2).length) {
          const textAttributes2 = this.getTextAttributes(element);
          this.appendAttachmentWithAttributes(attributes2, textAttributes2);
          element.innerHTML = "";
        }
        return this.processedElements.push(element);
      } else {
        switch (tagName(element)) {
          case "br":
            if (!this.isExtraBR(element) && !this.isBlockElement(element.nextSibling)) {
              this.appendStringWithAttributes("\n", this.getTextAttributes(element));
            }
            return this.processedElements.push(element);
          case "img":
            attributes2 = {
              url: element.getAttribute("src"),
              contentType: "image"
            };
            const object2 = getImageDimensions(element);
            for (const key in object2) {
              const value = object2[key];
              attributes2[key] = value;
            }
            this.appendAttachmentWithAttributes(attributes2, this.getTextAttributes(element));
            return this.processedElements.push(element);
          case "tr":
            if (element.parentNode.firstChild !== element) {
              return this.appendStringWithAttributes("\n");
            }
            break;
          case "td":
            if (element.parentNode.firstChild !== element) {
              return this.appendStringWithAttributes(" | ");
            }
            break;
        }
      }
    }
    appendBlockForAttributesWithElement(attributes2, element) {
      this.blockElements.push(element);
      const block = blockForAttributes(attributes2);
      this.blocks.push(block);
      return block;
    }
    appendEmptyBlock() {
      return this.appendBlockForAttributesWithElement([], null);
    }
    appendStringWithAttributes(string, attributes2) {
      return this.appendPiece(pieceForString(string, attributes2));
    }
    appendAttachmentWithAttributes(attachment, attributes2) {
      return this.appendPiece(pieceForAttachment(attachment, attributes2));
    }
    appendPiece(piece) {
      if (this.blocks.length === 0) {
        this.appendEmptyBlock();
      }
      return this.blocks[this.blocks.length - 1].text.push(piece);
    }
    appendStringToTextAtIndex(string, index) {
      const {
        text
      } = this.blocks[index];
      const piece = text[text.length - 1];
      if ((piece === null || piece === void 0 ? void 0 : piece.type) === "string") {
        piece.string += string;
      } else {
        return text.push(pieceForString(string));
      }
    }
    prependStringToTextAtIndex(string, index) {
      const {
        text
      } = this.blocks[index];
      const piece = text[0];
      if ((piece === null || piece === void 0 ? void 0 : piece.type) === "string") {
        piece.string = string + piece.string;
      } else {
        return text.unshift(pieceForString(string));
      }
    }
    getTextAttributes(element) {
      let value;
      const attributes2 = {};
      for (const attribute in config.textAttributes) {
        const configAttr = config.textAttributes[attribute];
        if (configAttr.tagName && findClosestElementFromNode(element, {
          matchingSelector: configAttr.tagName,
          untilNode: this.containerElement
        })) {
          attributes2[attribute] = true;
        } else if (configAttr.parser) {
          value = configAttr.parser(element);
          if (value) {
            let attributeInheritedFromBlock = false;
            for (const blockElement of this.findBlockElementAncestors(element)) {
              if (configAttr.parser(blockElement) === value) {
                attributeInheritedFromBlock = true;
                break;
              }
            }
            if (!attributeInheritedFromBlock) {
              attributes2[attribute] = value;
            }
          }
        } else if (configAttr.styleProperty) {
          value = element.style[configAttr.styleProperty];
          if (value) {
            attributes2[attribute] = value;
          }
        }
      }
      if (nodeIsAttachmentElement(element)) {
        const object2 = parseTrixDataAttribute(element, "attributes");
        for (const key in object2) {
          value = object2[key];
          attributes2[key] = value;
        }
      }
      return attributes2;
    }
    getBlockAttributes(element) {
      const attributes2 = [];
      while (element && element !== this.containerElement) {
        for (const attribute in config.blockAttributes) {
          const attrConfig = config.blockAttributes[attribute];
          if (attrConfig.parse !== false) {
            if (tagName(element) === attrConfig.tagName) {
              var _attrConfig$test;
              if ((_attrConfig$test = attrConfig.test) !== null && _attrConfig$test !== void 0 && _attrConfig$test.call(attrConfig, element) || !attrConfig.test) {
                attributes2.push(attribute);
                if (attrConfig.listAttribute) {
                  attributes2.push(attrConfig.listAttribute);
                }
              }
            }
          }
        }
        element = element.parentNode;
      }
      return attributes2.reverse();
    }
    findBlockElementAncestors(element) {
      const ancestors = [];
      while (element && element !== this.containerElement) {
        const tag = tagName(element);
        if (getBlockTagNames().includes(tag)) {
          ancestors.push(element);
        }
        element = element.parentNode;
      }
      return ancestors;
    }
    isBlockElement(element) {
      if ((element === null || element === void 0 ? void 0 : element.nodeType) !== Node.ELEMENT_NODE)
        return;
      if (nodeIsAttachmentElement(element))
        return;
      if (findClosestElementFromNode(element, {
        matchingSelector: "td",
        untilNode: this.containerElement
      }))
        return;
      return getBlockTagNames().includes(tagName(element)) || window.getComputedStyle(element).display === "block";
    }
    isInsignificantTextNode(node) {
      if ((node === null || node === void 0 ? void 0 : node.nodeType) !== Node.TEXT_NODE)
        return;
      if (!stringIsAllBreakableWhitespace(node.data))
        return;
      const {
        parentNode,
        previousSibling,
        nextSibling
      } = node;
      if (nodeEndsWithNonWhitespace(parentNode.previousSibling) && !this.isBlockElement(parentNode.previousSibling))
        return;
      if (elementCanDisplayPreformattedText(parentNode))
        return;
      return !previousSibling || this.isBlockElement(previousSibling) || !nextSibling || this.isBlockElement(nextSibling);
    }
    isExtraBR(element) {
      return tagName(element) === "br" && this.isBlockElement(element.parentNode) && element.parentNode.lastChild === element;
    }
    translateBlockElementMarginsToNewlines() {
      const defaultMargin = this.getMarginOfDefaultBlockElement();
      for (let index = 0; index < this.blocks.length; index++) {
        const margin = this.getMarginOfBlockElementAtIndex(index);
        if (margin) {
          if (margin.top > defaultMargin.top * 2) {
            this.prependStringToTextAtIndex("\n", index);
          }
          if (margin.bottom > defaultMargin.bottom * 2) {
            this.appendStringToTextAtIndex("\n", index);
          }
        }
      }
    }
    getMarginOfBlockElementAtIndex(index) {
      const element = this.blockElements[index];
      if (element) {
        if (element.textContent) {
          if (!getBlockTagNames().includes(tagName(element)) && !this.processedElements.includes(element)) {
            return getBlockElementMargin(element);
          }
        }
      }
    }
    getMarginOfDefaultBlockElement() {
      const element = makeElement(config.blockAttributes.default.tagName);
      this.containerElement.appendChild(element);
      return getBlockElementMargin(element);
    }
  };
  var elementCanDisplayPreformattedText = function(element) {
    const {
      whiteSpace
    } = window.getComputedStyle(element);
    return ["pre", "pre-wrap", "pre-line"].includes(whiteSpace);
  };
  var nodeEndsWithNonWhitespace = (node) => node && !stringEndsWithWhitespace(node.textContent);
  var getBlockElementMargin = function(element) {
    const style = window.getComputedStyle(element);
    if (style.display === "block") {
      return {
        top: parseInt(style.marginTop),
        bottom: parseInt(style.marginBottom)
      };
    }
  };
  var nodeFilter = function(node) {
    if (tagName(node) === "style") {
      return NodeFilter.FILTER_REJECT;
    } else {
      return NodeFilter.FILTER_ACCEPT;
    }
  };
  var leftTrimBreakableWhitespace = (string) => string.replace(new RegExp("^".concat(breakableWhitespacePattern.source, "+")), "");
  var stringIsAllBreakableWhitespace = (string) => new RegExp("^".concat(breakableWhitespacePattern.source, "*$")).test(string);
  var stringEndsWithWhitespace = (string) => /\s$/.test(string);
  var LineBreakInsertion = class {
    constructor(composition) {
      this.composition = composition;
      this.document = this.composition.document;
      const selectedRange = this.composition.getSelectedRange();
      this.startPosition = selectedRange[0];
      this.endPosition = selectedRange[1];
      this.startLocation = this.document.locationFromPosition(this.startPosition);
      this.endLocation = this.document.locationFromPosition(this.endPosition);
      this.block = this.document.getBlockAtIndex(this.endLocation.index);
      this.breaksOnReturn = this.block.breaksOnReturn();
      this.previousCharacter = this.block.text.getStringAtPosition(this.endLocation.offset - 1);
      this.nextCharacter = this.block.text.getStringAtPosition(this.endLocation.offset);
    }
    shouldInsertBlockBreak() {
      if (this.block.hasAttributes() && this.block.isListItem() && !this.block.isEmpty()) {
        return this.startLocation.offset !== 0;
      } else {
        return this.breaksOnReturn && this.nextCharacter !== "\n";
      }
    }
    shouldBreakFormattedBlock() {
      return this.block.hasAttributes() && !this.block.isListItem() && (this.breaksOnReturn && this.nextCharacter === "\n" || this.previousCharacter === "\n");
    }
    shouldDecreaseListLevel() {
      return this.block.hasAttributes() && this.block.isListItem() && this.block.isEmpty();
    }
    shouldPrependListItem() {
      return this.block.isListItem() && this.startLocation.offset === 0 && !this.block.isEmpty();
    }
    shouldRemoveLastBlockAttribute() {
      return this.block.hasAttributes() && !this.block.isListItem() && this.block.isEmpty();
    }
  };
  var PLACEHOLDER = " ";
  var Composition = class extends BasicObject {
    constructor() {
      super(...arguments);
      this.document = new Document();
      this.attachments = [];
      this.currentAttributes = {};
      this.revision = 0;
    }
    setDocument(document2) {
      if (!document2.isEqualTo(this.document)) {
        var _this$delegate, _this$delegate$compos;
        this.document = document2;
        this.refreshAttachments();
        this.revision++;
        return (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$compos = _this$delegate.compositionDidChangeDocument) === null || _this$delegate$compos === void 0 ? void 0 : _this$delegate$compos.call(_this$delegate, document2);
      }
    }
    getSnapshot() {
      return {
        document: this.document,
        selectedRange: this.getSelectedRange()
      };
    }
    loadSnapshot(_ref) {
      var _this$delegate2, _this$delegate2$compo, _this$delegate3, _this$delegate3$compo;
      let {
        document: document2,
        selectedRange
      } = _ref;
      (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : (_this$delegate2$compo = _this$delegate2.compositionWillLoadSnapshot) === null || _this$delegate2$compo === void 0 ? void 0 : _this$delegate2$compo.call(_this$delegate2);
      this.setDocument(document2 != null ? document2 : new Document());
      this.setSelection(selectedRange != null ? selectedRange : [0, 0]);
      return (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 ? void 0 : (_this$delegate3$compo = _this$delegate3.compositionDidLoadSnapshot) === null || _this$delegate3$compo === void 0 ? void 0 : _this$delegate3$compo.call(_this$delegate3);
    }
    insertText(text) {
      let {
        updatePosition
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        updatePosition: true
      };
      const selectedRange = this.getSelectedRange();
      this.setDocument(this.document.insertTextAtRange(text, selectedRange));
      const startPosition = selectedRange[0];
      const endPosition = startPosition + text.getLength();
      if (updatePosition) {
        this.setSelection(endPosition);
      }
      return this.notifyDelegateOfInsertionAtRange([startPosition, endPosition]);
    }
    insertBlock() {
      let block = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new Block();
      const document2 = new Document([block]);
      return this.insertDocument(document2);
    }
    insertDocument() {
      let document2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new Document();
      const selectedRange = this.getSelectedRange();
      this.setDocument(this.document.insertDocumentAtRange(document2, selectedRange));
      const startPosition = selectedRange[0];
      const endPosition = startPosition + document2.getLength();
      this.setSelection(endPosition);
      return this.notifyDelegateOfInsertionAtRange([startPosition, endPosition]);
    }
    insertString(string, options2) {
      const attributes2 = this.getCurrentTextAttributes();
      const text = Text.textForStringWithAttributes(string, attributes2);
      return this.insertText(text, options2);
    }
    insertBlockBreak() {
      const selectedRange = this.getSelectedRange();
      this.setDocument(this.document.insertBlockBreakAtRange(selectedRange));
      const startPosition = selectedRange[0];
      const endPosition = startPosition + 1;
      this.setSelection(endPosition);
      return this.notifyDelegateOfInsertionAtRange([startPosition, endPosition]);
    }
    insertLineBreak() {
      const insertion = new LineBreakInsertion(this);
      if (insertion.shouldDecreaseListLevel()) {
        this.decreaseListLevel();
        return this.setSelection(insertion.startPosition);
      } else if (insertion.shouldPrependListItem()) {
        const document2 = new Document([insertion.block.copyWithoutText()]);
        return this.insertDocument(document2);
      } else if (insertion.shouldInsertBlockBreak()) {
        return this.insertBlockBreak();
      } else if (insertion.shouldRemoveLastBlockAttribute()) {
        return this.removeLastBlockAttribute();
      } else if (insertion.shouldBreakFormattedBlock()) {
        return this.breakFormattedBlock(insertion);
      } else {
        return this.insertString("\n");
      }
    }
    insertHTML(html2) {
      const document2 = HTMLParser.parse(html2).getDocument();
      const selectedRange = this.getSelectedRange();
      this.setDocument(this.document.mergeDocumentAtRange(document2, selectedRange));
      const startPosition = selectedRange[0];
      const endPosition = startPosition + document2.getLength() - 1;
      this.setSelection(endPosition);
      return this.notifyDelegateOfInsertionAtRange([startPosition, endPosition]);
    }
    replaceHTML(html2) {
      const document2 = HTMLParser.parse(html2).getDocument().copyUsingObjectsFromDocument(this.document);
      const locationRange = this.getLocationRange({
        strict: false
      });
      const selectedRange = this.document.rangeFromLocationRange(locationRange);
      this.setDocument(document2);
      return this.setSelection(selectedRange);
    }
    insertFile(file) {
      return this.insertFiles([file]);
    }
    insertFiles(files) {
      const attachments2 = [];
      Array.from(files).forEach((file) => {
        var _this$delegate4;
        if ((_this$delegate4 = this.delegate) !== null && _this$delegate4 !== void 0 && _this$delegate4.compositionShouldAcceptFile(file)) {
          const attachment = Attachment.attachmentForFile(file);
          attachments2.push(attachment);
        }
      });
      return this.insertAttachments(attachments2);
    }
    insertAttachment(attachment) {
      return this.insertAttachments([attachment]);
    }
    insertAttachments(attachments2) {
      let text = new Text();
      Array.from(attachments2).forEach((attachment) => {
        var _config$attachments$t;
        const type = attachment.getType();
        const presentation = (_config$attachments$t = config.attachments[type]) === null || _config$attachments$t === void 0 ? void 0 : _config$attachments$t.presentation;
        const attributes2 = this.getCurrentTextAttributes();
        if (presentation) {
          attributes2.presentation = presentation;
        }
        const attachmentText = Text.textForAttachmentWithAttributes(attachment, attributes2);
        text = text.appendText(attachmentText);
      });
      return this.insertText(text);
    }
    shouldManageDeletingInDirection(direction) {
      const locationRange = this.getLocationRange();
      if (rangeIsCollapsed(locationRange)) {
        if (direction === "backward" && locationRange[0].offset === 0) {
          return true;
        }
        if (this.shouldManageMovingCursorInDirection(direction)) {
          return true;
        }
      } else {
        if (locationRange[0].index !== locationRange[1].index) {
          return true;
        }
      }
      return false;
    }
    deleteInDirection(direction) {
      let {
        length
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let attachment, deletingIntoPreviousBlock, selectionSpansBlocks;
      const locationRange = this.getLocationRange();
      let range = this.getSelectedRange();
      const selectionIsCollapsed = rangeIsCollapsed(range);
      if (selectionIsCollapsed) {
        deletingIntoPreviousBlock = direction === "backward" && locationRange[0].offset === 0;
      } else {
        selectionSpansBlocks = locationRange[0].index !== locationRange[1].index;
      }
      if (deletingIntoPreviousBlock) {
        if (this.canDecreaseBlockAttributeLevel()) {
          const block = this.getBlock();
          if (block.isListItem()) {
            this.decreaseListLevel();
          } else {
            this.decreaseBlockAttributeLevel();
          }
          this.setSelection(range[0]);
          if (block.isEmpty()) {
            return false;
          }
        }
      }
      if (selectionIsCollapsed) {
        range = this.getExpandedRangeInDirection(direction, {
          length
        });
        if (direction === "backward") {
          attachment = this.getAttachmentAtRange(range);
        }
      }
      if (attachment) {
        this.editAttachment(attachment);
        return false;
      } else {
        this.setDocument(this.document.removeTextAtRange(range));
        this.setSelection(range[0]);
        if (deletingIntoPreviousBlock || selectionSpansBlocks) {
          return false;
        }
      }
    }
    moveTextFromRange(range) {
      const [position] = Array.from(this.getSelectedRange());
      this.setDocument(this.document.moveTextFromRangeToPosition(range, position));
      return this.setSelection(position);
    }
    removeAttachment(attachment) {
      const range = this.document.getRangeOfAttachment(attachment);
      if (range) {
        this.stopEditingAttachment();
        this.setDocument(this.document.removeTextAtRange(range));
        return this.setSelection(range[0]);
      }
    }
    removeLastBlockAttribute() {
      const [startPosition, endPosition] = Array.from(this.getSelectedRange());
      const block = this.document.getBlockAtPosition(endPosition);
      this.removeCurrentAttribute(block.getLastAttribute());
      return this.setSelection(startPosition);
    }
    insertPlaceholder() {
      this.placeholderPosition = this.getPosition();
      return this.insertString(PLACEHOLDER);
    }
    selectPlaceholder() {
      if (this.placeholderPosition != null) {
        this.setSelectedRange([this.placeholderPosition, this.placeholderPosition + PLACEHOLDER.length]);
        return this.getSelectedRange();
      }
    }
    forgetPlaceholder() {
      this.placeholderPosition = null;
    }
    hasCurrentAttribute(attributeName) {
      const value = this.currentAttributes[attributeName];
      return value != null && value !== false;
    }
    toggleCurrentAttribute(attributeName) {
      const value = !this.currentAttributes[attributeName];
      if (value) {
        return this.setCurrentAttribute(attributeName, value);
      } else {
        return this.removeCurrentAttribute(attributeName);
      }
    }
    canSetCurrentAttribute(attributeName) {
      if (getBlockConfig(attributeName)) {
        return this.canSetCurrentBlockAttribute(attributeName);
      } else {
        return this.canSetCurrentTextAttribute(attributeName);
      }
    }
    canSetCurrentTextAttribute(attributeName) {
      const document2 = this.getSelectedDocument();
      if (!document2)
        return;
      for (const attachment of Array.from(document2.getAttachments())) {
        if (!attachment.hasContent()) {
          return false;
        }
      }
      return true;
    }
    canSetCurrentBlockAttribute(attributeName) {
      const block = this.getBlock();
      if (!block)
        return;
      return !block.isTerminalBlock();
    }
    setCurrentAttribute(attributeName, value) {
      if (getBlockConfig(attributeName)) {
        return this.setBlockAttribute(attributeName, value);
      } else {
        this.setTextAttribute(attributeName, value);
        this.currentAttributes[attributeName] = value;
        return this.notifyDelegateOfCurrentAttributesChange();
      }
    }
    setTextAttribute(attributeName, value) {
      const selectedRange = this.getSelectedRange();
      if (!selectedRange)
        return;
      const [startPosition, endPosition] = Array.from(selectedRange);
      if (startPosition === endPosition) {
        if (attributeName === "href") {
          const text = Text.textForStringWithAttributes(value, {
            href: value
          });
          return this.insertText(text);
        }
      } else {
        return this.setDocument(this.document.addAttributeAtRange(attributeName, value, selectedRange));
      }
    }
    setBlockAttribute(attributeName, value) {
      const selectedRange = this.getSelectedRange();
      if (this.canSetCurrentAttribute(attributeName)) {
        this.setDocument(this.document.applyBlockAttributeAtRange(attributeName, value, selectedRange));
        return this.setSelection(selectedRange);
      }
    }
    removeCurrentAttribute(attributeName) {
      if (getBlockConfig(attributeName)) {
        this.removeBlockAttribute(attributeName);
        return this.updateCurrentAttributes();
      } else {
        this.removeTextAttribute(attributeName);
        delete this.currentAttributes[attributeName];
        return this.notifyDelegateOfCurrentAttributesChange();
      }
    }
    removeTextAttribute(attributeName) {
      const selectedRange = this.getSelectedRange();
      if (!selectedRange)
        return;
      return this.setDocument(this.document.removeAttributeAtRange(attributeName, selectedRange));
    }
    removeBlockAttribute(attributeName) {
      const selectedRange = this.getSelectedRange();
      if (!selectedRange)
        return;
      return this.setDocument(this.document.removeAttributeAtRange(attributeName, selectedRange));
    }
    canDecreaseNestingLevel() {
      var _this$getBlock;
      return ((_this$getBlock = this.getBlock()) === null || _this$getBlock === void 0 ? void 0 : _this$getBlock.getNestingLevel()) > 0;
    }
    canIncreaseNestingLevel() {
      var _getBlockConfig;
      const block = this.getBlock();
      if (!block)
        return;
      if ((_getBlockConfig = getBlockConfig(block.getLastNestableAttribute())) !== null && _getBlockConfig !== void 0 && _getBlockConfig.listAttribute) {
        const previousBlock = this.getPreviousBlock();
        if (previousBlock) {
          return arrayStartsWith(previousBlock.getListItemAttributes(), block.getListItemAttributes());
        }
      } else {
        return block.getNestingLevel() > 0;
      }
    }
    decreaseNestingLevel() {
      const block = this.getBlock();
      if (!block)
        return;
      return this.setDocument(this.document.replaceBlock(block, block.decreaseNestingLevel()));
    }
    increaseNestingLevel() {
      const block = this.getBlock();
      if (!block)
        return;
      return this.setDocument(this.document.replaceBlock(block, block.increaseNestingLevel()));
    }
    canDecreaseBlockAttributeLevel() {
      var _this$getBlock2;
      return ((_this$getBlock2 = this.getBlock()) === null || _this$getBlock2 === void 0 ? void 0 : _this$getBlock2.getAttributeLevel()) > 0;
    }
    decreaseBlockAttributeLevel() {
      var _this$getBlock3;
      const attribute = (_this$getBlock3 = this.getBlock()) === null || _this$getBlock3 === void 0 ? void 0 : _this$getBlock3.getLastAttribute();
      if (attribute) {
        return this.removeCurrentAttribute(attribute);
      }
    }
    decreaseListLevel() {
      let [startPosition] = Array.from(this.getSelectedRange());
      const {
        index
      } = this.document.locationFromPosition(startPosition);
      let endIndex = index;
      const attributeLevel = this.getBlock().getAttributeLevel();
      let block = this.document.getBlockAtIndex(endIndex + 1);
      while (block) {
        if (!block.isListItem() || block.getAttributeLevel() <= attributeLevel) {
          break;
        }
        endIndex++;
        block = this.document.getBlockAtIndex(endIndex + 1);
      }
      startPosition = this.document.positionFromLocation({
        index,
        offset: 0
      });
      const endPosition = this.document.positionFromLocation({
        index: endIndex,
        offset: 0
      });
      return this.setDocument(this.document.removeLastListAttributeAtRange([startPosition, endPosition]));
    }
    updateCurrentAttributes() {
      const selectedRange = this.getSelectedRange({
        ignoreLock: true
      });
      if (selectedRange) {
        const currentAttributes = this.document.getCommonAttributesAtRange(selectedRange);
        Array.from(getAllAttributeNames()).forEach((attributeName) => {
          if (!currentAttributes[attributeName]) {
            if (!this.canSetCurrentAttribute(attributeName)) {
              currentAttributes[attributeName] = false;
            }
          }
        });
        if (!objectsAreEqual(currentAttributes, this.currentAttributes)) {
          this.currentAttributes = currentAttributes;
          return this.notifyDelegateOfCurrentAttributesChange();
        }
      }
    }
    getCurrentAttributes() {
      return extend3.call({}, this.currentAttributes);
    }
    getCurrentTextAttributes() {
      const attributes2 = {};
      for (const key in this.currentAttributes) {
        const value = this.currentAttributes[key];
        if (value !== false) {
          if (getTextConfig(key)) {
            attributes2[key] = value;
          }
        }
      }
      return attributes2;
    }
    freezeSelection() {
      return this.setCurrentAttribute("frozen", true);
    }
    thawSelection() {
      return this.removeCurrentAttribute("frozen");
    }
    hasFrozenSelection() {
      return this.hasCurrentAttribute("frozen");
    }
    setSelection(selectedRange) {
      var _this$delegate5;
      const locationRange = this.document.locationRangeFromRange(selectedRange);
      return (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 ? void 0 : _this$delegate5.compositionDidRequestChangingSelectionToLocationRange(locationRange);
    }
    getSelectedRange() {
      const locationRange = this.getLocationRange();
      if (locationRange) {
        return this.document.rangeFromLocationRange(locationRange);
      }
    }
    setSelectedRange(selectedRange) {
      const locationRange = this.document.locationRangeFromRange(selectedRange);
      return this.getSelectionManager().setLocationRange(locationRange);
    }
    getPosition() {
      const locationRange = this.getLocationRange();
      if (locationRange) {
        return this.document.positionFromLocation(locationRange[0]);
      }
    }
    getLocationRange(options2) {
      if (this.targetLocationRange) {
        return this.targetLocationRange;
      } else {
        return this.getSelectionManager().getLocationRange(options2) || normalizeRange({
          index: 0,
          offset: 0
        });
      }
    }
    withTargetLocationRange(locationRange, fn) {
      let result;
      this.targetLocationRange = locationRange;
      try {
        result = fn();
      } finally {
        this.targetLocationRange = null;
      }
      return result;
    }
    withTargetRange(range, fn) {
      const locationRange = this.document.locationRangeFromRange(range);
      return this.withTargetLocationRange(locationRange, fn);
    }
    withTargetDOMRange(domRange, fn) {
      const locationRange = this.createLocationRangeFromDOMRange(domRange, {
        strict: false
      });
      return this.withTargetLocationRange(locationRange, fn);
    }
    getExpandedRangeInDirection(direction) {
      let {
        length
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let [startPosition, endPosition] = Array.from(this.getSelectedRange());
      if (direction === "backward") {
        if (length) {
          startPosition -= length;
        } else {
          startPosition = this.translateUTF16PositionFromOffset(startPosition, -1);
        }
      } else {
        if (length) {
          endPosition += length;
        } else {
          endPosition = this.translateUTF16PositionFromOffset(endPosition, 1);
        }
      }
      return normalizeRange([startPosition, endPosition]);
    }
    shouldManageMovingCursorInDirection(direction) {
      if (this.editingAttachment) {
        return true;
      }
      const range = this.getExpandedRangeInDirection(direction);
      return this.getAttachmentAtRange(range) != null;
    }
    moveCursorInDirection(direction) {
      let canEditAttachment, range;
      if (this.editingAttachment) {
        range = this.document.getRangeOfAttachment(this.editingAttachment);
      } else {
        const selectedRange = this.getSelectedRange();
        range = this.getExpandedRangeInDirection(direction);
        canEditAttachment = !rangesAreEqual(selectedRange, range);
      }
      if (direction === "backward") {
        this.setSelectedRange(range[0]);
      } else {
        this.setSelectedRange(range[1]);
      }
      if (canEditAttachment) {
        const attachment = this.getAttachmentAtRange(range);
        if (attachment) {
          return this.editAttachment(attachment);
        }
      }
    }
    expandSelectionInDirection(direction) {
      let {
        length
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      const range = this.getExpandedRangeInDirection(direction, {
        length
      });
      return this.setSelectedRange(range);
    }
    expandSelectionForEditing() {
      if (this.hasCurrentAttribute("href")) {
        return this.expandSelectionAroundCommonAttribute("href");
      }
    }
    expandSelectionAroundCommonAttribute(attributeName) {
      const position = this.getPosition();
      const range = this.document.getRangeOfCommonAttributeAtPosition(attributeName, position);
      return this.setSelectedRange(range);
    }
    selectionContainsAttachments() {
      var _this$getSelectedAtta;
      return ((_this$getSelectedAtta = this.getSelectedAttachments()) === null || _this$getSelectedAtta === void 0 ? void 0 : _this$getSelectedAtta.length) > 0;
    }
    selectionIsInCursorTarget() {
      return this.editingAttachment || this.positionIsCursorTarget(this.getPosition());
    }
    positionIsCursorTarget(position) {
      const location2 = this.document.locationFromPosition(position);
      if (location2) {
        return this.locationIsCursorTarget(location2);
      }
    }
    positionIsBlockBreak(position) {
      var _this$document$getPie;
      return (_this$document$getPie = this.document.getPieceAtPosition(position)) === null || _this$document$getPie === void 0 ? void 0 : _this$document$getPie.isBlockBreak();
    }
    getSelectedDocument() {
      const selectedRange = this.getSelectedRange();
      if (selectedRange) {
        return this.document.getDocumentAtRange(selectedRange);
      }
    }
    getSelectedAttachments() {
      var _this$getSelectedDocu;
      return (_this$getSelectedDocu = this.getSelectedDocument()) === null || _this$getSelectedDocu === void 0 ? void 0 : _this$getSelectedDocu.getAttachments();
    }
    getAttachments() {
      return this.attachments.slice(0);
    }
    refreshAttachments() {
      const attachments2 = this.document.getAttachments();
      const {
        added,
        removed
      } = summarizeArrayChange(this.attachments, attachments2);
      this.attachments = attachments2;
      Array.from(removed).forEach((attachment) => {
        var _this$delegate6, _this$delegate6$compo;
        attachment.delegate = null;
        (_this$delegate6 = this.delegate) === null || _this$delegate6 === void 0 ? void 0 : (_this$delegate6$compo = _this$delegate6.compositionDidRemoveAttachment) === null || _this$delegate6$compo === void 0 ? void 0 : _this$delegate6$compo.call(_this$delegate6, attachment);
      });
      return (() => {
        const result = [];
        Array.from(added).forEach((attachment) => {
          var _this$delegate7, _this$delegate7$compo;
          attachment.delegate = this;
          result.push((_this$delegate7 = this.delegate) === null || _this$delegate7 === void 0 ? void 0 : (_this$delegate7$compo = _this$delegate7.compositionDidAddAttachment) === null || _this$delegate7$compo === void 0 ? void 0 : _this$delegate7$compo.call(_this$delegate7, attachment));
        });
        return result;
      })();
    }
    attachmentDidChangeAttributes(attachment) {
      var _this$delegate8, _this$delegate8$compo;
      this.revision++;
      return (_this$delegate8 = this.delegate) === null || _this$delegate8 === void 0 ? void 0 : (_this$delegate8$compo = _this$delegate8.compositionDidEditAttachment) === null || _this$delegate8$compo === void 0 ? void 0 : _this$delegate8$compo.call(_this$delegate8, attachment);
    }
    attachmentDidChangePreviewURL(attachment) {
      var _this$delegate9, _this$delegate9$compo;
      this.revision++;
      return (_this$delegate9 = this.delegate) === null || _this$delegate9 === void 0 ? void 0 : (_this$delegate9$compo = _this$delegate9.compositionDidChangeAttachmentPreviewURL) === null || _this$delegate9$compo === void 0 ? void 0 : _this$delegate9$compo.call(_this$delegate9, attachment);
    }
    editAttachment(attachment, options2) {
      var _this$delegate10, _this$delegate10$comp;
      if (attachment === this.editingAttachment)
        return;
      this.stopEditingAttachment();
      this.editingAttachment = attachment;
      return (_this$delegate10 = this.delegate) === null || _this$delegate10 === void 0 ? void 0 : (_this$delegate10$comp = _this$delegate10.compositionDidStartEditingAttachment) === null || _this$delegate10$comp === void 0 ? void 0 : _this$delegate10$comp.call(_this$delegate10, this.editingAttachment, options2);
    }
    stopEditingAttachment() {
      var _this$delegate11, _this$delegate11$comp;
      if (!this.editingAttachment)
        return;
      (_this$delegate11 = this.delegate) === null || _this$delegate11 === void 0 ? void 0 : (_this$delegate11$comp = _this$delegate11.compositionDidStopEditingAttachment) === null || _this$delegate11$comp === void 0 ? void 0 : _this$delegate11$comp.call(_this$delegate11, this.editingAttachment);
      this.editingAttachment = null;
    }
    updateAttributesForAttachment(attributes2, attachment) {
      return this.setDocument(this.document.updateAttributesForAttachment(attributes2, attachment));
    }
    removeAttributeForAttachment(attribute, attachment) {
      return this.setDocument(this.document.removeAttributeForAttachment(attribute, attachment));
    }
    breakFormattedBlock(insertion) {
      let {
        document: document2
      } = insertion;
      const {
        block
      } = insertion;
      let position = insertion.startPosition;
      let range = [position - 1, position];
      if (block.getBlockBreakPosition() === insertion.startLocation.offset) {
        if (block.breaksOnReturn() && insertion.nextCharacter === "\n") {
          position += 1;
        } else {
          document2 = document2.removeTextAtRange(range);
        }
        range = [position, position];
      } else if (insertion.nextCharacter === "\n") {
        if (insertion.previousCharacter === "\n") {
          range = [position - 1, position + 1];
        } else {
          range = [position, position + 1];
          position += 1;
        }
      } else if (insertion.startLocation.offset - 1 !== 0) {
        position += 1;
      }
      const newDocument = new Document([block.removeLastAttribute().copyWithoutText()]);
      this.setDocument(document2.insertDocumentAtRange(newDocument, range));
      return this.setSelection(position);
    }
    getPreviousBlock() {
      const locationRange = this.getLocationRange();
      if (locationRange) {
        const {
          index
        } = locationRange[0];
        if (index > 0) {
          return this.document.getBlockAtIndex(index - 1);
        }
      }
    }
    getBlock() {
      const locationRange = this.getLocationRange();
      if (locationRange) {
        return this.document.getBlockAtIndex(locationRange[0].index);
      }
    }
    getAttachmentAtRange(range) {
      const document2 = this.document.getDocumentAtRange(range);
      if (document2.toString() === "".concat(OBJECT_REPLACEMENT_CHARACTER, "\n")) {
        return document2.getAttachments()[0];
      }
    }
    notifyDelegateOfCurrentAttributesChange() {
      var _this$delegate12, _this$delegate12$comp;
      return (_this$delegate12 = this.delegate) === null || _this$delegate12 === void 0 ? void 0 : (_this$delegate12$comp = _this$delegate12.compositionDidChangeCurrentAttributes) === null || _this$delegate12$comp === void 0 ? void 0 : _this$delegate12$comp.call(_this$delegate12, this.currentAttributes);
    }
    notifyDelegateOfInsertionAtRange(range) {
      var _this$delegate13, _this$delegate13$comp;
      return (_this$delegate13 = this.delegate) === null || _this$delegate13 === void 0 ? void 0 : (_this$delegate13$comp = _this$delegate13.compositionDidPerformInsertionAtRange) === null || _this$delegate13$comp === void 0 ? void 0 : _this$delegate13$comp.call(_this$delegate13, range);
    }
    translateUTF16PositionFromOffset(position, offset) {
      const utf16string = this.document.toUTF16String();
      const utf16position = utf16string.offsetFromUCS2Offset(position);
      return utf16string.offsetToUCS2Offset(utf16position + offset);
    }
  };
  Composition.proxyMethod("getSelectionManager().getPointRange");
  Composition.proxyMethod("getSelectionManager().setLocationRangeFromPointRange");
  Composition.proxyMethod("getSelectionManager().createLocationRangeFromDOMRange");
  Composition.proxyMethod("getSelectionManager().locationIsCursorTarget");
  Composition.proxyMethod("getSelectionManager().selectionIsExpanded");
  Composition.proxyMethod("delegate?.getSelectionManager");
  var UndoManager = class extends BasicObject {
    constructor(composition) {
      super(...arguments);
      this.composition = composition;
      this.undoEntries = [];
      this.redoEntries = [];
    }
    recordUndoEntry(description) {
      let {
        context,
        consolidatable
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      const previousEntry = this.undoEntries.slice(-1)[0];
      if (!consolidatable || !entryHasDescriptionAndContext(previousEntry, description, context)) {
        const undoEntry = this.createEntry({
          description,
          context
        });
        this.undoEntries.push(undoEntry);
        this.redoEntries = [];
      }
    }
    undo() {
      const undoEntry = this.undoEntries.pop();
      if (undoEntry) {
        const redoEntry = this.createEntry(undoEntry);
        this.redoEntries.push(redoEntry);
        return this.composition.loadSnapshot(undoEntry.snapshot);
      }
    }
    redo() {
      const redoEntry = this.redoEntries.pop();
      if (redoEntry) {
        const undoEntry = this.createEntry(redoEntry);
        this.undoEntries.push(undoEntry);
        return this.composition.loadSnapshot(redoEntry.snapshot);
      }
    }
    canUndo() {
      return this.undoEntries.length > 0;
    }
    canRedo() {
      return this.redoEntries.length > 0;
    }
    createEntry() {
      let {
        description,
        context
      } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      return {
        description: description === null || description === void 0 ? void 0 : description.toString(),
        context: JSON.stringify(context),
        snapshot: this.composition.getSnapshot()
      };
    }
  };
  var entryHasDescriptionAndContext = (entry, description, context) => (entry === null || entry === void 0 ? void 0 : entry.description) === (description === null || description === void 0 ? void 0 : description.toString()) && (entry === null || entry === void 0 ? void 0 : entry.context) === JSON.stringify(context);
  var attachmentGalleryFilter = function(snapshot) {
    const filter = new Filter(snapshot);
    filter.perform();
    return filter.getSnapshot();
  };
  var BLOCK_ATTRIBUTE_NAME = "attachmentGallery";
  var TEXT_ATTRIBUTE_NAME = "presentation";
  var TEXT_ATTRIBUTE_VALUE = "gallery";
  var Filter = class {
    constructor(snapshot) {
      this.document = snapshot.document;
      this.selectedRange = snapshot.selectedRange;
    }
    perform() {
      this.removeBlockAttribute();
      return this.applyBlockAttribute();
    }
    getSnapshot() {
      return {
        document: this.document,
        selectedRange: this.selectedRange
      };
    }
    removeBlockAttribute() {
      return this.findRangesOfBlocks().map((range) => this.document = this.document.removeAttributeAtRange(BLOCK_ATTRIBUTE_NAME, range));
    }
    applyBlockAttribute() {
      let offset = 0;
      this.findRangesOfPieces().forEach((range) => {
        if (range[1] - range[0] > 1) {
          range[0] += offset;
          range[1] += offset;
          if (this.document.getCharacterAtPosition(range[1]) !== "\n") {
            this.document = this.document.insertBlockBreakAtRange(range[1]);
            if (range[1] < this.selectedRange[1]) {
              this.moveSelectedRangeForward();
            }
            range[1]++;
            offset++;
          }
          if (range[0] !== 0) {
            if (this.document.getCharacterAtPosition(range[0] - 1) !== "\n") {
              this.document = this.document.insertBlockBreakAtRange(range[0]);
              if (range[0] < this.selectedRange[0]) {
                this.moveSelectedRangeForward();
              }
              range[0]++;
              offset++;
            }
          }
          this.document = this.document.applyBlockAttributeAtRange(BLOCK_ATTRIBUTE_NAME, true, range);
        }
      });
    }
    findRangesOfBlocks() {
      return this.document.findRangesForBlockAttribute(BLOCK_ATTRIBUTE_NAME);
    }
    findRangesOfPieces() {
      return this.document.findRangesForTextAttribute(TEXT_ATTRIBUTE_NAME, {
        withValue: TEXT_ATTRIBUTE_VALUE
      });
    }
    moveSelectedRangeForward() {
      this.selectedRange[0] += 1;
      this.selectedRange[1] += 1;
    }
  };
  var DEFAULT_FILTERS = [attachmentGalleryFilter];
  var Editor = class {
    constructor(composition, selectionManager, element) {
      this.insertFiles = this.insertFiles.bind(this);
      this.composition = composition;
      this.selectionManager = selectionManager;
      this.element = element;
      this.undoManager = new UndoManager(this.composition);
      this.filters = DEFAULT_FILTERS.slice(0);
    }
    loadDocument(document2) {
      return this.loadSnapshot({
        document: document2,
        selectedRange: [0, 0]
      });
    }
    loadHTML() {
      let html2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      const document2 = HTMLParser.parse(html2, {
        referenceElement: this.element
      }).getDocument();
      return this.loadDocument(document2);
    }
    loadJSON(_ref) {
      let {
        document: document2,
        selectedRange
      } = _ref;
      document2 = Document.fromJSON(document2);
      return this.loadSnapshot({
        document: document2,
        selectedRange
      });
    }
    loadSnapshot(snapshot) {
      this.undoManager = new UndoManager(this.composition);
      return this.composition.loadSnapshot(snapshot);
    }
    getDocument() {
      return this.composition.document;
    }
    getSelectedDocument() {
      return this.composition.getSelectedDocument();
    }
    getSnapshot() {
      return this.composition.getSnapshot();
    }
    toJSON() {
      return this.getSnapshot();
    }
    deleteInDirection(direction) {
      return this.composition.deleteInDirection(direction);
    }
    insertAttachment(attachment) {
      return this.composition.insertAttachment(attachment);
    }
    insertAttachments(attachments2) {
      return this.composition.insertAttachments(attachments2);
    }
    insertDocument(document2) {
      return this.composition.insertDocument(document2);
    }
    insertFile(file) {
      return this.composition.insertFile(file);
    }
    insertFiles(files) {
      return this.composition.insertFiles(files);
    }
    insertHTML(html2) {
      return this.composition.insertHTML(html2);
    }
    insertString(string) {
      return this.composition.insertString(string);
    }
    insertText(text) {
      return this.composition.insertText(text);
    }
    insertLineBreak() {
      return this.composition.insertLineBreak();
    }
    getSelectedRange() {
      return this.composition.getSelectedRange();
    }
    getPosition() {
      return this.composition.getPosition();
    }
    getClientRectAtPosition(position) {
      const locationRange = this.getDocument().locationRangeFromRange([position, position + 1]);
      return this.selectionManager.getClientRectAtLocationRange(locationRange);
    }
    expandSelectionInDirection(direction) {
      return this.composition.expandSelectionInDirection(direction);
    }
    moveCursorInDirection(direction) {
      return this.composition.moveCursorInDirection(direction);
    }
    setSelectedRange(selectedRange) {
      return this.composition.setSelectedRange(selectedRange);
    }
    activateAttribute(name) {
      let value = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      return this.composition.setCurrentAttribute(name, value);
    }
    attributeIsActive(name) {
      return this.composition.hasCurrentAttribute(name);
    }
    canActivateAttribute(name) {
      return this.composition.canSetCurrentAttribute(name);
    }
    deactivateAttribute(name) {
      return this.composition.removeCurrentAttribute(name);
    }
    canDecreaseNestingLevel() {
      return this.composition.canDecreaseNestingLevel();
    }
    canIncreaseNestingLevel() {
      return this.composition.canIncreaseNestingLevel();
    }
    decreaseNestingLevel() {
      if (this.canDecreaseNestingLevel()) {
        return this.composition.decreaseNestingLevel();
      }
    }
    increaseNestingLevel() {
      if (this.canIncreaseNestingLevel()) {
        return this.composition.increaseNestingLevel();
      }
    }
    canRedo() {
      return this.undoManager.canRedo();
    }
    canUndo() {
      return this.undoManager.canUndo();
    }
    recordUndoEntry(description) {
      let {
        context,
        consolidatable
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.undoManager.recordUndoEntry(description, {
        context,
        consolidatable
      });
    }
    redo() {
      if (this.canRedo()) {
        return this.undoManager.redo();
      }
    }
    undo() {
      if (this.canUndo()) {
        return this.undoManager.undo();
      }
    }
  };
  var LocationMapper = class {
    constructor(element) {
      this.element = element;
    }
    findLocationFromContainerAndOffset(container, offset) {
      let {
        strict
      } = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
        strict: true
      };
      let childIndex = 0;
      let foundBlock = false;
      const location2 = {
        index: 0,
        offset: 0
      };
      const attachmentElement = this.findAttachmentElementParentForNode(container);
      if (attachmentElement) {
        container = attachmentElement.parentNode;
        offset = findChildIndexOfNode(attachmentElement);
      }
      const walker = walkTree(this.element, {
        usingFilter: rejectAttachmentContents
      });
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node === container && nodeIsTextNode(container)) {
          if (!nodeIsCursorTarget(node)) {
            location2.offset += offset;
          }
          break;
        } else {
          if (node.parentNode === container) {
            if (childIndex++ === offset) {
              break;
            }
          } else if (!elementContainsNode(container, node)) {
            if (childIndex > 0) {
              break;
            }
          }
          if (nodeIsBlockStart(node, {
            strict
          })) {
            if (foundBlock) {
              location2.index++;
            }
            location2.offset = 0;
            foundBlock = true;
          } else {
            location2.offset += nodeLength(node);
          }
        }
      }
      return location2;
    }
    findContainerAndOffsetFromLocation(location2) {
      let container, offset;
      if (location2.index === 0 && location2.offset === 0) {
        container = this.element;
        offset = 0;
        while (container.firstChild) {
          container = container.firstChild;
          if (nodeIsBlockContainer(container)) {
            offset = 1;
            break;
          }
        }
        return [container, offset];
      }
      let [node, nodeOffset] = this.findNodeAndOffsetFromLocation(location2);
      if (!node)
        return;
      if (nodeIsTextNode(node)) {
        if (nodeLength(node) === 0) {
          container = node.parentNode.parentNode;
          offset = findChildIndexOfNode(node.parentNode);
          if (nodeIsCursorTarget(node, {
            name: "right"
          })) {
            offset++;
          }
        } else {
          container = node;
          offset = location2.offset - nodeOffset;
        }
      } else {
        container = node.parentNode;
        if (!nodeIsBlockStart(node.previousSibling)) {
          if (!nodeIsBlockContainer(container)) {
            while (node === container.lastChild) {
              node = container;
              container = container.parentNode;
              if (nodeIsBlockContainer(container)) {
                break;
              }
            }
          }
        }
        offset = findChildIndexOfNode(node);
        if (location2.offset !== 0) {
          offset++;
        }
      }
      return [container, offset];
    }
    findNodeAndOffsetFromLocation(location2) {
      let node, nodeOffset;
      let offset = 0;
      for (const currentNode of this.getSignificantNodesForIndex(location2.index)) {
        const length = nodeLength(currentNode);
        if (location2.offset <= offset + length) {
          if (nodeIsTextNode(currentNode)) {
            node = currentNode;
            nodeOffset = offset;
            if (location2.offset === nodeOffset && nodeIsCursorTarget(node)) {
              break;
            }
          } else if (!node) {
            node = currentNode;
            nodeOffset = offset;
          }
        }
        offset += length;
        if (offset > location2.offset) {
          break;
        }
      }
      return [node, nodeOffset];
    }
    findAttachmentElementParentForNode(node) {
      while (node && node !== this.element) {
        if (nodeIsAttachmentElement(node)) {
          return node;
        }
        node = node.parentNode;
      }
    }
    getSignificantNodesForIndex(index) {
      const nodes = [];
      const walker = walkTree(this.element, {
        usingFilter: acceptSignificantNodes
      });
      let recordingNodes = false;
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (nodeIsBlockStartComment(node)) {
          var blockIndex;
          if (blockIndex != null) {
            blockIndex++;
          } else {
            blockIndex = 0;
          }
          if (blockIndex === index) {
            recordingNodes = true;
          } else if (recordingNodes) {
            break;
          }
        } else if (recordingNodes) {
          nodes.push(node);
        }
      }
      return nodes;
    }
  };
  var nodeLength = function(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (nodeIsCursorTarget(node)) {
        return 0;
      } else {
        const string = node.textContent;
        return string.length;
      }
    } else if (tagName(node) === "br" || nodeIsAttachmentElement(node)) {
      return 1;
    } else {
      return 0;
    }
  };
  var acceptSignificantNodes = function(node) {
    if (rejectEmptyTextNodes(node) === NodeFilter.FILTER_ACCEPT) {
      return rejectAttachmentContents(node);
    } else {
      return NodeFilter.FILTER_REJECT;
    }
  };
  var rejectEmptyTextNodes = function(node) {
    if (nodeIsEmptyTextNode(node)) {
      return NodeFilter.FILTER_REJECT;
    } else {
      return NodeFilter.FILTER_ACCEPT;
    }
  };
  var rejectAttachmentContents = function(node) {
    if (nodeIsAttachmentElement(node.parentNode)) {
      return NodeFilter.FILTER_REJECT;
    } else {
      return NodeFilter.FILTER_ACCEPT;
    }
  };
  var PointMapper = class {
    createDOMRangeFromPoint(_ref) {
      let {
        x,
        y
      } = _ref;
      let domRange;
      if (document.caretPositionFromPoint) {
        const {
          offsetNode,
          offset
        } = document.caretPositionFromPoint(x, y);
        domRange = document.createRange();
        domRange.setStart(offsetNode, offset);
        return domRange;
      } else if (document.caretRangeFromPoint) {
        return document.caretRangeFromPoint(x, y);
      } else if (document.body.createTextRange) {
        const originalDOMRange = getDOMRange();
        try {
          const textRange = document.body.createTextRange();
          textRange.moveToPoint(x, y);
          textRange.select();
        } catch (error2) {
        }
        domRange = getDOMRange();
        setDOMRange(originalDOMRange);
        return domRange;
      }
    }
    getClientRectsForDOMRange(domRange) {
      const array = Array.from(domRange.getClientRects());
      const start2 = array[0];
      const end = array[array.length - 1];
      return [start2, end];
    }
  };
  var SelectionManager = class extends BasicObject {
    constructor(element) {
      super(...arguments);
      this.didMouseDown = this.didMouseDown.bind(this);
      this.selectionDidChange = this.selectionDidChange.bind(this);
      this.element = element;
      this.locationMapper = new LocationMapper(this.element);
      this.pointMapper = new PointMapper();
      this.lockCount = 0;
      handleEvent("mousedown", {
        onElement: this.element,
        withCallback: this.didMouseDown
      });
    }
    getLocationRange() {
      let options2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (options2.strict === false) {
        return this.createLocationRangeFromDOMRange(getDOMRange());
      } else if (options2.ignoreLock) {
        return this.currentLocationRange;
      } else if (this.lockedLocationRange) {
        return this.lockedLocationRange;
      } else {
        return this.currentLocationRange;
      }
    }
    setLocationRange(locationRange) {
      if (this.lockedLocationRange)
        return;
      locationRange = normalizeRange(locationRange);
      const domRange = this.createDOMRangeFromLocationRange(locationRange);
      if (domRange) {
        setDOMRange(domRange);
        this.updateCurrentLocationRange(locationRange);
      }
    }
    setLocationRangeFromPointRange(pointRange) {
      pointRange = normalizeRange(pointRange);
      const startLocation = this.getLocationAtPoint(pointRange[0]);
      const endLocation = this.getLocationAtPoint(pointRange[1]);
      this.setLocationRange([startLocation, endLocation]);
    }
    getClientRectAtLocationRange(locationRange) {
      const domRange = this.createDOMRangeFromLocationRange(locationRange);
      if (domRange) {
        return this.getClientRectsForDOMRange(domRange)[1];
      }
    }
    locationIsCursorTarget(location2) {
      const node = Array.from(this.findNodeAndOffsetFromLocation(location2))[0];
      return nodeIsCursorTarget(node);
    }
    lock() {
      if (this.lockCount++ === 0) {
        this.updateCurrentLocationRange();
        this.lockedLocationRange = this.getLocationRange();
      }
    }
    unlock() {
      if (--this.lockCount === 0) {
        const {
          lockedLocationRange
        } = this;
        this.lockedLocationRange = null;
        if (lockedLocationRange != null) {
          return this.setLocationRange(lockedLocationRange);
        }
      }
    }
    clearSelection() {
      var _getDOMSelection;
      return (_getDOMSelection = getDOMSelection()) === null || _getDOMSelection === void 0 ? void 0 : _getDOMSelection.removeAllRanges();
    }
    selectionIsCollapsed() {
      var _getDOMRange;
      return ((_getDOMRange = getDOMRange()) === null || _getDOMRange === void 0 ? void 0 : _getDOMRange.collapsed) === true;
    }
    selectionIsExpanded() {
      return !this.selectionIsCollapsed();
    }
    createLocationRangeFromDOMRange(domRange, options2) {
      if (domRange == null || !this.domRangeWithinElement(domRange))
        return;
      const start2 = this.findLocationFromContainerAndOffset(domRange.startContainer, domRange.startOffset, options2);
      if (!start2)
        return;
      const end = domRange.collapsed ? void 0 : this.findLocationFromContainerAndOffset(domRange.endContainer, domRange.endOffset, options2);
      return normalizeRange([start2, end]);
    }
    didMouseDown() {
      return this.pauseTemporarily();
    }
    pauseTemporarily() {
      let resumeHandlers;
      this.paused = true;
      const resume = () => {
        this.paused = false;
        clearTimeout(resumeTimeout);
        Array.from(resumeHandlers).forEach((handler) => {
          handler.destroy();
        });
        if (elementContainsNode(document, this.element)) {
          return this.selectionDidChange();
        }
      };
      const resumeTimeout = setTimeout(resume, 200);
      resumeHandlers = ["mousemove", "keydown"].map((eventName) => handleEvent(eventName, {
        onElement: document,
        withCallback: resume
      }));
    }
    selectionDidChange() {
      if (!this.paused && !innerElementIsActive(this.element)) {
        return this.updateCurrentLocationRange();
      }
    }
    updateCurrentLocationRange(locationRange) {
      if (locationRange != null ? locationRange : locationRange = this.createLocationRangeFromDOMRange(getDOMRange())) {
        if (!rangesAreEqual(locationRange, this.currentLocationRange)) {
          var _this$delegate, _this$delegate$locati;
          this.currentLocationRange = locationRange;
          return (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$locati = _this$delegate.locationRangeDidChange) === null || _this$delegate$locati === void 0 ? void 0 : _this$delegate$locati.call(_this$delegate, this.currentLocationRange.slice(0));
        }
      }
    }
    createDOMRangeFromLocationRange(locationRange) {
      const rangeStart = this.findContainerAndOffsetFromLocation(locationRange[0]);
      const rangeEnd = rangeIsCollapsed(locationRange) ? rangeStart : this.findContainerAndOffsetFromLocation(locationRange[1]) || rangeStart;
      if (rangeStart != null && rangeEnd != null) {
        const domRange = document.createRange();
        domRange.setStart(...Array.from(rangeStart || []));
        domRange.setEnd(...Array.from(rangeEnd || []));
        return domRange;
      }
    }
    getLocationAtPoint(point) {
      const domRange = this.createDOMRangeFromPoint(point);
      if (domRange) {
        var _this$createLocationR;
        return (_this$createLocationR = this.createLocationRangeFromDOMRange(domRange)) === null || _this$createLocationR === void 0 ? void 0 : _this$createLocationR[0];
      }
    }
    domRangeWithinElement(domRange) {
      if (domRange.collapsed) {
        return elementContainsNode(this.element, domRange.startContainer);
      } else {
        return elementContainsNode(this.element, domRange.startContainer) && elementContainsNode(this.element, domRange.endContainer);
      }
    }
  };
  SelectionManager.proxyMethod("locationMapper.findLocationFromContainerAndOffset");
  SelectionManager.proxyMethod("locationMapper.findContainerAndOffsetFromLocation");
  SelectionManager.proxyMethod("locationMapper.findNodeAndOffsetFromLocation");
  SelectionManager.proxyMethod("pointMapper.createDOMRangeFromPoint");
  SelectionManager.proxyMethod("pointMapper.getClientRectsForDOMRange");
  var models = {
    Attachment,
    AttachmentManager,
    AttachmentPiece,
    Block,
    Composition,
    Cocument: Document,
    Editor,
    HTMLParser,
    HTMLSanitizer,
    LineBreakInsertion,
    LocationMapper,
    ManagedAttachment,
    Piece,
    PointMapper,
    SelectionManager,
    SplittableList,
    StringPiece,
    Text,
    UndoManager
  };
  var Trix = {
    VERSION: version,
    config
  };
  Object.assign(Trix, models);
  window.Trix = Trix;
  var ObjectGroup = class {
    static groupObjects() {
      let ungroupedObjects = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      let {
        depth,
        asTree
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let group;
      if (asTree) {
        if (depth == null) {
          depth = 0;
        }
      }
      const objects = [];
      Array.from(ungroupedObjects).forEach((object2) => {
        var _object$canBeGrouped2;
        if (group) {
          var _object$canBeGrouped, _group$canBeGroupedWi, _group;
          if ((_object$canBeGrouped = object2.canBeGrouped) !== null && _object$canBeGrouped !== void 0 && _object$canBeGrouped.call(object2, depth) && (_group$canBeGroupedWi = (_group = group[group.length - 1]).canBeGroupedWith) !== null && _group$canBeGroupedWi !== void 0 && _group$canBeGroupedWi.call(_group, object2, depth)) {
            group.push(object2);
            return;
          } else {
            objects.push(new this(group, {
              depth,
              asTree
            }));
            group = null;
          }
        }
        if ((_object$canBeGrouped2 = object2.canBeGrouped) !== null && _object$canBeGrouped2 !== void 0 && _object$canBeGrouped2.call(object2, depth)) {
          group = [object2];
        } else {
          objects.push(object2);
        }
      });
      if (group) {
        objects.push(new this(group, {
          depth,
          asTree
        }));
      }
      return objects;
    }
    constructor() {
      let objects = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      let {
        depth,
        asTree
      } = arguments.length > 1 ? arguments[1] : void 0;
      this.objects = objects;
      if (asTree) {
        this.depth = depth;
        this.objects = this.constructor.groupObjects(this.objects, {
          asTree,
          depth: this.depth + 1
        });
      }
    }
    getObjects() {
      return this.objects;
    }
    getDepth() {
      return this.depth;
    }
    getCacheKey() {
      const keys = ["objectGroup"];
      Array.from(this.getObjects()).forEach((object2) => {
        keys.push(object2.getCacheKey());
      });
      return keys.join("/");
    }
  };
  var ElementStore = class {
    constructor(elements) {
      this.reset(elements);
    }
    add(element) {
      const key = getKey(element);
      this.elements[key] = element;
    }
    remove(element) {
      const key = getKey(element);
      const value = this.elements[key];
      if (value) {
        delete this.elements[key];
        return value;
      }
    }
    reset() {
      let elements = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
      this.elements = {};
      Array.from(elements).forEach((element) => {
        this.add(element);
      });
      return elements;
    }
  };
  var getKey = (element) => element.dataset.trixStoreKey;
  var ObjectView = class extends BasicObject {
    constructor(object2) {
      let options2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      super(...arguments);
      this.object = object2;
      this.options = options2;
      this.childViews = [];
      this.rootView = this;
    }
    getNodes() {
      if (!this.nodes) {
        this.nodes = this.createNodes();
      }
      return this.nodes.map((node) => node.cloneNode(true));
    }
    invalidate() {
      var _this$parentView;
      this.nodes = null;
      this.childViews = [];
      return (_this$parentView = this.parentView) === null || _this$parentView === void 0 ? void 0 : _this$parentView.invalidate();
    }
    invalidateViewForObject(object2) {
      var _this$findViewForObje;
      return (_this$findViewForObje = this.findViewForObject(object2)) === null || _this$findViewForObje === void 0 ? void 0 : _this$findViewForObje.invalidate();
    }
    findOrCreateCachedChildView(viewClass, object2, options2) {
      let view = this.getCachedViewForObject(object2);
      if (view) {
        this.recordChildView(view);
      } else {
        view = this.createChildView(...arguments);
        this.cacheViewForObject(view, object2);
      }
      return view;
    }
    createChildView(viewClass, object2) {
      let options2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (object2 instanceof ObjectGroup) {
        options2.viewClass = viewClass;
        viewClass = ObjectGroupView;
      }
      const view = new viewClass(object2, options2);
      return this.recordChildView(view);
    }
    recordChildView(view) {
      view.parentView = this;
      view.rootView = this.rootView;
      this.childViews.push(view);
      return view;
    }
    getAllChildViews() {
      let views = [];
      this.childViews.forEach((childView) => {
        views.push(childView);
        views = views.concat(childView.getAllChildViews());
      });
      return views;
    }
    findElement() {
      return this.findElementForObject(this.object);
    }
    findElementForObject(object2) {
      const id2 = object2 === null || object2 === void 0 ? void 0 : object2.id;
      if (id2) {
        return this.rootView.element.querySelector("[data-trix-id='".concat(id2, "']"));
      }
    }
    findViewForObject(object2) {
      for (const view of this.getAllChildViews()) {
        if (view.object === object2) {
          return view;
        }
      }
    }
    getViewCache() {
      if (this.rootView === this) {
        if (this.isViewCachingEnabled()) {
          if (!this.viewCache) {
            this.viewCache = {};
          }
          return this.viewCache;
        }
      } else {
        return this.rootView.getViewCache();
      }
    }
    isViewCachingEnabled() {
      return this.shouldCacheViews !== false;
    }
    enableViewCaching() {
      this.shouldCacheViews = true;
    }
    disableViewCaching() {
      this.shouldCacheViews = false;
    }
    getCachedViewForObject(object2) {
      var _this$getViewCache;
      return (_this$getViewCache = this.getViewCache()) === null || _this$getViewCache === void 0 ? void 0 : _this$getViewCache[object2.getCacheKey()];
    }
    cacheViewForObject(view, object2) {
      const cache = this.getViewCache();
      if (cache) {
        cache[object2.getCacheKey()] = view;
      }
    }
    garbageCollectCachedViews() {
      const cache = this.getViewCache();
      if (cache) {
        const views = this.getAllChildViews().concat(this);
        const objectKeys = views.map((view) => view.object.getCacheKey());
        for (const key in cache) {
          if (!objectKeys.includes(key)) {
            delete cache[key];
          }
        }
      }
    }
  };
  var ObjectGroupView = class extends ObjectView {
    constructor() {
      super(...arguments);
      this.objectGroup = this.object;
      this.viewClass = this.options.viewClass;
      delete this.options.viewClass;
    }
    getChildViews() {
      if (!this.childViews.length) {
        Array.from(this.objectGroup.getObjects()).forEach((object2) => {
          this.findOrCreateCachedChildView(this.viewClass, object2, this.options);
        });
      }
      return this.childViews;
    }
    createNodes() {
      const element = this.createContainerElement();
      this.getChildViews().forEach((view) => {
        Array.from(view.getNodes()).forEach((node) => {
          element.appendChild(node);
        });
      });
      return [element];
    }
    createContainerElement() {
      let depth = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.objectGroup.getDepth();
      return this.getChildViews()[0].createContainerElement(depth);
    }
  };
  var {
    css: css$2
  } = config;
  var AttachmentView = class extends ObjectView {
    constructor() {
      super(...arguments);
      this.attachment = this.object;
      this.attachment.uploadProgressDelegate = this;
      this.attachmentPiece = this.options.piece;
    }
    createContentNodes() {
      return [];
    }
    createNodes() {
      let innerElement;
      const figure = innerElement = makeElement({
        tagName: "figure",
        className: this.getClassName(),
        data: this.getData(),
        editable: false
      });
      const href = this.getHref();
      if (href) {
        innerElement = makeElement({
          tagName: "a",
          editable: false,
          attributes: {
            href,
            tabindex: -1
          }
        });
        figure.appendChild(innerElement);
      }
      if (this.attachment.hasContent()) {
        innerElement.innerHTML = this.attachment.getContent();
      } else {
        this.createContentNodes().forEach((node) => {
          innerElement.appendChild(node);
        });
      }
      innerElement.appendChild(this.createCaptionElement());
      if (this.attachment.isPending()) {
        this.progressElement = makeElement({
          tagName: "progress",
          attributes: {
            class: css$2.attachmentProgress,
            value: this.attachment.getUploadProgress(),
            max: 100
          },
          data: {
            trixMutable: true,
            trixStoreKey: ["progressElement", this.attachment.id].join("/")
          }
        });
        figure.appendChild(this.progressElement);
      }
      return [createCursorTarget("left"), figure, createCursorTarget("right")];
    }
    createCaptionElement() {
      const figcaption = makeElement({
        tagName: "figcaption",
        className: css$2.attachmentCaption
      });
      const caption = this.attachmentPiece.getCaption();
      if (caption) {
        figcaption.classList.add("".concat(css$2.attachmentCaption, "--edited"));
        figcaption.textContent = caption;
      } else {
        let name, size;
        const captionConfig = this.getCaptionConfig();
        if (captionConfig.name) {
          name = this.attachment.getFilename();
        }
        if (captionConfig.size) {
          size = this.attachment.getFormattedFilesize();
        }
        if (name) {
          const nameElement = makeElement({
            tagName: "span",
            className: css$2.attachmentName,
            textContent: name
          });
          figcaption.appendChild(nameElement);
        }
        if (size) {
          if (name) {
            figcaption.appendChild(document.createTextNode(" "));
          }
          const sizeElement = makeElement({
            tagName: "span",
            className: css$2.attachmentSize,
            textContent: size
          });
          figcaption.appendChild(sizeElement);
        }
      }
      return figcaption;
    }
    getClassName() {
      const names = [css$2.attachment, "".concat(css$2.attachment, "--").concat(this.attachment.getType())];
      const extension = this.attachment.getExtension();
      if (extension) {
        names.push("".concat(css$2.attachment, "--").concat(extension));
      }
      return names.join(" ");
    }
    getData() {
      const data = {
        trixAttachment: JSON.stringify(this.attachment),
        trixContentType: this.attachment.getContentType(),
        trixId: this.attachment.id
      };
      const {
        attributes: attributes2
      } = this.attachmentPiece;
      if (!attributes2.isEmpty()) {
        data.trixAttributes = JSON.stringify(attributes2);
      }
      if (this.attachment.isPending()) {
        data.trixSerialize = false;
      }
      return data;
    }
    getHref() {
      if (!htmlContainsTagName(this.attachment.getContent(), "a")) {
        return this.attachment.getHref();
      }
    }
    getCaptionConfig() {
      var _config$attachments$t;
      const type = this.attachment.getType();
      const captionConfig = copyObject((_config$attachments$t = config.attachments[type]) === null || _config$attachments$t === void 0 ? void 0 : _config$attachments$t.caption);
      if (type === "file") {
        captionConfig.name = true;
      }
      return captionConfig;
    }
    findProgressElement() {
      var _this$findElement;
      return (_this$findElement = this.findElement()) === null || _this$findElement === void 0 ? void 0 : _this$findElement.querySelector("progress");
    }
    attachmentDidChangeUploadProgress() {
      const value = this.attachment.getUploadProgress();
      const progressElement = this.findProgressElement();
      if (progressElement) {
        progressElement.value = value;
      }
    }
  };
  var createCursorTarget = (name) => makeElement({
    tagName: "span",
    textContent: ZERO_WIDTH_SPACE,
    data: {
      trixCursorTarget: name,
      trixSerialize: false
    }
  });
  var htmlContainsTagName = function(html2, tagName2) {
    const div = makeElement("div");
    div.innerHTML = html2 || "";
    return div.querySelector(tagName2);
  };
  var PreviewableAttachmentView = class extends AttachmentView {
    constructor() {
      super(...arguments);
      this.attachment.previewDelegate = this;
    }
    createContentNodes() {
      this.image = makeElement({
        tagName: "img",
        attributes: {
          src: ""
        },
        data: {
          trixMutable: true
        }
      });
      this.refresh(this.image);
      return [this.image];
    }
    createCaptionElement() {
      const figcaption = super.createCaptionElement(...arguments);
      if (!figcaption.textContent) {
        figcaption.setAttribute("data-trix-placeholder", config.lang.captionPlaceholder);
      }
      return figcaption;
    }
    refresh(image) {
      if (!image) {
        var _this$findElement;
        image = (_this$findElement = this.findElement()) === null || _this$findElement === void 0 ? void 0 : _this$findElement.querySelector("img");
      }
      if (image) {
        return this.updateAttributesForImage(image);
      }
    }
    updateAttributesForImage(image) {
      const url = this.attachment.getURL();
      const previewURL = this.attachment.getPreviewURL();
      image.src = previewURL || url;
      if (previewURL === url) {
        image.removeAttribute("data-trix-serialized-attributes");
      } else {
        const serializedAttributes = JSON.stringify({
          src: url
        });
        image.setAttribute("data-trix-serialized-attributes", serializedAttributes);
      }
      const width = this.attachment.getWidth();
      const height = this.attachment.getHeight();
      if (width != null) {
        image.width = width;
      }
      if (height != null) {
        image.height = height;
      }
      const storeKey = ["imageElement", this.attachment.id, image.src, image.width, image.height].join("/");
      image.dataset.trixStoreKey = storeKey;
    }
    attachmentDidChangeAttributes() {
      this.refresh(this.image);
      return this.refresh();
    }
  };
  var PieceView = class extends ObjectView {
    constructor() {
      super(...arguments);
      this.piece = this.object;
      this.attributes = this.piece.getAttributes();
      this.textConfig = this.options.textConfig;
      this.context = this.options.context;
      if (this.piece.attachment) {
        this.attachment = this.piece.attachment;
      } else {
        this.string = this.piece.toString();
      }
    }
    createNodes() {
      let nodes = this.attachment ? this.createAttachmentNodes() : this.createStringNodes();
      const element = this.createElement();
      if (element) {
        const innerElement = findInnerElement(element);
        Array.from(nodes).forEach((node) => {
          innerElement.appendChild(node);
        });
        nodes = [element];
      }
      return nodes;
    }
    createAttachmentNodes() {
      const constructor = this.attachment.isPreviewable() ? PreviewableAttachmentView : AttachmentView;
      const view = this.createChildView(constructor, this.piece.attachment, {
        piece: this.piece
      });
      return view.getNodes();
    }
    createStringNodes() {
      var _this$textConfig;
      if ((_this$textConfig = this.textConfig) !== null && _this$textConfig !== void 0 && _this$textConfig.plaintext) {
        return [document.createTextNode(this.string)];
      } else {
        const nodes = [];
        const iterable = this.string.split("\n");
        for (let index = 0; index < iterable.length; index++) {
          const substring = iterable[index];
          if (index > 0) {
            const element = makeElement("br");
            nodes.push(element);
          }
          if (substring.length) {
            const node = document.createTextNode(this.preserveSpaces(substring));
            nodes.push(node);
          }
        }
        return nodes;
      }
    }
    createElement() {
      let element, key, value;
      const styles = {};
      for (key in this.attributes) {
        value = this.attributes[key];
        const config2 = getTextConfig(key);
        if (config2) {
          if (config2.tagName) {
            var innerElement;
            const pendingElement = makeElement(config2.tagName);
            if (innerElement) {
              innerElement.appendChild(pendingElement);
              innerElement = pendingElement;
            } else {
              element = innerElement = pendingElement;
            }
          }
          if (config2.styleProperty) {
            styles[config2.styleProperty] = value;
          }
          if (config2.style) {
            for (key in config2.style) {
              value = config2.style[key];
              styles[key] = value;
            }
          }
        }
      }
      if (Object.keys(styles).length) {
        if (!element) {
          element = makeElement("span");
        }
        for (key in styles) {
          value = styles[key];
          element.style[key] = value;
        }
      }
      return element;
    }
    createContainerElement() {
      for (const key in this.attributes) {
        const value = this.attributes[key];
        const config2 = getTextConfig(key);
        if (config2) {
          if (config2.groupTagName) {
            const attributes2 = {};
            attributes2[key] = value;
            return makeElement(config2.groupTagName, attributes2);
          }
        }
      }
    }
    preserveSpaces(string) {
      if (this.context.isLast) {
        string = string.replace(/\ $/, NON_BREAKING_SPACE);
      }
      string = string.replace(/(\S)\ {3}(\S)/g, "$1 ".concat(NON_BREAKING_SPACE, " $2")).replace(/\ {2}/g, "".concat(NON_BREAKING_SPACE, " ")).replace(/\ {2}/g, " ".concat(NON_BREAKING_SPACE));
      if (this.context.isFirst || this.context.followsWhitespace) {
        string = string.replace(/^\ /, NON_BREAKING_SPACE);
      }
      return string;
    }
  };
  var TextView = class extends ObjectView {
    constructor() {
      super(...arguments);
      this.text = this.object;
      this.textConfig = this.options.textConfig;
    }
    createNodes() {
      const nodes = [];
      const pieces = ObjectGroup.groupObjects(this.getPieces());
      const lastIndex = pieces.length - 1;
      for (let index = 0; index < pieces.length; index++) {
        const piece = pieces[index];
        const context = {};
        if (index === 0) {
          context.isFirst = true;
        }
        if (index === lastIndex) {
          context.isLast = true;
        }
        if (endsWithWhitespace(previousPiece)) {
          context.followsWhitespace = true;
        }
        const view = this.findOrCreateCachedChildView(PieceView, piece, {
          textConfig: this.textConfig,
          context
        });
        nodes.push(...Array.from(view.getNodes() || []));
        var previousPiece = piece;
      }
      return nodes;
    }
    getPieces() {
      return Array.from(this.text.getPieces()).filter((piece) => !piece.hasAttribute("blockBreak"));
    }
  };
  var endsWithWhitespace = (piece) => /\s$/.test(piece === null || piece === void 0 ? void 0 : piece.toString());
  var {
    css: css$1
  } = config;
  var BlockView = class extends ObjectView {
    constructor() {
      super(...arguments);
      this.block = this.object;
      this.attributes = this.block.getAttributes();
    }
    createNodes() {
      const comment = document.createComment("block");
      const nodes = [comment];
      if (this.block.isEmpty()) {
        nodes.push(makeElement("br"));
      } else {
        var _getBlockConfig;
        const textConfig = (_getBlockConfig = getBlockConfig(this.block.getLastAttribute())) === null || _getBlockConfig === void 0 ? void 0 : _getBlockConfig.text;
        const textView = this.findOrCreateCachedChildView(TextView, this.block.text, {
          textConfig
        });
        nodes.push(...Array.from(textView.getNodes() || []));
        if (this.shouldAddExtraNewlineElement()) {
          nodes.push(makeElement("br"));
        }
      }
      if (this.attributes.length) {
        return nodes;
      } else {
        let attributes2;
        const {
          tagName: tagName2
        } = config.blockAttributes.default;
        if (this.block.isRTL()) {
          attributes2 = {
            dir: "rtl"
          };
        }
        const element = makeElement({
          tagName: tagName2,
          attributes: attributes2
        });
        nodes.forEach((node) => element.appendChild(node));
        return [element];
      }
    }
    createContainerElement(depth) {
      let attributes2, className;
      const attributeName = this.attributes[depth];
      const {
        tagName: tagName2
      } = getBlockConfig(attributeName);
      if (depth === 0 && this.block.isRTL()) {
        attributes2 = {
          dir: "rtl"
        };
      }
      if (attributeName === "attachmentGallery") {
        const size = this.block.getBlockBreakPosition();
        className = "".concat(css$1.attachmentGallery, " ").concat(css$1.attachmentGallery, "--").concat(size);
      }
      return makeElement({
        tagName: tagName2,
        className,
        attributes: attributes2
      });
    }
    shouldAddExtraNewlineElement() {
      return /\n\n$/.test(this.block.toString());
    }
  };
  var DocumentView = class extends ObjectView {
    static render(document2) {
      const element = makeElement("div");
      const view = new this(document2, {
        element
      });
      view.render();
      view.sync();
      return element;
    }
    constructor() {
      super(...arguments);
      this.element = this.options.element;
      this.elementStore = new ElementStore();
      this.setDocument(this.object);
    }
    setDocument(document2) {
      if (!document2.isEqualTo(this.document)) {
        this.document = this.object = document2;
      }
    }
    render() {
      this.childViews = [];
      this.shadowElement = makeElement("div");
      if (!this.document.isEmpty()) {
        const objects = ObjectGroup.groupObjects(this.document.getBlocks(), {
          asTree: true
        });
        Array.from(objects).forEach((object2) => {
          const view = this.findOrCreateCachedChildView(BlockView, object2);
          Array.from(view.getNodes()).map((node) => this.shadowElement.appendChild(node));
        });
      }
    }
    isSynced() {
      return elementsHaveEqualHTML(this.shadowElement, this.element);
    }
    sync() {
      const fragment = this.createDocumentFragmentForSync();
      while (this.element.lastChild) {
        this.element.removeChild(this.element.lastChild);
      }
      this.element.appendChild(fragment);
      return this.didSync();
    }
    didSync() {
      this.elementStore.reset(findStoredElements(this.element));
      return defer(() => this.garbageCollectCachedViews());
    }
    createDocumentFragmentForSync() {
      const fragment = document.createDocumentFragment();
      Array.from(this.shadowElement.childNodes).forEach((node) => {
        fragment.appendChild(node.cloneNode(true));
      });
      Array.from(findStoredElements(fragment)).forEach((element) => {
        const storedElement = this.elementStore.remove(element);
        if (storedElement) {
          element.parentNode.replaceChild(storedElement, element);
        }
      });
      return fragment;
    }
  };
  var findStoredElements = (element) => element.querySelectorAll("[data-trix-store-key]");
  var elementsHaveEqualHTML = (element, otherElement) => ignoreSpaces(element.innerHTML) === ignoreSpaces(otherElement.innerHTML);
  var ignoreSpaces = (html2) => html2.replace(/&nbsp;/g, " ");
  var unserializableElementSelector = "[data-trix-serialize=false]";
  var unserializableAttributeNames = ["contenteditable", "data-trix-id", "data-trix-store-key", "data-trix-mutable", "data-trix-placeholder", "tabindex"];
  var serializedAttributesAttribute = "data-trix-serialized-attributes";
  var serializedAttributesSelector = "[".concat(serializedAttributesAttribute, "]");
  var blockCommentPattern = new RegExp("<!--block-->", "g");
  var serializers = {
    "application/json": function(serializable) {
      let document2;
      if (serializable instanceof Document) {
        document2 = serializable;
      } else if (serializable instanceof HTMLElement) {
        document2 = HTMLParser.parse(serializable.innerHTML).getDocument();
      } else {
        throw new Error("unserializable object");
      }
      return document2.toSerializableDocument().toJSONString();
    },
    "text/html": function(serializable) {
      let element;
      if (serializable instanceof Document) {
        element = DocumentView.render(serializable);
      } else if (serializable instanceof HTMLElement) {
        element = serializable.cloneNode(true);
      } else {
        throw new Error("unserializable object");
      }
      Array.from(element.querySelectorAll(unserializableElementSelector)).forEach((el) => {
        removeNode(el);
      });
      unserializableAttributeNames.forEach((attribute) => {
        Array.from(element.querySelectorAll("[".concat(attribute, "]"))).forEach((el) => {
          el.removeAttribute(attribute);
        });
      });
      Array.from(element.querySelectorAll(serializedAttributesSelector)).forEach((el) => {
        try {
          const attributes2 = JSON.parse(el.getAttribute(serializedAttributesAttribute));
          el.removeAttribute(serializedAttributesAttribute);
          for (const name in attributes2) {
            const value = attributes2[name];
            el.setAttribute(name, value);
          }
        } catch (error2) {
        }
      });
      return element.innerHTML.replace(blockCommentPattern, "");
    }
  };
  var serializeToContentType = function(serializable, contentType) {
    const serializer = serializers[contentType];
    if (serializer) {
      return serializer(serializable);
    } else {
      throw new Error("unknown content type: ".concat(contentType));
    }
  };
  var mutableAttributeName = "data-trix-mutable";
  var mutableSelector = "[".concat(mutableAttributeName, "]");
  var options = {
    attributes: true,
    childList: true,
    characterData: true,
    characterDataOldValue: true,
    subtree: true
  };
  var MutationObserver2 = class extends BasicObject {
    constructor(element) {
      super(element);
      this.didMutate = this.didMutate.bind(this);
      this.element = element;
      this.observer = new window.MutationObserver(this.didMutate);
      this.start();
    }
    start() {
      this.reset();
      return this.observer.observe(this.element, options);
    }
    stop() {
      return this.observer.disconnect();
    }
    didMutate(mutations) {
      this.mutations.push(...Array.from(this.findSignificantMutations(mutations) || []));
      if (this.mutations.length) {
        var _this$delegate, _this$delegate$elemen;
        (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$elemen = _this$delegate.elementDidMutate) === null || _this$delegate$elemen === void 0 ? void 0 : _this$delegate$elemen.call(_this$delegate, this.getMutationSummary());
        return this.reset();
      }
    }
    reset() {
      this.mutations = [];
    }
    findSignificantMutations(mutations) {
      return mutations.filter((mutation) => {
        return this.mutationIsSignificant(mutation);
      });
    }
    mutationIsSignificant(mutation) {
      if (this.nodeIsMutable(mutation.target)) {
        return false;
      }
      for (const node of Array.from(this.nodesModifiedByMutation(mutation))) {
        if (this.nodeIsSignificant(node))
          return true;
      }
      return false;
    }
    nodeIsSignificant(node) {
      return node !== this.element && !this.nodeIsMutable(node) && !nodeIsEmptyTextNode(node);
    }
    nodeIsMutable(node) {
      return findClosestElementFromNode(node, {
        matchingSelector: mutableSelector
      });
    }
    nodesModifiedByMutation(mutation) {
      const nodes = [];
      switch (mutation.type) {
        case "attributes":
          if (mutation.attributeName !== mutableAttributeName) {
            nodes.push(mutation.target);
          }
          break;
        case "characterData":
          nodes.push(mutation.target.parentNode);
          nodes.push(mutation.target);
          break;
        case "childList":
          nodes.push(...Array.from(mutation.addedNodes || []));
          nodes.push(...Array.from(mutation.removedNodes || []));
          break;
      }
      return nodes;
    }
    getMutationSummary() {
      return this.getTextMutationSummary();
    }
    getTextMutationSummary() {
      const {
        additions,
        deletions
      } = this.getTextChangesFromCharacterData();
      const textChanges = this.getTextChangesFromChildList();
      Array.from(textChanges.additions).forEach((addition) => {
        if (!Array.from(additions).includes(addition)) {
          additions.push(addition);
        }
      });
      deletions.push(...Array.from(textChanges.deletions || []));
      const summary = {};
      const added = additions.join("");
      if (added) {
        summary.textAdded = added;
      }
      const deleted = deletions.join("");
      if (deleted) {
        summary.textDeleted = deleted;
      }
      return summary;
    }
    getMutationsByType(type) {
      return Array.from(this.mutations).filter((mutation) => mutation.type === type);
    }
    getTextChangesFromChildList() {
      let textAdded, textRemoved;
      const addedNodes = [];
      const removedNodes = [];
      Array.from(this.getMutationsByType("childList")).forEach((mutation) => {
        addedNodes.push(...Array.from(mutation.addedNodes || []));
        removedNodes.push(...Array.from(mutation.removedNodes || []));
      });
      const singleBlockCommentRemoved = addedNodes.length === 0 && removedNodes.length === 1 && nodeIsBlockStartComment(removedNodes[0]);
      if (singleBlockCommentRemoved) {
        textAdded = [];
        textRemoved = ["\n"];
      } else {
        textAdded = getTextForNodes(addedNodes);
        textRemoved = getTextForNodes(removedNodes);
      }
      const additions = textAdded.filter((text, index) => text !== textRemoved[index]).map(normalizeSpaces);
      const deletions = textRemoved.filter((text, index) => text !== textAdded[index]).map(normalizeSpaces);
      return {
        additions,
        deletions
      };
    }
    getTextChangesFromCharacterData() {
      let added, removed;
      const characterMutations = this.getMutationsByType("characterData");
      if (characterMutations.length) {
        const startMutation = characterMutations[0], endMutation = characterMutations[characterMutations.length - 1];
        const oldString = normalizeSpaces(startMutation.oldValue);
        const newString = normalizeSpaces(endMutation.target.data);
        const summarized = summarizeStringChange(oldString, newString);
        added = summarized.added;
        removed = summarized.removed;
      }
      return {
        additions: added ? [added] : [],
        deletions: removed ? [removed] : []
      };
    }
  };
  var getTextForNodes = function() {
    let nodes = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    const text = [];
    for (const node of Array.from(nodes)) {
      switch (node.nodeType) {
        case Node.TEXT_NODE:
          text.push(node.data);
          break;
        case Node.ELEMENT_NODE:
          if (tagName(node) === "br") {
            text.push("\n");
          } else {
            text.push(...Array.from(getTextForNodes(node.childNodes) || []));
          }
          break;
      }
    }
    return text;
  };
  var Controller2 = class extends BasicObject {
  };
  var FileVerificationOperation = class extends Operation {
    constructor(file) {
      super(...arguments);
      this.file = file;
    }
    perform(callback) {
      const reader = new FileReader();
      reader.onerror = () => callback(false);
      reader.onload = () => {
        reader.onerror = null;
        try {
          reader.abort();
        } catch (error2) {
        }
        return callback(true, this.file);
      };
      return reader.readAsArrayBuffer(this.file);
    }
  };
  var InputController = class extends BasicObject {
    constructor(element) {
      super(...arguments);
      this.element = element;
      this.mutationObserver = new MutationObserver2(this.element);
      this.mutationObserver.delegate = this;
      for (const eventName in this.constructor.events) {
        handleEvent(eventName, {
          onElement: this.element,
          withCallback: this.handlerFor(eventName)
        });
      }
    }
    elementDidMutate(mutationSummary) {
    }
    editorWillSyncDocumentView() {
      return this.mutationObserver.stop();
    }
    editorDidSyncDocumentView() {
      return this.mutationObserver.start();
    }
    requestRender() {
      var _this$delegate, _this$delegate$inputC;
      return (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$inputC = _this$delegate.inputControllerDidRequestRender) === null || _this$delegate$inputC === void 0 ? void 0 : _this$delegate$inputC.call(_this$delegate);
    }
    requestReparse() {
      var _this$delegate2, _this$delegate2$input;
      (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : (_this$delegate2$input = _this$delegate2.inputControllerDidRequestReparse) === null || _this$delegate2$input === void 0 ? void 0 : _this$delegate2$input.call(_this$delegate2);
      return this.requestRender();
    }
    attachFiles(files) {
      const operations = Array.from(files).map((file) => new FileVerificationOperation(file));
      return Promise.all(operations).then((files2) => {
        this.handleInput(function() {
          var _this$delegate3, _this$responder;
          (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 ? void 0 : _this$delegate3.inputControllerWillAttachFiles();
          (_this$responder = this.responder) === null || _this$responder === void 0 ? void 0 : _this$responder.insertFiles(files2);
          return this.requestRender();
        });
      });
    }
    handlerFor(eventName) {
      return (event) => {
        if (!event.defaultPrevented) {
          this.handleInput(() => {
            if (!innerElementIsActive(this.element)) {
              this.eventName = eventName;
              this.constructor.events[eventName].call(this, event);
            }
          });
        }
      };
    }
    handleInput(callback) {
      try {
        var _this$delegate4;
        (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 ? void 0 : _this$delegate4.inputControllerWillHandleInput();
        callback.call(this);
      } finally {
        var _this$delegate5;
        (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 ? void 0 : _this$delegate5.inputControllerDidHandleInput();
      }
    }
    createLinkHTML(href, text) {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = text ? text : href;
      return link.outerHTML;
    }
  };
  _defineProperty(InputController, "events", {});
  var _$codePointAt;
  var _;
  var {
    browser,
    keyNames: keyNames$1
  } = config;
  var pastedFileCount = 0;
  var Level0InputController = class extends InputController {
    constructor() {
      super(...arguments);
      this.resetInputSummary();
    }
    setInputSummary() {
      let summary = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      this.inputSummary.eventName = this.eventName;
      for (const key in summary) {
        const value = summary[key];
        this.inputSummary[key] = value;
      }
      return this.inputSummary;
    }
    resetInputSummary() {
      this.inputSummary = {};
    }
    reset() {
      this.resetInputSummary();
      return selectionChangeObserver.reset();
    }
    elementDidMutate(mutationSummary) {
      if (this.isComposing()) {
        var _this$delegate, _this$delegate$inputC;
        return (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$inputC = _this$delegate.inputControllerDidAllowUnhandledInput) === null || _this$delegate$inputC === void 0 ? void 0 : _this$delegate$inputC.call(_this$delegate);
      } else {
        return this.handleInput(function() {
          if (this.mutationIsSignificant(mutationSummary)) {
            if (this.mutationIsExpected(mutationSummary)) {
              this.requestRender();
            } else {
              this.requestReparse();
            }
          }
          return this.reset();
        });
      }
    }
    mutationIsExpected(_ref) {
      let {
        textAdded,
        textDeleted
      } = _ref;
      if (this.inputSummary.preferDocument) {
        return true;
      }
      const mutationAdditionMatchesSummary = textAdded != null ? textAdded === this.inputSummary.textAdded : !this.inputSummary.textAdded;
      const mutationDeletionMatchesSummary = textDeleted != null ? this.inputSummary.didDelete : !this.inputSummary.didDelete;
      const unexpectedNewlineAddition = ["\n", " \n"].includes(textAdded) && !mutationAdditionMatchesSummary;
      const unexpectedNewlineDeletion = textDeleted === "\n" && !mutationDeletionMatchesSummary;
      const singleUnexpectedNewline = unexpectedNewlineAddition && !unexpectedNewlineDeletion || unexpectedNewlineDeletion && !unexpectedNewlineAddition;
      if (singleUnexpectedNewline) {
        const range = this.getSelectedRange();
        if (range) {
          var _this$responder;
          const offset = unexpectedNewlineAddition ? textAdded.replace(/\n$/, "").length || -1 : (textAdded === null || textAdded === void 0 ? void 0 : textAdded.length) || 1;
          if ((_this$responder = this.responder) !== null && _this$responder !== void 0 && _this$responder.positionIsBlockBreak(range[1] + offset)) {
            return true;
          }
        }
      }
      return mutationAdditionMatchesSummary && mutationDeletionMatchesSummary;
    }
    mutationIsSignificant(mutationSummary) {
      var _this$compositionInpu;
      const textChanged = Object.keys(mutationSummary).length > 0;
      const composedEmptyString = ((_this$compositionInpu = this.compositionInput) === null || _this$compositionInpu === void 0 ? void 0 : _this$compositionInpu.getEndData()) === "";
      return textChanged || !composedEmptyString;
    }
    getCompositionInput() {
      if (this.isComposing()) {
        return this.compositionInput;
      } else {
        this.compositionInput = new CompositionInput(this);
      }
    }
    isComposing() {
      return this.compositionInput && !this.compositionInput.isEnded();
    }
    deleteInDirection(direction, event) {
      var _this$responder2;
      if (((_this$responder2 = this.responder) === null || _this$responder2 === void 0 ? void 0 : _this$responder2.deleteInDirection(direction)) === false) {
        if (event) {
          event.preventDefault();
          return this.requestRender();
        }
      } else {
        return this.setInputSummary({
          didDelete: true
        });
      }
    }
    serializeSelectionToDataTransfer(dataTransfer) {
      var _this$responder3;
      if (!dataTransferIsWritable(dataTransfer))
        return;
      const document2 = (_this$responder3 = this.responder) === null || _this$responder3 === void 0 ? void 0 : _this$responder3.getSelectedDocument().toSerializableDocument();
      dataTransfer.setData("application/x-trix-document", JSON.stringify(document2));
      dataTransfer.setData("text/html", DocumentView.render(document2).innerHTML);
      dataTransfer.setData("text/plain", document2.toString().replace(/\n$/, ""));
      return true;
    }
    canAcceptDataTransfer(dataTransfer) {
      const types = {};
      Array.from((dataTransfer === null || dataTransfer === void 0 ? void 0 : dataTransfer.types) || []).forEach((type) => {
        types[type] = true;
      });
      return types.Files || types["application/x-trix-document"] || types["text/html"] || types["text/plain"];
    }
    getPastedHTMLUsingHiddenElement(callback) {
      const selectedRange = this.getSelectedRange();
      const style = {
        position: "absolute",
        left: "".concat(window.pageXOffset, "px"),
        top: "".concat(window.pageYOffset, "px"),
        opacity: 0
      };
      const element = makeElement({
        style,
        tagName: "div",
        editable: true
      });
      document.body.appendChild(element);
      element.focus();
      return requestAnimationFrame(() => {
        const html2 = element.innerHTML;
        removeNode(element);
        this.setSelectedRange(selectedRange);
        return callback(html2);
      });
    }
  };
  _defineProperty(Level0InputController, "events", {
    keydown(event) {
      if (!this.isComposing()) {
        this.resetInputSummary();
      }
      this.inputSummary.didInput = true;
      const keyName = keyNames$1[event.keyCode];
      if (keyName) {
        var _context2;
        let context = this.keys;
        ["ctrl", "alt", "shift", "meta"].forEach((modifier) => {
          if (event["".concat(modifier, "Key")]) {
            var _context;
            if (modifier === "ctrl") {
              modifier = "control";
            }
            context = (_context = context) === null || _context === void 0 ? void 0 : _context[modifier];
          }
        });
        if (((_context2 = context) === null || _context2 === void 0 ? void 0 : _context2[keyName]) != null) {
          this.setInputSummary({
            keyName
          });
          selectionChangeObserver.reset();
          context[keyName].call(this, event);
        }
      }
      if (keyEventIsKeyboardCommand(event)) {
        const character = String.fromCharCode(event.keyCode).toLowerCase();
        if (character) {
          var _this$delegate3;
          const keys = ["alt", "shift"].map((modifier) => {
            if (event["".concat(modifier, "Key")]) {
              return modifier;
            }
          }).filter((key) => key);
          keys.push(character);
          if ((_this$delegate3 = this.delegate) !== null && _this$delegate3 !== void 0 && _this$delegate3.inputControllerDidReceiveKeyboardCommand(keys)) {
            event.preventDefault();
          }
        }
      }
    },
    keypress(event) {
      if (this.inputSummary.eventName != null)
        return;
      if (event.metaKey)
        return;
      if (event.ctrlKey && !event.altKey)
        return;
      const string = stringFromKeyEvent(event);
      if (string) {
        var _this$delegate4, _this$responder9;
        (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 ? void 0 : _this$delegate4.inputControllerWillPerformTyping();
        (_this$responder9 = this.responder) === null || _this$responder9 === void 0 ? void 0 : _this$responder9.insertString(string);
        return this.setInputSummary({
          textAdded: string,
          didDelete: this.selectionIsExpanded()
        });
      }
    },
    textInput(event) {
      const {
        data
      } = event;
      const {
        textAdded
      } = this.inputSummary;
      if (textAdded && textAdded !== data && textAdded.toUpperCase() === data) {
        var _this$responder10;
        const range = this.getSelectedRange();
        this.setSelectedRange([range[0], range[1] + textAdded.length]);
        (_this$responder10 = this.responder) === null || _this$responder10 === void 0 ? void 0 : _this$responder10.insertString(data);
        this.setInputSummary({
          textAdded: data
        });
        return this.setSelectedRange(range);
      }
    },
    dragenter(event) {
      event.preventDefault();
    },
    dragstart(event) {
      var _this$delegate5, _this$delegate5$input;
      this.serializeSelectionToDataTransfer(event.dataTransfer);
      this.draggedRange = this.getSelectedRange();
      return (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 ? void 0 : (_this$delegate5$input = _this$delegate5.inputControllerDidStartDrag) === null || _this$delegate5$input === void 0 ? void 0 : _this$delegate5$input.call(_this$delegate5);
    },
    dragover(event) {
      if (this.draggedRange || this.canAcceptDataTransfer(event.dataTransfer)) {
        event.preventDefault();
        const draggingPoint = {
          x: event.clientX,
          y: event.clientY
        };
        if (!objectsAreEqual(draggingPoint, this.draggingPoint)) {
          var _this$delegate6, _this$delegate6$input;
          this.draggingPoint = draggingPoint;
          return (_this$delegate6 = this.delegate) === null || _this$delegate6 === void 0 ? void 0 : (_this$delegate6$input = _this$delegate6.inputControllerDidReceiveDragOverPoint) === null || _this$delegate6$input === void 0 ? void 0 : _this$delegate6$input.call(_this$delegate6, this.draggingPoint);
        }
      }
    },
    dragend(event) {
      var _this$delegate7, _this$delegate7$input;
      (_this$delegate7 = this.delegate) === null || _this$delegate7 === void 0 ? void 0 : (_this$delegate7$input = _this$delegate7.inputControllerDidCancelDrag) === null || _this$delegate7$input === void 0 ? void 0 : _this$delegate7$input.call(_this$delegate7);
      this.draggedRange = null;
      this.draggingPoint = null;
    },
    drop(event) {
      var _event$dataTransfer, _this$responder11;
      event.preventDefault();
      const files = (_event$dataTransfer = event.dataTransfer) === null || _event$dataTransfer === void 0 ? void 0 : _event$dataTransfer.files;
      const documentJSON = event.dataTransfer.getData("application/x-trix-document");
      const point = {
        x: event.clientX,
        y: event.clientY
      };
      (_this$responder11 = this.responder) === null || _this$responder11 === void 0 ? void 0 : _this$responder11.setLocationRangeFromPointRange(point);
      if (files !== null && files !== void 0 && files.length) {
        this.attachFiles(files);
      } else if (this.draggedRange) {
        var _this$delegate8, _this$responder12;
        (_this$delegate8 = this.delegate) === null || _this$delegate8 === void 0 ? void 0 : _this$delegate8.inputControllerWillMoveText();
        (_this$responder12 = this.responder) === null || _this$responder12 === void 0 ? void 0 : _this$responder12.moveTextFromRange(this.draggedRange);
        this.draggedRange = null;
        this.requestRender();
      } else if (documentJSON) {
        var _this$responder13;
        const document2 = Document.fromJSONString(documentJSON);
        (_this$responder13 = this.responder) === null || _this$responder13 === void 0 ? void 0 : _this$responder13.insertDocument(document2);
        this.requestRender();
      }
      this.draggedRange = null;
      this.draggingPoint = null;
    },
    cut(event) {
      var _this$responder14;
      if ((_this$responder14 = this.responder) !== null && _this$responder14 !== void 0 && _this$responder14.selectionIsExpanded()) {
        var _this$delegate9;
        if (this.serializeSelectionToDataTransfer(event.clipboardData)) {
          event.preventDefault();
        }
        (_this$delegate9 = this.delegate) === null || _this$delegate9 === void 0 ? void 0 : _this$delegate9.inputControllerWillCutText();
        this.deleteInDirection("backward");
        if (event.defaultPrevented) {
          return this.requestRender();
        }
      }
    },
    copy(event) {
      var _this$responder15;
      if ((_this$responder15 = this.responder) !== null && _this$responder15 !== void 0 && _this$responder15.selectionIsExpanded()) {
        if (this.serializeSelectionToDataTransfer(event.clipboardData)) {
          event.preventDefault();
        }
      }
    },
    paste(event) {
      const clipboard = event.clipboardData || event.testClipboardData;
      const paste = {
        clipboard
      };
      if (!clipboard || pasteEventIsCrippledSafariHTMLPaste(event)) {
        this.getPastedHTMLUsingHiddenElement((html3) => {
          var _this$delegate10, _this$responder16, _this$delegate11;
          paste.type = "text/html";
          paste.html = html3;
          (_this$delegate10 = this.delegate) === null || _this$delegate10 === void 0 ? void 0 : _this$delegate10.inputControllerWillPaste(paste);
          (_this$responder16 = this.responder) === null || _this$responder16 === void 0 ? void 0 : _this$responder16.insertHTML(paste.html);
          this.requestRender();
          return (_this$delegate11 = this.delegate) === null || _this$delegate11 === void 0 ? void 0 : _this$delegate11.inputControllerDidPaste(paste);
        });
        return;
      }
      const href = clipboard.getData("URL");
      const html2 = clipboard.getData("text/html");
      const name = clipboard.getData("public.url-name");
      if (href) {
        var _this$delegate12, _this$responder17, _this$delegate13;
        let string;
        paste.type = "text/html";
        if (name) {
          string = squishBreakableWhitespace(name).trim();
        } else {
          string = href;
        }
        paste.html = this.createLinkHTML(href, string);
        (_this$delegate12 = this.delegate) === null || _this$delegate12 === void 0 ? void 0 : _this$delegate12.inputControllerWillPaste(paste);
        this.setInputSummary({
          textAdded: string,
          didDelete: this.selectionIsExpanded()
        });
        (_this$responder17 = this.responder) === null || _this$responder17 === void 0 ? void 0 : _this$responder17.insertHTML(paste.html);
        this.requestRender();
        (_this$delegate13 = this.delegate) === null || _this$delegate13 === void 0 ? void 0 : _this$delegate13.inputControllerDidPaste(paste);
      } else if (dataTransferIsPlainText(clipboard)) {
        var _this$delegate14, _this$responder18, _this$delegate15;
        paste.type = "text/plain";
        paste.string = clipboard.getData("text/plain");
        (_this$delegate14 = this.delegate) === null || _this$delegate14 === void 0 ? void 0 : _this$delegate14.inputControllerWillPaste(paste);
        this.setInputSummary({
          textAdded: paste.string,
          didDelete: this.selectionIsExpanded()
        });
        (_this$responder18 = this.responder) === null || _this$responder18 === void 0 ? void 0 : _this$responder18.insertString(paste.string);
        this.requestRender();
        (_this$delegate15 = this.delegate) === null || _this$delegate15 === void 0 ? void 0 : _this$delegate15.inputControllerDidPaste(paste);
      } else if (html2) {
        var _this$delegate16, _this$responder19, _this$delegate17;
        paste.type = "text/html";
        paste.html = html2;
        (_this$delegate16 = this.delegate) === null || _this$delegate16 === void 0 ? void 0 : _this$delegate16.inputControllerWillPaste(paste);
        (_this$responder19 = this.responder) === null || _this$responder19 === void 0 ? void 0 : _this$responder19.insertHTML(paste.html);
        this.requestRender();
        (_this$delegate17 = this.delegate) === null || _this$delegate17 === void 0 ? void 0 : _this$delegate17.inputControllerDidPaste(paste);
      } else if (Array.from(clipboard.types).includes("Files")) {
        var _clipboard$items, _clipboard$items$, _clipboard$items$$get;
        const file = (_clipboard$items = clipboard.items) === null || _clipboard$items === void 0 ? void 0 : (_clipboard$items$ = _clipboard$items[0]) === null || _clipboard$items$ === void 0 ? void 0 : (_clipboard$items$$get = _clipboard$items$.getAsFile) === null || _clipboard$items$$get === void 0 ? void 0 : _clipboard$items$$get.call(_clipboard$items$);
        if (file) {
          var _this$delegate18, _this$responder20, _this$delegate19;
          const extension = extensionForFile(file);
          if (!file.name && extension) {
            file.name = "pasted-file-".concat(++pastedFileCount, ".").concat(extension);
          }
          paste.type = "File";
          paste.file = file;
          (_this$delegate18 = this.delegate) === null || _this$delegate18 === void 0 ? void 0 : _this$delegate18.inputControllerWillAttachFiles();
          (_this$responder20 = this.responder) === null || _this$responder20 === void 0 ? void 0 : _this$responder20.insertFile(paste.file);
          this.requestRender();
          (_this$delegate19 = this.delegate) === null || _this$delegate19 === void 0 ? void 0 : _this$delegate19.inputControllerDidPaste(paste);
        }
      }
      event.preventDefault();
    },
    compositionstart(event) {
      return this.getCompositionInput().start(event.data);
    },
    compositionupdate(event) {
      return this.getCompositionInput().update(event.data);
    },
    compositionend(event) {
      return this.getCompositionInput().end(event.data);
    },
    beforeinput(event) {
      this.inputSummary.didInput = true;
    },
    input(event) {
      this.inputSummary.didInput = true;
      return event.stopPropagation();
    }
  });
  _defineProperty(Level0InputController, "keys", {
    backspace(event) {
      var _this$delegate20;
      (_this$delegate20 = this.delegate) === null || _this$delegate20 === void 0 ? void 0 : _this$delegate20.inputControllerWillPerformTyping();
      return this.deleteInDirection("backward", event);
    },
    delete(event) {
      var _this$delegate21;
      (_this$delegate21 = this.delegate) === null || _this$delegate21 === void 0 ? void 0 : _this$delegate21.inputControllerWillPerformTyping();
      return this.deleteInDirection("forward", event);
    },
    return(event) {
      var _this$delegate22, _this$responder21;
      this.setInputSummary({
        preferDocument: true
      });
      (_this$delegate22 = this.delegate) === null || _this$delegate22 === void 0 ? void 0 : _this$delegate22.inputControllerWillPerformTyping();
      return (_this$responder21 = this.responder) === null || _this$responder21 === void 0 ? void 0 : _this$responder21.insertLineBreak();
    },
    tab(event) {
      var _this$responder22;
      if ((_this$responder22 = this.responder) !== null && _this$responder22 !== void 0 && _this$responder22.canIncreaseNestingLevel()) {
        var _this$responder23;
        (_this$responder23 = this.responder) === null || _this$responder23 === void 0 ? void 0 : _this$responder23.increaseNestingLevel();
        this.requestRender();
        event.preventDefault();
      }
    },
    left(event) {
      if (this.selectionIsInCursorTarget()) {
        var _this$responder24;
        event.preventDefault();
        return (_this$responder24 = this.responder) === null || _this$responder24 === void 0 ? void 0 : _this$responder24.moveCursorInDirection("backward");
      }
    },
    right(event) {
      if (this.selectionIsInCursorTarget()) {
        var _this$responder25;
        event.preventDefault();
        return (_this$responder25 = this.responder) === null || _this$responder25 === void 0 ? void 0 : _this$responder25.moveCursorInDirection("forward");
      }
    },
    control: {
      d(event) {
        var _this$delegate23;
        (_this$delegate23 = this.delegate) === null || _this$delegate23 === void 0 ? void 0 : _this$delegate23.inputControllerWillPerformTyping();
        return this.deleteInDirection("forward", event);
      },
      h(event) {
        var _this$delegate24;
        (_this$delegate24 = this.delegate) === null || _this$delegate24 === void 0 ? void 0 : _this$delegate24.inputControllerWillPerformTyping();
        return this.deleteInDirection("backward", event);
      },
      o(event) {
        var _this$delegate25, _this$responder26;
        event.preventDefault();
        (_this$delegate25 = this.delegate) === null || _this$delegate25 === void 0 ? void 0 : _this$delegate25.inputControllerWillPerformTyping();
        (_this$responder26 = this.responder) === null || _this$responder26 === void 0 ? void 0 : _this$responder26.insertString("\n", {
          updatePosition: false
        });
        return this.requestRender();
      }
    },
    shift: {
      return(event) {
        var _this$delegate26, _this$responder27;
        (_this$delegate26 = this.delegate) === null || _this$delegate26 === void 0 ? void 0 : _this$delegate26.inputControllerWillPerformTyping();
        (_this$responder27 = this.responder) === null || _this$responder27 === void 0 ? void 0 : _this$responder27.insertString("\n");
        this.requestRender();
        event.preventDefault();
      },
      tab(event) {
        var _this$responder28;
        if ((_this$responder28 = this.responder) !== null && _this$responder28 !== void 0 && _this$responder28.canDecreaseNestingLevel()) {
          var _this$responder29;
          (_this$responder29 = this.responder) === null || _this$responder29 === void 0 ? void 0 : _this$responder29.decreaseNestingLevel();
          this.requestRender();
          event.preventDefault();
        }
      },
      left(event) {
        if (this.selectionIsInCursorTarget()) {
          event.preventDefault();
          return this.expandSelectionInDirection("backward");
        }
      },
      right(event) {
        if (this.selectionIsInCursorTarget()) {
          event.preventDefault();
          return this.expandSelectionInDirection("forward");
        }
      }
    },
    alt: {
      backspace(event) {
        var _this$delegate27;
        this.setInputSummary({
          preferDocument: false
        });
        return (_this$delegate27 = this.delegate) === null || _this$delegate27 === void 0 ? void 0 : _this$delegate27.inputControllerWillPerformTyping();
      }
    },
    meta: {
      backspace(event) {
        var _this$delegate28;
        this.setInputSummary({
          preferDocument: false
        });
        return (_this$delegate28 = this.delegate) === null || _this$delegate28 === void 0 ? void 0 : _this$delegate28.inputControllerWillPerformTyping();
      }
    }
  });
  Level0InputController.proxyMethod("responder?.getSelectedRange");
  Level0InputController.proxyMethod("responder?.setSelectedRange");
  Level0InputController.proxyMethod("responder?.expandSelectionInDirection");
  Level0InputController.proxyMethod("responder?.selectionIsInCursorTarget");
  Level0InputController.proxyMethod("responder?.selectionIsExpanded");
  var extensionForFile = (file) => {
    var _file$type, _file$type$match;
    return (_file$type = file.type) === null || _file$type === void 0 ? void 0 : (_file$type$match = _file$type.match(/\/(\w+)$/)) === null || _file$type$match === void 0 ? void 0 : _file$type$match[1];
  };
  var hasStringCodePointAt = !!((_$codePointAt = (_ = " ").codePointAt) !== null && _$codePointAt !== void 0 && _$codePointAt.call(_, 0));
  var stringFromKeyEvent = function(event) {
    if (event.key && hasStringCodePointAt && event.key.codePointAt(0) === event.keyCode) {
      return event.key;
    } else {
      let code;
      if (event.which === null) {
        code = event.keyCode;
      } else if (event.which !== 0 && event.charCode !== 0) {
        code = event.charCode;
      }
      if (code != null && keyNames$1[code] !== "escape") {
        return UTF16String.fromCodepoints([code]).toString();
      }
    }
  };
  var pasteEventIsCrippledSafariHTMLPaste = function(event) {
    const paste = event.clipboardData;
    if (paste) {
      if (paste.types.includes("text/html")) {
        for (const type of paste.types) {
          const hasPasteboardFlavor = /^CorePasteboardFlavorType/.test(type);
          const hasReadableDynamicData = /^dyn\./.test(type) && paste.getData(type);
          const mightBePasteAndMatchStyle = hasPasteboardFlavor || hasReadableDynamicData;
          if (mightBePasteAndMatchStyle) {
            return true;
          }
        }
        return false;
      } else {
        const isExternalHTMLPaste = paste.types.includes("com.apple.webarchive");
        const isExternalRichTextPaste = paste.types.includes("com.apple.flat-rtfd");
        return isExternalHTMLPaste || isExternalRichTextPaste;
      }
    }
  };
  var CompositionInput = class extends BasicObject {
    constructor(inputController) {
      super(...arguments);
      this.inputController = inputController;
      this.responder = this.inputController.responder;
      this.delegate = this.inputController.delegate;
      this.inputSummary = this.inputController.inputSummary;
      this.data = {};
    }
    start(data) {
      this.data.start = data;
      if (this.isSignificant()) {
        var _this$responder5;
        if (this.inputSummary.eventName === "keypress" && this.inputSummary.textAdded) {
          var _this$responder4;
          (_this$responder4 = this.responder) === null || _this$responder4 === void 0 ? void 0 : _this$responder4.deleteInDirection("left");
        }
        if (!this.selectionIsExpanded()) {
          this.insertPlaceholder();
          this.requestRender();
        }
        this.range = (_this$responder5 = this.responder) === null || _this$responder5 === void 0 ? void 0 : _this$responder5.getSelectedRange();
      }
    }
    update(data) {
      this.data.update = data;
      if (this.isSignificant()) {
        const range = this.selectPlaceholder();
        if (range) {
          this.forgetPlaceholder();
          this.range = range;
        }
      }
    }
    end(data) {
      this.data.end = data;
      if (this.isSignificant()) {
        this.forgetPlaceholder();
        if (this.canApplyToDocument()) {
          var _this$delegate2, _this$responder6, _this$responder7, _this$responder8;
          this.setInputSummary({
            preferDocument: true,
            didInput: false
          });
          (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : _this$delegate2.inputControllerWillPerformTyping();
          (_this$responder6 = this.responder) === null || _this$responder6 === void 0 ? void 0 : _this$responder6.setSelectedRange(this.range);
          (_this$responder7 = this.responder) === null || _this$responder7 === void 0 ? void 0 : _this$responder7.insertString(this.data.end);
          return (_this$responder8 = this.responder) === null || _this$responder8 === void 0 ? void 0 : _this$responder8.setSelectedRange(this.range[0] + this.data.end.length);
        } else if (this.data.start != null || this.data.update != null) {
          this.requestReparse();
          return this.inputController.reset();
        }
      } else {
        return this.inputController.reset();
      }
    }
    getEndData() {
      return this.data.end;
    }
    isEnded() {
      return this.getEndData() != null;
    }
    isSignificant() {
      if (browser.composesExistingText) {
        return this.inputSummary.didInput;
      } else {
        return true;
      }
    }
    canApplyToDocument() {
      var _this$data$start, _this$data$end;
      return ((_this$data$start = this.data.start) === null || _this$data$start === void 0 ? void 0 : _this$data$start.length) === 0 && ((_this$data$end = this.data.end) === null || _this$data$end === void 0 ? void 0 : _this$data$end.length) > 0 && this.range;
    }
  };
  CompositionInput.proxyMethod("inputController.setInputSummary");
  CompositionInput.proxyMethod("inputController.requestRender");
  CompositionInput.proxyMethod("inputController.requestReparse");
  CompositionInput.proxyMethod("responder?.selectionIsExpanded");
  CompositionInput.proxyMethod("responder?.insertPlaceholder");
  CompositionInput.proxyMethod("responder?.selectPlaceholder");
  CompositionInput.proxyMethod("responder?.forgetPlaceholder");
  var Level2InputController = class extends InputController {
    constructor() {
      super(...arguments);
      this.render = this.render.bind(this);
    }
    elementDidMutate() {
      if (this.scheduledRender) {
        if (this.composing) {
          var _this$delegate, _this$delegate$inputC;
          return (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$inputC = _this$delegate.inputControllerDidAllowUnhandledInput) === null || _this$delegate$inputC === void 0 ? void 0 : _this$delegate$inputC.call(_this$delegate);
        }
      } else {
        return this.reparse();
      }
    }
    scheduleRender() {
      return this.scheduledRender ? this.scheduledRender : this.scheduledRender = requestAnimationFrame(this.render);
    }
    render() {
      var _this$afterRender;
      cancelAnimationFrame(this.scheduledRender);
      this.scheduledRender = null;
      if (!this.composing) {
        var _this$delegate2;
        (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : _this$delegate2.render();
      }
      (_this$afterRender = this.afterRender) === null || _this$afterRender === void 0 ? void 0 : _this$afterRender.call(this);
      this.afterRender = null;
    }
    reparse() {
      var _this$delegate3;
      return (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 ? void 0 : _this$delegate3.reparse();
    }
    insertString() {
      var _this$delegate4;
      let string = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      let options2 = arguments.length > 1 ? arguments[1] : void 0;
      (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 ? void 0 : _this$delegate4.inputControllerWillPerformTyping();
      return this.withTargetDOMRange(function() {
        var _this$responder;
        return (_this$responder = this.responder) === null || _this$responder === void 0 ? void 0 : _this$responder.insertString(string, options2);
      });
    }
    toggleAttributeIfSupported(attributeName) {
      if (getAllAttributeNames().includes(attributeName)) {
        var _this$delegate5;
        (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 ? void 0 : _this$delegate5.inputControllerWillPerformFormatting(attributeName);
        return this.withTargetDOMRange(function() {
          var _this$responder2;
          return (_this$responder2 = this.responder) === null || _this$responder2 === void 0 ? void 0 : _this$responder2.toggleCurrentAttribute(attributeName);
        });
      }
    }
    activateAttributeIfSupported(attributeName, value) {
      if (getAllAttributeNames().includes(attributeName)) {
        var _this$delegate6;
        (_this$delegate6 = this.delegate) === null || _this$delegate6 === void 0 ? void 0 : _this$delegate6.inputControllerWillPerformFormatting(attributeName);
        return this.withTargetDOMRange(function() {
          var _this$responder3;
          return (_this$responder3 = this.responder) === null || _this$responder3 === void 0 ? void 0 : _this$responder3.setCurrentAttribute(attributeName, value);
        });
      }
    }
    deleteInDirection(direction) {
      let {
        recordUndoEntry
      } = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
        recordUndoEntry: true
      };
      if (recordUndoEntry) {
        var _this$delegate7;
        (_this$delegate7 = this.delegate) === null || _this$delegate7 === void 0 ? void 0 : _this$delegate7.inputControllerWillPerformTyping();
      }
      const perform = () => {
        var _this$responder4;
        return (_this$responder4 = this.responder) === null || _this$responder4 === void 0 ? void 0 : _this$responder4.deleteInDirection(direction);
      };
      const domRange = this.getTargetDOMRange({
        minLength: 2
      });
      if (domRange) {
        return this.withTargetDOMRange(domRange, perform);
      } else {
        return perform();
      }
    }
    withTargetDOMRange(domRange, fn) {
      if (typeof domRange === "function") {
        fn = domRange;
        domRange = this.getTargetDOMRange();
      }
      if (domRange) {
        var _this$responder5;
        return (_this$responder5 = this.responder) === null || _this$responder5 === void 0 ? void 0 : _this$responder5.withTargetDOMRange(domRange, fn.bind(this));
      } else {
        selectionChangeObserver.reset();
        return fn.call(this);
      }
    }
    getTargetDOMRange() {
      var _this$event$getTarget, _this$event;
      let {
        minLength
      } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        minLength: 0
      };
      const targetRanges = (_this$event$getTarget = (_this$event = this.event).getTargetRanges) === null || _this$event$getTarget === void 0 ? void 0 : _this$event$getTarget.call(_this$event);
      if (targetRanges) {
        if (targetRanges.length) {
          const domRange = staticRangeToRange(targetRanges[0]);
          if (minLength === 0 || domRange.toString().length >= minLength) {
            return domRange;
          }
        }
      }
    }
    withEvent(event, fn) {
      let result;
      this.event = event;
      try {
        result = fn.call(this);
      } finally {
        this.event = null;
      }
      return result;
    }
  };
  _defineProperty(Level2InputController, "events", {
    keydown(event) {
      if (keyEventIsKeyboardCommand(event)) {
        var _this$delegate8;
        const command = keyboardCommandFromKeyEvent(event);
        if ((_this$delegate8 = this.delegate) !== null && _this$delegate8 !== void 0 && _this$delegate8.inputControllerDidReceiveKeyboardCommand(command)) {
          event.preventDefault();
        }
      } else {
        let name = event.key;
        if (event.altKey) {
          name += "+Alt";
        }
        if (event.shiftKey) {
          name += "+Shift";
        }
        const handler = this.constructor.keys[name];
        if (handler) {
          return this.withEvent(event, handler);
        }
      }
    },
    paste(event) {
      var _event$clipboardData;
      let paste;
      const href = (_event$clipboardData = event.clipboardData) === null || _event$clipboardData === void 0 ? void 0 : _event$clipboardData.getData("URL");
      if (pasteEventHasFilesOnly(event)) {
        event.preventDefault();
        return this.attachFiles(event.clipboardData.files);
      } else if (pasteEventHasPlainTextOnly(event)) {
        var _this$delegate9, _this$responder6, _this$delegate10;
        event.preventDefault();
        paste = {
          type: "text/plain",
          string: event.clipboardData.getData("text/plain")
        };
        (_this$delegate9 = this.delegate) === null || _this$delegate9 === void 0 ? void 0 : _this$delegate9.inputControllerWillPaste(paste);
        (_this$responder6 = this.responder) === null || _this$responder6 === void 0 ? void 0 : _this$responder6.insertString(paste.string);
        this.render();
        return (_this$delegate10 = this.delegate) === null || _this$delegate10 === void 0 ? void 0 : _this$delegate10.inputControllerDidPaste(paste);
      } else if (href) {
        var _this$delegate11, _this$responder7, _this$delegate12;
        event.preventDefault();
        paste = {
          type: "text/html",
          html: this.createLinkHTML(href)
        };
        (_this$delegate11 = this.delegate) === null || _this$delegate11 === void 0 ? void 0 : _this$delegate11.inputControllerWillPaste(paste);
        (_this$responder7 = this.responder) === null || _this$responder7 === void 0 ? void 0 : _this$responder7.insertHTML(paste.html);
        this.render();
        return (_this$delegate12 = this.delegate) === null || _this$delegate12 === void 0 ? void 0 : _this$delegate12.inputControllerDidPaste(paste);
      }
    },
    beforeinput(event) {
      const handler = this.constructor.inputTypes[event.inputType];
      if (handler) {
        this.withEvent(event, handler);
        return this.scheduleRender();
      }
    },
    input(event) {
      return selectionChangeObserver.reset();
    },
    dragstart(event) {
      var _this$responder8;
      if ((_this$responder8 = this.responder) !== null && _this$responder8 !== void 0 && _this$responder8.selectionContainsAttachments()) {
        var _this$responder9;
        event.dataTransfer.setData("application/x-trix-dragging", true);
        this.dragging = {
          range: (_this$responder9 = this.responder) === null || _this$responder9 === void 0 ? void 0 : _this$responder9.getSelectedRange(),
          point: pointFromEvent(event)
        };
      }
    },
    dragenter(event) {
      if (dragEventHasFiles(event)) {
        event.preventDefault();
      }
    },
    dragover(event) {
      if (this.dragging) {
        event.preventDefault();
        const point = pointFromEvent(event);
        if (!objectsAreEqual(point, this.dragging.point)) {
          var _this$responder10;
          this.dragging.point = point;
          return (_this$responder10 = this.responder) === null || _this$responder10 === void 0 ? void 0 : _this$responder10.setLocationRangeFromPointRange(point);
        }
      } else if (dragEventHasFiles(event)) {
        event.preventDefault();
      }
    },
    drop(event) {
      if (this.dragging) {
        var _this$delegate13, _this$responder11;
        event.preventDefault();
        (_this$delegate13 = this.delegate) === null || _this$delegate13 === void 0 ? void 0 : _this$delegate13.inputControllerWillMoveText();
        (_this$responder11 = this.responder) === null || _this$responder11 === void 0 ? void 0 : _this$responder11.moveTextFromRange(this.dragging.range);
        this.dragging = null;
        return this.scheduleRender();
      } else if (dragEventHasFiles(event)) {
        var _this$responder12;
        event.preventDefault();
        const point = pointFromEvent(event);
        (_this$responder12 = this.responder) === null || _this$responder12 === void 0 ? void 0 : _this$responder12.setLocationRangeFromPointRange(point);
        return this.attachFiles(event.dataTransfer.files);
      }
    },
    dragend() {
      if (this.dragging) {
        var _this$responder13;
        (_this$responder13 = this.responder) === null || _this$responder13 === void 0 ? void 0 : _this$responder13.setSelectedRange(this.dragging.range);
        this.dragging = null;
      }
    },
    compositionend(event) {
      if (this.composing) {
        this.composing = false;
        return this.scheduleRender();
      }
    }
  });
  _defineProperty(Level2InputController, "keys", {
    ArrowLeft() {
      var _this$responder14;
      if ((_this$responder14 = this.responder) !== null && _this$responder14 !== void 0 && _this$responder14.shouldManageMovingCursorInDirection("backward")) {
        var _this$responder15;
        this.event.preventDefault();
        return (_this$responder15 = this.responder) === null || _this$responder15 === void 0 ? void 0 : _this$responder15.moveCursorInDirection("backward");
      }
    },
    ArrowRight() {
      var _this$responder16;
      if ((_this$responder16 = this.responder) !== null && _this$responder16 !== void 0 && _this$responder16.shouldManageMovingCursorInDirection("forward")) {
        var _this$responder17;
        this.event.preventDefault();
        return (_this$responder17 = this.responder) === null || _this$responder17 === void 0 ? void 0 : _this$responder17.moveCursorInDirection("forward");
      }
    },
    Backspace() {
      var _this$responder18;
      if ((_this$responder18 = this.responder) !== null && _this$responder18 !== void 0 && _this$responder18.shouldManageDeletingInDirection("backward")) {
        var _this$delegate14, _this$responder19;
        this.event.preventDefault();
        (_this$delegate14 = this.delegate) === null || _this$delegate14 === void 0 ? void 0 : _this$delegate14.inputControllerWillPerformTyping();
        (_this$responder19 = this.responder) === null || _this$responder19 === void 0 ? void 0 : _this$responder19.deleteInDirection("backward");
        return this.render();
      }
    },
    Tab() {
      var _this$responder20;
      if ((_this$responder20 = this.responder) !== null && _this$responder20 !== void 0 && _this$responder20.canIncreaseNestingLevel()) {
        var _this$responder21;
        this.event.preventDefault();
        (_this$responder21 = this.responder) === null || _this$responder21 === void 0 ? void 0 : _this$responder21.increaseNestingLevel();
        return this.render();
      }
    },
    "Tab+Shift"() {
      var _this$responder22;
      if ((_this$responder22 = this.responder) !== null && _this$responder22 !== void 0 && _this$responder22.canDecreaseNestingLevel()) {
        var _this$responder23;
        this.event.preventDefault();
        (_this$responder23 = this.responder) === null || _this$responder23 === void 0 ? void 0 : _this$responder23.decreaseNestingLevel();
        return this.render();
      }
    }
  });
  _defineProperty(Level2InputController, "inputTypes", {
    deleteByComposition() {
      return this.deleteInDirection("backward", {
        recordUndoEntry: false
      });
    },
    deleteByCut() {
      return this.deleteInDirection("backward");
    },
    deleteByDrag() {
      this.event.preventDefault();
      return this.withTargetDOMRange(function() {
        var _this$responder24;
        this.deleteByDragRange = (_this$responder24 = this.responder) === null || _this$responder24 === void 0 ? void 0 : _this$responder24.getSelectedRange();
      });
    },
    deleteCompositionText() {
      return this.deleteInDirection("backward", {
        recordUndoEntry: false
      });
    },
    deleteContent() {
      return this.deleteInDirection("backward");
    },
    deleteContentBackward() {
      return this.deleteInDirection("backward");
    },
    deleteContentForward() {
      return this.deleteInDirection("forward");
    },
    deleteEntireSoftLine() {
      return this.deleteInDirection("forward");
    },
    deleteHardLineBackward() {
      return this.deleteInDirection("backward");
    },
    deleteHardLineForward() {
      return this.deleteInDirection("forward");
    },
    deleteSoftLineBackward() {
      return this.deleteInDirection("backward");
    },
    deleteSoftLineForward() {
      return this.deleteInDirection("forward");
    },
    deleteWordBackward() {
      return this.deleteInDirection("backward");
    },
    deleteWordForward() {
      return this.deleteInDirection("forward");
    },
    formatBackColor() {
      return this.activateAttributeIfSupported("backgroundColor", this.event.data);
    },
    formatBold() {
      return this.toggleAttributeIfSupported("bold");
    },
    formatFontColor() {
      return this.activateAttributeIfSupported("color", this.event.data);
    },
    formatFontName() {
      return this.activateAttributeIfSupported("font", this.event.data);
    },
    formatIndent() {
      var _this$responder25;
      if ((_this$responder25 = this.responder) !== null && _this$responder25 !== void 0 && _this$responder25.canIncreaseNestingLevel()) {
        return this.withTargetDOMRange(function() {
          var _this$responder26;
          return (_this$responder26 = this.responder) === null || _this$responder26 === void 0 ? void 0 : _this$responder26.increaseNestingLevel();
        });
      }
    },
    formatItalic() {
      return this.toggleAttributeIfSupported("italic");
    },
    formatJustifyCenter() {
      return this.toggleAttributeIfSupported("justifyCenter");
    },
    formatJustifyFull() {
      return this.toggleAttributeIfSupported("justifyFull");
    },
    formatJustifyLeft() {
      return this.toggleAttributeIfSupported("justifyLeft");
    },
    formatJustifyRight() {
      return this.toggleAttributeIfSupported("justifyRight");
    },
    formatOutdent() {
      var _this$responder27;
      if ((_this$responder27 = this.responder) !== null && _this$responder27 !== void 0 && _this$responder27.canDecreaseNestingLevel()) {
        return this.withTargetDOMRange(function() {
          var _this$responder28;
          return (_this$responder28 = this.responder) === null || _this$responder28 === void 0 ? void 0 : _this$responder28.decreaseNestingLevel();
        });
      }
    },
    formatRemove() {
      this.withTargetDOMRange(function() {
        for (const attributeName in (_this$responder29 = this.responder) === null || _this$responder29 === void 0 ? void 0 : _this$responder29.getCurrentAttributes()) {
          var _this$responder29, _this$responder30;
          (_this$responder30 = this.responder) === null || _this$responder30 === void 0 ? void 0 : _this$responder30.removeCurrentAttribute(attributeName);
        }
      });
    },
    formatSetBlockTextDirection() {
      return this.activateAttributeIfSupported("blockDir", this.event.data);
    },
    formatSetInlineTextDirection() {
      return this.activateAttributeIfSupported("textDir", this.event.data);
    },
    formatStrikeThrough() {
      return this.toggleAttributeIfSupported("strike");
    },
    formatSubscript() {
      return this.toggleAttributeIfSupported("sub");
    },
    formatSuperscript() {
      return this.toggleAttributeIfSupported("sup");
    },
    formatUnderline() {
      return this.toggleAttributeIfSupported("underline");
    },
    historyRedo() {
      var _this$delegate15;
      return (_this$delegate15 = this.delegate) === null || _this$delegate15 === void 0 ? void 0 : _this$delegate15.inputControllerWillPerformRedo();
    },
    historyUndo() {
      var _this$delegate16;
      return (_this$delegate16 = this.delegate) === null || _this$delegate16 === void 0 ? void 0 : _this$delegate16.inputControllerWillPerformUndo();
    },
    insertCompositionText() {
      this.composing = true;
      return this.insertString(this.event.data);
    },
    insertFromComposition() {
      this.composing = false;
      return this.insertString(this.event.data);
    },
    insertFromDrop() {
      const range = this.deleteByDragRange;
      if (range) {
        var _this$delegate17;
        this.deleteByDragRange = null;
        (_this$delegate17 = this.delegate) === null || _this$delegate17 === void 0 ? void 0 : _this$delegate17.inputControllerWillMoveText();
        return this.withTargetDOMRange(function() {
          var _this$responder31;
          return (_this$responder31 = this.responder) === null || _this$responder31 === void 0 ? void 0 : _this$responder31.moveTextFromRange(range);
        });
      }
    },
    insertFromPaste() {
      var _dataTransfer$files;
      const {
        dataTransfer
      } = this.event;
      const paste = {
        dataTransfer
      };
      const href = dataTransfer.getData("URL");
      const html2 = dataTransfer.getData("text/html");
      if (href) {
        var _this$delegate18;
        let string;
        this.event.preventDefault();
        paste.type = "text/html";
        const name = dataTransfer.getData("public.url-name");
        if (name) {
          string = squishBreakableWhitespace(name).trim();
        } else {
          string = href;
        }
        paste.html = this.createLinkHTML(href, string);
        (_this$delegate18 = this.delegate) === null || _this$delegate18 === void 0 ? void 0 : _this$delegate18.inputControllerWillPaste(paste);
        this.withTargetDOMRange(function() {
          var _this$responder32;
          return (_this$responder32 = this.responder) === null || _this$responder32 === void 0 ? void 0 : _this$responder32.insertHTML(paste.html);
        });
        this.afterRender = () => {
          var _this$delegate19;
          return (_this$delegate19 = this.delegate) === null || _this$delegate19 === void 0 ? void 0 : _this$delegate19.inputControllerDidPaste(paste);
        };
      } else if (dataTransferIsPlainText(dataTransfer)) {
        var _this$delegate20;
        paste.type = "text/plain";
        paste.string = dataTransfer.getData("text/plain");
        (_this$delegate20 = this.delegate) === null || _this$delegate20 === void 0 ? void 0 : _this$delegate20.inputControllerWillPaste(paste);
        this.withTargetDOMRange(function() {
          var _this$responder33;
          return (_this$responder33 = this.responder) === null || _this$responder33 === void 0 ? void 0 : _this$responder33.insertString(paste.string);
        });
        this.afterRender = () => {
          var _this$delegate21;
          return (_this$delegate21 = this.delegate) === null || _this$delegate21 === void 0 ? void 0 : _this$delegate21.inputControllerDidPaste(paste);
        };
      } else if (html2) {
        var _this$delegate22;
        this.event.preventDefault();
        paste.type = "text/html";
        paste.html = html2;
        (_this$delegate22 = this.delegate) === null || _this$delegate22 === void 0 ? void 0 : _this$delegate22.inputControllerWillPaste(paste);
        this.withTargetDOMRange(function() {
          var _this$responder34;
          return (_this$responder34 = this.responder) === null || _this$responder34 === void 0 ? void 0 : _this$responder34.insertHTML(paste.html);
        });
        this.afterRender = () => {
          var _this$delegate23;
          return (_this$delegate23 = this.delegate) === null || _this$delegate23 === void 0 ? void 0 : _this$delegate23.inputControllerDidPaste(paste);
        };
      } else if ((_dataTransfer$files = dataTransfer.files) !== null && _dataTransfer$files !== void 0 && _dataTransfer$files.length) {
        var _this$delegate24;
        paste.type = "File";
        paste.file = dataTransfer.files[0];
        (_this$delegate24 = this.delegate) === null || _this$delegate24 === void 0 ? void 0 : _this$delegate24.inputControllerWillPaste(paste);
        this.withTargetDOMRange(function() {
          var _this$responder35;
          return (_this$responder35 = this.responder) === null || _this$responder35 === void 0 ? void 0 : _this$responder35.insertFile(paste.file);
        });
        this.afterRender = () => {
          var _this$delegate25;
          return (_this$delegate25 = this.delegate) === null || _this$delegate25 === void 0 ? void 0 : _this$delegate25.inputControllerDidPaste(paste);
        };
      }
    },
    insertFromYank() {
      return this.insertString(this.event.data);
    },
    insertLineBreak() {
      return this.insertString("\n");
    },
    insertLink() {
      return this.activateAttributeIfSupported("href", this.event.data);
    },
    insertOrderedList() {
      return this.toggleAttributeIfSupported("number");
    },
    insertParagraph() {
      var _this$delegate26;
      (_this$delegate26 = this.delegate) === null || _this$delegate26 === void 0 ? void 0 : _this$delegate26.inputControllerWillPerformTyping();
      return this.withTargetDOMRange(function() {
        var _this$responder36;
        return (_this$responder36 = this.responder) === null || _this$responder36 === void 0 ? void 0 : _this$responder36.insertLineBreak();
      });
    },
    insertReplacementText() {
      return this.insertString(this.event.dataTransfer.getData("text/plain"), {
        updatePosition: false
      });
    },
    insertText() {
      var _this$event$dataTrans;
      return this.insertString(this.event.data || ((_this$event$dataTrans = this.event.dataTransfer) === null || _this$event$dataTrans === void 0 ? void 0 : _this$event$dataTrans.getData("text/plain")));
    },
    insertTranspose() {
      return this.insertString(this.event.data);
    },
    insertUnorderedList() {
      return this.toggleAttributeIfSupported("bullet");
    }
  });
  var staticRangeToRange = function(staticRange) {
    const range = document.createRange();
    range.setStart(staticRange.startContainer, staticRange.startOffset);
    range.setEnd(staticRange.endContainer, staticRange.endOffset);
    return range;
  };
  var dragEventHasFiles = (event) => {
    var _event$dataTransfer;
    return Array.from(((_event$dataTransfer = event.dataTransfer) === null || _event$dataTransfer === void 0 ? void 0 : _event$dataTransfer.types) || []).includes("Files");
  };
  var pasteEventHasFilesOnly = function(event) {
    const clipboard = event.clipboardData;
    if (clipboard) {
      return clipboard.types.includes("Files") && clipboard.types.length === 1 && clipboard.files.length >= 1;
    }
  };
  var pasteEventHasPlainTextOnly = function(event) {
    const clipboard = event.clipboardData;
    if (clipboard) {
      return clipboard.types.includes("text/plain") && clipboard.types.length === 1;
    }
  };
  var keyboardCommandFromKeyEvent = function(event) {
    const command = [];
    if (event.altKey) {
      command.push("alt");
    }
    if (event.shiftKey) {
      command.push("shift");
    }
    command.push(event.key);
    return command;
  };
  var pointFromEvent = (event) => ({
    x: event.clientX,
    y: event.clientY
  });
  var {
    lang,
    css,
    keyNames
  } = config;
  var undoable = function(fn) {
    return function() {
      const commands = fn.apply(this, arguments);
      commands.do();
      if (!this.undos) {
        this.undos = [];
      }
      this.undos.push(commands.undo);
    };
  };
  var AttachmentEditorController = class extends BasicObject {
    constructor(attachmentPiece, _element, container) {
      let options2 = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {};
      super(...arguments);
      _defineProperty(this, "makeElementMutable", undoable(() => {
        return {
          do: () => {
            this.element.dataset.trixMutable = true;
          },
          undo: () => delete this.element.dataset.trixMutable
        };
      }));
      _defineProperty(this, "addToolbar", undoable(() => {
        const element = makeElement({
          tagName: "div",
          className: css.attachmentToolbar,
          data: {
            trixMutable: true
          },
          childNodes: makeElement({
            tagName: "div",
            className: "trix-button-row",
            childNodes: makeElement({
              tagName: "span",
              className: "trix-button-group trix-button-group--actions",
              childNodes: makeElement({
                tagName: "button",
                className: "trix-button trix-button--remove",
                textContent: lang.remove,
                attributes: {
                  title: lang.remove
                },
                data: {
                  trixAction: "remove"
                }
              })
            })
          })
        });
        if (this.attachment.isPreviewable()) {
          element.appendChild(makeElement({
            tagName: "div",
            className: css.attachmentMetadataContainer,
            childNodes: makeElement({
              tagName: "span",
              className: css.attachmentMetadata,
              childNodes: [makeElement({
                tagName: "span",
                className: css.attachmentName,
                textContent: this.attachment.getFilename(),
                attributes: {
                  title: this.attachment.getFilename()
                }
              }), makeElement({
                tagName: "span",
                className: css.attachmentSize,
                textContent: this.attachment.getFormattedFilesize()
              })]
            })
          }));
        }
        handleEvent("click", {
          onElement: element,
          withCallback: this.didClickToolbar
        });
        handleEvent("click", {
          onElement: element,
          matchingSelector: "[data-trix-action]",
          withCallback: this.didClickActionButton
        });
        return {
          do: () => this.element.appendChild(element),
          undo: () => removeNode(element)
        };
      }));
      _defineProperty(this, "installCaptionEditor", undoable(() => {
        const textarea = makeElement({
          tagName: "textarea",
          className: css.attachmentCaptionEditor,
          attributes: {
            placeholder: lang.captionPlaceholder
          },
          data: {
            trixMutable: true
          }
        });
        textarea.value = this.attachmentPiece.getCaption();
        const textareaClone = textarea.cloneNode();
        textareaClone.classList.add("trix-autoresize-clone");
        textareaClone.tabIndex = -1;
        const autoresize = function() {
          textareaClone.value = textarea.value;
          textarea.style.height = textareaClone.scrollHeight + "px";
        };
        handleEvent("input", {
          onElement: textarea,
          withCallback: autoresize
        });
        handleEvent("input", {
          onElement: textarea,
          withCallback: this.didInputCaption
        });
        handleEvent("keydown", {
          onElement: textarea,
          withCallback: this.didKeyDownCaption
        });
        handleEvent("change", {
          onElement: textarea,
          withCallback: this.didChangeCaption
        });
        handleEvent("blur", {
          onElement: textarea,
          withCallback: this.didBlurCaption
        });
        const figcaption = this.element.querySelector("figcaption");
        const editingFigcaption = figcaption.cloneNode();
        return {
          do: () => {
            figcaption.style.display = "none";
            editingFigcaption.appendChild(textarea);
            editingFigcaption.appendChild(textareaClone);
            editingFigcaption.classList.add("".concat(css.attachmentCaption, "--editing"));
            figcaption.parentElement.insertBefore(editingFigcaption, figcaption);
            autoresize();
            if (this.options.editCaption) {
              return defer(() => textarea.focus());
            }
          },
          undo() {
            removeNode(editingFigcaption);
            figcaption.style.display = null;
          }
        };
      }));
      this.didClickToolbar = this.didClickToolbar.bind(this);
      this.didClickActionButton = this.didClickActionButton.bind(this);
      this.didKeyDownCaption = this.didKeyDownCaption.bind(this);
      this.didInputCaption = this.didInputCaption.bind(this);
      this.didChangeCaption = this.didChangeCaption.bind(this);
      this.didBlurCaption = this.didBlurCaption.bind(this);
      this.attachmentPiece = attachmentPiece;
      this.element = _element;
      this.container = container;
      this.options = options2;
      this.attachment = this.attachmentPiece.attachment;
      if (tagName(this.element) === "a") {
        this.element = this.element.firstChild;
      }
      this.install();
    }
    install() {
      this.makeElementMutable();
      this.addToolbar();
      if (this.attachment.isPreviewable()) {
        this.installCaptionEditor();
      }
    }
    uninstall() {
      var _this$delegate;
      let undo = this.undos.pop();
      this.savePendingCaption();
      while (undo) {
        undo();
        undo = this.undos.pop();
      }
      (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : _this$delegate.didUninstallAttachmentEditor(this);
    }
    savePendingCaption() {
      if (this.pendingCaption) {
        const caption = this.pendingCaption;
        this.pendingCaption = null;
        if (caption) {
          var _this$delegate2, _this$delegate2$attac;
          (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : (_this$delegate2$attac = _this$delegate2.attachmentEditorDidRequestUpdatingAttributesForAttachment) === null || _this$delegate2$attac === void 0 ? void 0 : _this$delegate2$attac.call(_this$delegate2, {
            caption
          }, this.attachment);
        } else {
          var _this$delegate3, _this$delegate3$attac;
          (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 ? void 0 : (_this$delegate3$attac = _this$delegate3.attachmentEditorDidRequestRemovingAttributeForAttachment) === null || _this$delegate3$attac === void 0 ? void 0 : _this$delegate3$attac.call(_this$delegate3, "caption", this.attachment);
        }
      }
    }
    didClickToolbar(event) {
      event.preventDefault();
      return event.stopPropagation();
    }
    didClickActionButton(event) {
      var _this$delegate4;
      const action = event.target.getAttribute("data-trix-action");
      switch (action) {
        case "remove":
          return (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 ? void 0 : _this$delegate4.attachmentEditorDidRequestRemovalOfAttachment(this.attachment);
      }
    }
    didKeyDownCaption(event) {
      if (keyNames[event.keyCode] === "return") {
        var _this$delegate5, _this$delegate5$attac;
        event.preventDefault();
        this.savePendingCaption();
        return (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 ? void 0 : (_this$delegate5$attac = _this$delegate5.attachmentEditorDidRequestDeselectingAttachment) === null || _this$delegate5$attac === void 0 ? void 0 : _this$delegate5$attac.call(_this$delegate5, this.attachment);
      }
    }
    didInputCaption(event) {
      this.pendingCaption = event.target.value.replace(/\s/g, " ").trim();
    }
    didChangeCaption(event) {
      return this.savePendingCaption();
    }
    didBlurCaption(event) {
      return this.savePendingCaption();
    }
  };
  var CompositionController = class extends BasicObject {
    constructor(element, composition) {
      super(...arguments);
      this.didFocus = this.didFocus.bind(this);
      this.didBlur = this.didBlur.bind(this);
      this.didClickAttachment = this.didClickAttachment.bind(this);
      this.element = element;
      this.composition = composition;
      this.documentView = new DocumentView(this.composition.document, {
        element: this.element
      });
      handleEvent("focus", {
        onElement: this.element,
        withCallback: this.didFocus
      });
      handleEvent("blur", {
        onElement: this.element,
        withCallback: this.didBlur
      });
      handleEvent("click", {
        onElement: this.element,
        matchingSelector: "a[contenteditable=false]",
        preventDefault: true
      });
      handleEvent("mousedown", {
        onElement: this.element,
        matchingSelector: attachmentSelector,
        withCallback: this.didClickAttachment
      });
      handleEvent("click", {
        onElement: this.element,
        matchingSelector: "a".concat(attachmentSelector),
        preventDefault: true
      });
    }
    didFocus(event) {
      var _this$blurPromise;
      const perform = () => {
        if (!this.focused) {
          var _this$delegate, _this$delegate$compos;
          this.focused = true;
          return (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : (_this$delegate$compos = _this$delegate.compositionControllerDidFocus) === null || _this$delegate$compos === void 0 ? void 0 : _this$delegate$compos.call(_this$delegate);
        }
      };
      return ((_this$blurPromise = this.blurPromise) === null || _this$blurPromise === void 0 ? void 0 : _this$blurPromise.then(perform)) || perform();
    }
    didBlur(event) {
      this.blurPromise = new Promise((resolve) => {
        return defer(() => {
          if (!innerElementIsActive(this.element)) {
            var _this$delegate2, _this$delegate2$compo;
            this.focused = null;
            (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : (_this$delegate2$compo = _this$delegate2.compositionControllerDidBlur) === null || _this$delegate2$compo === void 0 ? void 0 : _this$delegate2$compo.call(_this$delegate2);
          }
          this.blurPromise = null;
          return resolve();
        });
      });
    }
    didClickAttachment(event, target) {
      var _this$delegate3, _this$delegate3$compo;
      const attachment = this.findAttachmentForElement(target);
      const editCaption = !!findClosestElementFromNode(event.target, {
        matchingSelector: "figcaption"
      });
      return (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 ? void 0 : (_this$delegate3$compo = _this$delegate3.compositionControllerDidSelectAttachment) === null || _this$delegate3$compo === void 0 ? void 0 : _this$delegate3$compo.call(_this$delegate3, attachment, {
        editCaption
      });
    }
    getSerializableElement() {
      if (this.isEditingAttachment()) {
        return this.documentView.shadowElement;
      } else {
        return this.element;
      }
    }
    render() {
      var _this$delegate6, _this$delegate6$compo;
      if (this.revision !== this.composition.revision) {
        this.documentView.setDocument(this.composition.document);
        this.documentView.render();
        this.revision = this.composition.revision;
      }
      if (this.canSyncDocumentView() && !this.documentView.isSynced()) {
        var _this$delegate4, _this$delegate4$compo, _this$delegate5, _this$delegate5$compo;
        (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 ? void 0 : (_this$delegate4$compo = _this$delegate4.compositionControllerWillSyncDocumentView) === null || _this$delegate4$compo === void 0 ? void 0 : _this$delegate4$compo.call(_this$delegate4);
        this.documentView.sync();
        (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 ? void 0 : (_this$delegate5$compo = _this$delegate5.compositionControllerDidSyncDocumentView) === null || _this$delegate5$compo === void 0 ? void 0 : _this$delegate5$compo.call(_this$delegate5);
      }
      return (_this$delegate6 = this.delegate) === null || _this$delegate6 === void 0 ? void 0 : (_this$delegate6$compo = _this$delegate6.compositionControllerDidRender) === null || _this$delegate6$compo === void 0 ? void 0 : _this$delegate6$compo.call(_this$delegate6);
    }
    rerenderViewForObject(object2) {
      this.invalidateViewForObject(object2);
      return this.render();
    }
    invalidateViewForObject(object2) {
      return this.documentView.invalidateViewForObject(object2);
    }
    isViewCachingEnabled() {
      return this.documentView.isViewCachingEnabled();
    }
    enableViewCaching() {
      return this.documentView.enableViewCaching();
    }
    disableViewCaching() {
      return this.documentView.disableViewCaching();
    }
    refreshViewCache() {
      return this.documentView.garbageCollectCachedViews();
    }
    isEditingAttachment() {
      return !!this.attachmentEditor;
    }
    installAttachmentEditorForAttachment(attachment, options2) {
      var _this$attachmentEdito;
      if (((_this$attachmentEdito = this.attachmentEditor) === null || _this$attachmentEdito === void 0 ? void 0 : _this$attachmentEdito.attachment) === attachment)
        return;
      const element = this.documentView.findElementForObject(attachment);
      if (!element)
        return;
      this.uninstallAttachmentEditor();
      const attachmentPiece = this.composition.document.getAttachmentPieceForAttachment(attachment);
      this.attachmentEditor = new AttachmentEditorController(attachmentPiece, element, this.element, options2);
      this.attachmentEditor.delegate = this;
    }
    uninstallAttachmentEditor() {
      var _this$attachmentEdito2;
      return (_this$attachmentEdito2 = this.attachmentEditor) === null || _this$attachmentEdito2 === void 0 ? void 0 : _this$attachmentEdito2.uninstall();
    }
    didUninstallAttachmentEditor() {
      this.attachmentEditor = null;
      return this.render();
    }
    attachmentEditorDidRequestUpdatingAttributesForAttachment(attributes2, attachment) {
      var _this$delegate7, _this$delegate7$compo;
      (_this$delegate7 = this.delegate) === null || _this$delegate7 === void 0 ? void 0 : (_this$delegate7$compo = _this$delegate7.compositionControllerWillUpdateAttachment) === null || _this$delegate7$compo === void 0 ? void 0 : _this$delegate7$compo.call(_this$delegate7, attachment);
      return this.composition.updateAttributesForAttachment(attributes2, attachment);
    }
    attachmentEditorDidRequestRemovingAttributeForAttachment(attribute, attachment) {
      var _this$delegate8, _this$delegate8$compo;
      (_this$delegate8 = this.delegate) === null || _this$delegate8 === void 0 ? void 0 : (_this$delegate8$compo = _this$delegate8.compositionControllerWillUpdateAttachment) === null || _this$delegate8$compo === void 0 ? void 0 : _this$delegate8$compo.call(_this$delegate8, attachment);
      return this.composition.removeAttributeForAttachment(attribute, attachment);
    }
    attachmentEditorDidRequestRemovalOfAttachment(attachment) {
      var _this$delegate9, _this$delegate9$compo;
      return (_this$delegate9 = this.delegate) === null || _this$delegate9 === void 0 ? void 0 : (_this$delegate9$compo = _this$delegate9.compositionControllerDidRequestRemovalOfAttachment) === null || _this$delegate9$compo === void 0 ? void 0 : _this$delegate9$compo.call(_this$delegate9, attachment);
    }
    attachmentEditorDidRequestDeselectingAttachment(attachment) {
      var _this$delegate10, _this$delegate10$comp;
      return (_this$delegate10 = this.delegate) === null || _this$delegate10 === void 0 ? void 0 : (_this$delegate10$comp = _this$delegate10.compositionControllerDidRequestDeselectingAttachment) === null || _this$delegate10$comp === void 0 ? void 0 : _this$delegate10$comp.call(_this$delegate10, attachment);
    }
    canSyncDocumentView() {
      return !this.isEditingAttachment();
    }
    findAttachmentForElement(element) {
      return this.composition.document.getAttachmentById(parseInt(element.dataset.trixId, 10));
    }
  };
  var attributeButtonSelector = "[data-trix-attribute]";
  var actionButtonSelector = "[data-trix-action]";
  var toolbarButtonSelector = "".concat(attributeButtonSelector, ", ").concat(actionButtonSelector);
  var dialogSelector = "[data-trix-dialog]";
  var activeDialogSelector = "".concat(dialogSelector, "[data-trix-active]");
  var dialogButtonSelector = "".concat(dialogSelector, " [data-trix-method]");
  var dialogInputSelector = "".concat(dialogSelector, " [data-trix-input]");
  var getInputForDialog = (element, attributeName) => {
    if (!attributeName) {
      attributeName = getAttributeName(element);
    }
    return element.querySelector("[data-trix-input][name='".concat(attributeName, "']"));
  };
  var getActionName = (element) => element.getAttribute("data-trix-action");
  var getAttributeName = (element) => {
    return element.getAttribute("data-trix-attribute") || element.getAttribute("data-trix-dialog-attribute");
  };
  var getDialogName = (element) => element.getAttribute("data-trix-dialog");
  var ToolbarController = class extends BasicObject {
    constructor(element) {
      super(element);
      this.didClickActionButton = this.didClickActionButton.bind(this);
      this.didClickAttributeButton = this.didClickAttributeButton.bind(this);
      this.didClickDialogButton = this.didClickDialogButton.bind(this);
      this.didKeyDownDialogInput = this.didKeyDownDialogInput.bind(this);
      this.element = element;
      this.attributes = {};
      this.actions = {};
      this.resetDialogInputs();
      handleEvent("mousedown", {
        onElement: this.element,
        matchingSelector: actionButtonSelector,
        withCallback: this.didClickActionButton
      });
      handleEvent("mousedown", {
        onElement: this.element,
        matchingSelector: attributeButtonSelector,
        withCallback: this.didClickAttributeButton
      });
      handleEvent("click", {
        onElement: this.element,
        matchingSelector: toolbarButtonSelector,
        preventDefault: true
      });
      handleEvent("click", {
        onElement: this.element,
        matchingSelector: dialogButtonSelector,
        withCallback: this.didClickDialogButton
      });
      handleEvent("keydown", {
        onElement: this.element,
        matchingSelector: dialogInputSelector,
        withCallback: this.didKeyDownDialogInput
      });
    }
    didClickActionButton(event, element) {
      var _this$delegate;
      (_this$delegate = this.delegate) === null || _this$delegate === void 0 ? void 0 : _this$delegate.toolbarDidClickButton();
      event.preventDefault();
      const actionName = getActionName(element);
      if (this.getDialog(actionName)) {
        return this.toggleDialog(actionName);
      } else {
        var _this$delegate2;
        return (_this$delegate2 = this.delegate) === null || _this$delegate2 === void 0 ? void 0 : _this$delegate2.toolbarDidInvokeAction(actionName);
      }
    }
    didClickAttributeButton(event, element) {
      var _this$delegate3;
      (_this$delegate3 = this.delegate) === null || _this$delegate3 === void 0 ? void 0 : _this$delegate3.toolbarDidClickButton();
      event.preventDefault();
      const attributeName = getAttributeName(element);
      if (this.getDialog(attributeName)) {
        this.toggleDialog(attributeName);
      } else {
        var _this$delegate4;
        (_this$delegate4 = this.delegate) === null || _this$delegate4 === void 0 ? void 0 : _this$delegate4.toolbarDidToggleAttribute(attributeName);
      }
      return this.refreshAttributeButtons();
    }
    didClickDialogButton(event, element) {
      const dialogElement = findClosestElementFromNode(element, {
        matchingSelector: dialogSelector
      });
      const method = element.getAttribute("data-trix-method");
      return this[method].call(this, dialogElement);
    }
    didKeyDownDialogInput(event, element) {
      if (event.keyCode === 13) {
        event.preventDefault();
        const attribute = element.getAttribute("name");
        const dialog = this.getDialog(attribute);
        this.setAttribute(dialog);
      }
      if (event.keyCode === 27) {
        event.preventDefault();
        return this.hideDialog();
      }
    }
    updateActions(actions) {
      this.actions = actions;
      return this.refreshActionButtons();
    }
    refreshActionButtons() {
      return this.eachActionButton((element, actionName) => {
        element.disabled = this.actions[actionName] === false;
      });
    }
    eachActionButton(callback) {
      return Array.from(this.element.querySelectorAll(actionButtonSelector)).map((element) => callback(element, getActionName(element)));
    }
    updateAttributes(attributes2) {
      this.attributes = attributes2;
      return this.refreshAttributeButtons();
    }
    refreshAttributeButtons() {
      return this.eachAttributeButton((element, attributeName) => {
        element.disabled = this.attributes[attributeName] === false;
        if (this.attributes[attributeName] || this.dialogIsVisible(attributeName)) {
          element.setAttribute("data-trix-active", "");
          return element.classList.add("trix-active");
        } else {
          element.removeAttribute("data-trix-active");
          return element.classList.remove("trix-active");
        }
      });
    }
    eachAttributeButton(callback) {
      return Array.from(this.element.querySelectorAll(attributeButtonSelector)).map((element) => callback(element, getAttributeName(element)));
    }
    applyKeyboardCommand(keys) {
      const keyString = JSON.stringify(keys.sort());
      for (const button of Array.from(this.element.querySelectorAll("[data-trix-key]"))) {
        const buttonKeys = button.getAttribute("data-trix-key").split("+");
        const buttonKeyString = JSON.stringify(buttonKeys.sort());
        if (buttonKeyString === keyString) {
          triggerEvent("mousedown", {
            onElement: button
          });
          return true;
        }
      }
      return false;
    }
    dialogIsVisible(dialogName) {
      const element = this.getDialog(dialogName);
      if (element) {
        return element.hasAttribute("data-trix-active");
      }
    }
    toggleDialog(dialogName) {
      if (this.dialogIsVisible(dialogName)) {
        return this.hideDialog();
      } else {
        return this.showDialog(dialogName);
      }
    }
    showDialog(dialogName) {
      var _this$delegate5, _this$delegate6;
      this.hideDialog();
      (_this$delegate5 = this.delegate) === null || _this$delegate5 === void 0 ? void 0 : _this$delegate5.toolbarWillShowDialog();
      const element = this.getDialog(dialogName);
      element.setAttribute("data-trix-active", "");
      element.classList.add("trix-active");
      Array.from(element.querySelectorAll("input[disabled]")).forEach((disabledInput) => {
        disabledInput.removeAttribute("disabled");
      });
      const attributeName = getAttributeName(element);
      if (attributeName) {
        const input2 = getInputForDialog(element, dialogName);
        if (input2) {
          input2.value = this.attributes[attributeName] || "";
          input2.select();
        }
      }
      return (_this$delegate6 = this.delegate) === null || _this$delegate6 === void 0 ? void 0 : _this$delegate6.toolbarDidShowDialog(dialogName);
    }
    setAttribute(dialogElement) {
      const attributeName = getAttributeName(dialogElement);
      const input2 = getInputForDialog(dialogElement, attributeName);
      if (input2.willValidate && !input2.checkValidity()) {
        input2.setAttribute("data-trix-validate", "");
        input2.classList.add("trix-validate");
        return input2.focus();
      } else {
        var _this$delegate7;
        (_this$delegate7 = this.delegate) === null || _this$delegate7 === void 0 ? void 0 : _this$delegate7.toolbarDidUpdateAttribute(attributeName, input2.value);
        return this.hideDialog();
      }
    }
    removeAttribute(dialogElement) {
      var _this$delegate8;
      const attributeName = getAttributeName(dialogElement);
      (_this$delegate8 = this.delegate) === null || _this$delegate8 === void 0 ? void 0 : _this$delegate8.toolbarDidRemoveAttribute(attributeName);
      return this.hideDialog();
    }
    hideDialog() {
      const element = this.element.querySelector(activeDialogSelector);
      if (element) {
        var _this$delegate9;
        element.removeAttribute("data-trix-active");
        element.classList.remove("trix-active");
        this.resetDialogInputs();
        return (_this$delegate9 = this.delegate) === null || _this$delegate9 === void 0 ? void 0 : _this$delegate9.toolbarDidHideDialog(getDialogName(element));
      }
    }
    resetDialogInputs() {
      Array.from(this.element.querySelectorAll(dialogInputSelector)).forEach((input2) => {
        input2.setAttribute("disabled", "disabled");
        input2.removeAttribute("data-trix-validate");
        input2.classList.remove("trix-validate");
      });
    }
    getDialog(dialogName) {
      return this.element.querySelector("[data-trix-dialog=".concat(dialogName, "]"));
    }
  };
  var snapshotsAreEqual = (a, b) => rangesAreEqual(a.selectedRange, b.selectedRange) && a.document.isEqualTo(b.document);
  var EditorController = class extends Controller2 {
    constructor(_ref) {
      let {
        editorElement,
        document: document2,
        html: html2
      } = _ref;
      super(...arguments);
      this.editorElement = editorElement;
      this.selectionManager = new SelectionManager(this.editorElement);
      this.selectionManager.delegate = this;
      this.composition = new Composition();
      this.composition.delegate = this;
      this.attachmentManager = new AttachmentManager(this.composition.getAttachments());
      this.attachmentManager.delegate = this;
      this.inputController = config.input.getLevel() === 2 ? new Level2InputController(this.editorElement) : new Level0InputController(this.editorElement);
      this.inputController.delegate = this;
      this.inputController.responder = this.composition;
      this.compositionController = new CompositionController(this.editorElement, this.composition);
      this.compositionController.delegate = this;
      this.toolbarController = new ToolbarController(this.editorElement.toolbarElement);
      this.toolbarController.delegate = this;
      this.editor = new Editor(this.composition, this.selectionManager, this.editorElement);
      if (document2) {
        this.editor.loadDocument(document2);
      } else {
        this.editor.loadHTML(html2);
      }
    }
    registerSelectionManager() {
      return selectionChangeObserver.registerSelectionManager(this.selectionManager);
    }
    unregisterSelectionManager() {
      return selectionChangeObserver.unregisterSelectionManager(this.selectionManager);
    }
    render() {
      return this.compositionController.render();
    }
    reparse() {
      return this.composition.replaceHTML(this.editorElement.innerHTML);
    }
    compositionDidChangeDocument(document2) {
      this.notifyEditorElement("document-change");
      if (!this.handlingInput) {
        return this.render();
      }
    }
    compositionDidChangeCurrentAttributes(currentAttributes) {
      this.currentAttributes = currentAttributes;
      this.toolbarController.updateAttributes(this.currentAttributes);
      this.updateCurrentActions();
      return this.notifyEditorElement("attributes-change", {
        attributes: this.currentAttributes
      });
    }
    compositionDidPerformInsertionAtRange(range) {
      if (this.pasting) {
        this.pastedRange = range;
      }
    }
    compositionShouldAcceptFile(file) {
      return this.notifyEditorElement("file-accept", {
        file
      });
    }
    compositionDidAddAttachment(attachment) {
      const managedAttachment = this.attachmentManager.manageAttachment(attachment);
      return this.notifyEditorElement("attachment-add", {
        attachment: managedAttachment
      });
    }
    compositionDidEditAttachment(attachment) {
      this.compositionController.rerenderViewForObject(attachment);
      const managedAttachment = this.attachmentManager.manageAttachment(attachment);
      this.notifyEditorElement("attachment-edit", {
        attachment: managedAttachment
      });
      return this.notifyEditorElement("change");
    }
    compositionDidChangeAttachmentPreviewURL(attachment) {
      this.compositionController.invalidateViewForObject(attachment);
      return this.notifyEditorElement("change");
    }
    compositionDidRemoveAttachment(attachment) {
      const managedAttachment = this.attachmentManager.unmanageAttachment(attachment);
      return this.notifyEditorElement("attachment-remove", {
        attachment: managedAttachment
      });
    }
    compositionDidStartEditingAttachment(attachment, options2) {
      this.attachmentLocationRange = this.composition.document.getLocationRangeOfAttachment(attachment);
      this.compositionController.installAttachmentEditorForAttachment(attachment, options2);
      return this.selectionManager.setLocationRange(this.attachmentLocationRange);
    }
    compositionDidStopEditingAttachment(attachment) {
      this.compositionController.uninstallAttachmentEditor();
      this.attachmentLocationRange = null;
    }
    compositionDidRequestChangingSelectionToLocationRange(locationRange) {
      if (this.loadingSnapshot && !this.isFocused())
        return;
      this.requestedLocationRange = locationRange;
      this.compositionRevisionWhenLocationRangeRequested = this.composition.revision;
      if (!this.handlingInput) {
        return this.render();
      }
    }
    compositionWillLoadSnapshot() {
      this.loadingSnapshot = true;
    }
    compositionDidLoadSnapshot() {
      this.compositionController.refreshViewCache();
      this.render();
      this.loadingSnapshot = false;
    }
    getSelectionManager() {
      return this.selectionManager;
    }
    attachmentManagerDidRequestRemovalOfAttachment(attachment) {
      return this.removeAttachment(attachment);
    }
    compositionControllerWillSyncDocumentView() {
      this.inputController.editorWillSyncDocumentView();
      this.selectionManager.lock();
      return this.selectionManager.clearSelection();
    }
    compositionControllerDidSyncDocumentView() {
      this.inputController.editorDidSyncDocumentView();
      this.selectionManager.unlock();
      this.updateCurrentActions();
      return this.notifyEditorElement("sync");
    }
    compositionControllerDidRender() {
      if (this.requestedLocationRange) {
        if (this.compositionRevisionWhenLocationRangeRequested === this.composition.revision) {
          this.selectionManager.setLocationRange(this.requestedLocationRange);
        }
        this.requestedLocationRange = null;
        this.compositionRevisionWhenLocationRangeRequested = null;
      }
      if (this.renderedCompositionRevision !== this.composition.revision) {
        this.runEditorFilters();
        this.composition.updateCurrentAttributes();
        this.notifyEditorElement("render");
      }
      this.renderedCompositionRevision = this.composition.revision;
    }
    compositionControllerDidFocus() {
      if (this.isFocusedInvisibly()) {
        this.setLocationRange({
          index: 0,
          offset: 0
        });
      }
      this.toolbarController.hideDialog();
      return this.notifyEditorElement("focus");
    }
    compositionControllerDidBlur() {
      return this.notifyEditorElement("blur");
    }
    compositionControllerDidSelectAttachment(attachment, options2) {
      this.toolbarController.hideDialog();
      return this.composition.editAttachment(attachment, options2);
    }
    compositionControllerDidRequestDeselectingAttachment(attachment) {
      const locationRange = this.attachmentLocationRange || this.composition.document.getLocationRangeOfAttachment(attachment);
      return this.selectionManager.setLocationRange(locationRange[1]);
    }
    compositionControllerWillUpdateAttachment(attachment) {
      return this.editor.recordUndoEntry("Edit Attachment", {
        context: attachment.id,
        consolidatable: true
      });
    }
    compositionControllerDidRequestRemovalOfAttachment(attachment) {
      return this.removeAttachment(attachment);
    }
    inputControllerWillHandleInput() {
      this.handlingInput = true;
      this.requestedRender = false;
    }
    inputControllerDidRequestRender() {
      this.requestedRender = true;
    }
    inputControllerDidHandleInput() {
      this.handlingInput = false;
      if (this.requestedRender) {
        this.requestedRender = false;
        return this.render();
      }
    }
    inputControllerDidAllowUnhandledInput() {
      return this.notifyEditorElement("change");
    }
    inputControllerDidRequestReparse() {
      return this.reparse();
    }
    inputControllerWillPerformTyping() {
      return this.recordTypingUndoEntry();
    }
    inputControllerWillPerformFormatting(attributeName) {
      return this.recordFormattingUndoEntry(attributeName);
    }
    inputControllerWillCutText() {
      return this.editor.recordUndoEntry("Cut");
    }
    inputControllerWillPaste(paste) {
      this.editor.recordUndoEntry("Paste");
      this.pasting = true;
      return this.notifyEditorElement("before-paste", {
        paste
      });
    }
    inputControllerDidPaste(paste) {
      paste.range = this.pastedRange;
      this.pastedRange = null;
      this.pasting = null;
      return this.notifyEditorElement("paste", {
        paste
      });
    }
    inputControllerWillMoveText() {
      return this.editor.recordUndoEntry("Move");
    }
    inputControllerWillAttachFiles() {
      return this.editor.recordUndoEntry("Drop Files");
    }
    inputControllerWillPerformUndo() {
      return this.editor.undo();
    }
    inputControllerWillPerformRedo() {
      return this.editor.redo();
    }
    inputControllerDidReceiveKeyboardCommand(keys) {
      return this.toolbarController.applyKeyboardCommand(keys);
    }
    inputControllerDidStartDrag() {
      this.locationRangeBeforeDrag = this.selectionManager.getLocationRange();
    }
    inputControllerDidReceiveDragOverPoint(point) {
      return this.selectionManager.setLocationRangeFromPointRange(point);
    }
    inputControllerDidCancelDrag() {
      this.selectionManager.setLocationRange(this.locationRangeBeforeDrag);
      this.locationRangeBeforeDrag = null;
    }
    locationRangeDidChange(locationRange) {
      this.composition.updateCurrentAttributes();
      this.updateCurrentActions();
      if (this.attachmentLocationRange && !rangesAreEqual(this.attachmentLocationRange, locationRange)) {
        this.composition.stopEditingAttachment();
      }
      return this.notifyEditorElement("selection-change");
    }
    toolbarDidClickButton() {
      if (!this.getLocationRange()) {
        return this.setLocationRange({
          index: 0,
          offset: 0
        });
      }
    }
    toolbarDidInvokeAction(actionName) {
      return this.invokeAction(actionName);
    }
    toolbarDidToggleAttribute(attributeName) {
      this.recordFormattingUndoEntry(attributeName);
      this.composition.toggleCurrentAttribute(attributeName);
      this.render();
      if (!this.selectionFrozen) {
        return this.editorElement.focus();
      }
    }
    toolbarDidUpdateAttribute(attributeName, value) {
      this.recordFormattingUndoEntry(attributeName);
      this.composition.setCurrentAttribute(attributeName, value);
      this.render();
      if (!this.selectionFrozen) {
        return this.editorElement.focus();
      }
    }
    toolbarDidRemoveAttribute(attributeName) {
      this.recordFormattingUndoEntry(attributeName);
      this.composition.removeCurrentAttribute(attributeName);
      this.render();
      if (!this.selectionFrozen) {
        return this.editorElement.focus();
      }
    }
    toolbarWillShowDialog(dialogElement) {
      this.composition.expandSelectionForEditing();
      return this.freezeSelection();
    }
    toolbarDidShowDialog(dialogName) {
      return this.notifyEditorElement("toolbar-dialog-show", {
        dialogName
      });
    }
    toolbarDidHideDialog(dialogName) {
      this.thawSelection();
      this.editorElement.focus();
      return this.notifyEditorElement("toolbar-dialog-hide", {
        dialogName
      });
    }
    freezeSelection() {
      if (!this.selectionFrozen) {
        this.selectionManager.lock();
        this.composition.freezeSelection();
        this.selectionFrozen = true;
        return this.render();
      }
    }
    thawSelection() {
      if (this.selectionFrozen) {
        this.composition.thawSelection();
        this.selectionManager.unlock();
        this.selectionFrozen = false;
        return this.render();
      }
    }
    canInvokeAction(actionName) {
      if (this.actionIsExternal(actionName)) {
        return true;
      } else {
        var _this$actions$actionN, _this$actions$actionN2;
        return !!((_this$actions$actionN = this.actions[actionName]) !== null && _this$actions$actionN !== void 0 && (_this$actions$actionN2 = _this$actions$actionN.test) !== null && _this$actions$actionN2 !== void 0 && _this$actions$actionN2.call(this));
      }
    }
    invokeAction(actionName) {
      if (this.actionIsExternal(actionName)) {
        return this.notifyEditorElement("action-invoke", {
          actionName
        });
      } else {
        var _this$actions$actionN3, _this$actions$actionN4;
        return (_this$actions$actionN3 = this.actions[actionName]) === null || _this$actions$actionN3 === void 0 ? void 0 : (_this$actions$actionN4 = _this$actions$actionN3.perform) === null || _this$actions$actionN4 === void 0 ? void 0 : _this$actions$actionN4.call(this);
      }
    }
    actionIsExternal(actionName) {
      return /^x-./.test(actionName);
    }
    getCurrentActions() {
      const result = {};
      for (const actionName in this.actions) {
        result[actionName] = this.canInvokeAction(actionName);
      }
      return result;
    }
    updateCurrentActions() {
      const currentActions = this.getCurrentActions();
      if (!objectsAreEqual(currentActions, this.currentActions)) {
        this.currentActions = currentActions;
        this.toolbarController.updateActions(this.currentActions);
        return this.notifyEditorElement("actions-change", {
          actions: this.currentActions
        });
      }
    }
    runEditorFilters() {
      let snapshot = this.composition.getSnapshot();
      Array.from(this.editor.filters).forEach((filter) => {
        const {
          document: document2,
          selectedRange
        } = snapshot;
        snapshot = filter.call(this.editor, snapshot) || {};
        if (!snapshot.document) {
          snapshot.document = document2;
        }
        if (!snapshot.selectedRange) {
          snapshot.selectedRange = selectedRange;
        }
      });
      if (!snapshotsAreEqual(snapshot, this.composition.getSnapshot())) {
        return this.composition.loadSnapshot(snapshot);
      }
    }
    updateInputElement() {
      const element = this.compositionController.getSerializableElement();
      const value = serializeToContentType(element, "text/html");
      return this.editorElement.setInputElementValue(value);
    }
    notifyEditorElement(message, data) {
      switch (message) {
        case "document-change":
          this.documentChangedSinceLastRender = true;
          break;
        case "render":
          if (this.documentChangedSinceLastRender) {
            this.documentChangedSinceLastRender = false;
            this.notifyEditorElement("change");
          }
          break;
        case "change":
        case "attachment-add":
        case "attachment-edit":
        case "attachment-remove":
          this.updateInputElement();
          break;
      }
      return this.editorElement.notify(message, data);
    }
    removeAttachment(attachment) {
      this.editor.recordUndoEntry("Delete Attachment");
      this.composition.removeAttachment(attachment);
      return this.render();
    }
    recordFormattingUndoEntry(attributeName) {
      const blockConfig = getBlockConfig(attributeName);
      const locationRange = this.selectionManager.getLocationRange();
      if (blockConfig || !rangeIsCollapsed(locationRange)) {
        return this.editor.recordUndoEntry("Formatting", {
          context: this.getUndoContext(),
          consolidatable: true
        });
      }
    }
    recordTypingUndoEntry() {
      return this.editor.recordUndoEntry("Typing", {
        context: this.getUndoContext(this.currentAttributes),
        consolidatable: true
      });
    }
    getUndoContext() {
      for (var _len = arguments.length, context = new Array(_len), _key = 0; _key < _len; _key++) {
        context[_key] = arguments[_key];
      }
      return [this.getLocationContext(), this.getTimeContext(), ...Array.from(context)];
    }
    getLocationContext() {
      const locationRange = this.selectionManager.getLocationRange();
      if (rangeIsCollapsed(locationRange)) {
        return locationRange[0].index;
      } else {
        return locationRange;
      }
    }
    getTimeContext() {
      if (config.undoInterval > 0) {
        return Math.floor(new Date().getTime() / config.undoInterval);
      } else {
        return 0;
      }
    }
    isFocused() {
      var _this$editorElement$o;
      return this.editorElement === ((_this$editorElement$o = this.editorElement.ownerDocument) === null || _this$editorElement$o === void 0 ? void 0 : _this$editorElement$o.activeElement);
    }
    isFocusedInvisibly() {
      return this.isFocused() && !this.getLocationRange();
    }
    get actions() {
      return this.constructor.actions;
    }
  };
  _defineProperty(EditorController, "actions", {
    undo: {
      test() {
        return this.editor.canUndo();
      },
      perform() {
        return this.editor.undo();
      }
    },
    redo: {
      test() {
        return this.editor.canRedo();
      },
      perform() {
        return this.editor.redo();
      }
    },
    link: {
      test() {
        return this.editor.canActivateAttribute("href");
      }
    },
    increaseNestingLevel: {
      test() {
        return this.editor.canIncreaseNestingLevel();
      },
      perform() {
        return this.editor.increaseNestingLevel() && this.render();
      }
    },
    decreaseNestingLevel: {
      test() {
        return this.editor.canDecreaseNestingLevel();
      },
      perform() {
        return this.editor.decreaseNestingLevel() && this.render();
      }
    },
    attachFiles: {
      test() {
        return true;
      },
      perform() {
        return config.input.pickFiles(this.editor.insertFiles);
      }
    }
  });
  EditorController.proxyMethod("getSelectionManager().setLocationRange");
  EditorController.proxyMethod("getSelectionManager().getLocationRange");
  installDefaultCSSForTagName("trix-toolbar", "%t {\n  display: block;\n}\n\n%t {\n  white-space: nowrap;\n}\n\n%t [data-trix-dialog] {\n  display: none;\n}\n\n%t [data-trix-dialog][data-trix-active] {\n  display: block;\n}\n\n%t [data-trix-dialog] [data-trix-validate]:invalid {\n  background-color: #ffdddd;\n}");
  var TrixToolbarElement = class extends HTMLElement {
    connectedCallback() {
      if (this.innerHTML === "") {
        this.innerHTML = config.toolbar.getDefaultHTML();
      }
    }
  };
  window.customElements.define("trix-toolbar", TrixToolbarElement);
  var id = 0;
  var autofocus = function(element) {
    if (!document.querySelector(":focus")) {
      if (element.hasAttribute("autofocus") && document.querySelector("[autofocus]") === element) {
        return element.focus();
      }
    }
  };
  var makeEditable = function(element) {
    if (element.hasAttribute("contenteditable")) {
      return;
    }
    element.setAttribute("contenteditable", "");
    return handleEventOnce("focus", {
      onElement: element,
      withCallback() {
        return configureContentEditable(element);
      }
    });
  };
  var configureContentEditable = function(element) {
    disableObjectResizing(element);
    return setDefaultParagraphSeparator(element);
  };
  var disableObjectResizing = function(element) {
    var _document$queryComman, _document;
    if ((_document$queryComman = (_document = document).queryCommandSupported) !== null && _document$queryComman !== void 0 && _document$queryComman.call(_document, "enableObjectResizing")) {
      document.execCommand("enableObjectResizing", false, false);
      return handleEvent("mscontrolselect", {
        onElement: element,
        preventDefault: true
      });
    }
  };
  var setDefaultParagraphSeparator = function(element) {
    var _document$queryComman2, _document2;
    if ((_document$queryComman2 = (_document2 = document).queryCommandSupported) !== null && _document$queryComman2 !== void 0 && _document$queryComman2.call(_document2, "DefaultParagraphSeparator")) {
      const {
        tagName: tagName2
      } = config.blockAttributes.default;
      if (["div", "p"].includes(tagName2)) {
        return document.execCommand("DefaultParagraphSeparator", false, tagName2);
      }
    }
  };
  var addAccessibilityRole = function(element) {
    if (element.hasAttribute("role")) {
      return;
    }
    return element.setAttribute("role", "textbox");
  };
  var ensureAriaLabel = function(element) {
    if (element.hasAttribute("aria-label") || element.hasAttribute("aria-labelledby")) {
      return;
    }
    const update = function() {
      const texts = Array.from(element.labels).map((label) => {
        if (!label.contains(element))
          return label.textContent;
      }).filter((text2) => text2);
      const text = texts.join(" ");
      if (text) {
        return element.setAttribute("aria-label", text);
      } else {
        return element.removeAttribute("aria-label");
      }
    };
    update();
    return handleEvent("focus", {
      onElement: element,
      withCallback: update
    });
  };
  var cursorTargetStyles = function() {
    if (config.browser.forcesObjectResizing) {
      return {
        display: "inline",
        width: "auto"
      };
    } else {
      return {
        display: "inline-block",
        width: "1px"
      };
    }
  }();
  installDefaultCSSForTagName("trix-editor", "%t {\n    display: block;\n}\n\n%t:empty:not(:focus)::before {\n    content: attr(placeholder);\n    color: graytext;\n    cursor: text;\n    pointer-events: none;\n    white-space: pre-line;\n}\n\n%t a[contenteditable=false] {\n    cursor: text;\n}\n\n%t img {\n    max-width: 100%;\n    height: auto;\n}\n\n%t ".concat(attachmentSelector, " figcaption textarea {\n    resize: none;\n}\n\n%t ").concat(attachmentSelector, " figcaption textarea.trix-autoresize-clone {\n    position: absolute;\n    left: -9999px;\n    max-height: 0px;\n}\n\n%t ").concat(attachmentSelector, " figcaption[data-trix-placeholder]:empty::before {\n    content: attr(data-trix-placeholder);\n    color: graytext;\n}\n\n%t [data-trix-cursor-target] {\n    display: ").concat(cursorTargetStyles.display, " !important;\n    width: ").concat(cursorTargetStyles.width, " !important;\n    padding: 0 !important;\n    margin: 0 !important;\n    border: none !important;\n}\n\n%t [data-trix-cursor-target=left] {\n    vertical-align: top !important;\n    margin-left: -1px !important;\n}\n\n%t [data-trix-cursor-target=right] {\n    vertical-align: bottom !important;\n    margin-right: -1px !important;\n}"));
  var TrixEditorElement = class extends HTMLElement {
    get trixId() {
      if (this.hasAttribute("trix-id")) {
        return this.getAttribute("trix-id");
      } else {
        this.setAttribute("trix-id", ++id);
        return this.trixId;
      }
    }
    get labels() {
      const labels = [];
      if (this.id && this.ownerDocument) {
        labels.push(...Array.from(this.ownerDocument.querySelectorAll("label[for='".concat(this.id, "']")) || []));
      }
      const label = findClosestElementFromNode(this, {
        matchingSelector: "label"
      });
      if (label) {
        if ([this, null].includes(label.control)) {
          labels.push(label);
        }
      }
      return labels;
    }
    get toolbarElement() {
      if (this.hasAttribute("toolbar")) {
        var _this$ownerDocument;
        return (_this$ownerDocument = this.ownerDocument) === null || _this$ownerDocument === void 0 ? void 0 : _this$ownerDocument.getElementById(this.getAttribute("toolbar"));
      } else if (this.parentNode) {
        const toolbarId = "trix-toolbar-".concat(this.trixId);
        this.setAttribute("toolbar", toolbarId);
        const element = makeElement("trix-toolbar", {
          id: toolbarId
        });
        this.parentNode.insertBefore(element, this);
        return element;
      } else {
        return void 0;
      }
    }
    get form() {
      var _this$inputElement;
      return (_this$inputElement = this.inputElement) === null || _this$inputElement === void 0 ? void 0 : _this$inputElement.form;
    }
    get inputElement() {
      if (this.hasAttribute("input")) {
        var _this$ownerDocument2;
        return (_this$ownerDocument2 = this.ownerDocument) === null || _this$ownerDocument2 === void 0 ? void 0 : _this$ownerDocument2.getElementById(this.getAttribute("input"));
      } else if (this.parentNode) {
        const inputId = "trix-input-".concat(this.trixId);
        this.setAttribute("input", inputId);
        const element = makeElement("input", {
          type: "hidden",
          id: inputId
        });
        this.parentNode.insertBefore(element, this.nextElementSibling);
        return element;
      } else {
        return void 0;
      }
    }
    get editor() {
      var _this$editorControlle;
      return (_this$editorControlle = this.editorController) === null || _this$editorControlle === void 0 ? void 0 : _this$editorControlle.editor;
    }
    get name() {
      var _this$inputElement2;
      return (_this$inputElement2 = this.inputElement) === null || _this$inputElement2 === void 0 ? void 0 : _this$inputElement2.name;
    }
    get value() {
      var _this$inputElement3;
      return (_this$inputElement3 = this.inputElement) === null || _this$inputElement3 === void 0 ? void 0 : _this$inputElement3.value;
    }
    set value(defaultValue) {
      var _this$editor;
      this.defaultValue = defaultValue;
      (_this$editor = this.editor) === null || _this$editor === void 0 ? void 0 : _this$editor.loadHTML(this.defaultValue);
    }
    notify(message, data) {
      if (this.editorController) {
        return triggerEvent("trix-".concat(message), {
          onElement: this,
          attributes: data
        });
      }
    }
    setInputElementValue(value) {
      if (this.inputElement) {
        this.inputElement.value = value;
      }
    }
    connectedCallback() {
      if (!this.hasAttribute("data-trix-internal")) {
        makeEditable(this);
        addAccessibilityRole(this);
        ensureAriaLabel(this);
        if (!this.editorController) {
          triggerEvent("trix-before-initialize", {
            onElement: this
          });
          this.editorController = new EditorController({
            editorElement: this,
            html: this.defaultValue = this.value
          });
          requestAnimationFrame(() => triggerEvent("trix-initialize", {
            onElement: this
          }));
        }
        this.editorController.registerSelectionManager();
        this.registerResetListener();
        this.registerClickListener();
        autofocus(this);
      }
    }
    disconnectedCallback() {
      var _this$editorControlle2;
      (_this$editorControlle2 = this.editorController) === null || _this$editorControlle2 === void 0 ? void 0 : _this$editorControlle2.unregisterSelectionManager();
      this.unregisterResetListener();
      return this.unregisterClickListener();
    }
    registerResetListener() {
      this.resetListener = this.resetBubbled.bind(this);
      return window.addEventListener("reset", this.resetListener, false);
    }
    unregisterResetListener() {
      return window.removeEventListener("reset", this.resetListener, false);
    }
    registerClickListener() {
      this.clickListener = this.clickBubbled.bind(this);
      return window.addEventListener("click", this.clickListener, false);
    }
    unregisterClickListener() {
      return window.removeEventListener("click", this.clickListener, false);
    }
    resetBubbled(event) {
      if (event.defaultPrevented)
        return;
      if (event.target !== this.form)
        return;
      return this.reset();
    }
    clickBubbled(event) {
      if (event.defaultPrevented)
        return;
      if (this.contains(event.target))
        return;
      const label = findClosestElementFromNode(event.target, {
        matchingSelector: "label"
      });
      if (!label)
        return;
      if (!Array.from(this.labels).includes(label))
        return;
      return this.focus();
    }
    reset() {
      this.value = this.defaultValue;
    }
  };
  window.customElements.define("trix-editor", TrixEditorElement);

  // node_modules/@rails/actiontext/app/javascript/actiontext/attachment_upload.js
  var import_activestorage = __toESM(require_activestorage());
  var AttachmentUpload = class {
    constructor(attachment, element) {
      this.attachment = attachment;
      this.element = element;
      this.directUpload = new import_activestorage.DirectUpload(attachment.file, this.directUploadUrl, this);
    }
    start() {
      this.directUpload.create(this.directUploadDidComplete.bind(this));
    }
    directUploadWillStoreFileWithXHR(xhr) {
      xhr.upload.addEventListener("progress", (event) => {
        const progress = event.loaded / event.total * 100;
        this.attachment.setUploadProgress(progress);
      });
    }
    directUploadDidComplete(error2, attributes2) {
      if (error2) {
        throw new Error(`Direct upload failed: ${error2}`);
      }
      this.attachment.setAttributes({
        sgid: attributes2.attachable_sgid,
        url: this.createBlobUrl(attributes2.signed_id, attributes2.filename)
      });
    }
    createBlobUrl(signedId, filename) {
      return this.blobUrlTemplate.replace(":signed_id", signedId).replace(":filename", encodeURIComponent(filename));
    }
    get directUploadUrl() {
      return this.element.dataset.directUploadUrl;
    }
    get blobUrlTemplate() {
      return this.element.dataset.blobUrlTemplate;
    }
  };

  // node_modules/@rails/actiontext/app/javascript/actiontext/index.js
  addEventListener("trix-attachment-add", (event) => {
    const { attachment, target } = event;
    if (attachment.file) {
      const upload = new AttachmentUpload(attachment, target);
      upload.start();
    }
  });
})();
//# sourceMappingURL=application.js.map
