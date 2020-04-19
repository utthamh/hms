

class Configuration(object):
    def __init__(self):
        self._load_configuration()

    def _load_configuration(self):
        self._load_db_connection_details()

    def _load_db_connection_details(self):
        self.host = "Some Host"
        self.port = "some port"
        self.user_name = "some user name"
        self.password = "some password"
        self.db_name = "some db name"
        self.schema = "Some schemma"
