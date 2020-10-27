(function ($) {

    $.fn.appSortableTable = function () {
        return this.each(function () {
            prepTable(this);
        });
    };

    function prepTable(element) {

        $(element).find('a[sort]').attr('sort', '').attr('href', '').click(function (event) {

            var colIndex = this.parentElement.cellIndex;
            var t = $(this).closest('table.zs-data-table')[0];
            var valuesToSort = [];
            var sortDirection = event.target.attributes.sort.nodeValue;

            //remove all sort arrows from the table's columns
            $(t).find('a[sort]').attr('sort', '');

            //determine the direction in which we are sorting and set the sort attribute so that it shows in the UI
            if (sortDirection == "asc") {
                event.target.attributes.sort.nodeValue = "desc";
            }
            else if (sortDirection == "desc") {
                event.target.attributes.sort.nodeValue = "asc";
            }
            else {
                event.target.attributes.sort.nodeValue = "asc";
            }
            sortDirection = event.target.attributes.sort.nodeValue;

            //create an array of row references and values that we can sort
            //assume that the first data row starts at index 1
            for (i = 1; i < t.rows.length; i++) {
                var valueToSortOn = {};
                valueToSortOn.rowReference = t.rows[i];
                valueToSortOn.rowValue = t.rows[i].cells[colIndex].innerText;
                valuesToSort.push(valueToSortOn);
            }

            //sort the array of row references.
            valuesToSort.sort(function (a, b) {
                var returnValue = 0;

                if (a.rowValue < b.rowValue) {
                    returnValue = -1;
                }
                else if (a.rowValue > b.rowValue) {
                    returnValue = 1;
                }
                else {
                    returnValue = 0;
                }

                if (sortDirection == "asc") {
                    return returnValue;
                }
                else {
                    return (returnValue * -1);
                }

            });

            //re-order the table rows
            for (i = 0; i < valuesToSort.length; i++) {
                $(t).append($(valuesToSort[i].rowReference));
            }

            return false;
        });
    }

}(jQuery));