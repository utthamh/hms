

class Factory(object):
    @staticmethod
    def get_db_connection_helper():
        from infrastructure.db_connection.db_connection_helper import DBConnectionHelper
        configuration = Factory.get_configuration()
        return DBConnectionHelper(configuration, Factory)

    @staticmethod
    def get_configuration():
        from .configuration import Configuration
        return Configuration()

    @staticmethod
    def get_uow_manager():
        from ..data_access.uow_manager import UOWManager
        configuration = Factory.get_configuration()
        return UOWManager(configuration, Factory)

    @staticmethod
    def get_logger():
        from common.logger.logger import Logger
        return Logger()
