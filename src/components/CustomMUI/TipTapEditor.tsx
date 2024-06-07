import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonStrikethrough,
  MenuControlsContainer,
  RichTextEditorProvider,
  RichTextField,
  RichTextReadOnly,
} from 'mui-tiptap';

interface Props {
  initialValue: string;
  showControls?: boolean;
  readOnly?: boolean;
  onChange?: (s: string) => void;
}

export const TipTapEditor = ({
  initialValue,
  onChange,
  showControls = true,
  readOnly,
}: Props) => {
  function removeEmptyTags(text: string) {
    // Regular expression to match empty tags
    const emptyTagPattern = /<(\w+)(\s*[^>]*)>\s*<\/\1>/g;

    // Loop to ensure all nested empty tags are removed
    while (emptyTagPattern.test(text)) {
      text = text.replace(emptyTagPattern, '');
    }

    return text;
  }

  const convertHtmlToWhatsappFormatting = (text: string) => {
    text = text.replace(/<b>\s*(.*?)\s*<\/b>/gi, '*$1*');
    text = text.replace(/<strong>\s*(.*?)\s*<\/strong>/gi, '*$1*');
    text = text.replace(/<i>(.*?)<\/i>/gi, '_$1_');
    text = text.replace(/<em>(.*?)<\/em>/gi, '_$1_');
    text = text.replace(/<s>(.*?)<\/s>/gi, '~$1~');
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<p>(.*?)<\/p>/gi, '$1\n');
    text = removePTags(text);
    text = text.replace(/\n$/, '');
    return text;
  };

  const convertWhatsappFormattingToHtml = (text: string) => {
    text = text.replace(/<\/?div>/g, '');
    text = text.replace(/\n/g, '<br />');
    text = text.replace(/<br\s*\/?>$/, '');

    text = text.replace(/\*(.*?)\*/g, '<b>$1</b>');
    text = text.replace(/_(.*?)_/g, '<i>$1</i>');
    text = text.replace(/~(.*?)~/g, '<s>$1</s>');
    text = text.replace(/\n/g, '<br />');
    text = text.replace(/(.+?)(\n|$)/g, '<p>$1</p>');
    text = removeEmptyTags(text);
    return text;
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: convertWhatsappFormattingToHtml(initialValue),
    onUpdate: (e) => {
      const newContent = convertHtmlToWhatsappFormatting(e.editor.getHTML());
      if (onChange) {
        onChange(newContent);
      }
    },
  });

  const removePTags = (html: string): string => {
    return html.replace(/<p[^>]*>(.*?)<\/p>/gi, '');
  };

  const renderControls = () => {
    if (showControls) {
      return (
        <MenuControlsContainer>
          <MenuButtonBold />
          <MenuButtonItalic />
          <MenuButtonStrikethrough />
        </MenuControlsContainer>
      );
    }
  };

  if (readOnly) {
    return (
      <RichTextReadOnly
        content={convertWhatsappFormattingToHtml(initialValue)}
        extensions={[StarterKit]}
      />
    );
  }

  return (
    <RichTextEditorProvider editor={editor}>
      <RichTextField controls={renderControls()} disabled={true} />
    </RichTextEditorProvider>
  );
};
