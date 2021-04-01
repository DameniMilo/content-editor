import {connect} from 'formik';
import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Typography, Toggle} from '@jahia/design-system-kit';
import {compose} from '~/utils';
import {FieldSetPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {FieldContainer} from './Field';

let styles = theme => ({
    fieldsetContainer: {},
    fieldSetTitle: {
        width: 'auto',
        textTransform: 'uppercase',
        padding: `${theme.spacing.unit * 2}px 0`
    },
    fieldsetTitleContainer: {
        borderTop: `1px solid ${theme.palette.ui.omega}`,
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
        minHeight: '74px',
        margin: `0 ${theme.spacing.unit * 6}px 0 ${theme.spacing.unit * 4}px`
    },
    fieldSetDescription: {
        padding: `0 0 ${theme.spacing.unit * 2}px 53px`,
        marginTop: '-7px',
        flexBasis: '100%'
    }
});

const FieldSetCmp = ({fieldset, classes, formik: {values, handleChange}}) => {
    const isDynamicFieldSet = fieldset.dynamic;
    const activatedFieldSet = (values && values[fieldset.name]) || !isDynamicFieldSet;

    return (
        <article className={classes.fieldsetContainer}>
            <div className={classes.fieldsetTitleContainer}>
                {isDynamicFieldSet &&
                <Toggle data-sel-role-dynamic-fieldset={fieldset.name}
                        id={fieldset.name}
                        checked={activatedFieldSet}
                        readOnly={fieldset.readOnly}
                        onChange={handleChange}
                />}

                <Typography component="label" htmlFor={fieldset.name} className={classes.fieldSetTitle} color="alpha" variant="zeta">
                    {fieldset.displayName}
                </Typography>
                {fieldset.description &&
                <Typography component="label" className={classes.fieldSetDescription} color="beta" variant="omega">
                    {fieldset.description}
                </Typography>}
            </div>

            {activatedFieldSet && fieldset.fields.map(field => {
                return <FieldContainer key={field.name} field={field}/>;
            })}
        </article>
    );
};

FieldSetCmp.propTypes = {
    fieldset: FieldSetPropTypes.isRequired,
    classes: PropTypes.object.isRequired,
    formik: PropTypes.object.isRequired
};

export const FieldSet = compose(
    connect,
    withStyles(styles)
)(FieldSetCmp);

FieldSet.displayName = 'FieldSet';
