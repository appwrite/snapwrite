import domtoimage, { type Options } from 'dom-to-image';

export function save(dataUrl: string) {
	fetch(dataUrl)
		.then((res) => res.blob())
		.then((blob) => {
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'code.png';
			a.click();
			a.remove();
		});
}

export async function toImage(node: HTMLElement, format: 'svg' | 'png' | 'jpg', size: number = 1) {
	const options: Options = {
		width: node.offsetWidth * size,
		height: node.offsetHeight * size,
		quality: 1,
		style: {
			transform: `scale(${size})`,
			transformOrigin: 'top left',
			width: `${node.offsetWidth}px`,
			height: `${node.offsetHeight}px`,
			borderRadius: '0'
		}
	};

	let dataUrl: string;
	switch (format) {
		case 'png': {
			dataUrl = await domtoimage.toPng(node, options);
			break;
		}
		case 'svg': {
			dataUrl = await domtoimage.toSvg(node, options);
			break;
		}
		case 'jpg': {
			dataUrl = await domtoimage.toJpeg(node, options);
			break;
		}
	}

	return dataUrl;
}
