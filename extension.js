// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require( 'vscode' );

let divisor;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate ( context ) {
	/**
	 * Calculates percentage
	 * @param {string} environment
	 */
	function calculateAndReplace (
		type = 'font',
		environment = 'desktop',
		askForSizes = false,
	) {
		// for font interpolation if given in rem
		let isRem = false;
		/**
		 * Async function because showInputBox is async
		 * @returns
		 */
		async function fontProcedure () {
			function fluidFont ( selectionText, environment, isRem = false ) {
				min_font_size = parseFloat( min_font_size ) * (isRem ? 16 : 1);
				// factor is calculated from values in px
				const factor = (
					( selectionText - min_font_size ) /
					( desktop_size - mobile_size )
				);
				const mobileInRem = ( mobile_size / 16 );
				const min_font_size_in_REM = min_font_size
				? min_font_size / 16 + 'rem'
				: '1.125rem';
				const max_font_size_in_REM = selectionText / 16;
				// return `calc(${min_font_size_in_REM} + (${selectionText} - {min_font_size}) * ((100vw - min_viewport_including_unit) / (max_viewport - min_viewport)))` - formula!
				// return `clamp(${min_font_size / 16}rem, calc(${min_font_size_in_REM} + ${factor} * (1vw - 0.25875rem)), ${selectionText / 16}rem)`; for desktop 1920 and mobile 414
				return `clamp(${min_font_size / 16
					}rem, calc(${min_font_size_in_REM} + ${(factor * 100).toFixed(4)}vw - ${(factor * mobileInRem).toFixed(4)}rem), ${max_font_size_in_REM}rem)`;
			}

			async function pickSource ( prompt, property ) {
				return (askForSizes || property === 'minValue')
					? await vscode.window.showInputBox( {
						prompt,
						value: configuration[ property ],
					} )
					: configuration[ property ];
			}


			const desktop_size = await pickSource( 'Desktop width', 'desktopWidth' );
			const mobile_size = await pickSource( 'Mobile width', 'mobileWidth' );
			let min_font_size = await pickSource( 'Minimum value', 'minValue' );
			if ( !min_font_size ) return;

			replaceWithCalculated( fluidFont );
		}

		function fontInRem () {
			replaceWithCalculated( selectionText => selectionText / 16 + 'rem' );
		}

		function replaceWithCalculated ( calculateCallback ) {

			if ( editor )
				editor
					.edit( function ( editBuilder ) {
						// const selection = editor.document.getWordRangeAtPosition(editor.selection.active.translate(0, -1));
						const selection = editor.document.getWordRangeAtPosition(
							editor.selection.active,
						);
						let selectionText = editor.document.getText( selection );

						if ( selectionText.endsWith( 'rem' ) ) {
							isRem = true;
							selectionText = selectionText.slice( 0, -3 );
						}

						// Remove px if last two characters
						const sanitizedSelectionText = (selectionText.endsWith( 'px' )
							? selectionText.slice( 0, -2 )
							: selectionText);

						if ( !selection || isNaN( Number( sanitizedSelectionText ) ) ) {
							vscode.window.showErrorMessage(
								'Text before cursor is not a number!',
							);
							return;
						}
						editBuilder.replace(
							selection,
							calculateCallback( sanitizedSelectionText * (isRem ? 16 : 1), environment, isRem ),
						);
					} )
					.then( () => {
						const lastPosition = editor.selection.end;
						editor.selection = new vscode.Selection(
							lastPosition,
							lastPosition,
						);
					} );
		}

		function sizePercentage ( selectionText, environment ) {
			const sizeMap = new Map( [
				[ 'desktop', configuration.desktopWidth ],
				[ 'desktop-content', configuration.desktopContent ],
				[ 'mobile', configuration.mobileWidth ],
				[ 'divisor', divisor ],
			] );
			return (
				(
					( parseInt( selectionText ) / sizeMap.get( environment ) ) *
					100
				).toFixed( 3 ) + '%'
			);
		}

		const configuration = vscode.workspace.getConfiguration( 'css-fluid' );
		const editor = vscode.window.activeTextEditor;
		if ( type === 'font' )
			if ( environment === 'rem' ) fontInRem();
			else fontProcedure();
		else replaceWithCalculated( sizePercentage );
	}

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "css-fluid" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(
		'css-fluid.desktopPercentage',
		() => {
			calculateAndReplace( 'percent', 'desktop' );
		},
	);
	let disposable1 = vscode.commands.registerCommand(
		'css-fluid.desktopContentPercentage',
		() => {
			calculateAndReplace( 'percent', 'desktop-content' );
		},
	);
	let disposable2 = vscode.commands.registerCommand(
		'css-fluid.mobilePercentage',
		() => {
			calculateAndReplace( 'percent', 'mobile' );
		},
	);
	let disposable3 = vscode.commands.registerCommand(
		'css-fluid.fluidFontDoNotAsk',
		() => {
			calculateAndReplace( 'font', undefined, false );
		},
	);
	let disposable4 = vscode.commands.registerCommand(
		'css-fluid.fluidFontAsk',
		() => {
			calculateAndReplace( 'font', undefined, true );
		},
	);
	let disposable5 = vscode.commands.registerCommand(
		'css-fluid.setDivisor',
		async function () {
			divisor = await vscode.window.showInputBox( {
				prompt: 'Set divisor',
				value: '',
			} );
		},
	);
	let disposable6 = vscode.commands.registerCommand(
		'css-fluid.percentageByDivisor',
		() => {
			calculateAndReplace( 'percent', 'divisor' );
		},
	);
	let disposable7 = vscode.commands.registerCommand(
		'css-fluid.fontFromPixelToRem',
		() => {
			calculateAndReplace( 'font', 'rem' );
		},
	);

	vscode.commands.executeCommand(
		'setContext',
		'css-fluid.supportedLanguages',
		[ 'css', 'scss', 'sass', 'html', 'json' ],
	);

	context.subscriptions.push(
		disposable,
		disposable1,
		disposable2,
		disposable3,
		disposable4,
		disposable5,
		disposable6,
		disposable7,
	);
}

// This method is called when your extension is deactivated
function deactivate () {}

module.exports = {
	activate,
	deactivate
}