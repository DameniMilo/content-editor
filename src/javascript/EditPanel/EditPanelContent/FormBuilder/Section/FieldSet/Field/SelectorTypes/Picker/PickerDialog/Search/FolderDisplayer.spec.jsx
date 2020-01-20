import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {FolderDisplayer} from './FolderDisplayer';

jest.mock('react-apollo-hooks', () => {
    let queryResultmock;
    return {
        useQuery: jest.fn(() => {
            return {data: queryResultmock, error: null, loading: false};
        }),
        setQueryResult: r => {
            queryResultmock = r;
        }
    };
});

import {setQueryResult} from 'react-apollo-hooks';

describe('imageListQuery', () => {
    let props;

    beforeEach(() => {
        props = {
            selectedPath: 'oneMoreTimeFolder',
            language: 'en'
        };

        setQueryResult({
            jcr: {
                result: {
                    displayName: 'yolo'
                }
            }
        });
    });

    it('should display the name of the folder', () => {
        const cmp = shallowWithTheme(
            <FolderDisplayer {...props}/>,
            {},
            dsGenericTheme
        )
            .dive();

        expect(cmp.debug()).toContain('yolo');
    });
});
