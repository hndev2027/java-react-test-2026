import { useEffect, useMemo, useState } from "react";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material";
import { NavigationSwitch } from "./components/common/NavigationSwitch";
import { OrderPage } from "./pages/OrderPage";
import { PromotionsPage } from "./pages/PromotionsPage";
import {
  fetchCoupons,
  fetchProducts,
  fetchPromotions,
} from "./features/order/orderSlice";
import { useAppDispatch } from "./store/hooks";
import type { AppTab } from "./types/common";

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>("order");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPromotions());
    dispatch(fetchProducts());
    dispatch(fetchCoupons());
  }, [dispatch]);

  const tabContent = useMemo(() => {
    if (activeTab === "promotions") {
      return <PromotionsPage />;
    }

    return <OrderPage />;
  }, [activeTab]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar
          sx={{
            gap: 2,
            minHeight: 64,
            px: { xs: 2, md: 3 },
          }}
        >
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 1.5,
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(255, 255, 255, 0.16)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              transition: "all 200ms ease",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.20)",
              },
            }}
          >
            <ReceiptLongIcon sx={{ fontSize: 24 }} />
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="h6" component="h1" noWrap>
              Order Pricing Engine
            </Typography>
          </Box>

          <NavigationSwitch
            activeTab={activeTab}
            setActiveTab={(value: AppTab) => setActiveTab(value)}
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {tabContent}
      </Container>
    </Box>
  );
}
