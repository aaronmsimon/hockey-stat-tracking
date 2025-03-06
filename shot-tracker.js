function initClickHandler() {
	const rink = document.getElementById('rink');
	
	rink.addEventListener('click', function(event) {
		// Get the SVG's bounding rectangle
		const svgRect = rink.getBoundingClientRect();
		
		// Calculate the scaling factors
		const scaleX = 620 / svgRect.width;
		const scaleY = 263.5 / svgRect.height;
		
		// Get click coordinates relative to the SVG viewport
		const x = (event.clientX - svgRect.left) * scaleX;
		const y = (event.clientY - svgRect.top) * scaleY;
		
		// Check if the click is within the background element bounds
		if (x >= 0 && x <= 620 && y >= 0 && y <= 263.5) {
			// Round to 2 decimal places for cleaner output
			const roundedX = Math.round(x * 100) / 100;
			const roundedY = Math.round(y * 100) / 100;
			
			//console.log(`Coordinates: x=${roundedX}, y=${roundedY}`);
		}
		
		//const team1color = document.getElementById('team1-color').value;
		//const team2color = document.getElementById('team2-color').value;
		const team1color = "#000000";
		const team2color = "#000000";
		
		// Create the elements
		const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
		const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
		const shotType = document.querySelector('input[name="shot-type"]:checked').value;
		const player = $('.player.selected').attr('data-player-number');
		const teamSelected = $('.player.selected').attr('data-team');
		
		// Set all the attributes
		use.setAttribute("fill", teamSelected == "team1" ? team1color : team2color);
		use.setAttribute("stroke", shotType == "Shot on Goal" ? "none" : "#FFF");
		use.setAttribute("stroke-width", shotType == "Shot on Goal" ? "1.5" : "3");
		use.setAttribute("class", shotType == "Shot on Goal" ? "missed" : "made");
		use.setAttribute("x", -x + 620);
		use.setAttribute("y", y);
		use.setAttribute("href", "#" + (shotType == "Shot on Goal" ? "missed" : "made"));
		if (shotType != "Shot on Goal") { use.setAttribute("stroke-opacity", "1"); }
		
		// Add the use element to the g element
		g.appendChild(use);
		
		// Find the target group and add our new group to it
		const targetGroup = document.getElementById("team1");
		if (targetGroup) {
			targetGroup.appendChild(g);
		}
		
		// Add data to table		
		addEvent(
			'0:' + $('#video-minutes').val() + ':' + $('#video-seconds').val(),
			teamSelected,
			$('input[name="period"]:checked').val(),
			'0:' + $('#game-minutes').val() + ':' + $('#game-seconds').val(),
			player,
			shotType,
			'',
			x.toFixed(2) + ', ' + y.toFixed(2)
		);
		$('.player.selected').removeClass('selected');
	});
}

// Call this function after the SVG is loaded
initClickHandler();