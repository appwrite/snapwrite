type BaseOptions = {
	style?: string;
};

type JpegOptions = BaseOptions & {
	quality?: number;
};

type PngOptions = BaseOptions;
type SvgOptions = BaseOptions;

declare module 'dom-to-image-more' {
	type Returned = {
		toPng: (node: HTMLElement, options?: PngOptions) => Promise<string>;
		toJpeg: (node: HTMLElement, options?: JpegOptions) => Promise<string>;
		toSvg: (node: HTMLElement, options?: SvgOptions) => Promise<string>;
	};

	export default {} as Returned;
}
