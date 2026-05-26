import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  IconButton,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import type { AsyncStatus } from '../../types/common';
import type { Coupon } from '../../types/order';
import { formatCurrency } from '../../utils/formatCurrency';

type CouponFieldProps = {
  value: string;
  appliedValue: string;
  coupons: Coupon[];
  couponsStatus: AsyncStatus;
  couponsError: string | null;
  currentSubtotal: number;
  onChange: (value: string) => void;
  onApply: () => void;
};

export function CouponField({
  appliedValue,
  coupons,
  couponsError,
  couponsStatus,
  currentSubtotal,
  onApply,
  onChange,
  value,
}: CouponFieldProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const canApply = value.trim().length > 0 && value.trim() !== appliedValue;
  const normalizedValue = value.trim().toUpperCase();
  const selectedCoupon = useMemo(
    () => coupons.find((coupon) => coupon.code.toUpperCase() === normalizedValue),
    [coupons, normalizedValue],
  );
  const estimatedDiscount = selectedCoupon
    ? calculateCouponDiscount(selectedCoupon, currentSubtotal)
    : 0;

  return (
    <Stack spacing={1.25}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography variant="overline" color="text.secondary" fontWeight={800}>
          Coupon Code
        </Typography>
        {selectedCoupon ? (
          <Typography variant="caption" color="text.secondary">
            {selectedCoupon.discountType === 'PERCENT'
              ? `${selectedCoupon.value}% discount`
              : `${formatCurrency(selectedCoupon.value)} discount`}
          </Typography>
        ) : null}
      </Stack>
      <Paper
        elevation={0}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) auto auto' },
          gap: 1,
          p: 0.75,
          border: 1,
          borderColor: 'divider',
          borderRadius: 1.5,
          bgcolor: '#fffafa',
        }}
      >
        <TextField
          fullWidth
          placeholder="Enter code, e.g. SUMMER10"
          value={value}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          size="small"
          variant="standard"
          inputProps={{ 'aria-label': 'Coupon code' }}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <LocalOfferOutlinedIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            px: 1,
            alignSelf: 'center',
            '& .MuiInputBase-root': {
              minHeight: 38,
            },
          }}
        />
        <Tooltip title="View coupon details">
          <span>
            <IconButton
              aria-label="View coupon details"
              onClick={() => setDetailsOpen(true)}
              disabled={!normalizedValue}
              sx={{
                width: 40,
                height: 40,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1.25,
                bgcolor: 'background.paper',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                  borderColor: 'primary.light',
                  bgcolor: 'primary.light',
                },
              }}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Button
          variant="contained"
          onClick={onApply}
          disabled={!canApply}
          sx={{ minWidth: { xs: '100%', sm: 96 }, borderRadius: 1.25 }}
        >
          Apply
        </Button>
      </Paper>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Typography variant="caption" color="text.secondary">
          Available
        </Typography>
        {couponsStatus === 'pending' ? (
          <Typography variant="caption" color="text.secondary">
            Loading coupons...
          </Typography>
        ) : null}
        {couponsError ? (
          <Typography variant="caption" color="error">
            {couponsError}
          </Typography>
        ) : null}
        {coupons.map((coupon) => (
          <Chip
            key={coupon.code}
            size="small"
            label={coupon.code}
            variant={appliedValue === coupon.code ? 'filled' : 'outlined'}
            color={appliedValue === coupon.code ? 'primary' : 'default'}
            onClick={() => onChange(coupon.code)}
          />
        ))}
        {appliedValue ? (
          <Chip size="small" color="success" label={`Applied ${appliedValue}`} />
        ) : null}
      </Stack>

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Coupon Details</DialogTitle>
        <DialogContent>
          {selectedCoupon ? (
            <Stack spacing={2} sx={{ pt: 0.5 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                <Chip color="primary" label={selectedCoupon.code} />
                <Chip
                  color={selectedCoupon.active ? 'success' : 'default'}
                  variant="outlined"
                  label={selectedCoupon.active ? 'Active' : 'Paused'}
                />
              </Stack>
              <Divider />
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Discount type
                </Typography>
                <Typography fontWeight={900}>
                  {selectedCoupon.discountType === 'PERCENT'
                    ? `${selectedCoupon.value}% off the current running total`
                    : `${formatCurrency(selectedCoupon.value)} off the current running total`}
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Estimate for this order
                </Typography>
                <Typography fontWeight={900} color="success.main">
                  -{formatCurrency(estimatedDiscount)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  The backend caps discounts so the final price never goes below zero.
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <Alert severity="info">
              No coupon named {normalizedValue || 'this code'} was found in the configured coupons.
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

function calculateCouponDiscount(coupon: Coupon, subtotal: number) {
  if (!coupon.active || subtotal <= 0) {
    return 0;
  }

  if (coupon.discountType.toUpperCase() === 'PERCENT') {
    return Math.min(subtotal, (subtotal * coupon.value) / 100);
  }

  return Math.min(subtotal, coupon.value);
}
