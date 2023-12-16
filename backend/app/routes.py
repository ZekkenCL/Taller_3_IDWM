from flask import Blueprint, jsonify, request
from app import db
from app.models import User
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import re
from datetime import datetime
import requests
from dotenv import load_dotenv
import os

# Carga las variables de entorno
load_dotenv()

# Obtiene el token de GitHub desde las variables de entorno
github_token = os.getenv('GITHUB_TOKEN')

routes = Blueprint('routes', __name__)

# Validación del correo electrónico
def es_correo_valido(email):
    patron = r"(^[a-zA-Z0-9_.+-]+@(ucn.cl|alumnos.ucn.cl|disc.ucn.cl|ce.ucn.cl)$)"
    return re.match(patron, email) is not None

# Validación del RUT
def validar_rut(rut_completo):
    rut = rut_completo.replace(".", "").replace("-", "")
    cuerpo, dv = rut[:-1], rut[-1].upper()

    # Calcular el dígito verificador esperado
    suma = 0
    multiplicador = 2

    for digito in reversed(cuerpo):
        suma += int(digito) * multiplicador
        multiplicador = multiplicador + 1 if multiplicador < 7 else 2

    dv_esperado = 11 - (suma % 11)
    if dv_esperado == 11:
        dv_esperado = '0'
    elif dv_esperado == 10:
        dv_esperado = 'K'

    return str(dv_esperado) == dv


def es_anio_nacimiento_valido(anio_nacimiento):
    anio_actual = datetime.now().year
    return 1900 <= anio_nacimiento <= anio_actual

def es_nombre_valido(nombre):
    return 10 <= len(nombre) <= 150




@routes.route('/register', methods=['POST'])
def add_user():
    data = request.json
    if not es_correo_valido(data['email']) or not validar_rut(data['dni']):
        return jsonify({"msg": "RUT o email inválido"}), 400

    if not es_nombre_valido(data['name']):
        return jsonify({"msg": "Nombre inválido. Debe tener entre 10 y 150 caracteres."}), 400

    try:
        # Ajuste para extraer el año del formato 'dd-mm-aaaa'
        anio_nacimiento = int(data['birthdate'].split('-')[2])
        if not es_anio_nacimiento_valido(anio_nacimiento):
            return jsonify({"msg": "Año de nacimiento inválido. Debe estar entre 1900 y el año actual."}), 400
    except (ValueError, IndexError):
        return jsonify({"msg": "Formato de fecha de nacimiento inválido."}), 400

    rut_existente = User.query.filter_by(dni=data['dni']).first()
    email_existente = User.query.filter_by(email=data['email']).first()
    if rut_existente or email_existente:
        return jsonify({"msg": "RUT o email ya registrado"}), 400

    password = data['dni'].replace('.', '').replace('-', '')
    nuevo_usuario = User(
        name=data['name'],
        dni=data['dni'],
        email=data['email'],
        birthdate=data['birthdate'],
        password=generate_password_hash(password)
    )
    db.session.add(nuevo_usuario)
    db.session.commit()
    return jsonify({"msg": "Usuario registrado con éxito"}), 201


# Ruta para iniciar sesión
@routes.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Falta JSON en la solicitud"}), 400

    email = request.json.get('email', None)
    password = request.json.get('password', None)

    if not email or not password:
        return jsonify({"msg": "Faltan credenciales"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    access_token = create_access_token(identity=user.id)

    # Crear un objeto con la información del usuario
    user_info = {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "birthdate": user.birthdate
        # Puedes añadir más campos aquí si es necesario
    }

    return jsonify(user=user_info, access_token=access_token), 200

# Ruta para editar el perfil de un usuario
@routes.route('/edit_profile/<int:id>', methods=['PUT'])
@jwt_required()
def edit_profile(id):
    user = User.query.get_or_404(id)
    data = request.json

    # Validaciones
    if 'email' in data and (not es_correo_valido(data['email']) or User.query.filter(User.email == data['email'], User.id != id).first()):
        return jsonify({"msg": "Email inválido o ya en uso"}), 400

    if 'name' in data and not es_nombre_valido(data['name']):
        return jsonify({"msg": "Nombre inválido. Debe tener entre 10 y 150 caracteres."}), 400

    try:
        if 'birthdate' in data:
            anio_nacimiento = int(data['birthdate'].split('-')[2])
            if not es_anio_nacimiento_valido(anio_nacimiento):
                return jsonify({"msg": "Año de nacimiento inválido. Debe estar entre 1900 y el año actual."}), 400
    except (ValueError, IndexError):
        return jsonify({"msg": "Formato de fecha de nacimiento inválido."}), 400

    # Actualizar datos del usuario
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'birthdate' in data:
        user.birthdate = data['birthdate']

    db.session.commit()
    return jsonify({"msg": "Perfil actualizado con éxito"}), 200

#ruta para listar los commits de un repositorio en GitHub
@routes.route('/repos/<username>/<repo_name>/commits')
@jwt_required()
def list_commits(username, repo_name):
    url = f"https://api.github.com/repos/{username}/{repo_name}/commits"
    headers = {'Authorization': f'token {github_token}'}
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        commits = response.json()
        # Los commits ya vienen ordenados por fecha de creación, con el más reciente primero
        return jsonify(commits)
    else:
        return jsonify({"error": "Error al obtener commits"}), response.status_code
    
# Ruta para listar los repositorios de un usuario en GitHub
@routes.route('/repos/<username>')
@jwt_required()
def list_repositories(username):
    url = f"https://api.github.com/users/{username}/repos"
    headers = {'Authorization': f'token {github_token}'}
    response = requests.get(url, headers=headers )
    if response.status_code == 200:
        repos = response.json()
        # Ordenar repositorios por fecha de modificación
        repos.sort(key=lambda x: x['updated_at'], reverse=True)
        return jsonify(repos)
    else:
        return jsonify({"error": "Error al obtener repositorios"}), response.status_code

    


@routes.route('/update_password', methods=['PUT'])
@jwt_required()
def update_password():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)

    data = request.json
    nueva_password = data.get('nueva_password')


    user.password = generate_password_hash(nueva_password)
    db.session.commit()

    return jsonify({"msg": "Contraseña actualizada con éxito"}), 200




