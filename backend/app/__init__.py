from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Inicializa las extensiones globales sin un contexto de aplicación específico
db = SQLAlchemy()
migrate = Migrate()

def create_app():
    # Crea una instancia de la aplicación Flask
    app = Flask(__name__)

    # Configura la conexión a la base de datos MySQL
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:beno1989@localhost:3306/taller3'

    # Desactiva la modificación de seguimiento de SQLAlchemy para mejorar el rendimiento
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Establece la clave secreta para JWT (JSON Web Token)
    app.config['JWT_SECRET_KEY'] = 'jakshdjkashd882jhj3bjh1l'

    # Inicializa el manejador de JWT con la aplicación Flask
    jwt = JWTManager(app)

    # Inicializa las extensiones SQLAlchemy y Migrate con la aplicación Flask
    db.init_app(app)
    migrate.init_app(app, db)

    # Habilita CORS (Cross-Origin Resource Sharing) para permitir peticiones entre dominios
    CORS(app)

    # Importa y registra el Blueprint que define las rutas y vistas de la aplicación
    from app.routes import routes
    app.register_blueprint(routes)

    return app
