import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  OutlinedInput,
} from '@mui/material';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditorProvider, RichTextField } from 'mui-tiptap';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { makeRequest, RequestMethod } from '../../../../shared';
import { SelectTemplateVariable } from './selectVariable';

const FormSchema = yup
  .object({
    name: yup.string().min(6).required(),
    content: yup.string().min(6).required(),
  })
  .required();

export const NewBroadcastTemplate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: '',
      content: '',
    },
    resolver: yupResolver(FormSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await makeRequest(
        '/broadcast-templates',
        RequestMethod.POST,
        false,
        {
          name: data.name,
          content: data.content,
        }
      );
      navigate('/broadcasts/templates/list');
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
    resetForm();
  };

  const resetForm = () => {
    setValue('name', '');
    setValue('content', '');
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: getValues('content'),
    onUpdate: (e) => {
      setValue('content', e.editor.getHTML());
    },
  });

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field: { ref, onChange, onBlur, ...field } }) => (
            <FormControl fullWidth className="tw-mb-4">
              <FormLabel>Name</FormLabel>
              <OutlinedInput
                {...field}
                ref={ref}
                size="small"
                onChange={onChange}
                onBlur={onBlur}
                error={!!errors.name}
                fullWidth
                placeholder="Template identifier"
              />
            </FormControl>
          )}
        />
        <Controller
          name="content"
          control={control}
          render={({ field: { ref, onChange, onBlur, value, ...field } }) => (
            <FormControl fullWidth>
              <FormLabel>Value</FormLabel>
              <RichTextEditorProvider editor={editor}>
                <RichTextField {...field} className="tw-h-48" />
              </RichTextEditorProvider>
            </FormControl>
          )}
        />
        <Box className="tw-my-1 tw-text-right">
          <Button
            color="secondary"
            size="small"
            onClick={() => setShowTemplateSelection(true)}
            startIcon={<FontAwesomeIcon icon={faAdd} size="sm" />}
          >
            Add variable
          </Button>
        </Box>
        <Divider />
        {JSON.stringify(errors)}
        {isValid ? 'y' : 'n'}
        {isDirty ? 'y' : 'n'}
        <Box className="tw-mt-6 tw-text-right">
          <LoadingButton
            className="tw-ml-auto"
            disabled={!isValid || !isDirty}
            variant="contained"
            disableElevation
            type="submit"
            loading={loading}
          >
            Save changes
          </LoadingButton>
        </Box>
      </form>

      <SelectTemplateVariable
        open={showTemplateSelection}
        onCloseClicked={() => setShowTemplateSelection(false)}
        variableSelected={(variable) => {
          const tempDiv = document.createElement('div');
          const content = getValues('content');
          if (content != null) {
            tempDiv.innerHTML = content;
            const paragraphElement = tempDiv.querySelector('p');
            if (paragraphElement != null) {
              paragraphElement.innerHTML += `${variable.selector}`;
              editor?.commands.setContent(paragraphElement.innerHTML, true);
            } else {
              editor?.commands.setContent(`<p>${variable.selector}</p>`, true);
            }
          }
          setShowTemplateSelection(false);
        }}
      />
    </Container>
  );
};
