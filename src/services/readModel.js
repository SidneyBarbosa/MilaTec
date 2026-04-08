const platformMeta = {
  source: 'Airtable',
  apiLayer: 'MilaTec Read API',
  mode: 'Somente leitura',
  syncedAt: '01/04/2026 17:40',
  flow: [
    'Airtable continua como a unica fonte de verdade para clientes, projetos, documentos e marcos.',
    'A API MilaTec organiza os dados, aplica mascaramento e entrega apenas o payload liberado por perfil.',
    'O frontend apenas consulta e renderiza a leitura autorizada para cliente ou administrador.',
  ],
};

const clientReadModel = {
  intro: {
    eyebrow: 'Portal do cliente',
    title: 'Acompanhamento do projeto em tempo real',
    description:
      'O cliente consulta apenas a versao homologada dos dados. Toda consolidacao acontece no Airtable e a API publica somente os campos necessarios para leitura.',
  },
  summaryCards: [
    {
      label: 'Projeto monitorado',
      value: 'Metalica 440',
      detail: 'Escopo liberado pela API para este perfil',
      accent: '#0B1F4D',
    },
    {
      label: 'Fase atual',
      value: 'Execucao estrutural',
      detail: 'Etapa 3 de 5 registrada no Airtable',
      accent: '#1E3A8A',
    },
    {
      label: 'Proxima entrega',
      value: 'Estrutura metalica',
      detail: 'Publicada para 12/04/2026',
      accent: '#00A86B',
    },
    {
      label: 'Documentos liberados',
      value: '18 arquivos',
      detail: '4 atualizados no ultimo sync',
      accent: '#2ED3A0',
    },
  ],
  progressSteps: [
    { key: 'briefing', label: 'Briefing validado', status: 'done' },
    { key: 'orcamento', label: 'Orcamento homologado', status: 'done' },
    { key: 'execucao', label: 'Execucao estrutural', status: 'current' },
    { key: 'instalacoes', label: 'Instalacoes finais', status: 'todo' },
    { key: 'entrega', label: 'Entrega assistida', status: 'todo' },
  ],
  updates: [
    {
      title: 'Cronograma executivo publicado pela API',
      date: '01/04 17:40',
      type: 'document',
      detail: 'Versao cliente sanitizada do Airtable.',
    },
    {
      title: 'Marco Fundacoes finalizado',
      date: '31/03 18:05',
      type: 'milestone',
      detail: 'Conclusao homologada pela equipe MilaTec.',
    },
    {
      title: 'Entrega Estrutura metalica confirmada',
      date: '30/03 09:20',
      type: 'delivery',
      detail: 'Janela atualizada no calendario publico do cliente.',
    },
  ],
  overviewMessage:
    'Seu painel exibe apenas informacoes aprovadas para consulta. Custos internos, comentarios operacionais e identificadores de base continuam protegidos na camada Airtable + API.',
  readOnlyNotices: [
    {
      title: 'Sem escrita operacional no frontend',
      description: 'Pedidos de alteracao seguem fora do painel. Aqui o cliente apenas consulta o status homologado.',
    },
    {
      title: 'Payload reduzido ao necessario',
      description: 'A API remove colunas internas, observacoes sensiveis e referencias tecnicas que nao pertencem a visao do cliente.',
    },
    {
      title: 'Escopo limitado por perfil',
      description: 'Cada rota valida o perfil e mostra somente o projeto vinculado ao usuario autenticado.',
    },
  ],
  budgets: [
    {
      name: 'Pacote estrutural v1.3',
      reference: 'Fechado em 28/03/2026',
      value: 'R$ 8.400.000',
      statusLabel: 'Homologado',
      statusTone: 'success',
      scope: 'Valor consolidado sem memoria de calculo interna',
    },
    {
      name: 'Instalacoes complementares v1.1',
      reference: 'Revisado em 22/03/2026',
      value: 'R$ 1.280.000',
      statusLabel: 'Em analise',
      statusTone: 'warning',
      scope: 'Somente status e faixa financeira liberados',
    },
    {
      name: 'Fase de fundacoes baseline',
      reference: 'Congelado em 10/03/2026',
      value: 'R$ 2.150.000',
      statusLabel: 'Publicado',
      statusTone: 'info',
      scope: 'Baseline aprovada pela operacao MilaTec',
    },
  ],
  projectStream: [
    {
      stage: 'Planejamento executivo',
      owner: 'MilaTec + cliente',
      statusLabel: 'Concluido',
      statusTone: 'success',
      highlight: 'Escopo travado e publicado no feed do cliente.',
    },
    {
      stage: 'Execucao estrutural',
      owner: 'Operacao MilaTec',
      statusLabel: 'Em curso',
      statusTone: 'info',
      highlight: 'Avanco dentro da janela prevista para abril.',
    },
    {
      stage: 'Instalacoes finais',
      owner: 'Operacao MilaTec',
      statusLabel: 'Preparacao',
      statusTone: 'warning',
      highlight: 'Dependente da liberacao total da estrutura metalica.',
    },
  ],
  deliveries: [
    {
      title: 'Estrutura metalica - bloco A',
      window: '12/04/2026',
      statusLabel: 'Confirmada',
      statusTone: 'success',
      channel: 'Portal do cliente',
      dependency: 'Fundacoes encerradas e checklist aprovado',
    },
    {
      title: 'Atualizacao do diario fotografico',
      window: '15/04/2026',
      statusLabel: 'Programada',
      statusTone: 'info',
      channel: 'Documentos',
      dependency: 'Upload consolidado pela equipe de campo',
    },
    {
      title: 'Pacote de instalacoes finais',
      window: '23/04/2026',
      statusLabel: 'Aguardando',
      statusTone: 'warning',
      channel: 'Entregas',
      dependency: 'Liberacao da etapa estrutural no Airtable',
    },
  ],
  documents: [
    {
      name: 'Cronograma executivo',
      category: 'Planejamento',
      availability: 'Publicado',
      statusTone: 'success',
      visibility: 'Cliente + admin',
      syncedAt: '01/04 17:40',
    },
    {
      name: 'Memorial descritivo',
      category: 'Engenharia',
      availability: 'Publicado',
      statusTone: 'success',
      visibility: 'Cliente + admin',
      syncedAt: '31/03 18:02',
    },
    {
      name: 'Relatorio fotografico',
      category: 'Obra',
      availability: 'Em processamento',
      statusTone: 'warning',
      visibility: 'Cliente + admin',
      syncedAt: '31/03 12:18',
    },
    {
      name: 'Checklist interno de aprovacao',
      category: 'Governanca',
      availability: 'Retido',
      statusTone: 'critical',
      visibility: 'Admin only',
      syncedAt: '01/04 16:55',
    },
  ],
  accessRules: [
    'O cliente nao ve identificadores internos do Airtable, tokens, comentarios de equipe ou anexos restritos.',
    'A API publica somente colunas homologadas para a jornada do cliente.',
    'Todo conteudo exibido nesta area e bloqueado para escrita e depende da autenticacao por perfil.',
  ],
};

