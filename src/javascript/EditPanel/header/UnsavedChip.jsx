import {useFormikContext} from 'formik';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/ContentEditor.context';
import {Constants} from '~/ContentEditor.constants';
import {Chip, Edit} from '@jahia/moonstone';
import React, {useMemo} from 'react';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import {getFields} from '~/EditPanel/EditPanel.utils';
import isEquals from 'react-fast-compare';

export const UnsavedChip = () => {
    const formik = useFormikContext();
    const {t} = useTranslation('content-editor');
    const {mode, i18nContext, lang, siteInfo} = useContentEditorContext();
    const {sections} = useContentEditorSectionContext();

    const fields = useMemo(() => sections && getFields(sections), [sections]);

    const updatedLanguages = Object.keys(i18nContext).reduce((a, k) => ({...a, [k]: true}), {});
    if ((!updatedLanguages[lang] || !updatedLanguages.shared) && formik.dirty) {
        Object.keys(formik.values).filter(key => !isEquals(formik.values[key], formik.initialValues[key])).forEach(key => {
            const field = fields.find(f => f.name === key);
            const langToAdd = (field && field.i18n) ? lang : 'shared';
            updatedLanguages[langToAdd] = true;
        });
    }

    const sortedLanguages = Object.keys(updatedLanguages).filter(l => l !== 'shared').map(l => l.toUpperCase()).sort();

    let message;
    if (updatedLanguages.shared || sortedLanguages.length === siteInfo.languages.length) {
        message = ' ' + t('content-editor:label.contentEditor.header.chips.inAllLanguages');
    } else if (sortedLanguages.length >= 4) {
        message = ' ' + t('content-editor:label.contentEditor.header.chips.inCountLanguages', {count: sortedLanguages.length});
    } else {
        message = ' : ' + sortedLanguages.join(' - ');
    }

    return (Object.keys(updatedLanguages).length > 0 || mode === Constants.routes.baseCreateRoute) && (
        <Chip
            icon={<Edit/>}
            data-sel-role="unsaved-info-chip"
            label={t('content-editor:label.contentEditor.header.chips.unsavedLabel') + message}
            color="warning"
        />
    );
};
