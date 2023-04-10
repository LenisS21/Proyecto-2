function sintetizarMensaje() {
    // crea un objeto del sintetizador de voz
    let sintetizador = window.speechSynthesis;
  
    // crea un mensaje de voz
    let mensaje = new SpeechSynthesisUtterance("Palabra validada");
  
    // sintetiza el mensaje de voz
    sintetizador.speak(mensaje);
}

const grafo = {
  estados: ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7"],
  alfabeto: ["a", "b"],
  transiciones: [
    { origen: "q0", destino: "q1", simbolo: "a" },
    { origen: "q1", destino: "q2", simbolo: "a" },
    { origen: "q1", destino: "q2", simbolo: "b" },
    { origen: "q2", destino: "q3", simbolo: "a" },
    { origen: "q3", destino: "q4", simbolo: "a" },
    { origen: "q3", destino: "q4", simbolo: "b" },
    { origen: "q4", destino: "q5", simbolo: "a" },
    { origen: "q5", destino: "q6", simbolo: "a" },
    { origen: "q5", destino: "q6", simbolo: "b" },
    { origen: "q6", destino: "q7", simbolo: "a" },
  ],
  estadoInicial: "q0",
  estadoAceptacion: ["q7"],
};

/*const animacion = {
  velocidad: 500, // en milisegundos
  espera: 500, // en milisegundos
};*/
const barraVelocidad = document.querySelector('.velocidad');
const animacion = {
  velocidad: 1000, // en milisegundos
  espera: 2000, // en milisegundos
};

barraVelocidad.addEventListener('input', () => {
  const valor = barraVelocidad.value;
  animacion.velocidad = valor;
  animacion.espera = valor;
})

  const svg = d3.select("svg");

  let n=0
  let y = 250; // variable para la posición vertical de los estados
  
  let numTransiciones = 0;
  const transiciones = svg
    .selectAll(".transicion")
    .data(grafo.transiciones)
    .enter()
    .append("g")
    .attr("class", "transicion")
    .attr("transform", (d, i) => {
      const x1 = (grafo.estados.indexOf(d.origen)+1) * 140;
      const x2 = (grafo.estados.indexOf(d.destino) + 2) * 140;
      const y = 250 - numTransiciones * 10;
      numTransiciones++;
      
      return `translate(${x1},${y})`;
    });

  const estados = svg
    .selectAll(".estado")
    .data(grafo.estados)
    .enter()
    .append("g")
    .attr("class", "estado")
    .attr("transform", (d, i) => {
        const posicion = `translate(${(i + 1) * 140},${y})`; // posición horizontal fija en 150
        y -= 13; // aumentar en 10 la posición vertical
        return posicion;
    });

  estados
    .append("circle")
    .attr("r", 0) // Inicialmente, el radio del círculo es cero
    .attr("fill", "lightblue")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .transition() // Inicia la transición
    .duration(1000) // Duración de la transición en milisegundos
    .ease(d3.easeBounceOut) // Función de interpolación
    .attr("r", 30); // El radio final del círculo es 30

  estados
    .append("text")
    .attr("text-anchor", "middle")
    .attr("y", 7)
    .text((d) => d);

  svg.append("defs")
    .append("marker")
    .attr("id", "flecha")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 10)
    .attr("refY", 5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z")
    .attr("fill", "black");

  transiciones
    .append("path")
    .attr("d", (d) => {
      const x1 = (grafo.estados.indexOf(d.origen) + 1) * 110;
      const x2 = (grafo.estados.indexOf(d.destino) + 1) * 110;
      const y = 150;
      const dx = x2 - x1;
      const path = d3.line()([[0, 0], [dx, -6]]);
    return path;
  })
  .attr("marker-end", "url(#flecha)");

  transiciones
    .append("text")
    .attr("x", (d) => {
      const x2 = (grafo.estados.indexOf(d.destino) - grafo.estados.indexOf(d.origen)) * 140;
      return x2 / 2;
    })
    .attr("y", -5)
    .text((d) => d.simbolo)
    .attr("text-anchor", "middle");

  // Creamos los círculos que representan los estados de aceptación
  const estadoAceptacion = svg.selectAll(".estadoAceptacion")
    .data(grafo.estadoAceptacion)
    .enter()
    .append("circle")
    .attr("class", "estadoAceptacion")
    .attr("cx", (d) => (grafo.estados.indexOf(d) + 1) * 140)
    .attr("cy", 159)
    .attr("r", 25)
    .attr("fill-opacity", 0)
    .attr("fill", "white")
    .attr("stroke", "red");

  let transicionesValidas = [];

function validarPalabra(palabra) {
    let posicionActual = grafo.estados[0]
    transicionesValidas = [];
    // Recorremos la palabra y actualizamos la posición actual en función de las transiciones del grafo
    for (let i = 0; i < palabra.length; i++) {
      // Buscamos la transición que corresponde a la letra actual y el estado actual
      const transicion = grafo.transiciones.find(t => t.origen === posicionActual && t.simbolo === palabra[i]);
      if (transicion) {
        // Actualizamos la posición actual al estado destino de la transición
        posicionActual = transicion.destino;
        transicionesValidas.push(transicion)
        
      } else {
        // Si no hay una transición para la letra actual y el estado actual, la palabra no es aceptada
        console.log("La palabra no es aceptada");
        
      }
    }console.log(transicionesValidas)
  
    // Si la posición actual es un estado de aceptación, la palabra es aceptada
    if (grafo.estadoAceptacion.includes(posicionActual)) {
      console.log("La palabra es aceptada");
      return "Palabra aceptada";
    } else {
      console.log("La palabra no es aceptada");
      
      return "Palabra rechazada";
    }
  }
  
function animarTransicion(transicion) {
    transicion.style("stroke", "red");
  
  // Esperar el tiempo de espera definido
    setTimeout(() => {
    transicion.style("stroke", "black");
    
      // Si hay más transiciones, continuar la animación
      if (transiciones.nodes().indexOf(transicion.node()) < transiciones.nodes().length - 1) {
        animarTransicion(d3.select(transiciones.nodes()[transiciones.nodes().indexOf(transicion.node()) + 1]));
      }
  },animacion.espera);   
}

function validar() {
    const palabra = document.getElementById("palabra").value;
    const resultado = validarPalabra(palabra);
    const divResultado = document.getElementById("resultado");
    divResultado.innerHTML = resultado;

    if(resultado == "Palabra aceptada"){
      console.log("good")
      animarTransicion(d3.selectAll(transiciones.nodes()[0]))
    }else{
      console.log("mal")
    }
  }


  
  
  