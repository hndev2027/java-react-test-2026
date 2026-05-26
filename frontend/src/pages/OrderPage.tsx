import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Alert, Box, Button, Snackbar, Stack } from "@mui/material";
import { SectionCard } from "../components/common/SectionCard";
import { CouponField } from "../components/order/CouponField";
import { CustomerTypeSelector } from "../components/order/CustomerTypeSelector";
import { LineItemsEditor } from "../components/order/LineItemsEditor";
import { OrderMetrics } from "../components/order/OrderMetrics";
import { PricingSummary } from "../components/order/PricingSummary";
import { useOrderForm } from "../features/order/useOrderForm";

export function OrderPage() {
  const form = useOrderForm();

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.55fr 0.95fr" },
          gap: 3,
        }}
      >
        <OrderMetrics
          subtotal={form.estimatedSubtotal}
          lineCount={form.items.length}
          totalQuantity={form.totalQuantity}
          customerType={form.customerType}
          appliedCoupon={form.appliedCoupon}
        />

        <SectionCard title="Order details">
          <Stack spacing={2.5} sx={{ p: 2.5 }}>
            <CustomerTypeSelector
              value={form.customerType}
              onChange={form.setCustomerType}
            />
            <CouponField
              value={form.couponDraft}
              appliedValue={form.appliedCoupon}
              coupons={form.coupons.items}
              couponsStatus={form.coupons.status}
              couponsError={form.coupons.error}
              currentSubtotal={form.estimatedSubtotal}
              onChange={form.setCouponDraft}
              onApply={form.applyCoupon}
            />
          </Stack>
        </SectionCard>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.5fr 0.95fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <SectionCard>
          <LineItemsEditor
            items={form.items}
            errors={form.visibleErrors}
            estimatedSubtotal={form.estimatedSubtotal}
            totalQuantity={form.totalQuantity}
            products={form.products.items}
            productsStatus={form.products.status}
            productsError={form.products.error}
            onAddItem={form.addItem}
            onUsePreset={form.usePreset}
            onChangeItem={form.updateItem}
            onRemoveItem={form.removeItem}
          />
        </SectionCard>

        <Stack spacing={2}>
          <SectionCard title="Pricing Summary">
            <PricingSummary
              result={form.calculation.result}
              isLoading={form.isPending}
              error={form.calculation.error}
            />
          </SectionCard>

          {form.submitAttempted && form.hasErrors && (
            <Alert severity="warning" icon={<InfoOutlinedIcon />}>
              Some items are missing required fields or have invalid values.
            </Alert>
          )}

          <Button
            fullWidth
            size="large"
            variant="contained"
            disabled={form.isPending || (form.submitAttempted && form.hasErrors)}
            onClick={form.submitCalculation}
            sx={{ py: 1.35, fontSize: 15 }}
          >
            Calculate Price
          </Button>
        </Stack>
      </Box>

      <Snackbar
        open={form.successOpen}
        autoHideDuration={2400}
        onClose={() => form.setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Pricing calculated successfully.
        </Alert>
      </Snackbar>
    </Stack>
  );
}
