import {useFormikContext} from 'formik';
import {useTranslation} from 'react-i18next';
import {useContentEditorContext} from '~/ContentEditor.context';
import {Constants} from '~/ContentEditor.constants';
import {Chip, Edit} from '@jahia/moonstone';
import React from 'react';

export const UnsavedChip = () => {
    const formik = useFormikContext();
    const {t} = useTranslation('content-editor');
    const {mode, i18nContext, lang} = useContentEditorContext();

    const updatedLanguages = Object.keys(i18nContext).filter(l => l !== 'shared').map(l => l.toUpperCase());
    if (!i18nContext[lang] && formik.dirty) {
        updatedLanguages.push(lang.toUpperCase());
    }

    const sortedLanguages = updatedLanguages.sort();

    return (updatedLanguages.length > 0 || mode === Constants.routes.baseCreateRoute) && (
        <Chip
            icon={<Edit/>}
            data-sel-role="unsaved-info-chip"
            label={t('content-editor:label.contentEditor.header.chips.unsavedLabel') + ' : ' + sortedLanguages.join(' - ')}
            color="warning"
        />
    );
};
