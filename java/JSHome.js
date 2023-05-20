import { db, auth} from '../config/firebase.js'
import { header } from './JSHeader.js';
import { query, collection, onSnapshot, where } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";

auth.onAuthStateChanged( function(user){
    if(!auth.currentUser){
        sessionStorage.setItem("logado", 1)
        window.location.href = '../html/Entrar.html'
    }
})

const idUser = JSON.parse(sessionStorage.getItem("user")).user.uid
const pesquisa = query(collection(db, "vacinas"),where("idUser","==",idUser))
const vacinasCadastradas = []

    //Criação da função tipoDose, aonde recebe como parametro o número que identifica o tipo da dose, e retorna
    //o texto do do tipo de dose.
const tipoDose = (valTip) => {
    switch (valTip) {
        case 0:
            return "1ª dose"
        case 1:
            return "2ª dose"
        case 2:
            return "3ª dose"
        case 3:
            return "Reforço"
        case 4:
            return "Dose única"
    }
}

//Com o Window.onload irá carregar as funções javascript dentro desta função após o documento html, ter carregado
window.onload = () => {
    const user = JSON.parse(sessionStorage.getItem("user"))
    //Armazena dentro do atributo gridContainer, a referencia para o elemento com id "gridCont"
    const gridContainer = document.getElementById("gridCont")

    //Criação da função que será responsavel por gerar os cartões de vacina na home, aonde receberá como parametros
    //as informações da vacina e irá retornar uma referencia ao fundo da card criada, e que será colocada, no gridContainer
    const gerarCart = (nome, tipo, data, dataProx, idCard, imgSrc) => {
        const backCard = document.createElement("article")
        backCard.setAttribute("id", idCard)

        const tituloVac = document.createElement("h1")
        tituloVac.classList.add("h1-vacina")
        tituloVac.innerHTML = nome
        backCard.appendChild(tituloVac)
        tituloVac.setAttribute("id", idCard)


        const divTipo = document.createElement("div")
        divTipo.classList.add("tipo-dose")
        backCard.appendChild(divTipo)
        divTipo.setAttribute("id", idCard)


        const pDiv = document.createElement("p")
        pDiv.innerHTML = tipoDose(tipo)
        divTipo.appendChild(pDiv)
        pDiv.setAttribute("id", idCard)

        const pData = document.createElement("p")
        pData.innerHTML = data.split('-').reverse().join('/')
        pData.classList.add("data-vac")
        backCard.appendChild(pData)
        pData.setAttribute("id", idCard)


        const imgCard = document.createElement("img")
        imgCard.src = imgSrc
        backCard.appendChild(imgCard)
        imgCard.setAttribute("id", idCard)


        const divData = document.createElement("div")
        divData.classList.add("data-prox")
        backCard.appendChild(divData)
        divData.setAttribute("id", idCard)

        if (dataProx === 0) {
            const spanTxt = document.createElement("span")
            spanTxt.innerHTML = "Não há próxima dose "
            divData.appendChild(spanTxt)
            spanTxt.setAttribute("id", idCard)
        } else {
            const spanTxt = document.createElement("span")
            spanTxt.innerHTML = "Proxima dose em: " + dataProx.split('-').reverse().join('/')
            divData.appendChild(spanTxt)
            spanTxt.setAttribute("id", idCard)

        }

        backCard.addEventListener("click", () =>{
            window.location.href = "Editar_vacina.html?idVacina=" + idCard
        })

        return backCard
    }

    const carregarCards = (vacinas) => {
        gridContainer.innerHTML = ""
        vacinas.forEach((vacina) =>{
            gridContainer.appendChild(gerarCart(vacina.NomeVac, vacina.Tipo, vacina.DataVacina, vacina.DataProx, vacina.id, vacina.URL))
        })
    }

    const carregarVacinas = () => {
        onSnapshot(pesquisa, (results)=> {
            results.forEach((vacina) => {
                //gridContainer.appendChild(gerarCart(vacina.data().NomeVac, parseInt(vacina.data().Tipo), vacina.data().DataVacina, vacina.data().DataProx, vacina.id, vacina.data().URL))
                vacinasCadastradas.push({
                    NomeVac: vacina.data().NomeVac,
                    Tipo: parseInt(vacina.data().Tipo),
                    DataVacina: vacina.data().DataVacina,
                    DataProx: vacina.data().DataProx,
                    id: vacina.id,
                    URL: vacina.data().URL
                })
            })
            carregarCards(vacinasCadastradas)
        })
    }

    //Irá percorrer pela lista de vacinas, gerando um card para cada vacina cadastrada nesta lista, e adcionada como filha do gridContainer

    // //Armazena dentro do atributo gridContainer, a referencia para os elementos com tag "article"
    // const artigos = document.getElementsByTagName("article")

    // //Função qual irá mudar de página e irá identificar a id do artigo clicado para passar o id do mesmo, para
    // //passar como parametro.
    // const artigoClick = aC => {
    //     window.location.href = "Editar_vacina.html?idVacina=" + aC.target.id
    // }

    // //percorre uma lista de artigos, adcionando em cada um dele um addEventListener, que ao ter ocorrido um click
    // //neles chamará a função artigoClick, que verificará o id daquele artigo clicado e passará como parametro,
    // //conforme troca de pagina
    // for (let artigo of artigos) {
    //     artigo.addEventListener("click", artigoClick)
    // }


    //Ao perceber o evento de um click em um elemento com o id "btAdc", irá para a página Cadastrar_vacina.
    document.getElementById("btAdc").addEventListener("click", btAdc = () => {
        window.location.href = "Cadastrar_vacina.html"
    })

    document.getElementById("pesquisa").addEventListener("keyup", () => {
        const stringPesquisa = document.getElementById("pesquisa").value.trim()
        carregarCards(vacinasCadastradas.filter(vacina => vacina.NomeVac.toLowerCase().includes(stringPesquisa.toLowerCase())))
    })

    //chama a função header, do arquivo JSHeader.js.
    header()
    carregarVacinas()

}
