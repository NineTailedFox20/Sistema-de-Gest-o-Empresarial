'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Loader, WandSparkles } from 'lucide-react';
import { generateCustomReport } from '@/ai/flows/generate-custom-reports';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function ReportGenerator() {
  const [query, setQuery] = useState('');
  const [report, setReport] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReport = async () => {
    if (!query.trim()) {
      setError('Por favor, insira uma pergunta para gerar o relatório.');
      return;
    }
    setIsLoading(true);
    setError('');
    setReport('');
    try {
      const result = await generateCustomReport({ query });
      setReport(result.report);
    } catch (e) {
      setError('Não foi possível gerar o relatório. Tente novamente.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <WandSparkles className="text-primary" />
            Gerador de Relatórios com IA
          </CardTitle>
          <CardDescription>
            Faça uma pergunta sobre seus dados de negócios e a IA gerará um
            relatório personalizado para você.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Ex: 'Qual a previsão de lucratividade para o próximo trimestre com base nas vendas atuais?' ou 'Identifique mudanças inesperadas no orçamento.'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            rows={4}
          />
          <Button onClick={handleGenerateReport} disabled={isLoading}>
            {isLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BrainCircuit className="mr-2 h-4 w-4" />
            )}
            {isLoading ? 'Gerando...' : 'Gerar Relatório'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
         <Card>
            <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <div>
                        <p className="font-semibold">Analisando dados e gerando seu relatório...</p>
                        <p className="text-sm text-muted-foreground">Isso pode levar alguns instantes.</p>
                    </div>
                </div>
            </CardContent>
         </Card>
      )}

      {report && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Relatório Personalizado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none text-foreground">
                <p>{report}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
