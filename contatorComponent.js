// Clouser
// IIFE -> Immealy Invoked Function Expression
(() => {

const BTN_REINICIAR = "btnReiniciar"
const ID_CONTADOR = "contador"
const VALOR_CONTADOR = 100
const PERIODO_INTERVALO = 10

class ContadorComponent {
  constructor(){
    // Starting the counter
    this.inicializar()
  }

  prepararContadorProxy(){

    // Handler is a proxy
    const handler = {
      set: (currentContext, propertyKey, newValue) => {
        console.log({currentContext, propertyKey, newValue})

        // Stop count
        if(!currentContext.valor){
          currentContext.efetuarParada()
        }

        currentContext[propertyKey] = newValue

        return true
      }
    }

    // If instace of the object modify
    const contador = new Proxy({
      valor: VALOR_CONTADOR,
      efetuarParada: () => {}
    }, handler)

    return contador
  }

  atualizarTexto = ({ elementoContador, contador }) => () => { 
    const identificadorTexto = '$$contador';
    const textoPadrao = `Começando em <strong>${identificadorTexto}</strong> segundos...`
    elementoContador.innerHTML = textoPadrao.replace(identificadorTexto, contador.valor--)
  }

  agendarParadaContador({ elementoContador, idIntervalo }){
    return () => {
      clearInterval(idIntervalo)

      elementoContador.innerHTML = ""

      // if stop count, active the button
      this.desabilitarBotao(false)
    }
  }

  preperarBotao(elementoBotao, iniciarFn){
    // this get the context of ContadorComponent instace
    // Passing object methods as callbacks -> bind
    elementoBotao.addEventListener('click', iniciarFn.bind(this))

    return (valor = true) => {
      const atributo = 'disabled'

      if(valor){
        elementoBotao.setAttribute(atributo, valor)
        return 
      }

      elementoBotao.removeAttribute(atributo)
    }
  }

  inicializar(){
    console.log('Inicializou!!')
    
    // Getting html counter
    const elementoContador = document.getElementById(ID_CONTADOR)

    // if counter modify, reload it.
    const contador = this.prepararContadorProxy()

    /* 
    contador.valor = 100
    contador.valor = 90
    contador.valor = 80 
    */

    const argumentos = { 
      elementoContador,
      contador
    }

    const fn = this.atualizarTexto(argumentos)
    const idIntervalo = setInterval(fn, PERIODO_INTERVALO)

    // Variables has differents contexts if exist {} (blocks)
    {
      const elementoBotao = document.getElementById(BTN_REINICIAR)

      const desabilitarBotao = this.preperarBotao(elementoBotao, this.inicializar)
      desabilitarBotao()


      const argumentos = { elementoContador, idIntervalo}

      // This get a new context (currentContext)
      const pararContadorFn = this.agendarParadaContador.apply({ desabilitarBotao }, [argumentos])
      contador.efetuarParada = pararContadorFn
    }
  }
}

  window.ContadorComponent = ContadorComponent
})()