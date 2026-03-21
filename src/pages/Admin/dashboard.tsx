import {ChartLineDotsColors} from "@/components/ui/line-chart";
import {Card,CardContent,CardHeader,CardTitle,CardDescription} from "@/components/ui/card";


// Dashboard KPIs for a single market
export const kpiData = [
  {
    title:"Total Products",
    value:24,
    description:"Total products in this market"
  },
  {
    title:"Assigned Market",
    value:"Charanci",
    description:"Assigned market for this user"
  },
  {
    title:"Products Added ",
    value:0,
    description:"Products added today"
  }

]


export default function Dashboard() {
    return (
      <div className="m-4 p-5">
<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
  {kpiData.map(kpi => (
    <Card key={kpi.title} className="p-2 w-full">
      <CardHeader className="p-0" />
      <CardContent className="p-2">
        <CardTitle className="text-2xl font-bold text-center mb-4">
          {kpi.title}
        </CardTitle>
        <CardDescription className="text-xl font-bold text-center text-primary-venato">
          {kpi.value}
        </CardDescription>
      </CardContent>
    </Card>
  ))}
</div>

             <div className="w-3/5">
               <ChartLineDotsColors />
           </div>
      </div>

    );
}