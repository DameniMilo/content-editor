import {getTreeOfContentWithRequirements} from './CreateNewContent.gql-queries';
import {useQuery} from '@apollo/react-hooks';

const NB_OF_DISPLAYED_RESTRICTED_SUB_NODES = 3;
// eslint-disable-next-line
export const useCreatableNodetypes = (nodeTypes, childNodeName, includeSubTypes, path, uilang, excludedNodeTypes, showOnNodeTypes, transformResultCallback) => {
    const skip = (nodeTypes && nodeTypes.length === 1 && !includeSubTypes);
    const {data, error, loadingTypes} = useQuery(getTreeOfContentWithRequirements, {
        variables: {
            nodeTypes: (nodeTypes && nodeTypes.length) > 0 ? nodeTypes : undefined,
            childNodeName,
            includeSubTypes,
            uilang,
            path,
            excludedNodeTypes,
            showOnNodeTypes
        },
        skip: skip
    });

    if (skip) {
        let result = nodeTypes.map(n => ({name: n}));
        return {
            nodetypes: transformResultCallback ? transformResultCallback(result) : result
        };
    }

    return {
        error,
        loadingTypes,
        nodetypes: (data && data.jcr) ? getNodeTypes(showOnNodeTypes, data, transformResultCallback) : []
    };
};
// eslint-disable-next-line
export async function getCreatableNodetypes(client, nodeTypes, childNodeName, includeSubTypes, path, uilang, excludedNodeTypes, showOnNodeTypes, transformResultCallback) {
    if (nodeTypes && nodeTypes.length === 1 && !includeSubTypes) {
        let result = nodeTypes.map(n => ({name: n}));
        return transformResultCallback ? transformResultCallback(result) : result;
    }

    const {data} = await client.query({
        query: getTreeOfContentWithRequirements,
        variables: {
            nodeTypes: (nodeTypes && nodeTypes.length) > 0 ? nodeTypes : undefined,
            childNodeName,
            includeSubTypes,
            uilang,
            path,
            excludedNodeTypes,
            showOnNodeTypes
        }
    });

    return getNodeTypes(showOnNodeTypes, data, transformResultCallback);
}

function getNodeTypes(showOnNodeTypes, data, transformResultCallback) {
    const nodeTypeNotDisplayed = (showOnNodeTypes && showOnNodeTypes.length > 0 && data.jcr.nodeByPath && !data.jcr.nodeByPath.isNodeType);
    if (nodeTypeNotDisplayed) {
        return [];
    }

    const resolvedTypes = data.forms.contentTypesAsTree
        .map(category => {
            if (category.children && category.children.length > 0) {
                return category.children;
            }

            return [category];
        })
        .reduce((sum, types) => {
            types.forEach(type => sum.push(type));
            return sum;
        }, []);

    return transformResultCallback ? transformResultCallback(resolvedTypes) : resolvedTypes || [];
}

export function transformNodeTypesToActions(nodeTypes) {
    if (nodeTypes.length <= NB_OF_DISPLAYED_RESTRICTED_SUB_NODES) {
        return nodeTypes
            .filter(f => f.name !== 'jnt:resource')
            .map(nodeType => ({
                key: nodeType.name,
                actionKey: nodeType.name,
                openEditor: true,
                nodeTypes: [nodeType.name],
                buttonLabel: 'content-editor:label.contentEditor.CMMActions.createNewContent.contentOfType',
                buttonLabelParams: {typeName: nodeType.label}
            }));
    }
}

export const filterTree = (tree, selectedType, filter) => tree
    .map(category => {
        const filteredNodes = filter ? category.children.filter(node => {
            return node.name.toLowerCase().includes(filter) || node.label.toLowerCase().includes(filter);
        }) : category.children;

        // Never close selected content category
        const isCategorySelected = selectedType && isOpenableEntry(category) ? category.id === selectedType.parent.id : null;

        return {
            ...category,
            opened: filter ? true : (category.opened || isCategorySelected),
            selected: Boolean(!isOpenableEntry(category) && selectedType && selectedType.id === category.id),
            children: filteredNodes.map(node => {
                return {
                    ...node,
                    selected: isCategorySelected && selectedType.id === node.id
                };
            })
        };
    })
    .filter(category => {
        if (!isOpenableEntry(category)) {
            return filter ?
                category.name.toLowerCase().includes(filter) || category.label.toLowerCase().includes(filter) :
                true;
        }

        return category.children.length !== 0;
    });

export const isOpenableEntry = entry => {
    return (entry.nodeType && entry.nodeType.mixin) || entry.name === 'nt:base';
};
