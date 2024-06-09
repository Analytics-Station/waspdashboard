import { faCaretDown, faClose, faDesktop, faLightbulb, faPlus, faReply } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { Country, isValidPhoneNumber } from 'react-phone-number-input';
import { useSelector } from 'react-redux';
import * as yup from 'yup';

import { FlexBox, TipTapEditor } from '../../../../../components';
import { InputPhone } from '../../../../../components/PhoneInput/PhoneInput';
import { RootState } from '../../../../../redux';
import { COLORS, FileInfo, S3Service } from '../../../../../shared';
import { SelectTemplateVariable } from '../selectVariable';

class TemplateButton {
  public isActionBtn: boolean;
  public replyType: number;
  public buttonText: string;
  public footerText: string;
  public terms: boolean;

  constructor(isActionBtn: boolean, replyType: number | null) {
    this.isActionBtn = isActionBtn;
    this.replyType = replyType ? replyType : 1;
    this.buttonText = '';
    this.footerText = '';
    this.terms = false;
  }
}

const FormSchema = yup
  .object({
    headerType: yup.number(),
    headerTitle: yup.string().max(60).nullable(),
    headerFile: yup.string().nullable(),
    footer: yup.string().max(60).nullable(),
    content: yup.string().min(6).max(1000).required(),
  })
  .required();

interface Props {
  formData: any;
  saveClicked: (data: any) => void;
}

