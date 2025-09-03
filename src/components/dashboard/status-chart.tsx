'use client';
import { TrendingUp } from 'lucide-react';
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '../ui/skeleton';

type StatusData = {
  name: string;
  value: number;
  color: string;
}[];

const initialData: StatusData = [
  { name: 'Pago', value: 0, color: 'hsl(var(--chart-2))' },
  { name: 'Pendente', value: 0, color: 'hsl(var(--chart-4))' },
  { name: 'Não Pago', value: 0, color: 'hsl(var(--destructive))' },
];

const fetchStatusData = async (): Promise<StatusData> => {
    const statusCounts: {[key: string]: number} = {
        'Pago': 0,
        'Pendente': 0,
        'Não Pago': 0
    };

    const installmentsSnapshot = await getDocs(collection(db, 'installments'));
    installmentsSnapshot.forEach(doc => {
        const status = doc.data().status;
        if(status in statusCounts) {
            statusCounts[status]++;
        }
    });

    return initialData.map(item => ({
        ...item,
        value: statusCounts[item.name]
    }));
};


export function StatusChart() {
  const [data, setData] = useState<StatusData | null>(null);

  useEffect(() => {
    fetchStatusData().then(setData);
  }, []);

  if (!data) {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle className="font-headline">Parcelas por Status</CardTitle>
                <CardDescription>
                Distribuição das parcelas por status de pagamento.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 flex items-center justify-center">
                <Skeleton className="h-48 w-48 rounded-full" />
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="font-headline">Parcelas por Status</CardTitle>
        <CardDescription>
          Distribuição das parcelas por status de pagamento.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Tooltip
              cursor={false}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderRadius: 'var(--radius)',
                border: '1px solid hsl(var(--border))',
              }}
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              cx="50%"
              cy="50%"
            >
              {data.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontFamily: 'var(--font-body)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Tendência de adimplência crescente <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando a saúde financeira das cobranças.
        </div>
      </CardFooter>
    </Card>
  );
}
