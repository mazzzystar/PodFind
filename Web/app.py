from flask import Flask, render_template, request, jsonify, url_for
import os

app = Flask(__name__, static_url_path='/static', static_folder='static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    print("About route accessed")  # This will show in Vercel logs
    try:
        return render_template('about.html')
    except Exception as e:
        print(f"Error rendering about.html: {str(e)}")  # This will show in Vercel logs
        return str(e), 500

@app.route('/log', methods=['POST'])
def log_to_server():
    message = request.json.get('message', '')
    print(message)  # Log the message to the console
    return jsonify(success=True)

# Add error handlers
@app.errorhandler(404)
def not_found_error(error):
    return render_template('about.html'), 404

# This is important for Vercel
app.debug = True

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
