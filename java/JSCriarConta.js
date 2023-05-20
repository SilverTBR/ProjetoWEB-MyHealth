import { header } from './JSHeader.js';
import { auth, db } from '../config/firebase.js'
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js"
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

//Com o Window.onload irá carregar as funções javascript dentro desta função após o documento html, ter carregado
window.onload = () => {

  const getNome = () => {
    return document.getElementById("Nome").value
  }

  const getSenha = () => {
    return document.getElementById("Senha").value
  }

  const getSenhaRep = () => {
    return document.getElementById("ConfirmS").value
  }

  const getSexo = () => {
    return document.querySelector('.sexo:checked').value
  }

  const getDataNasc = () => {
    return document.getElementById("data_nasc").value
  }

  const getEmail = () => {
    return document.getElementById("Email").value
  }

  const verRadio = () => {
    var sexos = document.getElementsByClassName("sexo")
    for (const sexo of sexos) {
      if (sexo.checked) {
        return false
      }
    }
    return true
  }

  const verCampos = () => {
    if (getNome().trim(" ").length === 0) {
      document.getElementById("Aviso").style.display = "inline"
      document.getElementById("Aviso").innerHTML = "Campo do nome está vazio!"
      return false
    } if (getSenha().trim(" ").length === 0) {
      document.getElementById("Aviso").style.display = "inline"
      document.getElementById("Aviso").innerHTML = "Campo da senha está vazio!"
      return false
    } if (getSenhaRep().trim(" ").length === 0) {
      document.getElementById("Aviso").style.display = "inline"
      document.getElementById("Aviso").innerHTML = "Campo de repetir senha está vazio!"
      return false
    } if (verRadio()) {
      document.getElementById("Aviso").style.display = "inline"
      document.getElementById("Aviso").innerHTML = "Nenhum sexo foi selecionado!"
      return false
    } if (!getDataNasc()) {
      document.getElementById("Aviso").style.display = "inline"
      document.getElementById("Aviso").innerHTML = "Data de nascimento não foi selecionada!"
      return false
    }
    return true

  }


  //Criação da função verSenhas, que são funções para verificar se as senhas são iguais.
  const verSenhas = () => {
    //Pega os valores dos campos com id Senha e ConfirmS.
    const senha = getSenha()
    const senhaRep = getSenhaRep()

    //Valida os valores de senhas.
    if (senha === senhaRep && senha != "" && senha.trim().length != 0) {
      //Da acesso a pagina
      return true
    } else {
      //Faz aparecer a mensagem de aviso que senhas estão invalidas, e nega acesso.
      document.getElementById("Aviso").style.display = "inline"
      document.getElementById("Aviso").innerHTML = "Senhas estão diferentes!"
      return false
    }

  }

  const validEmail = () => {
    var email = getEmail()
    var formatoEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (email.match(formatoEmail)) {
      return true
    } else {
      document.getElementById("Aviso").style.display = "inline"
      document.getElementById("Aviso").innerHTML = "Email invalido!"
      return false
    }

  }
  //Ao perceber o evento de um click em um elemento com o id cadastrar irá chamar o método para veSenhas,
  //e caso as senhas sejam validadas irá ir para a página home, conforme define o item de sessão, logado como 2
  document.getElementById("cadastrar").addEventListener("click", () => {
    if (verSenhas() && validEmail() && verCampos()) {
      btnCarregando(true)
      const email = getEmail()
      const senha = getSenha()

      createUserWithEmailAndPassword(auth, email, senha)
        .then((userInfo) => {
          setDoc(doc(db, "usuarios", userInfo.user.uid), {
            nome: getNome(),
            sexo: getSexo(),
            dataNasc: getDataNasc(),
          })
            .then(() => {
              btnCarregando(false)
              sessionStorage.setItem("user", JSON.stringify(userInfo))
              sessionStorage.setItem("logado", 2),
                window.location.href = "Home.html"
            })
            .catch((error) => {
              btnCarregando(false)
              console.log("Erro ao salvar arquivo do usuario= " + error.message)
            })
        })
        .catch((error) => {
          btnCarregando(false)
          console.log("Erro ao autenticar usuario= " + error.message)
          if (error.code === 'auth/email-already-in-use') {
            document.getElementById("Aviso").style.display = "inline"
            document.getElementById("Aviso").innerHTML = "Email já cadastrado!"
          }
        })
    }
  })

  const btnCarregando = (carregando) => {
    if (carregando) {
      document.getElementById("cadastrar").style.display = "none"
      document.getElementById("carregando").style.display = "flex"
    } else {
      document.getElementById("cadastrar").style.display = "flex"
      document.getElementById("carregando").style.display = "none"
    }
  }
  //chama a função header, do arquivo JSHeader.js.
  header()
}
