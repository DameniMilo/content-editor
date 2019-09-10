import {composeActions} from '@jahia/react-material';
import {Constants} from '~/ContentEditor.constants';
import {withFormikAction} from '~/actions/withFormik.action';

export default composeActions(withFormikAction, {
    init: context => {
        // It's weird, formik set dirty when intialValue === currentValue
        // event when form had been modified
        context.enabled = context.formik.dirty;
    },
    onClick: ({formik}) => {
        if (!formik) {
            return;
        }

        const {submitForm, resetForm, setFieldValue} = formik;

        setFieldValue(
            Constants.editPanel.OPERATION_FIELD,
            Constants.editPanel.submitOperation.SAVE,
            false
        );

        submitForm()
            .then(() => resetForm(formik.values));
    }
});
