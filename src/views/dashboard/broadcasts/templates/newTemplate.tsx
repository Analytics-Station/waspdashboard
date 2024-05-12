import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Container, IconButton, Typography } from '@mui/material';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { TemplateForm1, TemplateForm2 } from './templateForm';

const FormSchema = yup
  .object({
    name: yup.string().min(6).required(),
    category: yup.string().required(),
    content: yup.string().min(6).required(),
    header: yup.string().required(),
    footer: yup.string().required(),
  })
  .required();

export const NewBroadcastTemplate = () => {
  const categories = ['AUTHENTICATION', 'MARKETING', 'UTILITY'];
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [formData, setFormData] = useState<any>({});

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

  // const onSubmit = async (data: any) => {
  //   setLoading(true);
  //   try {
  //     const response = await makeRequest(
  //       '/broadcast-templates',
  //       RequestMethod.POST,
  //       false,
  //       {
  //         name: data.name,
  //         content: data.content,
  //         category: data.category,
  //       }
  //     );
  //     navigate('/broadcasts/templates/list');
  //   } catch (e) {
  //     console.log(e);
  //   }
  //   setLoading(false);
  //   resetForm();
  // };

  const editor = useEditor({
    extensions: [StarterKit],
    content: getValues('content'),
    onUpdate: (e) => {
      setValue('content', e.editor.getHTML());
    },
  });

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
          saveClicked={(data) => {
            console.log(formData);
            console.log(data);
            navigate('/broadcasts/templates/list');
            // setFormData({
            //   ...formData,
            //   data,
            // });
            console.log({
              ...formData,
              ...data,
            });
          }}
        />
      )}

      {/* <form onSubmit={handleSubmit(onSubmit)}>
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
      /> */}
    </Container>
  );
};
