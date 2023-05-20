import { header } from '../java/JSHeader.js'
import { auth } from '../config/firebase.js'
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js"

const getEmail = () => {
  return document.getElementById('email').value
}

const btnCarregando = (carregando) => {
  if (carregando) {
    document.getElementById("btRedef").style.display = "none"
    document.getElementById("carregando").style.display = "flex"
  } else {
    document.getElementById("btRedef").style.display = "flex"
    document.getElementById("carregando").style.display = "none"
  }
}

const Redefinir = () => {
  btnCarregando(true)
  const email = getEmail()
  sendPasswordResetEmail(auth, email)
    .then(() => {
      btnCarregando(false)
      document.getElementById("Aviso").style.color = 'green';
      document.getElementById("Aviso").innerHTML = "Email para redefinição enviado!"
    })
    .catch((error) => {
      btnCarregando(false)
      document.getElementById("Aviso").style.color = 'red';
      document.getElementById("Aviso").innerHTML = "Email invalido!"
    })
}

//Com o Window.onload irá carregar as funções javascript dentro desta função após o documento html, ter carregado
window.onload = () => {
  //Ao perceber o evento de um click em um elemento com o id btRedef, irá mudar de página para a Entrar,
  //conforme não altera o valor de sessão logado.
  document.getElementById("btRedef").addEventListener("click", Redefinir)
  //chama a função header, do arquivo JSHeader.js.
  header();
}