from flask import Flask, render_template, request, jsonify
import sqlite3
from datetime import datetime

app = Flask(__name__)

DATABASE = "database.db"


# =========================================================
# DATABASE
# =========================================================

def get_db():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def init_database():

    connection = get_db()

    # -----------------------------------------------------
    # Students
    # -----------------------------------------------------
    connection.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            age TEXT,
            state TEXT,
            interest TEXT,
            education TEXT,
            created_at TEXT
        )
    """)

    # -----------------------------------------------------
    # Contact messages
    # -----------------------------------------------------
    connection.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TEXT
        )
    """)

    # -----------------------------------------------------
    # Opportunities
    # -----------------------------------------------------
    connection.execute("""
        CREATE TABLE IF NOT EXISTS opportunities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            field TEXT,
            state TEXT,
            description TEXT,
            organization TEXT,
            link TEXT
        )
    """)

    # -----------------------------------------------------
    # Universities
    # -----------------------------------------------------
    connection.execute("""
        CREATE TABLE IF NOT EXISTS universities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            country TEXT,
            description TEXT,
            link TEXT
        )
    """)

    # -----------------------------------------------------
    # Resources
    # -----------------------------------------------------
    connection.execute("""
        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT,
            description TEXT,
            link TEXT
        )
    """)

    connection.commit()

    # -----------------------------------------------------
    # Add education column to an existing database
    # -----------------------------------------------------
    columns = connection.execute(
        "PRAGMA table_info(students)"
    ).fetchall()

    column_names = [column["name"] for column in columns]

    if "education" not in column_names:

        connection.execute(
            "ALTER TABLE students ADD COLUMN education TEXT"
        )

        connection.commit()

    connection.close()


# =========================================================
# MAIN PAGES
# =========================================================

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/opportunities")
def opportunities_page():

    category = request.args.get("category", "").strip()
    field = request.args.get("field", "").strip()
    state = request.args.get("state", "").strip()

    return render_template(
        "opportunities.html",
        selected_category=category,
        selected_field=field,
        selected_state=state
    )


@app.route("/fields")
def fields_page():
    return render_template("fields.html")


@app.route("/resources")
def resources_page():
    return render_template("resources.html")


@app.route("/universities")
def universities_page():
    return render_template("universities.html")


@app.route("/mentorship")
def mentorship_page():
    return render_template("mentorship.html")


@app.route("/projects")
def projects_page():
    return render_template("projects.html")


@app.route("/register")
def register_page():
    return render_template("register.html")


@app.route("/contact")
def contact_page():
    return render_template("contact.html")


# =========================================================
# OPPORTUNITIES API
# =========================================================

@app.route("/api/opportunities")
def get_opportunities():

    category = request.args.get(
        "category", ""
    ).strip().lower()

    field = request.args.get(
        "field", ""
    ).strip().lower()

    state = request.args.get(
        "state", ""
    ).strip().lower()

    connection = get_db()

    rows = connection.execute(
        "SELECT * FROM opportunities ORDER BY id DESC"
    ).fetchall()

    connection.close()

    opportunities = []

    for row in rows:

        opportunity = dict(row)

        row_category = str(
            opportunity.get("category", "")
        ).lower().strip()

        row_field = str(
            opportunity.get("field", "")
        ).lower().strip()

        row_state = str(
            opportunity.get("state", "")
        ).lower().strip()

        # Category filter
        if category and category not in row_category:
            continue

        # Field filter
        if field and field not in row_field:
            continue

        # State filter
        if state and state not in row_state:
            continue

        opportunities.append(opportunity)

    return jsonify(opportunities)


# =========================================================
# UNIVERSITIES API
# =========================================================

@app.route("/api/universities")
def get_universities():

    connection = get_db()

    rows = connection.execute(
        "SELECT * FROM universities ORDER BY name"
    ).fetchall()

    connection.close()

    return jsonify([
        dict(row) for row in rows
    ])


# =========================================================
# RESOURCES API
# =========================================================

@app.route("/api/resources")
def get_resources():

    connection = get_db()

    rows = connection.execute(
        "SELECT * FROM resources ORDER BY name"
    ).fetchall()

    connection.close()

    return jsonify([
        dict(row) for row in rows
    ])


# =========================================================
# REGISTER API
# =========================================================

@app.route("/api/register", methods=["POST"])
def register_student():

    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    state = data.get("state", "").strip()
    interest = data.get("interest", "").strip()
    education = data.get("education", "").strip()

    # -----------------------------------------------------
    # Validate required fields
    # -----------------------------------------------------

    if not name:
        return jsonify({
            "success": False,
            "message": "Please enter your full name."
        }), 400

    if not email:
        return jsonify({
            "success": False,
            "message": "Please enter your email address."
        }), 400

    if not state:
        return jsonify({
            "success": False,
            "message": "Please select your state."
        }), 400

    if not interest:
        return jsonify({
            "success": False,
            "message": "Please select your STEAM interest."
        }), 400

    if not education:
        return jsonify({
            "success": False,
            "message": "Please select your education level."
        }), 400

    # -----------------------------------------------------
    # Save profile
    # -----------------------------------------------------

    connection = get_db()

    try:

        connection.execute("""
            INSERT INTO students
            (
                name,
                email,
                state,
                interest,
                education,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            name,
            email,
            state,
            interest,
            education,
            datetime.now().isoformat()
        ))

        connection.commit()

    except sqlite3.Error as error:

        connection.rollback()
        connection.close()

        print("Registration database error:", error)

        return jsonify({
            "success": False,
            "message": "We could not create your profile. Please try again."
        }), 500

    connection.close()

    return jsonify({
        "success": True,
        "message": "Your profile has been created successfully!"
    })


# =========================================================
# CONTACT API
# =========================================================

@app.route("/api/contact", methods=["POST"])
def contact():

    data = request.get_json(silent=True) or {}

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    message = data.get("message", "").strip()

    # -----------------------------------------------------
    # Validate fields
    # -----------------------------------------------------

    if not name:
        return jsonify({
            "success": False,
            "message": "Please enter your name."
        }), 400

    if not email:
        return jsonify({
            "success": False,
            "message": "Please enter your email address."
        }), 400

    if not message:
        return jsonify({
            "success": False,
            "message": "Please enter your message."
        }), 400

    # -----------------------------------------------------
    # Save message
    # -----------------------------------------------------

    connection = get_db()

    try:

        connection.execute("""
            INSERT INTO messages
            (
                name,
                email,
                message,
                created_at
            )
            VALUES (?, ?, ?, ?)
        """, (
            name,
            email,
            message,
            datetime.now().isoformat()
        ))

        connection.commit()

    except sqlite3.Error as error:

        connection.rollback()
        connection.close()

        print("Contact database error:", error)

        return jsonify({
            "success": False,
            "message": "We could not send your message. Please try again."
        }), 500

    connection.close()

    return jsonify({
        "success": True,
        "message": "Your message has been sent successfully!"
    })


# =========================================================
# START APPLICATION
# =========================================================

init_database()


if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )