import { Chip, Stack, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import SVG from 'react-inlinesvg';

import { CatalogItem } from '../../types/catalog';
import hammerIcon from './hammer.svg';

type BottomProps = {
  item: CatalogItem;
};

const Bottom = ({ item }: BottomProps) => {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Chip
        icon={
          <HammerIcon
            color={theme.palette.primary.main}
            height={12}
            width={12}
          />
        }
        label={`${item.tools.length} ${pluralize('tool', item.tools.length)}`}
        color="primary"
      />
      {!item.tools?.length && !!item.prompts && (
        <Chip
          label={`${item.prompts} ${pluralize('prompt', item.prompts)}`}
          color="secondary"
        />
      )}
      {!item.tools?.length && !item.prompts && item.resources?.length && (
        <Chip
          label={`${item.resources.length} ${pluralize(
            'resource',
            item.resources.length
          )}`}
        />
      )}
    </Stack>
  );
};

export default Bottom;

function pluralize(noun: string, count: number): string {
  return Math.abs(count) <= 1 ? noun : `${noun}s`;
}

const StyledSVG = styled(SVG)((props) => {
  return {
    '& path': {
      fill: props.color,
    },
  };
});

interface HammerIconProps {
  color: string;
  width: number;
  height: number;
}

function HammerIcon({ color, width, height }: HammerIconProps) {
  return (
    <StyledSVG color={color} src={hammerIcon} width={width} height={height} />
  );
}
