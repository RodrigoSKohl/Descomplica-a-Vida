# Descomplica-a-Vida
***Extensao somente usada para fins educativos***

## **Versão 0.2**
- Adicionado cache que salva o payload caputarado pelo service worker background.js;
- Corrigido problema que não atualizava questões ao clicar na extensão quando ela estava capturando o payload;
- Adicionado feature onde a extensão só habilita no dominio da descomplica.

## **Versão 0.1**
- Criada extensão que captura o payload das questões das aulas da descomplica(ultimo request da URL de API), alem do token do usuario via cookies e envia um get para a API, retornando as respostas;
- A extensão visa se utilizar de uma falha do sistema(EXPLOIT) de perguntas da faculdade descomplica, onde é retornado o objeto contedo todas alternativas não enumeradas, porém em forma sequencial, o que facilita a descoberta da resposta correta.

#
<br>

**Bugs conhecidos:**
- Quando acessar os modulos do curso, a extensao captura um payload que retorna 10 questões. Essas questões são referentes aos exercicios do simulado;
- A sétima questão que aparece nas respostas é a resposta do P&R (somente valido para aulas onde o P&R seja de marcar).
