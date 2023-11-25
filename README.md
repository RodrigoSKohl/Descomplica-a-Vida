# Descomplica-a-Vida
***Extensão somente usada para fins educativos. Não utilize para colar***

![image](https://github.com/RodrigoSKohl/Descomplica-a-Vida/assets/107029851/63d02edf-18a7-46a7-88fd-30dd6a13cc75)


## Instalação
1. [Baixe o repositório](https://github.com/RodrigoSKohl/Descomplica-a-Vida/archive/refs/heads/main.zip)
1. Descompacte o Arquivo ZIP 
1. Acesse a aba de extensões no navegador: __chrome://extensions/__
1. Ative o modo desenvolvedor:
![image](https://github.com/RodrigoSKohl/Descomplica-a-Vida/assets/107029851/bb745626-6db9-4c44-b48e-8a238cfd5ebe)

1. Clique em **Carregar sem compactação** e selecione a pasta descompactada
1. Ative a extensão estando em qualquer aula da descomplica
   
![image](https://github.com/RodrigoSKohl/Descomplica-a-Vida/assets/107029851/762f1998-ecdb-4d56-a3ea-17d1dc7a1550)


#
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
#
#### Compatibilidade
`Google Chrome Browser 64 bits`
#
#### Bugs conhecidos:
- Quando acessar os modulos do curso, a extensao captura um payload que retorna 10 questões. Essas questões são referentes aos exercicios do simulado;
- A sétima questão que aparece nas respostas é a resposta do P&R (somente valido para aulas onde o P&R seja de marcar).
