import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import {Badge, Toggle, Typography} from '@jahia/design-system-kit';
import {ChildrenSectionPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {ManualOrdering} from './ManualOrdering';
import {useTranslation} from 'react-i18next';
import {AutomaticOrdering} from './AutomaticOrdering';
import {Constants} from '~/ContentEditor.constants';
import {compose} from '~/utils';
import {Public} from '@material-ui/icons';
import {getAutomaticOrderingFieldSet} from './AutomaticOrdering/AutomaticOrdering.utils';
import {useContentEditorSectionContext} from '~/ContentEditorSection/ContentEditorSection.context';
import FieldSetsDisplay from '~/EditPanel/EditPanelContent/FormBuilder/FieldSet/FieldSetsDisplay/FieldSetsDisplay';
import {orderingSectionFieldSetMap} from '../../FormBuilder.fieldSetHelp';
import {useFormikContext} from 'formik';

const styles = theme => ({
    fieldSetTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        margin: `0 ${theme.spacing.unit * 6}px 0 0`,
        padding: `${theme.spacing.unit * 2}px 0`,
        borderTop: '1px solid var(--color-gray_light40)'
    },
    fieldSetTitle: {
        width: 'auto',
        textTransform: 'uppercase'
    },
    automaticSwitchContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: `-${theme.spacing.unit}px`
    },
    automaticSwitch: {
        width: 'auto',
        padding: `${theme.spacing.unit * 2}px 0`,
        textTransform: 'uppercase'
    }
});

export const ChildrenSectionCmp = ({section, classes, canManuallyOrder, canAutomaticallyOrder}) => {
    const {values, handleChange} = useFormikContext();
    const {t} = useTranslation('content-editor');
    const {sections} = useContentEditorSectionContext();

    const isAutomaticOrder = canAutomaticallyOrder && values[Constants.ordering.automaticOrdering.mixin];
    const automaticOrderingFieldSet = canAutomaticallyOrder && getAutomaticOrderingFieldSet(sections);

    return (
        <>
            <article>
                <div className={classes.fieldSetTitleContainer}>
                    <Typography component="label" htmlFor={t('content-editor:label.contentEditor.section.listAndOrdering.ordering')} className={classes.fieldSetTitle} color="alpha" variant="zeta">
                        {t('content-editor:label.contentEditor.section.listAndOrdering.ordering')}
                    </Typography>
                    <Badge
                           badgeContent={t('content-editor:label.contentEditor.edit.sharedLanguages')}
                           icon={<Public/>}
                           variant="normal"
                           color="primary"
                    />
                </div>

                <div>
                    {(canAutomaticallyOrder && automaticOrderingFieldSet) &&
                    <>
                        <Typography color="beta" variant="zeta" htmlFor={t('content-editor:label.contentEditor.section.listAndOrdering.description')}>
                            {t('content-editor:label.contentEditor.section.listAndOrdering.description')}
                        </Typography>

                        <div className={classes.automaticSwitchContainer}>
                            <Toggle data-sel-role-automatic-ordering={Constants.ordering.automaticOrdering.mixin}
                                    id={Constants.ordering.automaticOrdering.mixin}
                                    checked={isAutomaticOrder}
                                    readOnly={automaticOrderingFieldSet.readOnly}
                                    onChange={handleChange}
                            />
                            <Typography component="label" htmlFor={Constants.ordering.automaticOrdering.mixin} className={classes.automaticSwitch} color="alpha" variant="zeta">
                                {t('content-editor:label.contentEditor.section.listAndOrdering.automatic')}
                            </Typography>
                        </div>

                        {!isAutomaticOrder && canManuallyOrder && <ManualOrdering/>}
                        {isAutomaticOrder && <AutomaticOrdering/>}
                    </>}

                    {!canAutomaticallyOrder && canManuallyOrder && <ManualOrdering/>}
                </div>
            </article>
            <FieldSetsDisplay fieldSets={section.fieldSets} fieldSetMapFcn={orderingSectionFieldSetMap}/>
        </>
    );
};

ChildrenSectionCmp.propTypes = {
    section: ChildrenSectionPropTypes.isRequired,
    classes: PropTypes.object.isRequired,
    canManuallyOrder: PropTypes.bool.isRequired,
    canAutomaticallyOrder: PropTypes.bool.isRequired
};

export const ChildrenSection = compose(
    withStyles(styles)
)(ChildrenSectionCmp);
ChildrenSection.displayName = 'ChildrenSection';
