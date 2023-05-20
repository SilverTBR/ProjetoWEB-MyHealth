import { header } from '../java/JSHeader.js'
import { auth, db, storage } from '../config/firebase.js'
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-firestore.js";
import { uploadBytes, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-storage.js";


auth.onAuthStateChanged(function (user) {
  if (!auth.currentUser) {
    sessionStorage.setItem("logado", 1)
    window.location.href = '../html/Entrar.html'
  }
})

var file = null
var booleanUnica = false

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

  const verRadio = () => {
    var tipos = document.getElementsByClassName("Dose")
    for (const tipo of tipos) {
      if (tipo.checked) {
        return false
      }
    }
    return true
  }

  const verificarCampos = () => {
    if (!file) {
      document.getElementById("Aviso").style.display = "inline"
      document.getElementById("Aviso").innerHTML = "Não selecionou uma imagem!"
      return false
    } if (!getDataVac()) {
      document.getElementById("Aviso").style.display = "inline"
      document.getElementById("Aviso").innerHTML = "Não selecionou a data da vacina!"
      return false
    } if (getNomeVac().trim(" ").length === 0) {
      document.getElementById("Aviso").style.display = "inline"
      document.getElementById("Aviso").innerHTML = "Campo de nome da vacina está vazio!"
      return false
    } if (verRadio()) {
      document.getElementById("Aviso").style.display = "inline"
      document.getElementById("Aviso").innerHTML = "Nenhum tipo de vacina foi selecionado!"
      return false
    } if (!getDataProx() && !booleanUnica) {
      document.getElementById("Aviso").style.display = "inline"
      document.getElementById("Aviso").innerHTML = "Não selecionou da proxima vacina!"
      return false
    }
    return true
  }


  const imgID = () => {
    const id = Date.now().toString(16) + Math.random().toString(16)
    return id.replace(/\./g, '')
  }

  const cadastrar = () => {
    if (verificarCampos()) {
      const refArquivo = "imagens/" + imgID()
      btnCarregando(true)
      uploadBytes(ref(storage, refArquivo), file)
        .then((result) => {
          getDownloadURL(ref(storage, refArquivo))
            .then((urlIMG) => {
              //console.log(urlIMG)
              //document.getElementById("comprovante").src = urlIMG
              addDoc(collection(db, "vacinas"), {
                DataVacina: getDataVac(),
                NomeVac: getNomeVac(),
                Tipo: getTipo(),
                DataProx: getDataProx(),
                URL: urlIMG,
                CaminhoFoto: refArquivo,
                idUser: JSON.parse(sessionStorage.getItem("user")).user.uid
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
              console.log("Erro ao pegar URL da imagem = " + error)
            })
        })
        .catch((error) => {
          btnCarregando(false)
          console.log("Erro ao salvar imagem = " + error)
        })
    }



    //   addDoc(collection(db, "vacinas"),{
    //     DataVacina: getDataVac(),
    //     NomeVac: getNomeVac(),
    //     Tipo: getTipo(),
    //     DataProx: getDataProx(),
    //     idUser: JSON.parse(sessionStorage.getItem("user")).user.uid
    //  })
    //   .then((result) => {
    //     window.location.href = "Home.html"        
    //   })
    //   .catch((error) => {
    //     console.log("Erro ao salvar a vacina: "+error)
    //   })
  }


  const checkComb = () => {
    const radio_list = document.getElementById("radios").childNodes
    const proximaVacina = document.getElementById("prox_data")

    proximaVacina.style.display = 'flex'

    radio_list.forEach((element) => {
      if (element.nodeName == 'INPUT') {
        if ((element.getAttribute('id') == 'unica') && (element.checked == true)) {
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

  // document.getElementById("unica").addEventListener("", () => {
  //   if(document.getElementById("unica").checked == true){
  //     document.getElementById("prox_data").style.display = "none"
  //     console.log("Teste222")
  //   } else {
  //     console.log("Teste")
  //     document.getElementById("prox_data").style.display = "inline"
  //   }
  // })


  const getFile = () => {
    let input = document.createElement("input")
    input.type = "file"
    input.onchange = () => {
      let files = Array.from(input.files)
      file = window.event.target.files[0]
      document.getElementById("comprovante").src = URL.createObjectURL(file)
    }
    input.click()
  }

  //Alterar botão para carregando
  const btnCarregando = (carregando) => {
    if (carregando) {
      document.getElementById("btCadastrar").style.display = "none"
      document.getElementById("carregando").style.display = "flex"
    } else {
      document.getElementById("btCadastrar").style.display = "flex"
      document.getElementById("carregando").style.display = "none"
    }
  }


  //Ao perceber o evento de um click em um elemento com o id btCadastrar irá para a pagina home.
  document.getElementById("btCadastrar").addEventListener("click", cadastrar)
  //window.location.href = "Home.html"
  //Chamar o type file para o botão inserir img
  document.getElementById("inserirImg").addEventListener("click", () => {
    getFile()
  })



  setChangeRadio()
  //chama a função header, do arquivo JSHeader.js.
  header()
}