const clientWorks = [
  {
    id: 'obra-metalica-440',
    name: 'Metálica 440',
    city: 'Fortaleza, CE',
    stage: 'Estrutura metálica',
  },
  {
    id: 'obra-centro-apoio-logistico',
    name: 'Centro de apoio logístico',
    city: 'Maracanaú, CE',
    stage: 'Fundações',
  },
];

const clientProjectsBase = [
  {
    id: 'proj-estrutura-principal',
    workId: 'obra-metalica-440',
    name: 'Estrutura principal',
    location: 'Fortaleza, CE',
    type: 'Galpão industrial',
    stage: 'Em fabricação',
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
    stage: 'Planejamento executivo',
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
    stage: 'Orçamento homologado',
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
    {
      name: 'memorial-descritivo-v3.pdf',
      category: 'Engenharia',
      uploadedAt: '29/03/2026',
      href: '#',
      actionLabel: 'Visualizar',
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
      stage: 'Estrutura metálica',
    },
    {
      client: 'Atlas Real Estate',
      name: 'Campus Norte',
      city: 'Recife, PE',
      stage: 'Fechamento de cobertura',
    },
    {
      client: 'Nova Linha Logística',
      name: 'Hub Oeste',
      city: 'Caucaia, CE',
      stage: 'Planejamento executivo',
    },
  ],
  projects: [
    {
      client: 'Grupo Horizonte Participações',
      name: 'Estrutura principal',
      location: 'Fortaleza, CE',
      type: 'Galpão industrial',
      stage: 'Em fabricação',
      quantity: '120 peças',
      unitValue: 'R$ 12.400,00',
      totalValue: 'R$ 1.488.000,00',
    },
    {
      client: 'Atlas Real Estate',
      name: 'Cobertura norte',
      location: 'Recife, PE',
      type: 'Cobertura metálica',
      stage: 'Montagem',
      quantity: '64 módulos',
      unitValue: 'R$ 9.800,00',
      totalValue: 'R$ 627.200,00',
    },
    {
      client: 'Nova Linha Logística',
      name: 'Passarela técnica',
      location: 'Caucaia, CE',
      type: 'Estrutura complementar',
      stage: 'Aprovação final',
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

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getClientPortalData() {
  return clone(clientPortalData);
}

export function getAdminPortalData() {
  return clone(adminPortalData);
}


