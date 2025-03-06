$(document).ready(function() {
		// Load and display existing data
		function loadData() {
			const data = JSON.parse(localStorage.getItem('data')) || [];
			$('#dataRows').empty();
			data.forEach((item, index) => {
				const row = $('<tr>');
				row.html(`
					<td>${item.videotime}</td>
					<td>${item.team}</td>
					<td>${item.period}</td>
					<td>${item.gametime}</td>
					<td>${item.player}</td>
					<td>${item.gameevent}</td>
					<td>${item.additionalinfo}</td>
					<td>${item.location}</td>
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
				data.push({
					videotime: '0:' + $('#video-minutes').val() + ':' + $('#video-seconds').val(),
					team: '',
					period: $('input[name="period"]:checked').val(),
					gametime: '0:' + $('#game-minutes').val() + ':' + $('#game-seconds').val(),
					player: '',
					gameevent: '',
					additionalinfo: '',
					location: ''
				});
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
		
		// Function to adjust time when arrows are clicked
		function adjustTime(timer, unit, amount) {
		  const minutesElem = $('#' + timer + '-minutes');
		  const secondsElem = $('#' + timer + '-seconds');
		  
		  let minutes = parseInt(minutesElem.val()) || 0;
		  let seconds = parseInt(secondsElem.val()) || 0;
		  
		  if (unit === 'minutes') {
			minutes += amount;
		  } else {
			seconds += amount;
		  }
		  
		  // Handle overflow/underflow
		  if (seconds >= 60) {
			minutes += 1;
			seconds -= 60;
		  } else if (seconds < 0) {
			minutes -= 1;
			seconds += 60;
		  }
		  
		  // Ensure minutes is always positive
		  if (minutes < 0) minutes = 0;
		  
		  // Format and set the values
		  minutesElem.val(minutes.toString());
		  secondsElem.val(seconds.toString().padStart(2, '0'));
		}
		
		$('#video-minutes-plus').click(function() {
			adjustTime('video','minutes', 1);
		});		
		$('#video-minutes-minus').click(function() {
			adjustTime('video','minutes', -1);
		});
		$('#video-seconds-plus').click(function() {
			adjustTime('video','seconds', 1);
		});		
		$('#video-seconds-minus').click(function() {
			adjustTime('video','seconds', -1);
		});
		
		$('#game-minutes-plus').click(function() {
			adjustTime('game','minutes', 1);
		});		
		$('#game-minutes-minus').click(function() {
			adjustTime('game','minutes', -1);
		});
		$('#game-seconds-plus').click(function() {
			adjustTime('game','seconds', 1);
		});		
		$('#game-seconds-minus').click(function() {
			adjustTime('game','seconds', -1);
		});
});