export const TemplateForm2 = ({ saveClicked, formData }: Props) => {
  const loggedUser = useSelector((state: RootState) => state.auth.user);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      headerType: formData['headerType'] ? formData['headerType'] : -1,
      headerTitle: formData['headerTitle'] ? formData['headerTitle'] : '',
      headerFile: formData['headerFile'] ? formData['headerFile'] : '',
      footer: formData['footer'] ? formData['footer'] : '',
      content: formData['content'] ? formData['content'] : '',
    },
    resolver: yupResolver(FormSchema),
    shouldUnregister: false,
  });
  const watchHeaderType = watch('headerType');
  const watchFooter = watch('footer');
  const watchHeaderTitle = watch('headerTitle');
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [fileDetails, setFileDetails] = useState<FileInfo | null>(null);
  const [templateButtons, setTemplateButtons] = useState<TemplateButton[]>([]);
  const [currentCountry, setCurrentCountry] = useState<Country>('IN');

  useEffect(() => {
    setFileDetails(null);
    setValue('headerFile', '');
  }, [watchHeaderType]);

  const onSubmit = async (data: any) => {
    saveClicked({
      ...data,
      buttons: getButtonPayload(),
    });
  };

  const getButtonPayload = () => {
    const payload: any[] = [];

    templateButtons.map((button) => {
      const obj: any = {
        type: 'PHONE_NUMBER',
        text: button.buttonText,
      };
      if (button.isActionBtn) {
        if (button.replyType === 1) {
          obj['type'] = 'URL';
          obj['url'] = button.footerText;
        } else if (button.replyType === 2) {
          obj['type'] = 'PHONE_NUMBER';
          obj['phone_number'] = button.footerText;
        }
        payload.push(obj);
      }
    });

    return payload;
  };

  const isFormDisabled = (): boolean => {
    if (!isValid || !isDirty) {
      return true;
    }

    let buttonsInvalid = false;

    templateButtons.map((button) => {
      if (
        button.buttonText.length === 0 ||
        button.footerText === undefined ||
        button.footerText?.length === 0
      ) {
        buttonsInvalid = true;
      }
      if (!button.isActionBtn && !button.terms) {
        buttonsInvalid = true;
      }

      if (
        button.isActionBtn &&
        button.replyType === 1 &&
        !isValidURL(button.footerText)
      ) {
        buttonsInvalid = true;
      }

      if (
        button.isActionBtn &&
        button.replyType === 2 &&
        !isValidPhoneNumber(button.footerText || '', currentCountry)
      ) {
        buttonsInvalid = true;
      }
      return button;
    });

    return buttonsInvalid;
  };

  const isValidURL = (url: string): boolean => {
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?' + // port
        '(\\/[-a-z\\d%_.~+]*)*' + // path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    ); // fragment locator

    return !!pattern.test(url);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, []);

  const getFileTypes = (): Accept => {
    if (getValues('headerType') === 2) {
      return {
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/png': ['.png'],
      };
    }
    if (getValues('headerType') === 3) {
      return {
        'application/pdf': ['.pdf'],
      };
    }
    return {};
  };

  const addQuickReply = (replyType: number) => {
    setTemplateButtons([
      ...templateButtons,
      new TemplateButton(false, replyType),
    ]);
    handleClose();
  };

  const addActionButton = (replyType: number) => {
    setTemplateButtons([
      ...templateButtons,
      new TemplateButton(true, replyType),
    ]);
    handleClose();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getFileTypes(),
  });

  const onFileSelect = async (file: File) => {
    const s3Service = new S3Service();
    const parts = file.name.split('.');
    const fileInfo = await s3Service.getPresignedUrl(
      parts[parts.length - 1],
      getValues('headerType') === 2 ? 1 : 2
    );
    const arrayBuf = await file.arrayBuffer();
    await s3Service.uploadFile(
      fileInfo.uploadSignedUrl,
      arrayBuf,
      fileInfo.contentType
    );
    setFileDetails({
      fileName: file.name,
      fileUrl: fileInfo.fileUrl,
    });
    setValue('headerFile', fileInfo.fileUrl);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const termsChanged = (buttonIndex: number) => {
    setTemplateButtons([
      ...templateButtons.filter((button, index) => {
        const newButton = button;
        if (buttonIndex === index) {
          newButton.terms = !button.terms;
          return newButton;
        }
        return button;
      }),
    ]);
  };

  const changeValue = (
    buttonIndex: number,
    control: 'buttonText' | 'footerText',
    value: string
  ) => {
    setTemplateButtons([
      ...templateButtons.filter((button, index) => {
        const newButton = button;
        if (buttonIndex === index) {
          newButton[control] = value;
          return newButton;
        }
        return button;
      }),
    ]);
  };

  const changeReplyType = (
    buttonIndex: number,
    value: SelectChangeEvent<number>
  ) => {
    setTemplateButtons([
      ...templateButtons.filter((button, index) => {
        const newButton = button;
        if (buttonIndex === index) {
          newButton.replyType = parseInt(`${value.target.value}`);

          if (button.isActionBtn) {
            newButton.footerText = '';
          }
          return newButton;
        }
        return button;
      }),
    ]);
  };

  const removeButton = (buttonIndex: number) => {
    setTemplateButtons([
      ...templateButtons.filter((btn, index) =>
        index === buttonIndex ? null : btn
      ),
    ]);
  };

  const disableOptOut = (): boolean => {
    const optOutPresent = templateButtons.find((btn) => btn.replyType === 1);
    return optOutPresent !== undefined && !optOutPresent.isActionBtn;
  };

  const disableActionButton = (replyType: number, size: number): boolean => {
    let count = 0;
    templateButtons.map((btn) => {
      if (btn.isActionBtn && btn.replyType === replyType) {
        count++;
      }
      return btn;
    });
    return count > size - 1;
  };

  const renderButton = (button: TemplateButton, index: number) => {
    return button.isActionBtn
      ? renderActionButton(button, index)
      : renderQuickReply(button, index);
  };

  const renderActionButton = (button: TemplateButton, index: number) => {
    return (
      <Box
        key={`button_${index}`}
        className="tw-border tw-border-solid tw-border-slate-300 tw-rounded-lg tw-mt-4 tw-p-4"
      >
        <FlexBox>
          <FontAwesomeIcon icon={faDesktop} color={COLORS.primary} />
          <Typography className="tw-ml-2 tw-font-medium">
            Call to action
          </Typography>
        </FlexBox>

        <Grid container spacing={2} className="tw-mt-1 tw-items-center">
          <Grid item sm={3}>
            <Typography variant="subtitle2" className="tw-font-light tw-mb-1">
              Type of action
            </Typography>
            <Select
              value={button.replyType}
              size="small"
              fullWidth
              onChange={(e) => changeReplyType(index, e)}
            >
              <MenuItem value={1}>Visit website</MenuItem>
              <MenuItem value={2}>Call phone number</MenuItem>
            </Select>
          </Grid>

          <Grid item sm={4}>
            <Typography variant="subtitle2" className="tw-font-light tw-mb-1">
              Button text
            </Typography>
            <OutlinedInput
              size="small"
              fullWidth
              value={button.buttonText}
              placeholder="Button text"
              onChange={(e) => changeValue(index, 'buttonText', e.target.value)}
              endAdornment={
                <Typography variant="caption">
                  {button.buttonText.length}/25
                </Typography>
              }
            />
          </Grid>
          <Grid item sm={4}>
            <Typography variant="subtitle2" className="tw-font-light tw-mb-1">
              {button.replyType === 1 ? 'Website URL' : 'Phone number'}
            </Typography>

            {button.replyType === 1 ? (
              <OutlinedInput
                size="small"
                fullWidth
                value={button.footerText}
                placeholder="Website URL"
                onChange={(e) =>
                  changeValue(index, 'footerText', e.target.value)
                }
                endAdornment={
                  <Typography variant="caption">
                    {button.footerText.length}/
                    {button.replyType === 1 ? '2000' : '20'}
                  </Typography>
                }
              />
            ) : (
              <InputPhone
                fullWidth
                onChange={(e: string) => changeValue(index, 'footerText', e)}
                defaultCountry="IN"
                // label="Phone number"
                onCountryChanged={setCurrentCountry}
              />
            )}
          </Grid>
          <Grid item sm={1}>
            <IconButton
              size="small"
              color="error"
              className="tw-mt-4"
              onClick={() => removeButton(index)}
            >
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderQuickReply = (button: TemplateButton, index: number) => {
    return (
      <Box
        key={`button_${index}`}
        className="tw-border tw-border-solid tw-border-slate-300 tw-rounded-lg tw-mt-4 tw-p-4"
      >
        <FlexBox>
          <FontAwesomeIcon icon={faReply} color={COLORS.primary} />
          <Typography className="tw-ml-2 tw-font-medium">
            Quick reply
          </Typography>
        </FlexBox>

        <Grid container spacing={2} className="tw-mt-1 tw-items-center">
          <Grid item sm={3}>
            <Typography variant="subtitle2" className="tw-font-light tw-mb-1">
              Type
            </Typography>
            <Select
              value={button.replyType}
              size="small"
              fullWidth
              onChange={(e) => changeReplyType(index, e)}
            >
              <MenuItem value={1}>Marketing opt-out</MenuItem>
            </Select>
          </Grid>

          <Grid item sm={4}>
            <Typography variant="subtitle2" className="tw-font-light tw-mb-1">
              Button text
            </Typography>
            <OutlinedInput
              size="small"
              fullWidth
              value={button.buttonText}
              placeholder="Button text"
              onChange={(e) => changeValue(index, 'buttonText', e.target.value)}
              endAdornment={
                <Typography variant="caption">
                  {button.buttonText.length}/25
                </Typography>
              }
            />
          </Grid>
          <Grid item sm={4}>
            <Typography variant="subtitle2" className="tw-font-light tw-mb-1">
              Footer text
            </Typography>
            <OutlinedInput
              size="small"
              fullWidth
              value={button.footerText}
              placeholder="Footer text"
              onChange={(e) => changeValue(index, 'footerText', e.target.value)}
              endAdornment={
                <Typography variant="caption">
                  {button.footerText.length}/25
                </Typography>
              }
            />
          </Grid>
          <Grid item sm={1}>
            <IconButton
              size="small"
              color="error"
              className="tw-mt-4"
              onClick={() => removeButton(index)}
            >
              <FontAwesomeIcon icon={faClose} />
            </IconButton>
          </Grid>
          <Grid item sm={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={button.terms}
                    onChange={() => termsChanged(index)}
                  />
                }
                label={
                  <Typography variant="subtitle2" className="tw-font-light">
                    I understand that it's the responsibility of&nbsp;
                    {loggedUser?.organisation.name} to stop sending marketing
                    messages to customers who opt-out.
                  </Typography>
                }
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box className="tw-p-4 tw-bg-slate-100 tw-mt-4 tw-rounded-lg">
          <Typography variant="subtitle1" className="tw-font-bold">
            Header <Chip label="Optional" size="small" color="primary" />
          </Typography>
          <Typography variant="body2" className="tw-text-slate-500 tw-mb-4">
            Add a title or choose which type of media you'll use for this header
          </Typography>

          <Controller
            name="headerType"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl>
                <Select
                  size="small"
                  {...field}
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.headerType}
                >
                  <MenuItem value={-1}>None</MenuItem>
                  <MenuItem value={1}>Title</MenuItem>
                  <MenuItem value={2}>Image</MenuItem>
                  <MenuItem value={3}>Document</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          {watchHeaderType === 1 && (
            <Controller
              name="headerTitle"
              control={control}
              render={({ field: { ref, onChange, onBlur, ...field } }) => (
                <FormControl fullWidth className="tw-my-4">
                  <OutlinedInput
                    {...field}
                    ref={ref}
                    size="small"
                    onChange={onChange}
                    onBlur={onBlur}
                    error={!!errors.headerTitle}
                    fullWidth
                    placeholder="Header title"
                    endAdornment={
                      watchHeaderTitle && (
                        <Typography variant="caption">
                          {watchHeaderTitle.length}/60
                        </Typography>
                      )
                    }
                  />
                </FormControl>
              )}
            />
          )}

          {[2, 3].includes(watchHeaderType || 0) && (
            <Grid
              {...getRootProps()}
              container
              justifyContent="center"
              className={`tw-mt-12 tw-px-4 tw-py-12 tw-border-2 tw-border-dashed tw-border-yellow-500 tw-rounded-md ${
                isDragActive && 'tw-bg-slate-100'
              } tw-cursor-pointer`}
            >
              <input {...getInputProps()} />
              <Grid item sm={6} className="tw-text-center">
                {fileDetails ? (
                  <>
                    <Typography
                      variant="subtitle1"
                      className="tw-font-semibold"
                    >
                      Click here or drag your file to change{' '}
                      {getValues('headerType') === 2 ? 'image' : 'document'}
                    </Typography>
                    <Typography variant="body2">
                      {fileDetails.fileName}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="subtitle1" className="tw-font-semibold">
                    Click here or drag your file to upload your&nbsp;
                    {getValues('headerType') === 2 ? 'image' : 'document'}
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
        </Box>

        <Box className="tw-p-4 tw-bg-slate-100 tw-mt-4 tw-rounded-lg">
          <Typography variant="subtitle1" className="tw-font-bold">
            Body
          </Typography>
          <Typography variant="body2" className="tw-text-slate-500 tw-mb-2">
            Enter the text for your message in the language that you've selected
          </Typography>
          <Controller
            name="content"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <FormControl fullWidth>
                <TipTapEditor initialValue={value} onChange={onChange} />
              </FormControl>
            )}
          />
          {/* <Box className="tw-my-1 tw-text-right">
          <Button
            color="secondary"
            size="small"
            onClick={() => setShowTemplateSelection(true)}
            startIcon={<FontAwesomeIcon icon={faAdd} size="sm" />}
          >
            Add variable
          </Button>
        </Box> */}
        </Box>

        <Box className="tw-p-4 tw-bg-slate-100 tw-mt-4 tw-rounded-lg">
          <Typography variant="subtitle1" className="tw-font-bold">
            Footer <Chip label="Optional" size="small" color="primary" />
          </Typography>
          <Typography variant="body2" className="tw-text-slate-500 tw-mb-4">
            Add a short line of text to the bottom of your message template
          </Typography>

          <Controller
            name="footer"
            control={control}
            render={({ field: { ref, onChange, onBlur, ...field } }) => (
              <FormControl fullWidth className="tw-mb-4">
                <OutlinedInput
                  {...field}
                  ref={ref}
                  size="small"
                  onChange={onChange}
                  onBlur={onBlur}
                  error={!!errors.footer}
                  fullWidth
                  placeholder="Footer text"
                  endAdornment={
                    watchFooter && (
                      <Typography variant="caption">
                        {watchFooter.length}/60
                      </Typography>
                    )
                  }
                />
              </FormControl>
            )}
          />
        </Box>

        <Box className="tw-p-4 tw-bg-slate-100 tw-mt-4 tw-rounded-lg">
          <Typography variant="subtitle1" className="tw-font-bold">
            Buttons <Chip label="Optional" size="small" color="primary" />
          </Typography>
          <Typography variant="body2" className="tw-text-slate-500">
            Create buttons that let customers respond to your message or take
            action.
          </Typography>

          <Button
            className="tw-my-4"
            variant="contained"
            size="small"
            disableElevation
            startIcon={<FontAwesomeIcon icon={faPlus} />}
            endIcon={<FontAwesomeIcon icon={faCaretDown} />}
            onClick={handleClick}
          >
            Add a button
          </Button>

          <FlexBox>
            <FontAwesomeIcon icon={faLightbulb} color="#f8c70f" />
            <Typography variant="body2" className="tw-text-slate-500 tw-ml-2">
              If you add more than 3 buttons, they will appear in a list.
            </Typography>
          </FlexBox>

          {templateButtons.map(renderButton)}
        </Box>

        <Divider className="tw-my-4" />

        <Box className="tw-text-right tw-mb-20">
          <Button
            className="tw-ml-auto"
            disabled={isFormDisabled()}
            variant="contained"
            disableElevation
            type="submit"
          >
            Save changes
          </Button>
        </Box>

        <SelectTemplateVariable
          open={showTemplateSelection}
          onCloseClicked={() => setShowTemplateSelection(false)}
          variableSelected={(variable) => {
            // const tempDiv = document.createElement('div');
            // const content = getValues('content');
            // if (content != null) {
            //   tempDiv.innerHTML = content;
            //   const paragraphElement = tempDiv.querySelector('p');
            //   if (paragraphElement != null) {
            //     paragraphElement.innerHTML += `${variable.selector}`;
            //     editor?.commands.setContent(paragraphElement.innerHTML, true);
            //   } else {
            //     editor?.commands.setContent(`<p>${variable.selector}</p>`, true);
            //   }
            // }
            setShowTemplateSelection(false);
          }}
        />
      </form>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Typography variant="body1" className="title tw-px-4">
          Quick reply buttons
        </Typography>
        <MenuItem onClick={() => addQuickReply(1)} disabled={disableOptOut()}>
          <Box className="tw-flex tw-flex-col">
            <Typography variant="subtitle1">Marketing opt-out</Typography>
            <Typography variant="caption" className="tw-text-slate-300">
              Recommended
            </Typography>
          </Box>
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>Custom</MenuItem> */}
        <Divider className="tw-mb-2" />
        <Typography variant="body1" className="title tw-px-4">
          Call-to-action buttons
        </Typography>
        <MenuItem
          onClick={() => addActionButton(1)}
          disabled={disableActionButton(1, 2)}
        >
          <Box className="tw-flex tw-flex-col">
            <Typography variant="subtitle1">Visit website</Typography>
            <Typography variant="caption">2 buttons maximum</Typography>
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => addActionButton(2)}
          disabled={disableActionButton(2, 1)}
        >
          <Box className="tw-flex tw-flex-col">
            <Typography variant="subtitle1">Call phone number</Typography>
            <Typography variant="caption">1 button maximum</Typography>
          </Box>
        </MenuItem>
        <MenuItem disabled>
          <Box className="tw-flex tw-flex-col">
            <Typography variant="subtitle1">Complete form</Typography>
            <Typography variant="caption">1 button maximum</Typography>
          </Box>
        </MenuItem>
        <MenuItem disabled>
          <Box className="tw-flex tw-flex-col">
            <Typography variant="subtitle1">Copy offer code</Typography>
            <Typography variant="caption">1 button maximum</Typography>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};
