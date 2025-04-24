import { Avatar, CardHeader, Switch, Tooltip, Typography } from '@mui/material';

import { CatalogItemRichened } from '../../types/catalog';
import { formatName } from '../../formatName';

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
                ? 'Unregistering this server will hide it from MCP clients.'
                : 'Registering this server will expose it to MCP clients.'
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
          <Tooltip title="This server needs configuration before it can be used.">
            <span>
              <Switch checked={false} disabled />
            </span>
          </Tooltip>
        )
      }
    />
  );
}
