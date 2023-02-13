"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var java_parser_1 = require("java-parser");
var parser_utils_1 = require("../../utils/parser.utils");
/**
 * Visitor
 * To collect package, import, annotation and method declarations
 */
var Visitor = /** @class */ (function (_super) {
    __extends(Visitor, _super);
    function Visitor(_a) {
        var metadata = _a.metadata, DependencyImpl = _a.DependencyImpl, ReadCstServiceImpl = _a.ReadCstServiceImpl;
        var _this = _super.call(this) || this;
        // static
        Visitor.DependencyImpl = DependencyImpl;
        Visitor.ReadCstServiceImpl = ReadCstServiceImpl;
        // public
        _this.readCstService = new ReadCstServiceImpl();
        _this.dependency = new DependencyImpl(metadata);
        _this.validateVisitor();
        return _this;
    }
    Visitor.prototype.packageDeclaration = function (ctx) {
        var metadata = this.readCstService.packageDeclaration(ctx);
        var dependency = new Visitor.DependencyImpl(metadata);
        this.dependency.addDependency(dependency);
    };
    Visitor.prototype.importDeclaration = function (ctx) {
        var metadata = this.readCstService.importDeclaration(ctx);
        var dependency = new Visitor.DependencyImpl(metadata);
        this.dependency.addDependency(dependency);
    };
    Visitor.prototype.classDeclaration = function (ctx) {
        var _this = this;
        var _a, _b;
        var metadata = this.readCstService.classDeclaration(ctx);
        var dependency = new Visitor.DependencyImpl(metadata);
        this.dependency.addDependency(dependency);
        // To visit @ClassModifier if needed
        if ((_a = ctx.classModifier) === null || _a === void 0 ? void 0 : _a.length) {
            ctx.classModifier.forEach(function (classModifier) {
                _this.visit(classModifier, dependency);
            });
        }
        if ((_b = ctx.normalClassDeclaration) === null || _b === void 0 ? void 0 : _b.length) {
            this.visit(ctx.normalClassDeclaration, dependency);
        }
    };
    /**
     * classModifier must has parentDependency
     * Cause it was just a Modifier for a class
     *
     * @param ctx
     * @param parentDependency
     */
    Visitor.prototype.classModifier = function (ctx, parentDependency) {
        var _a;
        // only visit all of annotations
        var annotation = (_a = ctx.annotation) === null || _a === void 0 ? void 0 : _a[0];
        if (annotation) {
            this.visit(annotation, parentDependency);
        }
    };
    Visitor.prototype.annotation = function (ctx, parentDependency) {
        var metadata = this.readCstService.annotation(ctx);
        var dependency = new Visitor.DependencyImpl(metadata);
        parentDependency.addDependency(dependency);
    };
    Visitor.prototype.normalClassDeclaration = function (ctx, parentDependency) {
        var _this = this;
        var _a;
        if ((_a = ctx.classBody) === null || _a === void 0 ? void 0 : _a.length) {
            var classBodyDeclaration = ((0, parser_utils_1.extractNodeChildren)(ctx.classBody) || {}).classBodyDeclaration;
            if (classBodyDeclaration === null || classBodyDeclaration === void 0 ? void 0 : classBodyDeclaration.length) {
                classBodyDeclaration.forEach(function (classBodyDeclaration) {
                    _this.visit(classBodyDeclaration, parentDependency);
                });
            }
        }
    };
    Visitor.prototype.classBodyDeclaration = function (ctx, parentDependency) {
        if (ctx.classMemberDeclaration) {
            this.visit(ctx.classMemberDeclaration, parentDependency);
        }
    };
    Visitor.prototype.classMemberDeclaration = function (ctx, parentDependency) {
        var _a, _b;
        var metadata = this.readCstService.classMemberDeclaration(ctx);
        var dependency = new Visitor.DependencyImpl(metadata);
        parentDependency.addDependency(dependency);
        // we also need to read fieldDeclaration for VO classes
        if ((_a = ctx.fieldDeclaration) === null || _a === void 0 ? void 0 : _a.length) {
            this.visit(ctx.fieldDeclaration, dependency);
        }
        // we only need to read methodDeclaration
        if ((_b = ctx.methodDeclaration) === null || _b === void 0 ? void 0 : _b.length) {
            this.visit(ctx.methodDeclaration, dependency);
        }
    };
    Visitor.prototype.fieldDeclaration = function (ctx, parentDependency) {
        var metadata = this.readCstService.fieldDeclaration(ctx);
        var dependency = new Visitor.DependencyImpl(metadata);
        parentDependency.addDependency(dependency);
    };
    Visitor.prototype.fieldModifier = function (ctx, parentDependency) {
        var _a;
        // only visit annotations
        if ((_a = ctx.annotation) === null || _a === void 0 ? void 0 : _a.length) {
            this.visit(ctx.annotation, parentDependency);
        }
    };
    Visitor.prototype.variableDeclarator = function (ctx, parentDependency) {
        console.log(ctx);
    };
    Visitor.prototype.methodDeclaration = function (ctx, parentDependency) {
        var _this = this;
        var _a;
        var metadata = this.readCstService.methodDeclaration(ctx);
        var dependency = new Visitor.DependencyImpl(metadata);
        parentDependency.addDependency(dependency);
        // To visit @MethodModifier if needed
        if ((_a = ctx.methodModifier) === null || _a === void 0 ? void 0 : _a.length) {
            ctx.methodModifier.forEach(function (methodModifier) {
                _this.visit(methodModifier, dependency);
            });
        }
        this.visit(ctx.methodHeader, dependency);
    };
    Visitor.prototype.methodModifier = function (ctx, parentDependency) {
        var _a;
        // only visit annotations
        if ((_a = ctx.annotation) === null || _a === void 0 ? void 0 : _a.length) {
            this.visit(ctx.annotation, parentDependency);
        }
    };
    Visitor.prototype.methodHeader = function (ctx, parentDependency) {
        var result = ctx.result, methodDeclarator = ctx.methodDeclarator;
        this.visit(methodDeclarator, parentDependency);
        this.visit(result, parentDependency);
    };
    Visitor.prototype.methodDeclarator = function (ctx, parentDependency) {
        var metadata = this.readCstService.methodDeclarator(ctx);
        var dependency = new Visitor.DependencyImpl(metadata);
        parentDependency.addDependency(dependency);
    };
    Visitor.prototype.result = function (ctx, parentDependency) {
        var metadata = this.readCstService.result(ctx);
        var dependency = new Visitor.DependencyImpl(metadata);
        parentDependency.addDependency(dependency);
    };
    return Visitor;
}(java_parser_1.BaseJavaCstVisitorWithDefaults));
exports["default"] = Visitor;
