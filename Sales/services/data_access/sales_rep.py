

from ..data_transfer_objects.sales_rep_dto import SalesRepDTO


class SalesRep(object):
    def __init__(self, db_connection, cursor, logger):
        self._db_connection = db_connection
        self._cursor = cursor
        self._logger = logger

    def get_all_sales_reps(self):
        """
        WRITE QUERIES HERE
        :return:
        """
        data = self._cursor.execute("SELECT rep_id, rep_name FROM sales")

        # Convert to standard data object below
        return [SalesRepDTO(101, 'abhijeet', 'A+').get_as_json_string(),
                SalesRepDTO(101, 'Sidrah', 'Z-').get_as_json_string()]