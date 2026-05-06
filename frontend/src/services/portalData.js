import { fetchDashboard } from './portalDataApi';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

function formatCurrency(value) {
  if (value == null || isNaN(Number(value))) return 'R$ 0,00';
  return currencyFormatter.format(Number(value));
}

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

function getDeliveryTone(stage) {
  if (!stage) return 'info';
  const lower = stage.toLowerCase();
  if (lower.includes('entreg') || lower.includes('conclu')) return 'success';
  if (lower.includes('separ') || lower.includes('progress')) return 'warning';
  if (lower.includes('cancel')) return 'danger';
  return 'info';
}

function isStageInProgress(stage) {
  if (!stage) return false;
  const lower = stage.toLowerCase();
  const finalStages = ['conclu', 'finaliz', 'cancel', 'entregue'];
  return !finalStages.some((s) => lower.includes(s));
}

function adaptClientPortalData(dashboard) {
  const {
    company,
    contact,
    summary,
    budgets = [],
    projects = [],
    deliveries = [],
    installations = [],
    documents = [],
  } = dashboard;

  // Mapas para enriquecer os relacionamentos
  const budgetById = new Map(budgets.map((b) => [b.id, b]));
  const installationByBudgetId = new Map();
  installations.forEach((inst) => {
    (inst.linkedBudgets || []).forEach((budgetId) => {
      installationByBudgetId.set(budgetId, inst);
    });
  });

  // Adaptar orçamentos
  const adaptedBudgets = budgets.map((budget) => ({
    id: budget.id,
    name: budget.product || 'Orçamento',
    value: budget.value,
    formattedValue: formatCurrency(budget.value),
    stage: budget.stage,
    budgetType: budget.budgetType || 'Tipo não informado',
    closingDate: formatDate(budget.closingDate),
    city: budget.city || 'Local não informado',
    active: !budget.closingDate, // ativo enquanto não fechou
    linkedProjects: budget.linkedProjects || [],
    linkedDeliveries: budget.linkedDeliveries || [],
  }));

  // Adaptar instalações (obras)
  const adaptedWorks = installations.map((inst) => {
    const linkedBudgetIds = inst.linkedBudgets || [];
    const linkedProjects = projects.filter((p) =>
      (p.linkedBudgets || []).some((bId) => linkedBudgetIds.includes(bId)),
    );
    const linkedDeliveries = deliveries.filter((d) =>
      (d.linkedBudgets || []).some((bId) => linkedBudgetIds.includes(bId)),
    );
    const firstBudget = linkedBudgetIds
      .map((id) => budgetById.get(id))
      .find(Boolean);

    return {
      id: inst.id,
      name: inst.serviceType || 'Obra',
      city: inst.city || 'Local não informado',
      stage: inst.endDate
        ? 'Concluída'
        : inst.startDate
          ? 'Em andamento'
          : 'Aguardando início',
      budgetType: firstBudget?.budgetType || 'Tipo não informado',
      linkedProjects,
      linkedDeliveries,
    };
  });

  // Adaptar projetos
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
      product: project.budgetType || 'Produto não informado',
      location: linkedInstallation?.city || linkedBudget?.city || 'Local não informado',
      type: project.budgetType || 'Tipo não informado',
      stage: project.stage,
      quantity: project.weight ? `${project.weight} kg` : 'Quantidade não informada',
      unitValue: 'A informar',
      totalValue: linkedBudget?.value ? formatCurrency(linkedBudget.value) : 'A informar',
      inProgress: isStageInProgress(project.stage),
    };
  });

  // Mapa de projetos
  const projectById = new Map(adaptedProjects.map((p) => [p.id, p]));

  // Adaptar entregas
  const adaptedDeliveries = deliveries.map((delivery) => {
    const linkedBudget = (delivery.linkedBudgets || [])
      .map((id) => budgetById.get(id))
      .find(Boolean);
    const linkedInstallation = (delivery.linkedBudgets || [])
      .map((id) => installationByBudgetId.get(id))
      .find(Boolean);
    const linkedProject = (linkedBudget?.linkedProjects || [])
      .map((id) => projectById.get(id))
      .find(Boolean);

    const hasDate = Boolean(delivery.deliveryDate);

    return {
      id: delivery.id,
      name: `Lote — ${delivery.stage || 'Entrega'}`,
      date: formatDate(delivery.deliveryDate),
      displayDate: formatDate(delivery.deliveryDate),
      hasDate,
      quantity: delivery.quantity ? `${delivery.quantity} un.` : 'A definir',
      status: delivery.stage || 'Programada',
      tone: getDeliveryTone(delivery.stage),
      projectName: linkedProject?.name || 'Projeto não vinculado',
      workName: linkedInstallation?.serviceType || 'Obra não vinculada',
      deliveryAddress: linkedInstallation?.deliveryAddress || delivery.city || 'Endereço não informado',
    };
  });

  // Adaptar anexos
