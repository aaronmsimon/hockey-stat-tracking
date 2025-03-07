$(document).ready(function() {
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
			const videoTime = '0:' + $('#video-minutes').val() + ':' + $('#video-seconds').val();
			var team;
			var player;
			$('.player-DaBeers').each(function(index) {
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
					team = $(this).attr('data-team');
					player = $(this).attr('data-player-number');
				}
			});
			const period = $('input[name="period"]:checked').val();
			const gameTime = '0:' + $('#game-minutes').val() + ':' + $('#game-seconds').val();
			const gameEvent = $('#event').val();
			var additionalInfo = '';
			var location = '';
			
			const data = JSON.parse(localStorage.getItem('gameEvents')) || [];
			const index = parseInt($('#editIndex').val());
			if (index === -1) {
				// Add new item
				switch (gameEvent) {
					case 'Minus':
					case 'Plus':
						$('#ice .player').each(function(index) {
							addEvent(
								videoTime,
								$(this).attr('data-team'),
								period,
								gameTime,
								$(this).attr('data-player-number'),
								gameEvent,
								additionalInfo,
								location
							);
						});
						break;
					case 'Penalty':
						addEvent(
							videoTime,
							team,
							period,
							gameTime,
							player,
							gameEvent,
							$('#additional-info').val(),
							location
						);
						break;
					case 'Won faceoff against':
						var loser;
						if ($('#faceoff-winner').val() != 'Opponent') {
							loser = $('.player-' + $('#opponent-team').val() + '.selected').attr('data-player-number');
						} else {
							loser = player;
							player = $('.player-' + $('#opponent-team').val() + '.selected').attr('data-player-number');
							team = $('.player-' + $('#opponent-team').val() + '.selected').attr('data-team');
						}
						addEvent(
							videoTime,
							team,
							period,
							gameTime,
							player,
							gameEvent,
							loser,
							$('#loc').val()
						);
						$('.player-' + $('#opponent-team').val() + '.selected').removeClass('selected');
						break;
					default:
						addEvent(
							videoTime,
							team,
							period,
							gameTime,
							player,
							gameEvent,
							additionalInfo,
							location
						);
				}
			} else {
				// Edit existing item
				data[index] = { column1: $('#column1').val(), column2: $('#column2').val(), column3: $('#column3').val() };
				$('#editIndex').val() = -1; // Reset edit index
				$('#cancelButton').addClass('hidden');
			}
			document.getElementById('dataForm').reset();
			eventAdditions();
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
			const data = JSON.parse(localStorage.getItem('gameEvents')) || [];
			data.splice(index, 1);
			localStorage.setItem('gameEvents', JSON.stringify(data));
			loadData();
		}

		// Export data
		$('#exportButton').click(function() {
			/*
			const data = JSON.parse(localStorage.getItem('gameEvents')) || [];
			const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'data.json';
			a.click();
			URL.revokeObjectURL(url);
			*/
			const csvData = jsonToCsv(JSON.parse(localStorage.getItem('gameEvents')) || []);
			downloadCsv(csvData, 'game-events.csv');
		});
		
		// Remove all data
		$('#clearDataButton').click(function() {
			localStorage.removeItem('gameEvents');
			loadData();
		});

		// Initial data load
		loadData();
		
		// Select Event with additional fields
		$('#event').click(eventAdditions);
		
		function eventAdditions() {
			switch ($('#event').val()) {
				case 'Won faceoff against':
					$('#location-selection').removeClass('hidden').addClass('inline');
					$('#faceoff-winner-selection').removeClass('hidden').addClass('inline');
					break;
				case 'Penalty':
					$('#additional-info-input').removeClass('hidden').addClass('inline');
					$('#additional-info-input label').text('Minutes');
					$('#additional-info').css('width','40px');
					break;
				default:
					$('#location-selection').removeClass('inline').addClass('hidden');
					$('#faceoff-winner-selection').removeClass('inline').addClass('hidden');
					$('#additional-info-input').removeClass('inline').addClass('hidden');
			}			
		}
		
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
		  minutesElem.val(minutes.toString().padStart(2, '0'));
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

// Load and display existing data
function loadData() {
	const data = JSON.parse(localStorage.getItem('gameEvents')) || [];
	$('#dataRows').empty();
	data.forEach((item, index) => {
		const row = $('<tr>');
		row.html(`
			<td class="video-time">${item.videotime}</td>
			<td class="team">${item.team}</td>
			<td class="period">${item.period}</td>
			<td class="game-time">${item.gametime}</td>
			<td class="event-player">${item.player}</td>
			<td class="stat-type">${item.gameevent}</td>
			<td class="additional-info">${item.additionalinfo}</td>
			<td class="location">${item.location}</td>
			<td class="controls">
				<button id="row_${index}" class="editButton"><i class="fas fa-pencil-alt"></i></button>
				<button class="deleteButton"><i class="fas fa-trash-alt"></i></button>
			</td>
		`);
		$('#dataRows').append(row);
	});
}
		
// Add Event
function addEvent(videoTime, team, period, gameTime, player, eventType, additionalInfo, location) {
	const gameEvents = JSON.parse(localStorage.getItem('gameEvents')) || [];
	
	gameEvents.push({
		videotime: videoTime,
		team: team,
		period: period,
		gametime: gameTime,
		player: player,
		gameevent: eventType,
		additionalinfo: additionalInfo,
		location: location
	});
	localStorage.setItem('gameEvents', JSON.stringify(gameEvents));
	loadData();
}
/* template
	addEvent(
		videoTime,
		team,
		period,
		gameTime,
		player,
		eventType,
		additionalInfo,
		location
	);
*/