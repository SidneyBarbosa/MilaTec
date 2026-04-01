export const summaryCards = [
  {
    label: 'Orçamento atual',
    value: 'R$ 8,4 mi',
    detail: 'Versão 1.3 aprovada',
    accent: '#00A86B',
  },
  {
    label: 'Status do projeto',
    value: 'Execução',
    detail: 'Fase 2 de 4',
    accent: '#1E3A8A',
  },
  {
    label: 'Próxima entrega',
    value: 'Estrutura metálica',
    detail: 'Prevista para 12/04',
    accent: '#2ED3A0',
  },
  {
    label: 'Documentos',
    value: '24 arquivos',
    detail: '3 novos esta semana',
    accent: '#F5F7FA',
  },
];

export const progressSteps = [
  { key: 'orcamento', label: 'Orçamento', status: 'done' },
  { key: 'planejamento', label: 'Planejamento', status: 'done' },
  { key: 'execucao', label: 'Execução', status: 'current' },
  { key: 'entrega', label: 'Entrega', status: 'todo' },
];

export const updates = [
  { title: 'Documento “Memorial Descritivo v2” enviado', date: '01/04', type: 'document' },
  { title: 'Etapa “Fundação” concluída', date: '29/03', type: 'milestone' },
  { title: 'Entrega “Lajes” atualizada para 08/04', date: '27/03', type: 'delivery' },
];

export const overviewMessage =
  'Seu projeto está em execução com avanço dentro do esperado. A próxima entrega é a estrutura metálica em 12/04. Todos os riscos críticos estão mapeados e sob controle.';
