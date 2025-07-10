registros = [];

const baseProdutos = {
  "20001732": "FOLHA LITOG ANTARCTICA 0,21 PRY OFF",
  "20001926": "SKOL MONOLAB PO 0,19",
  "20005437": "BRAHMA CHOPP PO 0,19",
  "20005465": "ANTARCTICA PO 0,19",
  "20005466": "BECKS BRASIL 0,19",
  "20005467": "BECKS BRASIL 0,19",
  "20005468": "BC CHOPP QR CODE PO 0,19",
  "20005485": "STELLA ARTOIS 0,19 TO",
  "20005486": "STELLA ARTOIS 0,19 PO",
  "20005490": "BUDWEISER CDL 0,19",
  "20005499": "BRAHMA DUPLO MALTE PO 0,19",
  "20005500": "CORONA BRASIL PO 0,19",
  "20005501": "BUDWEISER CDL 0,19",
  "20005631": "BOHEMIA PM TO 0,19",
  "20005632": "BOHEMIA PM PO 0,19",
  "20005633": "BRAHMA TO 0,19",
  "20005644": "BRAHMA 340 PY PO 0,19",
  "20005645": "BRAHMA ZERO PO 0,19",
  "20005646": "COLORADO PO 0,19",
  "20005647": "GA 1L RET PO 0,19",
  "20005648": "HUARI BOL PO 0,19",
  "20005649": "NORTENA URUGUAY PO 0,19",
  "20005650": "PATAGONIA PO 0,19",
  "20005651": "STELLA ARTOIS CHILLE TO 0,19",
  "20005652": "WALS TO 0,19"
};

document.getElementById('data').valueAsDate = new Date();

const datalist = document.getElementById('locais');
for (let i = 1; i <= 70; i++) {
  datalist.appendChild(new Option(`PA ${i}`));
}
datalist.appendChild(new Option("A033 (Molho)"));

function definirHorario() {
  const turno = document.getElementById('turno').value;
  let horario = "";
  if (turno === "A") horario = "06:00 às 15:00";
  if (turno === "B") horario = "14:00 às 23:00";
  if (turno === "C") horario = "23:00 às 06:00";
  document.getElementById('horario').value = horario;
}

function preencherProduto() {
  const codigo = document.getElementById('codigo').value.trim();
  document.getElementById('produto').value = baseProdutos[codigo] || "Produto não encontrado";
}

function exibirCamposFracao() {
  const temFracao = document.getElementById('temFracao').value;
  document.getElementById('camposFracao').style.display = (temFracao === 'Sim') ? 'block' : 'none';
}

function validarNumero(input) {
  input.value = input.value.replace(/\D/g, '');
}

function marcarErro(id) {
  document.getElementById(id).classList.add("error");
}

function limparErros() {
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function salvarDados() {
  limparErros();
  const campos = ['data', 'turno', 'horario', 'linha', 'codigo', 'produto', 'lote', 'paletes', 'temFracao', 'local'];
  let valido = true;

  campos.forEach(id => {
    const el = document.getElementById(id);
    if (!el.value) {
      marcarErro(id);
      valido = false;
    }
  });

  const temFracao = document.getElementById('temFracao').value;
  const caixas = document.getElementById('caixas').value;
  const fracaoRaw = document.getElementById('fracao').value;

  if (temFracao === 'Sim') {
    if (!caixas) { marcarErro('caixas'); valido = false; }
    if (!fracaoRaw) { marcarErro('fracao'); valido = false; }
  }

  if (!valido) {
    alert("Atenção! Preencha todos os campos obrigatórios.");
    return;
  }

  const dataISO = document.getElementById('data').value;
  const dataObj = new Date(dataISO);
  const dataFormatada = `${String(dataObj.getDate()).padStart(2, '0')}/${String(dataObj.getMonth() + 1).padStart(2, '0')}/${dataObj.getFullYear()}`;

  const fracaoSoma = temFracao === 'Sim'
    ? fracaoRaw.split(',').reduce((soma, item) => soma + parseFloat(item.trim() || 0), 0)
    : '';

  const dados = {
    Data: dataFormatada,
    Turno: document.getElementById('turno').value,
    Horário: document.getElementById('horario').value,
    Linha: document.getElementById('linha').value,
    Código: document.getElementById('codigo').value,
    Produto: document.getElementById('produto').value,
    Lote: document.getElementById('lote').value,
    Paletes: document.getElementById('paletes').value,
    'Há Fração': temFracao,
    Caixas: temFracao === 'Sim' ? caixas : '',
    Fração: fracaoSoma,
    Local: document.getElementById('local').value
  };

  registros.push(dados);
  document.getElementById("mensagem").textContent("Registro salvo com sucesso!")
  //alert("Registro salvo com sucesso!");

  document.querySelectorAll('input, select').forEach(el => el.value = '');
  document.getElementById('camposFracao').style.display = 'none';
  document.getElementById('data').valueAsDate = new Date();
}

function gerarPlanilha() {
  fetch("http://localhost:3000/api/finalizar", {
    method: "POST"
  })
  .then(res => res.json())
  .then(data => alert(data.mensagem || "Planilha gerada com sucesso"))
  .catch(err => alert("Erro ao gerar planilha: " + err));
}


function enviarParaServidor() {
  salvarDados(); // salva localmente
  const ultimoRegistro = registros[registros.length - 1];

  fetch("http://localhost:3000/api/salvar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(ultimoRegistro)
  })
  .then(res => res.json())
  .then(data => alert(data.mensagem || "Salvo no servidor com sucesso"))
  .catch(err => alert("Erro ao enviar para servidor: " + err));
}
