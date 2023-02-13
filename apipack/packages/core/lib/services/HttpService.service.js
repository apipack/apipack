"use strict";
exports.__esModule = true;
var HttpServiceImpl = /** @class */ (function () {
    function HttpServiceImpl(options) {
        this.name = options === null || options === void 0 ? void 0 : options.name;
        this.url = options === null || options === void 0 ? void 0 : options.url;
        this.method = options === null || options === void 0 ? void 0 : options.method;
        this.data = {};
        this.header = {};
        this.comments = [];
        this.pathParameters = {};
        this["return"] = void 0;
    }
    return HttpServiceImpl;
}());
exports["default"] = HttpServiceImpl;
