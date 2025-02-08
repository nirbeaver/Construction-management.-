import { Plus } from "lucide-react";
import ExpenseHeader from "@/components/office-expenses/ExpenseHeader";
import ExpenseTabs from "@/components/office-expenses/ExpenseTabs";

export default function OfficeExpensesPage() {
  return (
    <div className="min-h-screen p-8">
      <ExpenseHeader />
      <ExpenseTabs />
    </div>
  );
} 