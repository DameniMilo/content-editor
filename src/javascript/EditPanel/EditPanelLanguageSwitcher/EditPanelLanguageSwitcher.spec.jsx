import React from 'react';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';
import {EditPanelLanguageSwitcher} from './';

jest.mock('~/ContentEditor.context', () => {
    return {
        useContentEditorConfigContext: () => ({
            lang: 'fr'
        }),
        useContentEditorContext: () => ({
            i18nContext: {},
            setI18nContext: jest.fn()
        })
    };
});

describe('EditPanelLanguageSwitcher', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            siteInfo: {
                languages: [
                    {
                        language: 'en',
                        displayName: 'English'
                    }
                ]
            },
            formik: {}
        };
    });

    it('should show language switcher', () => {
        const cmp = shallowWithTheme(
            <EditPanelLanguageSwitcher {...defaultProps}/>,
            {},
            dsGenericTheme
        );

        expect(cmp.find('Dropdown').exists()).toBe(true);
    });
});
