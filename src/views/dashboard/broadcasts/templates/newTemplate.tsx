import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Container, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { makeRequest, RequestMethod } from '../../../../shared';
import { TemplateForm1, TemplateForm2 } from './templateForm';

export const NewBroadcastTemplate = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const createTemplateRequest = async (payload: any) => {
    setLoading(true);
    try {
      const response = await makeRequest(
        '/broadcast-templates',
        RequestMethod.POST,
        true,
        payload
      );
      navigate('/broadcasts/templates/list');
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Box
        className={`tw-flex tw-items-center tw-bg-slate-100 tw-px-4 ${
          currentStep === 2 ? 'tw-py-2' : 'tw-py-4'
        } tw-mt-4 tw-rounded-lg`}
      >
        {currentStep === 2 && (
          <IconButton
            size="small"
            className="tw-mr-4"
            onClick={() => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              }
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </IconButton>
        )}
        <Typography variant="subtitle1" className="tw-font-bold">
          New Message Template
        </Typography>
      </Box>

      {currentStep === 1 && (
        <TemplateForm1
          formData={formData}
          nextClicked={(data) => {
            setFormData({
              ...data,
            });
            setCurrentStep(2);
          }}
        />
      )}

      {currentStep === 2 && (
        <TemplateForm2
          formData={formData}
          saveClicked={(data) => {
            createTemplateRequest({
              ...formData,
              ...data,
            });
          }}
        />
      )}
    </Container>
  );
};
