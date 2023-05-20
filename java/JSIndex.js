import { header } from './JSHeader.js';
//Define e cria o item de sessão logado como 0
sessionStorage.setItem("logado", 0)

//Com o Window.onload irá carregar as funções javascript dentro desta função após o documento html, ter carregado
window.onload = () => {
  //Ao perceber o evento de um click em um elemento com o id btCadastrar, irá mudar de página para a Criar_conta,
  //conforme define o item de sessão logado como 1.
  document.getElementById("btCadastrar").addEventListener("click", () => {
    sessionStorage.setItem("logado", 1)
    window.location.href = "Criar_conta.html"
  })
  //chama a função header, do arquivo JSHeader.js.
  header();
}