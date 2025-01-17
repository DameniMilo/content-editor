import {useCallback} from 'react';
import {validate} from '~/Validation/validation';
import {getDynamicFieldSets, getFields} from '~/EditPanel/EditPanel.utils';
import {useContentEditorConfigContext, useContentEditorContext} from '~/ContentEditor.context';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {useFormikContext} from 'formik';

function fillValues(formik, fieldsObj, i18nValues, nonI18nValues, dynamicFieldSets) {
    Object.keys(formik.values).filter(key => formik.values[key] !== formik.initialValues[key]).forEach(key => {
        if (fieldsObj[key]) {
            if (fieldsObj[key].i18n) {
                i18nValues.values[key] = formik.values[key];
            } else {
                nonI18nValues.values[key] = formik.values[key];
            }
        } else if (typeof dynamicFieldSets[key] === 'boolean') {
            nonI18nValues.values[key] = formik.values[key];
        }
    });
}

function fillErrors(validation, fieldsObj, i18nValues) {
    Object.keys(validation).forEach(key => {
        if (fieldsObj[key]) {
            if (fieldsObj[key].i18n) {
                i18nValues.validation[key] = validation[key];
            }
        }
    });
}

export const useSwitchLanguage = () => {
    const formik = useFormikContext();
    const {setI18nContext} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();
    const {lang: currentLanguage, envProps} = useContentEditorConfigContext();

    return useCallback(language => {
        const fields = sections && getFields(sections).filter(field => !field.readOnly);
        const dynamicFieldSets = getDynamicFieldSets(sections);

        const i18nValues = {
            values: {},
            validation: {}
        };
        const nonI18nValues = {
            values: {},
            validation: {}
        };
        const fieldsObj = fields.reduce((r, f) => Object.assign(r, {[f.name]: f}), {});

        fillValues(formik, fieldsObj, i18nValues, nonI18nValues, dynamicFieldSets);
        const newValues = Object.keys(nonI18nValues.values).length > 0 ? {shared: nonI18nValues} : {};

        if (Object.keys(i18nValues.values).length > 0) {
            const validation = validate(sections)(formik.values);
            fillErrors(validation, fieldsObj, i18nValues);
            newValues[currentLanguage] = i18nValues;
        }

        setI18nContext(prev => ({
            ...prev,
            ...newValues
        }));

        if (envProps.switchLanguageCallback) {
            envProps.switchLanguageCallback(language, currentLanguage);
        }
    }, [envProps, formik, sections, setI18nContext, currentLanguage]);
};
