import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useEffect, useState } from 'react';

import {
  BroadcastTemplateFormdata,
  BroadcastTemplateVariable,
  makeRequest,
  RequestMethod,
} from '../../../../shared';

interface Props {
  open: boolean;
  variableSelected: (variable: BroadcastTemplateVariable) => void;
  onCloseClicked: () => void;
}

export const SelectTemplateVariable = ({
  open,
  onCloseClicked,
  variableSelected,
}: Props) => {
  const [variables, setVariables] = useState<BroadcastTemplateVariable[]>([]);

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    const response = await makeRequest<null, BroadcastTemplateFormdata>(
      `/broadcast-templates/formdata`,
      RequestMethod.GET,
      true
    );
    const message = new BroadcastTemplateFormdata(response.message);
    setVariables(message.variables);
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Select variable to add</DialogTitle>
      <Divider />
      <DialogContent>
        <List>
          {variables.map((variable) => (
            <ListItemButton
              key={variable.name}
              onClick={() => variableSelected(variable)}
            >
              <ListItemText primary={variable.name} />
            </ListItemButton>
          ))}
        </List>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={() => onCloseClicked()}
          variant="outlined"
          disableElevation
          color="error"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
