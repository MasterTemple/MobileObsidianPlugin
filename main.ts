import { App, Editor, EditorPosition, EditorSuggest, EditorSuggestContext, EditorSuggestTriggerInfo, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

class MyEditorSuggest extends EditorSuggest<string> {
    constructor(app: App) {
        super(app);
    }

    onTrigger(cursor: EditorPosition, editor: Editor, _file: any): EditorSuggestTriggerInfo | null {
        const line = editor.getLine(cursor.line);
		const beforeCursor = line.substring(0, cursor.ch);
        // if (beforeCursor.endsWith('!')) {
            return {
				start: cursor,
				end: cursor,
				query: beforeCursor,
			};
        // }
        return null;
    }

    renderSuggestion(suggestion: string, el: HTMLElement): void {
        // Render the suggestion in the popup
        el.createEl('span', { text: suggestion });
    }

    selectSuggestion(suggestion: string, evt: MouseEvent | KeyboardEvent): void {
        // Handle the selection of a suggestion
        // Example: Insert the suggestion into the editor
        this.context!.editor.replaceSelection(suggestion);
        this.close();
    }

    getSuggestions(context: EditorSuggestContext): string[] {
		const query = context.query;
        // Return the list of suggestions
        return [
			'suggestion 1', 'suggestion 2', 'suggestion 3',
			`${query} - 1`, `${query} - 2`, `${query} - 3`,
		];
    }
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerEditorSuggest(new MyEditorSuggest(this.app))

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
