import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import type { CustomerType } from "../../types/order";
import { formatCurrency } from "../../utils/formatCurrency";

type OrderMetricsProps = {
  subtotal: number;
  lineCount: number;
  totalQuantity: number;
  customerType: CustomerType;
  appliedCoupon: string;
};

export function OrderMetrics({
  appliedCoupon,
  customerType,
  lineCount,
  subtotal,
  totalQuantity,
}: OrderMetricsProps) {
  const metrics = [
    {
      label: "Subtotal",
      value: formatCurrency(subtotal),
      icon: <PaidOutlinedIcon />,
      tone: "#0891b2",
    },
    {
      label: "Line Items",
      value: String(lineCount),
      icon: <ShoppingCartOutlinedIcon />,
      tone: "#06b6d4",
    },
    {
      label: "Quantity",
      value: String(totalQuantity),
      icon: <Inventory2OutlinedIcon />,
      tone: "#0e7490",
    },
    {
      label: "Customer",
      value: customerType,
      icon: <PeopleAltOutlinedIcon />,
      tone: "#14b8a6",
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
        boxShadow: "0 12px 32px rgba(8, 145, 178, 0.08)",
        transition: "all 200ms ease",
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack spacing={0.75}>
          <Typography
            variant="overline"
            color="text.secondary"
            fontWeight={800}
          >
            Order snapshot
          </Typography>
          <Typography variant="h4" fontWeight={900}>
            {formatCurrency(subtotal)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Estimated total before discounts and promotions.
          </Typography>
        </Stack>

        <Chip
          size="small"
          color={appliedCoupon ? "success" : "default"}
          variant={appliedCoupon ? "filled" : "outlined"}
          label={
            appliedCoupon ? `Coupon: ${appliedCoupon}` : "No coupon applied"
          }
          sx={{
            px: 1.75,
            py: 0.75,
            fontWeight: 700,
            alignSelf: { xs: "stretch", md: "auto" },
          }}
        />
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1.5,
        }}
      >
        {metrics.map((metric) => (
          <Paper
            key={metric.label}
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 2,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              bgcolor: "background.default",
              background: `linear-gradient(135deg, ${metric.tone}0D 0%, ${metric.tone}08 100%)`,
              transition: "all 200ms ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 10px 25px ${metric.tone}1A`,
              },
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                color: metric.tone,
                bgcolor: `${metric.tone}14`,
              }}
            >
              {metric.icon}
            </Box>
            <Stack spacing={0.25}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={800}
              >
                {metric.label}
              </Typography>
              <Typography variant="h6" fontWeight={900}>
                {metric.value}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Box>
    </Paper>
  );
}
