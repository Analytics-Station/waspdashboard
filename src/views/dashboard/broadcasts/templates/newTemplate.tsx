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
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonStrikethrough,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField,
} from 'mui-tiptap';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { makeRequest, RequestMethod } from '../../../../shared';
import { SelectTemplateVariable } from './selectVariable';

const FormSchema = yup
  .object({
    name: yup.string().min(6).required(),
    category: yup.string().required(),
    content: yup.string().min(6).required(),
  })
  .required();

export const NewBroadcastTemplate = () => {
  const categories = ['AUTHENTICATION', 'MARKETING', 'UTILITY'];
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
      category: '',
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
          category: data.category,
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
    setValue('category', '');
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
          name="category"
          control={control}
          render={({ field: { ref, onChange, onBlur, ...field } }) => (
            <FormControl fullWidth className="tw-mt-4 tw-mb-6" size="small">
              <InputLabel id="category">Select category</InputLabel>
              <Select
                labelId="category"
                label="Select category"
                {...field}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                error={!!errors.category}
                fullWidth
                placeholder="Select category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
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
                <RichTextField
                  {...field}
                  controls={
                    <MenuControlsContainer>
                      <MenuSelectHeading />
                      <MenuDivider />
                      <MenuButtonBold />
                      <MenuButtonItalic />
                      <MenuButtonStrikethrough />
                    </MenuControlsContainer>
                  }
                  className="tw-h-48"
                />
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
        <Box className="tw-mt-6 tw-text-right">
          <LoadingButton
            className="tw-ml-auto"
            disabled={!isValid || !isDirty}
            variant="contained"
            disableElevation
            type="submit"
            loading={loading}
          >
            Request template
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
