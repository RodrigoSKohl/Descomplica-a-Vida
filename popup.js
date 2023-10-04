let answersLoaded = false;  // Flag para indicar se as respostas foram carregadas

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
}

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
  const apiDiv = document.getElementById('apiDiv');
  const tokenDiv = document.getElementById('tokenDiv');

  if (answersLoaded) {
    apiDiv.innerText = '\nAPI: Respostas já carregadas';
  } else {
    chrome.runtime.sendMessage('getLastRequestPart', async function(response) {
      if (response && response.urlPart) {
        apiDiv.innerText = '\nAPI OK ';

        chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
          let tab = tabs[0];
          const cookie = await chrome.cookies.get({ url: tab.url, name: 'd' });
          if (cookie) {
            tokenDiv.innerText = '\nToken OK ';
            await getCola(cookie.value, response.urlPart);
          } else {
            tokenDiv.innerText = '\nToken nao encontrado.';
          }
        });
      } else {
        apiDiv.innerText = '\nAguardando API';
      }
    });
  }
});