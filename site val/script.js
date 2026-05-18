const horarios = [];
for (let h = 8; h < 20; h++) {
  horarios.push(`${String(h).padStart(2, '0')}:00`);
}

const servicos = {
  'Massagem Relaxante': 130,
  'Massagem Modeladora': 160,
  'Drenagem Linfática': 150,
  'Depilação Completa': 180,
  'Depilação Parcial': 90,
};

const horarioEl = document.getElementById('horario');
const form = document.getElementById('agendamentoForm');
const lista = document.getElementById('listaAgendamentos');
const tabelaPrecos = document.getElementById('tabelaPrecos');
const qtdSessoes = document.getElementById('qtdSessoes');
const qtdExibicao = document.getElementById('qtdExibicao');
const servicoCombo = document.getElementById('servicoCombo');
const descontoAplicado = document.getElementById('descontoAplicado');
const valorCombo = document.getElementById('valorCombo');

function moeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function descontoProgressivo(qtd) {
  return Math.min((qtd - 1) * 0.03, 0.27);
}

function atualizarCombo() {
  const qtd = Number(qtdSessoes.value);
  const nomeServico = servicoCombo.value;
  const valorBase = servicos[nomeServico];
  const desconto = descontoProgressivo(qtd);
  const total = qtd * valorBase * (1 - desconto);

  qtdExibicao.textContent = `${qtd} ${qtd === 1 ? 'sessão' : 'sessões'}`;
  descontoAplicado.textContent = `${Math.round(desconto * 100)}%`;
  valorCombo.textContent = moeda(total);
}

function renderPrecos() {
  tabelaPrecos.innerHTML = '';
  servicoCombo.innerHTML = '';

  Object.entries(servicos).forEach(([nome, valor]) => {
    const row = document.createElement('div');
    row.className = 'price-row';

    const label = document.createElement('span');
    label.textContent = nome;

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '0';
    input.step = '5';
    input.value = valor;
    input.addEventListener('input', () => {
      servicos[nome] = Number(input.value) || 0;
      atualizarCombo();
    });

    row.append(label, input);
    tabelaPrecos.appendChild(row);

    const opt = document.createElement('option');
    opt.value = nome;
    opt.textContent = nome;
    servicoCombo.appendChild(opt);
  });

  atualizarCombo();
}

horarios.forEach((h) => {
  const opt = document.createElement('option');
  opt.value = h;
  opt.textContent = `${h} - ${h} + 50 min`;
  horarioEl.appendChild(opt);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const data = document.getElementById('data').value;
  const horario = document.getElementById('horario').value;
  const servico = document.getElementById('servico').value;

  const item = document.createElement('li');
  item.textContent = `${nome} | ${data} às ${horario} | ${servico} (50 min)`;
  lista.appendChild(item);
  form.reset();
});

qtdSessoes.addEventListener('input', atualizarCombo);
servicoCombo.addEventListener('change', atualizarCombo);
document.getElementById('ano').textContent = new Date().getFullYear();

renderPrecos();