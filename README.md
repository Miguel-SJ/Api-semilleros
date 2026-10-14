## Historias de Usuario

| N.º | Historia de Usuario | Funcionalidad | Endpoint y Método HTTP | Resultado Esperado |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **HU #0001:** Registrar estudiante | Crear usuario estudiante con perfil académico | `POST /api/usuarios/estudiantes` | `201 Created` con el JSON del estudiante creado y su `_id` |
| **2** | **HU #0002:** Registrar docente | Crear usuario docente con horarios de asesoría | `POST /api/usuarios/docentes` | `201 Created` con la información del docente persistida |
| **3** | **HU #0003:** Crear semillero | Registrar grupo asociando área y líneas de investigación | `POST /api/semilleros` | `201 Created` con los datos del semillero registrado |
| **4** | **HU #0004:** Editar semillero | Modificar datos e información general del semillero | `PUT /api/semilleros/:id` | `200 OK` con el documento JSON actualizado del semillero |
| **5** | **HU #0005:** Cambiar docente líder | Actualizar el docente líder asignado a un semillero | `PATCH /api/semilleros/:id/cambiar-lider` | `200 OK` validando rol docente o `400 Bad Request` |
| **6** | **HU #0006:** Consultar semilleros | Buscar semilleros cruzando los datos del líder | `GET /api/semilleros/detalles` | `200 OK` con el listado JSON y los datos del líder (`populate`) |
| **7** | **HU #0007:** Registrar proyecto | Registrar proyecto de investigación e integrantes | `POST /api/proyectos` | `201 Created` validando la existencia previa de los integrantes |
| **8** | **HU #0008:** Publicar capacitación | Publicar evento con cupo y lista de inscritos inicializada | `POST /api/publicaciones` | `201 Created` con la publicación registrada en la base de datos |
| **9** | **HU #0009:** Inscribir estudiante | Agregar ID del estudiante al arreglo de inscritos | `PUT /api/publicaciones/:id/inscribir` | `200 OK` ($push) o `409 Conflict` si se supera el cupo máximo |
| **10**| **HU #0010:** Reporte carga docente | Generar reporte agregando cantidad de proyectos por asesor | `GET /api/reportes/carga-docentes` | `200 OK` con el ranking ordenado por carga ($group,$sum) |
