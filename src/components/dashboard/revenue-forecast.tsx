'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { BrainCircuit, Loader } from 'lucide-react';
import { generateRevenueForecast } from '@/ai/flows/generate-revenue-forecast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function RevenueForecast() {
  const [showTool, setShowTool] = useState(true);
  const [forecast, setForecast] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateForecast = async () => {
    setIsLoading(true);
    setError('');
    setForecast('');
    try {
      const revenueData = {
        monthlyRevenue: [
          Math.floor(Math.random() * 2000) + 8000,
          Math.floor(Math.random() * 2000) + 9000,
          Math.floor(Math.random() * 2000) + 10000,
        ],
        currency: 'BRL',
      };
      const result = await generateRevenueForecast(revenueData);
      setForecast(result.forecast);
    } catch (e) {
      setError('Não foi possível gerar a previsão. Tente novamente.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline">Previsão com IA</CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="show-forecast-tool">Mostrar Ferramenta</Label>
            <Switch
              id="show-forecast-tool"
              checked={showTool}
              onCheckedChange={setShowTool}
            />
          </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {showTool && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use nossa IA para analisar as tendências dos últimos 3 meses e
                  prever o impacto futuro na receita.
                </p>
                <Button onClick={handleGenerateForecast} disabled={isLoading}>
                  {isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BrainCircuit className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Analisando...' : 'Gerar Previsão'}
                </Button>
                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {forecast && (
                  <Alert>
                    <AlertTitle className='font-headline'>Análise da IA</AlertTitle>
                    <AlertDescription>{forecast}</AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
