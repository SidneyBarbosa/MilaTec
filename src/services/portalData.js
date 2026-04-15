import { anexos, contatos, empresas, entregas, instalacoes, obras, orcamentos, projetos } from '@/mocks/portalEntities';

const clientWorks = [
  {
    id: 'obra-metalica-440',
    name: 'Metálica 440',
    city: 'Fortaleza, CE',
    stage: 'Em andamento',
  },
  {
    id: 'obra-centro-apoio-logistico',
    name: 'Centro de apoio logístico',
    city: 'Maracanaú, CE',
    stage: 'Aprovação de projetos',
  },
];

const clientProjectsBase = [
  {
    id: 'proj-estrutura-principal',
    workId: 'obra-metalica-440',
    name: 'Estrutura principal',
    location: 'Fortaleza, CE',
    type: 'Galpão industrial',
    stage: 'Projeto em andamento',
    quantity: '120 peças',
    unitValue: 'R$ 12.400,00',
    totalValue: 'R$ 1.488.000,00',
  },
  {
    id: 'proj-cobertura-modular',
    workId: 'obra-metalica-440',
    name: 'Cobertura modular',
    location: 'Fortaleza, CE',
    type: 'Cobertura metálica',
    stage: 'Projeto executivo',
    quantity: '48 módulos',
    unitValue: 'R$ 8.350,00',
    totalValue: 'R$ 400.800,00',
  },
  {
    id: 'proj-passarela-tecnica',
    workId: 'obra-centro-apoio-logistico',
    name: 'Passarela técnica',
    location: 'Maracanaú, CE',
    type: 'Estrutura complementar',
    stage: 'Orçamento',
    quantity: '14 conjuntos',
    unitValue: 'R$ 18.700,00',
    totalValue: 'R$ 261.800,00',
  },
];

const clientDeliveriesBase = [
  {
    projectId: 'proj-estrutura-principal',
    name: 'Lote A de pilares',
    date: '12/04/2026',
    quantity: '32 peças',
    status: 'Programada',
    tone: 'info',
  },
  {
    projectId: 'proj-cobertura-modular',
    name: 'Lote B de vigas',
    date: '18/04/2026',
    quantity: '24 peças',
    status: 'Confirmada',
    tone: 'success',
  },
  {
    projectId: 'proj-passarela-tecnica',
    name: 'Kit de fixação secundária',
    date: '23/04/2026',
    quantity: '14 caixas',
    status: 'Em separação',
    tone: 'warning',
  },
];

const clientWorksById = Object.fromEntries(clientWorks.map((work) => [work.id, work]));
const clientProjectsById = Object.fromEntries(clientProjectsBase.map((project) => [project.id, project]));

const clientPortalData = {
  company: {
    name: 'Grupo Horizonte Participações',
    cityState: 'Fortaleza, CE',
    primaryContact: 'João Miguel',
    primaryEmail: 'joao@grupohorizonte.com',
    primaryPhone: '(85) 99999-4400',
  },
  works: clientWorks,
  projects: clientProjectsBase.map((project) => ({
    ...project,
    workName: clientWorksById[project.workId]?.name || 'Obra não vinculada',
  })),
  deliveries: clientDeliveriesBase.map((delivery) => {
    const linkedProject = clientProjectsById[delivery.projectId];
    const linkedWork = linkedProject ? clientWorksById[linkedProject.workId] : null;

    return {
      ...delivery,
      projectName: linkedProject?.name || 'Projeto não vinculado',
      workName: linkedWork?.name || 'Obra não vinculada',
    };
  }),
  attachments: [
    {
      name: 'cronograma-executivo-abril.pdf',
      category: 'Cronograma',
      uploadedAt: '01/04/2026',
      href: '#',
      actionLabel: 'Visualizar',
    },
    {
      name: 'mapa-de-entregas-v2.xlsx',
      category: 'Logística',
      uploadedAt: '31/03/2026',
      href: '#',
      actionLabel: 'Baixar',
    },
  ],
  summaryCards: [
    {
      label: 'Empresa vinculada',
      value: '1 conta',
      detail: 'Dados exibidos para esta conta',
      accent: '#050866',
    },
    {
      label: 'Obras publicadas',
      value: '2',
      detail: 'Obras vinculadas ao escopo ativo',
      accent: '#004AE8',
    },
    {
      label: 'Projetos visíveis',
      value: '3',
      detail: 'Projetos alinhados à operação da empresa',
      accent: '#00A34A',
    },
    {
      label: 'Anexos liberados',
      value: '3',
      detail: 'Arquivos disponíveis para consulta',
      accent: '#004AE8',
    },
  ],
  readOnlyRules: [
    'Esta área reúne apenas os dados vinculados à empresa autenticada e ao contato principal.',
    'Os registros exibidos aqui servem para acompanhamento das obras, projetos, entregas e anexos.',
    'Os anexos respeitam as liberações disponíveis para esta conta.',
  ],
};

