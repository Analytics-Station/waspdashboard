import { Box, BoxProps } from '@mui/material';

interface Props extends BoxProps {
  className?: string;
}

export const FlexBox = ({ className, children, ...otherProps }: Props) => {
  return (
    <Box {...otherProps} className={`tw-flex tw-items-center ${className}`}>
      {children}
    </Box>
  );
};
