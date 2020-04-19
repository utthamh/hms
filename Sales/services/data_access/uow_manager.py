
from .uow import UOW


class UOWManager(object):
    def __init__(self, configuration, factory):
        self._configuration = configuration
        self._db_connection_helper = factory.get_db_connection_helper()

    def start(self):
        return UOW(self._db_connection_helper)