const adminPortalData = {
  summaryCards: [
    {
      label: 'Empresas ativas',
      value: '12',
      detail: 'Contas com acesso liberado',
      accent: '#050866',
    },
    {
      label: 'Obras monitoradas',
      value: '27',
      detail: 'Visão consolidada das obras ativas',
      accent: '#004AE8',
    },
    {
      label: 'Entregas publicadas',
      value: '86',
      detail: 'Status atualizados por cliente',
      accent: '#00A34A',
    },
    {
      label: 'Anexos liberados',
      value: '214',
      detail: 'Materiais publicados com controle de visibilidade',
      accent: '#004AE8',
    },
  ],
  customers: [
    {
      company: 'Grupo Horizonte Participações',
      cityState: 'Fortaleza, CE',
      primaryContact: 'João Miguel',
      email: 'jo***@grupohorizonte.com',
      scope: 'Empresa, obras, projetos, entregas e anexos',
    },
    {
      company: 'Atlas Real Estate',
      cityState: 'Recife, PE',
      primaryContact: 'Paula Menezes',
      email: 'pa***@atlas.com',
      scope: 'Obras, entregas e anexos publicados',
    },
    {
      company: 'Nova Linha Logística',
      cityState: 'Caucaia, CE',
      primaryContact: 'Bruno Lima',
      email: 'br***@novalinha.com',
      scope: 'Empresa, projetos e anexos aprovados',
    },
  ],
  works: [
    {
      client: 'Grupo Horizonte Participações',
      name: 'Metálica 440',
      city: 'Fortaleza, CE',
      stage: 'Em andamento',
    },
    {
      client: 'Atlas Real Estate',
      name: 'Campus Norte',
      city: 'Recife, PE',
      stage: 'Pós-vendas',
    },
    {
      client: 'Nova Linha Logística',
      name: 'Hub Oeste',
      city: 'Caucaia, CE',
      stage: 'Piloto',
    },
  ],
  projects: [
    {
      client: 'Grupo Horizonte Participações',
      name: 'Estrutura principal',
      location: 'Fortaleza, CE',
      type: 'Galpão industrial',
      stage: 'Projeto em andamento',
      quantity: '120 peças',
      unitValue: 'R$ 12.400,00',
      totalValue: 'R$ 1.488.000,00',
    },
    {
      client: 'Atlas Real Estate',
      name: 'Cobertura norte',
      location: 'Recife, PE',
      type: 'Cobertura metálica',
      stage: 'Aguardando aprovação',
      quantity: '64 módulos',
      unitValue: 'R$ 9.800,00',
      totalValue: 'R$ 627.200,00',
    },
    {
      client: 'Nova Linha Logística',
      name: 'Passarela técnica',
      location: 'Caucaia, CE',
      type: 'Estrutura complementar',
      stage: 'Revisão de projeto',
      quantity: '14 conjuntos',
      unitValue: 'R$ 18.700,00',
      totalValue: 'R$ 261.800,00',
    },
  ],
  deliveries: [
    {
      client: 'Grupo Horizonte Participações',
      name: 'Lote A de pilares',
      date: '12/04/2026',
      quantity: '32 peças',
      status: 'Programada',
      tone: 'info',
    },
    {
      client: 'Atlas Real Estate',
      name: 'Trelica secundaria',
      date: '16/04/2026',
      quantity: '18 peças',
      status: 'Confirmada',
      tone: 'success',
    },
    {
      client: 'Nova Linha Logística',
      name: 'Kit de chumbadores',
      date: '19/04/2026',
      quantity: '12 caixas',
      status: 'Em separação',
      tone: 'warning',
    },
  ],
  attachments: [
    {
      client: 'Grupo Horizonte Participações',
      name: 'cronograma-executivo-abril.pdf',
      category: 'Cronograma',
      uploadedAt: '01/04/2026',
      visibility: 'Cliente e administração',
      actionLabel: 'Abrir',
      href: '#',
    },
    {
      client: 'Atlas Real Estate',
      name: 'mapa-logistico-semana-14.xlsx',
      category: 'Logística',
      uploadedAt: '31/03/2026',
      visibility: 'Cliente e administração',
      actionLabel: 'Baixar',
      href: '#',
    },
    {
      client: 'Nova Linha Logística',
      name: 'relatorio-interno-de-custos.pdf',
      category: 'Financeiro',
      uploadedAt: '30/03/2026',
      visibility: 'Administração',
      actionLabel: 'Restringido',
      href: '#',
    },
  ],
  accessSummary: [
    {
      label: 'Perfis ativos',
      value: '18',
      detail: '12 contas cliente e 6 acessos internos',
      accent: '#050866',
    },
    {
      label: 'Revisões pendentes',
      value: '3',
      detail: 'Escopos aguardando nova checagem',
      accent: '#B7791F',
    },
    {
      label: 'Bloqueios recentes',
      value: '2',
      detail: 'Tentativas fora do perfil barradas hoje',
      accent: '#004AE8',
    },
  ],
  accessProfiles: [
    {
      profile: 'Cliente',
      owner: 'Grupo Horizonte Participações',
      scope: 'Empresa, obras, projetos, entregas e anexos',
      status: 'Ativo',
      tone: 'success',
      reviewedAt: '05/04/2026',
    },
    {
      profile: 'Cliente',
      owner: 'Atlas Real Estate',
      scope: 'Obras, entregas e anexos publicados',
      status: 'Revisar escopo',
      tone: 'warning',
      reviewedAt: '03/04/2026',
    },
    {
      profile: 'Admin Ops',
      owner: 'Operações MilaTec',
      scope: 'Clientes, obras, projetos, entregas, anexos e acessos',
      status: 'Auditado',
      tone: 'info',
      reviewedAt: '08/04/2026',
    },
    {
      profile: 'Diretoria',
      owner: 'Liderança MilaTec',
      scope: 'Leitura executiva e materiais restritos autorizados',
      status: 'Restrito',
      tone: 'critical',
      reviewedAt: '07/04/2026',
    },
  ],
  accessActions: [
    {
      title: 'Revisar escopo da conta Atlas Real Estate',
      detail: 'Liberação parcial precisa ser confirmada antes da próxima publicação.',
    },
    {
      title: 'Validar troca de responsável da conta Grupo Horizonte',
      detail: 'Contato principal atualizado e aguardando confirmação operacional.',
    },
    {
      title: 'Encerrar acesso temporário de homologação',
      detail: 'Perfil técnico expira em 09/04/2026 e deve ser removido da lista ativa.',
    },
  ],
  securityRules: [
    'Toda liberação depende de perfil, empresa e escopo homologado pela operação.',
    'Perfis administrativos permanecem separados por responsabilidade operacional.',
    'Tentativas fora do escopo e anexos restritos seguem bloqueados antes da camada cliente.',
  ],
};

