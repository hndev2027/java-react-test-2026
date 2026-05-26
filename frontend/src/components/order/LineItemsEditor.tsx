import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import type {
  LineItemErrors,
  LineItemFormValue,
} from '../../features/order/orderValidation';
import type { AsyncStatus } from '../../types/common';
import type { Product } from '../../types/order';
import { formatCurrency } from '../../utils/formatCurrency';

type LineItemsEditorProps = {
  items: LineItemFormValue[];
  errors: Record<string, LineItemErrors>;
  estimatedSubtotal: number;
  totalQuantity: number;
  products: Product[];
  productsStatus: AsyncStatus;
  productsError: string | null;
  onAddItem: () => void;
  onUsePreset: (preset: Product) => void;
  onRemoveItem: (id: string) => void;
  onChangeItem: (
    id: string,
    field: keyof Omit<LineItemFormValue, 'id'>,
    value: string,
  ) => void;
};

export function LineItemsEditor({
  errors,
  estimatedSubtotal,
  items,
  totalQuantity,
  products,
  productsError,
  productsStatus,
  onAddItem,
  onChangeItem,
  onRemoveItem,
  onUsePreset,
}: LineItemsEditorProps) {
  return (
    <Stack spacing={0}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ px: 2.5, py: 2 }}
      >
        <Stack spacing={0.25}>
          <Typography variant="subtitle1" fontWeight={900}>
            Line Items
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {items.length} items / {totalQuantity} total qty
          </Typography>
        </Stack>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={onAddItem}>
          Add Item
        </Button>
      </Stack>

      <Divider />

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
        sx={{ px: 2.5, py: 1.5, bgcolor: 'grey.50' }}
      >
        <Typography variant="caption" color="text.secondary" fontWeight={800}>
          Catalog
        </Typography>
        {productsStatus === 'pending' ? (
          <CircularProgress size={18} />
        ) : null}
        {productsError ? (
          <Typography variant="caption" color="error">
            {productsError}
          </Typography>
        ) : null}
        {products.map((preset) => (
          <Chip
            key={preset.sku}
            size="small"
            variant="outlined"
            label={`${preset.sku} - ${preset.name} - ${formatCurrency(preset.price)}`}
            onClick={() => onUsePreset(preset)}
          />
        ))}
      </Stack>

      <Divider />

      <Stack spacing={1.5} sx={{ px: 2.5, py: 2 }}>
        <Box
          sx={{
            display: { xs: 'none', sm: 'grid' },
            gridTemplateColumns: 'minmax(180px, 1fr) 140px 110px 120px 42px',
            gap: 1,
            px: 0.5,
          }}
        >
          {['SKU / Product', 'Unit Price', 'Qty', 'Line Total', ''].map((label) => (
            <Typography key={label} variant="caption" color="text.secondary" fontWeight={800}>
              {label}
            </Typography>
          ))}
        </Box>

        {items.map((item) => {
          const itemErrors = errors[item.id] ?? {};
          const price = Number(item.price);
          const quantity = Number(item.quantity);
          const lineTotal =
            Number.isFinite(price) && Number.isFinite(quantity) ? price * quantity : 0;

          return (
            <Box
              key={item.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'minmax(180px, 1fr) 140px 110px 120px 42px',
                },
                gap: 1,
                alignItems: 'start',
                p: { xs: 1.25, sm: 0 },
                border: { xs: 1, sm: 0 },
                borderColor: { xs: 'divider', sm: 'transparent' },
                borderRadius: { xs: 2, sm: 0 },
              }}
            >
              <TextField
                select
                label="SKU"
                value={item.sku}
                onChange={(event) => onChangeItem(item.id, 'sku', event.target.value)}
                size="small"
                error={Boolean(itemErrors.sku)}
                helperText={itemErrors.sku}
              >
                {products.length === 0 ? (
                  <MenuItem value="" disabled>
                    No products available
                  </MenuItem>
                ) : null}
                {products.map((product) => (
                  <MenuItem key={product.sku} value={product.sku}>
                    {product.sku} - {product.name} ({formatCurrency(product.price)})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Unit Price"
                value={item.price}
                onChange={(event) => onChangeItem(item.id, 'price', event.target.value)}
                size="small"
                type="number"
                disabled={products.some((product) => product.sku === item.sku)}
                inputProps={{ min: 0, step: '0.01' }}
                error={Boolean(itemErrors.price)}
                helperText={itemErrors.price}
              />
              <TextField
                label="Qty"
                value={item.quantity}
                onChange={(event) => onChangeItem(item.id, 'quantity', event.target.value)}
                size="small"
                type="number"
                inputProps={{ min: 1, step: 1 }}
                error={Boolean(itemErrors.quantity)}
                helperText={itemErrors.quantity}
              />
              <Box
                sx={{
                  minHeight: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'space-between', sm: 'flex-end' },
                  px: { xs: 0, sm: 1 },
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: { xs: 'block', sm: 'none' } }}
                >
                  Line Total
                </Typography>
                <Typography fontWeight={900}>
                  {formatCurrency(Math.max(0, lineTotal))}
                </Typography>
              </Box>
              <Tooltip title="Remove item">
                <span>
                  <IconButton
                    aria-label={`Remove ${item.sku || 'line item'}`}
                    onClick={() => onRemoveItem(item.id)}
                    disabled={items.length === 1}
                    sx={{ mt: { sm: 0.25 } }}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          );
        })}
      </Stack>

      <Divider />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ px: 2.5, py: 2 }}
      >
        <Typography variant="body2" color="text.secondary">
          Estimated subtotal
        </Typography>
        <Typography variant="h6" fontWeight={900}>
          {formatCurrency(estimatedSubtotal)}
        </Typography>
      </Stack>
    </Stack>
  );
}
