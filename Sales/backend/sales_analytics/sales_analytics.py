
from pyspark.sql import SparkSession


class SalesAnalytics(object):
    def __init__(self, spark_session, data_location):
        self._spark_session = spark_session
        self._data_location = data_location

    def run(self):
        df = self.load_data()
        analyzed_df = self.perform_analysis(df)
        self.post_results_to_db(analyzed_df)

    def perform_analysis(self, df):
        return 'analyzed_df'

    def post_results_to_db(self, analyzed_df):
        print('Started writing analyzed_df to DF')

    def load_data(self):
        return ''


if __name__ == "__main__":
    spark_session = SparkSession.builder.enableHiveSupport()
    sales_analytics = SalesAnalytics(spark_session, 'S3 LOCATION')
    sales_analytics.run()