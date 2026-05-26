import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SchemaOutlinedIcon from '@mui/icons-material/SchemaOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import type { Promotion } from '../../types/order';

type PromotionCardProps = {
  promotion: Promotion;
};

export function PromotionCard({ promotion }: PromotionCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        height: '100%',
        transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: 'primary.light',
          boxShadow: '0 16px 34px rgba(23, 32, 51, 0.08)',
        },
      }}
    >
      <Stack spacing={1.75} sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle1" fontWeight={900}>
              {promotion.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {promotion.description}
            </Typography>
          </Stack>
          <Chip
            size="small"
            icon={promotion.active ? <CheckCircleIcon /> : <PauseCircleOutlineIcon />}
            label={promotion.active ? 'Active' : 'Paused'}
            color={promotion.active ? 'success' : 'default'}
            variant="outlined"
          />
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip size="small" color="primary" variant="outlined" label={promotion.type.split('_').join(' ')} />
          <Chip size="small" variant="outlined" label={promotion.id} />
        </Stack>

        <Box
          sx={{
            p: 1.5,
            borderRadius: 1.5,
            bgcolor: '#fffafa',
            border: 1,
            borderColor: 'divider',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="flex-start">
            <SchemaOutlinedIcon color="action" fontSize="small" />
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {promotion.ruleSummary}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}
