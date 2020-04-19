

from flask import Blueprint
import json


insights_controller = Blueprint('insights', __name__)


@insights_controller.route('/insights', methods=['GET'])
def insights():
    return 'test', 200


