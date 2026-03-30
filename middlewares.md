1) auth
    Objetivo: Proteger todas las rutas que requieran autenticación
    -agregar en todas las rutas el middleware 'verificarToken'
    -Manejar casos de token expirado, inválido o ausente
    -Aplicar a nivel de router o ruta específica según necesidad
2) restricciones de entrada
    Objetivo: Validar y normalizar datos antes de procesarlos, Crear middlewares específicos para validar y normalizar datos según la ruta/entidad
    Estructura propuesta
    middleware/
        validations/
            ├── curso.validator.js     
            ├── persona.validator.js   
            ├── usuario.validator.js
            ├── aula.validator.js
            ├── nota.validator.js
            ├── asistencia.validator.js
            └── index.js 
            .....
    -crea midlewares para validar los datos de entrada, al ingresar convierte todos los datos en minusculas a esepcion de la contraseña
    ejemplo 1
    |nombre         |aprobacion|
    -------------------
    |1ro A          |falso     |
    |priero a       |falso     |
    |2do A          |falso     |
    ejemplo 2
    | ci profesor       |aprobacion|
    | o alumno          |          |
    ---------------------------------
    |123                | falso    |
    |8817891            | verdadero|
    |8817891q           |falso     |
    -Cédulas: Solo números, longitud específica según país
    -Rechazar datos que no cumplan el formato esperado
3) valores unicos
    Objetivo: Garantizar integridad de datos en la BD
    -el ci_estudiante, ci_docente, id_usuario son valores unicos, no se pueden repetir.
    Implementación:
    -Validar antes de insertar/actualizar
    -Manejar errores de duplicados elegantemente
    -Considerar validación a nivel BD y aplicación

4) paginaciones en el backend
    Objetivo: Optimizar consultas y rendimiento, backend y frontend

    Parámetros a implementar:
    -page - Número de página actual
    -limit - Registros por página
    -offset - Calculado: (page - 1) * limit
    Respuesta debe incluir:
    -Datos de la página actual
    -Total de registros
    -Total de páginas
    -Página actual
    -Enlaces a siguiente/anterior si existen
5) session
    Objetivo: Manejar expiración de sesión

    Flujo a implementar:

    Interceptar respuesta 401 del backend

    Verificar si es por token expirado

    Redirigir automáticamente al login

    Limpiar datos de sesión local

    Opcional: Implementar refresh tokens
