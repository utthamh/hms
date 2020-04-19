

from flask import Blueprint
import json


upload_controller = Blueprint('upload', __name__)


@upload_controller.route('/upload', methods=['GET'])
def insights():
    return 'test', 200