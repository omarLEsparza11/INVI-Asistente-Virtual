# INVI - Asistente Virtual Inteligente

INVI es un asistente virtual integrado en la plataforma web de AGS:EI e INVESTEL.
Su objetivo es orientar a los usuarios, responder consultas relacionadas con la
organización y facilitar el acceso a la información disponible en el sitio web.

El sistema cuenta con respuestas locales y también puede conectarse con Gemini
para generar respuestas mediante inteligencia artificial.

## Funcionalidades

Esta versión incluye:

- Chat funcional con envío mediante botón y tecla Enter.
- Integración del avatar virtual INVI.
- Indicador animado "INVI está escribiendo".
- Efecto de escritura progresiva en las respuestas.
- Bloqueo temporal del campo mientras INVI responde.
- Historial durante la sesión del navegador.
- Botón para limpiar la conversación.
- Scroll automático al mensaje más reciente.
- Navegación hacia determinadas secciones de la página.
- Respuestas locales sobre AGS:EI, INVESTEL, servicios, proyectos, contacto,
  ubicación, horarios, innovación, vinculación y clubes de ciencia.
- Conexión con Gemini mediante un servidor desarrollado con Node.js.
- Respaldo automático mediante respuestas locales cuando Gemini no está
  configurado o no se encuentra disponible.
- Interfaz adaptable a computadoras y dispositivos móviles.
- Modo oscuro automático según la configuración del sistema operativo.
- Opción para ampliar la ventana de INVI y facilitar la lectura de respuestas
  extensas.

---

# Funcionamiento general

El sistema está dividido principalmente en dos partes: frontend y backend.

El frontend corresponde a la página web y a la interfaz visual de INVI. Se
encarga de mostrar el avatar, recibir las preguntas del usuario y presentar
las respuestas.

El backend se ejecuta mediante Node.js y se encarga de recibir las consultas
del frontend, comunicarse con Gemini y regresar la respuesta generada.

El flujo general es:

Usuario
→ Interfaz de INVI
→ JavaScript
→ Servidor Node.js
→ Gemini
→ Servidor Node.js
→ Interfaz de INVI
→ Usuario

Si Gemini no se encuentra disponible, el sistema utiliza las respuestas
locales definidas en JavaScript como mecanismo de respaldo.

---

# Archivos principales del proyecto

## index.html

Es el archivo principal de la página web.

Contiene la estructura HTML de la plataforma de AGS:EI e INVESTEL y también
la estructura de la interfaz de INVI.

Dentro de este archivo se encuentran elementos como:

- Encabezado de INVI.
- Avatar.
- Área donde aparecen los mensajes.
- Preguntas rápidas.
- Campo para escribir.
- Botón de envío.
- Botón para cerrar el chat.
- Botón para ampliar o reducir la ventana del asistente.

También carga los archivos CSS y JavaScript necesarios para el funcionamiento
del sistema.

---

## assets/css/main.css

Contiene los estilos generales de la página web.

Controla aspectos como:

- Colores.
- Tipografías.
- Secciones.
- Menús.
- Botones.
- Tarjetas.
- Diseño responsivo.
- Apariencia general de la plataforma.

También contiene los estilos de modo oscuro para que la página pueda adaptarse
automáticamente a la configuración del sistema operativo del usuario mediante
`prefers-color-scheme`.

---

## assets/css/invi.css

Contiene específicamente los estilos visuales del asistente INVI.

Controla elementos como:

- Tamaño y posición del avatar.
- Ventana del chat.
- Encabezado.
- Mensajes del usuario.
- Mensajes de INVI.
- Campo de texto.
- Botón de envío.
- Preguntas rápidas.
- Indicador "INVI está escribiendo".
- Animaciones.
- Diseño para dispositivos móviles.
- Modo oscuro del asistente.
- Vista normal y vista ampliada del chat.

Este archivo permite modificar el diseño de INVI sin afectar directamente
los estilos principales de la página.

---

## assets/js/invi.js

Contiene la lógica del asistente virtual en el navegador.

Este archivo se encarga de:

- Abrir y cerrar INVI.
- Expandir y reducir la ventana del chat.
- Recibir los mensajes escritos por el usuario.
- Enviar consultas al servidor.
- Mostrar las respuestas.
- Mostrar la animación "INVI está escribiendo".
- Generar el efecto de escritura progresiva.
- Administrar las preguntas rápidas.
- Mantener el historial de la conversación durante la sesión.
- Limpiar la conversación.
- Realizar scroll automático.
- Navegar hacia secciones de la página.
- Utilizar respuestas locales cuando Gemini no está disponible.

Las respuestas locales permiten que algunas funciones básicas de INVI
continúen disponibles incluso cuando no existe conexión con la inteligencia
artificial.

---

## server.js

Es el archivo principal del backend.

Se ejecuta mediante Node.js y Express.

Su función es crear el servidor que permite la comunicación entre la página
web y Gemini.

Cuando el usuario escribe una pregunta, `invi.js` realiza una solicitud a:

`/api/chat`

El servidor recibe la consulta, agrega las instrucciones que definen el
comportamiento de INVI y envía la información al modelo de Gemini.

Posteriormente recibe la respuesta generada y la devuelve al navegador para
que pueda mostrarse dentro del chat.

Este archivo también contiene las instrucciones que establecen que INVI debe
comportarse como un asistente virtual de AGS:EI e INVESTEL.

---

## .env

Este archivo almacena variables de configuración privadas del proyecto.

Por ejemplo:

`GEMINI_API_KEY`

Aquí se guarda la clave necesaria para utilizar Gemini.

La clave se mantiene en el servidor y no se coloca directamente dentro del
código JavaScript que ejecuta el navegador.

