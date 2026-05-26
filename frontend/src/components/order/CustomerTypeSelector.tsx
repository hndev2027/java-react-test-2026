import CheckIcon from '@mui/icons-material/Check';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { CustomerType } from '../../types/order';

type CustomerTypeSelectorProps = {
  value: CustomerType;
  onChange: (value: CustomerType) => void;
};

export function CustomerTypeSelector({ onChange, value }: CustomerTypeSelectorProps) {
  return (
    <Stack spacing={1.25}>
      <Typography variant="overline" color="text.secondary" fontWeight={800}>
        Customer Type
      </Typography>
      <ToggleButtonGroup
        exclusive
        fullWidth
        value={value}
        onChange={(_, nextValue: CustomerType | null) => {
          if (nextValue) {
            onChange(nextValue);
          }
        }}
        sx={{
          gap: 1.5,
          '& .MuiToggleButton-root': {
            border: 1,
            borderColor: 'divider',
            borderRadius: '8px !important',
            py: 1.3,
            textTransform: 'none',
            fontWeight: 800,
          },
        }}
      >
        <ToggleButton value={CustomerType.NORMAL}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CheckIcon fontSize="small" />
            <span>Normal Customer</span>
          </Stack>
        </ToggleButton>
        <ToggleButton value={CustomerType.VIP}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <WorkspacePremiumIcon fontSize="small" />
            <span>VIP Customer</span>
          </Stack>
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