const adaptedAttachments = documents.map((doc) => {
  // entityType normalizado para o filtro do front (sem acento, minúsculo)
  let entityType = 'documento';
  let linkedTypeLabel = 'Documento';

  if (doc.source === 'Orçamentos') {
    entityType = 'orcamento';
    linkedTypeLabel = 'Orçamento';
  } else if (doc.source === 'Instalações') {
    entityType = 'projeto';
    linkedTypeLabel = 'Obra';
  } else if (doc.source === 'Entregas') {
    entityType = 'entrega';
    linkedTypeLabel = 'Entrega';
  }

  // Tenta encontrar o nome do registro vinculado para exibir
  let linkedRecordName = doc.recordId || '-';
  if (doc.source === 'Orçamentos') {
    const budget = budgetById.get(doc.recordId);
    if (budget) {
      linkedRecordName = Array.isArray(budget.product)
        ? budget.product[0]
        : budget.product || 'Orçamento';
    }
  } else if (doc.source === 'Instalações') {
    const installation = installations.find((i) => i.id === doc.recordId);
    if (installation) {
      linkedRecordName = installation.installationId || installation.serviceType || 'Instalação';
    }
  } else if (doc.source === 'Entregas') {
    const delivery = deliveries.find((d) => d.id === doc.recordId);
    if (delivery) {
      linkedRecordName = `Entrega ${delivery.deliveryDate || ''}`.trim();
    }
  }

  // Identifica obras e projetos relacionados (para os filtros da tela)
  const relatedWorkIds = [];
  const relatedWorkNames = [];
  const relatedProjectIds = [];
  const relatedProjectNames = [];

  if (doc.source === 'Orçamentos') {
    const budget = budgetById.get(doc.recordId);
    if (budget) {
      // Projetos vinculados ao orçamento
      (budget.linkedProjects || []).forEach((projectId) => {
        const project = projects.find((p) => p.id === projectId);
        if (project) {
          relatedProjectIds.push(project.id);
          relatedProjectNames.push(project.name);
        }
      });
      // Obras (instalações) vinculadas ao orçamento
      const linkedInstallation = installationByBudgetId.get(budget.id);
      if (linkedInstallation) {
        relatedWorkIds.push(linkedInstallation.id);
        relatedWorkNames.push(linkedInstallation.serviceType || 'Obra');
      }
    }
  } else if (doc.source === 'Instalações') {
    const installation = installations.find((i) => i.id === doc.recordId);
    if (installation) {
      relatedWorkIds.push(installation.id);
      relatedWorkNames.push(installation.serviceType || 'Obra');
    }
  } else if (doc.source === 'Entregas') {
    const delivery = deliveries.find((d) => d.id === doc.recordId);
    if (delivery) {
      (delivery.linkedBudgets || []).forEach((budgetId) => {
        const inst = installationByBudgetId.get(budgetId);
        if (inst && !relatedWorkIds.includes(inst.id)) {
          relatedWorkIds.push(inst.id);
          relatedWorkNames.push(inst.serviceType || 'Obra');
        }
      });
    }
  }

  return {
    id: doc.id,
    name: doc.filename,
    category: doc.category || 'Documento',
    uploadedAt: 'Disponível',
    href: doc.url,
    actionLabel: 'Baixar',
    entityType,
    entityId: doc.recordId,
    linkedTypeLabel,
    linkedRecordName,
    relatedWorkIds,
    relatedWorkNames,
    relatedProjectIds,
    relatedProjectNames,
  };
});

  return {
    company: {
      name: company?.name || 'Empresa não informada',
      cityState: company?.state || 'Local não informado',
      primaryContact: contact?.name || 'Contato não informado',
      primaryEmail: contact?.email || '-',
      primaryPhone: contact?.phone || '-',
    },
    works: adaptedWorks,
    budgets: adaptedBudgets,
    projects: adaptedProjects,
    deliveries: adaptedDeliveries,
    attachments: adaptedAttachments,
    summaryCards: [
      {
        label: 'Obras',
        value: String(adaptedWorks.length),
        detail: `${adaptedProjects.length} projetos vinculados`,
        accent: '#004AE8',
      },
      {
        label: 'Orçamentos ativos',
        value: String(adaptedBudgets.filter((b) => b.active).length),
        detail: `${adaptedBudgets.length} orçamentos liberados para consulta`,
        accent: '#050866',
      },
      {
        label: 'Entregas programadas',
        value: String(adaptedDeliveries.filter((d) => d.hasDate).length),
        detail: `${adaptedDeliveries.filter((d) => !d.hasDate).length} entregas aguardando data`,
        accent: '#00A34A',
      },
      {
        label: 'Valor acompanhado',
        value: formatCurrency(summary?.financial?.totalBudgetValue ?? 0),
        detail: 'Soma dos orçamentos visíveis para a empresa',
        accent: '#B7791F',
      },
    ],
    readOnlyRules: [
      'Esta área reúne apenas os dados vinculados à empresa autenticada e ao contato principal.',
      'Os registros exibidos aqui servem para acompanhamento das obras, projetos, entregas e anexos.',
      'Os anexos respeitam as liberações disponíveis para esta conta.',
    ],
  };
}

export async function getClientPortalData() {
  const dashboard = await fetchDashboard();
  return adaptClientPortalData(dashboard);
}

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