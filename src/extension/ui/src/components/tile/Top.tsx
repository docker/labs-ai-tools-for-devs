import { Avatar, CardHeader, Switch, Tooltip, Typography } from '@mui/material';

import { CatalogItemRichened } from '../../types/catalog';
import { formatName } from '../../formatName';
import { format } from 'path';

type TopProps = {
  onToggleRegister: (checked: boolean) => void;
  item: CatalogItemRichened;
};

export default function Top({ item, onToggleRegister }: TopProps) {
  return (
    <CardHeader
      sx={{ padding: 0 }}
      avatar={
        <Avatar
          variant="square"
          src={item.icon}
          alt={item.name}
          sx={{
            width: 24,
            height: 24,
            borderRadius: 1,
          }}
        />
      }
      title={
        <Typography sx={{ justifySelf: 'flex-start', fontWeight: 'bold' }}>
          {formatName(item.name)}
        </Typography>
      }
      action={
        item.canRegister ? (
          <Tooltip
            title={
              item.registered
                ? `Disable ${formatName(item.name)}`
                : `Enable ${formatName(item.name)}`
            }
          >
            <Switch
              checked={item.registered}
              onChange={(event, checked) => {
                event.stopPropagation();
                event.preventDefault();
                onToggleRegister(checked);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip
            title={`Enabling ${formatName(item.name)} requires configuration`}
          >
            <span>
              <Switch checked={false} disabled />
            </span>
          </Tooltip>
        )
      }
    />
  );
}
