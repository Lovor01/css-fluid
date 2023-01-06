// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	/**
	 * Calculates percentage
	 * @param {string} environment
	 */
	function calculateAndReplace(type = 'font', environment = 'desktop') {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello VS Code!')

		/**
		 * Async function because showInputBox is async
		 * @returns
		 */
		async function fontProcedure() {
			function fluidFont(selectionText) {
				const factor = (selectionText - min_font_size) / 1506 * 100;
				// return `calc(${min_font_size_in_REM} + (${selectionText} - {min_font_size}) * ((100vw - min_viewport_including_unit) / (max_viewport - min_viewport)))`
				return `clamp(${min_font_size / 16}rem, calc(${min_font_size_in_REM} + ${factor} * (1vw - 4.14px)), ${selectionText / 16}rem)`;
			}
			let min_font_size = await vscode.window.showInputBox({
				prompt: 'Minimum font size in px',
				value: '18'
			});
			if (! min_font_size)
				return;
			const min_font_size_in_REM = min_font_size ? parseInt(min_font_size) / 16 + 'rem' : '1.125rem';
			replaceWithCalculated(fluidFont);
		};

		function replaceWithCalculated(calculateCallback) {
			if (editor)
				editor.edit(function(editBuilder) {
					// const selection = editor.document.getWordRangeAtPosition(editor.selection.active.translate(0, -1));
					const selection = editor.document.getWordRangeAtPosition(editor.selection.active);
					const selectionText = editor.document.getText(selection);
					if (!selection || isNaN(Number(selectionText))) {
						vscode.window.showErrorMessage('Text before cursor is not a number!')
						return;
					}
					editBuilder.replace(
						selection,
						calculateCallback(selectionText, environment)
					)
				})
				.then(() => {
					const lastPosition = editor.selection.end;
					editor.selection = new vscode.Selection(lastPosition, lastPosition);
				});
		}

		function sizePercentage(selectionText, environment) {
			return (parseInt(selectionText) / (environment === 'desktop' ? 1920 : 414) * 100).toFixed(3) + '%';
		}


		const editor = vscode.window.activeTextEditor;
		if (type === 'font')
			fontProcedure();
		else
			replaceWithCalculated(sizePercentage)
	}


	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "css-fluid" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('css-fluid.desktopPercentage', () => {
		calculateAndReplace('percent', 'desktop')
	});
	let disposable1 = vscode.commands.registerCommand('css-fluid.mobilePercentage', () => {
		calculateAndReplace('percent', 'mobile')
	});
	let disposable2 = vscode.commands.registerCommand('css-fluid.fluidFont', () => {
		calculateAndReplace('font')
	});

	context.subscriptions.push(disposable, disposable1, disposable2);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}