const adminReadModel = {
  intro: {
    eyebrow: 'Area administrativa',
    title: 'Visao operacional da leitura MilaTec',
    description:
      'A administracao acompanha o funil Airtable -> API -> portal sem editar dados no frontend. O objetivo e monitorar publicacao, acesso e qualidade do payload exposto.',
  },
  summaryCards: [
    {
      label: 'Clientes monitorados',
      value: '12',
      detail: 'Escopos em leitura ativa',
      accent: '#0B1F4D',
    },
    {
      label: 'Saude do sync',
      value: '99,2%',
      detail: 'Ultimo ciclo sem divergencia critica',
      accent: '#00A86B',
    },
    {
      label: 'Filas operacionais',
      value: '07',
      detail: 'Eventos aguardando nova leitura',
      accent: '#2ED3A0',
    },
    {
      label: 'Perfis revisados',
      value: '100%',
      detail: 'Matriz de acesso auditada em abril',
      accent: '#1E3A8A',
    },
  ],
  alerts: [
    {
      title: 'Projeto Atlas com atraso de 1 dia no feed de entregas',
      detail: 'A API aguarda liberacao do campo deliverable_status no Airtable para republicar a timeline.',
      severity: 'attention',
    },
    {
      title: 'Dois documentos restritos barrados antes da camada cliente',
      detail: 'Politica de mascaramento preservou anexos de contrato fora da area publica.',
      severity: 'safe',
    },
  ],
  clientSnapshots: [
    {
      client: 'Grupo Horizonte',
      project: 'Metalica 440',
      lastSync: '17:40',
      contact: 'fm***@grupohorizonte.com',
      exposure: 'Financeiro consolidado + cronograma',
      access: 'Cliente + Admin Ops',
    },
    {
      client: 'Atlas Real Estate',
      project: 'Campus Norte',
      lastSync: '16:58',
      contact: 'pm***@atlas.com',
      exposure: 'Entregas + documentos publicados',
      access: 'Cliente + Admin Ops',
    },
    {
      client: 'Nova Linha',
      project: 'Centro logistico',
      lastSync: '16:42',
      contact: 'ob***@novalinha.com',
      exposure: 'Projeto + documentos selecionados',
      access: 'Cliente + Diretoria',
    },
  ],
  operationalQueues: [
    {
      label: 'Leituras Airtable',
      value: '184 req/h',
      detail: 'Consumo dentro do budget da integracao',
      tone: 'success',
    },
    {
      label: 'Payloads publicados',
      value: '62',
      detail: 'Respostas entregues com sanitizacao aplicada',
      tone: 'info',
    },
    {
      label: 'Alertas de schema',
      value: '03',
      detail: 'Campos novos aguardando mapeamento na API',
      tone: 'warning',
    },
    {
      label: 'Falhas bloqueadas',
      value: '00',
      detail: 'Nenhuma exposicao sensivel detectada hoje',
      tone: 'success',
    },
  ],
  syncTimeline: [
    {
      time: '17:32',
      title: 'View Airtable consolidada',
      description: 'Campos internos permaneceram fora da view de publicacao.',
    },
    {
      time: '17:35',
      title: 'API recalculou payloads por perfil',
      description: 'Cliente recebeu somente cards, timelines e documentos liberados.',
    },
    {
      time: '17:40',
      title: 'Portal atualizado',
      description: 'Rotas cliente e admin renderizaram o snapshot organizado sem escrita.',
    },
  ],
  documentHealth: [
    {
      name: 'Contrato master',
      visibility: 'Admin only',
      statusLabel: 'Restrito',
      statusTone: 'critical',
      policy: 'Nao exposto ao cliente por conter clausulas internas',
    },
    {
      name: 'Cronograma executivo',
      visibility: 'Cliente + admin',
      statusLabel: 'Publicado',
      statusTone: 'success',
      policy: 'Versao sanitizada liberada pela API',
    },
    {
      name: 'Relatorio de obra',
      visibility: 'Cliente + admin',
      statusLabel: 'Sincronizando',
      statusTone: 'warning',
      policy: 'Aguardando anexos finais do Airtable',
    },
  ],
  accessMatrix: [
    {
      profile: 'Cliente',
      routes: 'Painel, Orcamentos, Projeto, Entregas, Documentos',
      data: 'Projeto vinculado e documentos homologados',
      restrictions: 'Sem escrita, sem IDs internos e sem anexos restritos',
    },
    {
      profile: 'Admin Ops',
      routes: 'Dashboard admin, clientes, operacao, documentos, acessos',
      data: 'Visao consolidada por cliente e por fila',
      restrictions: 'Leitura sem alterar Airtable ou API pelo frontend',
    },
    {
      profile: 'Diretoria',
      routes: 'Mesma base admin com foco executivo',
      data: 'Indicadores macro e publicacao',
      restrictions: 'Sem comentarios tecnicos detalhados quando nao homologados',
    },
  ],
  securityRules: [
    'Airtable permanece como fonte unica da verdade; nada e persistido no frontend.',
    'A API remove comentarios internos, IDs de base, tokens e anexos sensiveis antes da resposta.',
    'Cada rota exige perfil compativel e a navegacao cliente/admin permanece separada.',
    'Nenhuma tela publica formularios de escrita operacional ou administrativa.',
  ],
  overviewMessage:
    'A maturidade do produto agora depende da qualidade do read model: Airtable organiza os registros, a API filtra por perfil e o frontend apenas apresenta a leitura certa para a pessoa certa.',
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getPlatformMeta() {
  return clone(platformMeta);
}

export function getPortalReadModel(role = 'client') {
  return clone(role === 'admin' ? adminReadModel : clientReadModel);
}
