"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var Player_1 = require("./Player");
var EventEmitter = require('events').EventEmitter;
var minecraft_server = /** @class */ (function (_super) {
    __extends(minecraft_server, _super);
    function minecraft_server(JSONoptions) {
        if (JSONoptions === void 0) { JSONoptions = {}; }
        var _this = _super.call(this) || this;
        _this.server = null;
        _this.clientAlreadyCalled = false;
        _this.theClient = null;
        var axios = require('axios');
        var options = JSONoptions;
        options.onlineMode = JSONoptions['onlineMode'] || true;
        options.port = JSONoptions['port'] || 25565;
        options.ram = JSONoptions['ram'] || 1024; //TODO: Add ram
        options.info_callback = JSONoptions['info_callback'] || console.log;
        _this.options = options;
        var serverstart = function () {
            _this.emit('server_start', null);
            var child = require('child_process');
            _this.server = child.exec('java -jar server.jar nogui', {
                cwd: __dirname + '/server/'
            });
            _this.server.stdout.on('data', function (data) {
                if (data == null || data == '' || data == undefined)
                    return;
                var text = data.toString().replace(/(\r\n|\n|\r)+$/, '');
                _this.emit('console', text);
                if (!_this.clientAlreadyCalled &&
                    text.includes('Waiting for client...')) {
                    _this.theClient = new Client();
                    _this.clientAlreadyCalled = true;
                    _this.theClient.once('connect', function () {
                        _this.emit('ready', true);
                    });
                }
            });
        };
        try {
            require('fs').mkdirSync('server');
        }
        catch (e) {
            ('ignoring this i guess lol');
        }
        (function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!require('fs').existsSync('./server/server.jar')) {
                    options.info_callback('Could not find server.jar, downloading...');
                    axios({
                        method: 'get',
                        url: 'https://papermc.io/api/v1/paper/1.16.1/latest/download',
                        responseType: 'stream'
                    }).then(function (response) {
                        var writer_error = false;
                        var writer = require('fs').createWriteStream('./server/server.jar');
                        response.data.pipe(writer);
                        writer.on('error', function () {
                            writer_error = true;
                        });
                        writer.on('close', function () {
                            if (!writer_error)
                                return serverstart();
                            throw new Error('Error while downloading/writing!');
                        });
                    });
                }
                else {
                    serverstart();
                }
                return [2 /*return*/];
            });
        }); })();
        process.on('beforeExit', _this.stop);
        return _this;
    }
    minecraft_server.prototype.stop = function () {
        this.runCommand('stop');
    };
    minecraft_server.prototype.runCommand = function (cmd) {
        this.server.stdin.write(cmd + '\n');
    };
    /**
     * @returns new Player()
     */
    minecraft_server.prototype.getPlayer = function (uuid) {
        return new Player_1["default"](uuid, this.theClient);
    };
    return minecraft_server;
}(EventEmitter));
module.exports.MinecraftServer = minecraft_server;
var net = require('net');
var Client = /** @class */ (function (_super) {
    __extends(Client, _super);
    function Client(host, port) {
        if (host === void 0) { host = 'localhost'; }
        if (port === void 0) { port = 18719; }
        var _this = _super.call(this) || this;
        _this.connected = false;
        _this.host = host;
        _this.port = port;
        _this.socket = net.createConnection({
            host: _this.host,
            port: _this.port
        });
        _this.socket.on('data', function (data) {
            _this.emit('packet', data);
        });
        _this.socket.on('timeout', function () {
            _this.emit('timeout', true);
        });
        _this.socket.on('end', function () {
            _this.emit('end', true);
        });
        _this.socket.on('error', function (error) {
            _this.emit('error', error);
        });
        _this.socket.on('connect', function () {
            _this.emit('connect');
            _this.connected = true;
        });
        return _this;
    }
    Client.prototype.sendPacket = function (data) {
        this.socket.write(data);
    };
    Client.prototype.end = function () {
        this.socket.end();
    };
    //all aliases shortened:
    Client.prototype.close = function () {
        return this.end();
    };
    Client.prototype.stop = function () {
        return this.end();
    };
    Client.prototype.send = function (a) {
        return this.sendPacket(a);
    };
    return Client;
}(EventEmitter));
