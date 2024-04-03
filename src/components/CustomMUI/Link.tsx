import { Link, LinkProps } from '@mui/material';
import { Link as RRDLink } from 'react-router-dom';

interface Props extends LinkProps {
  children: React.ReactNode;
}

interface RouterLinkProps extends Props {
  to: string;
}

const className = 'tw-no-underline hover:tw-underline hover:tw-text-slate-200';

export const MLink = ({ children, ...otherProps }: Props) => {
  return (
    <Link {...otherProps} className={className}>
      {children}
    </Link>
  );
};

export const MRouterLink = ({
  children,
  to,
  ...otherProps
}: RouterLinkProps) => {
  return (
    <Link {...otherProps} component={RRDLink} to={to} className={className}>
      {children}
    </Link>
  );
};
