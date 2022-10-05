document.addEventListener('DOMContentLoaded', () => {
    // Variables

    class Productos {
        constructor(id, nombre, precio, imagen) {
            this.id = id;
            this.nombre = nombre;
            this.precio = precio;
            this.imagen = imagen;

        }
    }

    // const prod1 = new Productos(11, "Papa", 15, "./media/papa.png")
    // const prod2 = new Productos(12, "Cebolla", 20, "./media/cebolla.png")
    // const prod3 = new Productos(13, "Calabacin", 25, "./media/calabacin.png")
    // const prod4 = new Productos(4, "Fresas", 80, "./media/fresas.png")

 

    const baseDeDatos = [];


    fetch('https://fakestoreapi.com/products?limit=20')
    .then((res) => res.json())
    .then((data) => data.flatMap((info) => {
                const productos = new Productos(info.id, info.title, info.price, info.image)
                baseDeDatos.push(productos)}))


    // baseDeDatos.push(prod1, prod2, prod3, prod4)

    console.log(baseDeDatos)

    //Array Carrito
    let carrito = [];

    //Constantes
    const divisa = '$';
    const DOMitems = document.querySelector('#items');
    console.log(DOMitems)
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    console.log(DOMtotal)
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    console.log(DOMbotonVaciar)

    console.log(baseDeDatos)



 // Se usa fetch en el proyecto llamando productos de FAKE STORE
 fetch('https://fakestoreapi.com/products?limit=20')
 .then((res) => res.json())
 .then((data) => data.flatMap((info) => {
             const productos = new Productos(info.id, info.title, info.price, info.image)
             baseDeDatos.push(productos)
             console.log(baseDeDatos)

             //Aqui se muestran todos los productos a partir de la base de datos. NO es el carrito!!!!
             function crearProductos() {
                 baseDeDatos.forEach((info) => {
                     // Esta funcion genera la estructura
                     const nodo = document.createElement('div');
                     nodo.classList.add('card', 'col-md-3');

                     // Constante para crear el Body
                     const nodoCardBody = document.createElement('div');
                     nodoCardBody.classList.add('card-body');

                     // constante para añadir el titulo
                     const nodoTitulo = document.createElement('p');
                     nodoTitulo.classList.add('card-title');
                     nodoTitulo.textContent = info.nombre;

                     // Constante para la imagen
                     const nodoImagen = document.createElement('img');
                     nodoImagen.classList.add('img-fluid');
                     nodoImagen.setAttribute('src', info.imagen);

                     // Constante para agregar el Precio
                     const nodoPrecio = document.createElement('p');
                     nodoPrecio.classList.add('card-text');
                     nodoPrecio.textContent = `${divisa}${info.precio}`;

                     // Boton 
                     const nodoBoton = document.createElement('button');
                     nodoBoton.classList.add('btn', 'btn-primary');
                     nodoBoton.textContent = '+';
                     nodoBoton.setAttribute('marcador', info.id);
                     nodoBoton.addEventListener('click', anyadirProductoAlCarrito);

                     // Insertamos
                     nodoCardBody.appendChild(nodoImagen);
                     nodoCardBody.appendChild(nodoTitulo);
                     nodoCardBody.appendChild(nodoPrecio);
                     nodoCardBody.appendChild(nodoBoton);
                     nodo.appendChild(nodoCardBody);
                     DOMitems.appendChild(nodo);
                 });
             }

             //Evento para añadir un producto al carrito de la compra
             function anyadirProductoAlCarrito(evento) {
                 // Anyadimos el Nodo a nuestro carrito
                 carrito.push(evento.target.getAttribute('marcador'))
                 // Actualizamos el carrito 
                 crearCarrito();
             }

             //Dibuja todos los productos guardados en el carrito
             function crearCarrito() {
                 // Vaciamos todo el html
                 DOMcarrito.textContent = '';
                 // Quitamos los duplicados
                 const carritoSinDuplicados = [...new Set(carrito)];
                 // Se generan los nodos a partir de carrito
                 carritoSinDuplicados.forEach((item) => {

                     // jalamos el item que necesitamos de la variable base de datos
                     const miItem = baseDeDatos.filter((itemBaseDatos) => {
                         // ¿Coincide las id? Solo puede existir un caso
                         return itemBaseDatos.id === Number(item);
                     });

                     // Cuenta el número de veces que se repite el producto
                     const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                         // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                         return itemId === item ? total += 1 : total;
                     }, 0);

                     // Se crea el nodo del item del carrito
                     const miNodo = document.createElement('li');
                     miNodo.classList.add('list-group-item', 'text-right', 'mx-2');
                     miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${divisa} ${miItem[0].precio}`;

                     // Boton de borrar
                     const botonBorrar = document.createElement('button');
                     botonBorrar.classList.add('btn', 'btn-danger', 'mx-2');
                     botonBorrar.textContent = 'X';
                     botonBorrar.style.marginLeft = '1rem';
                     botonBorrar.dataset.item = item;
                     botonBorrar.addEventListener('click', borrarItemCarrito);

                     // Mezclamos nodos
                     miNodo.appendChild(botonBorrar);
                     DOMcarrito.appendChild(miNodo);
                 });
                 // Renderizamos el precio total en el HTML
                 DOMtotal.textContent = calcularTotal();
             }

             //Evento para borrar un elemento del carrito
             function borrarItemCarrito(evento) {
                 // Obtenemos el producto ID que hay en el boton pulsado
                 const id = evento.target.dataset.item;
                 // Borramos todos los productos
                 carrito = carrito.filter((carritoId) => {
                     return carritoId !== id;
                 });
                 // volvemos a renderizar
                 crearCarrito();
             }

             //Calcula el precio total teniendo en cuenta los productos repetidos
             function calcularTotal() {
                 // Recorremos el array del carrito 
                 return carrito.reduce((total, item) => {
                     // De cada elemento obtenemos su precio
                     const miItem = baseDeDatos.filter((itemBaseDatos) => {
                         return itemBaseDatos.id === Number(item);
                     });
                     // Los sumamos al total
                     return total + miItem[0].precio;
                 }, 0).toFixed(2);
             }

             //Varia el carrito y vuelve a dibujarlo
             function vaciarCarrito() {
                 // Limpiamos los productos guardados
                 carrito = [];
                 // Renderizamos los cambios
                 crearCarrito();
             }

             // Eventos
             DOMbotonVaciar.addEventListener('click', vaciarCarrito);

             // Inicio
             crearProductos();
             crearCarrito();

         }

     )

 )
});

const toggleBtn = document.querySelector('.sidebar-toggle')
const closeBtn = document.querySelector('.close-btn')
const sidebar = document.querySelector('.sidebar')

toggleBtn.addEventListener('click', function () {
    console.log(sidebar.classList);
    sidebar.classList.toggle("show-sidebar")
})

closeBtn.addEventListener('click', function () {
    sidebar.classList.remove('show-sidebar')
})