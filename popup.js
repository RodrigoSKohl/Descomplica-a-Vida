
//Declaraçao de dominio que pode utilizar a extensao
const dominio = 'descomplica.com.br';

//Funcao que envia o GET para a url da API com o Payload capturado pelo service worker background.js + token capturado nos cookies 
async function getCola(token, api) {
  const url = 'https://pegasus-pepe-legal.prd.us.descomplica.io/undergrad/questions/assertions-corrections?' + api;
  const answerDiv = document.getElementById('answers');
  answerDiv.innerHTML = '';  
  const spinner = document.getElementById('spinner');
  const error = document.getElementById('error');
  spinner.style.display = 'block'; 
  error.style.display = 'none';    
  const options = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  };

  try {
    const response = await fetch(url, options);
    const jsonResponse = await response.json();
    const formatedPayload = formatPayload(api);
    const correctPositions = getCorrectPositions(jsonResponse.data, formatedPayload);
    displayAnswers(correctPositions);
    spinner.style.display = 'none';
    return correctPositions
  } catch (err) {
    error.style.display = 'block';
    spinner.style.display = 'none';
  }
}

//EXPLOIT//
//Funçao que monta os blocos das questoes e retorna em qual posição estava true, essa posição sera a resposta 0=A, 1=B, 2=C...
//O código funciona para qualquer quantidade de questões e respostas que as atividades possam ter
function getCorrectPositions(data, formattedPayload) {
  const blocks = {};

  // Cria um mapa para acesso rápido dos dados com base no ID
  const dataMap = new Map(data.map(item => [item.id, item]));

  // Ordena os dados conforme a ordem do formattedPayload
  const orderedData = formattedPayload.map(id => dataMap.get(id)).filter(item => item); // Remove itens indefinidos

  // Processa os dados ordenados para preencher os blocos
  orderedData.forEach(({ correct }, index) => {
    const blockIndex = Math.floor(index / 5) + 1;
    const letter = String.fromCharCode(65 + (index % 5));

    if (correct) {
      if (!blocks[blockIndex]) {
        blocks[blockIndex] = [];
      }
      blocks[blockIndex].push(letter);
    }
  });

  return blocks;
}

//Função que formata o payload para ser enviado na API(usado para desembaralhar as questões capturadas em data) 
function formatPayload(payload) {
  // Remove o prefixo 'assertions='
  // Remove caracteres especiais e substitui por seus respectivos valores
  let formattedPayload = payload
    .replace('assertions=', '') // Remove o prefixo 'assertions='
    .replace(/%3D%3D/g, '')  // Substitui todas as ocorrências de %3D%3D por ==
    .replace(/%7C/g, '|');     // Substitui todas as ocorrências de %7C por |

  // Divide a string em uma lista de IDs usando '|'
  const ids = formattedPayload.split('|');

  return ids;
}
//EXPLOIT//

//Mostra respostas em popup.html
function displayAnswers(correctPositions) {
  const answerDiv = document.getElementById('answers');
  answerDiv.innerHTML = '';  // Limpa o conteúdo anterior

  // Verifica se o número de elementos em correctPositions é maior que 7
  if (Object.keys(correctPositions).length > 7) {
    const messageDiv = document.createElement('div');
    messageDiv.innerText = "ACESSE UMA AULA OU UMA LISTA DE REVISÃO PARA RESGATAR AS RESPOSTAS!";
    answerDiv.appendChild(messageDiv);
    return;
  }

  // Criação da tabela
  const table = document.createElement('table');
  table.style.margin = '0 auto'; // Centraliza a tabela
  table.style.borderSpacing = '5px'

  const headerRow = document.createElement('tr');
  
  // Cabeçalhos da tabela
  const headerPergunta = document.createElement('th');
  headerPergunta.innerText = 'Pergunta';
  headerPergunta.style.borderRadius = '22px'; // Borda arredondada
  headerPergunta.style.backgroundColor = 'black'; // Cor de fundo
  headerPergunta.style.color = 'white'; // Cor do texto
  headerPergunta.style.fontWeight = 'bold'; // Negrito
  headerPergunta.style.padding = '8px'; // Espaçamento interno
  headerPergunta.style.textAlign = 'center'; // Centraliza o texto
  headerRow.appendChild(headerPergunta);

  const headerResposta = document.createElement('th');
  headerResposta.innerText = 'Resposta';
  headerResposta.style.borderRadius = '22px'
  headerResposta.style.backgroundColor = 'black';
  headerResposta.style.color = 'white';
  headerResposta.style.fontWeight = 'bold';
  headerResposta.style.padding = '8px';
  headerResposta.style.textAlign = 'center';
  headerRow.appendChild(headerResposta);

  table.appendChild(headerRow);

  // Preenche a tabela com as perguntas e respostas
  let isEvenRow = true; // Para alternar entre linhas claras e escuras
  for (const [blockIndex, letters] of Object.entries(correctPositions)) {
    const row = document.createElement('tr');

    // Alterna a cor de fundo entre linhas
    if (isEvenRow) {
      row.style.backgroundColor = '#f2f2f2'; // Linha clara
    } else {
      row.style.backgroundColor = '#ffffff'; // Linha escura
    }
    isEvenRow = !isEvenRow;

    // Pergunta
    const perguntaCell = document.createElement('td');
    perguntaCell.innerText = blockIndex == 7 ? 'P&R' : `${blockIndex}`;
    perguntaCell.style.borderRadius = '22px'; // Borda arredondada
    perguntaCell.style.padding = '8px'; // Espaçamento interno
    perguntaCell.style.textAlign = 'center'; // Centraliza o texto
    row.appendChild(perguntaCell);

    // Resposta
    const respostaCell = document.createElement('td');
    respostaCell.innerText = letters.join(', ');
    respostaCell.style.borderRadius = '22px'; // Borda arredondada
    respostaCell.style.padding = '8px'; // Espaçamento interno
    respostaCell.style.textAlign = 'center'; // Centraliza o texto
    row.appendChild(respostaCell);

    table.appendChild(row);
  }

  // Adiciona a tabela ao container de respostas
  answerDiv.appendChild(table);
}


