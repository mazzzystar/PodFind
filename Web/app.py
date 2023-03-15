from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    keyword = request.form.get('keyword')
    # Perform search operation with the keyword
    results = ['Result 1', 'Result 2', 'Result 3']  # Replace this with your search results
    return render_template('results.html', results=results)

if __name__ == '__main__':
    app.run(debug=True)
