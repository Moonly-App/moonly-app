import { checkDocument } from './getFromAST';
import { cloneDeep } from '../util/cloneDeep';
var TYPENAME_FIELD = {
    kind: 'Field',
    name: {
        kind: 'Name',
        value: '__typename',
    },
};
function addTypenameToSelectionSet(selectionSet, isRoot) {
    if (isRoot === void 0) { isRoot = false; }
    if (selectionSet.selections) {
        if (!isRoot) {
            var alreadyHasThisField = selectionSet.selections.some(function (selection) {
                return (selection.kind === 'Field' &&
                    selection.name.value === '__typename');
            });
            if (!alreadyHasThisField) {
                selectionSet.selections.push(TYPENAME_FIELD);
            }
        }
        selectionSet.selections.forEach(function (selection) {
            if (selection.kind === 'Field') {
                if (selection.name.value.lastIndexOf('__', 0) !== 0 &&
                    selection.selectionSet) {
                    addTypenameToSelectionSet(selection.selectionSet);
                }
            }
            else if (selection.kind === 'InlineFragment') {
                if (selection.selectionSet) {
                    addTypenameToSelectionSet(selection.selectionSet);
                }
            }
        });
    }
}
function removeConnectionDirectiveFromSelectionSet(selectionSet) {
    if (selectionSet.selections) {
        selectionSet.selections.forEach(function (selection) {
            if (selection.kind === 'Field' &&
                selection &&
                selection.directives) {
                selection.directives = selection.directives.filter(function (directive) {
                    var willRemove = directive.name.value === 'connection';
                    if (willRemove) {
                        if (!directive.arguments ||
                            !directive.arguments.some(function (arg) { return arg.name.value === 'key'; })) {
                            console.warn('Removing an @connection directive even though it does not have a key. ' +
                                'You may want to use the key parameter to specify a store key.');
                        }
                    }
                    return !willRemove;
                });
            }
        });
        selectionSet.selections.forEach(function (selection) {
            if (selection.kind === 'Field') {
                if (selection.selectionSet) {
                    removeConnectionDirectiveFromSelectionSet(selection.selectionSet);
                }
            }
            else if (selection.kind === 'InlineFragment') {
                if (selection.selectionSet) {
                    removeConnectionDirectiveFromSelectionSet(selection.selectionSet);
                }
            }
        });
    }
}
export function addTypenameToDocument(doc) {
    checkDocument(doc);
    var docClone = cloneDeep(doc);
    docClone.definitions.forEach(function (definition) {
        var isRoot = definition.kind === 'OperationDefinition';
        addTypenameToSelectionSet(definition.selectionSet, isRoot);
    });
    return docClone;
}
export function removeConnectionDirectiveFromDocument(doc) {
    checkDocument(doc);
    var docClone = cloneDeep(doc);
    docClone.definitions.forEach(function (definition) {
        removeConnectionDirectiveFromSelectionSet(definition.selectionSet);
    });
    return docClone;
}
//# sourceMappingURL=queryTransform.js.map