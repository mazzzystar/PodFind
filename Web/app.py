from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__,
            static_folder='static',
            template_folder='templates')


@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/log', methods=['POST'])
def log_to_server():
    message = request.json.get('message', '')
    print(message)  # Log the message to the console
    return jsonify(success=True)  # Return success status


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
