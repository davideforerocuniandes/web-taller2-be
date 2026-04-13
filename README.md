### David Elias Forero Cobos - 202310499 - de.foreroc1@uniandes.edu.co

# NestJS Workshop – Respuestas

## Preguntas — Activity 1 (GUIDE.md)

### 1. What happens if you send a POST to `/products` with `price: -5`? Why?

Te devuelve un 400 Bad Request. Básicamente el `ValidationPipe` revisa el body contra el `CreateProductDto` antes de que llegue al controlador, y como `price` tiene `@IsPositive()`, un valor negativo no pasa. El producto nunca se crea porque el servicio ni se entera del request.

### 2. What is the role of `ParseIntPipe` in `@Param('id', ParseIntPipe)`?

Los parámetros de ruta siempre llegan como strings. O sea, si haces `GET /products/42`, el `id` que recibe el método es `"42"` (string), no `42` (número). `ParseIntPipe` lo convierte a entero, y si no puede (tipo `GET /products/abc`), tira un 400 directo sin ejecutar nada del controlador. Sin esto, `id` llegaría como string y las comparaciones con `===` contra los IDs numéricos del array nunca matchearían.

### 3. What would happen without `@IsNotEmpty()` on `name`?

Podrías crear un producto con nombre vacío (`"name": ""`). `@IsString()` solo checa que sea un string, no le importa si está vacío. Necesitas los dos decoradores juntos: uno para el tipo y otro para que tenga contenido.

### 4. Why does the service throw `NotFoundException` instead of returning `null`?

Porque `findOne` se usa también dentro de `update` y `remove`. Si retornara `null`, tendrías que poner un `if (!product)` en cada lugar que lo llame, y si te olvidas de uno terminas con un `Cannot read properties of null` que es horrible de debuggear. Tirando `NotFoundException` directo, la lógica de "no encontrado = 404" queda centralizada y no hay que pensar en eso en cada caller.

### 5. What is the difference between `@Get()` and `@Get(':id')`?

`@Get()` responde solo a `GET /products` exacto. `@Get(':id')` responde a `GET /products/lo-que-sea`, donde `:id` es un parámetro dinámico que captura ese segmento de la URL. Si llega `GET /products`, usa el primero; si llega `GET /products/5`, usa el segundo. NestJS los distingue por la estructura de la ruta.

## Preguntas — Validation Questions (TASKS.md)

## Q1 — Dead route diagnosis

Da un 404. Si `findAll()` no tiene ningún decorador de ruta (`@Get()`, `@Post()`, etc.), NestJS simplemente no lo registra como endpoint. Para el router esa ruta no existe, así que cuando llega el request no encuentra nada y devuelve 404. No es un 500 porque el servidor levantó bien, solo que no sabe que esa ruta debería existir. La solución es ponerle `@Get()` al método.

## Q2 — When `transform: true` is not enough

No son lo mismo. `transform: true` en el `ValidationPipe` convierte tipos automáticamente pero está pensado más para el body y DTOs. Con parámetros de ruta no es tan estricto — por ejemplo `"3.7"` podría pasar como `3.7` sin error, o `"abc"` como `NaN`.

`ParseIntPipe` es más específico y estricto: si no es un entero válido, 400 de una. Para IDs en la URL es mejor usar `ParseIntPipe` porque te da la garantía de que solo pasan enteros.

## Q3 — Silent strip vs hard rejection

Con solo `whitelist: true` (sin `forbidNonWhitelisted`), el request pasa y te da un 201 Created, pero el campo `"password"` desaparece silenciosamente. El `ValidationPipe` lo quita antes de que llegue al servicio porque no está en el DTO.

El tema es que el cliente recibe un 201 como si todo estuviera perfecto, sin ningún aviso de que mandó un campo de más. Eso puede esconder intentos de inyectar campos tipo `role: "admin"` y hace más difícil cachar errores en desarrollo porque la API no se queja.

Con `forbidNonWhitelisted: true` te tira un 400 diciendo qué campo sobra. Mejor que falle ruidosamente.

## Q4 — Mutation side-effect

Sí, modificar lo que devuelve `findAll()` cambia el dato dentro del servicio. `findAll()` retorna `this.products` directamente, que es la referencia al array interno. Los objetos ahí son los mismos en memoria, entonces si haces `result[0].price = 0` estás tocando el mismo objeto que tiene el servicio.

Para evitarlo podrías devolver copias: `return this.products.map(p => ({ ...p }))`. Así nadie de afuera puede modificar el estado interno por accidente.

## Q5 — The optional field trap

`{"price": -50}` falla con 400. `@IsOptional()` solo aplica cuando el campo no viene. Como acá `price` sí está presente, se evalúan todas las reglas y `-50` no pasa `@IsPositive()`.

`{}` pasa sin problema con 200. `price` no viene, entonces `@IsOptional()` hace que se salten las validaciones de ese campo.

La regla es: si el valor es `undefined` o `null`, se ignoran las demás validaciones. Si viene con cualquier valor, tiene que ser válido. "Opcional" no quiere decir que acepta cualquier cosa, quiere decir que acepta que no esté.

## Q6 — ID reuse after deletion

El nuevo ID es 4. `nextId` es un contador que solo sube (`this.nextId++`), borrar tareas no lo afecta. Así siempre genera IDs únicos.

Si en vez de eso usaras `this.tasks.length + 1` como ID, tendrías problemas. Tipo:

1. Arrancas con `[id:1, id:2, id:3]`, length = 3
2. Creas tarea: `length + 1 = 4`, nueva con id 4. Array: `[1, 2, 3, 4]`
3. Borras id 2. Array: `[1, 3, 4]`, length = 3
4. Creas otra: `length + 1 = 4` → id 4 de nuevo

Ahí ya tienes dos tareas con el mismo id y `findOne(4)` devuelve la primera que encuentra. Dato corrompido.

## Q7 — Module forgotten

a) El servidor arranca normal, sin errores ni warnings. NestJS simplemente no sabe que `UsersModule` existe.

b) `POST /users` da 404 porque las rutas del módulo nunca se registraron.

Es un error bastante molesto porque no falla al compilar ni al arrancar. Solo te das cuenta cuando intentas usar las rutas y no funcionan. No hay ninguna señal de alerta hasta que alguien lo prueba.

## Q8 — Missing 201

Un `@Post()` sin `@HttpCode()` devuelve 200, no 201. Técnicamente el recurso se crea igual, pero puede romper tests que esperan 201, SDKs que usan el status code para saber si se creó algo, o el contrato de una spec de OpenAPI/Swagger que diga 201.

## Q9 — Service throws, not returns null

Si `findOne` retornara `null`, el código sería algo así:

```typescript
// Servicio
findOne(id: number): Product | null {
  return this.products.find((p) => p.id === id) ?? null;
}

// Controlador
findOne(@Param('id', ParseIntPipe) id: number) {
  const product = this.productsService.findOne(id);
  if (!product) {
    throw new NotFoundException(`Product #${id} not found`);
  }
  return product;
}
```

El problema es que ese chequeo de `null` lo tienes que repetir en todos lados que llamen a `findOne` (en este proyecto también lo usan `update` y `remove`). Si te falta uno, en vez de un 404 limpio te sale un `Cannot read properties of null` que cuesta más debuggear. Tirando la excepción desde el servicio te ahorras todo eso.
