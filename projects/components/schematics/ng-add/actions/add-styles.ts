import * as path from 'path';
import { Rule, SchematicContext, Tree, SchematicsException } from '@angular-devkit/schematics';

import { Schema } from '../schema';
import { getProjectStyleFile } from '../../utils/project';
import { readWorkspace, writeWorkspace } from '@schematics/angular/utility';
// import { workspaces, JsonArray } from '@angular-devkit/core';

// const BOOTSTRAP_CSS_FILEPATH = 'node_modules/elementar-ui/components/styles/themes/default.scss';
const SUPPORTED_BOOTSTRAP_STYLE_IMPORTS = {
  '.sass': `
@use '@elementar-ui/components/styles/themes/default';
`,
  '.scss': `
@use '@elementar-ui/components/styles/themes/default';
`,
};

export function addStyles(options: Schema): Rule {
  // @ts-ignore
  return async (host: Tree, context: SchematicContext) => {
    context.logger.log('info', `✅ Add styles`);

    const workspace = await readWorkspace(host);
    const projects = workspace.projects.entries();
    let defaultProject = '';

    for (const project of projects) {
      if (project[1].sourceRoot === 'src') {
        defaultProject = project[0];
      }
    }

    const projectName = options.project || defaultProject;
    const project = workspace.projects.get(projectName);

    if (!project) {
      throw new SchematicsException('Project not found');
    }

    const styleFilePath = getProjectStyleFile(project as any) || '';
    const styleFileExtension = path.extname(styleFilePath);

    // @ts-ignore
    const styleFilePatch = SUPPORTED_BOOTSTRAP_STYLE_IMPORTS[styleFileExtension];

    // found supported styles
    if (styleFilePatch) {
      return addElementarToStylesFile(styleFilePath, styleFilePatch);
    } else {
      // // found some styles, but unsupported
      // if (styleFileExtension !== '.css' && styleFileExtension !== '') {
      //   context.logger.warn(messages.unsupportedStyles(styleFilePath));
      // }
      //
      await writeWorkspace(host, workspace);
    }
  };
}

function addElementarToStylesFile(styleFilePath: string, styleFilePatch: string): Rule {
  return (host: Tree) => {
    const styleContent = host.read(styleFilePath)!.toString('utf-8');
    const recorder = host.beginUpdate(styleFilePath);
    recorder.insertRight(styleContent.length, styleFilePatch);
    host.commitUpdate(recorder);
  };
}
