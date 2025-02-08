import ReportHeader from "@/components/reports/ReportHeader";
import ReportBuilder from "@/components/reports/ReportBuilder";

export default function ReportsPage() {
  return (
    <div className="min-h-screen p-8">
      <ReportHeader />
      <ReportBuilder />
    </div>
  );
} 