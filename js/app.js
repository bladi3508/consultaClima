//Selectores
const contenedor = document.querySelector('.contenedor-clima');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

//Cargar eventos cuando el archivo se termine de cargar
document.addEventListener('DOMContentLoaded', function(){
    //Darle un evento al formulario
    formulario.addEventListener('submit', buscarClima);
});


//Funciones
function buscarClima(e){
    //Prevenir la funcion default del formulario
    e.preventDefault();

    //Obtener valores de los campos
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    //validar que los campos no se encuentren vacios
    if(ciudad.trim() === '' || pais.trim() === ''){
        //Mostrar mensaje de error
        alerta('Todos los campos son obligatorios');
        return;
    }

    //Consultar a la API
    consultarAPI(ciudad, pais);
}

function consultarAPI(ciudad, pais){
    //Definir la API key
    const API_KEY = '1546eda21f1b8339bb103f429d520eaa';

    //Definir la URL
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${API_KEY}`;

    spinner()

    //Utilizar fetch
    fetch(URL)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if(datos.cod === "404"){
                alerta('Ciudad no encontrada');
                return;
            }

            setTimeout(() => {
                limpiarHTML();

                mostrarClima(datos);
            }, 3000);
        })
}

function mostrarClima(datos){

    console.log(datos)

    const iconoClima = datos.weather[0].icon;
    //Obtener las vareables
    const { name, main: {temp, temp_max, temp_min} } = datos;

    //Datos Convertidos a centigrados
    const temperatura = temp - 273.15;
    const temperaturaMaxima = temp_max - 273.15;
    const temperaturaMinima = temp_min - 273.15;

    //Crear elementos HTML
    const nombre = document.createElement('H3');
    nombre.classList.add('fw-bold', 'mb-3', 'text-light');
    nombre.textContent = name;

    const icono = document.createElement('IMG');
    icono.classList.add('img-fluid');
    icono.src = `https://openweathermap.org/img/wn/${iconoClima}@2x.png`;

    const climaActual = document.createElement('P');
    climaActual.innerHTML = `Temperatura actual: ${temperatura.toFixed()} &#8451;`;
    climaActual.classList.add('fw-bold', 'my-3', 'text-white', 'fs-2');

    const climaMax = document.createElement('P');
    climaMax.innerHTML = `Maxima: ${temperaturaMaxima.toFixed()} &#8451;`;
    climaMax.classList.add('mb-3', 'text-white', 'fs-4');

    const climaMin = document.createElement('P');
    climaMin.innerHTML = `Minima: ${temperaturaMinima.toFixed()} &#8451;`;
    climaMin.classList.add( 'mb-3', 'text-white', 'fs-4');

    resultado.appendChild(nombre);
    resultado.appendChild(icono);
    resultado.appendChild(climaActual);
    resultado.appendChild(climaMax);
    resultado.appendChild(climaMin);
}


//Helpers
function alerta(mensaje){
    //Crear la alerta
    const alerta = document.createElement('DIV');
    alerta.role = 'alert';
    alerta.classList.add('alert', 'alert-danger', 'alert-dismissible', 'd-flex', 'align-items-center', 'fade', 'show');
    
    alerta.innerHTML = `
        <i class="bi bi-exclamation-circle-fill me-2"></i>
        <div>
            ${mensaje}
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    //Validar si no hay una alerta previa
    const alertaPrevia = document.querySelector('.alert');
    alertaPrevia?.remove();

    //Inyectar en el HTML
    contenedor.insertBefore(alerta, formulario);
}

function spinner(){
    limpiarHTML();

    //Crear el div del Spinner
    const divSpinner = document.createElement('DIV');

    divSpinner.innerHTML = `
        <div class="text-center">
            <div class="spinner-grow text-light" style="width: 6rem; height: 6rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;

    resultado.appendChild(divSpinner);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}