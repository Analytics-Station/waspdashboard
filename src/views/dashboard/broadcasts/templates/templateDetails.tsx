import { Box, Container, Divider, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { PleaseWait, TipTapEditor } from '../../../../components';
import { fetchTemplateDetails, RootState, useAppDispatch } from '../../../../redux';
import { BroadcastTemplate } from '../../../../shared';

export const BroadcastTemplateDetails = () => {
  const params = useParams();
  const dispatch = useAppDispatch();
  const currentTemplate = useSelector(
    (state: RootState) => state.template.currentTemplate
  );

  useEffect(() => {
    fetchData();
  }, [params]);

  const fetchData = () => {
    if (params['templateId']) {
      dispatch(fetchTemplateDetails(params['templateId']));
    }
  };

  const renderContent = (currentTemplate: BroadcastTemplate) => {
    return (
      <>
        <Typography variant="h5" className="tw-font-bold tw-mb-4">
          Template details
        </Typography>
        <Divider className="tw-my-8" />

        <Grid container spacing={4}>
          <Grid item sm={3}>
            <Box className="tw-border tw-border-solid tw-border-slate-300 tw-rounded-lg tw-p-4">
              <Typography
                variant="caption"
                className="tw-font-medium tw-text-slate-600"
              >
                Template name
              </Typography>
              <Typography variant="body1" className="tw-mb-4">
                {currentTemplate.name}
              </Typography>

              <Typography
                variant="caption"
                className="tw-font-medium tw-text-slate-600"
              >
                Language
              </Typography>
              <Typography variant="body1" className="tw-mb-4">
                {currentTemplate.getLanguageText()}
              </Typography>

              <Typography
                variant="caption"
                className="tw-font-medium tw-text-slate-600"
              >
                Category
              </Typography>
              <Typography variant="body1" className="tw-mb-4">
                {currentTemplate.category}
              </Typography>

              <Typography
                variant="caption"
                className="tw-font-medium tw-text-slate-600"
              >
                Status
              </Typography>
              <Typography variant="body1" className="tw-mb-4">
                {currentTemplate.status}
              </Typography>

              {currentTemplate.reason && (
                <>
                  <Typography
                    variant="caption"
                    className="tw-font-medium tw-text-slate-600"
                  >
                    Reason
                  </Typography>
                  <Typography variant="body1" className="tw-mb-4">
                    {currentTemplate.reason}
                  </Typography>
                </>
              )}

              {currentTemplate.whatsappId && (
                <>
                  <Typography
                    variant="caption"
                    className="tw-font-medium tw-text-slate-600"
                  >
                    Whatsapp ID
                  </Typography>
                  <Typography variant="body1">
                    {currentTemplate.whatsappId}
                  </Typography>
                </>
              )}
            </Box>
          </Grid>
          <Grid item sm={9}>
            <Box className="tw-border tw-border-solid tw-border-slate-300 tw-rounded-lg tw-p-4">
              <Typography
                variant="subtitle2"
                className="tw-font-medium tw-text-slate-600 tw-mb-2"
              >
                Header
              </Typography>
              <Box className="tw-bg-slate-100 tw-p-2 tw-rounded-lg tw-mb-8">
                <Typography variant="body1">
                  {currentTemplate.getComponentHeader()}
                </Typography>
              </Box>

              <Typography
                variant="subtitle2"
                className="tw-font-medium tw-text-slate-600 tw-mb-2"
              >
                Body
              </Typography>
              <Box className="tw-bg-slate-100 tw-p-2 tw-rounded-lg tw-mb-8">
                <TipTapEditor
                  readOnly
                  initialValue={currentTemplate.getComponentBody()}
                />
              </Box>

              <Typography
                variant="subtitle2"
                className="tw-font-medium tw-text-slate-600 tw-mb-2"
              >
                Footer
              </Typography>
              <Box className="tw-bg-slate-100 tw-p-2 tw-rounded-lg">
                <Typography variant="body1">
                  {currentTemplate.getComponentFooter()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  };

  return (
    <Container maxWidth="xl" className="tw-h-full tw-py-4">
      {currentTemplate ? renderContent(currentTemplate) : <PleaseWait />}
    </Container>
  );
};
