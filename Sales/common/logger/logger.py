
import logging


class Logger(object):
    def __init__(self):
        self._logger = logging

        self._logger.basicConfig(filename='example.log',level=logging.DEBUG)

    def debug(self, message):
        self._logger.debug(message)

    def info(self, message):
        self._logger.info(message)

    def warning(self, message):
        self._logger.warning(message)