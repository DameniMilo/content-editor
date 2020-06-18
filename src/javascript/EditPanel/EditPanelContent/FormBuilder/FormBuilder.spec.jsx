import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

import FormBuilder from './FormBuilder';

jest.mock('~/ContentEditorSection/ContentEditorSection.context', () => {
    let sectionContextmock;
    return {
        useContentEditorSectionContext: () => {
            return sectionContextmock;
        },
        setSectionContext: c => {
            sectionContextmock = c;
        }
    };
});

jest.mock('~/ContentEditor.context', () => {
    let contextmock;
    return {
        useContentEditorContext: () => {
            return contextmock;
        },
        setContext: c => {
            contextmock = c;
        }
    };
});
import {setContext} from '~/ContentEditor.context';
import {setSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';

describe('FormBuilder component', () => {
    let context;
    let sectionContext;
    beforeEach(() => {
        context = {
            nodeData: {
                isPage: true,
                primaryNodeType: {hasOrderableChildNodes: true}
            }
        };
        sectionContext = {
            sections: [
                {displayName: 'content'},
                {displayName: 'Layout'}
            ]
        };
    });

    it('should display each section', () => {
        setContext(context);
        setSectionContext(sectionContext);
        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme).find('section');

        sectionContext.sections.forEach(section => {
            expect(cmp.find({section}).exists()).toBe(true);
            if (section.displayName === 'content') {
                expect(cmp.props()['data-sel-mode']).toBe('create');
            }
        });
    });

    it('should not display ordering section', () => {
        setContext(context);
        setSectionContext(sectionContext);

        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme).find('section');
        expect(cmp.find('ChildrenSection').exists()).toBeFalsy();
    });

    it('should display ordering section', () => {
        context.nodeData.isPage = false;
        setContext(context);
        setSectionContext(sectionContext);

        const cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).find('section');
        expect(cmp.find('ChildrenSection').exists()).toBeTruthy();
    });

    it('should display ordering section just after content section', () => {
        context.nodeData.isPage = false;
        setContext(context);
        setSectionContext(sectionContext);

        const cmp = shallowWithTheme(<FormBuilder mode="edit"/>, {}, dsGenericTheme).find('section');
        expect(cmp.childAt(1).find('ChildrenSection').exists()).toBeTruthy();
    });

    it('should not display ordering section in create mode', () => {
        context.nodeData.isPage = false;
        setContext(context);
        setSectionContext(sectionContext);

        const cmp = shallowWithTheme(<FormBuilder mode="create"/>, {}, dsGenericTheme).find('section');
        expect(cmp.find('ChildrenSection').exists()).toBe(false);
    });
});