//Listener da tab ativa do chrome
document.addEventListener('DOMContentLoaded', async function() {
  chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    const currentTab = tabs[0];
    const payloadDiv = document.getElementById('payloadDiv');
    const tokenDiv = document.getElementById('tokenDiv');
    const apiDiv = document.getElementById('apiDiv');
    // Verifica se a URL da guia ativa pertence ao domínio desejado
    if (currentTab && currentTab.url.includes(dominio)) {
      try {
        // Captura token que está salvo no cookie de nome 'd'
        const cookie = await chrome.cookies.get({ url: currentTab.url, name: 'd' });

        if (!cookie) {
          // Se o cookie não for encontrado, lança uma exceção
          throw new Error('TOKEN');
        }

        tokenDiv.innerText = 'TOKEN';
        tokenDiv.classList.add('success');
        // Agora que temos o token, podemos prosseguir com a lógica relacionada à API
        chrome.runtime.sendMessage('getLastRequestPart', async function(response) {
          if (response && response.urlPart) {
            payloadDiv.innerText = 'PAYLOAD';
            payloadDiv.classList.add('success');
            const lastPayload = localStorage.getItem('lastPayload');
            const lastAnswers = localStorage.getItem('lastAnswers');
            if (lastPayload === response.urlPart && lastAnswers !== "undefined" && lastAnswers !== null) {
              console.log("Usando cache do localStorage...");
              displayAnswers(JSON.parse(lastAnswers));
              apiDiv.innerText = 'LOCALSTORAGE';
              apiDiv.classList.add('success');
            } else {
              console.log("Novo payload, chamando API...");
              const answers = await getCola(cookie.value, response.urlPart);
              localStorage.setItem('lastPayload', response.urlPart);
              localStorage.setItem('lastAnswers', JSON.stringify(answers));
              apiDiv.innerText = 'API';
              apiDiv.classList.add('success');
            }
          } else {
            payloadDiv.innerText = 'PAYLOAD';
            payloadDiv.classList.add('error');
            setTimeout(function() {
              window.location.reload();
            }, 2000);
          }
        });
      } catch (err) {
        tokenDiv.innerText = err.message;
        tokenDiv.classList.add('error');
      }
    } else {
      const answerDiv = document.getElementById('answers');
      answerDiv.innerHTML = '';  // Limpa o conteúdo anterior
      answerDiv.innerText = 'DOMÍNIO NÃO ENCONTRADO ';
      const domainDiv = document.getElementById('domain');
      domainDiv.innerText = dominio;
      domainDiv.addEventListener('click', function() {
        chrome.tabs.create({ url: `https://aulas.${dominio}` });
      });
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const githubLink = document.getElementById('githubLink');
  const versaoElement = document.getElementById('versao');
  const manifestData = chrome.runtime.getManifest();
  const versao = manifestData.version;
  versaoElement.innerText = `v ${versao}`;

  githubLink.addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://github.com/RodrigoSKohl/Descomplica-a-Vida' });
  });
});