"use strict";
exports.__esModule = true;
var DependencyImpl = /** @class */ (function () {
    function DependencyImpl(metadata, name) {
        this.dependencies = new Set();
        this.metadata = metadata;
        this.name = (name || metadata.name);
    }
    DependencyImpl.prototype.addDependency = function (dependency) {
        this.dependencies.add(dependency);
    };
    DependencyImpl.prototype.deleteDependency = function (dependency) {
        this.dependencies["delete"](dependency);
    };
    return DependencyImpl;
}());
exports["default"] = DependencyImpl;
