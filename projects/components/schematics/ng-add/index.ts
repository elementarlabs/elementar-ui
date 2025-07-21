import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
// import { readWorkspace } from '@schematics/angular/utility';
import { addPackageToPackageJson, getPackageVersionFromPackageJson } from '../utils/package-config';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';

const DEPENDENCIES = {
  '@elementar-ui/components': '^0.5.10',
  "@dicebear/collection": "^9.2.2",
  "@dicebear/core": "^9.2.2",
  "@iconify-json/circle-flags": "^1.2.4",
  "@iconify-json/ph": "^1.2.2",
  "@ngrx/signals": "^20.0.0-rc.0",
  "@ngrx/store": "^20.0.0-rc.0",
  "@tiptap/core": "2.10.2",
  "@tiptap/extension-bubble-menu": "2.10.2",
  "@tiptap/extension-code-block": "2.10.2",
  "@tiptap/extension-dropcursor": "2.10.2",
  "@tiptap/extension-floating-menu": "2.10.2",
  "@tiptap/extension-history": "2.10.2",
  "@tiptap/extension-horizontal-rule": "2.10.3",
  "@tiptap/extension-image": "2.10.2",
  "@tiptap/extension-link": "2.10.2",
  "@tiptap/extension-list-item": "2.10.2",
  "@tiptap/extension-ordered-list": "2.10.2",
  "@tiptap/extension-placeholder": "2.10.2",
  "@tiptap/extension-youtube": "2.10.2",
  "@tiptap/pm": "2.10.2",
  "@tiptap/starter-kit": "2.10.2",
  "awesome-phonenumber": "^6.12.0",
  "d3": "^7.9.0",
  "echarts": "^5.5.0",
  "emoji-toolkit": "^8.0.0",
  "iconify-icon": "^2.3.0",
  "libphonenumber-js": "^1.11.15",
  "uuid": "^11.0.3",
  "emojibase-data": "^16.0.2",
  "@ctrl/tinycolor": "^4.1.0"
};

const DEV_DEPENDENCIES = {
  '@tailwindcss/postcss': '^4.1.6',
  'autoprefixer': '^10.4.17',
  'postcss': '^8.5.2',
  'tailwindcss': '^4.1.6',
  '@tailwindcss/typography': '^0.5.16',
};

export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.log('info', `✅️ Running Schematics`);

    if (!tree.exists('/package.json')) {
      throw new Error('package.json is missing in this directory');
    }

    if (!tree.exists("/.postcssrc.json")) {
      tree.create("/.postcssrc.json", `{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
      `);
    }

    // Installing dependencies
    const angularCoreVersion = getPackageVersionFromPackageJson(tree, '@angular/core')!;
    const angularLocalizeVersion = getPackageVersionFromPackageJson(tree, '@angular/localize', true);
    const angularAnimationsVersion = getPackageVersionFromPackageJson(tree, '@angular/animations');
    const angularCdkVersion = getPackageVersionFromPackageJson(tree, '@angular/cdk');
    const angularMaterialVersion = getPackageVersionFromPackageJson(tree, '@angular/material');

    if (angularLocalizeVersion === null) {
      addPackageToPackageJson(tree, '@angular/localize', angularCoreVersion, true);
    }

    if (angularAnimationsVersion === null) {
      addPackageToPackageJson(tree, '@angular/animations', angularCoreVersion);
    }

    if (angularCdkVersion === null) {
      addPackageToPackageJson(tree, '@angular/cdk', angularCoreVersion);
    }

    if (angularMaterialVersion === null) {
      addPackageToPackageJson(tree, '@angular/material', angularCoreVersion);
    }

    for (const name in DEPENDENCIES) {
      // @ts-ignore
      addPackageToPackageJson(tree, name, DEPENDENCIES[name]);
    }

    for (const name in DEV_DEPENDENCIES) {
      // @ts-ignore
      addPackageToPackageJson(tree, name, DEV_DEPENDENCIES[name], true);
    }

    context.addTask(new RunSchematicTask('ng-add-setup-project', options), [
      context.addTask(new NodePackageInstallTask()),
    ]);
    context.addTask(new RunSchematicTask('ng-add-fonts', options));
    return tree;
  };
}
