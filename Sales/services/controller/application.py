
from .sales_rep import sales


from flask import Flask

flask_app = Flask(__name__)

flask_app.add_url_rule('/sales', sales)
