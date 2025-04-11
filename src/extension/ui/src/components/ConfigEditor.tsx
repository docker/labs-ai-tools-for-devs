import { CheckCircle, CheckOutlined, CloseOutlined, DeleteOutlined, Save } from "@mui/icons-material";
import { Button, ButtonGroup, Checkbox, FormControlLabel, IconButton, Stack, TextField } from "@mui/material";
import { useState } from "react";

type ConfigEditorProps = {
    keyName: string;
    value: any;
    onEdit: (value: any) => Promise<void>;
    type: 'string' | 'password' | 'number' | 'boolean' | 'array' | 'object';
    optional?: boolean;
}

const ConfigEditor = ({ keyName, value, onEdit, type, optional }: ConfigEditorProps) => {
    const [tempValue, setTempValue] = useState(value);
    const [saving, setSaving] = useState(false);
    const mustBeSet = !optional && !value;

    const getInputComponent = () => {
        if (type === 'string' || type === 'password') {
            return <TextField type={type === 'password' ? 'password' : 'text'} required={mustBeSet} color={mustBeSet ? 'warning' : 'primary'} slotProps={{ input: { color: mustBeSet ? 'primary' : 'warning' } }} fullWidth value={tempValue} onChange={(e) => setTempValue(e.target.value)} label={keyName} />
        }
        if (type === 'number') {
            return <TextField type="number" required={mustBeSet} color={mustBeSet ? 'warning' : 'primary'} slotProps={{ input: { color: mustBeSet ? 'primary' : 'warning' } }} fullWidth value={tempValue} onChange={(e) => setTempValue(e.target.value)} label={keyName} />
        }
        if (type === 'boolean') {
            return <FormControlLabel required={mustBeSet} color={mustBeSet ? 'warning' : 'primary'} checked={tempValue} control={<Checkbox />} onChange={(e, checked) => setTempValue(checked)} label={keyName} />
        }
        if (type === 'array') {
            const arrayValue = Array.isArray(value) ? value : [];
            return <div>Array</div>
        }
        if (type === 'object') {
            const objectValue = typeof value === 'object' ? value : {};
            return <div>Object</div>
        }
    }
    const hasEdit = tempValue !== (value || '')
    return <Stack direction="row" spacing={2} alignItems="center">
        {getInputComponent()}
        {hasEdit && <ButtonGroup size="small" sx={{ ml: 1 }}>
            <IconButton onClick={async () => {
                setSaving(true);
                await onEdit(tempValue);
                setSaving(false);
            }}>
                <CheckOutlined sx={{ color: 'success.main' }} />
            </IconButton>
            <IconButton onClick={async () => {
                setTempValue(value);
            }}>
                <CloseOutlined sx={{ color: 'error.main' }} />
            </IconButton>
        </ButtonGroup>}
        {!hasEdit && tempValue !== null && <ButtonGroup size="small" sx={{ ml: 1 }}>
            <IconButton onClick={async () => {
                setTempValue(undefined);
                onEdit(undefined);
            }}>
                <DeleteOutlined sx={{ color: 'error.main' }} />
            </IconButton>
        </ButtonGroup>}
    </Stack>
};

export default ConfigEditor;