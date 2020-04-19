
from flask import Flask

from services.controller.sales_rep import sales_rep_controller

app = Flask(__name__)
app.register_blueprint(sales_rep_controller)

if __name__ == "__main__":
    app.run()