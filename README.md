# nodepop
API para manejar anuncios y usuarios

## Requisitos
- NodeJS
- MongoDB

## Instalación y arranque

Instalar la base de datos. Creará dos colecciones: `Anuncios` y `Usuarios`
```
npm run InstallDB
```

Arrancar la API
```
npm start
```
## Colecciones
Este API maneja dos colecciones: `Anuncios` y `Usuarios`. Sus esquemas son los siguientes:

- `Anuncios`:
  - nombre: `String`. Nombre del producto.
  - venta: `Boolean`. Indica si el producto se quiere vender o comprar.
  - precio: `Number`. Precio del producto.
  - foto: `String`. Url de la imagen del producto.
  - tags: `[String]`. Array de etiquetas.

- `Usuarios`:
  - nombre: `String`. Nombre del usuario.
  - email: `String`. Email del usuario. El usuario se autenticará con este email.
  - clave: `String`. Contraseña con la que el usuario se autenticará.
  
## Uso

### Registro usuario
Añade un nuevo usuario en la API. Recibe el nombre, email y clave del usuario.
```
POST /apiv1/usuarios
BODY{
  nombre: String,
  email: String,
  clave: String
}
```

### Login
```
POST /apiv1/usuarios/login
BODY{
  email: String,
  clave: String
}
```
Devuelve un token que se utilizará para autenticar al usuario en siguientes conexiones

## TOKEN
Para las peticiones con ruta desde `/apiv1/anuncios` en adelante será necesario proporcionar el TOKEN devuelto tras el login.

Este podrá proporcionarse a través de:
- Query string: `GET /apiv1/anuncios?token=mi_token`
- Header: {x-access-token: mi_token}
- Body: {token: mi_token}

### Obtener los anuncios
```
GET /apiv1/anuncios
```
Se pueden aplicar los siguientes filtros a través de la `query string`:
- `tag`: String,[String]. Cada tag va separado por comas. Ejemplo: `GET /apiv1/anuncios?tag=mobile,lifestyle`.
- `venta`: Boolean. True: anuncios en venta. False: anuncios en compra. Ejemplo: `GET /apiv1/anuncios?venta=true`.
- `nombre`: String. Obtiene los anuncios que empiecen por esta variable sin tener en cuenta las mayúsculas. Ejemplo: `GET /apiv1/anuncios?nombre=iphone`.
- `precio`:
  - [Number]-[Number]: Rango de precios a mostrar. Se puede omitir alguno de los dos manteniendo el guión para obtener los productos "a partir de un precio" o "hasta un precio". Ejemplo: `GET /apiv1/anuncios?precio=49-100` `GET /apiv1/anuncios?precio=-100` `GET /apiv1/anuncios?precio=49-`.
  - Number: Precio exacto del anuncio. Ejemplo: `GET /apiv1/anuncios?precio=49`.
- `start`: Number. Saltar los n primeros anuncios. Ejemplo: `GET /apiv1/anuncios?start=2`.
- `limit`: Number. Limitar el número de anuncios mostrados. Ejemplo: `GET /apiv1/anuncios?limit=2`.
- `sort`: String [[-]String]. Ordena según los criterios ordenados. Ejemplo `GET /apiv1/anuncios?sort=precio,-nombre`.
  - Para ordenar por varios criterios, separar estos por comas.
  - Para realizar una ordenación inversa, añadir un guión delante del criterio.

### Obtener todos los tags existentes
```
GET /apiv1/anuncios/tags
```

## Idiomas
Esta API permite obtener las respuestas es dos idiomas posibles, español e ingles. Para ello es necesario indicarlo en los parámetros de la url. Por ejemplo:
```
GET /apiv1/es/anuncios
GET /apiv1/en/anuncios?tags=mobile
```
