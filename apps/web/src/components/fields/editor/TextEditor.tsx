import { Box, BoxProps, useColorMode } from '@chakra-ui/react';
import Editor, { PluginEditorProps } from '@draft-js-plugins/editor';

export default function TextEditor(
  props: { box: BoxProps } & PluginEditorProps
) {
  const { box, ...editor } = props;
  const { colorMode } = useColorMode();
  const light = colorMode === 'light';

  return (
    <Box
      {...box}
      sx={{
        '.DraftEditor-editorContainer, .public-DraftEditor-content': {
          h: 'full',
        },
        '.public-DraftEditor-content, .public-DraftEditorPlaceholder-inner': {
          px: '20px',
          py: '10px',
        },
        '.public-DraftEditorPlaceholder-inner': {
          color: light ? 'secondaryGray.700' : 'secondaryGray.600',
        },
        '.DraftEditor-root:focus-within': {
          borderColor: light ? 'brand.300' : 'brand.400',
        },
        'div.DraftEditor-root': {
          bg: light ? 'transparent' : 'navy.800',
          border: '2px solid',
          fontWeight: 400,
          color: light ? 'secondaryGray.900' : 'white',
          borderColor: light ? 'secondaryGray.400' : 'navy.600',
          fontSize: 'md',
          transition: 'all 0.3s',
          rounded: '40px',
        },
      }}
    >
      <Editor {...editor} />
    </Box>
  );
}
