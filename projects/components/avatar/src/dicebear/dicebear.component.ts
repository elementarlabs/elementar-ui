import {
  booleanAttribute,
  Component,
  forwardRef,
  input, OnInit
} from '@angular/core';
import { AVATAR_ACCESSOR, AvatarPresenceIndicator } from '../types';
import { createAvatar } from '@dicebear/core';
import { identicon, initials } from '@dicebear/collection';
import { v7 as uuid } from 'uuid';
import { SafeHtmlPipe } from '@elementar-ui/components/core';

export interface Preset {
  style: any,
  options?: {
    scale?: number;
    backgroundColor?: string[];
    fontWeight?: number;
  }
}

const alreadyLoadedImages: string[] = [];
const presets: {[prop: string]: Preset} = {
  'identicon': {
    style: identicon,
    options: {
      scale: 55,
      backgroundColor: ['cbebf7', 'ebe1fc', 'd1f9db', 'f7e4e7', 'fce8d4', 'dcfcf9']
    }
  },
  'initials': {
    style: initials,
    options: {
      scale: 75,
      fontWeight: 500
    }
  }
};

@Component({
  selector: 'emr-dicebear,[emr-dicebear]',
  exportAs: 'emrDicebear',
  templateUrl: './dicebear.component.html',
  styleUrl: './dicebear.component.scss',
  providers: [
    {
      provide: AVATAR_ACCESSOR,
      useExisting: forwardRef(() => DicebearComponent),
      multi: true
    }
  ],
  imports: [
    SafeHtmlPipe,
  ],
  host: {
    'class': 'emr-avatar emr-dicebear',
    '[class.is-clickable]': 'clickable()',
    '[class.has-loaded-image]': 'image() && imageLoaded',
  }
})
export class DicebearComponent implements OnInit {
  image = input<string>('');
  clickable = input(false, {
    transform: booleanAttribute
  });
  key = input<any>();
  preset = input<string>('identicon');
  alt = input<string>();
  presenceIndicator = input<AvatarPresenceIndicator>(null);

  protected imageLoaded: boolean;
  protected svg = '';

  ngOnInit() {
    if (this.image()) {
      this.imageLoaded = alreadyLoadedImages.includes(<string>this.image());
    }

    const preset = presets[this.preset()];
    const avatar = createAvatar(preset.style, {
      seed: this.key() || '',
      ...preset.options
    });
    this.svg = avatar.toString().replace('viewboxMask', uuid());
  }

  onImageLoaded(): void {
    if (this.imageLoaded) {
      return;
    }

    alreadyLoadedImages.push(<string>this.image());
    this.imageLoaded = true;
  }
}
