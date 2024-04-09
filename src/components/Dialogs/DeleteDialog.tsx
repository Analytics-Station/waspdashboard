import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';

interface Props {
  open: boolean;
  loading: boolean;
  title: string;
  subtitle: string;
  onDeleteClicked: () => void;
  onCancelClicked: () => void;
}
export const DeleteDialog = ({
  open,
  loading,
  title,
  subtitle,
  onDeleteClicked,
  onCancelClicked,
}: Props) => {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <Divider />
      <DialogContent>
        <Typography>{subtitle}</Typography>
      </DialogContent>
      <Divider />
      <DialogActions>
        <LoadingButton
          variant="contained"
          disableElevation
          loading={loading}
          onClick={() => onDeleteClicked()}
          color="error"
        >
          Delete
        </LoadingButton>
        <Button
          onClick={() => onCancelClicked()}
          variant="outlined"
          disableElevation
          color="warning"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
