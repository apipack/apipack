"use strict";
exports.__esModule = true;
exports.getVariableName = exports.getVariableList = exports.getUnannTypeName = exports.getAnnotation = exports.geneTypeArgumentListName = exports.typeNameToString = exports.createTypeName = exports.getElementPairListValue = exports.getElementValue = exports.extractNodeChildrenByPath = exports.getFirstCstNode = exports.getFirstKeyOfCtx = exports.extractNodeChildren = exports.joinIdentifierName = void 0;
var debug_1 = require("debug");
var name = 'reader.utils';
var logger = (0, debug_1["default"])(name);
var joinIdentifierName = function (array, separator) {
    if (separator === void 0) { separator = '.'; }
    return array.map(function (identifier) { return identifier.image; }).join(separator);
};
exports.joinIdentifierName = joinIdentifierName;
function extractNodeChildren(cstNode) {
    if (cstNode) {
        var firstNode = getFirstCstNode(cstNode);
        if (firstNode && firstNode.children) {
            return firstNode.children;
        }
        else {
            return firstNode;
        }
    }
    return null;
}
exports.extractNodeChildren = extractNodeChildren;
function getFirstKeyOfCtx(obj) {
    if (obj && typeof obj === 'object') {
        return Object.keys(obj)[0];
    }
}
exports.getFirstKeyOfCtx = getFirstKeyOfCtx;
function getFirstCstNode(cstNode) {
    if (Array.isArray(cstNode) && cstNode.length) {
        return cstNode[0];
    }
    return cstNode;
}
exports.getFirstCstNode = getFirstCstNode;
function extractNodeChildrenByPath(cstNode, keyPath) {
    var keyPaths = keyPath.split('.');
    var nextNode = extractNodeChildren(cstNode);
    var nextKey = '';
    while (keyPaths.length && nextNode) {
        nextKey = keyPaths.shift();
        if (nextKey) {
            // @ts-ignore
            nextNode = extractNodeChildren(nextNode[nextKey]);
        }
    }
    return nextNode;
}
exports.extractNodeChildrenByPath = extractNodeChildrenByPath;
function getElementValue(elementValue, keyPath) {
    if (keyPath === void 0) { keyPath = 'expression.ternaryExpression.binaryExpression.unaryExpression.primary.primaryPrefix.literal.StringLiteral'; }
    var finalNode = extractNodeChildrenByPath(elementValue, keyPath);
    return finalNode === null || finalNode === void 0 ? void 0 : finalNode.image;
}
exports.getElementValue = getElementValue;
function getElementPairListValue(elementValuePairListCstNode) {
    var elementValuePairList = extractNodeChildren(elementValuePairListCstNode);
    var result = {};
    if (elementValuePairList === null || elementValuePairList === void 0 ? void 0 : elementValuePairList.elementValuePair.length) {
        elementValuePairList.elementValuePair.forEach(function (elementValuePair) {
            var key = (0, exports.joinIdentifierName)(elementValuePair.children.Identifier);
            var val = getElementValue(getFirstCstNode(elementValuePair.children.elementValue));
            result[key] = val;
        });
    }
    return result;
}
exports.getElementPairListValue = getElementPairListValue;
function createTypeName(baseName) {
    return {
        baseName: baseName,
        argumentsName: []
    };
}
exports.createTypeName = createTypeName;
function typeNameToString(typeName) {
    if (typeof typeName === 'string')
        return typeName;
    if (typeName.argumentsName.length) {
        return (typeName.baseName +=
            '<' + typeName.argumentsName.map(typeNameToString).join(',') + '>');
    }
    return typeName.baseName;
}
exports.typeNameToString = typeNameToString;
function geneTypeArgumentListName(argumentList) {
    var typeArgumentListCtx = extractNodeChildren(argumentList);
    var typeArgument = typeArgumentListCtx === null || typeArgumentListCtx === void 0 ? void 0 : typeArgumentListCtx.typeArgument;
    if (typeArgument === null || typeArgument === void 0 ? void 0 : typeArgument.length) {
        return typeArgument.map(function (type) {
            var _a, _b;
            var typeName = createTypeName('');
            var node = extractNodeChildrenByPath(type, 'referenceType.classOrInterfaceType.classType');
            typeName.baseName = (0, exports.joinIdentifierName)(node.Identifier);
            if ((_a = node.typeArguments) === null || _a === void 0 ? void 0 : _a.length) {
                var child = extractNodeChildren(node.typeArguments);
                if ((_b = child === null || child === void 0 ? void 0 : child.typeArgumentList) === null || _b === void 0 ? void 0 : _b.length) {
                    var childTypeName = geneTypeArgumentListName(child.typeArgumentList);
                    if (childTypeName === null || childTypeName === void 0 ? void 0 : childTypeName.length) {
                        typeName.argumentsName = childTypeName;
                    }
                }
            }
            return typeName;
        });
    }
    return [];
}
exports.geneTypeArgumentListName = geneTypeArgumentListName;
function getAnnotation(ctx) {
    var typeName = extractNodeChildren(ctx.typeName);
    var annotationName = (0, exports.joinIdentifierName)(typeName === null || typeName === void 0 ? void 0 : typeName.Identifier);
    var value = '';
    if (ctx.elementValuePairList) {
        value = getElementPairListValue(ctx.elementValuePairList);
    }
    else if (ctx.elementValue) {
        value = getElementValue(getFirstCstNode(ctx.elementValue));
    }
    return {
        annotationName: annotationName,
        annotationValue: value
    };
}
exports.getAnnotation = getAnnotation;
function getUnannTypeName(unannType) {
    var typeName = createTypeName('');
    var _a = extractNodeChildrenByPath(unannType, 'unannReferenceType.unannClassOrInterfaceType.unannClassType'), Identifier = _a.Identifier, typeArguments = _a.typeArguments;
    typeName.baseName = (0, exports.joinIdentifierName)(Identifier);
    if (typeArguments === null || typeArguments === void 0 ? void 0 : typeArguments.length) {
        var typeArgumentsCtx = extractNodeChildren(typeArguments);
        if (typeArgumentsCtx) {
            typeName.argumentsName = geneTypeArgumentListName(typeArgumentsCtx.typeArgumentList);
        }
    }
    return typeName;
}
exports.getUnannTypeName = getUnannTypeName;
function getVariableList(variableDeclaratorList) {
    var variableDeclaratorListCtx = extractNodeChildren(variableDeclaratorList);
    var variableDeclarator = variableDeclaratorListCtx === null || variableDeclaratorListCtx === void 0 ? void 0 : variableDeclaratorListCtx.variableDeclarator;
    var varTypeList = [];
    if (variableDeclarator === null || variableDeclarator === void 0 ? void 0 : variableDeclarator.length) {
        variableDeclarator.forEach(function (varDeclarator) {
            var variableDeclaratorId = extractNodeChildrenByPath(varDeclarator, 'variableDeclaratorId');
            varTypeList.push((0, exports.joinIdentifierName)(variableDeclaratorId.Identifier));
        });
    }
    return varTypeList;
}
exports.getVariableList = getVariableList;
function getVariableName(variableDeclaratorId) {
    var node = extractNodeChildren(variableDeclaratorId);
    return (0, exports.joinIdentifierName)(node === null || node === void 0 ? void 0 : node.Identifier);
}
exports.getVariableName = getVariableName;
