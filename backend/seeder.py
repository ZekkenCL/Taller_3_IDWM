from werkzeug.security import generate_password_hash
rut='19952433K'
password = rut.replace('.', '').replace('-', '')
password_hash = generate_password_hash(password)
print(len(password_hash)) 