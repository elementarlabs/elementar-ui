import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { readWorkspace } from '@schematics/angular/utility';

import { Schema } from '../schema';

const MATERIAL_SYMBOLS_HREF = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block';
const OPEN_SANS_HREF = 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap';

function buildLinkTag(href: string): string {
  return `<link rel="stylesheet" href="${href}">`;
}

function insertIntoHead(html: string, tags: string[]): string {
  // If no <head>, just return unchanged
  const headCloseIndex = html.indexOf('</head>');
  if (headCloseIndex === -1) {
    return html;
  }

  // Compute insertion position just before </head>
  const before = html.slice(0, headCloseIndex);
  const after = html.slice(headCloseIndex);

  // Ensure newline separation
  const prefix = before.endsWith('\n') ? '' : '\n';
  const contentToInsert = tags.join('\n');

  return `${before}${prefix}${contentToInsert}\n${after}`;
}

export function addFonts(options: Schema): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    context.logger.log('info', `✅ Add Google Fonts links to index.html`);

    const workspace = await readWorkspace(tree);

    for (const [name, project] of workspace.projects) {
      // Target only application projects with a sourceRoot
      const sourceRoot = project.sourceRoot || 'src';
      const indexHtmlPath = `${sourceRoot}/index.html`;

      if (!tree.exists(indexHtmlPath)) {
        continue;
      }

      const buffer = tree.read(indexHtmlPath);
      if (!buffer) {
        continue;
      }

      const html = buffer.toString('utf-8');

      const needsMaterial = !html.includes(MATERIAL_SYMBOLS_HREF);
      const needsOpenSans = !html.includes(OPEN_SANS_HREF);

      if (!needsMaterial && !needsOpenSans) {
        continue;
      }

      const tags: string[] = [];
      if (needsMaterial) {
        tags.push(buildLinkTag(MATERIAL_SYMBOLS_HREF));
      }
      if (needsOpenSans) {
        tags.push(buildLinkTag(OPEN_SANS_HREF));
      }

      const updated = insertIntoHead(html, tags);

      if (updated !== html) {
        tree.overwrite(indexHtmlPath, updated);
        context.logger.log('info', `⬆️ Updated ${indexHtmlPath} with Google Fonts links in project "${name}"`);
      }
    }

    return tree;
  };
}
