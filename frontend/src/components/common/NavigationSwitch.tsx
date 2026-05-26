import React from "react";
import { Box, Typography } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import type { AppTab } from "../../types/common";

interface TabOption {
  id: AppTab;
  label: string;
  icon: React.ReactElement;
}

const TABS: TabOption[] = [
  {
    id: "order",
    label: "Order",
    icon: <ReceiptLongIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: "promotions",
    label: "Promotions",
    icon: <LocalOfferIcon sx={{ fontSize: 18 }} />,
  },
];

interface Props {
  activeTab: AppTab;
  setActiveTab: (t: AppTab) => void;
}

export const NavigationSwitch: React.FC<Props> = ({
  activeTab,
  setActiveTab,
}) => {
  const activeIndex = TABS.findIndex((t) => t.id === activeTab);

  return (
    <Box
      role="tablist"
      aria-label="Main navigation"
      sx={{
        position: "relative",
        display: "inline-flex",
        p: 0.5,
        borderRadius: 2.5,
        bgcolor: "rgba(0, 0, 0, 0.14)",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 4,
          bottom: 4,
          left: 4,
          width: "calc(50% - 4px)",
          borderRadius: 2,
          bgcolor: "common.white",
          boxShadow:
            "0 2px 8px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(14, 116, 144, 0.18)",
          transform: `translateX(${activeIndex * 100}%)`,
          transition: "transform 280ms cubic-bezier(0.34, 1.2, 0.64, 1)",
          zIndex: 0,
        }}
      />

      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <Box
            key={tab.id}
            component="button"
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            onClick={() => setActiveTab(tab.id)}
            sx={{
              position: "relative",
              zIndex: 1,
              flex: "1 1 0",
              minWidth: { xs: 48, sm: 112 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              py: 0.875,
              px: { xs: 1.25, sm: 2 },
              border: "none",
              borderRadius: 2,
              cursor: "pointer",
              bgcolor: "transparent",
              color: isActive ? "primary.dark" : "rgba(255, 255, 255, 0.82)",
              transition: "color 200ms ease, opacity 200ms ease",
              outline: "none",
              "&:hover": {
                color: isActive ? "primary.dark" : "common.white",
                opacity: isActive ? 1 : 1,
              },
              "&:focus-visible": {
                boxShadow: "0 0 0 2px rgba(255, 255, 255, 0.55)",
              },
            }}
          >
            <Box
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                color: "inherit",
                opacity: isActive ? 1 : 0.88,
                transition: "transform 200ms ease",
                transform: isActive ? "scale(1.05)" : "scale(1)",
              }}
            >
              {tab.icon}
            </Box>

            <Typography
              component="span"
              variant="body2"
              sx={{
                display: { xs: "none", sm: "block" },
                fontWeight: isActive ? 800 : 600,
                fontSize: "0.8125rem",
                letterSpacing: "0.01em",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </Typography>

          </Box>
        );
      })}
    </Box>
  );
};

