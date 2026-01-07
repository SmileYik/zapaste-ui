import React from 'react';
import { MdList as MdListElement } from '@material/web/list/list.js';
import { MdDivider as MdDividerElement } from '@material/web/divider/divider.js';
import { MdListItem as MdListItemElement } from '@material/web/list/list-item.js';
import { MdElevation as MdElevationElement } from '@material/web/elevation/elevation.js'
import { MdIcon as MdIconElement } from '@material/web/icon/icon.js'
import { MdElevatedButton as MdElevatedButtonElement } from '@material/web/button/elevated-button.js'
import { MdTabs as MdTabsElement } from '@material/web/tabs/tabs.js'
import { MdPrimaryTab as MdPrimaryTabElement } from '@material/web/tabs/primary-tab.js'
import { MdSecondaryTab as MdSecondaryTabElement } from '@material/web/tabs/secondary-tab.js'
import { MdOutlinedButton as MdOutlinedButtonElement } from '@material/web/button/outlined-button.js';
import { MdFilledButton as MdFilledButtonElement } from '@material/web/button/filled-button.js';
import { MdFilledTonalButton as MdFilledTonalButtonElement } from '@material/web/button/filled-tonal-button.js';
import { MdTextButton as MdTextButtonElement } from '@material/web/button/text-button.js';
import { MdOutlinedTextField as MdOutlinedTextFieldElement } from '@material/web/textfield/outlined-text-field.js';
import { MdFilledTextField as MdFilledTextFieldElement } from '@material/web/textfield/filled-text-field.js';
import { MdIconButton as MdIconButtonElement } from '@material/web/iconbutton/icon-button.js';
import { MdFilledIconButton as MdFilledIconButtonElement } from '@material/web/iconbutton/filled-icon-button.js';
import { MdFilledTonalIconButton as MdFilledTonalIconButtonElement } from '@material/web/iconbutton/filled-tonal-icon-button.js';
import { MdOutlinedIconButton as MdOutlinedIconButtonElement } from '@material/web/iconbutton/outlined-icon-button.js';
import { MdDialog as MdDialogElement } from '@material/web/dialog/dialog.js';
import { MdSwitch as MdSwitchElement } from '@material/web/switch/switch.js';
import { MdOutlinedSelect as MdOutlinedSelectElement} from '@material/web/select/outlined-select.js';
import { MdSelectOption as MdSelectOptionElement} from '@material/web/select/select-option.js';

import { createComponent } from '@lit/react';

export const MdList = createComponent({
    tagName: 'md-list',
    elementClass: MdListElement,
    react: React,
});

export const MdListItem = createComponent({
    tagName: 'md-list-item',
    elementClass: MdListItemElement,
    react: React,
});

export const MdElevation = createComponent({
    tagName: 'md-elevation',
    elementClass: MdElevationElement,
    react: React,
});

export const MdDivider = createComponent({
    tagName: 'md-divider',
    elementClass: MdDividerElement,
    react: React,
});

export const MdIcon = createComponent({
    tagName: 'md-icon',
    elementClass: MdIconElement,
    react: React,
});

export const MdElevatedButton = createComponent({
    tagName: 'md-elevated-button',
    elementClass: MdElevatedButtonElement,
    react: React,
});

export const MdTabs = createComponent({
    tagName: 'md-tabs',
    elementClass: MdTabsElement,
    react: React,
});

export const MdPrimaryTab = createComponent({
    tagName: 'md-primary-tab',
    elementClass: MdPrimaryTabElement,
    react: React,
});

export const MdSecondaryTab = createComponent({
    tagName: 'md-secondary-tab',
    elementClass: MdSecondaryTabElement,
    react: React,
});

export const MdOutlinedButton = createComponent({
    tagName: 'md-outlined-button',
    elementClass: MdOutlinedButtonElement,
    react: React,
});

export const MdFilledButton = createComponent({
    tagName: 'md-filled-button',
    elementClass: MdFilledButtonElement,
    react: React,
});

export const MdFilledTonalButton = createComponent({
    tagName: 'md-filled-tonal-button',
    elementClass: MdFilledTonalButtonElement,
    react: React,
});

export const MdTextButton = createComponent({
    tagName: 'md-text-button',
    elementClass: MdTextButtonElement,
    react: React,
});

export const MdOutlinedTextField = createComponent({
    tagName: 'md-outlined-text-field',
    elementClass: MdOutlinedTextFieldElement,
    react: React
});

export const MdFilledTextField = createComponent({
    tagName: 'md-filled-text-field',
    elementClass: MdFilledTextFieldElement,
    react: React
});

export const MdIconButton = createComponent({
    tagName: 'md-icon-button',
    elementClass: MdIconButtonElement,
    react: React,
});

export const MdFilledIconButton = createComponent({
    tagName: 'md-filled-icon-button',
    elementClass: MdFilledIconButtonElement,
    react: React,
});

export const MdFilledTonalIconButton = createComponent({
    tagName: 'md-filled-tonal-icon-button',
    elementClass: MdFilledTonalIconButtonElement,
    react: React,
});

export const MdOutlinedIconButton = createComponent({
    tagName: 'md-outlined-icon-button',
    elementClass: MdOutlinedIconButtonElement,
    react: React,
});

export const MdDialog = createComponent({
    tagName: 'md-dialog',
    elementClass: MdDialogElement,
    react: React
});

export const MdSwitch = createComponent({
    tagName: 'md-switch',
    elementClass: MdSwitchElement,
    react: React
});

export const MdOutlinedSelect = createComponent({
    tagName: 'md-outlined-select',
    elementClass: MdOutlinedSelectElement,
    react: React
});

export const MdSelectOption = createComponent({
    tagName: 'md-select-option',
    elementClass: MdSelectOptionElement,
    react: React
});