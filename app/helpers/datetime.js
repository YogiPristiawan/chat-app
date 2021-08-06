exports.timeSince = (date) => {
	var seconds = Math.floor((new Date() - date) / 1000);

	var interval = seconds / 31536000;

	if (interval > 1) {
		return Math.floor(interval) + " tahun";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + " bulan";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return Math.floor(interval) + " hari";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + " jam";
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + " menit";
	}
	return Math.floor(seconds) + " detik";
};
