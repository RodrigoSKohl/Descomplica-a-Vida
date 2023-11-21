let answersLoaded = false;  // Flag para indicar se as respostas foram carregadas

//Funcao que envia o GET para a url da API com o Payload capturado pelo service worker background.js + token capturado nos cookies 
async function getCola(token, api) {
  const url = 'https://pegasus-pepe-legal.prd.us.descomplica.io/undergrad/questions/assertions-corrections?' + api;

  const options = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
    },
  };

  try {
    const response = await fetch(url, options);
    const jsonResponse = await response.json();

    const correctPositions = getCorrectPositions(jsonResponse.data);
    displayAnswers(correctPositions);

    answersLoaded = true;  // Atualiza a flag para indicar que as respostas foram carregadas

  } catch (err) {
    console.log('Erro:', err);
  }
}
//**EXPLOIT
//Funçao que monta os blocos das questoes e retorna em qual posição estava true, essa posição sera a resposta 0=A, 1=B, 2=C...
//O código funciona para qualquer quantidade de questões e respostas que as atividades possam ter
function getCorrectPositions(data) {
  const blocks = {};

  data.forEach(({ correct }, index) => {
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
}//*EXPLOIT

function displayAnswers(correctPositions) {
  const answerDiv = document.getElementById('answers');
  answerDiv.innerHTML = '';  // Limpa o conteúdo anterior

  for (const [blockIndex, letters] of Object.entries(correctPositions)) {
    const blockDiv = document.createElement('div');
    blockDiv.innerText = `Pergunta ${blockIndex}: ${letters.join(', ')}`;
    answerDiv.appendChild(blockDiv);
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    
    // Verifica se a URL da guia ativa pertence ao domínio desejado
    if (currentTab && currentTab.url.includes('descomplica.com.br')) {
      const apiDiv = document.getElementById('apiDiv');
      const tokenDiv = document.getElementById('tokenDiv');

      if (answersLoaded) {
        apiDiv.innerText = 'API: Respostas já carregadas';
      } else {
        chrome.runtime.sendMessage('getLastRequestPart', async function(response) {
          if (response && response.urlPart) {
            apiDiv.innerText = 'API OK ';
	//Captura token que esta salvo no cookie de nome 'd'
            const cookie = await chrome.cookies.get({ url: currentTab.url, name: 'd' });
            if (cookie) {
              tokenDiv.innerText = 'Token OK ';
              await getCola(cookie.value, response.urlPart);
            } else {
              tokenDiv.innerText = 'Token nao encontrado.';
            }
          } else {
            apiDiv.innerText = 'Aguardando API';
			setTimeout(function() {
			window.location.reload();
			}, 2000);
          }
        });
      }
    } else {

            apiDiv.innerText = 'Este script está sendo executado fora do domínio descomplica.com.br';
    }
  });
});


document.addEventListener('DOMContentLoaded', function() {
  const githubLink = document.getElementById('githubLink');

  githubLink.addEventListener('click', function() {
    chrome.tabs.create({ url: 'https://github.com/RodrigoSKohl/Descomplica-a-Vida' });
  });
});