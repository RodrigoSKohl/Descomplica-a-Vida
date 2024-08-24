
//Declaraçao de dominio que pode utilizar a extensao
const dominio = 'descomplica.com.br';

//Funcao que envia o GET para a url da API com o Payload capturado pelo service worker background.js + token capturado nos cookies 
async function getCola(token, api) {
  const url = 'https://pegasus-pepe-legal.prd.us.descomplica.io/undergrad/questions/assertions-corrections?' + api;
  const getDiv = document.getElementById('getDiv');

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
    getDiv.innerText = '✓API';
  } catch (err) {
   getDiv.innerText = 'API NÃO COMUNICOU';
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

  const blockTemplate = document.createElement('div');
  if(Object.keys(correctPositions).length > 7){
    blockTemplate.innerText = "ACESSE UMA AULA OU UMA LISTA DE REVISÃO PARA RESGATAR AS RESPOSTAS!"
    answerDiv.appendChild(blockTemplate)
    return
  } 

  for (const [blockIndex, letters] of Object.entries(correctPositions)) {
    const blockDiv = blockTemplate.cloneNode(true);
    blockDiv.innerText = (blockIndex == 7) ? `Pensar e Responder: ${letters.join(', ')}` :`Pergunta ${blockIndex}: ${letters.join(', ')}`;
    answerDiv.appendChild(blockDiv);
  }
}


//Listener da tab ativa do chrome
document.addEventListener('DOMContentLoaded', async function() {
  chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
    const currentTab = tabs[0];

    // Verifica se a URL da guia ativa pertence ao domínio desejado
    if (currentTab && currentTab.url.includes(dominio)) {
      const apiDiv = document.getElementById('apiDiv');
      const tokenDiv = document.getElementById('tokenDiv');

      try {
        // Captura token que está salvo no cookie de nome 'd'
        const cookie = await chrome.cookies.get({ url: currentTab.url, name: 'd' });

        if (!cookie) {
          // Se o cookie não for encontrado, lança uma exceção
          throw new Error('TOKEN NÃO ENCONTRADO');
        }

        tokenDiv.innerText = '✓TOKEN';
        // Agora que temos o token, podemos prosseguir com a lógica relacionada à API
        chrome.runtime.sendMessage('getLastRequestPart', async function(response) {
          if (response && response.urlPart) {
            apiDiv.innerText = '✓PAYLOAD';
            await getCola(cookie.value, response.urlPart);
          } else {
            apiDiv.innerText = 'PAYLOAD NÃO ENCONTRADO';
            setTimeout(function() {
              window.location.reload();
            }, 2000);
          }
        });
      } catch (err) {
        tokenDiv.innerText = err;
      }
    } else {
      const apiDiv = document.getElementById('apiDiv');
      apiDiv.innerText = 'DOMÍNIO NÃO ENCONTRADO ' + dominio;
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