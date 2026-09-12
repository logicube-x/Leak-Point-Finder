import React from "react";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./Card";

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  minHeight?: number;
}

export function ChartContainer({
  title,
  subtitle,
  badge,
  action,
  minHeight = 280,
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <Card className={cn("overflow-hidden", className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle>{title}</CardTitle>
            {badge}
          </div>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </div>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className="pt-2">
        <div style={{ minHeight, width: "100%" }} className="relative">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
