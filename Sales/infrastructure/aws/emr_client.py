
import boto3


class EMRClient(object):
    def __init__(self, configuration):
        self._emr_client = boto3('emr', access_key=configuration.access_key, secret_key=configuration.secret_key)

    def add_step_to_emr(self, cluster_id):
        print("Added steps to EMR")

    def get_step_status_from_emr(self, cluster_id, step_id):
        return 'PENDING'