$(document).ready(function() {
		// Load and display existing data
		function loadData() {
			const data = JSON.parse(localStorage.getItem('data')) || [];
			$('#dataRows').empty();
			data.forEach((item, index) => {
				const row = $('<tr>');
				row.html(`
					<td>${item.column1}</td>
					<td>${item.column2}</td>
					<td>${item.column3}</td>
					<td>
						<button id="row_${index}" class="editButton"><i class="fas fa-pencil-alt"></i></button>
						<button class="deleteButton"><i class="fas fa-trash-alt"></i></button>
					</td>
				`);
				$('#dataRows').append(row);
			});
		}

		// Button actions
		$('.editButton').click(function() {
			editItem(item, index);
		});
		$('.deleteButton').click(function() {
			deleteItem(index);
		});

		// Handle form submission
		$('#save').click(function(e) {
			e.preventDefault();
			const data = JSON.parse(localStorage.getItem('data')) || [];
			const index = parseInt($('#editIndex').val());
			if (index === -1) {
				// Add new item
				data.push({ column1: $('#column1').val(), column2: $('#column2').val(), column3: $('#column3').val() });
			} else {
				// Edit existing item
				data[index] = { column1: $('#column1').val(), column2: $('#column2').val(), column3: $('#column3').val() };
				$('#editIndex').val() = -1; // Reset edit index
				$('#cancelButton').addClass('hidden');
			}
			localStorage.setItem('data', JSON.stringify(data));
			document.getElementById('dataForm').reset();
			loadData();
		});

		// Edit item
		function editItem(item, index) {
			$('#column1').val() = item.column1;
			$('#column2').val() = item.column2;
			$('#column3').val() = item.column3;
			if ($('#editIndex').val() != -1) {
				document.getElementById('row_' + $('#editIndex').val()).classList.remove('hidden');
			}
			$('#editIndex').val() = index;
			$('#cancelButton').style.display = 'inline-block';
			document.getElementById('row_' + index).classList.add('hidden');
		}

		// Cancel editing
		$('#cancelButton').click(function() {
			document.getElementById('dataForm').reset();
			document.getElementById('row_' + $('#editIndex').val()).removeClass('hidden');
			$('#editIndex').val() = -1;
			$('#cancelButton').style.display = 'none';
		});

		// Delete item
		function deleteItem(index) {
			const data = JSON.parse(localStorage.getItem('data')) || [];
			data.splice(index, 1);
			localStorage.setItem('data', JSON.stringify(data));
			loadData();
		}

		// Export data
		$('#exportButton').click(function() {
			const data = JSON.parse(localStorage.getItem('data')) || [];
			const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'data.json';
			a.click();
			URL.revokeObjectURL(url);
		});
		
		// Remove all data
		$('#clearDataButton').click(function() {
			localStorage.removeItem('data');
			loadData();
		});

		// Initial data load
		loadData();
});