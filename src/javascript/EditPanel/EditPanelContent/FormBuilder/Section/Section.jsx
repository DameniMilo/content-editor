import React from 'react';
import PropTypes from 'prop-types';

import {withStyles} from '@material-ui/core';
import {Typography} from '@jahia/design-system-kit';

import {SectionPropTypes} from '~/FormDefinitions/FormData.proptypes';
import {FieldSet} from '../FieldSet';

import classnames from 'clsx';
import {Plus, Minus} from 'mdi-material-ui';

const styles = theme => ({
    section: {
        borderBottom: '1px solid var(--color-gray_light40)',
        paddingBottom: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 2,
        backgroundColor: theme.palette.ui.epsilon
    },
    sectionTitle: {
        textTransform: 'uppercase',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`
    },
    header: {
        alignItems: 'center',
        '&:hover': {
            backgroundColor: 'var(--color-gray_light40)',
            cursor: 'pointer'
        }
    },
    expandIcon: {
        marginLeft: `${theme.spacing.unit * 4}px`
    }
});

const SectionCmp = ({section, classes, expanded = true, toggleExpanded = () => {}}) => {
    const hideFieldSets = fieldSet => {
        if (!fieldSet) {
            return false;
        }

        if (!fieldSet.displayed) {
            return true;
        }

        // We must hide fieldSet in the section when the fieldSet is not dynamic and
        // the fieldSet doesn't contain any fields (empty).
        return !fieldSet.dynamic && fieldSet.fields.length === 0;
    };

    return (
        <section className={classes.section} data-sel-content-editor-fields-group={section.displayName}>
            <div className={classnames('flexRow', classes.header)} onClick={() => toggleExpanded(section.name, !expanded)}>
                {expanded ? <Minus className={classes.expandIcon}/> : <Plus className={classes.expandIcon}/>}
                <Typography component="h2"
                            className={classes.sectionTitle}
                            color="alpha"
                            variant="gamma"
                >{section.displayName}
                </Typography>
            </div>

            {section.fieldSets.map(fieldset => {
                if (hideFieldSets(fieldset)) {
                    return null;
                }

                return expanded && <FieldSet key={fieldset.name} fieldset={fieldset}/>;
            })}
        </section>
    );
};

SectionCmp.propTypes = {
    section: SectionPropTypes.isRequired,
    classes: PropTypes.object.isRequired,
    expanded: PropTypes.bool,
    toggleExpanded: PropTypes.func
};

export const Section = withStyles(styles)(SectionCmp);
Section.displayName = 'Section';
