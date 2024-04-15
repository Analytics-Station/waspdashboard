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
  successText: string;
  cancelText?: string;
  onSuccessClicked: () => void;
  onCancelClicked: () => void;
}
export const ConfirmDialog = ({
  open,
  loading,
  title,
  subtitle,
  successText,
  cancelText,
  onSuccessClicked,
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
          onClick={() => onSuccessClicked()}
          color="error"
        >
          {successText}
        </LoadingButton>
        <Button
          onClick={() => onCancelClicked()}
          variant="outlined"
          disableElevation
          color="warning"
        >
          {cancelText || 'Cancel'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
