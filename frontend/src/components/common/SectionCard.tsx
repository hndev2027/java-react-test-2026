import type { PropsWithChildren, ReactNode } from "react";
import { Paper, Stack, Typography } from "@mui/material";

type SectionCardProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}>;

export function SectionCard({
  action,
  children,
  subtitle,
  title,
}: SectionCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
        boxShadow: "0 2px 8px rgba(8, 145, 178, 0.04)",
        transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: "0 12px 32px rgba(8, 145, 178, 0.08)",
          borderColor: "primary.light",
        },
      }}
    >
      {(title || action) && (
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          spacing={2}
          sx={{
            px: 2.5,
            py: 2,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.default",
            background:
              "linear-gradient(135deg, rgba(207, 250, 254, 0.3) 0%, rgba(207, 250, 254, 0.1) 100%)",
          }}
        >
          <Stack spacing={0.25}>
            {title && (
              <Typography variant="subtitle1" fontWeight={800}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Stack>
          {action}
        </Stack>
      )}

      {children}
    </Paper>
  );
}
