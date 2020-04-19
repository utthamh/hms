

class DBConnectionHelper(object):
    def __init__(self, configuration, factory):
        self.factory = factory
        self.configuration = configuration

    def build_connection(self):
        from .db_connection import DBConnection
        return DBConnection(self.configuration)

    def get_cursor(self, db_connection):
        return db_connection.cursor()
