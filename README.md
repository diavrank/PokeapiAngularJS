# Poke API
**Por Iván Cabrera**

## Descripción

Aplicación Front-end con framework de Angular JS para consumir la [PokeAPI](https://pokeapi.co/) .

En esta aplicación se hace uso del plugin de [angular-datatables](https://l-lin.github.io/angular-datatables/archives/#!/welcome)
, el cual es un componente que ya viene con varias operaciones (listar, organizar, ordenar, filtrar, entre otras) 
para gestionar la información de una tabla. Este plugin esta basado (como su nombre lo indica) en el famoso plugin de 
[datatables.net](https://datatables.net/).

Existen dos maneras de procesamiento de la información de una tabla:

- **Client-Side Processing:** Esta es la manera fácil, ya que solo se consulta un endpoint del API que regrese
toda la información que se desea visualizar en la tabla y entonces todas la operaciones (buscar, ordenar, filtrar,etc) 
para gestionar la información se realizan del lado del cliente. **OJO:** No se recomienda utilizar este método para grandes
cantidades de datos ya que esto puede ocasionar cuellos de botella que afecten considerablemente los tiempos de respuesta.
La cantidad de datos para determinarla como grande dependerá de los recursos que se cuenten en el servidor de base de datos 
y del servidor de aplicaciones.

- **Server-Side Processing:** Esta es la manera en la que se optimizan los recursos, ya que la paginación y demás operaciones
se realizan de lado del servidor. Hay que tomar en cuenta que por defecto el plugin de **angular-datatables** viene 
configurado para enviar ciertos parametros al API para realizar la operaciones de paginación, busqueda, ordenamiento,etc.
En este PROYECTO veremos como configurar el componente de **angular-datatables** para que funcione con API's personalizadas,
es decir, enviando y recibiendo parametros extras a los que viene configurado por defecto el componente, sin importar si
los endpoints del API vengan como POST o GET. 

**Nota:** Se puede implementar si asi se desea un mecanismo que contemple los 2 mecanismos de procesamiento de la
información dependiendo la cantidad de datos que se tenga, sin embargo, esto se debe contemplar con un endpoint extra 
en el API.

Sistemas operativos
-------------------

- macOS 10.12+
- Linux
- Windows 10

Requisitos del sistema
-------------------

- Node 10+ [descargar aqui](https://nodejs.org/es/download/)
- Yarn 1.16.0+

Para instalar yarn, ejecutar el siguiente comando:
```shell
npm i -g yarn
```
**Nota:** Recuerde abrir otra terminal nueva para el proyecto despues de instalar yarn.

## Instalación

- Clonar el repositorio [aqui](https://github.com/diavrank/PokeapiAngularJS)

**Instalando dependencias**

- Ejecutar el siguiente comando para instalar las dependencias:
```shell
yarn
```
Ejecutar el proyecto
---------------

Ejecutar el siguiente comando:

```shell
ws
```
Despues abrir el navegador (Chrome o Firefox) en la siguiente dirección:

http://127.0.0.1:8000/app/views/layouts/lytIndex.html