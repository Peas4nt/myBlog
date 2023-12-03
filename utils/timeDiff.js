export default (time) => {
	const createdAt = new Date(time);
	const dateNow = new Date();

	const diffTime = Math.abs(dateNow - createdAt);
	const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

	if (diffDays > 30) {
		return "Created at: " + createdAt.toLocaleDateString("lv-LV", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		});
	} else if (diffDays > 1) {
		return `Created ${diffDays} days ago`;
	} else {
		const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
		if (diffHours > 1) {
			return `Created ${diffHours} hours ago`;
    } else {
      const diffMinutes = Math.ceil(diffTime / (1000 * 60))
			return `Created ${diffMinutes} minutes ago`;
		}
	}
};
