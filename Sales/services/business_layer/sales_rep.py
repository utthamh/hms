

class SalesRep(object):
    def __init__(self, uow_manager, logger):
        self._uow_manager = uow_manager
        self._logger = logger

    def get_all_sales_reps(self):
        with self._uow_manager.start() as uow:
            sales_rep_dao = uow.get_sales_rep_dao(self._logger)
            all_sales_rep = sales_rep_dao.get_all_sales_reps()
            return all_sales_rep

    def get_sales_rep(self, rep_id):
        with self._uow_manager.start() as uow:
            sales_rep_dao = uow.get_sales_rep_dao(self._logger)
            return ''

    def add_sales_rep(self, rep_data):
        with self._uow_manager.start() as uow:
            sales_rep_dao = uow.get_sales_rep_dao(self._logger)
            return ''
