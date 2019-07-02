import {Select} from '@jahia/design-system-kit';
import Input from '@material-ui/core/Input';
import {withStyles, MenuItem} from '@material-ui/core';
import {Field} from 'formik';
import React from 'react';
import PropTypes from 'prop-types';

const styles = () => ({
    selectField: {
        width: '100%'
    }
});

const ChoiceList = ({classes, field, id}) => {
    return (
        <Field
            name={field.formDefinition.name}
            render={props => {
                const formikField = props.field;
                return (
                    <Select className={classes.selectField}
                            {...formikField}
                            // eslint-disable-next-line react/prop-types
                            value={formikField.value || ''}
                            inputProps={{
                                name: field.formDefinition.name,
                                id: id
                            }}
                            input={<Input id={id} name={field.formDefinition.name} readOnly={field.formDefinition.readOnly}/>}
                    >
                        {
                            field.formDefinition.valueConstraints.map(item => {
                                return (
                                    <MenuItem key={item.value.string} value={item.value.string}>{item.displayValue}</MenuItem>
                                );
                            })
                        }
                    </Select>
                );
            }}
        />
    );
};

ChoiceList.propTypes = {
    id: PropTypes.string.isRequired,
    field: PropTypes.shape({
        data: PropTypes.shape({
            value: PropTypes.string
        }),
        formDefinition: PropTypes.shape({
            name: PropTypes.string.isRequired,
            valueConstraints: PropTypes.arrayOf(
                PropTypes.shape({
                    displayValue: PropTypes.string.isRequired,
                    value: PropTypes.shape({
                        string: PropTypes.string.isRequired
                    }).isRequired
                })).isRequired,
            readOnly: PropTypes.bool
        }).isRequired
    }).isRequired,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ChoiceList);
