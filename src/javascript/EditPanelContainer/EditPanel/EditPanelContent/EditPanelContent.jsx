import React, {useState} from 'react';
import {FullWidthContent, TwoColumnsContent} from '@jahia/layouts';
import {ContentPreview} from '@jahia/react-apollo';
import {PreviewComponent} from '@jahia/react-material';
import {Typography} from '@jahia/ds-mui-theme';
import * as PropTypes from 'prop-types';
import FormBuilder from './FormBuilder';
import {compose} from 'react-apollo';
import {withStyles} from '@material-ui/core';
import {translate} from 'react-i18next';
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab';
import {setPreviewRefetcher} from '../../EditPanel.refetches';

const styles = theme => ({
    twoColumnsRoot: {
        minHeight: 0
    },
    fullWidthRoot: {
        backgroundColor: theme.palette.ui.alpha,
        padding: (theme.spacing.unit * 4) + 'px ' + (theme.spacing.unit * 4) + 'px 0'
    },
    fullWidthForm: {
        overflow: 'auto'
    },
    left: {
        overflow: 'auto'
    },
    toggleButtons: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: '1rem'
    }
});

const DetailsPreviewComponent = () => (<></>);

export const EditPanelContent = ({t, editorContext, classes, fields, siteInfo}) => {
    const [previewMode, setPreviewMode] = useState('preview');

    const workspace = 'EDIT';
    const PreviewCmp = previewMode === 'preview' ? (
        <ContentPreview path={editorContext.path}
                        language={editorContext.lang}
                        workspace={workspace}
                        templateType="html"
                        view="cm"
                        contextConfiguration="preview"
                        fetchPolicy="network-only"
                        setRefetch={refetchingData => setPreviewRefetcher(refetchingData)}
        >
            {data => <PreviewComponent data={data.jcr ? data.jcr : {}} workspace={workspace}/>}
        </ContentPreview>
    ) : previewMode === 'details' ? <DetailsPreviewComponent/> : null;

    return (
        <>
            <ToggleButtonGroup exclusive
                               value={previewMode}
                               className={classes.toggleButtons}
                               onChange={(_, mode) => {
                                   if (mode) {
                                       setPreviewMode(mode);
                                   }
                               }}
            >
                <ToggleButton value="preview">
                    <Typography variant="caption" color="inherit">
                        {t('content-editor:label.contentEditor.preview.toggleButtons.preview')}
                    </Typography>
                </ToggleButton>
                <ToggleButton value="details">
                    <Typography variant="caption" color="inherit">
                        {t('content-editor:label.contentEditor.preview.toggleButtons.details')}
                    </Typography>
                </ToggleButton>
                <ToggleButton value="off">
                    <Typography variant="caption" color="inherit">
                        {t('content-editor:label.contentEditor.preview.toggleButtons.off')}
                    </Typography>
                </ToggleButton>
            </ToggleButtonGroup>

            {
                PreviewCmp ?
                    <TwoColumnsContent classes={{root: classes.twoColumnsRoot, left: classes.left, right: classes.right}}
                                       rightCol={PreviewCmp}
                    >
                        <FormBuilder fields={fields} siteInfo={siteInfo} editorContext={editorContext}/>
                    </TwoColumnsContent> :
                    <FullWidthContent classes={{root: classes.fullWidthRoot}}>
                        <FormBuilder classes={{form: classes.fullWidthForm}} fields={fields} siteInfo={siteInfo} editorContext={editorContext}/>
                    </FullWidthContent>
            }
        </>
    );
};

EditPanelContent.propTypes = {
    editorContext: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    fields: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    siteInfo: PropTypes.object.isRequired
};

export default compose(
    translate(),
    withStyles(styles)
)(EditPanelContent);