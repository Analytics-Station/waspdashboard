import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';
import { AxiosHeaders } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Accept, useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { TipTapEditor } from '../../../../../components';
import { makeRequest, RequestMethod, S3Service } from '../../../../../shared';
import { SelectTemplateVariable } from '../selectVariable';

const FormSchema = yup
  .object({
    headerType: yup.number(),
    headerTitle: yup.string().nullable(),
    headerFile: yup.string().nullable(),
    footer: yup.string().nullable(),
    content: yup.string().min(6).max(1000).required(),
  })
  .required();

interface Props {
  formData: any;
  saveClicked: (data: any) => void;
}

interface FileInfo {
  fileName: string;
  fileUrl: string;
}

export const TemplateForm2 = ({ saveClicked, formData }: Props) => {
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
  const watchContent = watch('content');
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [fileDetails, setFileDetails] = useState<FileInfo | null>(null);

  useEffect(() => {
    setFileDetails(null);
    setValue('headerFile', '');
  }, [watchHeaderType]);

  const onSubmit = async (data: any) => {
    saveClicked(data);
  };

  const isFormDisabled = (): boolean => {
    if (!isValid || !isDirty) {
      return true;
    }
    return false;
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
    await uploadFile(fileInfo.uploadSignedUrl, arrayBuf, fileInfo.contentType);
    setFileDetails({
      fileName: file.name,
      fileUrl: fileInfo.fileUrl,
    });
    setValue('headerFile', fileInfo.fileUrl);
  };

  const uploadFile = async (
    uploadUrl: string,
    data: ArrayBuffer,
    mimeType: string
  ) => {
    const headers = new AxiosHeaders({});
    headers.set('Content-Type', mimeType);
    const response = await makeRequest(
      uploadUrl,
      RequestMethod.PUT,
      false,
      data,
      headers
    );
  };

  return (
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
                  <Typography variant="subtitle1" className="tw-font-semibold">
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
              />
            </FormControl>
          )}
        />
      </Box>

      <Divider className="tw-my-4" />

      <Box className="tw-text-right">
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
  );
};
