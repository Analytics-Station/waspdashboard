import { faFileLines, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Container, Divider, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { FlexBox } from '../../../../components';

export const BroadcastTemplates = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (selectedTab === 1) {
      navigate('/broadcasts/templates/variables/list');
    } else {
      navigate('/broadcasts/templates/list');
    }
  }, [selectedTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const newItemClicked = () => {
    if (selectedTab === 0) {
      navigate('/broadcasts/templates/new');
    } else {
      navigate('/broadcasts/templates/variables/new');
    }
  };

  return (
    <Container
      maxWidth="md"
      className="tw-flex tw-flex-col tw-h-full"
      disableGutters
    >
      <Box className="tw-w-full tw-p-4">
        <FlexBox>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            className="tw-flex-1"
          >
            <Tab label="Templates" />
            <Tab label="Variables" />
          </Tabs>
          <Button
            variant="contained"
            disableElevation
            onClick={newItemClicked}
            size="small"
            startIcon={
              <FontAwesomeIcon
                icon={selectedTab === 0 ? faFileLines : faLink}
                fixedWidth
              />
            }
          >
            New {selectedTab === 0 ? 'Template' : 'Variable'}
          </Button>
        </FlexBox>
        <Divider className="tw-mb-8" />
        <Outlet />
      </Box>
    </Container>
  );
};

export * from './templateList';
export * from './newTemplate';
export * from './variables';
