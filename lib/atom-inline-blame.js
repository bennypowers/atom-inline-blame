'use babel';

import InlineBlameView from './InlineBlameView';

export default {
  watchedEditors: null,

  config: {
    format: {
      type: "string",
      default: `%author%, %relativeTime% ago - %summary%`,
      description: "Available tokens: author, authorEmail, relativeTime, authorTime, authorTimezone, committer, summary",
    },
    timeout: {
      type: "number",
      default: 200,
      description: "Delay after which the inline blame summary will be displayed. Useful when navigating using cursor keys to prevent unnecessarily fetching history for each line.",
    }
  },

  activate(state) {
    this.watchedEditors = [];

    this.subscription = atom.workspace.observeTextEditors(editor => {
      const { id } = editor;
       if (this.watchedEditors.includes(id)) return;

       this.watchedEditors.push(id);
       new InlineBlameView(editor);

       editor.onDidDestroy(() => {
         const thisEditor = this.watchedEditors.indexOf(id);
         this.watchedEditors.splice(thisEditor, 1);
       });
     });
   },

  deactivate() {
    this.subscription.dispose();
  },
};
