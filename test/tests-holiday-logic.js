import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
};

const BASE_URL = __ENV.API_BASE || 'http://localhost:3000';
const HEADERS = { 'Content-Type': 'application/json' };
const DATE = '11-21'; // Usar uma data limpa

// 1. Não há nenhum feriado na data - Criar novo estadual
const feriadoNovo = JSON.stringify({
  name: "Feriado Inicial",
});

// 2. Feriado estadual para outro estado (MG)
const estadualMG = JSON.stringify({
  name: "Independência Mineira",
});

// 3. Atualizar feriado estadual já existente (RJ)
const atualizarEstadualRJ = JSON.stringify({
  name: "Feriado Atualizado",
});

// 4. Feriado municipal com nome diferente do estadual (deve criar)
const municipalNomeDiferente = JSON.stringify({
  name: "Dia do Orgulho",
});

// 5. Feriado municipal com mesmo nome do estadual (deve ignorar)
const municipalMesmoNome = JSON.stringify({
  name: "Feriado Atualizado",
});

// 6. Feriado municipal sem estadual existente (em outro estado)
const municipalSemEstadual = JSON.stringify({
  name: "Feriado BH",
});

// 7. Repetir municipal igual já cadastrado (deve ignorar ou retornar 200 sem alteração)
const municipalRepetido = JSON.stringify({
  name: "Feriado BH",
});

export default function () {
  // 1. Não há nenhum feriado na data
  let res1 = http.put(`${BASE_URL}/holidays/01/${DATE}/`, feriadoNovo, { headers: HEADERS });
  check(res1, { '1. Novo feriado criado': (r) => [200, 201].includes(r.status) });

  // 2. Feriado é estadual e não há feriado estadual para o estado
  let res2 = http.put(`${BASE_URL}/holidays/02/${DATE}/`, estadualMG, { headers: HEADERS });
  check(res2, { '2. Estadual MG criado': (r) => [200, 201].includes(r.status) });

  // 3. Feriado é estadual e já existe um para o estado - atualizar
  let res3 = http.put(`${BASE_URL}/holidays/01/${DATE}/`, atualizarEstadualRJ, { headers: HEADERS });
  check(res3, { '3. Estadual RJ atualizado': (r) => [200, 201].includes(r.status) });

  // 4. Feriado municipal com nome diferente do estadual - deve ser criado
  let res4 = http.put(`${BASE_URL}/holidays/0112345/${DATE}/`, municipalNomeDiferente, { headers: HEADERS });
  check(res4, { '4. Municipal diferente do estadual criado': (r) => [200, 201].includes(r.status) });

  // 5. Feriado municipal com mesmo nome do estadual - ignorado
  let res5 = http.put(`${BASE_URL}/holidays/0112345/${DATE}/`, municipalMesmoNome, { headers: HEADERS });
  check(res5, { '5. Municipal igual ao estadual ignorado': (r) => r.status === 200 || r.body === '' });

  // 6. Feriado municipal sem estadual e sem municipal igual - criar
  let res6 = http.put(`${BASE_URL}/holidays/0212345/${DATE}/`, municipalSemEstadual, { headers: HEADERS });
  check(res6, { '6. Municipal BH criado': (r) => [200, 201].includes(r.status) });

  // 7. Repetição do mesmo municipal - ignorar
  let res7 = http.put(`${BASE_URL}/holidays/0212345/${DATE}/`, municipalRepetido, { headers: HEADERS });
  check(res7, { '7. Repetido BH ignorado': (r) => r.status === 200 || r.body === '' });
}
