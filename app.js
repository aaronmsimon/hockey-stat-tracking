$(document).ready(function() {
	var gameTimeMinutes = 20;
	var gameTimeSeconds = 0;
	
		// Button actions
		$(document).on('click', '.editButton', function() {
			var index = $(this).attr('id').substring(5);
			editItem(index);
		});
		$(document).on('click', '.deleteButton', function() {
			var index = $(this).attr('id').substring(7);
			deleteItem(index);
		});
		$(document).on('click', '.saveButton', function() {
			const index = $(this).data('index');
			const row = $(this).closest('tr');
			const data = JSON.parse(localStorage.getItem('gameEvents')) || [];
			
			// Get values from input fields
			const updatedItem = {
				videotime: row.find('.video-time input').val(),
				team: row.find('.team input').val(),
				period: row.find('.period input').val(),
				gametime: row.find('.game-time input').val(),
				player: row.find('.event-player input').val(),
				gameevent: row.find('.stat-type input').val(),
				additionalinfo: row.find('.additional-info input').val(),
				location: row.find('.location input').val()
			};
			
			// Update the data
			data[index] = updatedItem;
			localStorage.setItem('gameEvents', JSON.stringify(data));
			
			// Reload the table to show normal view
			loadData();
			$('#editIndex').val(-1);
		});

		// Cancel editing
		$(document).on('click', '.cancelEditButton', function() {
			// Just reload the table to restore original view
			loadData();
			$('#editIndex').val(-1);
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
						var opponentTeam = $('#opponent-team').val().replace(' ','');
						var loser;
						if ($('#faceoff-winner').val() != 'Opponent') {
							loser = $('.player-' + opponentTeam + '.selected').attr('data-player-number');
						} else {
							loser = player;
							player = $('.player-' + opponentTeam + '.selected').attr('data-player-number');
							team = $('.player-' + opponentTeam + '.selected').attr('data-team');
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
						$('.player-' + opponentTeam + '.selected').removeClass('selected');
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
			}
			
			document.getElementById('dataForm').reset();
			eventAdditions();
			LoadGameInfo();
		});
		
		// Edit item
		function editItem(index) {
			// Get the data for this row
			const data = JSON.parse(localStorage.getItem('gameEvents')) || [];
			const item = data[index];
			
			// Find the row
			const row = $(`#edit_${index}`).closest('tr');
			
			// Replace each cell with input fields
			row.find('.video-time').html(`<input type="text" class="edit-input" value="${item.videotime}">`);
			row.find('.team').html(`<input type="text" class="edit-input" value="${item.team}">`);
			row.find('.period').html(`<input type="text" class="edit-input" value="${item.period}">`);
			row.find('.game-time').html(`<input type="text" class="edit-input" value="${item.gametime}">`);
			row.find('.event-player').html(`<input type="text" class="edit-input" value="${item.player}">`);
			row.find('.stat-type').html(`<input type="text" class="edit-input" value="${item.gameevent}">`);
			row.find('.additional-info').html(`<input type="text" class="edit-input" value="${item.additionalinfo}">`);
			row.find('.location').html(`<input type="text" class="edit-input" value="${item.location}">`);
			
			// Replace the edit/delete buttons with save/cancel buttons
			row.find('.controls').html(`
				<button class="saveButton" data-index="${index}"><i class="fas fa-check"></i></button>
				<button class="cancelEditButton" data-index="${index}"><i class="fas fa-times"></i></button>
			`);
			$('#editIndex').val(index);
			//$('#cancelButton').css('display', 'inline-block');
		}

		// Cancel editing
		$('#cancelButton').click(function() {
			document.getElementById('dataForm').reset();
			$('#editIndex').val(-1);
			$('#cancelButton').css('display', 'none');
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
		
		$('#resetGameInfoButton').click(function() {
			ResetGameInfo();
		});

		// Load gameInfo
		LoadGameInfo();
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
		  
		  if (timer == 'game') {
			  if (unit == 'minutes') {
				  gameTimeMinutes = minutes;
			  } else {
				  gameTimeSeconds = seconds;
			  }
		  }
		}
		
		// Save gameInfo if editing Opponent or Period
		$('#opponent-team').change(function() {
			SaveGameInfo();
		});
		$('input[name="period"]').change(function() {
			SaveGameInfo();
		});
			
		$('#video-minutes-plus').click(function() {
			adjustTime('video','minutes', 1);
			adjustTime('game','minutes', -1);
			SaveGameInfo();
		});		
		$('#video-minutes-minus').click(function() {
			adjustTime('video','minutes', -1);
			adjustTime('game','minutes', 1);
			SaveGameInfo();
		});
		$('#video-seconds-plus').click(function() {
			adjustTime('video','seconds', 1);
			adjustTime('game','seconds', -1);
			SaveGameInfo();
		});		
		$('#video-seconds-minus').click(function() {
			adjustTime('video','seconds', -1);
			adjustTime('game','seconds', 1);
			SaveGameInfo();
		});
		
		$('#game-minutes-plus').click(function() {
			adjustTime('game','minutes', 1);
			adjustTime('video','minutes', -1);
			SaveGameInfo();
		});		
		$('#game-minutes-minus').click(function() {
			adjustTime('game','minutes', -1);
			adjustTime('video','minutes', 1);
			SaveGameInfo();
		});
		$('#game-seconds-plus').click(function() {
			adjustTime('game','seconds', 1);
			adjustTime('video','seconds', -1);
			SaveGameInfo();
		});		
		$('#game-seconds-minus').click(function() {
			adjustTime('game','seconds', -1);
			adjustTime('video','seconds', 1);
			SaveGameInfo();
		});
		
		$('.timer-input').change(function() {
			SaveGameInfo();
		});
		/*
		$('#game-minutes').change(function() {
			let minutes = parseInt($(this).val()) || 0;
			let gameMinutes = parseInt(gameTimeMinutes);
			adjustTime('video','minutes', gameMinutes - minutes);
		    gameTimeMinutes = minutes;
		});
		$('#game-seconds').change(function() {
			let seconds = parseInt($(this).val());
			let gameSeconds = parseInt(gameTimeSeconds);
			adjustTime('video','seconds', seconds - gameSeconds);
		    gameTimeSeconds = seconds;
		});
		*/
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
				<button id="edit_${index}" class="editButton"><i class="fas fa-pencil-alt"></i></button>
				<button id="delete_${index}" class="deleteButton"><i class="fas fa-trash-alt"></i></button>
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

// Reset gameInfo values
function ResetGameInfo() {
  localStorage.removeItem('gameInfo');
  const gameInfo = {
	opponent: null,
	videoMinutes: 0,
    videoSeconds: 0,
    gameMinutes: 20,
    gameSeconds: 0,
    period: '1st'
  };
  localStorage.setItem('gameInfo', JSON.stringify(gameInfo));
  LoadGameInfo();
}
// Load gameInfo values
function LoadGameInfo() {
	const gameInfo = JSON.parse(localStorage.getItem('gameInfo'));
	$('#opponent-team').val(gameInfo.opponent);
	$('#video-minutes').val(gameInfo.videoMinutes.toString().padStart(2, '0'));
	$('#video-seconds').val(gameInfo.videoSeconds.toString().padStart(2, '0'));
	$('#game-minutes').val(gameInfo.gameMinutes.toString().padStart(2, '0'));
	$('#game-seconds').val(gameInfo.gameSeconds.toString().padStart(2, '0'));
	$('input[name="period"][value="' + gameInfo.period + '"]').prop('checked', true);
}
// Save gameInfo values
function SaveGameInfo() {
  const gameInfo = JSON.parse(localStorage.getItem('gameInfo'));
  gameInfo.opponent = $('#opponent-team').val();
  gameInfo.videoMinutes = $('#video-minutes').val();
  gameInfo.videoSeconds = $('#video-seconds').val();
  gameInfo.gameMinutes = $('#game-minutes').val();
  gameInfo.gameSeconds = $('#game-seconds').val();
  gameInfo.period = $('input[name="period"]:checked').val();
  localStorage.setItem('gameInfo', JSON.stringify(gameInfo));
}