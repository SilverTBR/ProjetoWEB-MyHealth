import { auth, db, storage } from '../config/firebase.js'
import { header } from './JSHeader.js'
import { getDoc, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { uploadBytes, ref, deleteObject } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";


auth.onAuthStateChanged(function (user) {
  if (!auth.currentUser) {
    sessionStorage.setItem("logado", 1)
    window.location.href = '../html/Entrar.html'
  }
})

var file = null
var booleanUnica = false
var refArquivo = null

//Com o Window.onload irá carregar as funções javascript dentro desta função após o documento html, ter carregado
window.onload = () => {

  const getDataVac = () => {
    return document.getElementById("data").value
  }

  const getNomeVac = () => {
    return document.getElementById("Vac").value
  }

  const getTipo = () => {
    return document.querySelector('.Dose:checked').value
  }

  const getDataProx = () => {
    if (booleanUnica) {
      return 0
    }
    return document.getElementById("data_prox").value
  }

  const verificarCampos = () => {
    if (getNomeVac().trim(" ").length === 0) {
      document.getElementById("Aviso").style.display = "inline"
      document.getElementById("Aviso").innerHTML = "Campo de nome da vacina está vazio!"
      return false
    }
    return true
  }




  const idVacina = new URLSearchParams(window.location.search).get("idVacina")
  const deletarVacina = () => {
    btnCarregandoDelete(true)
    deleteObject(ref(storage, refArquivo))
      .then(() => {
        deleteDoc(doc(db, "vacinas", idVacina))
          .then(() => {
            btnCarregandoDelete(false)
            window.location.href = "Home.html"
          })
          .catch((error) => {
            btnCarregandoDelete(false)
            console.log("Erro durante exclusão de vacina: " + error)
          })
      })
      .catch((error) => {
        btnCarregandoDelete(false)
        console.log("Erro ao excluir imagem= " + error)
      })

  }

  const update = () => {
    if (verificarCampos()) {
      if (file) {
        btnCarregando(true)
        uploadBytes(ref(storage, refArquivo), file)
          .then((result) => {
            updateDoc(doc(db, "vacinas", idVacina), {
              DataVacina: getDataVac(),
              NomeVac: getNomeVac(),
              Tipo: getTipo(),
              DataProx: getDataProx()
            })
              .then((result) => {
                btnCarregando(false)
                window.location.href = "Home.html"
              })
              .catch((error) => {
                btnCarregando(false)
                console.log("Erro ao salvar a vacina: " + error)
              })
          })
          .catch((error) => {
            btnCarregando(false)
            console.log("Erro ao salvar imagem = " + error)
          })
      } else {
        btnCarregando(true)
        updateDoc(doc(db, "vacinas", idVacina), {
          DataProx: getDataProx(),
          DataVacina: getDataVac(),
          NomeVac: getNomeVac(),
          Tipo: getTipo()
        })
          .then(() => {
            btnCarregando(false)
            window.location.href = "Home.html"
          })
          .catch((error) => {
            btnCarregando(false)
            console.log("Erro ao salvar a vacina: " + error)
          })
      }

    }
  }

  getDoc(doc(db, "vacinas", idVacina))
    .then((vacinaResult) => {
      document.getElementById('data').value = vacinaResult.data().DataVacina
      document.getElementById("Vac").value = vacinaResult.data().NomeVac
      document.getElementById(vacinaResult.data().Tipo).checked = true
      checkComb()
      document.getElementById("data_prox").value = vacinaResult.data().DataProx
      document.getElementById("imgCompr").src = vacinaResult.data().URL
      refArquivo = vacinaResult.data().CaminhoFoto
    })

  const checkComb = () => {
    const radio_list = document.getElementById("radios").childNodes
    const proximaVacina = document.getElementById("prox_data")

    proximaVacina.style.display = 'flex'

    radio_list.forEach((element) => {
      if (element.nodeName == 'INPUT') {
        if ((element.getAttribute('id') == '4') && (element.checked == true)) {
          proximaVacina.style.display = 'none'
          booleanUnica = true
        }
      }
    })
  }

  const setChangeRadio = () => {
    const radio_list = document.getElementById("radios").childNodes

    radio_list.forEach((element) => {

      if (element.nodeName == 'INPUT') {
        element.addEventListener('change', () => {
          booleanUnica = false
          checkComb()
        })
      }
    })
  }

  const getFile = () => {
    let input = document.createElement("input")
    input.type = "file"
    input.onchange = () => {
      let files = Array.from(input.files)
      file = window.event.target.files[0]
      document.getElementById("imgCompr").src = URL.createObjectURL(file)
    }
    input.click()
  }

  const btnCarregandoDelete = (carregando) => {
    if (carregando) {
      document.getElementById("btAceitar").style.display = "none"
      document.getElementById("btCancel").style.display = "none"
      document.getElementById("carregandoDelete").style.display = "flex"
    } else {
      document.getElementById("btAceitar").style.display = "inline"
      document.getElementById("btCancel").style.display = "inline"
      document.getElementById("carregandoDelete").style.display = "none"
    }
  }

  const btnCarregando = (carregando) => {
    if (carregando) {
      document.getElementById("btSalvar").style.display = "none"
      document.getElementById("carregando").style.display = "flex"
    } else {
      document.getElementById("btSalvar").style.display = "flex"
      document.getElementById("carregando").style.display = "none"
    }
  }



  //Ao perceber o evento de um click em um elemento com o id btExcluir irá tornar visivel a div de popup,
  //com seus conteudos
  document.getElementById("btExcluir").addEventListener("click", () => {
    document.getElementById("popup").style.display = "inline"
  })

  //Ao perceber o evento de um click em um elemento com o id btAceitar irá esconder a div de popup e seus conteudos
  document.getElementById("btAceitar").addEventListener("click", () => {
    deletarVacina()
  })

  //Ao perceber o evento de um click em um elemento com o id btCancel irá esconder a div de popup e seus conteudos
  document.getElementById("btCancel").addEventListener("click", () => {
    document.getElementById("popup").style.display = "none"
  })

  //Ao perceber o evento de um click em um elemento com o id btSalvar, irá mudar de página para a home.
  document.getElementById("btSalvar").addEventListener("click", update)

  document.getElementById("inserir-image").addEventListener("click", () => {
    getFile()
  })
  //chama a função header, do arquivo JSHeader.js.
  header()
  setChangeRadio()
}