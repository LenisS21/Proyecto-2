function sintetizarMensaje(texto, elemento) {
  let sintetizador = window.speechSynthesis;

  mensaje = new SpeechSynthesisUtterance(texto);

  sintetizador.speak(mensaje);

  document.getElementById(elemento).focus();
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

//const barraVelocidad = document.querySelector('.velocidad');
const animacion = {
  velocidad: 1000,
  espera: 2000,
};

function rangeSlide(value){
  document.getElementById('rangeValue').innerHTML = value
  animacion.velocidad = value
  animacion.espera = value;
}

/*barraVelocidad.addEventListener('input', () => {
  const valor = barraVelocidad.value;
  rangeSlide(valor);
})*/



  const svg = d3.select("svg");

  let n=0
  let y = 250;
  
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
        const posicion = `translate(${(i + 1) * 140},${y})`;
        y -= 13;
        return posicion;
    });

  estados
    .append("circle")
    .attr("r", 0)
    .attr("fill", "lightblue")
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .transition()
    .duration(1000)
    .ease(d3.easeBounceOut)
    .attr("r", 30);

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
    let transicionesValidas = [];
    for (let i = 0; i < palabra.length; i++) {
      const transicion = grafo.transiciones.find(t => t.origen === posicionActual && t.simbolo === palabra[i]);
      if (transicion) {
        posicionActual = transicion.destino;
        transicionesValidas.push(transicion)
        
      } else {
        console.log("La palabra no es aceptada");
      }
    }console.log(transicionesValidas)
  
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
      animarTransicion(d3.select(transiciones.nodes()[0]))
      localStorage.setItem(resultado, palabra)
      sintetizarMensaje(divResultado.textContent, "resultado")
    }else{
      localStorage.setItem(resultado, palabra)
      sintetizarMensaje(divResultado.textContent, "resultado")
    }
  }

  

  
  
  