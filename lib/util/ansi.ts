// See: https://gist.github.com/kkrypt0nn/a02506f3712ff2d1c8ca7c9e0aed7c06

/*  Styles
        0 = Normal
        1 = Bold
        4 = Underline
*/

/*  Foreground Colours
        30 = Gray
        31 = Red
        32 = Green
        33 = Yellow
        34 = Blue
        35 = Pink
        36 = Cyan
        37 = White
*/

export namespace ANSI {
	const escape = `[0m`;

	//    \u001b[{format};{color}m
	const color = (style: number, color: number) => `[${style};${color}m`;

	export const red = (str: string) => `${color(0, 31)}${str}${escape}`;
}
