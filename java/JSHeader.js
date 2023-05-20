import { signOut } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js"
import { auth } from '../config/firebase.js'

//Criação da função header, qual irá tratar dos botões que terá no header das paginas web de forma dinamica.
const deslogar = () => {
    signOut(auth)
    window.location.href = "Entrar.html"
}

const header = () => {
    //Armazena o valor atual do item de sessão, "logado", na variavel local logado.
    const logado = sessionStorage.getItem("logado")

    //Verifica o valor da variavel logado, para definir os botões que serão exibidos e quais serão escondidos.
    if (logado == 0) {
        document.getElementById("header0").style.display = "inline"
        document.getElementById("header1").style.display = "none"
        document.getElementById("header2").style.display = "none"
    } else if (logado == 1) {
        document.getElementById("header0").style.display = "none"
        document.getElementById("header1").style.display = "none"
        document.getElementById("header2").style.display = "none"
    } else if (logado == 2) {
        document.getElementById("header0").style.display = "none"
        document.getElementById("header1").style.display = "inline"
        document.getElementById("header2").style.display = "inline"
    }

    //Ao perceber o evento de um click em um elemento com o id "header0", irá para a página Entrar, conforme define o item de sessão, logado como 1

    document.getElementById("header0").addEventListener("click", () => {
        sessionStorage.setItem("logado", 1)
        window.location.href = "Entrar.html"
    })

    //Ao perceber o evento de um click em um elemento com o id "header1", irá para a página Home, conforme define o item de sessão, logado como 2
    document.getElementById("header1").addEventListener("click", () => {
        sessionStorage.setItem("logado", 2)
        window.location.href = "Home.html"
    })

    //Ao perceber o evento de um click em um elemento com o id "header2", irá para a página Index, conforme não define o item de sessão logado, pois a pagina index ao acessar já define o mesmo como 0
    document.getElementById("header2").addEventListener("click", deslogar)


    //Ao perceber o evento de um click em um elemento com o id "logo", irá para a página Index, conforme não define o item de sessão logado, pois a pagina index ao acessar já define o mesmo como 0
    document.getElementById("logo").addEventListener("click", () => {
        window.location.href = "Index.html"
    })

}

export { header }