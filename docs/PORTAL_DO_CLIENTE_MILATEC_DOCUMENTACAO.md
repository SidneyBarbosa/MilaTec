# Portal do Cliente MilaTec

## 1. Visão Geral Do Sistema

### Nome do sistema
**Portal do Cliente MilaTec**

### Objetivo do sistema
O Portal do Cliente MilaTec foi desenvolvido para disponibilizar, de forma organizada e profissional, as informações que a empresa deseja compartilhar com seus clientes sobre obras, projetos, entregas e anexos. O sistema centraliza a consulta desses dados em uma interface web simples, clara e focada em leitura.

### Problema que ele resolve
Antes de um portal estruturado, informações de andamento costumam ficar dispersas entre mensagens, planilhas, e-mails, arquivos soltos e contatos diretos com a equipe. Isso dificulta o acompanhamento do cliente, gera retrabalho e reduz a clareza da comunicação.

O sistema resolve esse problema ao:

- concentrar as informações em um único ambiente;
- organizar os dados por módulos;
- apresentar somente o que é relevante ao cliente;
- reduzir ruído visual e excesso de informação técnica;
- reforçar uma comunicação mais profissional entre empresa e cliente.

### Público-alvo
O público-alvo principal do sistema são os **clientes da MilaTec**, que precisam acompanhar informações vinculadas à sua empresa de forma segura, simples e objetiva.

## 2. Descrição Funcional

### Empresa
O módulo **Empresa** apresenta os dados institucionais vinculados ao cliente autenticado.

Funcionalidades principais:

- exibição do nome da empresa;
- apresentação da cidade e estado;
- identificação do contato principal;
- exibição do e-mail e telefone associados ao cadastro.

Esse módulo funciona como ponto inicial de contexto, permitindo que o cliente confirme rapidamente que está visualizando a conta correta.

### Obras
O módulo **Obras** apresenta a listagem das obras vinculadas ao cliente.

Funcionalidades principais:

- listagem das obras disponíveis para a conta autenticada;
- exibição do nome da obra;
- exibição da cidade da obra;
- visualização da etapa atual de cada obra.

Esse módulo permite um acompanhamento objetivo do status macro de execução de cada obra.

### Projetos
O módulo **Projetos** detalha os projetos relacionados às obras do cliente.

Funcionalidades principais:

- listagem de projetos;
- relação direta entre projeto e obra vinculada;
- exibição do local do projeto;
- exibição do tipo do projeto;
- apresentação da etapa atual;
- exibição de quantidades;
- exibição de valor unitário;
- exibição de valor total.

Esse módulo amplia a visão operacional do cliente, permitindo entender como cada projeto se conecta à obra correspondente e quais dados comerciais e técnicos estão disponíveis para consulta.

### Entregas
O módulo **Entregas** concentra o cronograma de entregas e seus status.

Funcionalidades principais:

- listagem de entregas vinculadas a projetos e obras;
- exibição da data prevista;
- exibição de quantidade;
- status de acompanhamento, como:
  - programada;
  - confirmada;
  - em separação.

Esse módulo ajuda o cliente a acompanhar a evolução logística e operacional das entregas previstas no portal.

### Anexos
O módulo **Anexos** disponibiliza os arquivos liberados para consulta pelo cliente.

Funcionalidades principais:

- listagem dos arquivos publicados;
- categorização dos anexos;
- indicação do tipo de material disponibilizado;
- ações para visualização e download.

Exemplos de arquivos:

- PDF;
- planilhas Excel;
- documentos técnicos;
- cronogramas;
- materiais complementares.

Esse módulo fortalece a autonomia do cliente ao oferecer acesso rápido aos materiais já homologados para compartilhamento.

## 3. Fluxo Do Sistema

O uso do sistema segue um fluxo simples e objetivo:

### 1. Login
O usuário acessa a tela inicial e informa o e-mail autorizado, além de selecionar o perfil de acesso correspondente.

### 2. Validação de código
Após a etapa inicial, o sistema apresenta a tela de confirmação de código. Essa etapa representa a validação de acesso antes da entrada no portal.

### 3. Acesso ao portal
Depois da validação, o usuário é direcionado ao ambiente correspondente ao seu perfil. No caso do cliente, o acesso padrão é iniciado pela página **Empresa**.

### 4. Navegação pelas páginas
Dentro do portal, a navegação ocorre pela sidebar lateral, que organiza os módulos de forma clara:

- Empresa
- Obras
- Projetos
- Entregas
- Anexos

### 5. Consulta dos dados
O usuário navega entre os módulos e consulta as informações disponibilizadas em formato de tabelas, cartões e blocos resumidos, sempre com foco em leitura.

## 4. Arquitetura Do Sistema

### Frontend
O sistema foi construído como uma interface web do tipo SPA (Single Page Application), com navegação entre rotas e renderização de componentes visuais reutilizáveis.

### Integração com Airtable via API
A arquitetura do projeto foi pensada para operar com uma camada de dados externa, tendo o **Airtable** como fonte de informação e uma **API intermediária** como responsável por entregar os dados tratados ao frontend.

No estágio atual do desenvolvimento:

- a estrutura já foi organizada para representar esse fluxo;
- o frontend está preparado para consumir dados externos;
- os dados em uso ainda estão simulados localmente para fins de prototipação e validação visual.

Ou seja, a integração completa com Airtable via API faz parte da arquitetura prevista, mas a implementação atual ainda utiliza dados mockados para representar o comportamento do sistema.

