
import pytest
from mock import Mock

from services.business_layer.sales_rep import SalesRep


class TestSalesRep(object):
    def setup(self):
        pass

    def test_get_all_sales_reps_when_no_rep_present_in_the_system(self):
        sales_rep_dao = Mock(get_all_sales_reps=[])
        uow_manager = Mock(get_sales_rep_dao=sales_rep_dao)

        sales_rep = SalesRep(uow_manager)
        assert sales_rep.get_all_sales_reps() == []

    def test_get_all_sales_reps_when_only_rep_present_in_the_system(self):
        sales_rep_dao = Mock(get_all_sales_reps='test')
        uow_manager = Mock(get_sales_rep_dao=sales_rep_dao)
        sales_rep = SalesRep(uow_manager)
        assert sales_rep.get_all_sales_reps() == 'test'
