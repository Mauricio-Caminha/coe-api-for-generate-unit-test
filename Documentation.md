### Especificação Funcional do Sistema

Este sistema consiste em scripts desenvolvidos para executar operações envolvendo uma base de dados MySQL. O objetivo principal do sistema é realizar as seguintes funções:
1. Estabelecer conexão com o banco de dados MySQL (`client.ts`);
2. Popular a base de dados com dados de exemplo por meio de geração de dados fictícios (`seed.ts`);
3. Exportar os dados filtrados do banco de dados para um arquivo CSV (`export.ts`).

---

#### 1. Módulo de Conexão com o Banco de Dados (`client.ts`)

##### **Descrição Funcional**
O módulo `client.ts` é responsável por:
- Carregar a string de conexão com o banco de dados, presente nas variáveis de ambiente.
- Realizar o processo de conexão com o banco de dados MySQL.
- Garantir que erros sejam informados no caso de problemas na conexão.

##### **Funcionalidades**
1. **Validação da variável de ambiente:** O sistema verifica se a variável de ambiente `DB_CONNECTION_STRING` está disponível.
2. **Estabelecimento de Conexão:** Com uso da biblioteca `mysql2/promise`, cria uma conexão assíncrona com o banco de dados.
3. **Erro de conexão:** Caso haja qualquer erro na tentativa de conexão, o sistema registra o erro no console.

---

#### 2. Módulo de População de Dados no Banco de Dados (`seed.ts`)

##### **Descrição Funcional**
O módulo `seed.ts` utiliza a conexão estabelecida para criar e popular uma tabela chamada `products` no banco de dados. Dados fictícios são gerados com a biblioteca `@faker-js/faker`.

##### **Funcionalidades**
1. **Validação da Conexão com o Banco:** Verifica se a conexão com o banco foi estabelecida corretamente.
2. **Criação da Tabela:** Caso a tabela `products` não exista, ela é criada. As colunas incluem:
   - `id` (inteiro): Identificador único para o produto.
   - `name` (texto curto): Nome do produto.
   - `description` (texto longo): Descrição do produto.
   - `price_in_cents` (inteiro): Preço do produto em centavos.
   - `created_at` (timestamp): Data de criação do registro.
3. **Inserção de Dados Fictícios:** Adiciona **200.000 registros** ao banco de dados utilizando a biblioteca `faker`:
   - Gera 10.000 registros por lote.
   - Valores fictícios incluem nome, descrição e preço do produto.
4. **Finalização:** Encerra a conexão com o banco de dados após completar as operações.

---

#### 3. Módulo de Exportação de Dados para CSV (`export.ts`)

##### **Descrição Funcional**
O módulo `export.ts` realiza a exportação dos dados de produtos que atendem ao filtro de terem `price_in_cents >= 1000` para um arquivo **CSV** com o nome `export.csv`.

##### **Funcionalidades**
1. **Validação da Conexão com o Banco:** Verifica se a conexão com o banco foi estabelecida corretamente.
2. **Extração de Dados:** Realiza a extração dos dados:
   - Paginada, com um limite de 500 registros por vez.
   - Incrementa o `offset` para evitar carregamento excessivo na memória e respeitar a limitação da consulta.
3. **Transformação dos Dados:** Usa um stream do tipo `Transform` para realizar a manipulação dos dados antes da exportação.
4. **Exportação CSV:** Utiliza a biblioteca `csv-stringify` para formatar os dados e exportá-los em formato CSV. Campos incluídos:
   - `ID`: identifica o produto.
   - `Name`: nome do produto.
5. **Finalização:** Encerra a conexão com o banco e exibe uma mensagem ao final da exportação.

---

### Diagrama de Fluxo de Operações

#### Diagrama Geral do Sistema
```plaintext
+-------------------------------------------------------------+
|                      Sistema de Banco de Dados              |
+-------------------------------------------------------------+
|                                                             |
| +---------------------------+     +-----------------------+ |
| | Conexão com o Banco       |     | População de Dados    | |
| | (client.ts)               |     | (seed.ts)             | |
| |                           |     |                       | |
| | Leitura de DB_CONNECTION  |     | 1. Validação da Conexão| |
| | Criação de Conexão        |     | 2. Criação da Tabela   | |
| | Registro de Erros         |     | 3. Inserção em Lotagem | |
| | Exporta `connection` para |---->| 4. Finalização         | |
| | outros módulos.           |     |                       | |
| +---------------------------+     +-----------------------+ |
|                                                             |
| +---------------------------+                               |
| | Exportação de Dados       |                               |
| | (export.ts)               |                               |
| | 1. Validação de Conexão   |                               |
| | 2. Leitura em lote (query)|                               |
| | 3. Transformação em Stream|                               |
| | 4. Geração de Arquivo CSV |                               |
| | 5. Liberação da Conexão   |                               |
| +---------------------------+                               |
|                                                             |
+-------------------------------------------------------------+
```

#### Organização Modular (Diagrama de Componentes)
```plaintext
                          +---------------------+
                          |   config.ts         |
                          |  (Variáveis         |
                          |  de Ambiente)       |
                          +---------------------+
                                  ^   
                                  |
                          +---------------------+                              
                          |    client.ts        |<--------------+
                          |  (Conexão com o     |               |
                          |  banco de dados)    |               |
                          +---------------------+               |
                                  ^                             |
           +----------------------+                             |
           |                                                +---v-----------+
+------------------+                                       +----------------+
|     seed.ts      |      -------------------------------->|   export.ts    |
| (Criação e       |   |                                   | (Exportação    |
|   População de   |   |                                   |   para CSV)    |
|   recursos)      |   |                                   +----------------+
+------------------+
```

---

### Fluxo de Implementação e Operação

1. **Configuração Inicial:**
   - Configurar a variável de ambiente `DB_CONNECTION_STRING` com a string de conexão ao banco de dados.

2. **Execução do `client.ts`:**
   - Garantirá a conexão com o banco de dados.
   - Será importado no restante dos módulos.

3. **Execução do `seed.ts`:**
   - Criará (se necessário) e populará a tabela `products` com dados fictícios.
   - O processo de inserção ocorre em lotes de 10.000 registros.

4. **Execução do `export.ts`:**
   - Os dados da tabela `products` serão exportados para um arquivo `export.csv`.
   - As operações de leitura do banco e escrita no arquivo CSV são realizadas utilizando streams.

--- 

### Devolutivas Importantes

- Caso ocorra falhas na execução:
  - Verifique a variável de ambiente `DB_CONNECTION_STRING`.
  - Certifique-se de que o banco de dados seja acessível e que o usuário tenha permissões adequadas.
