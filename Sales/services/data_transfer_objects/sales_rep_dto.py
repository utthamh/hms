
import json


class SalesRepDTO(object):
    def __init__(self, id, name, rating):
        self.id = id
        self.name = name
        self.rating = rating

    def get_as_json_string(self):
        return json.dumps(self.__dict__)