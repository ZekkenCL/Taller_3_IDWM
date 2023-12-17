# Taller 3 Introduccion al desarrollo web y movil

La gestión del código fuente (SCM) es una parte
fundamental del desarrollo de software y
aplicaciones en general, exponentes como Git han
cambiado la forma de abordar esta necesidad
mediante un sistema de control de versionado
distribuido (DVSC), a su vez, plataformas como
GitHub han llevado el concepto distribuido a un
paso superior aprovechando las capacidades de la
web y el robusto diseño de Git.

## Comenzando

Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.

### Prerrequisitos

Lo que necesitas para instalar el software y cómo instalarlos:

- [Python](https://www.python.org/downloads/): Lenguaje de programación usado para el backend.
- [Node.js y npm](https://nodejs.org/en/download/): Node.js es el entorno de ejecución para JavaScript y npm es el gestor de paquetes.
- [MySQL](https://dev.mysql.com/downloads/installer/): Sistema de gestión de bases de datos.
- [Visual Studio Code](https://code.visualstudio.com/download): Editor de codigo

Clonar el repositorio:

        git clone https://github.com/ZekkenCL/Taller_3_IDWM.git

### Instalación

Una serie de pasos para que tengas un entorno de desarrollo ejecutándose:

1. Navegar hasta la carpeta del backend
    
    cd backend

2. Instalar el entorno virtual en caso de no tenerlo instalado(OPCIONAL)(en caso de no querer instalar entorno virtual seguir desde el paso N° 5)

    pip install virtualenv

3. Verifique que virtualenv se encuentre dentro de las variables de entorno en el PATH, si no lo hace puede que no funcione el comando siguiente

Luego crear entorno virtual(OPCIONAL)(Solo si hizo el paso anterior):

    virtualenv -p python3 venv

Si el comando anterior no funciona y quiere tener un entorno virtual puede probar el siguiente comando:

    python -m venv venv

4. Luego ejecutar el entorno virtual con el siguiente comando(solamentte si esta siguiendo los pasos N° 2 y 3):

    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

    .\venv\Scripts\activate


5. Instala las dependencias:

    pip install -r requirements.txt

6. Crear un archivo .env en la raiz del proyecto de backend que contenga lo siguiente:

        FLASK_SECRET_KEY='TU CONTRASEÑA AQUI'
        JWT_SECRET_KEY='TU CONTRASEÑA DE JWT AQUI'
        GITHUB_TOKEN='TU TOKEN DE GITHUB AQUI'

debe modificar "TU CONTRASEÑA" con sus contraseñas sino no va funcionar el backend

### Base de Datos

Tener creada la base de datos en mysql workbench con el nombre de "taller3"

7. Modificar el archivo __init__.py:

    liena 19 app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://"USUARIO":"CONTRASEÑA"@"HOST":"PUERTO"/"NOMBRE DE LA BASE DE DATOS"'

    modificar USUARIO, CONTRASEÑA, HOST, PUERTO, NOMBRE DE LA BASE DE DATOS con sus datos para ingresar a la base de datos

8. Migrar base de datos:

    flask db init
    flask db migrate
    flask db upgrade

### Ejecucion

9. Ejecutar backend

    python run.py

El proyecto debería estar ahora ejecutándose en `localhost:5000`.

## Configuración del Frontend

1. Navega al directorio del frontend:

    abre una nueva terminal:

        cd mobile

2. Instala las dependencias de Node.js:

        npm install

3. Ejecuta el servidor de desarrollo de React:

        npx expo start
        
4. En la misma terminal apretar "w" para ejecutar la version movil en su navegador web.


## Recomendaciones

El sistema no trae seeders, necesita registrarse primero para poder acceder a la app
El sistema solo visualiza los datos de el usuario 'Dizkm8' si quiere visualizar los repositorios de otro usuario debe modificarlo en el linea 17 de RepositoriesScreen.js y en la linea 18 de RepositoryDetailsScreen.js
