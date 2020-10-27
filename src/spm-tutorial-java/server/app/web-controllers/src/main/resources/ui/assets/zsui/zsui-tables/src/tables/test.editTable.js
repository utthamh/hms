
// Helper to fire keyboard events
function fireKey(el,key) {
    if(document.createEventObject)
    {
        var eventObj = document.createEventObject();
        eventObj.keyCode = key;
        el.fireEvent("onkeydown", eventObj);
        eventObj.keyCode = key;   
    }else if(document.createEvent)
    {
        var eventObj = document.createEvent("Events");
        eventObj.initEvent("keydown", true, true);
        eventObj.which = key; 
        eventObj.keyCode = key;
        el.dispatchEvent(eventObj);
    }
} 


describe("editable table behavior", function () {
	// Define an editable table element
	var editableTableElement = zs.customElement(HTMLDivElement, 'zs-table-editable', 'div', [zs.loading, zs.table, zs.tableEditable, {
		formatCell: function (data, rowIndex, colIndex, editMode) {
			if (colIndex == 4) {
				return '_';
			}
			return data;
		},
		isEditable: function (data, rowIndex, colIndex) {
			if (colIndex == 3) { return false; }
			return true;
		}
	}]);

	
	var itemsCount = 10;
	function getData() {
		return new Promise(function (resolve, reject) {
			var arr = [];
			for (var i = 0; i < itemsCount; i++) {
				var row = [];
				for (var j = 0; j < 10; j++) {
					if (j == 2) { // Checkbox
						row.push(true);
					} else if (j == 6) {
						row.push(4); // Select one of items from array;
					} else {
						row.push('Cell ' + (i + 1) + ',' + (j + 1));
					}
				}
				arr.push(row);
			}
			resolve(arr);
		});

	}

	it('is a behavior', function () {
		utils.isBehavior(expect, zs.tableEditable);
	});

	it('Shows data in edit and read modes', function(done) {
		var table =  document.createElement('div', {is: 'zs-table-editable'});
		$(table).appendTo('body');
		table.getTableData = getData;
		table.headData = ['Input', 'Field', 'Checkbox', 'Readonly', 'Text', 'Column 5', 'Select', 'Column 8', 'Column 9', 'Column 10'];
		table.refreshTable();
		setTimeout(function() {
			// We have editable cells
			expect($(table).find('td[edit]').length).toBeGreaterThan(0);

			// We have one read only column
			expect($(table).find('tbody td[key="3"]').attr('edit')).toBeUndefined();

			// Supports custom formatting
			expect($(table).find('tbody td[key="4"]>p').html()).toBe('_');

			$(table).remove();
			table = null;
			done();
		},100);
		
	});

	it('Shows an overlay with a field', function(done) {
		var table =  document.createElement('div', {is: 'zs-table-editable'});
		$(table).appendTo('body');
		table.getTableData = getData;
		table.headData = ['Input', 'Field', 'Checkbox', 'Readonly', 'Text', 'Column 5', 'Select', 'Column 8', 'Column 9', 'Column 10'];
		table.refreshTable();
		$(table).on('click', function() {
			setTimeout(function() {
				// Has an overlay
				expect(table.overlayElement).toBeTruthy();

				// Has a field in the overlay
				var $field = $(table.overlayElement).find('input');
				expect($field.length).toBeGreaterThan(0);

				// Field has focus
				expect($field.is(':focus')).toBeTruthy();
				
				// Has a proper value
				expect($field.val()).toBe('_');

				$(table).remove();
				table = null;
				done();
			},100)
		});
		$(table).on('render', function() {
			$(table).find('tbody td[edit][key="4"]').first().click();
		});
		
	});


	it('Hides overlay when clicking outside, saves value', function(done) {
		var table =  document.createElement('div', {is: 'zs-table-editable'}), changeDetail;
		$(table).appendTo('body');
		table.getTableData = getData;
		table.headData = ['Input', 'Field', 'Checkbox', 'Readonly', 'Text', 'Column 5', 'Select', 'Column 8', 'Column 9', 'Column 10'];
		table.refreshTable();
		$(table).on('cellchange', function(e) {
			changeDetail = e.detail;
		});
		$(table).on('click', function(e) {
			var td = e.target;
			if ($(td).attr('key') == '4') {
				setTimeout(function() {
					expect(table.overlayElement).toBeTruthy();
					var $field = $(table.overlayElement).find('input[tabindex="2"]');
					
					// TODO: detect changes
					$field.focus();
					$field.val('Changed');
					$field[0].dispatchEvent(new CustomEvent('change', {bubbles: true})); // Important to make custom event to bubble

					var $cell = $(table).find('tbody td[key="3"]').first(); // Readonly cell
					$cell.click();
				},100);
			} else {
				setTimeout(function() {
					expect($(table.overlayElement).is(':visible')).toBeFalsy();

					// Change detection
					expect(changeDetail).toBeTruthy();
					expect(changeDetail.rowIndex).toBe('0');
					expect(changeDetail.colIndex).toBe('4');
					expect(table.data[Number(changeDetail.rowIndex)][changeDetail.colIndex]).toBe('Changed');

					$(table).remove();
					table = null;
					done();
				},200);
			}
		});
		$(table).on('render', function() {
			$(table).find('tbody td[edit][key="4"]').first().click();
		});
		
	});

	// TODO: improve to check for last cell, skipping through read only cells and jumping to the next or prev row
	it('Supports tabbing through', function(done) {
		var table =  document.createElement('div', {is: 'zs-table-editable'}), changeDetail;
		$(table).appendTo('body');
		table.getTableData = getData;
		table.headData = ['Input', 'Field', 'Checkbox', 'Readonly', 'Text', 'Column 5', 'Select', 'Column 8', 'Column 9', 'Column 10'];
		table.refreshTable();
		var values = '';

		var checkFirst = function() {
			var $field = $(table.overlayElement).find('input[tabindex="2"]');
			expect($field[0]._colIndex).toBe('0');
			$(table).remove();			
			table = null;
			done();
		};


		var checkPrev = function() {
			var $field = $(table.overlayElement).find('input[tabindex="2"]');
			expect($field[0]._colIndex).toBe('0');
			$(table).remove();			
			$prev = $field.next('input');
			$prev[0].focus();
			setTimeout(checkFirst, 100);
		};

		var checkNext = function() {
			var $field = $(table.overlayElement).find('input[tabindex="2"]');
			expect($field[0]._colIndex).toBe('1');
			$prev = $field.next('input');
			$prev[0].focus();
			setTimeout(checkPrev, 100);
		}
		
		$(table).on('click', function(e) {
			setTimeout(function() {
				expect(1).toBe(1);
				var $field = $(table.overlayElement).find('input[tabindex="2"]');
				$next = $field.next('input').next('input');
				$next[0].focus();				
				setTimeout(checkNext,100);
			},100);
		});

		$(table).on('render', function() {
			$(table).find('tbody td[edit][key="0"]').first().click();
		});
	});

	it('should remove the overlay when table re-renders', function(done) {
		var table =  document.createElement('div', {is: 'zs-table-editable'});
		$(table).appendTo('body');
		table.getTableData = getData;
		table.headData = ['Input', 'Field', 'Checkbox', 'Readonly', 'Text', 'Column 5', 'Select', 'Column 8', 'Column 9', 'Column 10'];
		table.refreshTable();
		$(table).on('click', function() {
			setTimeout(function() {
				// Has an overlay initially
				expect(table.overlayElement.parentElement).toBeTruthy();

				table.refreshTable();

				setTimeout(function() {
					// Overlay has been removed when re-rendered
					expect(table.overlayElement.parentElement).toBeFalsy();
					done();
				}, 100);
			},100)
		});
		$(table).on('render', function() {
			$(table).find('tbody td[edit][key="1"]').first().click();
			$(table).off('render');
		});
	});

});