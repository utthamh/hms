
from flask import Blueprint
from flask import Response

from ..common.factory import Factory
from ..business_layer.sales_rep import SalesRep


sales_rep_controller = Blueprint('sales_rep', __name__)


@sales_rep_controller.route('/sales', methods=['GET'])
def get_all_sales_reps():
    uow_manager = Factory.get_uow_manager()
    logger = Factory.get_logger()
    sales_rep_bl = SalesRep(uow_manager, logger)
    sales_reps = sales_rep_bl.get_all_sales_reps()
    return Response(sales_reps), 200


@sales_rep_controller.route('/sales/<id>', methods=['GET'])
def get_sales_rep():
    uow_manager = Factory.get_uow_manager()
    logger = Factory.get_logger()
    sales_rep_bl = SalesRep(uow_manager, logger)
    sales_reps = sales_rep_bl.get_all_sales_reps()
    return Response(sales_reps), 200


@sales_rep_controller.route('/sales', methods=['POST'])
def create_sales_rep():
    uow_manager = Factory.get_uow_manager()
    logger = Factory.get_logger()
    sales_rep_bl = SalesRep(uow_manager, logger)
    sales_reps = sales_rep_bl.get_all_sales_reps()
    return Response(sales_reps), 200


@sales_rep_controller.route('/sales/<id>', methods=['DELETE'])
def create_sales_rep():
    uow_manager = Factory.get_uow_manager()
    logger = Factory.get_logger()
    sales_rep_bl = SalesRep(uow_manager, logger)
    sales_reps = sales_rep_bl.delete_sales_rep(id)
    return Response(sales_reps), 200
