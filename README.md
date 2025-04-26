
# API de Feriados Brasileiros

Gerencie feriados estaduais e municipais com suporte a datas fixas e móveis.<br>
Solução para o [problema da instruct](https://github.com/instruct-br/teste-backend-remoto-2020-07).

---

## Endpoints

### Criar ou Atualizar um Feriado

**PUT** `/feriados/:code/:date`

**Descrição:** Cria ou atualiza um feriado estadual ou municipal.

**Parâmetros de URL:**

- `code` (string): Código IBGE (2 ou 7 dígitos). Exemplo: `3118601`
- `date` (string): Data no formato `YYYY-MM-DD`, `MM-DD`, `carnaval` ou `corpus-christi`. Exemplo: `11-20`

**Body (opcional caso 'date' corresponda a um feriado móvel):**

```json
{
  "name": "Dia da Consciência Negra"
}
```

**Respostas:**

- `200 OK` – Feriado criado/atualizado
- `400 Bad Request` – Erro ao processar data ou nome
- `404 Not Found` – Código de estado ou município não encontrado

---

### Listar Todos os Feriados

**GET** `/feriados`

**Descrição:** Retorna todos os feriados cadastrados.

**Resposta:**

- `200 OK` – Lista de feriados

---

### Buscar um Feriado Específico

**GET** `/feriados/:code/:date`

**Descrição:** Busca um feriado específico de um estado ou município.

**Parâmetros de URL:**

- `code` (string): Código IBGE (2 ou 7 dígitos). Exemplo: `31` ou `3118601`
- `date` (string): Data no formato `YYYY-MM-DD` ou `MM-DD`. Exemplo: `11-20`

**Respostas:**

- `200 OK` – Feriado encontrado
- `400 Bad Request` – Erro ao processar data
- `404 Not Found` – Feriado ou código não encontrado

---

### Remover Todos os Feriados

**DELETE** `/feriados`

**Descrição:** Remove todos os feriados estaduais e municipais cadastrados.

**Respostas:**

- `204 No Content` – Feriados removidos
- `404 Not Found` – Nenhum feriado que pode ser removido encontrado

---

### Remover um Feriado Específico

**DELETE** `/feriados/:code/:date`

**Descrição:** Remove um feriado específico de um estado ou município.

**Parâmetros de URL:**

- `code` (string): Código IBGE (2 ou 7 dígitos). Exemplo: `31` ou `3118601`
- `date` (string): Data no formato `YYYY-MM-DD`, `MM-DD`, `carnaval` ou `corpus-christi`. Exemplo: `11-20`

**Respostas:**

- `204 No Content` – Feriado removido
- `400 Bad Request` – Erro ao processar data
- `404 Not Found` – Feriado ou código não encontrado

---

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/mrsandes/holidays_api.git
```

2. Acesse o diretório:

```bash
cd holidays_api
```

3. Instale as dependências:

```bash
npm install
```

---

## Execução

executa a API com SQLite por padrão
```bash
npm run start:dev
```

executa a API com o banco de dados especificado pelo .env
(para PostgreSQL é necessário ter o Docker instalado)
```bash
npm run start:dev:db
```

busque por 
```
http://localhost:3000/api
```
para acessar a documentação com swagger e realizar testes na API

---

## Funcionalidades extras

### Mais de 1 feriado por data

É possível ter **mais de um feriado** no mesmo dia:  
- 1 feriado nacional
- 1 feriado estadual
- 1 feriado municipal

Exemplo:

```json
[
  {
    "id": "h_A4L4d8cZ6ZC0mu_VjVE5q",
    "name": "Ano Novo",
    "type": "nacional",
    "date": "0000-01-01",
    "state": "",
    "city": ""
  },
  {
    "id": "h_Jx0V82Vh_wg3SbwjkLNGF",
    "name": "Aniversário de Minas Gerais",
    "type": "estadual",
    "date": "0000-01-01",
    "state": "31",
    "city": ""
  },
  {
    "id": "h_Tbm_7wevURxskeCGRpI1d",
    "name": "Aniversário de Contagem",
    "type": "municipal",
    "date": "0000-01-01",
    "state": "31",
    "city": "3118601"
  }
]
```

---

### Como remover o feriado correto?

Quando existirem 2 ou mais feriados no mesmo dia, o feriado removido **depende do código enviado**:

- Se o código for de **estado**, remove o feriado **estadual**:

```bash
curl -X 'DELETE'
  'http://localhost:3000/feriados/31/01-01'
  -H 'accept: */*'
```

- Se o código for de **município**, remove o feriado **municipal**:

```bash
curl -X 'DELETE'
  'http://localhost:3000/feriados/3118601/01-01'
  -H 'accept: */*'
```

> Em nenhum caso é possível remover um feriado nacional.

---

### Como o endpoint GET funciona nesse caso?

A API **busca todos os feriados** (nacional, estadual e municipal) e os **retorna em lista**:

- Buscar pelos feriados do **estado**:

```bash
curl -X 'GET'
  'http://localhost:3000/feriados/31/01-01'
  -H 'accept: application/json'
```

Resposta:

```json
[
  {
    "name": "Ano Novo"
  },
  {
    "name": "Aniversário de Minas Gerais"
  }
]
```

- Buscar pelos feriados do **município**:

```bash
curl -X 'GET'
  'http://localhost:3000/feriados/3118601/01-01'
  -H 'accept: application/json'
```

Resposta:

```json
[
  {
    "name": "Ano Novo"
  },
  {
    "name": "Aniversário de Minas Gerais"
  },
  {
    "name": "Aniversário de Contagem"
  }
]
```

---

### Feriados municipais removidos automaticamente

Ao adicionar um feriado estadual com o mesmo nome de feriados municipais para a mesma data, os feriados municipais são removidos automaticamente.

Exemplo:

```json
[
  {
    "name": "Dia da Consciência Negra",
    "type": "municipal",
    "date": "0000-11-20",
    "state": 31,
    "city": 3123601
  },
  {
    "name": "Dia da Consciência Negra",
    "type": "municipal",
    "date": "0000-11-20",
    "state": 31,
    "city": 3106200
  }
]
```

Ao realizar a adição do feriado estadual:

```bash
curl -X 'PUT'
  'http://localhost:3000/feriados/31/11-20'
  -H 'accept: application/json'
  -H 'Content-Type: application/json'
  -d '{
    "name": "Dia da Consciência Negra"
  }'
```

O resultado será a remoção dos feriados municipais e a adição do feriado estadual:

```json
[
  {
    "id": "h_W2H8jPliJh4xchTwgVt0_",
    "name": "Dia da Consciência Negra",
    "type": "estadual",
    "date": "0000-11-20",
    "state": "31",
    "city": ""
  }
]
```
