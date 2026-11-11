## Historias de usuario

| N.º | Historia de usuario | Funcionalidad | Endpoint y http | Resultado |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **HU #0001:** Registrar estudiante | Crear usuario estudiante validando campos obligatorios | `POST /api/usuarios/estudiantes` | `201 Created` al guardar o `400 Bad Request` si faltan datos obligatorios |
| **2** | **HU #0002:** Registrar docente | Crear usuario docente con horarios de atención | `POST /api/usuarios/docentes` | `201 Created` con la información del docente |
| **3** | **HU #0003:** Crear semillero | Registrar grupo asociado al área y sus líneas de investigación | `POST /api/semilleros` | `201 Created` con los datos del semillero registrado |
| **4** | **HU #0004:** Editar semillero | Modificar datos e información general del semillero | `PUT /api/semilleros/:id` | `200 OK` con el documento actualizado o `404 Not Found` si el `_id` no existe |
| **5** | **HU #0005:** Cambiar docente líder | Actualizar el docente líder asignado a un semillero | `PATCH /api/semilleros/:id/cambiar-lider` | `200 OK` al actualizar o `400 Bad Request` si el usuario no tiene rol docente |
| **6** | **HU #0006:** Consultar semilleros | Buscar semilleros según la facultad o área estudiada | `GET /api/semilleros/detalles` | `200 OK` con el listado (`populate`) o `404 Not Found` si no hay coincidencias |
| **7** | **HU #0007:** Registrar proyecto | Registrar proyecto validando la existencia de integrantes | `POST /api/proyectos` | `201 Created` al registrar o `400 Bad Request` si un integrante no existe |
| **8** | **HU #0008:** Publicar capacitación | Publicar evento de capacitación vinculado a un semillero | `POST /api/publicaciones` | `201 Created` con la publicación registrada en la base de datos |
| **9** | **HU #0009:** Inscribir estudiante | Agregar estudiante al arreglo de inscritos de un evento | `PUT /api/publicaciones/:id/inscribir` | `200 OK` ($push), `404 Not Found` si no existe o `409 Conflict` por cupo |
| **10**| **HU #0010:** Reporte proyectos docente | Generar reporte con la cantidad de proyectos por asesor | `GET /api/reportes/carga-docentes` | `200 OK` con el ranking ($group,$sum) o `404 Not Found` si no hay datos |
