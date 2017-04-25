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

## Uso

### Obtener los anuncios
```
GET /apiv1/anuncios
```
Se pueden aplicar los siguientes filtros a través de la `query string`:
- `tag`: String,[String]. Cada tag va separado por comas. Ejemplo: `GET /apiv1/anuncios?tag=mobile,lifestyle`
- `venta`: Boolean. True: anuncios en venta. False: anuncios en compra. Ejemplo: `GET /apiv1/anuncios?venta=true`
- `precio`:
  - [Number]-[Number]: Rango de precios a mostrar. Se puede omitir alguno de los dos manteniendo el guión para obtener los productos "a partir de un precio" o "hasta un precio". Ejemplo: `GET /apiv1/anuncios?precio=49-100` `GET /apiv1/anuncios?precio=-100` `GET /apiv1/anuncios?precio=49-`
  - Number: Precio exacto del anuncio. Ejemplo: `GET /apiv1/anuncios?precio=49`
- `start`: Number. Saltar los n primeros anuncios. Ejemplo: `GET /apiv1/anuncios?start=2`
- `limit`: Number. Limitar el número de anuncios mostrados. Ejemplo: `GET /apiv1/anuncios?limit=2`
- `sort`: String [[-]String]. Ordena según los criterios ordenados. Ejemplo `GET /apiv1/anuncios?sort=precio,-nombre`
  - Para ordenar por varios criterios, separar estos por comas.
  - Para realizar una ordenación inversa, añadir un guión delante del criterio.
