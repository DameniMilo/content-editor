import Tag from './Tag';
import Text from './Text';
import TextArea from './TextArea';
import RichText from './RichText';
import ChoiceList from './ChoiceList';
import registerChoiceListActions from './ChoiceList/ChoiceList.actions';
import registerChoiceListOnChange from './ChoiceList/ChoiceList.onChange';
import registerSelectorTypesOnChange from '~/SelectorTypes/SelectorTypes.onChange';
import DateTimePicker from './DateTimePicker';
import {registerPickerConfig} from './Picker/Picker.configs';
import {getPickerSelectorType} from './Picker/Picker.utils';
import Checkbox from './Checkbox';
import Category from './Category';
import {registerPickerActions} from './Picker/actions';
import {registry} from '@jahia/ui-extender';
import SystemName from './SystemName';
import {ContentPickerSelectorType} from './Picker/ContentPicker';
import {MediaPickerSelectorType} from './Picker/MediaPicker';
import registerSystemNameOnChange from './SystemName/SystemName.onChange';
import Color from './Color';

const adaptDateProperty = (field, property) => {
    return field.multiple ? property.notZonedDateValues : property.notZonedDateValue;
};

export const registerSelectorTypes = ceRegistry => {
    ceRegistry.add('selectorType', 'Category', {cmp: Category, supportMultiple: true});
    ceRegistry.add('selectorType', 'Tag', {cmp: Tag, supportMultiple: true});
    ceRegistry.add('selectorType', 'Text', {
        cmp: Text,
        supportMultiple: false,
        adaptValue: (field, property) => {
            if (field.selectorOptions?.find(option => option.name === 'password')) {
                return field.multiple ? property.decryptedValues : property.decryptedValue;
            }

            return field.multiple ? property.values : property.value;
        }
    });
    ceRegistry.add('selectorType', 'TextArea', {cmp: TextArea, supportMultiple: false});
    ceRegistry.add('selectorType', 'RichText', {cmp: RichText, supportMultiple: false});
    ceRegistry.add('selectorType', 'Color', {cmp: Color, supportMultiple: false});
    ceRegistry.add('selectorType', 'DateTimePicker', {
        cmp: DateTimePicker,
        supportMultiple: false,
        adaptValue: adaptDateProperty
    });
    ceRegistry.add('selectorType', 'DatePicker', {
        cmp: DateTimePicker,
        supportMultiple: false,
        adaptValue: adaptDateProperty
    });

    ceRegistry.add('selectorType', 'Checkbox', {
        cmp: Checkbox,
        initValue: field => {
            return field.mandatory && !field.multiple ? false : undefined;
        },
        adaptValue: (field, property) => {
            return field.multiple ? property.values.map(value => value === 'true') : property.value === 'true';
        },
        supportMultiple: false
    });

    ceRegistry.add('selectorType', 'ContentPicker', {...ContentPickerSelectorType});
    ceRegistry.add('selectorType', 'MediaPicker', {...MediaPickerSelectorType});
    registerPickerConfig(ceRegistry);
    ceRegistry.add('selectorType', 'Picker', {resolver: options => getPickerSelectorType(options)});
    registerPickerActions(ceRegistry);

    ceRegistry.add('selectorType', 'Choicelist', {
        cmp: ChoiceList,
        supportMultiple: true,
        initValue: field => {
            const defaultValueConstraints = field.valueConstraints.filter(v => v?.properties.find(p => p.name === 'defaultProperty' && p.value === 'true'));

            if (defaultValueConstraints.length > 0) {
                return field.multiple ? defaultValueConstraints.map(v => v.value.string) : defaultValueConstraints[0].value.string;
            }
        }
    });
    registerChoiceListActions(ceRegistry);
    registerSelectorTypesOnChange(ceRegistry);
    registerChoiceListOnChange(ceRegistry);

    ceRegistry.add('selectorType', 'SystemName', {cmp: SystemName, supportMultiple: false});
    registerSystemNameOnChange(ceRegistry);
};

export const resolveSelectorType = ({selectorType, selectorOptions, displayName, ...field}) => {
    let selector = registry.get('selectorType', selectorType);
    if (selector) {
        if (selector.resolver) {
            return selector.resolver(selectorOptions);
        }

        selector.key = selectorType;
        return selector;
    }

    if (selectorType) {
        console.warn(`No renderer component for ${selectorType} selectorType`);
    } else {
        console.error(`Field ${displayName} has no selectorType !`, {selectorOptions, displayName, ...field});
    }

    return registry.get('selectorType', 'Text');
};
