import EditPanelConstants from './EditPanelConstants';
import {resolveSelectorType} from './EditPanelContent/FormBuilder/Section/FieldSet/Field/SelectorTypes/SelectorTypes.utils';

export function isSystemField(fieldKey) {
    return fieldKey in EditPanelConstants.systemFields;
}

/**
 * This function perform creation of object contains only dynamic fieldSets
 * The dynamic fieldSet retrieved from sections will be added to object with
 * name as key and activated property as value.
 *
 * Example:
 * {
 *     "jmix:tagged": true,
 *     "jmix:keywords": false,
 *     ...
 * }
 *
 * Note: the activated property will be used to determine if the dynamic
 * fieldSet will be active on the form or not.
 *
 * @param sections array object contains sections
 * @returns dynamic fieldSets with key value object
 */
export function getDynamicFieldSets(sections) {
    return sections.reduce((result, section) => {
        const fieldSets = section
            .fieldSets
            .filter(filedSet => filedSet.dynamic)
            .reduce((result, fieldSet) => ({...result, [fieldSet.name]: fieldSet.activated}), {});

        return {...result, ...fieldSets};
    }, []);
}

/**
 * The function used to retrieve all the fields within fieldSets of each section
 *
 * There is specific case:
 * - When the sectionName parameter is provided, the function returns all
 * the fields in fieldSets of only the specified section.
 *
 * @param sections    array object contains sections
 * @param sectionName string value refer to the section name
 * @returns fields    array object contains fields
 */
export function getFields(sections, sectionName) {
    return sections.reduce((result, section) => {
        let fields = [];

        if (!sectionName || sectionName === section.name) {
            fields = section
                .fieldSets
                .reduce((result, fieldset) => ([...result, ...fieldset.fields]), []);
        }

        return [...result, ...fields];
    }, []);
}

export function getDataToMutate(nodeData = {}, formValues = {}, sections, lang) {
    const keys = Object.keys(formValues).filter(key => !isSystemField(key));
    const fields = sections && getFields(sections).filter(field => !field.readOnly);

    const mixinsToMutate = getMixinsToMutate(nodeData, formValues, sections);

    let propsToSave = [];
    let propsToDelete = [];

    keys.forEach(key => {
        const field = fields.find(field => field.name === key);

        if (field) {
            const value = formValues[key];
            if (value) {
                const fieldType = field.requiredType;

                const valueObj = {};

                if (field.multiple) {
                    valueObj.values = value;

                    if (fieldType === 'DATE') {
                        valueObj.notZonedDateValues = value;
                    }
                } else {
                    // In case we have field of type decimal or double, we should store number
                    // with a decimal point separator instead of decimal comma separator into JCR.
                    valueObj.value = fieldType === 'DECIMAL' || fieldType === 'DOUBLE' ? value && value.replace(',', '.') : value;

                    if (fieldType === 'DATE') {
                        valueObj.notZonedDateValue = value;
                    }
                }

                propsToSave.push({
                    name: key,
                    type: fieldType,
                    ...valueObj,
                    language: lang
                });
            } else {
                const nodeProperty = nodeData.properties.find(prop => prop.name === key);
                if (nodeProperty && (field.multiple ? nodeProperty.values : nodeProperty.value)) {
                    propsToDelete.push(key);
                }
            }
        }
    });

    return {
        propsToSave,
        propsToDelete,
        mixinsToAdd: mixinsToMutate.mixinsToAdd,
        mixinsToDelete: mixinsToMutate.mixinsToDelete
    };
}

export function encodeJCRPath(path) {
    return path.split('/').map(entry => encodeURIComponent(entry)).join('/');
}

export function extractRangeConstraints(constraint) {
    // Validate constraint
    if (!RegExp('[\\(\\[]+.*,.*[\\)\\]]').test(constraint)) {
        throw new Error(`unable to parse constraint ${constraint}`);
    }

    return {
        lowerBoundary: constraint.substring(1, constraint.lastIndexOf(',')).trim(),
        disableLowerBoundary: constraint.startsWith('('),
        upperBoundary: constraint.substring(constraint.lastIndexOf(',') + 1, constraint.length - 1).trim(),
        disableUpperBoundary: constraint.endsWith(')')
    };
}

function getMixinsToMutate(nodeData = {}, formValues = {}, sections) {
    let mixinsToAdd = [];
    let mixinsToDelete = [];

    // Retrieve dynamic fieldSets
    const dynamicFieldSets = getDynamicFieldSets(sections);

    // Get keys of the dynamic fieldSets object
    const mixins = Object.keys(dynamicFieldSets);

    // Check if node contains the mixin
    const hasNodeMixin = mixin => nodeData.mixinTypes.find(mixinType => mixinType.name === mixin);

    /**
     * Iterate trough mixins:
     * - Check if the node has the mixin
     * - Check if the value is defined on the form values
     *
     * Depending on the conditions, add the mixin to the dedicated
     * remove/add array.
     **/
    mixins.forEach(mixin => {
        const value = formValues[mixin];

        if (!hasNodeMixin(mixin) && value) {
            mixinsToAdd.push(mixin);
        } else if (hasNodeMixin(mixin) && !value) {
            mixinsToDelete.push(mixin);
        }
    });

    // Return object contains an array of mixins to add and an array of mixins to delete
    return {
        mixinsToAdd,
        mixinsToDelete
    };
}

export const getFieldValue = (field, nodeData) => {
    const property = nodeData.properties.find(prop => prop.name === field.name);
    if (!property) {
        return;
    }

    const selectorType = resolveSelectorType(field);
    if (selectorType) {
        if (selectorType.formatValue) {
            return selectorType.formatValue(property.value);
        }

        if (selectorType.key === 'DateTimePicker' || selectorType.key === 'DatePicker') {
            return field.multiple ? property.notZonedDateValues : property.notZonedDateValue;
        }
    }

    return field.multiple ? property.values : property.value;
};
