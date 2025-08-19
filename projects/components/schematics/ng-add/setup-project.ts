import { chain, Rule } from '@angular-devkit/schematics';

import { Schema } from './schema';
import { addStyles } from './actions/add-styles';
import { addFonts } from './actions/add-fonts';

export default function ngAddSetupProject(options: Schema): Rule {
  return chain([
    addStyles(options),
    addFonts(options),
    // externalSchematic('@angular/localize', 'ng-add', options.project ? { project: options.project } : {}),
  ]);
}
