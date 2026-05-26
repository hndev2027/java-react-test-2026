import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { SectionCard } from '../components/common/SectionCard';
import { PromotionCard } from '../components/promotions/PromotionCard';
import { fetchPromotions } from '../features/order/orderSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function PromotionsPage() {
  const dispatch = useAppDispatch();
  const promotions = useAppSelector((state) => state.order.promotions);
  const activeCount = promotions.items.filter((promotion) => promotion.active).length;

  return (
    <Stack spacing={2.5}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: 1,
          borderColor: 'divider',
          borderRadius: 2,
          boxShadow: '0 12px 32px rgba(23, 32, 51, 0.06)',
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip color="primary" label={`${promotions.items.length} total rules`} />
            <Chip color="success" variant="outlined" label={`${activeCount} active`} />
            <Chip variant="outlined" label="Strategy pipeline" />
          </Stack>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => dispatch(fetchPromotions())}
            disabled={promotions.status === 'pending'}
          >
            Refresh
          </Button>
        </Stack>
      </Paper>

      <SectionCard
        title="Configured Promotions"
        subtitle="Rules available to the order pricing pipeline."
      >
        <Box sx={{ p: 2.5 }}>
          {promotions.status === 'pending' && promotions.items.length === 0 ? (
            <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
              <CircularProgress />
              <Typography color="text.secondary">Loading promotions...</Typography>
            </Stack>
          ) : null}

          {promotions.error ? <Alert severity="error">{promotions.error}</Alert> : null}

          {promotions.items.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              {promotions.items.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))}
            </Box>
          ) : null}
        </Box>
      </SectionCard>
    </Stack>
  );
}
