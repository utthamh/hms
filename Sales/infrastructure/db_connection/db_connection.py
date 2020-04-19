

class DBConnection(object):
    def __init__(self, configuration):
        self._configuration = configuration
        pass

    def cursor(self):
        """
        To be replced by actual DB cursor
        :return:
        """
        class MockCursor(object):
            def close(self):
                print("Closed")

        return MockCursor()

    def connect(self):
        print("Connection connect")

    def close(self):
        print("Connection closed")

    def commit(self):
        print("Commit operation complete")

    def rollback(self):
        print("Rollback operation complete")