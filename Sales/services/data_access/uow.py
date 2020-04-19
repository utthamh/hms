

class UOW(object):
    def __init__(self, db_connection_helper):
        self._db_connection_helper = db_connection_helper

    def __enter__(self):
        self._db_connection = self._db_connection_helper.build_connection()
        self._cursor = self._db_connection_helper.get_cursor(self._db_connection)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_tb is None:
            self.commit()
        else:
            self.rollback()
        if self._cursor is None:
            raise Exception("Trying to close connection before initialising")
        self._cursor.close()
        self._db_connection.close()

    def commit(self):
        self._db_connection.commit()

    def rollback(self):
        self._db_connection.rollback()

    def get_sales_rep_dao(self, logger):
        from .sales_rep import SalesRep
        return SalesRep(self._db_connection, self._cursor, logger)