const DEFAULT_COMPANY_ID = 'emp-grupo-horizonte';
const MOCK_TODAY = new Date('2026-04-14T00:00:00');

const empresasById = Object.fromEntries(empresas.map((empresa) => [empresa.id, empresa]));
const contatosByEmpresaId = contatos.reduce((acc, contato) => {
  acc[contato.empresaId] = acc[contato.empresaId] || [];
  acc[contato.empresaId].push(contato);
  return acc;
}, {});
const obrasById = Object.fromEntries(obras.map((obra) => [obra.id, obra]));
const orcamentosById = Object.fromEntries(orcamentos.map((orcamento) => [orcamento.id, orcamento]));
const projetosById = Object.fromEntries(projetos.map((projeto) => [projeto.id, projeto]));
const entregasById = Object.fromEntries(entregas.map((entrega) => [entrega.id, entrega]));

function parseBrDate(date) {
  if (!date) return null;

  const [day, month, year] = date.split('/');
  return new Date(`${year}-${month}-${day}T00:00:00`);
}

function getUpcoming(items, dateKey = 'date') {
  const datedItems = items
    .filter((item) => Boolean(item[dateKey]))
    .map((item) => ({ ...item, parsedDate: parseBrDate(item[dateKey]) }))
    .filter((item) => item.parsedDate && item.parsedDate >= MOCK_TODAY)
    .sort((a, b) => a.parsedDate - b.parsedDate);

  return datedItems[0] || null;
}

