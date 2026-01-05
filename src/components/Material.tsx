import React from 'react';
import { MdList as MdListElement } from '@material/web/list/list.js';
import { MdDivider as MdDividerElement } from '@material/web/divider/divider.js';
import { MdListItem as MdListItemElement } from '@material/web/list/list-item.js';
import { MdElevation as MdElevationElement } from '@material/web/elevation/elevation.js'
import { MdIcon as MdIconElement } from '@material/web/icon/icon.js'
import { MdElevatedButton as MdElevatedButtonElement } from '@material/web/button/elevated-button.js'

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