También puede contener la configuración del modelo utilizado.

IMPORTANTE: este archivo no debe compartirse públicamente ni subirse a
repositorios públicos cuando contiene claves reales.

---

## .env.example

Funciona como ejemplo de configuración.

Muestra qué variables necesita el proyecto, pero no contiene la clave privada
real.

Permite que otra persona pueda configurar el proyecto creando su propio
archivo `.env`.

---

## package.json

Contiene la configuración del proyecto Node.js.

Define:

- Nombre del proyecto.
- Versión.
- Dependencias utilizadas.
- Scripts disponibles.
- Configuración necesaria para ejecutar el servidor.

Entre las dependencias principales se encuentran Express, dotenv y la
biblioteca utilizada para comunicarse con Gemini.

También permite iniciar el proyecto mediante:

`npm start`

---

## package-lock.json

Es generado automáticamente por npm.

Registra las versiones exactas de las dependencias instaladas para que el
proyecto pueda utilizar las mismas versiones cuando se instale nuevamente
en otra computadora.

Normalmente no es necesario modificarlo manualmente.

---

## node_modules

Esta carpeta contiene las librerías y dependencias instaladas mediante npm.

Se genera al ejecutar:

`npm install`

Aquí se encuentran Express, las librerías necesarias para Gemini y las demás
dependencias utilizadas por el servidor.

No contiene código desarrollado específicamente para INVI y puede volver a
generarse utilizando `package.json`.

---

## assets/img/invi-avatar.png

Contiene la imagen utilizada para representar visualmente a INVI.

El avatar aparece tanto en el botón flotante de la página como dentro del
encabezado de la ventana del asistente.

Su objetivo es proporcionar una identidad visual al sistema y hacer que la
interacción sea más amigable para el usuario.

---

# ¿Cómo funciona una consulta?

Cuando un usuario escribe una pregunta ocurre el siguiente proceso:

1. El usuario escribe una consulta dentro de INVI.

2. `invi.js` captura el mensaje.

3. JavaScript envía la consulta mediante una petición HTTP al endpoint
   `/api/chat`.

4. `server.js` recibe la consulta.

5. El servidor utiliza la configuración almacenada en `.env` para establecer
   la comunicación con Gemini.

6. Gemini procesa la consulta tomando en cuenta las instrucciones definidas
   para INVI.

7. Gemini genera una respuesta.

8. `server.js` devuelve la respuesta al navegador.

9. `invi.js` recibe el resultado.

10. La respuesta aparece dentro de la ventana de INVI mediante el efecto de
    escritura.

Si ocurre un problema durante la comunicación con Gemini, `invi.js` utiliza
el sistema de respuestas locales cuando existe información disponible para
la consulta.

---

# Probar sin Gemini

Para probar únicamente la interfaz y las respuestas locales se puede abrir
`index.html` mediante Live Server.

En este modo no es necesario utilizar una clave de Gemini.

---

# Activar Gemini

1. Abrir una terminal dentro de la carpeta del proyecto.

2. Instalar las dependencias:

   npm install

3. Crear el archivo `.env` utilizando `.env.example` como referencia.

4. Colocar la clave correspondiente en:

   GEMINI_API_KEY

5. Iniciar el servidor:

   npm start

6. Abrir en el navegador:

   http://localhost:3000

Cuando se utiliza Gemini, la página debe abrirse mediante el servidor de
Node.js y no mediante Live Server, debido a que la ruta `/api/chat` es
atendida por el servidor.

---

# Resumen de la arquitectura

Frontend:
HTML + CSS + JavaScript

Backend:
Node.js + Express

Inteligencia artificial:
Gemini

Configuración:
.env

Representación visual:
Avatar INVI

El frontend permite la interacción con el usuario, el backend administra la
comunicación con la inteligencia artificial y Gemini procesa las consultas
para generar las respuestas que posteriormente se muestran dentro de INVI.
# Clonar y ejecutar el proyecto

El proyecto puede descargarse o clonarse desde su repositorio de GitHub.

## Clonar el repositorio

Ejecuta:

    git clone https://github.com/omarLEsparza11/INVI-Asistente-Virtual.git

Después entra a la carpeta:

    cd INVI-Asistente-Virtual

## Instalar dependencias

Las dependencias de Node.js no se incluyen directamente en el repositorio.

Para instalarlas ejecuta:

    npm install

En Windows también puede utilizarse:

    npm.cmd install

## Configurar Gemini

Por seguridad, el archivo `.env` que contiene la clave de la API no se
incluye en el repositorio.

Utiliza `.env.example` como referencia y crea un archivo llamado:

    .env

Después configura tu propia clave de Gemini:

    GEMINI_API_KEY=TU_CLAVE_DE_GEMINI

También debe configurarse el modelo correspondiente si se encuentra definido
en `.env.example`.

IMPORTANTE: nunca publiques ni compartas tu archivo `.env` si contiene una
clave de API real.

## Iniciar el proyecto

Una vez instaladas las dependencias y configurado `.env`, ejecuta:

    npm start

En Windows también puede utilizarse:

    npm.cmd start

Si el servidor inicia correctamente aparecerá un mensaje similar a:

    INVI disponible en http://localhost:3000

Finalmente abre en el navegador:

    http://localhost:3000

## Uso sin Gemini

La interfaz de INVI y las respuestas locales pueden probarse sin proporcionar
una clave de Gemini.

Sin embargo, para utilizar las respuestas generadas mediante inteligencia
artificial es necesario configurar una clave válida en el archivo `.env`.

## Repositorio

Código fuente del proyecto:

https://github.com/omarLEsparza11/INVI-Asistente-Virtual