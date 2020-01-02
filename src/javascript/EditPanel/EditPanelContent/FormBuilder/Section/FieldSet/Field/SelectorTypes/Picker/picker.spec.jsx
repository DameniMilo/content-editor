import React from 'react';
import {Picker} from './Picker';
import {shallowWithTheme} from '@jahia/test-framework';
import {dsGenericTheme} from '@jahia/design-system-kit';

jest.mock('formik', () => {
    let formikvaluesmock;

    return {
        connect: Cmp => props => (
            <Cmp {...props} formik={{values: formikvaluesmock}}/>
        )
    };
});

jest.mock('./Picker.utils', () => {
    return {
        extractConfigs: () => ({
            pickerConfig: {
                picker: {
                    pickerInput: {
                        usePickerInputData: () => {
                            return {
                                fieldData: {},
                                loading: false
                            };
                        }
                    }
                }
            },
            nodeTreeConfigs: {

            }
        })
    };
});

describe('picker', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            field: {
                displayName: 'imageid',
                name: 'imageid',
                selectorType: 'MediaPicker',
                readOnly: false
            },
            id: 'imageid',
            editorContext: {site: 'digitall'},
            setActionContext: jest.fn()
        };
    });

    it('should give to picker input readOnly', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.find('Picker').props().readOnly).toBe(false);
    });

    it('should close the dialog by default', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        expect(cmp.find('PickerDialog').props().isOpen).toBe(false);
    });

    it('should open the dialog when clicking on the picker input', () => {
        const cmp = shallowWithTheme(
            <Picker {...defaultProps}/>,
            {},
            dsGenericTheme
        )
            .dive()
            .dive();

        cmp.find('Picker').simulate('click');

        expect(cmp.find('PickerDialog').props().isOpen).toBe(true);
    });
});