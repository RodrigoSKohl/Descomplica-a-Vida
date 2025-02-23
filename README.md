# Descomplica-a-Vida
***Extensão somente usada para fins educativos. Não utilize para colar***

![{25B009DE-6373-4E4A-81E6-12DF4A54B33E}](https://github.com/user-attachments/assets/72f29240-90dc-459d-96b2-843e304b3c88)


:warning: **Caso você esteja fazendo a atualização da extensão, antes remover a extensão antiga.**

## Instalação Chrome
1. [Baixe o source aqui](https://github.com/RodrigoSKohl/Descomplica-a-Vida/releases/latest)
1. Descompacte o Arquivo ZIP 
1. Acesse a aba de extensões no navegador: __chrome://extensions/__
1. Ative o modo desenvolvedor:
![image](https://github.com/RodrigoSKohl/Descomplica-a-Vida/assets/107029851/bb745626-6db9-4c44-b48e-8a238cfd5ebe)

1. Clique em **Carregar sem compactação** e selecione a pasta descompactada
1. Ative a extensão estando em qualquer aula da descomplica
   
![image](https://github.com/RodrigoSKohl/Descomplica-a-Vida/assets/107029851/762f1998-ecdb-4d56-a3ea-17d1dc7a1550)

## Instalação Firefox[^1]
1. Seguindo os mesmos passos do [Chrome](#instalação-chrome), ao baixar e descompactar a extensão
   
1. Acesse a área de Debugging do Firefox digitando diretamente na barra de endereço: __about:debugging__
   
1. Clique na opção "Este Firefox", em seguida clique em "Carregar extensão temporária"
   
1. Então selecione o arquivo **manifest.json** da pasta descompactada e clique em abrir

## Instalação Edge
1. Seguindo os mesmos passos do [Chrome](#instalação-chrome), ao baixar e descompactar a extensão

1. Acesse a aba de extensões no navegador: __edge://extensions/__

1. Ative o modo desenvolvedor:
   
![{B27D5594-04CF-4CE4-8FC5-081CCC749ED6}](https://github.com/user-attachments/assets/5c5bd7a8-c836-4d29-9771-ad6b65673ff9)

1. Clique em **Carregar sem pacote** e selecione a pasta descompactada
   
![{D7B8052C-3C0A-4784-BEFF-4F2B4C347E20}](https://github.com/user-attachments/assets/4cd130bd-e4fe-4ab5-b026-55e7232034f9)
1. Ative a extensão estando em qualquer aula da descomplica

 
#
### Versão 0.6
- Melhoria no cache das respostas (salva a resposta em localstorage para não executar requisição ao servidor da descomplica a cada acesso a extensão);
- Nova interface gráfica;
  
#

<details>
	<summary><b><a>Versões anteriores</a></b></summary>

### Versão 0.5
- A questão 7, referente ao pensar e responder, foi corrigida;
- As 10 questões obtidas ao entrar em alguma matéria (referente às listas de revisão) foram retiradas. Agora, é necessário entrar em uma aula ou lista para obter as respostas.
### Versão 0.4
- No começo de 08/2024 a descomplica esta enviando o payload de resposta das questões embaralhadas, o que fez a extensão não entregar mais as alternativas corretas. Essa versão visa consertar o problema desembaralhando o response a partir do payload enviado;
- Removido erro que acontecia de Payload não encontrado(somente na tela de extensões, não encontrava a variavel **err** no Payload).
- A partir da versao 0.4, serão realizados releases das versões.
### Versão 0.3
- Removidas varáveis que não estavam mais sendo usadas(esqueci de remover na versão anterior);
- Omitidas entradas de função sem uso;
- Adicionada variavel para document.createElement('div') ao inves de chamar no loop de displayAnswers;
- Melhorias na UI do popup.html;
- Realizada mudança na lógica do tratamento dos erros, antes erro de API era tratado primieiro que erro do Token, porém para executar o método get para a API é necessário que o token já tenha sido capturado. A lógica de erros ficou assim: TOKEN -> PAYLOAD -> API. Primeiramente o token é capturado, logo após se faz a verificação se o Payload ja foi capturado pelo script de background, se nao foi é realizado um refresh na popup até a captura, após a captura é mandado o metodo GET para a API.
### Versão 0.2
- Adicionado cache que salva o payload caputarado pelo service worker background.js;
- Corrigido problema que não atualizava questões ao clicar na extensão quando ela estava capturando o payload;
- Adicionado feature onde a extensão só habilita no dominio da descomplica.
### Versão 0.1
- Criada extensão que captura o payload das questões das aulas da descomplica(ultimo request da URL de API), alem do token do usuario via cookies e envia um get para a API, retornando as respostas;
- A extensão visa se utilizar de uma falha do sistema(EXPLOIT) de perguntas da faculdade descomplica, onde é retornado o objeto contedo todas alternativas não enumeradas, porém em forma sequencial, o que facilita a descoberta da resposta correta. Como uma validaçao é dependente da outra, foi-se usada uma unica variavel para tratar os erros.
</details>

#

#### Compatibilidade
`Google Chrome Browser 64 bits`
`Firefox Browser 64 bits`
#
#### Bugs conhecidos:
- Por hora nenhum, caso tenha encontrado algum, sinta-se a vontade para abrir uma Issue ou um PR para melhorias.

[^1]: Caso o navegador seja reiniciado, precisa carregar a extensão novamente
