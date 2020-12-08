/**
 * Default SCSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.scss' {
	const content: string
	export default content
}
/**
 * Default SCSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
declare module '*.module.scss' {
	const content: { [className: string]: string }
	export default content
}

interface SvgrComponent extends React.FunctionComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
	const svgUrl: string
	const svgComponent: SvgrComponent
	export default svgUrl
	export { svgComponent as ReactComponent }
}
