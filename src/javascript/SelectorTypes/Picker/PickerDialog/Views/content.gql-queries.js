import gql from 'graphql-tag';
import {PredefinedFragments} from '@jahia/data-helper';

export const SubContentsCountQuery = gql`
    query subContentsCountQuery($path: String!, $typeFilter: [String]!, $limit: Int!) {
        forms {
            subContentsCount(nodePath: $path, includeTypes: $typeFilter, limit: $limit)
        }
    }
`;

export const ContentDialogPickerQuery = gql`
    query pickerDialogQuery(
        $path: String!,
        $recursionTypesFilter: [String]!,
        $typeFilter: [String]!,
        $selectableTypeFilter: [String]!,
        $language: String!,
        $offset: Int!,
        $limit: Int!,
        $fieldSorter: InputFieldSorterInput
    ) {
        jcr {
            result: nodeByPath(path: $path) {
                descendants(
                    offset: $offset,
                    limit: $limit,
                    typesFilter: {types: $typeFilter, multi: ANY},
                    recursionTypesFilter: {multi: NONE, types: $recursionTypesFilter},  
                    fieldSorter: $fieldSorter
                ) {
                    pageInfo {
                        totalCount
                    }
                    nodes {
                        displayName(language: $language)
                        primaryNodeType {
                            name
                            typeName: displayName(language: $language)
                            icon
                        }
                        createdBy: property(name: "jcr:createdBy") {
                            value
                        }
                        lastModified: property(name: "jcr:lastModified") {
                            value
                        }
                        isDisplayableNode
                        isNodeType(type:{types: $selectableTypeFilter, multi: ANY})
                        # Specific section for images
                        width: property(name: "j:width") {
                            value
                        }
                        height: property(name: "j:height") {
                            value
                        }
                        metadata: children(names: ["jcr:content"]) {
                            nodes {
                                mimeType: property(name: "jcr:mimeType") {
                                    value
                                }
                            }
                        }
                        ...NodeCacheRequiredFields
                    }
                }
                ...NodeCacheRequiredFields
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;

export const SearchContentDialogPickerQuery = gql`
    query searchPickerQuery(
        $searchPaths: [String]!,
        $language: String!,
        $searchTerms: String!,
        $searchName: String!,
        $searchSelectorType: String!,
        $selectableTypeFilter: [String]!,
        $offset: Int!,
        $limit: Int!
    ) {
        jcr {
            result: nodesByCriteria(
                criteria: {
                    language: $language,
                    nodeType: $searchSelectorType,
                    paths: $searchPaths,
                    nodeConstraint: {any: [
                        {contains: $searchTerms}
                        {contains: $searchTerms, property: "jcr:content"}
                        {contains: $searchTerms, property: "jcr:description"}
                        {contains: $searchTerms, property: "jcr:title"}
                        {contains: $searchTerms, property: "j:keywords"}
                        {like: $searchName, property: "j:nodename"}
                        {equals: $searchTerms, property: "j:tagList"}
                    ]},
                    ordering: {orderType: DESC, property: "score()"}
                },
                offset: $offset,
                limit: $limit
            ) {
                pageInfo {
                    totalCount
                }
                nodes {
                    displayName(language: $language)
                    name
                    primaryNodeType {
                        name
                        typeName: displayName(language: $language)
                        icon
                    }
                    createdBy: property(name: "jcr:createdBy") {
                        value
                    }
                    isDisplayableNode
                    isNodeType(type:{types: $selectableTypeFilter, multi: ANY})
                    lastModified: property(name: "jcr:lastModified") {
                        value
                    }

                    # Specific section for images
                    width: property(name: "j:width") {
                        value
                    }
                    height: property(name: "j:height") {
                        value
                    }
                    metadata: children(names: ["jcr:content"]) {
                        nodes {
                            mimeType: property(name: "jcr:mimeType") {
                                value
                            }
                        }
                    }
                    ...NodeCacheRequiredFields
                }
            }
        }
    }
    ${PredefinedFragments.nodeCacheRequiredFields.gql}
`;
