"""
Авторизация пользователей ателье: регистрация, вход, выход, проверка сессии.
action query param: register | login | me | logout
"""
import json
import os
import hashlib
import secrets
import psycopg2

DB = os.environ["DATABASE_URL"]
SCHEMA = "t_p59498194_project_alpha_creati"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Token",
}


def get_conn():
    return psycopg2.connect(DB)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")
    raw_body = event.get("body") or "{}"
    body = json.loads(raw_body) if isinstance(raw_body, str) else raw_body

    if method == "POST" and action == "register":
        name = body.get("name", "").strip()
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        if not name or not email or not password:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Заполните все поля"})}
        if len(password) < 6:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Пароль должен быть не менее 6 символов"})}

        pw_hash = hash_password(password)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {SCHEMA}.users WHERE email = '{email}'")
        if cur.fetchone():
            conn.close()
            return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Пользователь с таким email уже существует"})}

        cur.execute(
            f"INSERT INTO {SCHEMA}.users (name, email, password_hash) VALUES ('{name}', '{email}', '{pw_hash}') RETURNING id"
        )
        user_id = cur.fetchone()[0]
        token = secrets.token_hex(32)
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES ({user_id}, '{token}')"
        )
        conn.commit()
        conn.close()
        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({"token": token, "name": name, "email": email}),
        }

    if method == "POST" and action == "login":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        pw_hash = hash_password(password)

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, name, email FROM {SCHEMA}.users WHERE email = '{email}' AND password_hash = '{pw_hash}'"
        )
        user = cur.fetchone()
        if not user:
            conn.close()
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Неверный email или пароль"})}

        user_id, name, u_email = user
        token = secrets.token_hex(32)
        cur.execute(
            f"INSERT INTO {SCHEMA}.sessions (user_id, token) VALUES ({user_id}, '{token}')"
        )
        conn.commit()
        conn.close()
        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({"token": token, "name": name, "email": u_email}),
        }

    if method == "GET" and action == "me":
        token = event.get("headers", {}).get("X-Session-Token", "")
        if not token:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            f"SELECT u.id, u.name, u.email, u.created_at FROM {SCHEMA}.users u "
            f"JOIN {SCHEMA}.sessions s ON s.user_id = u.id "
            f"WHERE s.token = '{token}' AND s.expires_at > NOW()"
        )
        user = cur.fetchone()
        conn.close()
        if not user:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия истекла"})}

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps({"id": user[0], "name": user[1], "email": user[2], "createdAt": str(user[3])}),
        }

    if method == "POST" and action == "logout":
        token = event.get("headers", {}).get("X-Session-Token", "")
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute(f"UPDATE {SCHEMA}.sessions SET expires_at = NOW() WHERE token = '{token}'")
            conn.commit()
            conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}