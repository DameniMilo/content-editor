import React, {useContext, useEffect, useState} from 'react';
import {withNotifications} from '@jahia/react-material';
import {DisplayActions, DisplayAction} from '@jahia/ui-extender';
import PropTypes from 'prop-types';
import {withApollo} from 'react-apollo';
import {compose} from '~/utils';
import {useTranslation} from 'react-i18next';
import EditPanelContent from './EditPanelContent/EditPanelContent';
import AdvancedOptions from './AdvancedOptions/AdvancedOptions';
import {connect} from 'formik';
import {EditPanelLanguageSwitcher} from './EditPanelLanguageSwitcher';
import {Error} from '@material-ui/icons';
import {useContentEditorContext, useContentEditorConfigContext} from '~/ContentEditor.context';
import PublicationInfoBadge from '~/PublicationInfo/PublicationInfo.badge';
import LockInfoBadge from '~/Lock/LockInfo.badge';
import WipInfoChip from '~/EditPanel/WorkInProgress/Chip/WipInfo.Chip';
import {PublicationInfoContext} from '~/PublicationInfo/PublicationInfo.context';
import {Constants} from '~/ContentEditor.constants';
import MainLayout from '~/DesignSystem/ContentLayout/MainLayout';
import ContentHeader from '~/DesignSystem/ContentLayout/ContentHeader';
import {
    Button,
    ButtonGroup,
    Chip,
    Separator,
    Tab,
    TabItem,
    Typography
} from '@jahia/moonstone';
import styles from './EditPanel.scss';

const EditPanelCmp = ({formik, title, notificationContext, client}) => {
    const {t} = useTranslation();
    const {nodeData, siteInfo, lang, uilang, mode} = useContentEditorContext();
    const {envProps} = useContentEditorConfigContext();

    useEffect(() => {
        if (envProps.initCallback) {
            envProps.initCallback(formik);
        }

        const handleBeforeUnloadEvent = ev => {
            if (formik.dirty) {
                ev.preventDefault();
                ev.returnValue = '';
            }
        };

        // Prevent close browser's tab when there is unsaved content
        window.addEventListener('beforeunload', handleBeforeUnloadEvent);
        return () => {
            window.removeEventListener(
                'beforeunload',
                handleBeforeUnloadEvent
            );
        };
    }, [formik.dirty]);

    const publicationInfoContext = useContext(PublicationInfoContext);

    const actionContext = {
        nodeData,
        language: lang,
        uilang,
        mode,
        t,
        client, // TODO BACKLOG-11290 find another way to inject apollo-client, i18n, ...}
        notificationContext,
        publicationInfoContext,
        formik,
        siteInfo
    };

    const [activeTab, setActiveTab] = useState('edit');
    const SelectedTabComponents = {
        edit: EditPanelContent,
        advanced: AdvancedOptions
    };
    const SelectedTabComponent = SelectedTabComponents[activeTab];
    return (
        <MainLayout
            header={
                <ContentHeader>
                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <DisplayActions
                                context={{nodeData, siteInfo, formik}}
                                target="editHeaderPathActions"
                                render={({context}) => (
                                    <Button
                                        data-sel-role="backButton"
                                        icon={context.buttonIcon}
                                        disabled={context.disabled}
                                        onClick={e => {
                                            e.stopPropagation();
                                            context.onClick(context, e);
                                        }}
                                    />
                                )}
                            />

                            <Typography isNowrap className={styles.headerTypography} variant="heading">
                                {title}
                            </Typography>
                        </div>

                        <div className={styles.headerRight}>
                            <DisplayActions
                                context={{
                                    ...actionContext,
                                    isMainButton: true
                                }}
                                target="editHeaderActions"
                                render={({context}) => (
                                    <>
                                        {context.enabled &&
                                        <>
                                            <Button
                                                icon={context.buttonIcon}
                                                label={t(context.buttonLabel).toUpperCase()}
                                                color={context.color}
                                                variant={context.variant || 'default'}
                                                disabled={context.disabled}
                                                data-sel-role={context.dataSelRole}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    context.onClick(context, e);
                                                }}
                                            />

                                            {context.addWarningBadge && (
                                                <Error data-sel-role={`${context.actionKey}_pastille`}
                                                       className={styles.warningBadge}/>
                                            )}
                                        </>}
                                    </>
                                )}
                            />

                            {mode === Constants.routes.baseEditRoute &&
                            <ButtonGroup
                                color="accent"
                                size="big"
                            >
                                <DisplayAction
                                    actionKey="ContentEditorHeaderMenu"
                                    context={actionContext}
                                    render={({context, ...props}) => (
                                        <Button
                                            icon={context.buttonIcon}
                                            data-sel-role="ContentEditorHeaderMenu"
                                            color="accent"
                                            {...props}
                                            onClick={e => {
                                                e.stopPropagation();
                                                context.onClick(context, e);
                                            }}
                                        />
                                    )}
                                />
                            </ButtonGroup>}
                        </div>
                    </div>

                    <div className={styles.header}>
                        <div className={styles.headerLeft}>
                            <Chip
                                label={nodeData.primaryNodeType.displayName}
                                color="accent"
                            />
                        </div>

                        <div className={styles.headerChips}>
                            <PublicationInfoBadge/>
                            <LockInfoBadge/>
                            <WipInfoChip/>
                        </div>
                    </div>

                    <Separator/>

                    <div className={styles.headerToolBar}>
                        <EditPanelLanguageSwitcher lang={lang}
                                                   siteInfo={siteInfo}
                        />

                        <Separator variant="vertical"/>

                        <Tab>
                            <DisplayActions
                                context={{
                                    ...actionContext,
                                    setActiveTab: setActiveTab,
                                    activeTab: activeTab
                                }}
                                target="editHeaderTabsActions"
                                render={({context}) => (
                                    <TabItem
                                        data-sel-role={context.dataSelRole}
                                        icon={context.buttonIcon}
                                        label={t(context.buttonLabel)}
                                        isSelected={context.selected}
                                        onClick={e => {
                                            e.stopPropagation();
                                            context.onClick(context, e);
                                        }}
                                    />
                                )}
                            />
                        </Tab>

                        <Separator variant="vertical"/>

                        <DisplayAction
                            actionKey="content-editor/header/3dots"
                            context={actionContext}
                            render={({context, ...props}) => (
                                <Button
                                    data-sel-role={context.dataSelRole}
                                    icon={context.buttonIcon}
                                    variant="ghost"
                                    {...props}
                                    onClick={e => {
                                        e.stopPropagation();
                                        context.onClick(context, e);
                                    }}
                                />
                            )}/>
                    </div>
                </ContentHeader>
            }
        >
            <SelectedTabComponent isDirty={formik.dirty} formik={formik}/>
        </MainLayout>
    );
};

EditPanelCmp.propTypes = {
    formik: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    client: PropTypes.object.isRequired,
    notificationContext: PropTypes.object.isRequired
};

const EditPanel = compose(
    connect,
    withNotifications(),
    withApollo
)(EditPanelCmp);
EditPanel.displayName = 'EditPanel';
export default EditPanel;
