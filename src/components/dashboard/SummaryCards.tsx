import { useNavigate } from "react-router-dom";
import { DollarSign, CreditCard, TrendingUp, Wrench } from "lucide-react";
import { todaySummary } from "@/data/mockData";

interface SummaryCard {
  label: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  navigateTo: string;
}

export function SummaryCards() {
  const navigate = useNavigate();

  const cards: SummaryCard[] = [
    { label: "Today Sales", value: todaySummary.totalSales, subtitle: `Cash: ₹${todaySummary.cashReceived.toLocaleString()}`, icon: DollarSign, iconColor: "text-success", navigateTo: "/sell" },
    { label: "Credit Sales", value: todaySummary.creditSales, subtitle: "Today's credit", icon: TrendingUp, iconColor: "text-warning", navigateTo: "/sell" },
    { label: "Outstanding", value: todaySummary.totalOutstanding, subtitle: "Total receivable", icon: CreditCard, iconColor: "text-destructive", navigateTo: "/customers" },
    { label: "Commissions", value: todaySummary.pendingCommissions, subtitle: "Pending payout", icon: Wrench, iconColor: "text-info", navigateTo: "/mechanics" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="stat-card" onClick={() => navigate(card.navigateTo)}>
          <div className="flex items-center justify-between mb-3">
            <span className="section-label">{card.label}</span>
            <card.icon className={`h-5 w-5 ${card.iconColor}`} />
          </div>
          <p className="text-2xl font-bold text-foreground">₹{card.value.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
