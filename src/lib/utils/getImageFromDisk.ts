export async function getImageFromDisk(): Promise<string> {
	return new Promise((resolve, reject) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = () => {
			if (input.files && input.files[0]) {
				const reader = new FileReader();
				reader.onload = (e) => {
					if (e.target && typeof e.target.result === 'string') {
						resolve(e.target.result);
					} else {
						reject('Could not read file');
					}
				};
				reader.readAsDataURL(input.files[0]);
			} else {
				reject('No file selected');
			}
		};
		input.click();
	});
}