function getVisibleSchedule(items) {
  return items
    .filter((item) => {
      const parsedDate = parseBrDate(item.date);
      return !parsedDate || parsedDate >= MOCK_TODAY;
    })
    .sort((a, b) => {
      const dateA = parseBrDate(a.date);
      const dateB = parseBrDate(b.date);

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateA - dateB;
    });
}

function formatCount(count, singular, plural) {
  return `${count} ${count === 1 ? singular : plural}`;
}

function parseCurrency(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;

  const normalized = String(value)
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function joinOrFallback(values, fallback) {
  const list = unique(values);
  return list.length ? list.join(' + ') : fallback;
}

function groupAttachmentsByEntity(attachments) {
  return attachments.reduce((acc, attachment) => {
    const key = `${attachment.entityType}:${attachment.entityId}`;
    acc[key] = acc[key] || [];
    acc[key].push(enrichAttachment(attachment));
    return acc;
  }, {});
}

function normalizeText(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function findAttachmentByCategory(attachments, categories) {
  const categoryList = Array.isArray(categories) ? categories : [categories];
  const normalizedCategories = categoryList.map(normalizeText);

  return attachments.find((attachment) => normalizedCategories.includes(normalizeText(attachment.category))) || null;
}

function resolveCompanyId(companyId) {
  return empresasById[companyId] ? companyId : DEFAULT_COMPANY_ID;
}

function resolveContact(companyId) {
  const companyContacts = contatosByEmpresaId[companyId] || [];
  return companyContacts.find((contato) => contato.primary) || companyContacts[0] || null;
}

function resolveAttachmentLink(attachment) {
  if (attachment.entityType === 'orcamento') {
    const record = orcamentosById[attachment.entityId];
    return {
      linkedTypeLabel: 'Orçamento',
      linkedRecordName: record?.name || 'Orçamento não vinculado',
    };
  }

  if (attachment.entityType === 'projeto') {
    const record = projetosById[attachment.entityId];
    return {
      linkedTypeLabel: 'Projeto',
      linkedRecordName: record?.name || 'Projeto não vinculado',
    };
  }

  if (attachment.entityType === 'entrega') {
    const record = entregasById[attachment.entityId];
    return {
      linkedTypeLabel: 'Entrega',
      linkedRecordName: record?.name || 'Entrega não vinculada',
    };
  }

  return {
    linkedTypeLabel: 'Arquivo',
    linkedRecordName: 'Registro vinculado',
  };
}

function enrichAttachment(attachment) {
  return {
    ...attachment,
    ...resolveAttachmentLink(attachment),
  };
}

function buildClientPortalData(companyId = DEFAULT_COMPANY_ID) {
  const scopedCompanyId = resolveCompanyId(companyId);
  const companyRecord = empresasById[scopedCompanyId];
  const primaryContact = resolveContact(scopedCompanyId);
  const companyBudgets = orcamentos.filter((orcamento) => orcamento.empresaId === scopedCompanyId);
  const companyBudgetIds = new Set(companyBudgets.map((orcamento) => orcamento.id));
  const companyProjects = projetos.filter((projeto) => companyBudgetIds.has(projeto.orcamentoId));
  const companyProjectIds = new Set(companyProjects.map((projeto) => projeto.id));
  const companyWorks = obras.filter((obra) => obra.empresaId === scopedCompanyId);
  const companyDeliveries = entregas.filter((entrega) => companyProjectIds.has(entrega.projetoId));
  const companyDeliveryIds = new Set(companyDeliveries.map((entrega) => entrega.id));
  const companyInstallations = instalacoes.filter((instalacao) => companyProjectIds.has(instalacao.projetoId));
  const companyAttachments = anexos.filter((anexo) => {
    if (anexo.entityType === 'orcamento') return companyBudgetIds.has(anexo.entityId);
    if (anexo.entityType === 'projeto') return companyProjectIds.has(anexo.entityId);
    if (anexo.entityType === 'entrega') return companyDeliveryIds.has(anexo.entityId);
    return false;
  });

  const attachmentsByEntity = groupAttachmentsByEntity(companyAttachments);
  const getEntityAttachments = (entityType, entityId) => attachmentsByEntity[`${entityType}:${entityId}`] || [];

  const budgetAttachmentsById = companyBudgets.reduce((acc, budget) => {
    acc[budget.id] = getEntityAttachments('orcamento', budget.id);
    return acc;
  }, {});

  const projects = companyProjects.map((project) => {
    const work = obrasById[project.obraId];
    const budget = orcamentosById[project.orcamentoId];
    const projectAttachments = getEntityAttachments('projeto', project.id);

    return {
      ...project,
      workName: work?.name || 'Obra não vinculada',
      workCity: work?.city || 'Cidade não informada',
      budgetName: budget?.name || 'Orçamento não vinculado',
      budgetType: budget?.budgetType || budget?.status || 'Tipo não informado',
      budgetValue: budget?.value || project.totalValue,
      budgetStatus: budget?.status || 'Status não informado',
      attachments: projectAttachments,
      preProjectAttachment: findAttachmentByCategory(projectAttachments, ['Pré-projeto', 'Pre-projeto']),
      executiveAttachment: findAttachmentByCategory(projectAttachments, 'Projeto executivo'),
      approvalAttachment: findAttachmentByCategory(projectAttachments, ['Projeto aprovação', 'Projeto para aprovação']),
      registrationAttachment: findAttachmentByCategory(projectAttachments, ['Registro de obra', 'Fotos da obra']),
    };
  });

  const deliveries = companyDeliveries.map((delivery) => {
    const linkedProject = projetosById[delivery.projetoId];
    const linkedWork = linkedProject ? obrasById[linkedProject.obraId] : null;
    const deliveryAttachments = getEntityAttachments('entrega', delivery.id);
    const hasDate = Boolean(delivery.date);

    return {
      ...delivery,
      projectName: linkedProject?.name || 'Projeto não vinculado',
      workName: linkedWork?.name || 'Obra não vinculada',
      workId: linkedWork?.id || linkedProject?.obraId || '',
      workCity: linkedWork?.city || 'Cidade não informada',
      hasDate,
      displayDate: hasDate ? delivery.date : 'Sem data agendada',
      tone: hasDate ? delivery.tone : 'warning',
      invoiceDate: delivery.invoiceDate || 'A faturar',
      value: delivery.value || linkedProject?.totalValue || 'Valor não informado',
      deliveryAddress: delivery.deliveryAddress || linkedWork?.city || 'Endereço não informado',
      attachments: deliveryAttachments,
      invoiceAttachment: findAttachmentByCategory(deliveryAttachments, 'Nota fiscal'),
      packingListAttachment: findAttachmentByCategory(deliveryAttachments, 'Romaneio'),
      purchaseOrderAttachment: findAttachmentByCategory(deliveryAttachments, 'Pedido de compra'),
    };
  });

  const installations = companyInstallations.map((installation) => {
    const linkedProject = projetosById[installation.projetoId];
    const linkedWork = linkedProject ? obrasById[linkedProject.obraId] : null;
    const hasDate = Boolean(installation.date);

    return {
      ...installation,
      projectName: linkedProject?.name || 'Projeto não vinculado',
      workName: linkedWork?.name || 'Obra não vinculada',
      hasDate,
      displayDate: hasDate ? installation.date : 'Sem data agendada',
      tone: hasDate ? installation.tone : 'warning',
    };
  });

  const budgets = companyBudgets.map((budget) => ({
    ...budget,
    attachments: budgetAttachmentsById[budget.id] || [],
  }));

  const works = companyWorks.map((work) => {
    const linkedProjects = projects.filter((project) => project.obraId === work.id);
    const linkedDeliveries = deliveries.filter((delivery) => delivery.workId === work.id);
    const linkedBudgetIds = unique(linkedProjects.map((project) => project.orcamentoId));
    const linkedAttachments = [
      ...linkedBudgetIds.flatMap((budgetId) => budgetAttachmentsById[budgetId] || []),
      ...linkedProjects.flatMap((project) => project.attachments),
      ...linkedDeliveries.flatMap((delivery) => delivery.attachments),
    ];
    const totalValue = linkedProjects.reduce((sum, project) => sum + parseCurrency(project.totalValue), 0);

    return {
      ...work,
      quantity: joinOrFallback(linkedProjects.map((project) => project.quantity), 'Sem quantidade informada'),
      value: formatCurrency(totalValue),
      budgetType: joinOrFallback(linkedProjects.map((project) => project.budgetType), 'Tipo não informado'),
      budgetTypes: unique(linkedProjects.map((project) => project.budgetType)),
      linkedProjects: linkedProjects.map((project) => ({
        id: project.id,
        name: project.name,
        product: project.product,
        type: project.type,
        budgetType: project.budgetType,
        stage: project.stage,
        quantity: project.quantity,
        unitValue: project.unitValue,
        totalValue: project.totalValue,
        registrationAttachment: project.registrationAttachment,
      })),
      linkedDeliveries: linkedDeliveries.map((delivery) => ({
        id: delivery.id,
        name: delivery.name,
        displayDate: delivery.displayDate,
        invoiceDate: delivery.invoiceDate,
        deliveryAddress: delivery.deliveryAddress,
        quantity: delivery.quantity,
        value: delivery.value,
        status: delivery.status,
        stage: delivery.stage,
        purchaseOrderAttachment: delivery.purchaseOrderAttachment,
      })),
      attachments: linkedAttachments,
    };
  });

  const activeBudgets = budgets.filter((budget) => budget.active);
  const inProgressProjects = projects.filter((project) => project.inProgress);
  const nextDelivery = getUpcoming(deliveries);
  const nextInstallation = getUpcoming(installations);

  return {
    company: {
      id: companyRecord.id,
      name: companyRecord.name,
      cityState: `${companyRecord.city}, ${companyRecord.state}`,
      primaryContact: primaryContact?.name || 'Contato não informado',
      primaryEmail: primaryContact?.email || 'E-mail não informado',
      primaryPhone: primaryContact?.phone || 'Telefone não informado',
    },
    contacts: contatosByEmpresaId[scopedCompanyId] || [],
    works,
    budgets,
    projects,
    deliveries,
    installations,
    attachments: companyAttachments.map(enrichAttachment),
    home: {
      welcomeTitle: `Bem-vindo, ${companyRecord.name}`,
      welcomeText:
        'Acompanhe orçamentos, projetos, entregas, instalações e arquivos liberados para a sua empresa.',
      nextDeliveries: getVisibleSchedule(deliveries).slice(0, 3),
      nextInstallations: getVisibleSchedule(installations).slice(0, 3),
      summaryCards: [
        {
          label: 'Orçamentos ativos',
          value: String(activeBudgets.length),
          detail: formatCount(activeBudgets.length, 'orçamento em acompanhamento', 'orçamentos em acompanhamento'),
          accent: '#050866',
        },
        {
          label: 'Projetos em andamento',
          value: String(inProgressProjects.length),
          detail: formatCount(inProgressProjects.length, 'projeto vinculado', 'projetos vinculados'),
          accent: '#004AE8',
        },
        {
          label: 'Próxima entrega',
          value: nextDelivery?.name || 'Sem entrega',
          detail: nextDelivery ? `${nextDelivery.displayDate} · ${nextDelivery.projectName}` : 'Nenhuma entrega programada',
          accent: '#00A34A',
        },
        {
          label: 'Próxima instalação',
          value: nextInstallation?.name || 'Sem instalação',
          detail: nextInstallation
            ? `${nextInstallation.displayDate} · ${nextInstallation.team}`
            : 'Nenhuma instalação programada',
          accent: '#B7791F',
        },
      ],
    },
    summaryCards: [
      {
        label: 'Empresa vinculada',
        value: '1 conta',
        detail: 'Dados exibidos somente para esta empresa',
        accent: '#050866',
      },
      {
        label: 'Obras publicadas',
        value: String(companyWorks.length),
        detail: formatCount(companyWorks.length, 'obra disponível', 'obras disponíveis'),
        accent: '#004AE8',
      },
      {
        label: 'Projetos visíveis',
        value: String(projects.length),
        detail: formatCount(projects.length, 'projeto em consulta', 'projetos em consulta'),
        accent: '#00A34A',
      },
      {
        label: 'Anexos liberados',
        value: String(companyAttachments.length),
        detail: formatCount(companyAttachments.length, 'arquivo disponível', 'arquivos disponíveis'),
        accent: '#004AE8',
      },
    ],
    readOnlyRules: [
      'Esta área reúne apenas informações vinculadas à empresa autenticada.',
      'O portal é visual e não permite alteração de dados operacionais.',
      'Arquivos e registros aparecem somente quando estão liberados para consulta.',
    ],
  };
}

function resolveProjectCompany(project) {
  const budget = orcamentosById[project?.orcamentoId];
  const work = obrasById[project?.obraId];
  return empresasById[budget?.empresaId] || empresasById[work?.empresaId] || null;
}

function resolveAttachmentCompany(attachment) {
  if (attachment.entityType === 'orcamento') {
    return empresasById[orcamentosById[attachment.entityId]?.empresaId] || null;
  }

  if (attachment.entityType === 'projeto') {
    return resolveProjectCompany(projetosById[attachment.entityId]);
  }

  if (attachment.entityType === 'entrega') {
    const delivery = entregasById[attachment.entityId];
    return resolveProjectCompany(projetosById[delivery?.projetoId]);
  }

  return null;
}

function buildAdminPortalData() {
  const customers = empresas.map((empresa) => {
    const primaryContact = resolveContact(empresa.id);

    return {
      company: empresa.name,
      cityState: `${empresa.city}, ${empresa.state}`,
      primaryContact: primaryContact?.name || 'Contato não informado',
      email: primaryContact?.email || 'E-mail não informado',
      scope: 'Empresas, contatos, obras, projetos, entregas, anexos e relacionamentos',
    };
  });

  const adminWorks = obras.map((work) => ({
    client: empresasById[work.empresaId]?.name || 'Empresa não vinculada',
    name: work.name,
    city: work.city,
    stage: work.stage,
  }));

  const adminProjects = projetos.map((project) => {
    const company = resolveProjectCompany(project);
    const work = obrasById[project.obraId];
    const budget = orcamentosById[project.orcamentoId];

    return {
      client: company?.name || 'Empresa não vinculada',
      name: project.name,
      location: project.location,
      type: project.type,
      stage: project.stage,
      quantity: project.quantity,
      unitValue: project.unitValue,
      totalValue: project.totalValue,
      workName: work?.name || 'Obra não vinculada',
      budgetType: budget?.budgetType || 'Tipo não informado',
    };
  });

  const adminDeliveries = entregas.map((delivery) => {
    const project = projetosById[delivery.projetoId];
    const company = resolveProjectCompany(project);
    const work = project ? obrasById[project.obraId] : null;

    return {
      client: company?.name || 'Empresa não vinculada',
      name: delivery.name,
      date: delivery.date || 'Sem data',
      invoiceDate: delivery.invoiceDate || 'A faturar',
      quantity: delivery.quantity,
      status: delivery.status,
      stage: delivery.stage,
      value: delivery.value,
      tone: delivery.tone,
      workName: work?.name || 'Obra não vinculada',
    };
  });

  const adminAttachments = anexos.map((attachment) => {
    const company = resolveAttachmentCompany(attachment);
    const linkedInfo = resolveAttachmentLink(attachment);

    return {
      ...attachment,
      ...linkedInfo,
      client: company?.name || 'Empresa não vinculada',
      visibility: 'Cliente e administração',
      actionLabel: attachment.actionLabel === 'Visualizar' ? 'Abrir' : attachment.actionLabel,
    };
  });

  return {
    ...adminPortalData,
    summaryCards: [
      {
        label: 'Empresas ativas',
        value: String(empresas.length),
        detail: formatCount(empresas.length, 'empresa cadastrada', 'empresas cadastradas'),
        accent: '#050866',
      },
      {
        label: 'Obras monitoradas',
        value: String(obras.length),
        detail: 'Visão completa para administração',
        accent: '#004AE8',
      },
      {
        label: 'Entregas publicadas',
        value: String(entregas.length),
        detail: 'Datas, status e faturamento centralizados',
        accent: '#00A34A',
      },
      {
        label: 'Anexos liberados',
        value: String(anexos.length),
        detail: 'Arquivos com vínculo e referência',
        accent: '#004AE8',
      },
    ],
    customers,
    works: adminWorks,
    projects: adminProjects,
    deliveries: adminDeliveries,
    attachments: adminAttachments,
  };
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getClientPortalData(companyId = DEFAULT_COMPANY_ID) {
  return clone(buildClientPortalData(companyId));
}

export function getAdminPortalData() {
  return clone(buildAdminPortalData());
}


