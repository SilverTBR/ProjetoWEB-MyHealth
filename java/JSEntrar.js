import { header } from './JSHeader.js'
import { auth } from '../config/firebase.js'
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js"


//Com o Window.onload irá carregar as funções javascript dentro desta função após o documento html, ter carregado
window.onload = () => {

    const getEmail = () => {
        return document.getElementById("email").value
    }

    const getSenha = () => {
        return document.getElementById("senha").value
    }

    const btnCarregando = (carregando) => {
        if (carregando) {
            document.getElementById("login").style.display = "none"
            document.getElementById("carregando").style.display = "flex"
        } else {
            document.getElementById("login").style.display = "flex"
            document.getElementById("carregando").style.display = "none"
        }
    }

    const authUsuario = () => {
        btnCarregando(true)
        const email = getEmail()
        const senha = getSenha()

        signInWithEmailAndPassword(auth, email, senha)
            .then((userInfo) => {
                btnCarregando(false)
                sessionStorage.setItem("user", JSON.stringify(userInfo))
                sessionStorage.setItem("logado", 2)
                window.location.href = "Home.html"
            })
            .catch((error) => {
                btnCarregando(false)
                console.log("Erro ao logar = "+error.message)
                if (error.code === "auth/user-not-found" || error.code === "auth/invalid-email") {
                    document.getElementById("Aviso").innerHTML = "Email está invalido!"
                } else if (error.code === "auth/wrong-password") {
                    document.getElementById("Aviso").innerHTML = "Senha está invalida!"
                } else if (error.code === "auth/network-request-failed") {
                    document.getElementById("Aviso").innerHTML = "Campos invalidos!"
                }


            })
    }

    var recuperar = () => {
        window.location.href = "Recuperar_senha.html"
    }

    //Ao perceber o evento de um click em um elemento com o id "login", irá para a página home, conforme define o item de sessão, logado como 2
    document.getElementById("login").addEventListener("click", authUsuario);
    //sessionStorage.setItem("logado", 2)
    //window.location.href = "Home.html"


    //Ao perceber o evento de um click em um elemento com o id "esq-senha", irá para a página Recuperar_senha, conforme não altera o logado.
    document.getElementById("esq-senha").addEventListener('click', recuperar)
    //document.getElementById("esq-senha").addEventListener('click', recuperar = () => {
    //    window.location.href = "Recuperar_senha.html"
    //})

    //chama a função header, do arquivo JSHeader.js.
    header();
}