### Sistema somente leitura
O portal foi projetado como um sistema **somente leitura**. O cliente consulta informações, mas não edita registros, não altera etapas e não modifica dados operacionais.

### Estrutura baseada em dados externos
Toda a organização do sistema foi desenhada para funcionar a partir de dados externos estruturados, com separação entre:

- camada visual;
- navegação;
- regras de acesso;
- dados exibidos ao usuário.

Isso facilita futuras integrações reais com serviços externos e melhora a manutenção do sistema.

## 5. Tecnologias Utilizadas

As principais tecnologias utilizadas no desenvolvimento até o momento são:

- **HTML**
- **CSS**
- **JavaScript**
- **Vue 3**
- **Vue Router**
- **Vite**
- **Google Fonts**
  - fonte principal: **Poppins**
- **Google Material Icons**
- estrutura preparada para integração com **API**
- arquitetura direcionada para consumo de dados do **Airtable**

## 6. Decisões De Design E UX

O projeto foi orientado por decisões de interface focadas em clareza, profissionalismo e facilidade de uso.

### Interface limpa e profissional
Foram removidos elementos redundantes e textos técnicos desnecessários para que a experiência fosse mais objetiva.

### Sidebar de navegação
A navegação lateral organiza os módulos principais do sistema e melhora a previsibilidade da interface.

### Uso de tabelas para dados
As informações operacionais foram apresentadas principalmente em tabelas, pois esse formato favorece leitura, comparação e organização.

### Hierarquia visual simplificada
O sistema passou por refinamentos para manter apenas:

- um label discreto no topo;
- um único título principal por página;
- conteúdos relevantes como foco da área central.

### Foco em leitura e clareza
Como o portal não é um sistema de edição, toda a experiência foi estruturada para consulta rápida, leitura limpa e entendimento imediato das informações.

### Identidade visual consistente
Foram padronizados:

- logo;
- cabeçalhos;
- navegação lateral;
- espaçamento;
- ícones;
- tratamento visual entre telas de autenticação e sistema interno.

## 7. Melhorias Implementadas Até Agora

Ao longo do desenvolvimento, já foram aplicadas diversas melhorias funcionais e visuais:

### Melhorias estruturais

- organização do sistema em módulos funcionais;
- separação entre área do cliente e área administrativa;
- estruturação de rotas por perfil;
- criação de fluxo de login e validação de acesso;
- definição de navegação lateral consistente.

### Melhorias nos dados e relacionamento

- relacionamento entre obras, projetos e entregas;
- vínculo entre projetos e obras;
- vínculo entre entregas, projetos e obras;
- organização dos anexos por categoria e ação.

### Melhorias de interface e UX

- remoção de menções técnicas desnecessárias na interface;
- padronização dos cabeçalhos;
- remoção de títulos duplicados;
- simplificação da hierarquia visual;
- limpeza de blocos redundantes;
- ajuste de tipografia e proporção dos títulos;
- correção da visibilidade da logo nas telas de autenticação;
- padronização da identidade visual entre login, validação e portal;
- reformulação da página de acessos para um conteúdo mais operacional;
- adição de **Material Icons** na sidebar;
- melhoria de alinhamento, espaçamento e legibilidade dos elementos.

### Melhorias visuais gerais

- interface mais moderna;
- maior consistência entre páginas;
- melhor contraste visual;
- redução de poluição visual;
- foco em profissionalismo e clareza.

## 8. Limitações Atuais

Apesar da evolução já realizada, o sistema ainda possui limitações importantes:

- o portal é apenas de leitura;
- os dados ainda estão mockados no frontend para simulação;
- a integração real com Airtable via API ainda não está concluída;
- a autenticação atual é simplificada para fins de prototipação;
- ainda não existe controle avançado de permissões com backend real;
- não há histórico de auditoria persistente;
- downloads e arquivos ainda estão representados de forma simulada.

## 9. Possíveis Melhorias Futuras

Como próximos passos, o sistema pode evoluir com funcionalidades de maior valor operacional:

- dashboard inicial com indicadores consolidados;
- filtros e buscas por obra, projeto, entrega e anexo;
- notificações de novas publicações;
- autenticação real com backend e validação robusta;
- controle de acesso mais avançado por perfil e empresa;
- histórico de alterações e auditoria;
- integração real com Airtable via API;
- upload e gerenciamento real de anexos;
- exportação de relatórios;
- visualização mais analítica de cronogramas e status.

## 10. Conclusão

O Portal do Cliente MilaTec representa uma solução organizada e profissional para apresentação de informações relevantes ao cliente. O sistema centraliza dados antes dispersos, melhora a comunicação entre empresa e cliente e oferece uma experiência visual mais clara, objetiva e confiável.

Os principais ganhos do projeto até o momento são:

- maior organização das informações;
- melhor legibilidade dos dados;
- estrutura modular clara;
- navegação simples e intuitiva;
- interface mais profissional;
- base técnica pronta para evoluir com integrações reais.

Mesmo ainda em fase de desenvolvimento, o sistema já demonstra valor prático, pois organiza a jornada de consulta do cliente e estabelece uma base sólida para crescimento futuro, tanto em contexto acadêmico quanto empresarial.

---

## Observação Sobre O Estágio Atual

Para fins de documentação honesta e tecnicamente correta, é importante registrar que:

- a interface e a navegação do sistema já estão implementadas;
- o modelo funcional do portal já está estruturado;
- os dados atuais ainda são simulados localmente;
- a integração externa completa representa a próxima etapa natural de maturação do projeto.

Essa observação fortalece a credibilidade da documentação e deixa claro o que já foi construído e o que ainda será evoluído.
