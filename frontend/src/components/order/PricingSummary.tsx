import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SavingsOutlinedIcon from "@mui/icons-material/SavingsOutlined";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import type { PricingResult } from "../../types/order";
import { formatCurrency } from "../../utils/formatCurrency";

type PricingSummaryProps = {
  result: PricingResult | null;
  isLoading: boolean;
  error: string | null;
};

export function PricingSummary({
  error,
  isLoading,
  result,
}: PricingSummaryProps) {
  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ minHeight: 300 }}
      >
        <CircularProgress size={36} />
        <Typography variant="body2" color="text.secondary">
          Calculating pricing...
        </Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2.5 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!result) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={1.5}
        sx={{ minHeight: 300 }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            bgcolor: "primary.light",
            display: "grid",
            placeItems: "center",
            color: "primary.main",
            background:
              "linear-gradient(135deg, rgba(207, 250, 254, 0.6) 0%, rgba(207, 250, 254, 0.3) 100%)",
            boxShadow: "0 8px 24px rgba(8, 145, 178, 0.12)",
            animation: "float 3s ease-in-out infinite",
            "@keyframes float": {
              "0%, 100%": { transform: "translateY(0px)" },
              "50%": { transform: "translateY(-8px)" },
            },
          }}
        >
          <ReceiptLongIcon />
        </Box>
        <Stack spacing={0.25} textAlign="center">
          <Typography fontWeight={900}>No calculation yet</Typography>
          <Typography variant="body2" color="text.secondary">
            Ready for the first order.
          </Typography>
        </Stack>
      </Stack>
    );
  }

  const savingsRate =
    result.subtotal > 0 ? (result.discount / result.subtotal) * 100 : 0;

  return (
    <Stack>
      <Box
        sx={{
          p: 2.5,
          bgcolor: "primary.main",
          background:
            "linear-gradient(135deg, #0e7490 0%, #0891b2 50%, #06b6d4 100%)",
          color: "common.white",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            bgcolor: "rgba(255, 255, 255, 0.05)",
            borderRadius: "50%",
            transform: "translate(50%, -50%)",
          },
        }}
      >
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography
              variant="body2"
              sx={{ color: "rgba(255, 255, 255, 0.78)" }}
            >
              Final price
            </Typography>
            <Chip
              size="small"
              color="success"
              icon={<SavingsOutlinedIcon />}
              label={`${savingsRate.toFixed(1)}% saved`}
              sx={{ fontWeight: 900 }}
            />
          </Stack>
          <Typography variant="h4" fontWeight={900}>
            {formatCurrency(result.finalPrice)}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, savingsRate)}
            sx={{
              height: 8,
              borderRadius: 999,
              bgcolor: "rgba(255, 255, 255, 0.22)",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#10b981",
                backgroundImage:
                  "linear-gradient(90deg, #10b981 0%, #14b8a6 100%)",
              },
            }}
          />
        </Stack>
      </Box>

      <Stack spacing={1.25} sx={{ p: 2.5 }}>
        <SummaryRow label="Subtotal" value={result.subtotal} />
        <SummaryRow label="Total discount" value={-result.discount} emphasis />
      </Stack>

      <Divider />

      <Box sx={{ px: 2.5, py: 1.5 }}>
        <Typography variant="subtitle2" fontWeight={900}>
          Applied Discounts
        </Typography>
        {result.appliedDiscounts.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No promotion matched this order.
          </Typography>
        ) : (
          <List dense disablePadding>
            {result.appliedDiscounts.map((discount) => (
              <ListItem
                key={discount.code}
                disableGutters
                sx={{
                  py: 1.25,
                  borderBottom: 1,
                  borderColor: "divider",
                  "&:last-child": { borderBottom: 0 },
                }}
              >
                <ListItemText
                  primary={discount.name}
                  secondary={discount.code}
                  primaryTypographyProps={{ fontWeight: 800 }}
                />
                <Typography fontWeight={900} color="success.main">
                  -{formatCurrency(discount.amount)}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Stack>
  );
}

type SummaryRowProps = {
  label: string;
  value: number;
  emphasis?: boolean;
};

function SummaryRow({ emphasis, label, value }: SummaryRowProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography
        fontWeight={emphasis ? 900 : 800}
        color={value < 0 ? "success.main" : "text.primary"}
      >
        {value < 0 ? "-" : ""}
        {formatCurrency(Math.abs(value))}
      </Typography>
    </Stack>
  );
}
