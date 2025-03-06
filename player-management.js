$(document).ready(function() {
	const bench = $('#bench');
	const ice = $('#ice');
	bench.droppable({drop: function(event, ui) {PlayerDropped(event, ui);}});
	ice.droppable({drop: function(event, ui) {PlayerDropped(event, ui);}});
	let playerCount = 0;
	let activePlayers = {};

	// Player management functionality
	$('#add-player-btn').click(function() {
		const playerNumber = $('#player-number').val();
		var playerTeam;
		if ($('#player-team').val() != 'Opponent') {
			playerTeam = $('#player-team').val();
		} else {
			playerTeam = $('#opponent-team').val();
		}

		if (!playerNumber) {
			alert('Please enter a jersey number');
			return;
		}

		// Check if player number already exists in the same team
		const existingPlayers = $(`.player-${playerTeam.replace(' ','')}`);
		for (let i = 0; i < existingPlayers.length; i++) {
			if (existingPlayers[i].getAttribute('data-player-number') === playerNumber) {
				alert(`Player with jersey number ${playerNumber} already exists on the ${playerTeam}`);
				return;
			}
		}

		// Create a new player element
		createPlayer(playerNumber, playerTeam);

		// Reset form
		$('#player-number').val('');
	});

	// Function to create a player element
	function createPlayer(number, team) {
		// Set up new div for Player
		const playerId = `player-${team.replace(' ','')}-${number}-${playerCount++}`;
		var playerDiv = $('<div>', {
			'id': playerId,
			'class': `player player-${team.replace(' ','')}`,
			'data-player-number': number,
			'data-team': team
		}).draggable({ revert: "invalid" });
		
		if ($('#player-team').val() != 'Opponent') {
			$('#bench').append(playerDiv);
		} else {
			$('#opponents').append(playerDiv);
		}
		
		// Clone the t-shirt template
        const tshirtTemplate = document.getElementById('tshirt-template');
        const tshirtSvg = tshirtTemplate.content.cloneNode(true);

		// Add the jersey number
		const numberDiv = $('<div>', {
			'class': 'player-number',
			'html': number
		});
		
		playerDiv.append(tshirtSvg).append(numberDiv);
		
		// Store player in active players
		/*
		activePlayers[playerId] = {
			id: playerId,
			number: number,
			team: team,
			location: 'bench',
			timeAdded: new Date()
		};
		*/
	}
	
	// Function when Player is dropped
	function PlayerDropped(e, ui) {
		// if accidental drag, bail out
		const bail = e.target.id == ui.draggable.parent().attr('id');
		
		$(e.target).append($(ui.draggable).detach().css({'top':'', 'left':''}));
		
		if (bail) return;
		
		var moveType;
		if (e.target.id == 'ice') {
			moveType = 'Entered Ice';
		} else {
			moveType = 'Left Ice';
		}
		addEvent(
			'0:' + $('#video-minutes').val() + ':' + $('#video-seconds').val(),
			ui.draggable.attr('data-team'),
			$('input[name="period"]:checked').val(),
			'0:' + $('#game-minutes').val() + ':' + $('#game-seconds').val(),
			ui.draggable.attr('data-player-number'),
			moveType,
			'',
			''
		);
	}
	
	// Select a player
	$('.player-area').on('click', '.player', function() {
		const selected = $(this).hasClass('selected');
		const team = $(this).attr('data-team');
		$('[data-team="' + team + '"]').each(function(index) {
			$(this).removeClass('selected');
		});
		if (selected) {
			$(this).removeClass('selected');
		} else {
			$(this).addClass('selected');
		}
	});
});