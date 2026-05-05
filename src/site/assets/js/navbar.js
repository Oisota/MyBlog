(() => {
	let menuOpen = false;
	document.getElementById('menu-btn').addEventListener('click', (event) => {
		const topbar = document.getElementById('topbar-nav');
		if (menuOpen) {
			topbar.style.display = 'none';
			menuOpen = false;
		} else {
			topbar.style.display = 'flex';
			menuOpen = true;
		}
	});
})();
