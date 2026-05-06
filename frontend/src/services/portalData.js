import { fetchDashboard } from './portalDataApi';

// Formata um valor numérico em moeda brasileira.
function formatCurrency(value) {
  if (value == null || isNaN(Number(value))) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value));
}

// Formata uma data ISO para o padrão brasileiro DD/MM/AAAA.
function formatDate(isoDate) {
  if (!isoDate) return 'Sem data';
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return 'Sem data';
    return date.toLocaleDateString('pt-BR');
  } catch {
    return 'Sem data';
  }
}

// Identifica o "tom" de uma entrega com base no estágio para colorir badges.
function getDeliveryTone(stage) {
  if (!stage) return 'info';
  const lower = stage.toLowerCase();
  if (lower.includes('entreg') || lower.includes('conclu')) return 'success';
  if (lower.includes('separ') || lower.includes('progress')) return 'warning';
  if (lower.includes('cancel')) return 'danger';
  return 'info';
}

/* Adapta os dados consolidados do backend para o formato esperado
   pelas telas do cliente. */
function adaptClientPortalData(dashboard) {
  const { company, contact, summary, budgets, projects, deliveries, installations, documents } = dashboard;

  // Mapa de instalações por orçamento (para enriquecer projetos com nome de obra)
  const installationByBudgetId = new Map();
  installations.forEach((inst) => {
    (inst.linkedBudgets || []).forEach((budgetId) => {
      installationByBudgetId.set(budgetId, inst);
    });
  });

  // Obras (instalações) — formato esperado pelo front
  const works = installations.map((inst) => ({
    id: inst.id,
    name: inst.serviceType || 'Obra',
    city: inst.city || 'Local não informado',
    stage: inst.endDate ? 'Concluída' : (inst.startDate ? 'Em andamento' : 'Aguardando início'),
  }));

  // Mapa de orçamentos por ID (para enriquecer projetos e entregas)
  const budgetById = new Map(budgets.map((b) => [b.id, b]));

  // Projetos enriquecidos com nome da obra e orçamento
  const adaptedProjects = projects.map((project) => {
    const linkedBudget = (project.linkedBudgets || [])
      .map((id) => budgetById.get(id))
      .find(Boolean);
    const linkedInstallation = (project.linkedBudgets || [])
      .map((id) => installationByBudgetId.get(id))
      .find(Boolean);

    return {
      id: project.id,
      workId: linkedInstallation?.id || '',
      workName: linkedInstallation?.serviceType || 'Obra não vinculada',
      name: project.name,
      location: linkedInstallation?.city || linkedBudget?.city || 'Local não informado',
      type: project.budgetType || 'Tipo não informado',
      stage: project.stage,
      quantity: project.weight ? `${project.weight} kg` : 'Quantidade não informada',
      unitValue: 'A informar',
      totalValue: linkedBudget?.value ? formatCurrency(linkedBudget.value) : 'A informar',
    };
  });

  // Mapa de projetos por ID
  const projectById = new Map(adaptedProjects.map((p) => [p.id, p]));

  // Entregas enriquecidas
  const adaptedDeliveries = deliveries.map((delivery) => {
    const linkedBudget = (delivery.linkedBudgets || [])
      .map((id) => budgetById.get(id))
      .find(Boolean);
    const linkedProject = (linkedBudget?.linkedProjects || [])
      .map((id) => projectById.get(id))
      .find(Boolean);
    const linkedInstallation = (delivery.linkedBudgets || [])
      .map((id) => installationByBudgetId.get(id))
      .find(Boolean);

    return {
      name: `Lote — ${delivery.stage || 'Entrega'}`,
      date: formatDate(delivery.deliveryDate),
      quantity: delivery.quantity ? `${delivery.quantity} un.` : 'A definir',
      status: delivery.stage || 'Programada',
      tone: getDeliveryTone(delivery.stage),
      projectName: linkedProject?.name || 'Projeto não vinculado',
      workName: linkedInstallation?.serviceType || 'Obra não vinculada',
    };
  });

  // Anexos
  const attachments = (documents || []).map((doc) => ({
    name: doc.filename,
    category: doc.category || 'Documento',
    uploadedAt: 'Disponível',
    href: doc.url,
    actionLabel: 'Baixar',
  }));

  // Cards de resumo do dashboard
  const summaryCards = [
    {
      label: 'Obras',
      value: String(summary?.totals?.installations ?? 0),
      detail: `${summary?.totals?.projects ?? 0} projetos vinculados`,
      accent: '#004AE8',
    },
    {
      label: 'Orçamentos ativos',
      value: String(summary?.totals?.budgets ?? 0),
      detail: `${summary?.totals?.budgets ?? 0} orçamentos liberados para consulta`,
      accent: '#00A34A',
    },
    {
      label: 'Entregas programadas',
      value: String(summary?.progress?.pendingDeliveries ?? 0),
      detail: `${summary?.progress?.completedDeliveries ?? 0} entregas concluídas`,
      accent: '#050866',
    },
    {
      label: 'Valor acompanhado',
      value: formatCurrency(summary?.financial?.totalBudgetValue ?? 0),
      detail: 'Soma dos orçamentos visíveis para a empresa',
      accent: '#FF8A00',
    },
  ];

  return {
    company: {
      name: company?.name || 'Empresa não informada',
      cityState: company?.state ? `${company.state}` : 'Local não informado',
      primaryContact: contact?.name || 'Contato não informado',
      primaryEmail: contact?.email || '-',
      primaryPhone: contact?.phone || '-',
    },
    works,
    projects: adaptedProjects,
    deliveries: adaptedDeliveries,
    attachments,
    summaryCards,
    readOnlyRules: [
      'Esta área reúne apenas os dados vinculados à empresa autenticada e ao contato principal.',
      'Os registros exibidos aqui servem para acompanhamento das obras, projetos, entregas e anexos.',
      'Os anexos respeitam as liberações disponíveis para esta conta.',
    ],
  };
}

/* Função pública chamada pelas telas do cliente.
   Agora é assíncrona pois precisa buscar dados do backend. */
export async function getClientPortalData() {
  const dashboard = await fetchDashboard();
  return adaptClientPortalData(dashboard);
}

/* Função pública para a área administrativa.
   Mantida com mocks até implementarmos os endpoints admin no backend. */
export function getAdminPortalData() {
  return {
    summaryCards: [
      { label: 'Empresas ativas', value: '—', detail: 'Aguardando integração admin', accent: '#050866' },
      { label: 'Obras monitoradas', value: '—', detail: 'Aguardando integração admin', accent: '#004AE8' },
      { label: 'Entregas publicadas', value: '—', detail: 'Aguardando integração admin', accent: '#00A34A' },
      { label: 'Anexos liberados', value: '—', detail: 'Aguardando integração admin', accent: '#004AE8' },
    ],
    customers: [],
    works: [],
    projects: [],
    deliveries: [],
    attachments: [],
  };
}