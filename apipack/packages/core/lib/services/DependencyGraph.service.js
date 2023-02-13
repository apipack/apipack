"use strict";
exports.__esModule = true;
var DependencyGraphImpl = /** @class */ (function () {
    function DependencyGraphImpl(name) {
        if (name === void 0) { name = ''; }
        this.name = name;
        this.dependenciesMap = new Map();
    }
    DependencyGraphImpl.prototype.addDependency = function (dependency) {
        return this.dependenciesMap.set(dependency.name, dependency);
    };
    DependencyGraphImpl.prototype.removeDependency = function (dependencyOrKey) {
        var dependencyKey = dependencyOrKey;
        if (typeof dependencyKey !== 'string') {
            if (dependencyOrKey && typeof dependencyOrKey === 'object') {
                dependencyKey = dependencyOrKey.name;
            }
        }
        return this.dependenciesMap["delete"](dependencyKey);
    };
    return DependencyGraphImpl;
}());
exports["default"] = DependencyGraphImpl;
