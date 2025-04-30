import { Avatar, CardHeader, Switch, Tooltip, Typography } from '@mui/material';

import { CatalogItemRichened } from '../../types/catalog';
import { useEffect, useState } from 'react';
import getCatalogIconPath from '../../utils/getCatalogIconPath';

type TopProps = {
  onToggleRegister: (checked: boolean) => void;
  item: CatalogItemRichened;
};

export default function Top({ item, onToggleRegister }: TopProps) {
  // For some unknown reason, item.registered is not updated right away when the user toggles the switch.
  // This `toggled` state is used to control the switch in the UI. Its main purpose is to do optimistic UI updates.
  // When the user toggles the switch. The `useEffect` hook is used to synchronize the `toggled` state with the `item.registered`
  // prop, which is the source of truth for the registration status of the item. This way, if the `item.registered` prop changes
  // (e.g., due to a successful registration or unregistration), the switch will reflect the correct state.
  const [toggled, setToggled] = useState(item.registered);

  useEffect(() => {
    setToggled(item.registered);
  }, [item.registered]);

  const [image, setImage] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (item.icon) {
      getCatalogIconPath(item.icon).then((icon) => {
        setImage(icon);
      });
    }
  }, [item.icon]);

  return (
    <CardHeader
      sx={{ padding: 0 }}
      avatar={
        <Avatar
          variant="square"
          src={image}
          alt={item.name}
          sx={{
            width: 24,
            height: 24,
            borderRadius: 1,
          }}
        />
      }
      title={
        <Typography
          variant="subtitle1"
          sx={{
            color: 'text.primary',
          }}
        >
          {item.title}
        </Typography>
      }
      action={
        item.canRegister ? (
          <Tooltip
            title={
              item.registered ? `Disable ${item.name}` : `Enable ${item.name}`
            }
          >
            <Switch
              checked={toggled}
              onChange={(event, checked) => {
                event.stopPropagation();
                event.preventDefault();

                setToggled(checked);
                onToggleRegister(checked);
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={`Enabling ${item.title} requires configuration`}>
            <span>
              <Switch checked={false} disabled />
            </span>
          </Tooltip>
        )
      }
    />
  );
}
