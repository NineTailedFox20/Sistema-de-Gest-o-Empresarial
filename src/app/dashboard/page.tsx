
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { StatusChart } from '@/components/dashboard/status-chart';
import { RevenueForecast } from '@/components/dashboard/revenue-forecast';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

async function getDashboardData() {
  try {
    const clientsQuery = query(collection(db, 'clients'));
    const installmentsQuery = query(collection(db, 'installments'));
    const activeClientsQuery = query(collection(db, 'clients'), where('status', '==', 'Ativo'));
    const paidInstallmentsQuery = query(collection(db, 'installments'), where('status', '==', 'Pago'));

    const [clientsSnapshot, installmentsSnapshot, activeClientsSnapshot, paidInstallmentsSnapshot] = await Promise.all([
        getDocs(clientsQuery),
        getDocs(installmentsQuery),
        getDocs(activeClientsQuery),
        getDocs(paidInstallmentsSnapshot)
    ]);

    const totalClients = clientsSnapshot.size;
    const totalRevenue = clientsSnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalValue || 0), 0);
    const totalSales = paidInstallmentsSnapshot.size;
    const activeNow = activeClientsSnapshot.size;

    // Placeholder percentage changes
    const revenueChange = "+20.1%";
    const clientsChange = "+180.1%";
    const salesChange = "+19%";

    return {
      totalRevenue,
      totalClients,
      totalSales,
      activeNow,
      revenueChange,
      clientsChange,
      salesChange,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return default values in case of error
    return {
      totalRevenue: 0,
      totalClients: 0,
      totalSales: 0,
      activeNow: 0,
      revenueChange: "N/A",
      clientsChange: "N/A",
      salesChange: "N/A",
    };
  }
}


export default async function DashboardPage() {
  const data = await getDashboardData();
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                 {data.totalRevenue.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.revenueChange} em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.totalClients}</div>
            <p className="text-xs text-muted-foreground">
              {data.clientsChange} em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.totalSales}</div>
            <p className="text-xs text-muted-foreground">
              {data.salesChange} em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{data.activeNow}</div>
            <p className="text-xs text-muted-foreground">
              Total de clientes com status ativo
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Visão Geral</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart />
          </CardContent>
        </Card>
        <div className="col-span-4 lg:col-span-3 space-y-4 flex flex-col">
            <StatusChart />
            <RevenueForecast />
        </div>
      </div>
    </div>
  );
}
